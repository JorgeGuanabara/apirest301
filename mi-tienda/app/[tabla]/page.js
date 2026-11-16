import { notFound } from "next/navigation";
import TablaCrud from "@/components/TablaCrud";
import { TABLAS } from "@/lib/tablas";

export default async function Page({ params }) {
  const { tabla } = await params;
  if (!Object.hasOwn(TABLAS, tabla)) notFound();
  return <TablaCrud key={tabla} tabla={tabla} />;
}
