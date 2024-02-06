import { format } from "date-fns";
import { ProjectItems, ProjectProjects } from "../types";

export const extractingRoute = (path: string): string => {
  const parts = path.split("/");
  const lastPart = parts[parts.length - 1];
  const capitalized = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  return capitalized;
};

export const extractKeys = (arr: object[]): string[] => {
  const allKeys = new Set<string>();
  arr.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      allKeys.add(key);
    });
  });
  return Array.from(allKeys);
};

export function formatDate(
  date: Date | number,
  formatString = "yyyy-MM-dd"
): string {
  return format(date, formatString);
}

export const filterActiveProjects = (projects: ProjectProjects[]) => {
  return projects.filter((project) => project.status_code === "JA");
};

// transform items to remove any white spaces
export const transformItems = (items: ProjectItems[]) => {
  return items.map((item) => {
    const newItem = { ...item };
    for (const key in newItem) {
      if (typeof newItem[key] === "string") {
        newItem[key] = newItem[key].trim();
      }
    }
    return newItem;
  });
};

// statuses for chart
export const getStatusName = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    IB: "I. budgeting",
    ID: "I. Detailing",
    IDQ: "I. Tender Submitted",
    IDT: "I. Tender Received",
    IDS: "I. Submitted Appr.",
    IDR: "I. Rejected",
    IDA: "I. Approved",
    IXH: "I. not Required",
    IZ: "I. Deleted",
    IOP: "I. Order Preparation",
    IOR: "I. Order Submitted Appr.",
    IOA: "I. Approved Issue",
    IOI: "I. Order Issued Supp.",
    IOF: "I. Order Finished",
    IOD: "I. Arrived Delivery Dest.",
    ISP: "I. Shipment Preparation",
    ISS: "I. Shipment Sent",
    ISA: "I. Shipment Arrived",
    ISC: "I. Shipment Customs",
    ISH: "I. Shipment Held Customs",
    IWJ: "I. Shipment WH Jeddah",
    IWR: "I. Shipment WH Riyadh",
    IZS: "I. Sent to Client",
    IZI: "I. Installation",
  };

  return statusMap[status] || "Unknown status";
};

