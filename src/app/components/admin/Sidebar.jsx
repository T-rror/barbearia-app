"use client";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../../@/components/ui/sheet";
import { Button } from "../../../../@/components/ui/button";
import { PanelBottom, LogOut, History, Calendar, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function Sidebar({ onLogout, user, onAbaChange }) {
  const [horaAtual, setHoraAtual] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHoraAtual(new Date());
    const timer = setInterval(() => setHoraAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !horaAtual) return null;

  

  return (
    <div className="flex w-full flex-col bg-muted/40 ">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
           

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onAbaChange("agendamentos")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Agendamentos</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onAbaChange("historico")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <History className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Histórico</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onAbaChange("novo-agendamento")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Novo Agendamento</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      {/* Header mobile */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4">
          <Avatar className="H-8 W-8">
            <AvatarImage src="" />
            <AvatarFallback>NG</AvatarFallback>
          </Avatar>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelBottom className="w-5 h-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <button
                  onClick={() => onAbaChange("agendamentos")}
                  className="flex items-center gap-2 p-2 text-base rounded hover:bg-muted"
                >
                  <Calendar className="h-5 w-5" />
                  Agendamentos
                </button>

                <button
                  onClick={() => onAbaChange("historico")}
                  className="flex items-center gap-2 p-2 text-base rounded hover:bg-muted"
                >
                  <History className="h-5 w-5" />
                  Histórico
                </button>

                <button
                  onClick={() => onAbaChange("novo-agendamento")}
                  className="flex items-center gap-2 p-2 text-base rounded hover:bg-muted"
                >
                  <Plus className="h-5 w-5" />
                  Novo Agendamento
                </button>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 p-2 text-base text-red-500 hover:bg-muted"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
