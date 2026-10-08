// Canadian coins and bills, in cents. (US money can be added the same way.)
export const COIN_NAMES: Record<number, string> = {
  5: "nickel",
  10: "dime",
  25: "quarter",
  100: "loonie",
  200: "toonie",
  500: "$5 bill",
  1000: "$10 bill",
  2000: "$20 bill",
  5000: "$50 bill",
};

export function formatMoney(cents: number): string {
  if (cents < 100) return `${cents}¢`;
  const dollars = cents / 100;
  return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(2)}`;
}
