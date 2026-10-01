import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Route22 Zululand — The Elephant Coast Tourism Route",
  description:
    "Your guide to the R22 Elephant Coast route — from St Lucia and Hluhluwe-iMfolozi up through Sodwana, Kosi Bay and the great game reserves of Maputaland. Plan your journey, find lodges, tours and experiences.",
  keywords: [
    "Elephant Coast",
    "R22 route",
    "Zululand tourism",
    "Hluhluwe iMfolozi",
    "iSimangaliso Wetland Park",
    "Sodwana Bay diving",
    "Kosi Bay",
    "KwaZulu-Natal safari",
    "Maputaland",
  ],
  openGraph: {
    title: "Route22 Zululand",
    description:
      "Drive the wildest road in South Africa — the R22 Elephant Coast route through Zululand's great game reserves and coastline.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
