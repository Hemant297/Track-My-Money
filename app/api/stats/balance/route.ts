import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request){
    const user = await currentUser();
    if(!user){
        redirect("/sign-in")
    }
    // will return total amount and total income
    const {searchParams} = new URL(request.url);
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const queryParams = OverviewQuerySchema.safeParse({from, to});

    if(!queryParams.success){
        return Response.json(queryParams.error.message, {status: 400})
    }
    const status = await getBalanceStats(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    )
    return Response.json(status)
}
export type GetBalancedStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>
async function getBalanceStats(userId: string, from: Date, to: Date) {
    // Perform a groupBy operation on the 'transaction' table
    const totals = await prisma.transaction.groupBy({
        by: ["type"], // Group by the 'type' column (e.g., 'expense' or 'income')
        where: {
            userId, // Filter by userId
            date: {
                gte: from, // Filter for transactions with a date greater than or equal to 'from'
                lte: to   // Filter for transactions with a date less than or equal to 'to'
            }
        },
        _sum: {
            amount: true, // Sum the 'amount' column for each group
        }
    });

    // Return an object with the total expense and income amounts
    return {
        expense: totals.find(t => t.type == "expense")?._sum.amount || 0,
        income: totals.find(t => t.type === "income")?._sum.amount || 0,
    };
}
