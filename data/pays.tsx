import Country from "../typedata";

const countries: Country[] = [
  {
    name: "États-Unis",
    dialCode: "+1",
    isoCode: "US",
    timeZone: "UTC-4 à UTC-12",
    continent: "Amérique du Nord",
  },
  {
    name: "Russie",
    dialCode: "+7",
    isoCode: "RU",
    timeZone: "UTC+3 à UTC+12",
    continent: "Europe/Asie",
  },

  {
    name: "Haïti",
    dialCode: "+509",
    isoCode: "HT",
    timeZone: "UTC-5",
    continent: "Amérique du Nord",
  },
  {
    name: "Royaume-Uni",
    dialCode: "+44",
    isoCode: "GB",
    timeZone: "UTC+0",
    continent: "Europe",
  },
  // Le reste de votre tableau
];

export default countries;
