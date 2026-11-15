export const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", country: "Nigeria", flag: "🇳🇬", ngnPerUnit: 1 },
  { code: "USD", name: "US Dollar", country: "United States", flag: "🇺🇸", ngnPerUnit: 1500 },
  { code: "GBP", name: "British Pound", country: "United Kingdom", flag: "🇬🇧", ngnPerUnit: 1900 },
  { code: "EUR", name: "Euro", country: "European Union", flag: "🇪🇺", ngnPerUnit: 1640 },
  { code: "GHS", name: "Ghanaian Cedi", country: "Ghana", flag: "🇬🇭", ngnPerUnit: 95 },
  { code: "KES", name: "Kenyan Shilling", country: "Kenya", flag: "🇰🇪", ngnPerUnit: 11 },
  { code: "CAD", name: "Canadian Dollar", country: "Canada", flag: "🇨🇦", ngnPerUnit: 1100 },
  { code: "INR", name: "Indian Rupee", country: "India", flag: "🇮🇳", ngnPerUnit: 18 },
];

export function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
