"use client";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
interface DescriptionFormProps {
  initialData: Course;
}
const formSchema = z.object({
  description: z.string().min(50, { message: "Description is required" }),
});

const DescriptionForm = ({ initialData }: DescriptionFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const toggleEdit = () => setIsEditting((current) => !current);
  const { id, description } = initialData;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: description || "" },
  });
  const router = useRouter();
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${id}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded p-4">
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditting ? (
            <>cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {description ? "Edit description" : "Add description"}
            </>
          )}
        </Button>
      </div>
      {!isEditting ? (
        <p className={cn("text-sm mt-2", !description && "text-slate-500")}>
          {description || "No description"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g This course is teaches teaches advanced concepts of web development"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DescriptionForm;
