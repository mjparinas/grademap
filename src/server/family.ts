import "server-only";
import type { FamilyInfo } from "@/lib/model";
import { query } from "./db";

interface FamilyRow {
  id: string;
  trial_ends_at: number;
  plan: string;
  stripe_customer: string | null;
  subscription_status: string | null;
  subscription_interval: string | null;
  current_period_end: number | null;
  updated_at: number;
}

export async function getFamilyRow(id: string): Promise<FamilyRow | undefined> {
  return (await query<FamilyRow>("SELECT * FROM families WHERE id = ?", [id]))[0];
}

export function toFamilyInfo(row: FamilyRow, email: string, verified = true, student = false): FamilyInfo {
  return {
    account: { email, familyId: row.id, verified, ...(student ? { student: true } : {}) },
    plan: row.plan as FamilyInfo["plan"],
    trialEndsAt: Number(row.trial_ends_at),
    subscription: row.subscription_status
      ? {
          status: row.subscription_status,
          interval: (row.subscription_interval as "month" | "year" | null) ?? undefined,
          currentPeriodEnd: row.current_period_end ? Number(row.current_period_end) : undefined,
        }
      : undefined,
    updatedAt: Number(row.updated_at),
  };
}
