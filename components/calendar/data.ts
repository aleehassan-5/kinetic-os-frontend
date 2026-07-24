export type MeetingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";
export type MeetingSource = "Calendly" | "Google Calendar";

export interface Meeting {
  id: string;
  leadName: string;
  leadHandle: string;
  channel: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  status: MeetingStatus;
  source: MeetingSource;
  avatarColor: string;
}

export const meetings: Meeting[] = [
  { id: "m1", leadName: "Farah Ibrahim", leadHandle: "@farah.ibrahim", channel: "Instagram", topic: "Onboarding walkthrough", date: "Today", time: "3:00 PM", duration: "30 min", status: "Confirmed", source: "Calendly", avatarColor: "from-purple-500 to-fuchsia-500" },
  { id: "m2", leadName: "Hamza Traders", leadHandle: "+92 300 1234567", channel: "WhatsApp", topic: "Discovery call — automation setup", date: "Today", time: "5:30 PM", duration: "45 min", status: "Confirmed", source: "Calendly", avatarColor: "from-emerald-500 to-teal-500" },
  { id: "m3", leadName: "Daniel Cruz", leadHandle: "daniel.cruz@northline.io", channel: "Email", topic: "Proposal review", date: "Tomorrow", time: "10:00 AM", duration: "30 min", status: "Pending", source: "Google Calendar", avatarColor: "from-blue-500 to-indigo-500" },
  { id: "m4", leadName: "Sara Ahmed", leadHandle: "@sara.designs", channel: "Instagram", topic: "Retainer options walkthrough", date: "Tomorrow", time: "2:00 PM", duration: "30 min", status: "Confirmed", source: "Calendly", avatarColor: "from-pink-500 to-rose-500" },
  { id: "m5", leadName: "Aleena K.", leadHandle: "@aleena_k", channel: "Telegram", topic: "Free trial Q&A", date: "Fri, Jul 26", time: "11:00 AM", duration: "15 min", status: "Pending", source: "Calendly", avatarColor: "from-amber-500 to-orange-500" },
  { id: "m6", leadName: "Marcus Reyes", leadHandle: "m.reyes", channel: "Messenger", topic: "Follow-up call", date: "Wed, Jul 22", time: "1:00 PM", duration: "30 min", status: "Cancelled", source: "Google Calendar", avatarColor: "from-slate-500 to-slate-600" },
  { id: "m7", leadName: "Priya Nair", leadHandle: "priya.n@quicksell.io", channel: "Email", topic: "Contract signing call", date: "Mon, Jul 20", time: "9:30 AM", duration: "30 min", status: "Completed", source: "Calendly", avatarColor: "from-cyan-500 to-blue-500" },
];

export const statusVariant: Record<MeetingStatus, "default" | "primary" | "success" | "warning" | "danger"> = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
  Completed: "default",
};
