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
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
interface ImageFormProps {
  initialData: Course;
}
const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

const ImageForm = ({ initialData }: ImageFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const toggleEdit = () => setIsEditting((current) => !current);
  const { id, imageUrl } = initialData;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: imageUrl || "" },
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
        Course Image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditting ? (
            <>cancel</>
          ) : (
            <>
              {imageUrl ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit image
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Image
                </>
              )}
            </>
          )}
        </Button>
      </div>
      {!isEditting ? (
        !imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              src={imageUrl}
              fill
              className="object-cover rounded-md "
            />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
