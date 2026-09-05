import HomePage from "./home";
import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  return params.focus || params.review ? { robots: { index: false, follow: true } } : {};
}

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const focus = params.focus === "teams" || params.focus === "fulcrum" ? params.focus : "work";
  return <HomePage focus={focus} reviewing={params.review === "1"} />;
}
