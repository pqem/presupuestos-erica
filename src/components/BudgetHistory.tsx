"use client";

import React, { useState, useEffect } from "react";
import { getHistory, deleteFromHistory, formatCurrency, formatDate } from "@/lib/utils";
import { BudgetFormData } from "./BudgetForm";
import { HistoryBudget } from "@/lib/utils";

interface BudgetHistoryProps {
  onSelectBudget: (data: BudgetFormData) => void;
}

export const BudgetHistory: React.FC<BudgetHistoryProps> = ({
  onSelectBudget,
}) => {
  const [history, setHistory] = useState<HistoryBudget[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadHistory = () => {
      setHistory(getHistory());
    };
    loadHistory();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este presupuesto?")) {
      deleteFromHistory(id);
      setHistory(getHistory());
    }
  };

  const handleLoad = (budget: HistoryBudget) => {
    if (budget.data) {
      onSelectBudget(budget.data as unknown as BudgetFormData);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#252525] text-[#c9956b] border border-[#2a2a2a] font-semibold py-2 rounded hover:bg-[#333] transition text-sm"
      >
        {isOpen ? "Cerrar historial" : "Ver historial"}
        {history.length > 0 && (
          <span className="ml-2 text-xs bg-[#5C3D2E] text-white px-2 py-1 rounded-full">
            {history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-4 text-center text-[#666] text-sm">
              No hay presupuestos guardados
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a]">
              {history.map((budget) => (
                <div key={budget.id} className="p-4 hover:bg-[#252525]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#c9956b] text-sm">
                        {budget.clientName}
                      </h4>
                      <p className="text-xs text-[#888] mt-1">
                        {formatDate(new Date(budget.date))}
                      </p>
                      <p className="text-xs text-[#666] mt-1">
                        {budget.budgetType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#e5e5e5] text-sm">
                        {formatCurrency(budget.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleLoad(budget)}
                      className="flex-1 bg-[#5C3D2E] text-white text-xs py-1 rounded hover:bg-[#7a5240] transition"
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="flex-1 bg-[#7f1d1d] text-red-300 text-xs py-1 rounded hover:bg-red-900 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
