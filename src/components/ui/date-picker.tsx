"use client";
import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { ro } from "date-fns/locale";
import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const FMT = "yyyy-MM-dd"; // same shape as <input type="date">, so callers keep their string state

// Branded date picker (date only). Replaces the browser's default calendar; week starts on Monday, Romanian labels.
export function DatePicker({ value, onChange, placeholder = "Alege data", id, className, clearable = true }: { value: string; onChange: (v: string) => void; placeholder?: string; id?: string; className?: string; clearable?: boolean }) {
  const [open, setOpen] = useState(false);
  const parsed = value ? parse(value, FMT, new Date()) : null;
  const date = parsed && isValid(parsed) ? parsed : null;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex gap-1">
        <PopoverTrigger asChild>
          <Button id={id} type="button" variant="outline" className={cn("h-10 w-full justify-start font-normal", !date && "text-muted-foreground", className)}>
            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
            {date ? format(date, "d MMM yyyy", { locale: ro }) : placeholder}
          </Button>
        </PopoverTrigger>
        {clearable && date && <Button type="button" variant="ghost" size="icon" aria-label="Șterge data" onClick={() => onChange("")}><X className="h-4 w-4" /></Button>}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" locale={ro} selected={date ?? undefined} defaultMonth={date ?? undefined} onSelect={(d) => { if (d) { onChange(format(d, FMT)); setOpen(false); } }} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
