import type { StructureResolver } from "sanity/structure";
import { DISCIPLINES } from "./schemas/objects/disciplines";
import { isAdministrator } from "./roles";

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
// grensjefer m.fl.) — ikke en tilgangsbegrensning, så alle kan fortsatt
// åpne andre grener eller "Alt innhold" under.
const disciplineListItems = (S: Parameters<StructureResolver>[0]) => [
  ...DISCIPLINES.map((d) =>
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
  ),
  S.divider(),
  // Padlesider som ikke er merket med gren (f.eks. kurssidene). Uten denne
  // ville de bare vært synlige for administratorer via "Sider (alle)".
  S.listItem()
    .title("Felles padling")
    .id("felles-padling")
    .child(
      S.documentList()
        .title("Felles padling")
        .apiVersion("2024-01-01")
        .filter(
          '_type == "flexiblePage" && section == "padling" && (!defined(disciplines) || count(disciplines) == 0)'
        )
    ),
];

export const structure: StructureResolver = (S, { currentUser }) =>
  S.list()
    .title("Innhold")
    .items([
      // Bare administratorer endrer forside, meny og klubbinformasjon. Disse
      // dokumentene er i tillegg skrivebeskyttet for andre roller (se
      // sanity/roles.ts).
      ...(isAdministrator(currentUser)
        ? [
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
                S.list()
                  .title("Klubbinformasjon")
                  .items([
                    S.listItem()
                      .title("Klubbsider")
                      .child(
                        S.documentList()
                          .title("Klubbsider")
                          .apiVersion("2024-01-01")
                          .filter('_type == "flexiblePage" && section == $section')
                          .params({ section: "klubb" })
                      ),
                    S.documentTypeListItem("person").title("Personer / kontakter"),
                  ])
              ),
            S.divider(),
          ]
        : []),

      S.listItem()
        .title("Innhold per gren")
        .child(S.list().title("Innhold per gren").items(disciplineListItems(S))),

      S.documentTypeListItem("blogPost").title("Nyheter"),
      S.documentTypeListItem("event").title("Terminliste / Aktiviteter"),

      // Ufiltrert oversikt over alle sider, som sikkerhetsnett for sider som
      // ikke havner i noen av listene over. Kun for administratorer.
      ...(isAdministrator(currentUser)
        ? [S.divider(), S.documentTypeListItem("flexiblePage").title("Sider (alle)")]
        : []),

      // Defensiv fallback: nye dokumenttyper som blir lagt til skjemaet uten
      // å bli lagt inn her, blir fortsatt synlige i stedet for å forsvinne.
      ...S.documentTypeListItems().filter(
        (item) => !EXPLICITLY_HANDLED_TYPES.has(item.getId() ?? "")
      ),
    ]);
