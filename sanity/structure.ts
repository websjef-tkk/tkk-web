import type { StructureResolver } from "sanity/structure";

const EXPLICITLY_HANDLED_TYPES = new Set([
  "siteSettings",
  "navLabels",
  "disciplinePage",
  "flexiblePage",
  "event",
  "recurringEvent",
  "blogPost",
  "person",
  "mainMenu",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innhold")
    .items([
      S.listItem()
        .title("Forside og meny")
        .child(
          S.list()
            .title("Forside og meny")
            .items([
              S.listItem()
                .title("Nettstedinnstillinger")
                .id("siteSettings")
                .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
              S.listItem()
                .title("Navigasjonsetiketter")
                .id("navLabels")
                .child(S.document().schemaType("navLabels").documentId("navLabels")),
              S.listItem()
                .title("Hovedmeny")
                .id("mainMenu")
                .child(S.document().schemaType("mainMenu").documentId("mainMenu")),
            ])
        ),

      S.divider(),

      S.listItem()
        .title("Padling-innhold")
        .child(
          S.list()
            .title("Padling-innhold")
            .items([
              S.documentTypeListItem("disciplinePage").title("Disiplinsider"),
              S.listItem()
                .title("Padling-undersider")
                .child(
                  S.documentList()
                    .title("Padling-undersider")
                    .filter('_type == "flexiblePage" && section == $section')
                    .params({ section: "padling" })
                ),
            ])
        ),

      S.listItem()
        .title("Klubbinformasjon")
        .child(
          S.documentList()
            .title("Klubbinformasjon")
            .filter('_type == "flexiblePage" && section == $section')
            .params({ section: "klubb" })
        ),

      S.divider(),

      S.listItem()
        .title("Terminliste / Aktiviteter")
        .child(
          S.list()
            .title("Terminliste / Aktiviteter")
            .items([
              S.documentTypeListItem("event").title("Aktiviteter / arrangement"),
              S.documentTypeListItem("recurringEvent").title("Faste turer / treninger"),
            ])
        ),

      S.documentTypeListItem("blogPost").title("Nyheter"),
      S.documentTypeListItem("person").title("Personer / kontakter"),

      S.divider(),

      // Defensiv fallback: nye dokumenttyper som blir lagt til skjemaet uten
      // å bli lagt inn her, blir fortsatt synlige i stedet for å forsvinne.
      ...S.documentTypeListItems().filter(
        (item) => !EXPLICITLY_HANDLED_TYPES.has(item.getId() ?? "")
      ),
    ]);
