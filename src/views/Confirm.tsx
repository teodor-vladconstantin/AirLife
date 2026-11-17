"use client";
import { useState } from "react";
import { CheckCircle2, MailCheck, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

type State = "ask" | "loading" | "done" | "invalid";

const Confirm = ({ token, initial }: { token: string; initial: "ask" | "done" | "invalid" }) => {
  const [state, setState] = useState<State>(initial);

  const confirm = async () => {
    setState("loading");
    const res = await fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => null);
    setState(res?.ok ? "done" : "invalid");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-16">
        <div className="container mx-auto px-4 max-w-xl text-center space-y-4">
          {state === "done" ? (
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          ) : state === "invalid" ? (
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
          ) : (
            <MailCheck className="w-12 h-12 text-primary mx-auto" />
          )}
          <h1 className="text-3xl font-bold">
            {state === "done" ? "Ești abonat" : state === "invalid" ? "Linkul nu mai este valabil" : "Confirmă abonarea"}
          </h1>
          <p className="text-muted-foreground">
            {state === "done"
              ? "Mulțumim! De acum primești emailuri AirLife. Te poți dezabona oricând dintr-un link din fiecare email."
              : state === "invalid"
                ? "Linkul de confirmare e greșit sau nu mai poate fi folosit. Te poți abona din nou din subsolul site-ului."
                : "Apasă butonul ca să confirmi că vrei emailuri de la AirLife."}
          </p>
          {(state === "ask" || state === "loading") && (
            <Button onClick={confirm} disabled={state === "loading"} size="lg">
              {state === "loading" ? "Se confirmă..." : "Confirmă abonarea"}
            </Button>
          )}
          {state !== "ask" && state !== "loading" && (
            <Link to="/" className="inline-block text-primary underline">
              Înapoi la site
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confirm;
