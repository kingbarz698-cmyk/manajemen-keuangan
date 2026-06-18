/**
 * Goal Wallet domain types.
 * Mirrors Firestore collection `goals/{goalId}` per PRD §31.
 * Covers PRD §18 (Goal Wallet System), §19 (Smart Goal Protection),
 * §20 (Goal Projection), §21 (Auto Allocation).
 */

import type { IconName } from "@/components/ui/Icon";

export interface Goal {
  id: string;
  ownerId: string;
  name: string;
  /** Icon name registered in the Icon component */
  icon: IconName;
  targetAmount: number;
  monthlyTarget: number;
  currentAmount: number;
  deadline: string;
  /** Static accent color (hex) for the goal card */
  color: string;
}

export interface CreateGoalInput {
  name: string;
  targetAmount: number;
  monthlyTarget: number;
  deadline: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  walletId: string;
  amount: number;
  date: string;
}

export interface ContributeToGoalInput {
  goalId: string;
  walletId: string;
  amount: number;
}

/** Derived projection — PRD §20 Goal Projection */
export interface GoalProjection {
  progressPercent: number;
  remainingAmount: number;
  estimatedMonthsRemaining: number;
}
