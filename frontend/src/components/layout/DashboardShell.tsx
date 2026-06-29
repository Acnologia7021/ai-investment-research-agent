import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar.js";

type Props = {
  children: ReactNode;
};

export const DashboardShell = ({ children }: Props) => (
  <div className="min-h-screen bg-transparent text-foreground">
    <div className="flex">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  </div>
);
