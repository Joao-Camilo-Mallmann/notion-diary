# Daily Notion

Automated daily note block creator for Notion running at midnight (Brasília Time / UTC-3) powered by **GitHub Actions (Cron)** and the Notion API.

---

## ⏰ How the Automation Works (Cron)

The script runs automatically via **GitHub Actions** scheduled with **cron**:

* **Cron Expression:** `0 3 * * *` (every day at 03:00 UTC, which corresponds to **00:00 Brasília Time / UTC-3**).
* **Workflow File:** [`.github/workflows/main.yml`](.github/workflows/main.yml)
* **Manual Trigger:** The workflow includes `workflow_dispatch`, enabling manual runs directly from the **Actions** tab in GitHub.

> [!WARNING]
> **GitHub Actions 60-Day Inactivity Policy:**  
> GitHub automatically disables scheduled workflows if the repository has had **no commits or activity for 60 consecutive days**. If your daily notes stop creating automatically, visit the **Actions** tab on GitHub and click **Enable workflow** or trigger a manual run.

---

## 🏗️ Expected Notion Structure

For the script to execute successfully:
1. **Parent Page:** The page configured by `PAGE_ID` must be shared with your Notion integration.
2. **Year Toggle:** A `heading_1` toggle block with the current year (e.g., `2025`, `2026`) must already exist on the page.
3. **Month Toggle:**
   - Automatically created if the script runs on **day 1** of the month.
   - If the first day did not run automatically, manually create the month toggle (e.g., `Jan`, `Fev`, `Mar`, etc.) inside the year toggle.
4. **Day Block:** Created at the top of the month toggle list with a date mention `@Date` and the default template:
   - `Positivo:`
   - `Gratidão:`
   - `Aprendizagem:`
   - `---` (Divider)
   - Blank bullet point for quick notes

---

## 🛠️ Stack

- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Language:** TypeScript
- **Notion SDK:** `@notionhq/client` v2
- **CI/CD / Scheduler:** GitHub Actions (Cron)

---

## 🚀 Running Locally

### 1. Install dependencies
```bash
bun install
```

### 2. Set environment variables
Export your Notion integration token:
```bash
export NOTION_TOKEN="your_token_here"
```

### 3. Run
```bash
# Development mode
bun run dev

# Or build and run production output
bun run build
bun dist/index.js
```
