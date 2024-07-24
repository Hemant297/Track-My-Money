'use server'

import prisma from '@/lib/prisma'
import {
  CreateTranscationSchema,
  CreateTranscationSchemaType
} from '@/schema/transcations'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function CreateTransaction (form: CreateTranscationSchemaType) {
  const parsedBody = CreateTranscationSchema.safeParse(form)

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message)
  }
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const { amount, category, date, description, type } = parsedBody.data
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category
    }
  })
  if (!categoryRow) {
    throw new Error('Category not Found!')
  }
  // Note: This $transaction , a table, and prisma.transactions are not the same
  await prisma.$transaction([
    //Create user transacations
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || '',
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon
      }
    }),
    // Updating the aggregate tables
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear()
        }
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0
        },
        income: {
          increment: type === 'income' ? amount : 0
        }
      }
    }),
    // Update year aggreate
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear()
        }
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0
        },
        income: {
          increment: type === 'income' ? amount : 0
        }
      }
    })
  ])
}
