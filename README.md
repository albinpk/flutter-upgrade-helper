# Flutter Upgrade Helper

Flutter Upgrade Helper is a web tool that helps Flutter developers **understand and apply Flutter SDK upgrades safely** by visualizing template-level changes between Flutter versions.

All diffs are generated from the **official Flutter template app (counter app)** and compared across Flutter SDK versions.

🔗 Live: https://www.flutter-upgrade-helper.site

---

## ✨ What This Tool Does

- Compare **any two Flutter SDK versions** (1.0.0 → latest, including bugfix releases)
- Visualize changes from the official Flutter **counter template app**
- Highlight file change types: **ADDED, DELETED, RENAMED**
- Filter versions to include/exclude bugfix releases
- Prevent invalid version comparisons (base ↔ target awareness)

---

## 🔍 Diff Viewer Features

- Unified diff view
- Split (side-by-side) diff view
- Platform-aware file structure
- Expand / collapse individual files or all files
- Copy full content of a file

---

## 🤖 AI-Assisted Upgrade (Optional)

Flutter Upgrade Helper **does not modify your project automatically**.

Instead, it can generate a **context-aware upgrade prompt** that you can paste into any AI coding tool (ChatGPT, Claude, Cursor, Copilot, IDE agents, etc.).

The generated prompt:

- Uses real Flutter template diffs as ground truth
- Explains important constraints (line numbers, paths, templates vs real projects)
- Helps AI tools apply changes **safely and contextually**
- Keeps you fully in control of the upgrade

AI is **not required** — this feature is optional and assistive.

---

## 🎯 Who Is This For?

- Flutter developers upgrading existing apps
- Teams maintaining long-lived Flutter projects
- Developers who want clarity before applying SDK changes
- Anyone tired of manually diffing Flutter templates
- Flutter developers upgrading projects with AI coding agents

---

## 🧑‍💻 Author

**Albin PK**

- GitHub: https://github.com/albinpk
- LinkedIn: https://www.linkedin.com/in/albinpk/

---

## ⭐ Support

If this tool helps you upgrade Flutter projects more confidently,  
please consider giving the repo a ⭐
