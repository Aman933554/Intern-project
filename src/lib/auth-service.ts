import { prisma, checkDatabaseConnection } from "./prisma";
import { getModelBySlug } from "./db-service";
import { ModelSummary } from "@/types";

export interface UserSession {
  id: string;
  name: string;
  email: string;
}

// In-memory user and saved model cache for fallback reliability
const memoryUsers: Map<string, { id: string; name: string; email: string; password?: string }> = new Map([
  [
    "demo@oneatlas.dev",
    {
      id: "usr_demo",
      name: "Demo Engineer",
      email: "demo@oneatlas.dev",
      password: "password123",
    },
  ],
]);

const memorySavedModels: Map<string, Set<string>> = new Map([
  ["usr_demo", new Set(["gpt-4o", "claude-3-5-sonnet", "deepseek-r1"])],
]);

export async function registerUser(name: string, email: string, password?: string): Promise<UserSession> {
  const normalizedEmail = email.toLowerCase().trim();
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        throw new Error("An account with this email already exists");
      }
      const user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: password || null,
        },
      });
      return { id: user.id, name: user.name || name, email: user.email };
    } catch (e: any) {
      if (e.message?.includes("already exists")) throw e;
      console.warn("Postgres registerUser fallback:", e);
    }
  }

  if (memoryUsers.has(normalizedEmail)) {
    throw new Error("An account with this email already exists");
  }

  const id = `usr_${Date.now()}`;
  const newUser = { id, name, email: normalizedEmail, password };
  memoryUsers.set(normalizedEmail, newUser);
  memorySavedModels.set(id, new Set());

  return { id, name, email: normalizedEmail };
}

export async function loginUser(email: string, password?: string): Promise<UserSession> {
  const normalizedEmail = email.toLowerCase().trim();
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        // Auto-provision on first sign-in so user never encounters friction
        const rawName = normalizedEmail.split("@")[0].replace(/[._]/g, " ");
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: formattedName,
            password: password || null,
          },
        });
      }
      return { id: user.id, name: user.name || "AI Engineer", email: user.email };
    } catch (e: any) {
      console.warn("Postgres loginUser fallback:", e);
    }
  }

  let user = memoryUsers.get(normalizedEmail);
  if (!user) {
    const rawName = normalizedEmail.split("@")[0].replace(/[._]/g, " ");
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const id = `usr_${Date.now()}`;
    user = { id, name, email: normalizedEmail, password };
    memoryUsers.set(normalizedEmail, user);
    memorySavedModels.set(id, new Set(["gpt-4o", "gemini-2-0-flash", "deepseek-r1"]));
  }

  return { id: user.id, name: user.name, email: user.email };
}

export async function getSavedModelSlugs(userId: string): Promise<string[]> {
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const saved = await prisma.savedModel.findMany({
        where: { userId },
        include: { model: true },
      });
      return saved.map((s) => s.model.slug);
    } catch (e) {
      console.warn("Postgres getSavedModelSlugs fallback:", e);
    }
  }

  const set = memorySavedModels.get(userId);
  return set ? Array.from(set) : [];
}

export async function toggleSavedModel(userId: string, modelSlug: string): Promise<{ isSaved: boolean; count: number }> {
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const model = await prisma.model.findUnique({ where: { slug: modelSlug } });
      if (model) {
        const existing = await prisma.savedModel.findUnique({
          where: {
            userId_modelId: {
              userId,
              modelId: model.id,
            },
          },
        });

        if (existing) {
          await prisma.savedModel.delete({ where: { id: existing.id } });
          const total = await prisma.savedModel.count({ where: { userId } });
          return { isSaved: false, count: total };
        } else {
          await prisma.savedModel.create({
            data: {
              userId,
              modelId: model.id,
            },
          });
          const total = await prisma.savedModel.count({ where: { userId } });
          return { isSaved: true, count: total };
        }
      }
    } catch (e) {
      console.warn("Postgres toggleSavedModel fallback:", e);
    }
  }

  let set = memorySavedModels.get(userId);
  if (!set) {
    set = new Set();
    memorySavedModels.set(userId, set);
  }

  let isSaved = false;
  if (set.has(modelSlug)) {
    set.delete(modelSlug);
    isSaved = false;
  } else {
    set.add(modelSlug);
    isSaved = true;
  }

  return { isSaved, count: set.size };
}
