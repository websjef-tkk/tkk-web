import Image from "next/image";
import Link from "next/link";

const SESSIONS = [
  {
    emoji: "🌀",
    title: "Teknikk- og rulletrening",
    text: "Onsdager kl. 21:00–22:30 i bølgebassenget. Åpen for alle medlemmer i TKK — ingen påmelding nødvendig. Maks 12 kajakker i vannet; maks 6 når bølgemaskinen er på. Garderobene åpner 30 min før og stenger 30 min etter. Alle må forlate bygningen innen kl. 23:00.",
  },
  {
    emoji: "🏐",
    title: "Kajakkpolo",
    text: "Torsdager kl. 21:00–22:30 i den dype delen av idrettsbassenget. Åpen for alle TKK-medlemmer. Påmelding via Spond-appen er obligatorisk.",
  },
  {
    emoji: "🌱",
    title: "Juniortrening",
    text: "Lørdager kl. 19:00–20:30 i bølgebassenget. For medlemmer under 20 år. Gjester fra samarbeidende klubber er velkomne. Ingen påmelding nødvendig.",
  },
];

export default function PirbadPage() {
  return (
    <article>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src="/images/hav.jpg" alt="Pirbadet" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold">Pirbadet</h1>
          <p className="text-tkk-blue font-semibold mt-1">Padleglede for alle!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-12">
          TKK holder regelmessige treningsøkter i Pirbadet gjennom vintersesongen — fra midten av oktober
          til slutten av april (unntatt påskeuka). Her trener alle gruppene: teknikk og rulletrening for
          hav, kajakkpolo og junior.
        </p>

        <div className="w-8 border-t-2 border-teal mb-3" />
        <h2 className="font-display font-bold text-navy text-2xl mb-6">Treningsprogram</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {SESSIONS.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border-t-4 border-tkk-blue shadow-sm p-5">
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h3 className="font-display font-bold text-navy text-lg mb-2">{s.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-mist rounded-xl border border-mist p-6">
          <div className="w-8 border-t-2 border-teal mb-3" />
          <h2 className="font-display font-bold text-navy text-xl mb-2">Viktige regler</h2>
          <p className="text-slate leading-relaxed">
            Alt utstyr skal skylles grundig med ferskvann etter trening. Når bølgemaskinen er i drift skal
            én person overvåke nødstoppknappen til enhver tid.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/padling/polo"
            className="inline-block border border-navy text-navy font-semibold px-5 py-2.5 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            Om kajakkpolo →
          </Link>
          <Link
            href="/padling/junior"
            className="inline-block border border-navy text-navy font-semibold px-5 py-2.5 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            Om juniorgruppen →
          </Link>
        </div>
      </div>
    </article>
  );
}
