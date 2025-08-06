import { Button } from "@/components/ui/button";
import type { Route } from "./+types/index";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DataCite Metadata Generator" },
    { name: "description", content: "Welcome DataCite Metadata Generator" },
  ];
}

export default function Home() {
  return (
    <div>
      <Button asChild>
        <Link to="/add-data">Add Data</Link>
      </Button>
    </div>
  );
}
