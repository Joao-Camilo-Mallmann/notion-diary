# 📝 Daily Notes Auto-Creator for Notion

> A tiny Notion helper that creates one clean daily note every day, with no duplicates.

> Uses GitHub Actions to automate the daily task and keep the workflow simple, fast, and hands-free.

## ✨ At a Glance

- 📅 Finds today automatically.
- 📂 Opens the right month.
- 🧠 Creates today's note only if it does not already exist.

## 🔄 How It Works

The script checks today in the São Paulo timezone and then:

- 🟣 creates the month block when a new month starts and the month is missing,
- ➕ creates the daily entry inside the correct month,
- ✅ skips everything if today's entry is already there.

## 📄 What the Daily Note Contains

Each new day starts as a toggle with the date at the top. Inside it, the script adds:

- Positivo
- Gratidão
- Aprendizagem
- a divider
- a blank bullet for extra notes

## 🛡️ Why It Is Safe

- 🚫 It avoids duplicates.
- ⏰ It always uses the current date.
- 🗂️ It keeps your notes organized by year, month, and day.

## 💡 In Plain English

It is a small helper that finds the right place in your Notion page and drops today's note there.

If the note already exists, it does nothing.
