import {
  LayoutGrid,
  Inbox,
  MessagesSquare,
  BookOpen,
  Workflow,
  CalendarDays,
  Share2,
  Users2,
  CreditCard,
  Settings,
  Building2,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  group: string;
  items: NavItem[];
}

export const nav: NavSection[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutGrid }],
  },
  {
    group: "Growth",
    items: [
      { label: "Lead Inbox", href: "/leads", icon: Inbox },
      { label: "AI Chat", href: "/chat", icon: MessagesSquare },
      { label: "Knowledge Base", href: "/knowledge", icon: BookOpen },
      { label: "Listings", href: "/listings", icon: Building2 },
    ],
  },
  {
    group: "Automation",
    items: [
      { label: "Workflow Builder", href: "/workflows", icon: Workflow },
      { label: "Social Scheduler", href: "/scheduler", icon: Share2 },
      { label: "Calendar", href: "/calendar", icon: CalendarDays },
    ],
  },
  {
    group: "Organization",
    items: [
      { label: "Team", href: "/team", icon: Users2 },
      { label: "Billing", href: "/billing", icon: CreditCard },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help & Guide", href: "/help", icon: HelpCircle },
    ],
  },
];
