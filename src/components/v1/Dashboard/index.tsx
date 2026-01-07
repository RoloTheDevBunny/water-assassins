"use client";

import { Menu } from "./Menu";
import { Modal } from "./Modal";

type ComponentDashboardProps = {
  plan: "global" | "member" | "team";
};

export const Dashboard = ({ plan }: ComponentDashboardProps) => {
  const handleTabChange = (tab: string) => {
    console.log(tab);
  };

  return (
    <>
      <Modal />
      <Menu onTabChange={handleTabChange} activePlan={plan} />
    </>
  );
};
