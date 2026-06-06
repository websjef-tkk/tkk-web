import { defineField, defineType } from "sanity";

const bilingualString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "no", title: "Norsk", type: "string" }),
      defineField({ name: "en", title: "English", type: "string" }),
    ],
  });

export const navLabels = defineType({
  name: "navLabels",
  title: "Navigasjonsetiketter",
  type: "document",
  // @ts-expect-error — singleton action list is not in the public type but works at runtime
  __experimental_actions: ["update", "publish"],
  fields: [
    bilingualString("home", "Hjem"),
    bilingualString("activities", "Aktiviteter"),
    bilingualString("disciplines", "Disipliner"),
    bilingualString("seaKayaking", "Havpadling"),
    bilingualString("riverKayaking", "Elvepadling"),
    bilingualString("flatwater", "Flattvann"),
    bilingualString("surfski", "Surfski"),
    bilingualString("polo", "Kajakkpolo"),
    bilingualString("junior", "Junior"),
    bilingualString("hms", "HMS"),
    bilingualString("hmsGeneral", "Generelt"),
    bilingualString("hmsSea", "Havpadling"),
    bilingualString("hmsRiver", "Elvepadling"),
    bilingualString("hmsAlert", "Mitt varsel"),
    bilingualString("hmsIncidents", "Hendelsesrapporter"),
    bilingualString("hmsCriminalRecord", "Politiattest"),
    bilingualString("club", "Klubben"),
    bilingualString("clubAdmin", "Administrasjon"),
    bilingualString("clubhouse", "Klubbhus"),
    bilingualString("socialGroup", "Sosialgruppe"),
    bilingualString("grants", "Støtteordninger"),
    bilingualString("reimbursement", "Refusjon"),
    bilingualString("blog", "Blogg"),
    bilingualString("membership", "Medlemskap"),
    bilingualString("contact", "Kontakt"),
    bilingualString("login", "Logg inn"),
    bilingualString("profile", "Min profil"),
    bilingualString("logout", "Logg ut"),
    bilingualString("register", "Registrer"),
  ],
  preview: {
    prepare() {
      return { title: "Navigasjonsetiketter" };
    },
  },
});
