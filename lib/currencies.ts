export const Currencies = [
    {value: "INR", label: "₹ Rupees", locale:"en-IN"},
    {value: "USD", label: "$ Dollars", locale: "en-US"},
    {value: "EUR", label: "€ Euros", locale: "de-DE"},
    {value: "JPY", label: "¥ Yen", locale: "ja-JP"},
    {value: "GBP", label: "£ Pound", locale: "en-GB"}
];
export type Currency = (typeof Currencies)[0]