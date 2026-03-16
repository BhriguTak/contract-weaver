import { Outlet } from "react-router-dom";
import { V2Sidebar } from "./V2Sidebar";
import { V2TopNav } from "./V2TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";

export function V2Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <V2Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <V2TopNav />
          <main className="flex-1 overflow-auto bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
