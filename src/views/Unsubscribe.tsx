"use client";
import { useState } from "react";
import { CheckCircle2, MailX, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

type State = "ask" | "loading" | "done" | "invalid";

const Unsubscribe = ({ token, initial }: { token: string; initial: "ask" | "done" | "invalid" }) => {
  const [state, setState] = useState<State>(initial);

  const unsubscribe = async () => {
    setState("loading");
    const res = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => null);
    setState(res?.ok ? "done" : "invalid");
  };

  const title = { ask: "Te dezabonezi?", loading: "Te dezabonezi?", done: "Te-ai dezabonat", invalid: "Linkul nu este valabil" }[state];
  const text = {
    ask: "Apasă butonul și nu îți mai trimitem emailuri de marketing.",
    loading: "Apasă butonul și nu îți mai trimitem emailuri de marketing.",
    done: "Gata, nu vei mai primi emailuri de la noi. Dacă te răzgândești, te poți abona din nou din subsolul site-ului.",
    invalid: "Linkul e greșit sau incomplet. Ne poți scrie la contact@airlife.ro și te scoatem manual.",
  }[state];

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
            <MailX className="w-12 h-12 text-primary mx-auto" />
          )}
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{text}</p>
          {(state === "ask" || state === "loading") && (
            <Button onClick={unsubscribe} disabled={state === "loading"} size="lg">
              {state === "loading" ? "Se procesează..." : "Mă dezabonez"}
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

export default Unsubscribe;
