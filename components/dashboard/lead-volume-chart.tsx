"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", leads: 42, replies: 38 },
  { day: "Tue", leads: 58, replies: 51 },
  { day: "Wed", leads: 51, replies: 47 },
  { day: "Thu", leads: 74, replies: 66 },
  { day: "Fri", leads: 68, replies: 61 },
  { day: "Sat", leads: 39, replies: 33 },
  { day: "Sun", leads: 47, replies: 41 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-control border border-border bg-card px-3 py-2 shadow-elevated">
      <p className="mb-1 text-[11.5px] font-medium text-text-secondary">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary capitalize">{p.dataKey}</span>
          <span className="ml-auto font-medium text-text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function LeadVolumeChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="repliesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748B", fontSize: 12 }}
          dy={8}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} width={28} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
        <Area type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} fill="url(#leadsFill)" />
        <Area type="monotone" dataKey="replies" stroke="#14B8A6" strokeWidth={2} fill="url(#repliesFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
