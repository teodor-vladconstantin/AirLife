"use client";
import { useCallback, useState, type ReactNode } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface Options { title: string; description?: string; confirmLabel?: string; destructive?: boolean }

// Branded replacement for window.confirm: `const [confirm, dialog] = useConfirm()`, render {dialog}, then `if (!(await confirm({...}))) return;`
export function useConfirm(): [(o: Options) => Promise<boolean>, ReactNode] {
  const [state, setState] = useState<(Options & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = useCallback((o: Options) => new Promise<boolean>((resolve) => setState({ ...o, resolve })), []);
  const close = (v: boolean) => { state?.resolve(v); setState(null); };
  const dialog = (
    <AlertDialog open={!!state} onOpenChange={(o) => { if (!o) close(false); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state?.title}</AlertDialogTitle>
          {state?.description && <AlertDialogDescription>{state.description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction onClick={() => close(true)} className={cn(state?.destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}>
            {state?.confirmLabel ?? "Confirmă"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return [confirm, dialog];
}
