"use client";
import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { ro } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FMT = "yyyy-MM-dd'T'HH:mm"; // same shape as <input type="datetime-local">, so callers keep their string state
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}

// Branded date + time picker (replaces the browser's default calendar). Time is 24h, week starts on Monday.
export const DateTimePicker = ({ value, onChange, placeholder = "Alege data și ora", className, clearable = true }: Props) => {
  const [open, setOpen] = useState(false);
  const parsed = value ? parse(value, FMT, new Date()) : null;
  const date = parsed && isValid(parsed) ? parsed : null;
  const hh = date ? format(date, "HH") : "09";
  const mm = date ? String(((Math.round(date.getMinutes() / 5) * 5) % 60)).padStart(2, "0") : "00";

  const emit = (d: Date, h = hh, m = mm) => {
    onChange(format(new Date(d.getFullYear(), d.getMonth(), d.getDate(), Number(h), Number(m)), FMT));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={cn("w-full justify-start font-normal h-10", !date && "text-muted-foreground", className)}>
          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
          {date ? format(date, "d MMM yyyy, HH:mm", { locale: ro }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" locale={ro} selected={date ?? undefined} defaultMonth={date ?? undefined} onSelect={(d) => d && emit(d)} initialFocus />
        <div className="border-t p-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Ora</span>
          <Select value={hh} onValueChange={(h) => emit(date ?? new Date(), h, mm)}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-56">{HOURS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
          </Select>
          <span>:</span>
          <Select value={mm} onValueChange={(m) => emit(date ?? new Date(), hh, m)}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-56">{MINUTES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            {clearable && <Button type="button" variant="ghost" size="sm" onClick={() => { onChange(""); setOpen(false); }}>Șterge</Button>}
            <Button type="button" size="sm" onClick={() => setOpen(false)}>Gata</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
