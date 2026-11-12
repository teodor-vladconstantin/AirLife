import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export const LeadsTable = () => {
  const [leads, setLeads] = useState<Tables<"leads">[]>([]);

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLeads(data ?? []));
  }, []);

  const exportCsv = () => {
    const rows = [
      ["email", "magnet", "source", "created_at"],
      ...leads.map((l) => [l.email, l.magnet ?? "", l.source, l.created_at]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "airlife-leads.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{leads.length} abonați</p>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!leads.length}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      <Card>
        <CardContent className="p-0 divide-y">
          {leads.length === 0 && <p className="p-6 text-muted-foreground">Niciun lead încă.</p>}
          {leads.map((l) => (
            <div key={l.id} className="flex justify-between gap-4 p-3 text-sm">
              <span className="font-medium">{l.email}</span>
              <span className="text-muted-foreground">
                {l.magnet ?? "-"} · {new Date(l.created_at).toLocaleDateString("ro-RO")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
