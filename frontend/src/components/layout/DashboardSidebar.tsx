import { BarChart3, FileSearch, Gauge, Home, Newspaper, ShieldAlert, SlidersHorizontal, Database } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Research", icon: FileSearch, href: "/report" },
  { label: "Financials", icon: BarChart3, anchor: "financials" },
  { label: "News", icon: Newspaper, anchor: "news" },
  { label: "Risk", icon: ShieldAlert, anchor: "risk" },
  { label: "Sources", icon: Database, anchor: "sources" },
  { label: "Settings", icon: SlidersHorizontal, href: "/" }
];

export const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden min-h-screen w-[76px] shrink-0 border-r border-border bg-[#0b0d0c]/95 px-3 py-4 lg:block">
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground">
        AI
      </div>
      <nav aria-label="Dashboard navigation" className="grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href ? location.pathname === item.href : false;
          const className = `group relative flex h-11 w-11 items-center justify-center rounded-lg transition ${
            active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-[#202420] hover:text-foreground"
          }`;

          if (item.anchor) {
            return (
              <a key={item.label} href={`#${item.anchor}`} className={className} aria-label={item.label} title={item.label}>
                <Icon size={19} />
              </a>
            );
          }

          return (
            <Link key={item.label} to={item.href ?? "/"} className={className} aria-label={item.label} title={item.label}>
              <Icon size={19} />
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground">
        <Gauge size={18} />
      </div>
    </aside>
  );
};
