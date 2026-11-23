import fs from "fs";
import path from "path";
import { prisma, checkDatabaseConnection } from "./prisma";

export interface UserSession {
  id: string;
  name: string;
  email: string;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
}

interface AuthStore {
  users: StoredUser[];
  savedModels: Record<string, string[]>;
}

const STORE_PATH = path.join(process.cwd(), "src", "data", "users-store.json");

function loadStore(): AuthStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read users-store.json, using default:", err);
  }
  return {
    users: [
      {
        id: "usr_demo",
        name: "Demo Engineer",
        email: "demo@oneatlas.dev",
        password: "password123",
      },
    ],
    savedModels: {
      usr_demo: ["gpt-4o", "claude-3-5-sonnet", "deepseek-r1"],
    },
  };
}

function saveStore(store: AuthStore) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write users-store.json:", err);
  }
}

export async function registerUser(
  name: string,
  email: string,
  password?: string
): Promise<UserSession> {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanName = name.trim();
  const store = loadStore();

  const isPostgres = await checkDatabaseConnection();
  if (isPostgres) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existing) {
        throw new Error("An account with this email already exists. Please Sign In instead.");
      }
      const user = await prisma.user.create({
        data: {
          name: cleanName,
          email: normalizedEmail,
          password: password || null,
        },
      });
      return { id: user.id, name: user.name || cleanName, email: user.email };
    } catch (e: any) {
      if (e.message?.includes("already exists")) throw e;
      console.warn("Postgres registerUser fallback:", e);
    }
  }

  // Local JSON store check
  const existingLocal = store.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (existingLocal) {
    throw new Error("An account with this email already exists. Please Sign In instead.");
  }

  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newUser: StoredUser = {
    id,
    name: cleanName,
    email: normalizedEmail,
    password: password || "password123",
  };

  store.users.push(newUser);
  store.savedModels[id] = ["gpt-4o", "gemini-2-0-flash"];
  saveStore(store);

  return { id: newUser.id, name: newUser.name, email: newUser.email };
}

export async function loginUser(
  email: string,
  password?: string
): Promise<UserSession> {
  const normalizedEmail = email.toLowerCase().trim();
  const store = loadStore();

  const isPostgres = await checkDatabaseConnection();
  if (isPostgres) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (!user) {
        throw new Error("No account found with this email. Please create an account first.");
      }
      if (user.password && password && user.password !== password) {
        throw new Error("Incorrect password. Please verify and try again.");
      }
      return { id: user.id, name: user.name || "AI Engineer", email: user.email };
    } catch (e: any) {
      if (e.message?.includes("No account found") || e.message?.includes("Incorrect password")) {
        throw e;
      }
      console.warn("Postgres loginUser fallback:", e);
    }
  }

  // Local JSON store verification
  const localUser = store.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (!localUser) {
    throw new Error("No account found with this email. Please create an account first.");
  }

  if (localUser.password && password && localUser.password !== password) {
    throw new Error("Incorrect password. Please verify and try again.");
  }

  return { id: localUser.id, name: localUser.name, email: localUser.email };
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

  const store = loadStore();
  return store.savedModels[userId] || [];
}

export async function toggleSavedModel(
  userId: string,
  modelSlug: string
): Promise<{ isSaved: boolean; count: number }> {
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

  const store = loadStore();
  if (!store.savedModels[userId]) {
    store.savedModels[userId] = [];
  }

  const list = store.savedModels[userId];
  const idx = list.indexOf(modelSlug);
  let isSaved = false;

  if (idx >= 0) {
    list.splice(idx, 1);
    isSaved = false;
  } else {
    list.push(modelSlug);
    isSaved = true;
  }

  saveStore(store);
  return { isSaved, count: list.length };
}
