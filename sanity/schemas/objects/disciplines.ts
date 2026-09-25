// Kanonisk liste over klubbens grener. Feltnavnet "discipline" beholdes
// internt i koden av historiske årsaker, men all tekst som vises til
// forfattere eller besøkende skal si "gren"/"grener".
export const DISCIPLINES: { title: string; value: string; short: string }[] = [
  { title: "Havpadling", value: "hav", short: "Hav" },
  { title: "Elvepadling", value: "elv", short: "Elv" },
  { title: "Flattvann", value: "flattvann", short: "Flattvann" },
  { title: "Surfski", value: "surfski", short: "Surfski" },
  { title: "Kajakkpolo", value: "polo", short: "Kajakkpolo" },
  { title: "Junior", value: "junior", short: "Junior" },
  { title: "Pirbadet", value: "pirbadet", short: "Pirbadet" },
];
