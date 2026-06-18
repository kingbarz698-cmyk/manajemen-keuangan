import type { TransactionType } from "@/types";

export interface ParsedQuickAdd {
  type: TransactionType;
  amount: number;
  note: string;
}

/**
 * Parses free-text quick-add input into a transaction shape.
 * PRD §15 Quick Add — format expected: "+50000 makan siang" or "-50000 makan siang".
 *
 * Rules:
 *  - Leading "+" -> income. Leading "-" or no sign -> expense.
 *  - The first number found (with or without "." or "," thousand separators) is the amount.
 *  - Everything after the number, trimmed, becomes the note. Empty note is allowed.
 *  - Returns null when no valid positive number is found, so the caller can show an error
 *    instead of silently creating a zero-amount transaction.
 */
export function parseQuickAdd(rawText: string): ParsedQuickAdd | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^([+-]?)\s*([\d.,]+)\s*(.*)$/);
  if (!match) return null;

  const [, sign, rawNumber, rawNote] = match;
  const numericString = (rawNumber ?? "").replace(/[.,]/g, "");
  const amount = Number(numericString);

  if (!Number.isFinite(amount) || amount <= 0) return null;

  const type: TransactionType = sign === "+" ? "income" : "expense";
  const note = (rawNote ?? "").trim();

  return { type, amount, note };
}
