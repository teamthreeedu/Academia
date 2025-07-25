import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  const { userId } = await auth();
  const { courseId, chapterId } = params;
  const { isCompleted } = await req.json();

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        courseId: true,
      },
    });

    if (!chapter || chapter.courseId !== courseId) {
      return new NextResponse("Acceso denegado al capítulo", { status: 404 });
    }

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[COURSE_PROGRESS_UPDATE]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}