import { prisma } from "@/lib/prisma";
import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { Book, Calculator, Languages, ChevronRight } from "lucide-react";
import { getUserDailyStats } from "@/app/actions/progress";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [dailyStats, courses, userProgress] = await Promise.all([
    getUserDailyStats(),
    prisma.course.findMany({
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            units: {
              include: { lessons: { select: { id: true } } }
            }
          }
        }
      }
    }),
    prisma.userLessonProgress.findMany({
      where: { userId: session.user.id },
      select: { lessonId: true }
    })
  ]);

  const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

  const getIcon = (type: string) => {
    switch (type) {
      case "TYPING": return <Book size={40} />;
      case "MATH": return <Calculator size={40} />;
      default: return <Languages size={40} />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case "TYPING": return "text-indigo-600 bg-indigo-50 border-indigo-100";
      case "MATH": return "text-cyan-600 bg-cyan-50 border-cyan-100";
      default: return "text-amber-600 bg-amber-50 border-amber-100";
    }
  };

  return (
    <AppLayout dailyStats={dailyStats}>
      <main className="py-16 px-6 max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-black text-duo-text tracking-tight mb-2">Kurzy</h1>
          <p className="text-duo-gray-dark font-bold text-lg">Vyber si svou cestu k mistrovství.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => {
            const allLessons = course.sections.flatMap(s => s.units.flatMap(u => u.lessons));
            const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;
            const progress = allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0;
            const colors = getColors(course.type);

            return (
              <Link 
                key={course.id} 
                href={`/course/${course.slug}`}
                className="group relative bg-white border-2 border-duo-gray rounded-[2.5rem] p-10 flex flex-col gap-8 transition-all hover:border-duo-green hover:shadow-[0_8px_0_var(--color-duo-green-dark)] active:translate-y-1 active:shadow-none"
              >
                <div className="flex justify-between items-start">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 border-2 ${colors}`}>
                    {getIcon(course.type)}
                  </div>
                  <div className="p-3 bg-duo-gray/20 rounded-2xl text-duo-gray-dark opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-black text-duo-text mb-3">{course.title}</h2>
                  <p className="text-duo-gray-dark font-bold leading-relaxed mb-8">{course.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-duo-gray-dark">
                      <span>Progres</span>
                      <span>{completedCount} / {allLessons.length} lekcí</span>
                    </div>
                    <div className="progress-bar w-full">
                      <div style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                {progress === 100 && (
                  <div className="absolute top-6 right-6 bg-amber-400 text-white p-2 rounded-xl shadow-lg transform rotate-12">
                    <Book size={20} fill="currentColor" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </AppLayout>
  );
}
