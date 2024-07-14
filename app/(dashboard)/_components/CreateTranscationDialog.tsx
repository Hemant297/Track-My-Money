"use client"
import { DialogHeader } from "@/components/ui/dialog";
import { TranscationType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode} from "react"
import { CreateTranscationSchema, CreateTranscationSchemaType} from "@/schema/transcations";
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm} from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
interface Props{
    trigger: ReactNode;
    type: TranscationType;

}
function CreateTranscationDialog({trigger, type}: Props){
    const form = useForm<CreateTranscationSchemaType>({
        resolver: zodResolver(CreateTranscationSchema),
        defaultValues: {
            type,
            date: new Date()
        }
    })
    return <Dialog>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create a new <span className={cn("m-1", type === "income"? "text-emerald-500": "text-red-500")}>{type}</span> transcations </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field })=>(
                        <FormItem>
                            <FormLabel>
                                Description
                            </FormLabel>
                        <FormControl><Input defaultValue={""} {...field}/></FormControl>
                        <FormDescription>Transcation Description (Optional) </FormDescription>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="amount"
                    render={({ field })=>(
                        <FormItem>
                            <FormLabel>
                                Amount
                            </FormLabel>
                        <FormControl><Input defaultValue={0} type="number" {...field}/></FormControl>
                        <FormDescription>Transcation Amount (Required) </FormDescription>
                        </FormItem>
                    )}
                    />
                    <div className="flex items-center justify-between gap-2">
                        <FormField
                    control={form.control}
                    name="category"
                    render={({ field })=>(
                        <FormItem>
                            <FormLabel>
                                Category
                            </FormLabel>
                        <FormControl><Input defaultValue={""} {...field}/></FormControl>
                        <FormDescription>Select a category for this transcation! </FormDescription>
                        </FormItem>
                    )}
                    />
                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}
export default CreateTranscationDialog