import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { getUserDailyStats } from "@/app/actions/progress";

export default async function SectionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  const dailyStats = await getUserDailyStats();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          units: {
            include: { lessons: true }
          }
        }
      }
    }
  });

  if (!course) redirect("/courses");

  const userProgress = await prisma.userLessonProgress.findMany({
    where: { userId: session.user.id },
  });

  const completedLessonIds = userProgress.map(p => p.lessonId);

  return (
    <AppLayout dailyStats={dailyStats}>
      <main className="p-12 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <Link href={`/course/${slug}`} className="text-duo-gray-dark hover:text-duo-text font-black uppercase text-sm transition-colors">Zpět na cestu</Link>
            <h1 className="text-3xl font-black text-duo-text">Sekce kurzu {course.title}</h1>
        </div>

        <div className="flex flex-col gap-4">
          {course.sections.map((section, idx) => {
            const allLessons = section.units.flatMap(u => u.lessons);
            const completedInRaw = allLessons.filter(l => completedLessonIds.includes(l.id));
            const progress = (completedInRaw.length / allLessons.length) * 100;
            
            const prevSection = course.sections[idx - 1];
            const prevSectionLessons = prevSection?.units.flatMap(u => u.lessons) || [];
            const isPrevCompleted = prevSection ? prevSectionLessons.every(l => completedLessonIds.includes(l.id)) : true;
            const isUnlocked = idx === 0 || isPrevCompleted;

            const content = (
              <>
                <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl shadow-[0_4px_0_rgba(0,0,0,0.1)] ${
                    isUnlocked ? "bg-duo-blue text-white" : "bg-duo-gray text-duo-gray-dark shadow-none"
                }`}>
                  {idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-duo-text mb-1 truncate">{section.title}</h2>
                  <div className="flex items-center gap-4">
                    <div className="progress-bar flex-1">
                      <div style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-black text-duo-gray-dark uppercase whitespace-nowrap">{completedInRaw.length} / {allLessons.length} lekcí</span>
                  </div>
                </div>

                {!isUnlocked ? (
                  <Lock size={24} className="text-duo-gray-dark flex-shrink-0" />
                ) : (
                  <ArrowRight size={24} className="text-duo-blue opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                )}
              </>
            );

            if (isUnlocked) {
              return (
                <Link 
                  key={section.id}
                  href={`/course/${slug}?section=${section.order}`}
                  className="group border-2 border-duo-gray rounded-3xl p-6 flex items-center gap-6 hover:bg-duo-gray/5 transition-all active:translate-y-1"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div 
                key={section.id}
                className="border-2 border-duo-gray rounded-3xl p-6 flex items-center gap-6 opacity-50 bg-duo-gray/10 cursor-not-allowed"
              >
                {content}
              </div>
            );
          })}
        </div>
      </main>
    </AppLayout>
  );
}
