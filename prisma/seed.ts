import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { courses } from "../resources/index";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      currentStreak: 0,
      longestStreak: 0,
      dailyXpGoal: 20,
      dailyLessonGoal: 3,
    },
  });

  // Clear all courses to avoid stale data
  await prisma.course.deleteMany();

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {
        title: courseData.title,
        description: courseData.description,
        type: courseData.type,
      },
      create: {
        slug: courseData.slug,
        title: courseData.title,
        description: courseData.description,
        type: courseData.type,
      },
    });

    // Delete existing sections (cascade deletes units, lessons, progress)
    await prisma.section.deleteMany({ where: { courseId: course.id } });

    for (const sectionData of courseData.sections) {
      const section = await prisma.section.create({
        data: {
          title: sectionData.title,
          order: sectionData.order,
          courseId: course.id,
        },
      });

      for (const unitData of sectionData.units) {
        const unit = await prisma.unit.create({
          data: {
            title: unitData.title,
            order: unitData.order,
            sectionId: section.id,
          },
        });

        for (const lessonData of unitData.lessons) {
          await prisma.lesson.create({
            data: {
              title: lessonData.title,
              slug: lessonData.slug,
              order: lessonData.order,
              isReview: lessonData.isReview,
              xp: lessonData.xp,
              content: JSON.stringify(lessonData.content),
              criteria: JSON.stringify(lessonData.criteria),
              unitId: unit.id,
            },
          });
        }
      }
    }
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
