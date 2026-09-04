import type { Route } from "./+types/home";
import { Welcome } from "~/components/Welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Match Reporter" },
    { name: "description", content: "L'application de suivi de match pour les journalistes bord-terrain" },
  ];
}

export default function Home() {
  return <Welcome />;
}
