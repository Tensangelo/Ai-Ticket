import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const seededCategories = [
  {
    name: 'Finance',
    description:
      'Invoices, payments, refunds, accounting, budgets, and financial disputes.',
  },
  {
    name: 'Legal',
    description:
      'Contracts, compliance, legal reviews, claims, and regulatory matters.',
  },
  {
    name: 'Procurement',
    description:
      'Suppliers, purchase orders, vendor onboarding, and sourcing requests.',
  },
  {
    name: 'Operations',
    description:
      'Day-to-day operations, logistics, internal processes, and service delivery.',
  },
  {
    name: 'Unclassified',
    description:
      'Use when the request does not fit Finance, Legal, Procurement, or Operations, or when automatic classification fails.',
  },
] as const;

const seededPriorities = [
  {
    name: 'Needed yesterday',
    description:
      'Work that is already overdue or blocking others and must be handled immediately.',
  },
  {
    name: 'High',
    description: 'Urgent operational impact that should be handled today.',
  },
  {
    name: 'Medium',
    description: 'Important but not blocking. Default when classification fails.',
  },
  {
    name: 'Low',
    description: 'Can wait without material operational impact.',
  },
] as const;

const seededUsers = [
  {
    fullName: 'Sarah Johnson',
    dateOfBirth: new Date('1990-03-12'),
    role: 'Finance Analyst',
    profession: 'Finance',
  },
  {
    fullName: 'Michael Brown',
    dateOfBirth: new Date('1988-07-04'),
    role: 'Legal Specialist',
    profession: 'Legal',
  },
  {
    fullName: 'Emily Davis',
    dateOfBirth: new Date('1985-11-21'),
    role: 'Operations Manager',
    profession: 'Operations',
  },
  {
    fullName: 'Daniel Martinez',
    dateOfBirth: new Date('1992-01-30'),
    role: 'Procurement Specialist',
    profession: 'Procurement',
  },
] as const;

async function seedCategories(): Promise<void> {
  for (const category of seededCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        active: true,
      },
      create: {
        name: category.name,
        description: category.description,
        active: true,
      },
    });
  }
}

async function seedPriorities(): Promise<void> {
  for (const priority of seededPriorities) {
    await prisma.priority.upsert({
      where: { name: priority.name },
      update: {
        description: priority.description,
        active: true,
      },
      create: {
        name: priority.name,
        description: priority.description,
        active: true,
      },
    });
  }
}

async function seedUsers(): Promise<void> {
  for (const user of seededUsers) {
    const existingUser = await prisma.user.findFirst({
      where: { fullName: user.fullName },
    });
    if (existingUser) {
      continue;
    }
    await prisma.user.create({ data: { ...user } });
  }
}

async function main(): Promise<void> {
  await seedCategories();
  await seedPriorities();
  await seedUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err: unknown) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
