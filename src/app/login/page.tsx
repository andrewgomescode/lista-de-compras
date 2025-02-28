"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Verificar se há mensagem de redirecionamento (por exemplo, após registro bem-sucedido)
  useEffect(() => {
    const registrationSuccess = searchParams.get("registered");
    if (registrationSuccess === "true") {
      setSuccess("Conta criada com sucesso! Faça login para continuar.");
    }
  }, [searchParams]);

  // Limpar mensagem de erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("Tentando fazer login com:", formData.email);
      
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log("Resposta do login:", response);

      if (response?.error) {
        setError("Credenciais inválidas. Verifique seu email e senha.");
        return;
      }

      // Login bem-sucedido
      setSuccess("Login realizado com sucesso! Redirecionando...");
      
      // Atraso antes de redirecionar para mostrar a mensagem de sucesso
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Ocorreu um erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-market-background dark:bg-marketDark-background flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-market-card dark:bg-marketDark-card rounded-lg shadow-md p-8 transition-colors duration-200">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold mb-6 text-market-text-primary dark:text-marketDark-text-primary text-center"
          >
            Login
          </motion.h1>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-500 text-green-700 dark:text-green-300 p-4 mb-6 rounded"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-market-text-primary dark:text-marketDark-text-primary mb-1"
              >
                Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full border border-market-border dark:border-marketDark-border dark:bg-marketDark-card rounded p-2 text-market-text-primary dark:text-marketDark-text-primary placeholder-market-text-secondary dark:placeholder-marketDark-text-secondary transition-colors duration-200"
                placeholder="seu@email.com"
              />
            </div>

            <PasswordInput
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              label="Senha"
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-market-primary hover:bg-market-hover dark:bg-marketDark-primary dark:hover:bg-marketDark-hover text-white font-medium py-2 px-4 rounded transition-colors duration-200 relative"
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Entrar"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="text-market-primary hover:text-market-hover dark:text-marketDark-primary dark:hover:text-marketDark-hover transition-colors"
            >
              Não tem uma conta? Registre-se
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}