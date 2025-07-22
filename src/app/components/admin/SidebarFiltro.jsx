import React from 'react';

export default function SidebarFiltro({ filtro, setFiltro }) {
  return (
    <nav className="w-48 p-4 border-r">
      <button
        className={`block w-full text-left p-2 rounded ${filtro === 'pendentes' ? 'bg-gray-300' : ''}`}
        onClick={() => setFiltro('pendentes')}
      >
        Pendentes
      </button>
      <button
        className={`block w-full text-left p-2 rounded mt-2 ${filtro === 'concluidos' ? 'bg-gray-300' : ''}`}
        onClick={() => setFiltro('concluidos')}
      >
        Concluídos
      </button>
    </nav>
  );
}
