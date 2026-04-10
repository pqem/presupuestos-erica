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
        className="w-full bg-amber-100 text-amber-900 font-semibold py-2 rounded hover:bg-amber-200 transition text-sm"
      >
        {isOpen ? "Cerrar historial" : "Ver historial"}
        {history.length > 0 && (
          <span className="ml-2 text-xs bg-amber-900 text-white px-2 py-1 rounded-full">
            {history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No hay presupuestos guardados
            </div>
          ) : (
            <div className="divide-y">
              {history.map((budget) => (
                <div key={budget.id} className="p-4 hover:bg-amber-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-amber-900 text-sm">
                        {budget.clientName}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatDate(new Date(budget.date))}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {budget.budgetType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-900 text-sm">
                        {formatCurrency(budget.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleLoad(budget)}
                      className="flex-1 bg-amber-900 text-white text-xs py-1 rounded hover:bg-amber-950"
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="flex-1 bg-red-100 text-red-700 text-xs py-1 rounded hover:bg-red-200"
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
