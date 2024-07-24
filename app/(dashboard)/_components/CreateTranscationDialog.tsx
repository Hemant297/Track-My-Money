"use client";
import { DialogHeader } from "@/components/ui/dialog";
import { TranscationType } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
  
} from "@/components/ui/dialog";
import { ReactNode, useCallback, useState } from "react";
import {
  CreateTranscationSchema,
  CreateTranscationSchemaType,
} from "@/schema/transcations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Button } from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {format} from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";
interface Props {
  trigger: ReactNode;
  type: TranscationType;
}
function CreateTranscationDialog({ trigger, type }: Props) {
  const form = useForm<CreateTranscationSchemaType>({
    resolver: zodResolver(CreateTranscationSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );
const [open, setOpen] = useState(false)
const queryClient = useQueryClient();
const {mutate, isPending} = useMutation({
  mutationFn: CreateTransaction,
  onSuccess: ()=> {
    toast.success("Transaction created Successfully 🥳!!", {
      id: "create-transaction"
    });
    form.reset({
      type,
      description: "",
      amount: 0,
      date: new Date(),
      category: ""

    });
    // after creating a transaction, we need to invalidate the overview query which will refetch data in the homepage
    queryClient.invalidateQueries({
      queryKey: ["overview"]
    });
    setOpen((prev)=> !prev)
  }
})

const onSubmit = useCallback((values: CreateTranscationSchemaType)=>{
  toast.loading("Creating Transaction.... 🤔", {id: "create-transaction"})
  mutate({
    ...values,
    date: DateToUTCDate(values.date),

  })
}, [mutate])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            transcation
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Transcation Description (Optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transcation Amount (Required){" "}
                  </FormDescription>
                </FormItem>
              )}
            />
           {/* //Transcations: {form.watch("category")} */}
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transcation!
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                        <Button variant={"outline"} className={cn("w-[200px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP"): (<span>Pick a Date</span>)
                          }
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                        </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                         mode="single" 
                        selected={field.value}
                        onSelect={(value: any)=>{
                          console.log("@@CALENDAR", value)
                          if(!value) return;
                          field.onChange(value);
                        }}
                        className="rounded-md border"
                        initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date for this transaction!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CreateTranscationDialog;
