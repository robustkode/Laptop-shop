export const PRODUCTS_PER_PAGE = 3;

export const EQUALITY = {
  equal: "equal",
  less: "less",
  more: "more",
};

export const BRANDS = [
  { value: "apple", label: "Apple" },
  { value: "lenevo", label: "Lenevo" },
  { value: "other", label: "Others" },
];

export const STORAGE_TYPE = [
  { value: "hdd", label: "HDD" },
  { value: "ssd", label: "SSD" },
];

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "slight", label: "Slightly used" },
  { value: "old", label: "Old" },
];

export const SORT = [
  { label: "Recently posted", value: "rc" },
  { label: "Most stars", value: "str" },
];

export const PRICE_RANGE = [
  { label: "Under 20k", value: "1", lower: 0, upper: 20000 },
  { label: "20k - 30k", value: "2", lower: 20000, upper: 30000 },
  { label: "30k - 40k", value: "3", lower: 30000, upper: 40000 },
  { label: "Above 40k", value: "4", lower: 40000, upper: null },
];

// export const RAM = [
//   { label: "2gb", value: "2", lower: 0, upper: 4 },
//   { label: "4gb", value: "4", lower: 4, upper: 4 },
//   { label: "8gb", value: "8", lower: 8, upper: 8 },
//   { label: "16gb", value: "16", lower: 16, upper: 16 },
//   { label: "32gb", value: "32", lower: 16, upper: null },
// ];

export const RAM = [
  { label: "Under 4GB", value: 3, equality: EQUALITY.less },
  { label: "4GB", value: 4, equality: null },
  { label: "8GB", value: 8, equality: null },
  { label: "16GB", value: 16, equality: null },
  { label: "Above 16GB", value: 17, equality: EQUALITY.more },
];

//! prepare as ram
//! and change db to number
export const GENERATION = [
  { label: "First", value: "1" },
  { label: "Second", value: "2" },
  {
    label: "Above second",
    value: "0",
  },
];

export const STORAGE = [
  { label: "Under 250 GB", value: "250", lower: 0, upper: 125 },
  { label: "250 - 500GB", value: "500", lower: 125, upper: 500 },
  { label: "500 - 1TB", value: "1000", lower: 500, upper: 1000 },
  { label: "Above 1TB", value: "2000", lower: 1000, upper: null },
];
