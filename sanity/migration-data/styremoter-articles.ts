/**
 * Strukturert innhold hentet fra gamle styremøteprotokoll-nyhetsartikler på
 * tkk.no (Joomla) som aldri fikk en original PDF. Brukes av
 * generate-protocol-pdf.ts til å rendre en lesbar PDF pr. møte, som deretter
 * lastes opp og lenkes fra den nye siden av import-styre-og-stell.ts.
 */

export type ProtocolAgendaItem = {
  heading: string;
  body: string;
};

export type ProtocolArticle = {
  /** Brukt som sorteringsnøkkel og i PDF-filnavnet, f.eks. "2023-06-13". */
  dateISO: string;
  /** Visningsformat som på den gamle siden, f.eks. "13.06.2023". */
  dateDisplay: string;
  time?: string;
  location?: string;
  attendeesBoard?: string;
  attendeesOthers?: string;
  absent?: string;
  items: ProtocolAgendaItem[];
};

export const styremoterArticles: ProtocolArticle[] = [
  {
    dateISO: "2023-12-12",
    dateDisplay: "12.12.2023",
    time: "18:00",
    location: "Klubbhuset",
    attendeesBoard:
      "Ni medlemmer til stede, inkludert styreleder Chris Thomas Skogli og kasserer Anja Diez, samt flere gruppeledere. Tre medlemmer var fraværende.",
    items: [
      {
        heading: "Dato for årsmøte",
        body: "Årsmøtet 2024 er satt til 19. mars 2024. Styret bemerket dårlig oppmøte på årsmøtet i 2023 og diskuterte tiltak for å øke deltakelsen.",
      },
      {
        heading: "Retningslinjer for fellesutgifter",
        body: "Styret vedtok nye regler for betaling av fellesutgifter, med presisering om at ordningen gjelder bredt for alle fellesutgifter, ikke bare turer.",
      },
      {
        heading: "Støtte til Iris Sommernes",
        body: "Klubben bevilget kr 30 000 (maks sum) for dokumenterte utgifter til coaching, treningstider og overnatting i forbindelse med internasjonal slalåmpadling.",
      },
      {
        heading: "Løpende saker",
        body: "Padleboken-systemet innføres mot nyåret. Elvegruppens båter får E-serienummerering i loggsystemet. Det undersøkes sensorstyrt utebelysning på Ladekaia. Arbeidet med virksomhetsplanen fortsetter med gruppeledere involvert.",
      },
      {
        heading: "Unntatt offentlighet",
        body: "En sak ble unntatt den offentlige versjonen av protokollen av personvernhensyn.",
      },
    ],
  },
  {
    dateISO: "2023-06-13",
    dateDisplay: "13.06.2023",
    time: "18:00",
    location: "Klubbhuset",
    attendeesBoard:
      "Chris Thomas Skogli (leder), Anja Diez (kasserer), Isabelle Sande, Ulf Bjørnar Stordalmo, Aagot Opheim (varaleder)",
    attendeesOthers: "Håvard Dahlen (hussjef), Magne Lysberg (medlemsansvarlig), Eirin Malmo (havsjef), Kristian Rye (elvesjef), Øyvind Anda (gjest)",
    absent: "Wolfgang Born",
    items: [
      { heading: "23/2/1 Godkjenning av innkalling og saksliste", body: "Enstemmig godkjent." },
      {
        heading: "23/2/2 Søknad om dispensasjon fra krav om antall turer",
        body: "Innhold unntatt offentlighet. Styret godkjente dispensasjon fra turkravet for 2023, enstemmig.",
      },
      {
        heading: "23/2/3 Opprettelse av surfski-gruppe",
        body: "Surfski er en offisiell gren under NPF. Øyvind Anda foreslått som leder, trening lørdager kl. 12:00 fra Ladekaia. Vedtak: Surfski-gruppe opprettet med Øyvind Anda som gruppeleder, eget budsjett for 2023 ikke nødvendig. Enstemmig.",
      },
      {
        heading: "23/2/4 Ny avtale med dykkerklubben om Østmarkneset",
        body: "Diskusjon om vaskeordning og koordinering av avfallshåndtering.",
      },
      {
        heading: "23/2/5 Søknad om dispensasjon fra turkrav",
        body: "Innhold unntatt offentlighet. Styret godkjente dispensasjon for 2023, enstemmig.",
      },
      {
        heading: "23/2/6 Kriterier for støttefordeling til unge utøvere",
        body: "Komité etablert for å utarbeide forslag. Faste kriterier: utøvere må konkurrere på nasjonalt eller internasjonalt nivå, budsjett skal ikke overskrides. Arbeidet fortsetter gjennom sommeren, enstemmig.",
      },
      {
        heading: "23/2/7 Medlemskontingent",
        body: "485 har betalt, 1 har forfalt. Kr 346 000 innbetalt mot budsjettert kr 420 000.",
      },
      {
        heading: "23/2/8 Gratis livredningskurs",
        body: "Vedtak: Chris Thomas innhenter interesselister fra aktivitetsledergrupper og seksjoner, styret velger deltakere innen 7 dager, enstemmig.",
      },
      {
        heading: "23/2/9 Oppdaterte leiekontrakter",
        body: "Vedtak: Chris Thomas kontakter leietakere med oppdaterte kontrakter. Nidaros Roklubb fikk tilbud om redusert leie mot vask, enstemmig.",
      },
      { heading: "23/2/10 Innføring av Padleboken-systemet", body: "Vedtak: Chris Thomas ber om en demonstrasjon av systemet, enstemmig." },
      {
        heading: "23/2/11 Innkjøp av bord og benker",
        body: "Vedtak: To sett godkjent over hus-budsjettet, forutsatt passende lagringsplass på Skansen, enstemmig.",
      },
      {
        heading: "23/2/12 Trener 1-kurs for surfski",
        body: "Vedtak: Kursdeltakere kan søke ordinær klubbstøtte, kandidater oppfordres til å søke, enstemmig.",
      },
      {
        heading: "23/2/13 Styremøtedatoer høst 2023",
        body: "Vedtak: 29. august, 26. september, 17. oktober, 16. november, 12. desember, enstemmig.",
      },
    ],
  },
  {
    dateISO: "2023-04-11",
    dateDisplay: "11.04.2023",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Aagot Opheim, Ulf Stordalmo, Wolfgang Born, Chris Thomas Skogli (leder), Isabelle Sande, Anja Diez",
    attendeesOthers: "Kristian Rye, Magne Lysberg, Håvard Dahlen, André Berger, Anders Foldvik, Monica Engan Døhl",
    items: [
      { heading: "Godkjenning av forrige referat", body: "Referat godkjent, Chris Thomas referent. Ingen styremedlemmer meldte interessekonflikt." },
      { heading: "Kvartalsvis økonomistatus", body: "Kort oppdatering om innbetalt medlemskontingent, ingen andre saker å melde." },
      { heading: "Rapporterte sikkerhetshendelser", body: "Ingen rapporterte hendelser." },
      { heading: "Padletinget", body: "TKK representert av Chris Thomas Skogli, Aagot Opheim og Ulf Stordalmo. Styret hadde ingen innspill til padletinget." },
      { heading: "Fiberbredbånd til klubbhuset", body: "TKK har inngått en intensjonsavtale med NTE om fiberbredbånd. Installasjon kan starte i mai hvis andre Skansen-aktører deltar." },
      { heading: "Bryggearbeid", body: "Trondheim Havn rapporterte ingen nylige møter om flytting." },
      {
        heading: "Planlegging av nytt båthus",
        body: "Trondheim Havn anbefaler at planer for båthus avventes inntil plassering for brygge er permanent avgjort. Styret jobber videre for å unngå stillstand i prosessen.",
      },
      {
        heading: "Pirbadet – siste sesjoner",
        body: "NTNUI fjerner utstyr, polobåter blir værende. Vedtak: Kontakt Peter Boros om bookingvarighet og vurder rulle-kurs på onsdager. Håvard Dahlen ansvarlig for å undersøke muligheter.",
      },
      {
        heading: "Profesjonalisering av styrearbeidet",
        body: "Chris Thomas foreslår å planlegge styremøter 6 måneder frem og innføre et styreportal-system. Vedtak: Sette datoer for møter før og etter sommeren, Chris Thomas undersøker portalløsninger.",
      },
      {
        heading: "Representasjon idrettsrådets årsmøte",
        body: "Vedtak 1: Representanter er Anders Foldvik, Isabelle Sande, Kristian Rye, vara er Ulf Stordalmo og Chris Thomas Skogli. Vedtak 2: Chris Thomas formulerer forslag om parkeringstilgjengelighet på Skansen og utfordrer Trondheim Parkering om nødvendigheten av parkeringsavgift.",
      },
      { heading: "Natur og friluftsforbundet", body: "Chris Thomas videreformidler relevant informasjon til aktuelle grupper." },
      {
        heading: "Årskalender – kommende oppgaver",
        body: "Vårdugnad (22. april): André annonserer via Facebook, sosialgruppen ordner forfriskninger, publisering på nettside tildelt. Splash-arrangement: iSonen-lokasjon, Chris Thomas organiserer, grilling der deltakere tar med egen mat.",
      },
      {
        heading: "Eventuelt",
        body: "Vedlikehold: Dykkerklubben rapporterer renholdsproblemer og usikrede dører. Vedtak: Chris Thomas forhandler avtale med TFK som vedtas på neste styremøte. Kommende møter: 10.05 kl. 18.00 og 13.06 kl. 18.00, høstmøter velges 13. juni.",
      },
    ],
  },
  {
    dateISO: "2023-03-14",
    dateDisplay: "14.03.2023",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Chris Thomas Skogli (leder), Aagot Opheim (varaleder), Ulf Stordalmo, Olav-Magnar Nes (vara), Anja Diez (kasserer)",
    attendeesOthers: "Kristian Rye (elvesjef), Håvard Dahlen (sosialsjef), André Berger",
    items: [
      { heading: "Kort møte etter årsmøtet", body: "Styret hadde et kort møte like etter årsmøtet for å vedta noen saker som var nødvendig." },
      { heading: "Neste styremøte med middag", body: "Vedtak om å holde måltid på Skansen, innkalling sendes før eller etter påske." },
      { heading: "Ny hussjef", body: "André Sæther Berger er ny hussjef." },
      { heading: "Ny sosialsjef", body: "Håvard Dahlen har fungert som sosialsjef siden høsten 2022. Han vedtas nå som sosialsjef." },
      { heading: "Ny flaggstang", body: "Olav-Magnar fikk i oppgave å bestille ny flaggstang." },
      { heading: "Representasjon padletinget", body: "Chris Thomas, Aagot og Ulf er representanter for TKK på padletinget. Wolfgang blir observatør." },
    ],
  },
  {
    dateISO: "2023-02-28",
    dateDisplay: "28.02.2023",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Monica Engan Døhl, Aagot Opheim, Olav-Magnar Nes (vara), Wolfgang Born, Chris Thomas Skogli (leder)",
    attendeesOthers: "Kristian Rye (elvesjef), Magne Lysberg (medlemsansvarlig), Håvard Dahlen (sosialsjef)",
    items: [
      { heading: "Godkjenning av referat og valg av referent", body: "Referat godkjent og Chris Thomas referent." },
      {
        heading: "Årsmøtet",
        body: "Gjennomgang av innkomne saker (forslag fra Tor Eirik Sommernes). Gjennomgang av styresaker inkludert organisasjonsendringer, vedtektsendringer og kontingentforslag. Styret foreslår ingen endring i kontingent. Gjennomgang av årsrapport med vekt på internasjonal deltakelse og ekstremsportveko. Gjennomgang av budsjett og årsregnskap. Innstilling fra valgkomiteen.",
      },
      { heading: "Påminnelser årskalender", body: "Frister inkluderer forslag til padleting (17. mars), medlemskontingent, lagringsleie for utstyr, kurspublisering (31. mars) og søknad om badetid." },
      { heading: "Økonomi", body: "Ingen saker å melde." },
      { heading: "Rapporterte sikkerhetshendelser", body: "Ingen hendelser rapportert." },
      { heading: "Padletinget", body: "Vedtak utsatt til styremøte etter årsmøtet." },
      { heading: "Tilbud om fiberbredbånd", body: "Går ikke for tilbudet, men ser på trådløst bredbånd." },
      { heading: "Nytt lager-/båthus", body: "Utsatt." },
      { heading: "Bryggearbeid", body: "Avventer svar fra Trondheim Havn." },
      { heading: "Nettside og medlemsregister", body: "Statusoppdatering gitt." },
      { heading: "Reolplasser", body: "Fjernet fra offentlig protokoll." },
      { heading: "Eventuelt", body: "Ingen saker tatt opp." },
    ],
  },
  {
    dateISO: "2023-01-26",
    dateDisplay: "26.01.2023",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Ulf Stordalmo, Monica Engan Døhl, Aagot Opheim, Olav-Magnar Nes (vara), Wolfgang Born, Chris Thomas Skogli",
    attendeesOthers: "Kristian Rye (elvesjef), Magne Lysberg (medlemsansvarlig), Håvard Dahlen (sosialsjef)",
    items: [
      { heading: "Godkjenning og referent", body: "Referat godkjent og Chris Thomas referent." },
      { heading: "Årskalender", body: "Budsjett og innkalling til årsmøte må utarbeides." },
      { heading: "Økonomi", body: "Så raskt på foreløpig regnskap for 2022." },
      {
        heading: "Rapporterte sikkerhetshendelser",
        body: "Én hendelse rapportert. Chris Thomas påminnet Sofie om å gjennomføre risikovurderinger for årets arrangementer, inkludert landaktiviteter.",
      },
      { heading: "HMS-retningslinjer", body: "HMS-dokumenter for søndagsturer er fullført og publisert på anleggene." },
      {
        heading: "Saker til årsmøtet",
        body: "Organisasjonsendringer og aldersbasert differensiering av turkrav (75 år nedjustert til 10 turer) til videre diskusjon.",
      },
      { heading: "Nytt bygg/båthus", body: "Kort statusoppdatering fra arbeidsgruppen." },
      { heading: "Bryggeutvikling", body: "Klubben vurderer overtakelse, avhenger av Roklubbens flytting." },
      { heading: "Nettside og medlemsregister", body: "Statusoppdatering gitt." },
      { heading: "Lyd-/videoutstyr", body: "Chris Thomas kan kjøpe inn en liten bordhøyttaler." },
      { heading: "Eventuelt", body: "Sak om lagringsplass (unntatt offentlighet)." },
    ],
  },
  {
    dateISO: "2022-12-15",
    dateDisplay: "15.12.2022",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Ulf Stordalmo, Olav-Magnar Nes, Chris Thomas",
    attendeesOthers: "Kristian Rye (elvesjef), Magne Lysberg (medlemsansvarlig), Anders Foldvik (juniorleder)",
    items: [
      { heading: "Godkjenning av forrige referat", body: "Forrige protokoll godkjent, Chris Thomas utpekt som referent." },
      {
        heading: "Gjennomgang av årskalender",
        body: "Vedtak: Elektronisk medlemsregister sendes til Norges idrettsforbund innen 31. desember. Vedtak om å opprette en årskalender for anleggsdrift.",
      },
      { heading: "Økonomi", body: "Ingen saker å melde." },
      { heading: "HMS-hendelser", body: "Ingen HMS-hendelser rapportert." },
      {
        heading: "Sikkerhet på søndagsturer",
        body: "HMS-utvalget arbeider videre med en samlet HMS-plan. I mellomtiden settes det opp en enkel oppslagslapp med 3–5 punkter for turer fra Skansen, inkludert QR-kode til værinformasjon.",
      },
      { heading: "Kandidater til padleforbundets styre", body: "Iht. brev fra valgkomiteen; eksisterende vedtak om å kontakte to kandidater." },
      {
        heading: "Leieavtaler",
        body: "NTNUI: Styret støtter tettere samarbeid, leiekontrakt utarbeides til neste møte. Nidaros Roklubb: Nytt leieforslag under vurdering. Pingvin: Leie økt fra 700 til 800 kr/måned, arrangementsavgift fra 2000 til 2500 kr.",
      },
      { heading: "Organisasjonsstruktur", body: "Forslag om ekstra styremedlem og kontaktperson godkjent." },
      {
        heading: "Eventuelt",
        body: "Tilbud på varmeanlegg godkjent for vurdering. Flattvann ønsker vintertreningsfasiliteter for ungdom (padlemaskiner). Aktive padlere ber om fast reolplass for helårstilgang fra Skansen.",
      },
    ],
  },
  {
    dateISO: "2022-11-17",
    dateDisplay: "17.11.2022",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Chris Thomas Skogli, Monica Engan Døhl, Ulf Stordalmo, Wolfgang Born, Aagot Opheim, Olav-Magnar Nes",
    attendeesOthers: "Kristian Rye, Anders Foldvik, Magne Lysberg",
    items: [
      { heading: "Godkjenning av referat og valg av referent", body: "Forrige referat godkjent, Chris Thomas valgt som referent." },
      { heading: "Gjennomgang av årskalender", body: "Henvisning til årskalenderen for kommende oppgaver." },
      { heading: "Økonomi", body: "Ingen saker å melde." },
      { heading: "Rapporterte HMS-hendelser", body: "Én hendelse rapportert vedrørende elvepadling. Vedtak: HMS-saken legges ut så fort klubben har funnet en løsning." },
      {
        heading: "HMS-retningslinjer for søndagsturer",
        body: "Tidligere pålagt enkelt oppslag er nå utvidet. HMS-gruppen utvikler en samlet sikkerhetsplan, foreløpig oppslag med 3–5 punkter for turer fra Skansen publiseres.",
      },
      { heading: "Nytt reolbygg på Skansen/brygga", body: "Ikke behandlet på dette møtet." },
      { heading: "Innkjøp av A3-lamineringsmaskin", body: "Vedtak: Ulf kjøper maskin til klubbhuset." },
      { heading: "Turledelse-guide", body: "Vedtak: Ferdig versjon publiseres på nettsiden, Chris Thomas koordinerer med Per Erling." },
      { heading: "Kandidater til padleforbundets styre", body: "Vedtak: Chris Thomas kontakter de to identifiserte kandidatene." },
      { heading: "Parkering (informasjon)", body: "Pingvin har tatt initiativ til et felles brev til kommunen, TKK støtter initiativet." },
      { heading: "Krabbeklo-utmerkelsen", body: "Vedtak: Leiv Budal tildeles klubbens fortjenestemedalje Krabbeklo." },
      { heading: "Leieavtaler", body: "Vedtak: Styret støtter tettere samarbeid med NTNUI, leiekontrakt utarbeides til neste møte. Alle leieavtaler skal gjennomgås." },
      { heading: "Sak unntatt offentlighet", body: "Ikke detaljert." },
      {
        heading: "Eventuelt",
        body: "Ventelistepraksis for reolplass: nytt vedtak om å fjerne søkere ved første avslag. HMS-gruppen har som mål å være ferdig før årsmøtet.",
      },
    ],
  },
  {
    dateISO: "2022-10-06",
    dateDisplay: "06.10.2022",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Chris Thomas Skogli, Ulf Stordalmo, Olav-Magnar Nes, Wolfgang Born",
    attendeesOthers: "Fernando Perez-Fernandez (flattvannssjef), Kristian Rye (elvesjef), Magne Lysberg (medlemsansvarlig), Håvard Engen (gjest, sak 2)",
    items: [
      { heading: "Godkjenning av referat og valg av referent", body: "Referat godkjent, Chris Thomas valgt som referent." },
      {
        heading: "HMS for organiserte turer",
        body: "Håvard Engen presenterte tanker om HMS-prosess. Vedtak: Klubben setter ned et utvalg som skal jobbe videre med TKK-HMS, med Engen som prosessleder, Ulf som styrerepresentant, Kristian Rye og Christine Valan om interessert.",
      },
      { heading: "Økonomi", body: "Ingen saker å melde." },
      { heading: "Rapporterte HMS-hendelser", body: "Ingen rapportert." },
      {
        heading: "HMS-retningslinjer for søndagsturer",
        body: "Vedtak om å holde turene uorganiserte, men lage et informasjonsdokument om HMS-hensyn for oppslag på Skansen og nettsiden. Ulf og Aagot forbereder.",
      },
      {
        heading: "Nytt reolbygg på Skansen",
        body: "Kommunen svarte positivt. Vedtak om å etablere en komité (Chris, Wolfgang, Olav-Magnar ved behov) for å utarbeide konkret forslag med tegninger, kostnadsoverslag og finansiering.",
      },
      { heading: "Turledelse-guide", body: "Utsatt." },
      { heading: "Beholde reolplass", body: "To medlemmer godkjent for å beholde plass selv uten å oppfylle 15-turskravet, av medisinske årsaker." },
      {
        heading: "Nettside, medlemssystem, arrangementer",
        body: "Vedtak om å støtte forslag om å gå fra Spoortz til NIF-tjenester (MinIdrett/iSonen) og utvikle en enkel nettside.",
      },
      { heading: "Anleggsprioriteringer", body: "Utsatt." },
      { heading: "Parkering", body: "Chris Thomas forespurte Trondheim Havn, men fikk ikke svar om endringer i parkeringsreguleringen." },
      { heading: "A3-lamineringsmaskin", body: "Godkjent for innkjøp hvis prisen er rimelig." },
      { heading: "Eventuelt – førstehjelpsutstyr", body: "Ulf sjekker og kjøper utstyr til alle lokasjoner (Skansen, polo, Østmarkneset, Jonsvatnet)." },
    ],
  },
  {
    dateISO: "2022-08-18",
    dateDisplay: "18.08.2022",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Monica, Ulf, Olav-Magnar, Magne, Wolfgang, Chris Thomas, Kristian, Eirin",
    items: [
      { heading: "Godkjenning av referat og valg av referent", body: "Referat godkjent, Chris Thomas valgt som referent." },
      { heading: "Økonomisk status", body: "Chris Thomas presenterte økonomisk orientering for august 2022." },
      { heading: "Rapporterte HMS-hendelser", body: "Ingen nye hendelser rapportert." },
      { heading: "HMS-retningslinjer for søndagsturer", body: "Mål om å være ferdig før septembermøtet, arbeid pågår." },
      { heading: "HMS for organiserte turer med turledere", body: "Skrives sammen med turledelse-guiden, Håvard Engen vil bidra." },
      { heading: "Turledelse-guide", body: "Krever delegering. Vedtak: Styret rådfører seg med Bård og Astrid." },
      {
        heading: "Organisasjonsutvikling",
        body: "Styret begynner å se på organisasjonsstruktur, gruppeorganisering, aktuelle roller og hvilke posisjoner som krever valg versus styreoppnevning. Mål: ferdig før januarmøtet, til neste årsmøte.",
      },
      { heading: "Søknad om å beholde reolplass", body: "Skadet medlem kan ikke oppfylle 15-turskravet og ber om unntak. Vedtak: Godkjent uten krav om turoppfyllelse." },
      {
        heading: "Deltakelse i konkurranser",
        body: "Fernando tok opp spørsmål om kostnadsdekning for unge padlere i konkurranser. Vedtak: Klubben dekker reise, opphold og startkontingent for deltakere pluss én leder/trener (kun juniorarrangementer), innen rimelige grenser, med forhåndsgodkjenning fra ledelsen.",
      },
      { heading: "Honorar for kursinstruktører", body: "Vedtak: Øke grunnkursets instruktørtimer fra 16 til 18, fra 2023." },
      { heading: "Regler for kursavlysning", body: "Gjennomgang av eksisterende refusjonspolicy. Vedtak: Ingen endring av gjeldende retningslinjer." },
      { heading: "Overgang til Spoortz-systemet", body: "Chris Thomas møter Wolfgang og Reidar om tidsplan, datamigrering og opplæring for nytt system." },
      { heading: "Tilsynslister for grupper", body: "Vedtak: Trine og Eirin gjennomgår eksisterende lister under havpadlingsgruppen." },
      { heading: "Digitalt loggsystem", body: "Presentasjon av Padleboken-systemet mottatt. Vedtak: Utsatt." },
      { heading: "Turer", body: "Begrenset høstaktivitet utenom Rangøya-samling, behov for flere frivillige turledere. Vedtak: Chris Thomas lager delt mappe for turinformasjon." },
      { heading: "Ny flaggstang på Skansen", body: "Stangen knakk 1. mai. Vedtak: Ulf innhenter pristilbud, styret vurderer sikrere plassering." },
      { heading: "Skap på Østmarkneset", body: "Nåværende skap mangler funksjonalitet. Forespørsel om sikker oppbevaring av verdisaker. Vedtak: Må avklares med dykkerklubben, søker seks skap om mulig." },
      { heading: "Gulvmatter", body: "Vedtak: Ulf tar seg av matter i første etasje." },
      { heading: "Ny grill", body: "Vedtak: Ulf kjøper tønnegrill hvis prisen er akseptabel." },
      { heading: "Parkering", body: "Chris Thomas venter på svar fra Trondheim Havn om endringer i parkeringsreguleringen." },
      { heading: "Eventuelt – Arne Røysets Froan-tur", body: "Styret godkjenner basert på lederkompetanse, HMS-skjema kreves." },
      { heading: "Eventuelt – Trøndelagsrunden", body: "Styret støtter at TKK tar permanent ansvar under elvepadlingsgruppen." },
      { heading: "Eventuelt – utlånsregler drysuit", body: "Medlemmer som fullfører grunnkurset kan låne i fem uker etter kurset, elvesjef håndhever overholdelse." },
      { heading: "Eventuelt – tilgang til Rull og Tull", body: "Åpent for elvepadlere som har eller lærer redningsferdigheter." },
    ],
  },
  {
    dateISO: "2022-06-16",
    dateDisplay: "16.06.2022",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Ulf, Monica, Aagot, Magne, Kristian, Wolfgang, Chris Thomas",
    items: [
      { heading: "Godkjenning av referat og valg av referent", body: "Referat godkjent, Chris Thomas valgt som referent." },
      {
        heading: "HMS",
        body: "Løpende arbeid med HMS-skriv for søndagsturer og beskrivelse av HMS for organiserte turer. Målet er et registreringssystem for hendelser klart til septembermøtet. Ingen nye hendelser rapportert.",
      },
      { heading: "Økonomi", body: "Ingen saker til diskusjon." },
      { heading: "Hus/anlegg", body: "Styret søker hussjef via annonsering. Oppdatert utleieprosedyre og leiekontraktmal godkjent." },
      { heading: "Skansen – verksted", body: "Ulf presenterte planer, styret støtter hans foreslåtte tilbakemelding til Ruben, videre dialog mellom anleggsgruppen og Ruben." },
      {
        heading: "Ny brygge",
        body: "Styret godkjente planer for ny brygge forutsatt: deling av gebyrer med kommersielle aktører, full inn- og utgang for kajakker, kommunal dekning av kostnader, årlig TSF-avgift opp til 7000 kr, proporsjonal kostnadsdeling basert på medlemstall, og TKK-representasjon i TSF Havn AS sitt styre.",
      },
      {
        heading: "Eventuelt",
        body: "Parkeringsavgift gjelder nå hele døgnet. Chris Thomas kontakter havnemyndighetene. Port ved Østmarkneset vil kreve ledertilgang. Trondheim Roklubb avslo anleggsdeling på Jonsvatnet, TKK utforsker alternativer.",
      },
    ],
  },
  {
    dateISO: "2022-05-03",
    dateDisplay: "03.05.2022",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Anders Foldvik, Ulf Stordalmo, Eirin Malmo, Monica Engan Døhl, Hilde M. Domaas, Magne Lysberg, Wolfgang Born, Kristian Rye, Chris Thomas Skogli, Aagot Opheim, Callum Sinclair",
    items: [
      { heading: "Godkjenning av referat og valg av referent", body: "Forrige referat godkjent, Chris Thomas utpekt som ny referent." },
      {
        heading: "HMS",
        body: "Oppfølgingspunkter: oppdatere nettsiden om mørk vannpadling i Nidelva (utsatt til høsten), HMS-arbeid for klubbturer og søndagsturer tildelt Ulf og Aagot i samarbeid med fagsjefer. Ingen nye hendelser rapportert.",
      },
      { heading: "Økonomi", body: "Kort gjennomgang av 1. kvartal. Diskusjon om husleieprosedyre og betaling, Chris Thomas og Monica møtes." },
      { heading: "Hussjef", body: "Rollebeskrivelse gjennomgått, behov for midlertidig stedfortreder for hussjefrollen." },
      {
        heading: "Padlefestival",
        body: "Aagot ga oppdatering om planleggingen. Vedtak: Middagssted endret til Lille Skansen (40 personer). Forslag om premie til klubbmesterskapet: utstyr egnet for padleturer.",
      },
      { heading: "Eventuelt", body: "Sak oppført, men ingen detaljer gitt i protokollen." },
    ],
  },
  {
    dateISO: "2022-03-22",
    dateDisplay: "22.03.2022",
    time: "18:00",
    location: "Skansen",
    attendeesBoard: "Anders, Ulf, Eirin, Monica, Hilde, Magne, Wolfgang, Kristian, Chris Thomas, Aagot, Callum",
    items: [
      { heading: "Godkjenning av referat og valg av referent", body: "Forrige referat godkjent, Chris Thomas valgt som referent." },
      {
        heading: "HMS",
        body: "Oppdatere nettsiden med informasjon om nattpadling i Nidelva. Dokumentere eventuelle rapporterte hendelser. Starte HMS-arbeid for klubbturer og søndagsturer (Ulf og Aagot ansvarlig, med fagsjefer involvert).",
      },
      {
        heading: "Økonomi",
        body: "Dokumentasjon for 1. kvartal ikke fullført, ingen driftsmessige bekymringer. Gjennomgang av husleiepriser: ny sats satt til 2500 kr per døgn for medlemmer, erstatter «arrangement»-terminologien. Begrunnelse: nåværende priser under markedsnivå, årlige driftskostnader for huset er omtrent 200 000 kr.",
      },
      { heading: "Handlingsplan 2022", body: "Handlingsplanen godkjent." },
      { heading: "Valg av politiattest-koordinator", body: "Hilde Mailen Domaas utnevnt, Chris Thomas som vara." },
      { heading: "Barneidrettskoordinator", body: "Anders Foldvik utnevnt." },
      { heading: "Søk etter hussjef", body: "Ingen kandidater innmeldt, posisjonen er fortsatt presserende." },
      { heading: "Innføring av «Mitt Varsel»-systemet", body: "System godkjent for hendelsesrapportering og oppfølgingshåndtering i klubben." },
      { heading: "Medlemsmøte: Leif Toftes 80-årsdag", body: "Planlagt 30. mars, Aagot ordner forfriskninger, Wolfgang bidrar med bildepresentasjon." },
      { heading: "Passion for Ocean-festivalen", body: "Kolliderer med padlefestivalen, klubben avslo deltakelse." },
      {
        heading: "Eventuelt",
        body: "Dugnad: Ulf koordinator, 27. april for reolinspeksjon, 30. april ordinær dugnad. DNT ungdomskurs: søker frivillige aktivitetsledere fra medlemsmassen. Førstehjelpskurs: Ulf organiserer for aktivitetsledere. Medlemsregister: oppretthold gjeldende gruppetilhørighet.",
      },
    ],
  },
  {
    dateISO: "2022-02-14",
    dateDisplay: "14.02.2022",
    time: "18:00",
    location: "Skansen og online",
    attendeesBoard: "Heidi, Magne, Judith, Aagot, Ulf, Monica, Chris Thomas, Trine, Sofie, Callum, Fernando, Egil",
    items: [
      { heading: "Godkjenning av forrige referat", body: "Godkjent uten merknader." },
      { heading: "Valg av referent", body: "Chris Thomas valgt." },
      {
        heading: "Forberedelser til årsmøtet",
        body: "Årsregnskapet skal underskrives av alle styremedlemmene og ble deretter signert. Budsjettforslaget ble godkjent. Styret uttrykte tilfredshet med årsmeldingen, forslaget ble vedtatt. Styret støttet endringer i organisasjonsplanen. Styret støttet Andrés forslag og innarbeidet det i budsjettet. Enighet om kandidater fra valgkomiteen. Styreleder: kontakt Anna Ølnes eller Andreas Enge som alternativer.",
      },
      { heading: "HMS", body: "Ingen tilbakemeldinger på dette møtet." },
      { heading: "Økonomi", body: "Ingen kommentarer på dette møtet." },
      { heading: "Leif Toftes 80-årsdag", body: "Styret vedtok å gi ham en gave." },
      { heading: "Kajakkfestival", body: "Ingen diskusjon i dag." },
      { heading: "Eventuelt", body: "Ingen saker registrert." },
    ],
  },
  {
    dateISO: "2022-01-18",
    dateDisplay: "18.01.2022",
    time: "18:00",
    location: "Online",
    attendeesBoard: "Ulf Stordalmo, Aagot Opheim, Magne Lysberg, Chris Thomas Skogli, Egil Storrusten, Trine Cecilie Bjørhusdal, Monica Engan Døhl, Judith van Hagen",
    attendeesOthers: "Anna Ølnes fra valgkomiteen deltok fram til og med sak 3",
    items: [
      { heading: "Godkjenning av referat fra forrige styremøte", body: "Godkjent uten merknader." },
      { heading: "Valg av referent", body: "Ulf valgt som referent." },
      {
        heading: "Valgkomiteen",
        body: "Leder Anna Ølnes orienterte: 28 verv skal på plass. Komiteen skal sende mail til medlemmer og arbeide videre med rekruttering. Diskusjon om organisasjonsplanen og muligheten for styret til å få fullmakt til å erstatte fagsjefer som trekker seg i løpet av perioden.",
      },
      {
        heading: "HMS",
        body: "Aagot og Ulf presenterte forslag om å legge ut hendelsesrapporter på hjemmesiden. Styret oppfordres til å publisere rapporter. Wolfgang skal håndtere teknisk implementasjon.",
      },
      { heading: "Økonomi", body: "Chris presenterte statusrapport." },
      {
        heading: "Forberedelser til årsmøtet",
        body: "Chris gjennomgikk tidsplan, budsjett, årsmelding og foreslåtte endringer av organisasjonsplanen og vedtekter.",
      },
      {
        heading: "Kajakkfestival",
        body: "Planlagt 4. juni 2022 som jubileumsfest. Diskusjon om navneendring til «Padlefestival», aktiviteter ved klubbhuset og partytelt. Styret skal organisere en arrangementskomité etter årsmøtet.",
      },
      { heading: "Mulighet for nye kajakkreoler", body: "Chris orienterte." },
      { heading: "Statkraft, TOFA og slalåmporter", body: "Chris orienterte." },
      { heading: "Hus", body: "Hussjef var fraværende." },
      { heading: "TT-grunnkurs for hav", body: "Havsjefen viste interesse for kurs i april 2022 for ca. 15 ungdommer. Arrangementet kan gi økt rekruttering av unge til klubben." },
      { heading: "Google Chat", body: "Vi dropper forslaget om å gå over til å bruke Google Chat." },
      { heading: "Eventuelt", body: "Havsjefen foreslo å etablere en materialforvalterfunksjon for to av klubbens anlegg, med rollebeskrivelse i organisasjonsplanen." },
    ],
  },
];
