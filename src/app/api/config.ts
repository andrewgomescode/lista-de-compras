// Configurações para desativar a pré-renderização estática para todas as rotas de API
export const dynamic = "force-dynamic";
export const dynamicParams = false;
export const revalidate = false; // Usando false em vez de 0 para evitar problemas
export const fetchCache = "force-no-store";
export const runtime = "nodejs"; // Garantir que estamos usando o runtime do Node.js
