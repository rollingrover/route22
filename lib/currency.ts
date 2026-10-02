// Display currencies (same set as OpDesk) + visitor region → currency.
// Prices are always set and billed in ZAR; other currencies are shown as an
// approximate "≈" using daily rates from the shared fx_rates table.
export type CurrencyCode =
  | "ZAR" | "USD" | "EUR" | "GBP" | "AUD" | "KES" | "TZS" | "UGX" | "RWF" | "BWP" | "NAD" | "ZMW" | "MZN" | "MWK";

export const CURRENCIES: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "RWF", symbol: "RF", name: "Rwandan Franc" },
  { code: "BWP", symbol: "P", name: "Botswana Pula" },
  { code: "NAD", symbol: "N$", name: "Namibian Dollar" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
];

// Same mapping as OpDesk's /api/geo (Vercel's x-vercel-ip-country header).
export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  ZA: "ZAR", KE: "KES", TZ: "TZS", BW: "BWP", NA: "NAD", MZ: "MZN", ZM: "ZMW", UG: "UGX", RW: "RWF", MW: "MWK",
  US: "USD", GB: "GBP", AU: "AUD",
  FR: "EUR", DE: "EUR", IT: "EUR", ES: "EUR", PT: "EUR", NL: "EUR", BE: "EUR", IE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR",
};
