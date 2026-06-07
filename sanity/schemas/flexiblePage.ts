import { defineField, defineType } from "sanity";

const linkAnnotation = {
  type: "object" as const,
  name: "link",
  title: "Lenke",
  fields: [{ name: "href", type: "url", title: "URL" }],
};

export const flexiblePage = defineType({
  name: "flexiblePage",
  title: "Fleksibel side",
  type: "document",
  fields: [
    defineField({
      name: "pageId",
      title: "Side-ID (nøkkel)",
      type: "string",
      options: {
        list: [
          { title: "HMS – Oversikt", value: "hms" },
          { title: "HMS – Generelt", value: "hms-generelt" },
          { title: "HMS – Pirbadet", value: "hms-pirbadet" },
          { title: "HMS – Havpadling", value: "hms-hav" },
          { title: "HMS Hav – Fellespadling", value: "hms-hav-fellespadling" },
          { title: "HMS Hav – Munkholmen", value: "hms-hav-munkholmen" },
          { title: "HMS Hav – Cruisebåter", value: "hms-hav-cruisebater" },
          { title: "HMS Hav – Rull & Tull", value: "hms-hav-rull-tull" },
          { title: "HMS Hav – Sikker padling", value: "hms-hav-sikker-padling" },
          { title: "HMS – Elvepadling", value: "hms-elv" },
          { title: "HMS Elv – Klubbpadling Nidelven", value: "hms-elv-klubbpadling-nidelven" },
          { title: "HMS Elv – Klubbpadling Nidelven HMS", value: "hms-elv-klubbpadling-nidelven-hms" },
          { title: "HMS Elv – Spontan tur", value: "hms-elv-spontan-tur" },
          { title: "HMS – Mitt varsel", value: "hms-mitt-varsel" },
          { title: "HMS – Hendelsesrapporter", value: "hms-hendelsesrapporter" },
          { title: "HMS – Politiattest", value: "hms-politiattest" },
          { title: "Padling – Turledelse Hav", value: "padling-turledelse-hav" },
          { title: "Padling – Kurs", value: "padling-kurs" },
          { title: "Padling Hav – Havpadling", value: "padling-hav-havpadling" },
          { title: "Padling Hav – Reolplasser", value: "padling-hav-reolplasser" },
          { title: "Padling Hav – Søndagstur", value: "padling-hav-sondagstur" },
          { title: "Padling Hav – Padlekart Midt-Norge", value: "padling-hav-padlekart" },
          { title: "Padling Hav – Fyrmestergrad", value: "padling-hav-fyrmestergrad" },
          { title: "Padling Elv – Elvepadling", value: "padling-elv-elvepadling" },
          { title: "Padling Elv – Kajakk lån og leie", value: "padling-elv-kajakk-lan" },
          { title: "Padling Flattvann – Flattvann og Surfski", value: "padling-flattvann-flattvann-surfski" },
          { title: "Padling Flattvann – Kajakker", value: "padling-flattvann-kajakker" },
          { title: "Padling Flattvann – Surfski", value: "padling-flattvann-surfski" },
          { title: "Padling Flattvann – Vingarer", value: "padling-flattvann-vingarer" },
          { title: "Padling Junior – Velkommen", value: "padling-junior-velkommen" },
          { title: "Padling Junior – Juniorutstyr", value: "padling-junior-utstyr" },
          { title: "Kom i gang", value: "kom-i-gang" },
          { title: "Klubben – Administrasjon", value: "klubben-administrasjon" },
          { title: "Klubben – Klubbhus", value: "klubben-klubbhus" },
          { title: "Klubben – Sosialgruppe", value: "klubben-sosialgruppe" },
          { title: "Klubben – Sosialgruppa", value: "klubben-sosialgruppe-sosialgruppa" },
          { title: "Klubben – Utmerkelser", value: "klubben-sosialgruppe-utmerkelser" },
          { title: "Klubben – Støtteordninger", value: "klubben-stotteordninger" },
          { title: "Klubben – Kjøregodtgjørelse", value: "klubben-kjoregodtgjorelse" },
          { title: "Klubben – Vedtektene", value: "klubben-vedtektene" },
          { title: "Medlemskap", value: "medlemskap" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Tittel",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "string", validation: (r) => r.required() }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),
    defineField({
      name: "intro",
      title: "Ingress",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "text", rows: 4 }),
        defineField({ name: "en", title: "English", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Seksjoner",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Seksjonstittel",
              type: "object",
              fields: [
                defineField({ name: "no", title: "Norsk", type: "string" }),
                defineField({ name: "en", title: "English", type: "string" }),
              ],
            }),
            defineField({
              name: "body",
              title: "Innhold",
              type: "object",
              fields: [
                defineField({
                  name: "no",
                  title: "Norsk",
                  type: "array",
                  of: [{ type: "block", marks: { annotations: [linkAnnotation] } }],
                }),
                defineField({
                  name: "en",
                  title: "English",
                  type: "array",
                  of: [{ type: "block", marks: { annotations: [linkAnnotation] } }],
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title.no" },
            prepare({ title }: { title?: string }) {
              return { title: title ?? "Seksjon" };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title.no", subtitle: "pageId" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title ?? "Uten tittel", subtitle };
    },
  },
});
