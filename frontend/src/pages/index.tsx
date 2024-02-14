import Buy from "@/components/Buy";
import Create from "@/components/Create";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
  const [activeLink, setActiveLink] = useState("Buy");
  return (
    <main>
      <Header setActiveLink={setActiveLink} activeLink={activeLink} />
      {activeLink === "Create" && <Create />}
      {activeLink === "Buy" && <Buy />}
      {activeLink === "Dashboard" && <Dashboard />}
    </main>
  );
}
