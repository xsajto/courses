import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppLayout } from "@/components/AppLayout";
import CourseClient from "./CourseClient";
import { redirect } from "next/navigation";
import { getUserDailyStats, getDifficultKeys } from "@/app/actions/progress";

export default async function CoursePage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ section?: string }>
}) {
  const { slug } = await params;
  const { section: sectionOrder } = await searchParams;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const [course, dailyStats, difficultKeys] = await Promise.all([
    prisma.course.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            units: {
              orderBy: { order: "asc" },
              include: {
                lessons: {
                  orderBy: { order: "asc" }
                }
              }
            }
          }
        }
      }
    }),
    getUserDailyStats(),
    slug === 'deseti-prsty' ? getDifficultKeys('deseti-prsty') : Promise.resolve({}),
  ]);

  if (!course) redirect("/courses");

  const currentSection = sectionOrder
    ? course.sections.find(s => s.order === parseInt(sectionOrder)) || course.sections[0]
    : course.sections[0];

  const userProgress = await prisma.userLessonProgress.findMany({
    where: { userId: session.user.id },
    select: {
      lessonId: true,
      masteryLevel: true,
      bestAccuracy: true,
      bestWpm: true,
      attemptCount: true,
      completedAt: true,
    },
  });

  const lessonProgressMap: Record<string, {
    masteryLevel: number;
    bestAccuracy: number | null;
    bestWpm: number | null;
    attemptCount: number;
    completedAt: string;
  }> = {};
  for (const p of userProgress) {
    lessonProgressMap[p.lessonId] = {
      masteryLevel: p.masteryLevel,
      bestAccuracy: p.bestAccuracy,
      bestWpm: p.bestWpm,
      attemptCount: p.attemptCount,
      completedAt: p.completedAt.toISOString(),
    };
  }

  return (
    <AppLayout dailyStats={dailyStats}>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <CourseClient
            course={course}
            currentSection={currentSection}
            lessonProgressMap={lessonProgressMap}
            difficultKeys={difficultKeys}
          />
        </div>
      </div>
    </AppLayout>
  );
}
