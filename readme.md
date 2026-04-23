# 📓 Daily Notes Auto-Creator — Notion

Script que roda todo dia à meia-noite e cria automaticamente a daily note no seu Notion.

- Se for **dia 1** do mês → cria o bloco do mês novo + o dia
- Qualquer outro dia → cria só o dia dentro do mês atual
- Se o dia já existir → não faz nada (seguro rodar várias vezes)

---

## 🔑 1. Pegar o Token do Notion

1. Acesse [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique em **"New integration"**
3. Dê um nome (ex: `daily-script`) e clique em **Submit**
4. Copie o **Internal Integration Token** (começa com `secret_...`)

### Conectar a integração à sua página

1. Abra sua página **Daily notes** no Notion
2. Clique nos `...` no canto superior direito
3. Vá em **Connections → Add connections**
4. Encontre sua integração e adicione

---

## 📦 2. Instalar dependências

```bash
cd daily-notion
npm install
```

---

## ▶️ 3. Testar manualmente

```bash
# Exporte o token (substitua pelo seu)
export NOTION_TOKEN="secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Rode o script
node index.js
```

Você deve ver no terminal:

```
🚀 Daily Notes auto-creator — 2026-04-23
   Ano: 2026 | Mês: Abril | Dia: 23

✅ Ano 2026 encontrado: ...
✅ Mês Abril encontrado: ...
✨ Pronto! Daily de 2026-04-23 criada no Notion.
```

---

## ⏰ 4. Agendar para rodar todo dia à meia-noite

### Linux / Mac — via cron

```bash
# Abrir editor do cron
crontab -e

# Adicionar essa linha no final do arquivo:
0 0 * * * NOTION_TOKEN="secret_SEU_TOKEN_AQUI" /usr/bin/node /caminho/completo/daily-notion/index.js >> /tmp/daily-notion.log 2>&1
```

**Explicação do cron:** `0 0 * * *` = todo dia às 00:00

Para encontrar o caminho do node:

```bash
which node
# Ex: /usr/local/bin/node  ou  /usr/bin/node
```

Para encontrar o caminho completo da pasta:

```bash
cd daily-notion && pwd
# Ex: /home/joao/projetos/daily-notion
```

### Windows — via Task Scheduler

1. Abra o **Agendador de Tarefas** (Task Scheduler)
2. **Criar Tarefa Básica** → nome: `Daily Notion`
3. Gatilho: **Diariamente** às **00:00**
4. Ação: **Iniciar um programa**
   - Programa: `node` (ou o caminho completo ex: `C:\Program Files\nodejs\node.exe`)
   - Argumentos: `C:\caminho\para\daily-notion\index.js`
   - Iniciar em: `C:\caminho\para\daily-notion`
5. Em **Propriedades → Ambiente**, adicione a variável `NOTION_TOKEN` com seu token

Ou use um arquivo `.bat`:

```bat
@echo off
set NOTION_TOKEN=secret_SEU_TOKEN_AQUI
node C:\caminho\para\daily-notion\index.js
```

---

## 🌐 5. Rodar em servidor / nuvem (opcional)

Se quiser rodar em um servidor sempre ligado (Railway, VPS, etc.):

```bash
# Instalar o pm2 para gerenciar processos
npm install -g pm2

# Criar arquivo ecosystem.config.js
```

Crie `ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: "daily-notion",
      script: "index.js",
      cron_restart: "0 0 * * *", // meia-noite todo dia
      autorestart: false,
      env: {
        NOTION_TOKEN: "secret_SEU_TOKEN_AQUI",
      },
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # para iniciar junto com o sistema
```

---

## 🛠️ Personalizações

### Mudar o horário do cron

Edite o crontab. Exemplos:

- `30 23 * * *` → 23h30 (meia hora antes da meia-noite)
- `0 6 * * *` → 6h da manhã

### Mudar as cores dos meses

No `index.js`, edite `MES_CORES_ESPECIAIS`:

```js
const MES_CORES_ESPECIAIS = {
  0: "purple", // Janeiro
  1: "blue", // Fevereiro
  2: "default", // Março
  3: "pink", // Abril
  // adicione outros meses aqui
};
```

Cores disponíveis: `default`, `gray`, `brown`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `red`

### Mudar o template do dia

No `index.js`, na função `criarDia()`, edite o array `children` para adicionar ou remover campos.

---

## 🐛 Problemas comuns

| Erro                                    | Solução                                                     |
| --------------------------------------- | ----------------------------------------------------------- |
| `NOTION_TOKEN não definido`             | `export NOTION_TOKEN="secret_..."`                          |
| `unauthorized`                          | Token errado, ou a integração não foi conectada à página    |
| `Não encontrei o bloco do ano`          | O toggle do ano precisa existir na página, crie manualmente |
| `Mês não encontrado e hoje não é dia 1` | Crie o mês manualmente ou aguarde dia 1                     |
