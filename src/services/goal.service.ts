import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  runTransaction,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { adjustWalletBalance } from "./wallet.service";
import type { Goal, CreateGoalInput, ContributeToGoalInput, GoalProjection } from "@/types";

/**
 * Goal service backed by real Firestore (`goals` + `goal_contributions` collections).
 * Per PRD §31, goal ownership uses `ownerId` (not `userId`, unlike every other collection).
 *
 * Fix vs. the old mock implementation: contributing to a goal now also deducts
 * the contribution amount from the source wallet's balance (via adjustWalletBalance).
 * The mock version only incremented the goal's currentAmount without touching the
 * wallet, which meant money could be "created" with no real source — contributing
 * should move money from a wallet into the goal, not duplicate it.
 */

interface GoalDocShape {
  ownerId?: string;
  name?: string;
  icon?: string;
  targetAmount?: number;
  monthlyTarget?: number;
  currentAmount?: number;
  deadline?: string;
  color?: string;
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("Tidak ada pengguna yang sedang masuk");
  }
  return uid;
}

function docToGoal(id: string, data: DocumentData): Goal {
  const d = data as GoalDocShape;
  return {
    id,
    ownerId: d.ownerId ?? "",
    name: d.name ?? "",
    icon: (d.icon as Goal["icon"]) ?? "target",
    targetAmount: d.targetAmount ?? 0,
    monthlyTarget: d.monthlyTarget ?? 0,
    currentAmount: d.currentAmount ?? 0,
    deadline: d.deadline ?? "",
    color: d.color ?? "#9ED9FF",
  };
}

export async function getGoals(): Promise<Goal[]> {
  const uid = requireUid();
  const goalsQuery = query(collection(db, "goals"), where("ownerId", "==", uid));
  const snapshot = await getDocs(goalsQuery);
  return snapshot.docs.map((d) => docToGoal(d.id, d.data()));
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const uid = requireUid();
  const newGoalData = {
    ownerId: uid,
    name: input.name,
    icon: "target",
    targetAmount: input.targetAmount,
    monthlyTarget: input.monthlyTarget,
    currentAmount: 0,
    deadline: input.deadline,
    color: "#9ED9FF",
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "goals"), newGoalData);
  return {
    id: docRef.id,
    ownerId: uid,
    name: input.name,
    icon: "target",
    targetAmount: input.targetAmount,
    monthlyTarget: input.monthlyTarget,
    currentAmount: 0,
    deadline: input.deadline,
    color: "#9ED9FF",
  };
}

export async function contributeToGoal(input: ContributeToGoalInput): Promise<Goal> {
  const uid = requireUid();
  const goalRef = doc(db, "goals", input.goalId);

  const updatedGoal = await runTransaction(db, async (firestoreTransaction) => {
    const snapshot = await firestoreTransaction.get(goalRef);
    if (!snapshot.exists()) {
      throw new Error(`Goal dengan id ${input.goalId} tidak ditemukan`);
    }
    const data = snapshot.data() as GoalDocShape;
    const newCurrentAmount = (data.currentAmount ?? 0) + input.amount;
    firestoreTransaction.update(goalRef, { currentAmount: newCurrentAmount });
    return docToGoal(input.goalId, { ...data, currentAmount: newCurrentAmount });
  });

  // Record the contribution as an immutable log entry.
  await addDoc(collection(db, "goal_contributions"), {
    goalId: input.goalId,
    walletId: input.walletId,
    amount: input.amount,
    date: new Date().toISOString(),
    createdAt: serverTimestamp(),
  });

  // Money moves from the source wallet into the goal — deduct it like an expense,
  // without incrementing transactionCount since this isn't a regular transaction.
  await adjustWalletBalance(input.walletId, -input.amount, 0);

  return { ...updatedGoal, ownerId: uid };
}

/** PRD §20 Goal Projection: estimate completion based on current progress + monthly contribution */
export function calculateGoalProjection(goal: Goal): GoalProjection {
  const progressPercent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const estimatedMonthsRemaining =
    goal.monthlyTarget > 0 ? Math.ceil(remainingAmount / goal.monthlyTarget) : Infinity;

  return { progressPercent, remainingAmount, estimatedMonthsRemaining };
}
