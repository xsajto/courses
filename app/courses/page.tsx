import { prisma } from "@/lib/prisma";
import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { Book, Calculator, Languages } from "lucide-react";
import { getUserDailyStats } from "@/app/actions/progress";

export default async function CoursesPage() {
  const dailyStats = await getUserDailyStats();
  const courses = await prisma.course.findMany({
    include: {
      sections: {
        select: { id: true }
      }
    }
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "TYPING": return <Book size={48} className="text-duo-green" />;
      case "MATH": return <Calculator size={48} className="text-duo-blue" />;
      default: return <Languages size={48} className="text-duo-purple" />;
    }
  };

  return (
    <AppLayout dailyStats={dailyStats}>
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-duo-text mb-8">Co se chceš dnes naučit?</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Link 
              key={course.id} 
              href={`/course/${course.slug}`}
              className="border-2 border-duo-gray rounded-3xl p-8 flex items-center gap-6 hover:bg-duo-gray/10 transition-colors group"
            >
              <div className="w-24 h-24 bg-duo-gray/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(course.type)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-duo-text mb-1">{course.title}</h2>
                <p className="text-duo-gray-dark font-bold text-sm mb-4">{course.description}</p>
                <div className="flex items-center gap-2">
                  <div className="progress-bar flex-1">
                    <div className="w-[10%]" />
                  </div>
                  <span className="text-xs font-black text-duo-gray-dark uppercase">{course.sections.length} Sekce</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
