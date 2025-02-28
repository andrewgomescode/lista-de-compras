# Lista de Compras - Aplicação Interativa

Uma aplicação web responsiva para gerenciamento de lista de compras, construída com Next.js, TypeScript e TailwindCSS.

## Funcionalidades

- ✅ Adicionar itens com nome, quantidade e categoria
- ✅ Marcar itens como concluídos
- ✅ Remover itens individualmente
- ✅ Filtrar itens por status (todos, pendentes, concluídos) ou categoria
- ✅ Limpar todos os itens concluídos de uma vez
- ✅ Armazenamento local (localStorage) para persistência de dados
- ✅ Notificações interativas sobre ações realizadas
- ✅ Interface responsiva adaptada para dispositivos móveis
- ✅ Suporte para modo escuro
- ✅ Adição rápida de itens com a tecla Enter

## Tecnologias Utilizadas

- **Framework**: Next.js 15+
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS 4
- **Renderização**: Client-side com React 19
- **Gerenciador de Pacotes**: npm/yarn/bun

## Getting Started

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.

## Como Usar

1. Digite o nome do item que deseja adicionar à lista
2. Defina a quantidade (padrão: 1)
3. Selecione a categoria do item (padrão: geral)
4. Clique em "Adicionar Item" ou pressione Enter
5. Para marcar um item como concluído, clique no checkbox ao lado
6. Para remover um item, clique no ícone X
7. Utilize os filtros para visualizar os itens por status ou categoria
8. Os itens são automaticamente salvos no navegador através do localStorage

## Estrutura do Projeto

- `app/page.tsx`: Componente principal da aplicação
- `app/globals.css`: Estilos globais e variáveis CSS
- `app/layout.tsx`: Layout principal e metadados da aplicação

## Personalização

A aplicação utiliza variáveis CSS para facilitar a personalização de cores e estilos. Você pode modificar essas variáveis no arquivo `app/globals.css`.

## Próximos Passos

- [ ] Adicionar campo para preço e calcular total
- [ ] Permitir edição de itens adicionados
- [ ] Sincronização em nuvem
- [ ] Compartilhamento de listas
- [ ] Agrupamento de listas para diferentes ocasiões

## Licença

Este projeto está sob a licença MIT.
