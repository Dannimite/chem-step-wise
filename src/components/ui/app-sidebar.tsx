import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  Atom, 
  Calculator, 
  FlaskConical, 
  Gauge, 
  Beaker,
  TestTube,
  Thermometer,
  BookOpen,
  Home
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const topics = [
  { 
    title: "Overview", 
    url: "/", 
    icon: Home,
    description: "Main dashboard"
  },
  { 
    title: "Gas Laws", 
    url: "/gas-laws", 
    icon: Gauge,
    description: "Boyle's, Charles's, Gay-Lussac's laws"
  },
  { 
    title: "Stoichiometry", 
    url: "/stoichiometry", 
    icon: Calculator,
    description: "Mole calculations and reactions"
  },
  { 
    title: "Chemical Equations", 
    url: "/equations", 
    icon: FlaskConical,
    description: "Balancing chemical equations"
  },
  { 
    title: "Molar Mass", 
    url: "/molar-mass", 
    icon: Atom,
    description: "Calculate molecular weights"
  },
  { 
    title: "Concentration", 
    url: "/concentration", 
    icon: Beaker,
    description: "Molarity, molality, ppm"
  },
  { 
    title: "pH & Acids/Bases", 
    url: "/ph", 
    icon: TestTube,
    description: "pH, pOH, neutralization"
  },
  { 
    title: "Thermochemistry", 
    url: "/thermochemistry", 
    icon: Thermometer,
    description: "Heat calculations and calorimetry"
  },
  { 
    title: "Examples Library", 
    url: "/examples", 
    icon: BookOpen,
    description: "Browse solved problems"
  }
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground shadow-md font-medium" 
      : "hover:bg-accent hover:text-accent-foreground transition-smooth"

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-72"}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-subtle">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">ChemSolver</h1>
                <p className="text-sm text-sidebar-foreground/70">Interactive Chemistry</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-sidebar-foreground/70 font-medium mb-2"}>
            Topics
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {topics.map((topic) => (
                <SidebarMenuItem key={topic.title}>
                  <SidebarMenuButton asChild className="h-auto py-3">
                    <NavLink 
                      to={topic.url} 
                      end={topic.url === "/"} 
                      className={getNavCls}
                      title={collapsed ? topic.title : undefined}
                    >
                      <topic.icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{topic.title}</div>
                          <div className="text-xs opacity-70 truncate">{topic.description}</div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}