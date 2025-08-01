"use client";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../../@/components/ui/sheet";
import { Button } from "../../../../@/components/ui/button";
import { Package, PanelBottom, Home, LogOut, History } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

export default function Sidebar({ onLogout, user }) {
  const [horaAtual, setHoraAtual] = useState(null);
  const [mounted, setMounted] = useState(false); // <- controle de montagem no cliente

  useEffect(() => {
    setMounted(true); // <- só depois do primeiro render client-side
    setHoraAtual(new Date());

    const timer = setInterval(() => setHoraAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !horaAtual) return null; // <- só mostra quando estiver montado no client

  const diaFormatado = horaAtual.toLocaleDateString("pt-BR");
  const horaFormatada = horaAtual.toLocaleTimeString("pt-BR");

  return (
    <div className="flex w-full flex-col bg-muted/40 ">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5 ">
          <TooltipProvider>
            <Link
              href=""
              className="flex h-9 w-9 items-center justify-center gb-primary text-primary-foreground rounded-full "
            >
              <Package className="h-4 w-4 bg-black outline" />
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href=""
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                >
                  <Home className="h-4 w-4 " />
                </Link>

                
                
              </TooltipTrigger>
              <TooltipContent side="right">ola!</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Link
                  href=""
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                >
                  <History className="h-4 w-4 " />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">historico</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href=""
                  className="flex h-9 w-9 items-center justify-center 
                  rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 background-color-red-500" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">sair!</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header
        className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static 
    s:h-auto sm:border-0 sm:bg-transparent sm:px-6"
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button side="rigth" size="icon" variant="outline" className="sm:hidden">
                <PanelBottom className="w-5 h-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-midium">
                <Link
                  href=""
                  className="flex h-10 w-10 bg-primary rounded-full text-lg 
            iten-center justify-center text-primary-foreground md:text-base gap-2"
                >
                  <Package className="h-5 w-5 transition-all" />
                  <span className="sr-only">logo</span>
                </Link>

                <Link
                  href=""
                  className="flex h-10 w-10 bg-primary rounded-full text-lg 
            iten-center justify-center text-primary-foreground md:text-base gap-2"
                >
                  <Package className="h-5 w-5 transition-all" />
                  <span className="sr-only">logo</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
