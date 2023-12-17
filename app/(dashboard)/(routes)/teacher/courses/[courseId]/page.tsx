import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";

import { notFound } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import { storage } from "@/lib/mega";

const CoursePage = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  await storage.ready;
  const file = storage.root.children?.find((file) => file.name === "images");
  if (!file) {
    const imageFolder = await storage.mkdir("images");
    console.log("The file was uploaded!", imageFolder.upload);
  }

  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course
    .findUnique({
      where: {
        id: courseId,
      },
    })
    .catch(() => notFound());
  if (!course) {
    return notFound();
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm  text-slate-700">
            Completed all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customise your course</h2>
          </div>
          <TitleForm initialData={course} />
          <DescriptionForm initialData={course} />
          <ImageForm initialData={course} />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
