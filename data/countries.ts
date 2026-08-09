export type Country = {
  name: string;
  region: "Asia" | "Africa" | "Europe" | "United Kingdom";
  note?: string;
};

export const countries: Country[] = [
  { name: "Afghanistan", region: "Asia" },
  { name: "Albania", region: "Europe" },
  { name: "Bangladesh", region: "Asia" },
  { name: "Bangladesh (Rohingya)", region: "Asia", note: "Rohingya-specific expertise" },
  { name: "Cameroon", region: "Africa" },
  { name: "Ghana", region: "Africa" },
  { name: "India", region: "Asia" },
  { name: "India (Rohingya)", region: "Asia", note: "Rohingya-specific expertise" },
  { name: "Myanmar", region: "Asia" },
  { name: "Nepal", region: "Asia" },
  { name: "Nigeria", region: "Africa" },
  { name: "Pakistan", region: "Asia" },
  { name: "Sri Lanka", region: "Asia" },
  { name: "United Kingdom", region: "United Kingdom" },
  { name: "Vietnam", region: "Asia" },
];

export const countryRegions = [
  "All",
  "Asia",
  "Africa",
  "Europe",
  "United Kingdom",
] as const;

export type CountryRegion = (typeof countryRegions)[number];
