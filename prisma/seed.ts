import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "AI & Machine Learning", slug: "ai-machine-learning", description: "Artificial intelligence and ML tools", icon: "🤖", color: "#8B5CF6", displayOrder: 1 },
  { name: "Developer Tools", slug: "developer-tools", description: "Tools for software developers", icon: "🛠️", color: "#3B82F6", displayOrder: 2 },
  { name: "Productivity", slug: "productivity", description: "Apps to boost your productivity", icon: "⚡", color: "#10B981", displayOrder: 3 },
  { name: "Marketing", slug: "marketing", description: "Marketing and growth tools", icon: "📈", color: "#F59E0B", displayOrder: 4 },
  { name: "Design", slug: "design", description: "Design and creative tools", icon: "🎨", color: "#EC4899", displayOrder: 5 },
  { name: "Finance", slug: "finance", description: "Financial tools and services", icon: "💰", color: "#14B8A6", displayOrder: 6 },
  { name: "Education", slug: "education", description: "Learning and education platforms", icon: "📚", color: "#6366F1", displayOrder: 7 },
  { name: "Health & Fitness", slug: "health-fitness", description: "Health and wellness apps", icon: "🏃", color: "#EF4444", displayOrder: 8 },
  { name: "E-commerce", slug: "ecommerce", description: "Online selling and commerce", icon: "🛒", color: "#F97316", displayOrder: 9 },
  { name: "Communication", slug: "communication", description: "Communication and collaboration", icon: "💬", color: "#06B6D4", displayOrder: 10 },
  { name: "Analytics", slug: "analytics", description: "Data and analytics tools", icon: "📊", color: "#8B5CF6", displayOrder: 11 },
  { name: "No-Code", slug: "no-code", description: "Build without coding", icon: "🔧", color: "#84CC16", displayOrder: 12 },
  { name: "Security", slug: "security", description: "Security and privacy tools", icon: "🔒", color: "#64748B", displayOrder: 13 },
  { name: "Open Source", slug: "open-source", description: "Open source projects", icon: "🌐", color: "#22C55E", displayOrder: 14 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Seed categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log(`✅ Seeded ${categories.length} categories`);

  // Create admin user
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@builddeck.io" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@builddeck.io",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin user");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
