import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, CheckCircle2 } from "lucide-react";
import { trackLead } from "@/lib/analytics";

interface Props {
  magnet: string;
  title: string;
  description: string;
  source: string;
}

const LeadMagnetForm = ({ magnet, title, description, source }: Props) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.functions.invoke("subscribe-lead", {
      body: { email, magnet, source, website },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Nu am putut trimite emailul", description: "Verifică adresa și încearcă din nou.", variant: "destructive" });
      return;
    }
    trackLead(magnet, source);
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-sm">
          Ți-am trimis emailul cu <strong>{title}</strong>. Dacă nu îl vezi în câteva minute, verifică și folderul Spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border bg-card p-6 space-y-3">
      <div className="flex items-start gap-3">
        <Download className="w-5 h-5 text-primary mt-1 shrink-0" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input type="email" required placeholder="adresa@ta.ro" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Adresa de email" />
        <Button type="submit" disabled={loading} className="sm:w-auto">
          {loading ? "Se trimite..." : "Trimite-mi gratuit"}
        </Button>
      </div>
      {/* honeypot: hidden from people, bots fill it */}
      <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" name="website" />
      <p className="text-xs text-muted-foreground">
        Te abonezi la emailuri AirLife (sfaturi, oferte). Te poți dezabona oricând. Detalii în Politica de Confidențialitate.
      </p>
    </form>
  );
};

export default LeadMagnetForm;
