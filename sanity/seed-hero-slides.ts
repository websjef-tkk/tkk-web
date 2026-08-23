/**
 * Fyller `siteSettings.heroSlides` med dagens forsidebilde, slik at karusellen
 * har innhold fra første stund. Bilde nummer to legges inn av klubben selv i
 * Sanity Studio.
 *
 * Skriptet gjør ingenting dersom det allerede ligger bilder der, så det er
 * trygt å kjøre flere ganger.
 *
 * Kjør: npx tsx sanity/seed-hero-slides.ts
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const IMAGE_PATH = "public/images/hav.jpg";

async function main() {
  const existing = await client.fetch<{ heroSlides?: unknown[] } | null>(
    `*[_id == "siteSettings"][0]{ heroSlides }`
  );

  if (existing?.heroSlides?.length) {
    console.log(`Forsidekarusellen har allerede ${existing.heroSlides.length} bilde(r) — rører den ikke.`);
    return;
  }

  const asset = await client.assets.upload("image", readFileSync(IMAGE_PATH), {
    filename: "forside-havpadling.jpg",
  });

  await client
    .patch("siteSettings")
    .set({
      heroSlides: [
        {
          _key: "slide1",
          _type: "heroSlide",
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: "Havpadling på Trondhjemsfjorden",
          },
          title: "Padleglede i Trondheim",
          subtitle: "Trondhjems Kajakklubb — et aktivt fellesskap for alle nivåer siden 1932",
          buttons: [
            { _key: "b1", _type: "heroButton", label: "Bli medlem", href: "/medlemskap" },
            { _key: "b2", _type: "heroButton", label: "Se aktiviteter", href: "/aktiviteter" },
            { _key: "b3", _type: "heroButton", label: "Kurs", href: "/padling/kurs" },
          ],
        },
      ],
    })
    .commit();

  console.log("La inn forsidebilde 1. Bilde 2 legges inn i Studio under Nettstedinnstillinger.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
