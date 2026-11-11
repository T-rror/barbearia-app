"use client";

import { useState } from "react";

import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../../../@/components/ui/sheet";

import { Button } from "../../../../@/components/ui/button";

import { PanelBottom, LogOut, History, Calendar, Plus } from "lucide-react";
import React from "react";

export default function Sidebar({
  onLogout,
  onAbaChange,
  agendamentos,
  agendamentosConcluidos,
  agendamentosCancelados,
}) {
  const [menuAberto, setMenuAberto] = useState(null);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 w-16 bg-black border-r border-zinc-800 hidden sm:flex flex-col items-center py-6 gap-6">
        <button
          onClick={() =>
            setMenuAberto(menuAberto === "agendamentos" ? null : "agendamentos")
          }
          className="text-gray-400 hover:text-orange-500"
        >
          <Calendar />
        </button>

        {menuAberto === "agendamentos" && (
          <div className="absolute left-16 top-20 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-52">
            <button
              onClick={() => onAbaChange("pendentes")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Pendentes ({agendamentos.length})
            </button>

            <button
              onClick={() => onAbaChange("concluidos")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Concluídos ({agendamentosConcluidos.length})
            </button>

            <button
              onClick={() => onAbaChange("cancelados")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Cancelados ({agendamentosCancelados.length})
            </button>

            <button
              onClick={() => onAbaChange("novo-agendamento")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Novo Agendamento
            </button>

            <button
              onClick={() => onAbaChange("historico")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Histórico
            </button>
          </div>
        )}

        <button
          onClick={() => onAbaChange("historico")}
          className="text-gray-400 hover:text-orange-500"
        >
          <History />
        </button>

        <button
          onClick={() => onAbaChange("novo-agendamento")}
          className="text-gray-400 hover:text-orange-500"
        >
          <Plus />
        </button>

        <div className="mt-auto">
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-red-500"
          >
            <LogOut />
          </button>
        </div>
      </aside>

      <div className="sm:hidden fixed top-4 left-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon">
              <PanelBottom />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader />
            <SheetTitle />
            <nav className="flex flex-col gap-4">
              <button onClick={() => onAbaChange("pendentes")}>
                Agendamentos
              </button>

              <button onClick={() => onAbaChange("historico")}>
                Histórico
              </button>

              <button onClick={() => onAbaChange("novo-agendamento")}>
                Novo
              </button>

              <button onClick={onLogout} className="text-red-500">
                Sair
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
