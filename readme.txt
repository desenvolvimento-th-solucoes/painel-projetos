================================================================================
                    METAVISION PRO - GUIA DE EXECUÇÃO
================================================================================

PRÉ-REQUISITOS:
- Node.js (v16 ou superior)
- npm (geralmente vem com Node.js)

================================================================================
PASSO 1: INSTALAR AS DEPENDÊNCIAS
================================================================================

Execute o comando abaixo no diretório raiz do projeto:

    npm install

Este comando irá instalar todas as dependências necessárias listadas no 
package.json, incluindo:
- Express (backend)
- React (frontend)
- Vite (bundler)
- Recharts (gráficos)
- E outras dependências...

Tempo estimado: 2-3 minutos

================================================================================
PASSO 2: RODAR O BACKEND
================================================================================

Em um terminal, execute:

    npm run start

OU para modo desenvolvimento (com auto-reload):

    npm run dev

O backend será iniciado em: http://localhost:3001

O backend não fechará o terminal, então deixe rodando em segundo plano
ou abra um novo terminal para o próximo passo.

================================================================================
PASSO 3: RODAR O FRONTEND (VITE)
================================================================================

Em um NOVO terminal, execute:

    npm run vite

O frontend será iniciado em: http://localhost:3000

Aguarde até ver a mensagem:
    ➜  Local:   http://localhost:3000/

================================================================================
RESULTADO FINAL
================================================================================

Após completar todos os passos, você terá:

✓ Backend rodando em:   http://localhost:3001
✓ Frontend rodando em:  http://localhost:3000

Abra seu navegador e acesse: http://localhost:3000

================================================================================
SOLUÇÃO DE PROBLEMAS
================================================================================

Se a porta 3000 estiver ocupada:
1. Feche a aplicação que está usando a porta
2. OU execute:
   netstat -ano | findstr ":3000"    (para ver qual processo)
   taskkill /PID <PID> /F            (para fechar o processo)

Se tiver erro de módulos não encontrados:
1. Delete a pasta node_modules:
   rmdir /s /q node_modules
2. Reinstale as dependências:
   npm install

Se tiver erro no build do Vite:
1. Limpe o cache:
   rm -r node_modules/.vite
2. Reinicie o servidor:
   npm run vite

================================================================================
ESTRUTURA DO PROJETO
================================================================================

- Backend: server.js (Express na porta 3001)
- Frontend: index.tsx (React + Vite na porta 3000)
- Componentes: ./components/
- Configuração: vite.config.ts, tsconfig.json
- Database: ./backend/database.sql

================================================================================