export const currency_info = {
  SAR: { description: "Saudi Riyal", symbol: "﷼", countryCode: "SA" },

  USD: { description: "US Dollar", symbol: "$", countryCode: "US" },
  EUR: { description: "Euro", symbol: "€", countryCode: "EU" },
  JPY: { description: "Japanese Yen", symbol: "¥", countryCode: "JP" },
  GBP: {
    description: "British Pound Sterling",
    symbol: "£",
    countryCode: "GB",
  },
  AUD: { description: "Australian Dollar", symbol: "$", countryCode: "AU" },
  CAD: { description: "Canadian Dollar", symbol: "$", countryCode: "CA" },
  CHF: { description: "Swiss Franc", symbol: "CHF", countryCode: "CH" },
  CNY: { description: "Chinese Yuan Renminbi", symbol: "¥", countryCode: "CN" },
  SEK: { description: "Swedish Krona", symbol: "kr", countryCode: "SE" },
  NZD: { description: "New Zealand Dollar", symbol: "$", countryCode: "NZ" },
  MXN: { description: "Mexican Peso", symbol: "$", countryCode: "MX" },
  SGD: { description: "Singapore Dollar", symbol: "$", countryCode: "SG" },
  HKD: { description: "Hong Kong Dollar", symbol: "$", countryCode: "HK" },
  NOK: { description: "Norwegian Krone", symbol: "kr", countryCode: "NO" },
  KRW: { description: "South Korean Won", symbol: "₩", countryCode: "KR" },
  TRY: { description: "Turkish Lira", symbol: "₺", countryCode: "TR" },
  RUB: { description: "Russian Ruble", symbol: "₽", countryCode: "RU" },
  INR: { description: "Indian Rupee", symbol: "₹", countryCode: "IN" },
  BRL: { description: "Brazilian Real", symbol: "R$", countryCode: "BR" },
  ZAR: { description: "South African Rand", symbol: "R", countryCode: "ZA" },
  DKK: { description: "Danish Krone", symbol: "kr", countryCode: "DK" },
  PLN: { description: "Polish Zloty", symbol: "zł", countryCode: "PL" },
  THB: { description: "Thai Baht", symbol: "฿", countryCode: "TH" },
  IDR: { description: "Indonesian Rupiah", symbol: "Rp", countryCode: "ID" },
  HUF: { description: "Hungarian Forint", symbol: "Ft", countryCode: "HU" },
  CZK: { description: "Czech Koruna", symbol: "Kč", countryCode: "CZ" },
  ILS: { description: "Israeli New Shekel", symbol: "₪", countryCode: "IL" },
  CLP: { description: "Chilean Peso", symbol: "$", countryCode: "CL" },
  PHP: { description: "Philippine Peso", symbol: "₱", countryCode: "PH" },
  AED: {
    description: "United Arab Emirates Dirham",
    symbol: "د.إ",
    countryCode: "AE",
  },
  COP: { description: "Colombian Peso", symbol: "$", countryCode: "CO" },
  MYR: { description: "Malaysian Ringgit", symbol: "RM", countryCode: "MY" },
  RON: { description: "Romanian Leu", symbol: "lei", countryCode: "RO" },
  PKR: { description: "Pakistani Rupee", symbol: "₨", countryCode: "PK" },
  ARS: { description: "Argentine Peso", symbol: "$", countryCode: "AR" },
  TWD: { description: "New Taiwan Dollar", symbol: "NT$", countryCode: "TW" },
  EGP: { description: "Egyptian Pound", symbol: "£", countryCode: "EG" },
  VND: { description: "Vietnamese Dong", symbol: "₫", countryCode: "VN" },
  NGN: { description: "Nigerian Naira", symbol: "₦", countryCode: "NG" },
  BDT: { description: "Bangladeshi Taka", symbol: "৳", countryCode: "BD" },
  PEN: { description: "Peruvian Sol", symbol: "S/.", countryCode: "PE" },
  GHS: { description: "Ghanaian Cedi", symbol: "₵", countryCode: "GH" },
  KES: { description: "Kenyan Shilling", symbol: "Sh", countryCode: "KE" },
  UAH: { description: "Ukrainian Hryvnia", symbol: "₴", countryCode: "UA" },
  JOD: { description: "Jordanian Dinar", symbol: "د.ا", countryCode: "JO" },
  OMR: { description: "Omani Rial", symbol: "ر.ع.", countryCode: "OM" },
  BGN: { description: "Bulgarian Lev", symbol: "лв", countryCode: "BG" },
  MAD: { description: "Moroccan Dirham", symbol: "د.م.", countryCode: "MA" },
  HRK: { description: "Croatian Kuna", symbol: "kn", countryCode: "HR" },
  QAR: { description: "Qatari Rial", symbol: "ر.ق", countryCode: "QA" },
  ISK: { description: "Icelandic Króna", symbol: "kr", countryCode: "IS" },
  LKR: { description: "Sri Lankan Rupee", symbol: "₨", countryCode: "LK" },
  NPR: { description: "Nepalese Rupee", symbol: "₨", countryCode: "NP" },
  MUR: { description: "Mauritian Rupee", symbol: "₨", countryCode: "MU" },
  LBP: { description: "Lebanese Pound", symbol: "ل.ل", countryCode: "LB" },
  JMD: { description: "Jamaican Dollar", symbol: "J$", countryCode: "JM" },
  DOP: { description: "Dominican Peso", symbol: "RD$", countryCode: "DO" },
  TTD: {
    description: "Trinidad and Tobago Dollar",
    symbol: "TT$",
    countryCode: "TT",
  },
  XCD: { description: "East Caribbean Dollar", symbol: "$", countryCode: "XC" },
  FJD: { description: "Fijian Dollar", symbol: "FJ$", countryCode: "FJ" },
  VUV: { description: "Vanuatu Vatu", symbol: "VT", countryCode: "VU" },
  ANG: {
    description: "Netherlands Antillean Guilder",
    symbol: "ƒ",
    countryCode: "AN",
  },
  BHD: { description: "Bahraini Dinar", symbol: ".د.ب", countryCode: "BH" },
  IQD: { description: "Iraqi Dinar", symbol: "ع.د", countryCode: "IQ" },
  KWD: { description: "Kuwaiti Dinar", symbol: "د.ك", countryCode: "KW" },
  RSD: { description: "Serbian Dinar", symbol: "дин", countryCode: "RS" },
  TND: { description: "Tunisian Dinar", symbol: "د.ت", countryCode: "TN" },
  LYD: { description: "Libyan Dinar", symbol: "ل.د", countryCode: "LY" },
  SYP: { description: "Syrian Pound", symbol: "£", countryCode: "SY" },
  YER: { description: "Yemeni Rial", symbol: "﷼", countryCode: "YE" },
  SOS: { description: "Somali Shilling", symbol: "S", countryCode: "SO" },
  SDG: { description: "Sudanese Pound", symbol: "£", countryCode: "SD" },
  ETB: { description: "Ethiopian Birr", symbol: "Br", countryCode: "ET" },
  MZN: { description: "Mozambican Metical", symbol: "MT", countryCode: "MZ" },
  BWP: { description: "Botswanan Pula", symbol: "P", countryCode: "BW" },
  NAD: { description: "Namibian Dollar", symbol: "$", countryCode: "NA" },
  GMD: { description: "Gambian Dalasi", symbol: "D", countryCode: "GM" },
  TZS: { description: "Tanzanian Shilling", symbol: "Sh", countryCode: "TZ" },
  UGX: { description: "Ugandan Shilling", symbol: "USh", countryCode: "UG" },
  MGA: { description: "Malagasy Ariary", symbol: "Ar", countryCode: "MG" },
  AOA: { description: "Angolan Kwanza", symbol: "Kz", countryCode: "AO" },
  ZMW: { description: "Zambian Kwacha", symbol: "ZK", countryCode: "ZM" },
  MWK: { description: "Malawian Kwacha", symbol: "MK", countryCode: "MW" },
  LSL: { description: "Lesotho Loti", symbol: "L", countryCode: "LS" },
  BIF: { description: "Burundian Franc", symbol: "FBu", countryCode: "BI" },
  SCR: { description: "Seychellois Rupee", symbol: "₨", countryCode: "SC" },
  CDF: { description: "Congolese Franc", symbol: "FC", countryCode: "CD" },
  STN: {
    description: "São Tomé and Príncipe Dobra",
    symbol: "Db",
    countryCode: "ST",
  },
  TJS: { description: "Tajikistani Somoni", symbol: "SM", countryCode: "TJ" },
  KPW: { description: "North Korean Won", symbol: "₩", countryCode: "KP" },
  MMK: { description: "Myanmar Kyat", symbol: "K", countryCode: "MM" },
  LAK: { description: "Laotian Kip", symbol: "₭", countryCode: "LA" },
  KHR: { description: "Cambodian Riel", symbol: "៛", countryCode: "KH" },
  MOP: { description: "Macanese Pataca", symbol: "MOP$", countryCode: "MO" },
  PYG: { description: "Paraguayan Guarani", symbol: "₲", countryCode: "PY" },
  UYU: { description: "Uruguayan Peso", symbol: "$U", countryCode: "UY" },
  HNL: { description: "Honduran Lempira", symbol: "L", countryCode: "HN" },
  NIO: { description: "Nicaraguan Córdoba", symbol: "C$", countryCode: "NI" },
  BMD: { description: "Bermudian Dollar", symbol: "$", countryCode: "BM" },
  KYD: { description: "Cayman Islands Dollar", symbol: "$", countryCode: "KY" },
  MVR: { description: "Maldivian Rufiyaa", symbol: "Rf", countryCode: "MV" },
  ERN: { description: "Eritrean Nakfa", symbol: "Nfk", countryCode: "ER" },
  SBD: {
    description: "Solomon Islands Dollar",
    symbol: "$",
    countryCode: "SB",
  },
  AZN: { description: "Azerbaijani Manat", symbol: "₼", countryCode: "AZ" },
  AMD: { description: "Armenian Dram", symbol: "֏", countryCode: "AM" },
  GEL: { description: "Georgian Lari", symbol: "₾", countryCode: "GE" },
  MDL: { description: "Moldovan Leu", symbol: "L", countryCode: "MD" },
  ALL: { description: "Albanian Lek", symbol: "L", countryCode: "AL" },
};
