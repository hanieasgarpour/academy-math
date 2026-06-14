const { PrismaClient, Role, CourseLevel } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user (upsert = safe to run multiple times)
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@erfan-math.ir" },
    update: {},
    create: {
      email: "admin@erfan-math.ir",
      name: "ارفعان",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create student user
  const studentPassword = await bcrypt.hash("student1234", 10);
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      name: "دانش‌آموز",
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  // Only seed courses if table is empty
  const courseCount = await prisma.course.count();
  if (courseCount > 0) {
    console.log("Courses already exist, skipping seed.");
    await prisma.$disconnect();
    return;
  }

  const coursesData = [
    {
      title: "ریاضی پایه هفتم",
      description: "آموزش کامل ریاضی پایه هفتم با حل تمرین‌های متنوع و آمادگی برای آزمون‌ها",
      price: 1500000,
      level: CourseLevel.BEGINNER,
      duration: "۳۰ ساعت",
      published: true,
    },
    {
      title: "ریاضی پایه هشتم",
      description: "آموزش جامع ریاضی پایه هشتم شامل جبر، هندسه و آمار و احتمال",
      price: 1800000,
      level: CourseLevel.BEGINNER,
      duration: "۳۵ ساعت",
      published: true,
    },
    {
      title: "ریاضی پایه نهم",
      description: "آمادگی کامل برای ریاضی نهم و آزمون نهایی با تمرین‌های طبقه‌بندی شده",
      price: 2000000,
      level: CourseLevel.INTERMEDIATE,
      duration: "۴۰ ساعت",
      published: true,
    },
    {
      title: "جبر و احتمال دهم",
      description: "آموزش جبر و احتمال پایه دهم ریاضی با رویکرد حل مسئله و تحلیلی",
      price: 2500000,
      level: CourseLevel.INTERMEDIATE,
      duration: "۴۵ ساعت",
      published: true,
    },
    {
      title: "هندسه تحلیلی دهم",
      description: "آموزش هندسه تحلیلی پایه دهم با تمرین‌های متنوع و حل تشریحی",
      price: 2200000,
      level: CourseLevel.INTERMEDIATE,
      duration: "۳۸ ساعت",
      published: true,
    },
    {
      title: "حسابان یازدهم",
      description: "آموزش کامل حسابان یازدهم شامل حد و پیوستگی، مشتق و کاربرد آن",
      price: 3000000,
      level: CourseLevel.ADVANCED,
      duration: "۵۰ ساعت",
      published: true,
    },
    {
      title: "هندسه یازدهم",
      description: "آموزش هندسه یازدهم با حل تمرین‌های کنکور و آزمون‌های سال‌های گذشته",
      price: 2800000,
      level: CourseLevel.ADVANCED,
      duration: "۴۲ ساعت",
      published: true,
    },
    {
      title: "ریاضیات گسسته دوازدهم",
      description: "آموزش ریاضیات گسسته دوازدهم با تمرکز بر منطق، نظریه مجموعه‌ها و گراف",
      price: 0,
      level: CourseLevel.ADVANCED,
      duration: "۳۵ ساعت",
      published: false,
    },
  ];

  const courses = [];
  for (const data of coursesData) {
    const course = await prisma.course.create({ data });
    courses.push(course);
  }

  // Create lessons for each course
  for (const course of courses) {
    const lessonCount = course.level === CourseLevel.BEGINNER ? 5 : course.level === CourseLevel.INTERMEDIATE ? 7 : 8;
    const prefixes = ["فصل", "بخش"];
    const prefix = prefixes[courses.indexOf(course) % 2];

    for (let i = 1; i <= lessonCount; i++) {
      const lesson = await prisma.lesson.create({
        data: {
          title: prefix + " " + i + ": درس " + i + " - " + course.title,
          content: "محتوای آموزشی " + prefix + " " + i + " از دوره " + course.title + ". در این درس مفاهیم پایه و تمرین‌های مرتبط ارائه می‌شود.",
          videoUrl: i <= 2 ? "https://example.com/videos/" + course.id + "/lesson-" + i + ".mp4" : null,
          order: i,
          courseId: course.id,
        },
      });

      // Add files for first 2 lessons of each course
      if (i <= 2) {
        await prisma.file.create({
          data: {
            name: "خلاصه-" + prefix + "-" + i + ".pdf",
            url: "/files/" + course.id + "/summary-" + i + ".pdf",
            fileType: "application/pdf",
            fileSize: 1024 * (500 + i * 100),
            lessonId: lesson.id,
          },
        });
        await prisma.file.create({
          data: {
            name: "تمرین-" + prefix + "-" + i + ".pdf",
            url: "/files/" + course.id + "/exercise-" + i + ".pdf",
            fileType: "application/pdf",
            fileSize: 1024 * (300 + i * 50),
            lessonId: lesson.id,
          },
        });
      }
    }
  }

  // Create enrollment for student in first course
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: courses[0].id,
    },
  });

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      userId: student.id,
      courseId: courses[0].id,
      amount: courses[0].price,
      status: "PAID",
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      authority: "MOCK_SEED_001",
      refId: "REF_SEED_001",
      status: "SUCCESS",
      cardPan: "123456****1234",
    },
  });

  console.log("Seed completed successfully!");
  console.log("Admin: admin@erfan-math.ir / admin1234");
  console.log("Student: student@example.com / student1234");
  console.log("Created " + courses.length + " courses");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e.message);
    await prisma.$disconnect();
    // Don't exit with error - let the app start anyway
  });
