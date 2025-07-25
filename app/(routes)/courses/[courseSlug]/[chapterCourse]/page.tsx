// page.tsx

import { getCourseBySlug } from "@/actions/getCourseBySlug";
import { getIsPurchasedCourse } from "@/actions/getPurchasedCourse";
import { getUserProgress } from "@/actions/getUserProgress";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChaptersCourse, InfoCourse } from "./components";

// ✅ Interfaz para los parámetros de ruta
interface PageProps {
  params: {
    courseSlug: string;
    chapterCourse: string;
  };
}

export default async function ChapterCoursePage({ params }: PageProps) {
  const { courseSlug, chapterCourse } = params;

  const user = await currentUser();
  if (!user) return redirect("/");

  const infoCourse = await getCourseBySlug(courseSlug);
  const userProgress = await getUserProgress();

  if (!userProgress) return redirect(`/course/${courseSlug}`);
  if (!infoCourse) return redirect("/");

  const isPurchasedCourse = await getIsPurchasedCourse(user.id, infoCourse.id);

  const videoUrl = infoCourse.chapters.find((chapter) => chapter.id === chapterCourse)?.videoUrl;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-[65%_1fr] gap-4">
        <InfoCourse 
          infoCourse={infoCourse}
          chapterCourseId={chapterCourse}
          userProgress={userProgress}
          purchaseCourse={isPurchasedCourse}
          videoUrl={videoUrl}
        />
        <ChaptersCourse
          chapters={infoCourse.chapters}
          chapterCourse={chapterCourse}
          courseSlug={courseSlug}
          userProgress={userProgress}
        />
      </div>
    </div>
  );
}
