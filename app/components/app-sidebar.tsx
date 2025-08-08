import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, ScrollText } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Best Practice Guide",
    url: "/dashboard/docs/best-practice-guide",
    icon: ScrollText,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <NavLink to="/" className="hover:bg-gray-200 my-2 bg-card border">
              DataCite Metadata Generator 4.3
            </NavLink>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => {
                          return cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          );
                        }}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
