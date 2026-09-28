// Kanonisk liste over aktivitetskategorier. Brukes både av Studio-skjemaet
// og av filterknappene på /aktiviteter, slik at en ny kategori bare må
// legges til ett sted.
export const EVENT_CATEGORIES: { title: string; value: string }[] = [
  { title: "Tur", value: "tur" },
  { title: "Kurs", value: "kurs" },
  { title: "Sosialt", value: "sosial" },
];
