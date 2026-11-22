import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(pricePerMillion: number | null | undefined): string {
  if (pricePerMillion === null || pricePerMillion === undefined) return "N/A";
  if (pricePerMillion === 0) return "Free";
  if (pricePerMillion < 0.1) {
    return `$${pricePerMillion.toFixed(3)} / 1M`;
  }
  return `$${pricePerMillion.toFixed(2)} / 1M`;
}

export function formatContextWindow(tokens: number | null | undefined): string {
  if (!tokens) return "N/A";
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(tokens % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (tokens >= 1000) {
    return `${Math.round(tokens / 1000)}k`;
  }
  return `${tokens}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getCompanyInitials(name: string): string {
  if (!name) return "AI";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
