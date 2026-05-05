export const VAT_RATES: Record<string, { standard: number; reduced: number }> = {
  'FR': { standard: 20, reduced: 10 },
  'BE': { standard: 21, reduced: 6 },
  'DE': { standard: 19, reduced: 7 },
  'ES': { standard: 21, reduced: 10 },
  'IT': { standard: 22, reduced: 10 },
  'XX': { standard: 0, reduced: 0 },
};

export function calculateVAT(ht: number, country: string = 'FR', isReduced = false, exempt = false) {
  if (exempt) return { vatRate: 0, vatAmount: 0, ttc: ht, ht };
  const rates = VAT_RATES[country] || VAT_RATES['FR'];
  const rate = isReduced ? rates.reduced : rates.standard;
  const vatAmount = Math.round(ht * (rate / 100) * 100) / 100;
  const ttc = Math.round((ht + vatAmount) * 100) / 100;
  return { vatRate: rate, vatAmount, ttc, ht };
}