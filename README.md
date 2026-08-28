# Daily Notion

Automação para criar blocos de Daily Notes diários no Notion à meia-noite (horário de Brasília) usando **GitHub Actions (Cron)** e a API do Notion.

---

## ⏰ Como funciona a automação (Cron)

O script é executado automaticamente via **GitHub Actions** agendado por **cron**:

* **Expressão Cron:** `0 3 * * *` (todos os dias às 03:00 UTC, equivalente a **00:00 no Horário de Brasília / UTC-3**).
* **Arquivo do Workflow:** [`.github/workflows/main.yml`](.github/workflows/main.yml)
* **Execução manual:** O workflow também possui `workflow_dispatch`, permitindo ser acionado manualmente pela aba **Actions** no GitHub.

> [!WARNING]
> **Atenção à inatividade no GitHub:**  
> O GitHub desativa automaticamente workflows agendados via cron se o repositório ficar **60 dias sem commits ou atividade**. Caso o daily pare de rodar de repente, acesse a aba **Actions** no GitHub e clique em **Enable workflow** ou dispare uma execução manual.

---

## 🏗️ Estrutura esperada no Notion

Para que o script funcione corretamente:
1. **Página Pai:** A página configurada com o `PAGE_ID` precisa estar compartilhada com a integração do Notion.
2. **Toggle do Ano:** Deve existir um bloco `heading_1` toggle com o ano atual (ex: `2025`, `2026`).
3. **Toggle do Mês:**
   - Criado automaticamente se o script rodar no **dia 1** do mês.
   - Caso o dia 1 não tenha sido executado pela automação, crie o toggle do mês manualmente (ex: `Jan`, `Fev`, `Mar`, etc.) dentro do ano.
4. **Bloco do Dia:** Criado automaticamente no início da lista do mês com a menção de data `@Data` e a estrutura padrão:
   - `Positivo:`
   - `Gratidão:`
   - `Aprendizagem:`
   - `---` (Divisor)
   - Bloco em branco para anotações

---

## 🛠️ Tecnologias

- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Linguagem:** TypeScript
- **Notion SDK:** `@notionhq/client` v2
- **CI/CD / Agendador:** GitHub Actions (Cron)

---

## 🚀 Como rodar localmente

### 1. Instalar dependências
```bash
bun install
```

### 2. Configurar variáveis de ambiente
Defina o seu token da integração do Notion:
```bash
export NOTION_TOKEN="seu_token_aqui"
```

### 3. Executar
```bash
# Rodar desenvolvimento
bun run dev

# Ou compilar e executar como em produção
bun run build
node dist/index.js
```
