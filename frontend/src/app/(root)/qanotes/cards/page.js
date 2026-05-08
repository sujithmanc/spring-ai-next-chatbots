import FlipCard from "../components/FlipCard";
import { bgColorSets } from "../util.js/colors";
import Filters from "./Filters";
import CardGrid from "./page-out";

export default async function Page({ searchParams }) {
  const values = await searchParams;
  const selected = values?.filter?.split(",") || [];

  const randomSet = () => bgColorSets[Math.floor(Math.random() * bgColorSets.length)];

  return (
    <div className="p-6 space-y-6">
      {/* <Filters selected={selected} /> */}
      <pre>
        {JSON.stringify(values, null, 2)}
      </pre>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Selected:</h2>
        <CardGrid>
        </CardGrid>
      </div>
    </div>
  );
}