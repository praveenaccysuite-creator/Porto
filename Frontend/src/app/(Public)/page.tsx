import HomeClient from "./HomeClient";
import { fetchHomePageData } from "@/lib/fetchHomeData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await fetchHomePageData();
  return <HomeClient data={data} />;
}
