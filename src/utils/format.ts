/**
 * Format a number as Indonesian Rupiah currency string.
 * Example: 1500000 -> "Rp1.500.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as a shortened Rupiah string for compact UI spaces.
 * Example: 1500000 -> "Rp 1.5jt", 50000 -> "Rp 50rb"
 */
export function formatShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
}
