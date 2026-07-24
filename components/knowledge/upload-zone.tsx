"use client";

import { useState } from "react";
import { UploadCloud, Link2, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function UploadZone() {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      className={cn(
        "rounded-card border-2 border-dashed p-8 text-center transition-colors duration-200",
        dragging ? "border-primary bg-primary-muted/30" : "border-border hover:border-border-strong"
      )}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-muted">
        <UploadCloud className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-3 text-[13.5px] font-medium text-text-primary">
        Drop files here, or{" "}
        <button className="text-primary hover:text-primary-hover">browse</button>
      </p>
      <p className="mt-1 text-[12px] text-text-secondary">PDF, DOCX, XLSX, CSV, TXT — up to 50 MB each</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button variant="secondary" size="sm"><Link2 className="h-3.5 w-3.5" /> Crawl a website</Button>
        <Button variant="secondary" size="sm"><MessageSquarePlus className="h-3.5 w-3.5" /> Add FAQ manually</Button>
      </div>
    </div>
  );
}
