import type { StructureResolver } from "sanity/structure";
import { DISCIPLINES } from "./schemas/objects/disciplines";

const EXPLICITLY_HANDLED_TYPES = new Set([
  "siteSettings",
  "disciplinePage",
  "flexiblePage",
  "event",
  "blogPost",
  "person",
  "mainMenu",
]);

// Én pane per gren, med grenens side, nyheter og aktiviteter filtrert på
// den grenen. Dette er kun en navigasjonssnarvei for forfatterne (klubbens
// grensjefer m.fl. deler samme innlogging) — ikke en tilgangsbegrensning,
// så alle kan fortsatt åpne andre grener eller "Alt innhold" under.
const disciplineListItems = (S: Parameters<StructureResolver>[0]) =>
  DISCIPLINES.map((d) =>
    S.listItem()
      .title(d.short)
      .id(`gren-${d.value}`)
      .child(
        S.list()
          .title(d.short)
          .items([
            S.listItem()
              .title("Grenside")
              .child(
                S.documentList()
                  .title("Grenside")
                  .apiVersion("2024-01-01")
                  .filter('_type == "disciplinePage" && discipline == $d')
                  .params({ d: d.value })
              ),
            S.listItem()
              .title(`${d.short}-innhold`)
              .child(
                S.documentList()
                  .title(`${d.short}-innhold`)
                  .apiVersion("2024-01-01")
                  .filter('_type == "flexiblePage" && $d in disciplines')
                  .params({ d: d.value })
              ),
            S.listItem()
              .title("Nyheter")
              .child(
                S.documentList()
                  .title("Nyheter")
                  .apiVersion("2024-01-01")
                  .filter('_type == "blogPost" && $d in disciplines')
                  .params({ d: d.value })
              ),
            S.listItem()
              .title("Aktiviteter")
              .child(
                S.documentList()
                  .title("Aktiviteter")
                  .apiVersion("2024-01-01")
                  .filter('_type == "event" && $d in disciplines')
                  .params({ d: d.value })
              ),
          ])
      )
  );

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
                .title("Hovedmeny")
                .id("mainMenu")
                .child(S.document().schemaType("mainMenu").documentId("mainMenu")),
            ])
        ),

      S.listItem()
        .title("Klubbinformasjon")
        .child(
          S.documentList()
            .title("Klubbinformasjon")
            .apiVersion("2024-01-01")
            .filter('_type == "flexiblePage" && section == $section')
            .params({ section: "klubb" })
        ),

      S.divider(),

      S.listItem()
        .title("Innhold per gren")
        .child(S.list().title("Innhold per gren").items(disciplineListItems(S))),

      S.divider(),

      // "Alt innhold": ufiltrert admin-oversikt, inkluderer innhold som
      // ikke er gren-merket ennå.
      S.listItem()
        .title("Alt innhold")
        .child(
          S.list()
            .title("Alt innhold")
            .items([
              S.documentTypeListItem("disciplinePage").title("Grensider"),
              S.documentTypeListItem("flexiblePage").title("Sider (alle)"),
              S.documentTypeListItem("event").title("Terminliste / Aktiviteter"),
              S.documentTypeListItem("blogPost").title("Nyheter"),
              S.documentTypeListItem("person").title("Personer / kontakter"),
            ])
        ),

      S.divider(),

      // Defensiv fallback: nye dokumenttyper som blir lagt til skjemaet uten
      // å bli lagt inn her, blir fortsatt synlige i stedet for å forsvinne.
      ...S.documentTypeListItems().filter(
        (item) => !EXPLICITLY_HANDLED_TYPES.has(item.getId() ?? "")
      ),
    ]);
