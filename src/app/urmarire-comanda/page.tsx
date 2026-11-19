import TrackOrder from "@/views/TrackOrder";

export const metadata = { title: "Urmărește comanda | AirLife", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  return <TrackOrder initialOrder={o ?? ""} />;
}
