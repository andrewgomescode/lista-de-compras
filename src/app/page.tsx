"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { default as dynamicImport } from "next/dynamic";

type Item = {
  id: string;
  name: string;
  quantity: number;
  category: string;
  checked: boolean;
};

type AlertType = "success" | "error" | "info";

type AlertProps = {
  message: string;
  type: AlertType;
  onClose: () => void;
};

const Alert = ({ message, type, onClose }: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-500 text-green-700"
      : type === "error"
      ? "bg-red-100 border-red-500 text-red-700"
      : "bg-blue-100 border-blue-500 text-blue-700";

  return (
    <div
      className={`${bgColor} border-l-4 p-4 mb-4 rounded shadow-md fade-in fixed top-4 right-4 z-50 max-w-sm`}
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          title="Fechar alerta"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Componente principal com renderização apenas no cliente
const HomePage = dynamicImport(() => Promise.resolve(Home), { ssr: false });

export default function Page() {
  return <HomePage />;
}

function Home() {
  const { data: session } = useSession();
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newCategory, setNewCategory] = useState("geral");
  const [filter, setFilter] = useState("todos");
  const [alert, setAlert] = useState<{
    message: string;
    type: AlertType;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar itens do banco de dados
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch {
        setAlert({
          message: "Erro ao carregar itens",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const addItem = async () => {
    if (newItem.trim() === "") return;

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem,
          quantity: newQuantity,
          category: newCategory,
        }),
      });

      if (response.ok) {
        const item = await response.json();
        setItems([item, ...items]);
        setNewItem("");
        setNewQuantity(1);
        setNewCategory("geral");
        setAlert({
          message: `"${item.name}" adicionado à lista!`,
          type: "success",
        });
      }
    } catch {
      setAlert({
        message: "Erro ao adicionar item",
        type: "error",
      });
    }
  };

  const toggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    try {
      const response = await fetch("/api/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          checked: !item.checked,
        }),
      });

      if (response.ok) {
        setItems(
          items.map((item) => {
            if (item.id === id) {
              const updatedItem = { ...item, checked: !item.checked };
              setAlert({
                message: updatedItem.checked
                  ? `"${item.name}" marcado como concluído!`
                  : `"${item.name}" marcado como pendente!`,
                type: "info",
              });
              return updatedItem;
            }
            return item;
          })
        );
      }
    } catch {
      setAlert({
        message: "Erro ao atualizar item",
        type: "error",
      });
    }
  };

  const removeItem = async (id: string) => {
    const itemToRemove = items.find((item) => item.id === id);
    if (!itemToRemove) return;

    try {
      const response = await fetch(`/api/items?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== id));
        setAlert({
          message: `"${itemToRemove.name}" removido da lista!`,
          type: "error",
        });
      }
    } catch {
      setAlert({
        message: "Erro ao remover item",
        type: "error",
      });
    }
  };

  const clearCompleted = async () => {
    const completedItems = items.filter((item) => item.checked);
    let deletedCount = 0;

    try {
      for (const item of completedItems) {
        const response = await fetch(`/api/items?id=${item.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          deletedCount++;
        }
      }

      setItems(items.filter((item) => !item.checked));
      setAlert({
        message: `${deletedCount} ${
          deletedCount === 1
            ? "item concluído foi removido"
            : "itens concluídos foram removidos"
        }!`,
        type: "info",
      });
    } catch {
      setAlert({
        message: "Erro ao limpar itens concluídos",
        type: "error",
      });
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "todos") return true;
    if (filter === "pendentes") return !item.checked;
    if (filter === "concluídos") return item.checked;
    return item.category === filter;
  });

  const categories = [
    "geral",
    "frutas",
    "legumes",
    "carnes",
    "laticínios",
    "bebidas",
    "limpeza",
    "outros",
  ];

  const uniqueCategories = Array.from(
    new Set([...categories, ...items.map((item) => item.category)])
  );

  // Função para lidar com tecla Enter no input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-market-background dark:bg-marketDark-background flex flex-col transition-colors duration-200">
        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50"
            >
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <header className="bg-market-primary dark:bg-marketDark-primary text-white p-6 shadow-md transition-colors duration-200">
          <div className="container mx-auto max-w-3xl flex justify-between items-center">
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Lista de Compras
            </motion.h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm">
                Olá, {session?.user?.name || session?.user?.email}
              </span>
              <motion.button
                onClick={() => signOut()}
                className="bg-market-secondary hover:bg-market-secondary/90 dark:bg-marketDark-secondary dark:hover:bg-marketDark-secondary/90 px-4 py-2 rounded text-white text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sair da conta"
              >
                Sair
              </motion.button>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 md:p-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-market-card dark:bg-marketDark-card rounded-lg shadow-md p-4 md:p-6 mb-6 transition-colors duration-200"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <motion.input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Adicionar item..."
                  className="border border-market-border dark:border-marketDark-border dark:bg-marketDark-card rounded p-2 w-full text-market-text-primary dark:text-marketDark-text-primary placeholder-market-text-secondary dark:placeholder-marketDark-text-secondary transition-colors duration-200"
                  whileFocus={{ scale: 1.02 }}
                  autoFocus
                />

                <div className="flex items-center gap-2">
                  <label className="whitespace-nowrap text-market-text-primary dark:text-marketDark-text-primary">
                    Qtd:
                  </label>
                  <motion.input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={(e) =>
                      setNewQuantity(parseInt(e.target.value) || 1)
                    }
                    className="border border-market-border dark:border-marketDark-border dark:bg-marketDark-card rounded p-2 w-full text-market-text-primary dark:text-marketDark-text-primary transition-colors duration-200"
                    whileFocus={{ scale: 1.02 }}
                    title="Quantidade"
                    aria-label="Quantidade"
                  />
                </div>

                <motion.select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border border-market-border dark:border-marketDark-border dark:bg-marketDark-card rounded p-2 w-full text-market-text-primary dark:text-marketDark-text-primary transition-colors duration-200"
                  whileFocus={{ scale: 1.02 }}
                  title="Categoria"
                  aria-label="Categoria"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </motion.select>
              </div>

              <motion.button
                onClick={addItem}
                className="bg-market-primary hover:bg-market-hover dark:bg-marketDark-primary dark:hover:bg-marketDark-hover text-white font-medium py-2 px-4 rounded transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Adicionar Item
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-market-card dark:bg-marketDark-card rounded-lg shadow-md p-4 md:p-6 transition-colors duration-200"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {["todos", "pendentes", "concluídos", ...uniqueCategories].map(
                (filterOption) => (
                  <motion.button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filter === filterOption
                        ? "bg-market-primary dark:bg-marketDark-primary text-white"
                        : "bg-market-border dark:bg-marketDark-border text-market-text-primary dark:text-marketDark-text-primary hover:bg-market-border/80 dark:hover:bg-marketDark-border/80"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filterOption.charAt(0).toUpperCase() +
                      filterOption.slice(1)}
                  </motion.button>
                )
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <motion.div
                  className="w-6 h-6 border-2 border-market-primary dark:border-marketDark-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-market-text-secondary dark:text-marketDark-text-secondary"
              >
                {filter === "todos"
                  ? "Sua lista está vazia. Adicione alguns itens!"
                  : `Nenhum item ${
                      filter === "pendentes"
                        ? "pendente"
                        : filter === "concluídos"
                        ? "concluído"
                        : `na categoria '${filter}'`
                    } encontrado.`}
              </motion.div>
            ) : (
              <motion.ul className="space-y-3">
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`flex items-center justify-between p-3 border rounded transition-colors duration-200 ${
                        item.checked
                          ? "bg-market-background/50 dark:bg-marketDark-background/50 border-market-border dark:border-marketDark-border"
                          : "bg-market-card dark:bg-marketDark-card border-market-border dark:border-marketDark-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleItem(item.id)}
                          className="h-5 w-5 text-market-primary dark:text-marketDark-primary focus:ring-market-primary/20 dark:focus:ring-marketDark-primary/20 border-market-border dark:border-marketDark-border rounded cursor-pointer"
                          whileHover={{ scale: 1.2 }}
                          title={`Marcar ${item.name} como ${
                            item.checked ? "pendente" : "concluído"
                          }`}
                        />
                        <motion.div
                          animate={{
                            opacity: item.checked ? 0.5 : 1,
                          }}
                          className={item.checked ? "line-through" : ""}
                        >
                          <span className="font-medium text-market-text-primary dark:text-marketDark-text-primary">
                            {item.name}
                          </span>
                          <div className="text-sm text-market-text-secondary dark:text-marketDark-text-secondary flex gap-2">
                            <span>Qtd: {item.quantity}</span>
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </motion.div>
                      </div>
                      <motion.button
                        onClick={() => removeItem(item.id)}
                        className="text-market-secondary hover:text-market-secondary/80 dark:text-marketDark-secondary dark:hover:text-marketDark-secondary/80 p-1"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        title="Remover item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}

            {items.some((item) => item.checked) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center"
              >
                <motion.button
                  onClick={clearCompleted}
                  className="text-market-secondary hover:text-market-secondary/80 dark:text-marketDark-secondary dark:hover:text-marketDark-secondary/80 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Limpar itens concluídos
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </main>

        <footer className="bg-market-card dark:bg-marketDark-card p-4 text-center text-market-text-secondary dark:text-marketDark-text-secondary text-sm border-t border-market-border dark:border-marketDark-border transition-colors duration-200">
          <p>Lista de Compras - &copy;Feito por Andrew Gomes</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
