import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Najdeme první kurz, aby "LEARN" tlačítko fungovalo
  const firstCourse = await prisma.course.findFirst();
  
  if (firstCourse) {
    redirect(`/course/${firstCourse.slug}`);
  }

  // Pokud nejsou žádné kurzy, jdeme na seznam
  redirect("/courses");
}
