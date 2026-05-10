export type BlogPost = {
  slug: string;
  date: string;
  category: string;
  imageNo?: string;
  imageEn?: string;
  imageSrc?: string;
  imageAlt: string;
  titleNo: string;
  titleEn: string;
  summaryNo: string;
  summaryEn: string;
  bodyNo: string;
  bodyEn: string;
  author?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "sommertur-bohuslan-2026",
    date: "2026-04-14",
    category: "tur",
    imageSrc: "/images/bohuslan.jpg",
    imageAlt: "Havpadling i Bohuslän",
    titleNo: "Infomøte om sommertur til Bohuslän",
    titleEn: "Information meeting: Summer tour to Bohuslän",
    summaryNo: "Styret inviterer til infomøte på klubbhuset 14. april kl. 18:30 om sommerens store havpadletur til Bohuslän (25. juli – 1. august).",
    summaryEn: "The board invites members to an information meeting at the clubhouse on April 14 at 18:30 about the summer sea kayaking tour to Bohuslän (July 25 – August 1).",
    bodyNo: `Kom på infomøte om sommertur til Bohuslän! Møtet holdes på klubbhuset på Skansen, **mandag 14. april kl. 18:30**.

Turen går fra lørdag 25. juli til lørdag 1. august. Turorganisator Ulf beskriver turen som preget av "fine naturopplevelser, passe lange dager i kajakken, cafebesøk, bading og episke solnedganger".

Møtet passer like godt for deg som er ny og nysgjerrig på Bohuslän-skjærgården, som for deg som har vært med før og vil høre mer om årets opplegg.

**Påmelding til selve turen åpner 20. april.**

Vel møtt!`,
    bodyEn: `Come to the information meeting about the summer tour to Bohuslän! The meeting is held at the clubhouse at Skansen, **Monday April 14 at 18:30**.

The trip runs from Saturday July 25 to Saturday August 1. Tour organiser Ulf describes the trip as "beautiful nature experiences, comfortably long days on the water, café visits, swimming and epic sunsets".

The meeting is equally suited to those new and curious about the Bohuslän archipelago and those who have joined before and want to hear about this year's plans.

**Registration for the trip opens April 20.**

Welcome!`,
    author: "Styret",
  },
  {
    slug: "hensyn-til-dyr-og-fugleliv",
    date: "2026-04-10",
    category: "info",
    imageSrc: "/images/hero.jpeg",
    imageAlt: "Sporløs ferdsel i naturen",
    titleNo: "Slik tar du hensyn til dyr- og fugleliv på tur",
    titleEn: "How to respect wildlife and birdlife on your trips",
    summaryNo: "Styret oppfordrer alle padlere til sporløs ferdsel og til å ta hensyn til fugle- og dyreliv — særlig i hekkesesongen fra 15. april.",
    summaryEn: "The board encourages all paddlers to practise leave-no-trace principles and respect wildlife — especially during nesting season from April 15.",
    bodyNo: `Styret ber alle medlemmer om å praktisere sporløs ferdsel og ta hensyn til fugle- og dyreliv når dere paddler, lander og camper — særlig i vårsesongen.

Trondhjemsfjorden og Trøndelagskysten har mange verneområder og ferdselsrestriksjoner som vi som padlere må kjenne til.

**Om sjøfugl og hekking**

Omtrent en fjerdedel av alle europeiske sjøfugler hekker i Norge. For å gi dem uforstyrrede hekkebetingelser gjelder ferdselsrestriksjoner nær sårbare hekkeplasser fra **15. april** på en rekke øyer og skjær langs kysten.

**Hva skal du gjøre?**

- Sjekk Miljødirektoratets kart over fredningsområder før du planlegger turen: [miljodirektoratet.no](https://www.miljodirektoratet.no/vev/ferdselsforbud/)
- Hold avstand til fuglene — forlat et sted raskt og stille hvis fuglene viser stress
- Turledere bør alltid gjennomgå gjeldende restriksjoner i planleggingen

Foto: Ulf Stordalmo`,
    bodyEn: `The board asks all members to practise leave-no-trace principles and respect wildlife and birdlife when paddling, landing and camping — especially during spring season.

The Trondheim Fjord and Trøndelag coast have many protected areas and travel restrictions that we as paddlers need to be aware of.

**About seabirds and nesting**

Approximately one quarter of all European seabirds nest in Norway. To provide undisturbed breeding conditions, travel restrictions apply near vulnerable nesting sites from **April 15** on a number of islands and skerries along the coast.

**What should you do?**

- Check the Norwegian Environment Agency's map of protected areas before planning your trip: [miljodirektoratet.no](https://www.miljodirektoratet.no/vev/ferdselsforbud/)
- Keep your distance from birds — leave a spot quickly and quietly if birds show signs of stress
- Tour leaders should always review current restrictions when planning

Photo: Ulf Stordalmo`,
    author: "Styret",
  },
  {
    slug: "arsmote-2026",
    date: "2026-02-24",
    category: "klubb",
    imageSrc: "/images/hav.jpg",
    imageAlt: "Padlere på vei ut",
    titleNo: "Årsmøtet utsettes til 3. mars",
    titleEn: "Annual meeting postponed to March 3",
    summaryNo: "Grunnet vannmangel på Skansen utsettes årets årsmøte med én uke til tirsdag 3. mars kl. 18:00 på klubbhuset.",
    summaryEn: "Due to water shortage at Skansen, this year's annual meeting is postponed one week to Tuesday March 3 at 18:00 at the clubhouse.",
    bodyNo: `Årets årsmøte er utsatt med én uke til **tirsdag 3. mars 2026 kl. 18:00** på klubbhuset på Skansen (Nedre Ila 12).

Bakgrunnen er vannmangel på Skansen som rammer flere klubber i lokalet. Vi varslet kommunen, men hadde ikke tilstrekkelig sikkerhet for tilgang til nødvendige fasiliteter som toalett og kjøkken til det opprinnelige tidspunktet.

**Saksliste:**
- Ordinære saker og valg
- Presentasjon av Erasmus Wave-prosjektet (Water Activities for Vital Energy)
- Utdeling av NPF-distansemerker for 2025
- Sosialt samvær med bevertning

**Møterett:** Medlemmer som har vært innmeldt minst én måned, er minst 15 år i valgåret, og har gjort opp sine økonomiske forpliktelser til klubben.

Vel møtt!`,
    bodyEn: `This year's annual meeting has been postponed by one week to **Tuesday March 3, 2026 at 18:00** at the clubhouse at Skansen (Nedre Ila 12).

The reason is a water shortage at Skansen affecting several clubs in the facility. We notified the municipality but did not have sufficient certainty about access to essential facilities such as toilets and kitchen in time for the original date.

**Agenda:**
- Standard business and elections
- Presentation of the Erasmus Wave project (Water Activities for Vital Energy)
- Distribution of NPF distance badges for 2025
- Social gathering with refreshments

**Voting eligibility:** Members enrolled at least one month, at least 15 years old in the election year, and with settled financial obligations to the club.

Welcome!`,
    author: "Styret",
  },
  {
    slug: "sesongapning-avplask-2026",
    date: "2026-04-28",
    category: "sosial",
    imageSrc: "/images/hav.jpg",
    imageAlt: "Sesongåpning på Skansen",
    titleNo: "AVPLASK — sesongåpning 1. mai!",
    titleEn: "AVPLASK — season opening May 1!",
    summaryNo: "Tradisjonell sesongåpning på Skansen 1. mai kl. 12:00. Alle er velkomne — ta med kajakken og godt humør!",
    summaryEn: "Traditional season opening at Skansen on May 1 at 12:00. Everyone is welcome — bring your kayak and good spirits!",
    bodyNo: `Sosialgruppas store vårbegivenhet er her: **AVPLASK** markerer starten på paddlesesongen og holdes som alltid **1. mai kl. 12:00 på Skansen**.

Hva skjer? Vi samles, setter ut kajakkene, og runder av med god mat og drikke. Det er en fin anledning til å møte nye og gamle padlevenner etter vinterens bassengtrening.

Alle nivåer er velkomne — fra nybegynnere til veteraner. Familiepaddling er inkludert!

Arrangement av sosialgruppen. Spørsmål rettes til Håvard Dahlen (970 79 822).`,
    bodyEn: `The social group's big spring event is here: **AVPLASK** marks the start of the paddling season and is held as always on **May 1 at 12:00 at Skansen**.

What happens? We gather, launch the kayaks and finish with good food and drink. It is a great opportunity to meet new and old paddling friends after winter's pool training.

All levels are welcome — from beginners to veterans. Family paddling is included!

Organised by the social group. Questions to Håvard Dahlen (970 79 822).`,
    author: "Sosialgruppen",
  },
];
