import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaNeon(pool as any);

const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.task.deleteMany();
  await prisma.post.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@worldautomate.com",
      emailVerified: true,
      role: "ADMIN",
      bio: "Platform administrator",
    },
  });

  const alice = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
      emailVerified: true,
      role: "USER",
      bio: "Full-stack developer",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
      emailVerified: true,
      role: "USER",
      bio: "Product designer",
    },
  });

  console.log(`  ✅ Created ${3} users`);

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Getting Started with AI Agents",
        content:
          "Learn how to build intelligent AI agents using the Vercel AI SDK and Google Gemini model. This guide covers tool calling, streaming, and structured output.",
        published: true,
        authorId: admin.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Building Scalable Microservices",
        content:
          "A deep dive into building scalable microservices with Express, Prisma, and Neon PostgreSQL in a Turborepo monorepo setup.",
        published: true,
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Design Systems for SaaS",
        content:
          "How to create a cohesive design system that scales across multiple applications in your SaaS platform.",
        published: false,
        authorId: bob.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Automating Workflows with AI",
        content:
          "Discover techniques for automating repetitive business workflows using large language models and custom tools.",
        published: true,
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Database Migration Strategies",
        content:
          "Best practices for managing database migrations in production environments with zero downtime using Prisma.",
        published: true,
        authorId: admin.id,
      },
    }),
  ]);

  console.log(`  ✅ Created ${posts.length} posts`);

  // Create tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: "Set up CI/CD pipeline",
        description: "Configure GitHub Actions for automated testing and deployment",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date("2026-05-15"),
        assigneeId: alice.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement user analytics dashboard",
        description: "Build charts and metrics for user engagement tracking",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: new Date("2026-05-20"),
        assigneeId: bob.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Add rate limiting to API",
        description: "Implement rate limiting middleware for all public endpoints",
        status: "TODO",
        priority: "HIGH",
        assigneeId: alice.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Write API documentation",
        description: "Document all REST endpoints with request/response examples",
        status: "DONE",
        priority: "MEDIUM",
        assigneeId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Security audit",
        description: "Review authentication flows and fix vulnerabilities",
        status: "TODO",
        priority: "URGENT",
        dueDate: new Date("2026-05-10"),
        assigneeId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Optimize database queries",
        description: "Profile and optimize slow queries, add missing indexes",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assigneeId: alice.id,
      },
    }),
  ]);

  console.log(`  ✅ Created ${tasks.length} tasks`);

  // Create AI chat messages (history sample)
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        role: "USER",
        content: "How do I set up a new project in the platform?",
        userId: alice.id,
        sessionId: "session-demo-001",
      },
    }),
    prisma.message.create({
      data: {
        role: "ASSISTANT",
        content:
          'To set up a new project, navigate to the Dashboard and click "Create New Project". Fill in the project name, description, and select a template. You can also import from GitHub.',
        userId: alice.id,
        sessionId: "session-demo-001",
      },
    }),
    prisma.message.create({
      data: {
        role: "USER",
        content: "What AI models are available for my workflows?",
        userId: bob.id,
        sessionId: "session-demo-002",
      },
    }),
    prisma.message.create({
      data: {
        role: "ASSISTANT",
        content:
          "Currently, we support Google Gemini models through the AI SDK. You can use gemini-2.5-flash for fast responses or gemini-2.5-pro for more complex reasoning tasks.",
        userId: bob.id,
        sessionId: "session-demo-002",
      },
    }),
  ]);

  console.log(`  ✅ Created ${messages.length} messages`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }) 
