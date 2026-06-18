import { useState, useEffect, useCallback, useMemo } from "react";
import type { Transaction, CreateTransactionInput, TransactionFilter } from "@/types";
import * as transactionService from "@/services/transaction.service";

interface UseTransactionsResult {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filter: TransactionFilter;
  setFilter: (filter: TransactionFilter) => void;
  totalIncome: number;
  totalExpense: number;
  isLoading: boolean;
  error: string | null;
  addTransaction: (input: CreateTransactionInput) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat transaksi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      await transactionService.createTransaction(input);
      await fetchTransactions();
    },
    [fetchTransactions]
  );

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => filter === "all" || t.type === filter),
    [transactions, filter]
  );

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  return {
    transactions,
    filteredTransactions,
    filter,
    setFilter,
    totalIncome,
    totalExpense,
    isLoading,
    error,
    addTransaction,
    refetch: fetchTransactions,
  };
}
