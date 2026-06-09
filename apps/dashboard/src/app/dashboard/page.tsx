import type { Metadata } from "next";
import DashboardPage from "../components/dashboard-page";

export const metadata: Metadata = {
  title: "World Automate Dashboard",
};

export default function Dashboard() {
  return <DashboardPage />;
}
