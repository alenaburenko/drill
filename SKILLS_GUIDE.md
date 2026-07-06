# 🧠 Гайд по AI-скилам

В этом проекте подключены **435 AI-скилов** из центрального хранилища `~/.ai-skills/`.

> 📖 **[Полный каталог всех скилов → SKILLS_CATALOG.md](./SKILLS_CATALOG.md)**
>
> Там все 433 скила с описаниями, разбитые по 14 категориям.

## Как это работает

```
~/.ai-skills/                  ← центральное хранилище (435 скилов)
  ├── README.md                ← основная документация
  ├── link-skills.sh           ← скрипт подключения к любому проекту
  ├── api-design-reviewer/
  │   └── SKILL.md             ← сам скил
  ├── senior-frontend/
  │   └── SKILL.md
  └── ...

${project}/.claude/skills/     ← симлинки → ~/.ai-skills/ (не пушится)
${project}/.cursor/rules/      ← симлинки → SKILL.md (не пушится)
```

Скилы **не пушатся в репозиторий** — это симлинки на центральное хранилище на твоём компе.

## Использование

### В Claude Code

Скилы доступны как `/команды`:

```
/senior-frontend       — аудит фронтенда
/review                — ревью кода
/plan                  — распланировать задачу
/tdd                   — тест-драйв разработка
/ship                  — подготовка к релизу
/api-design-review     — ревью API-дизайна
/copywriting           — написание текстов
/product-strategist    — продуктовые решения
/seo-audit             — SEO-аудит
/gdpr-audit-prep       — подготовка к GDPR-аудиту
/ceo-advisor           — совет CEO уровня
...
```

Просто напиши `/` в чате Claude Code и увидишь автодополнение.

### В Cursor

Напиши в чате:
```
@senior-frontend    — вызов скила
@review             — ревью
```

Или просто опиши задачу: "Сделай code review" — Cursor подхватит `.cursor/rules/`.

### В других AI-инструментах

```bash
# Подключить к любому проекту:
bash ~/.ai-skills/link-skills.sh --target windsurf /путь/к/проекту
```

## Категории скилов

### Engineering
`senior-frontend`, `senior-backend`, `senior-fullstack`, `senior-devops`, `senior-qa`, `api-design-reviewer`, `tdd`, `karpathy-coder`, `database-designer`, `ci-cd-pipeline-builder`, `mcp-server-builder`, `observability-designer`, `chaos-engineering`, `performance-profiler`, `migration-architect`, `rag-architect`, `code-reviewer`, `incident-commander`, `aws-solution-architect`, `azure-cloud-architect`, `gcp-cloud-architect`, `security-pen-testing`, `red-team`

### Marketing
`copywriting`, `seo-audit`, `content-strategy`, `content-creator`, `paid-ads`, `email-sequence`, `social-media-manager`, `app-store-optimization`, `pricing-strategy`, `referral-program`, `landing-page-generator`, `cold-email`, `churn-prevention`

### Product
`product-strategist`, `ux-researcher-designer`, `experiment-designer`, `product-manager-toolkit`, `roadmap-communicator`, `competitive-teardown`, `product-analytics`, `spec-to-repo`, `saas-scaffolder`, `ui-design-system`

### Business
`financial-analyst`, `saas-metrics-coach`, `pricing-strategist`, `rfp-responder`, `deal-desk`, `partnerships-architect`, `commercial-forecaster`

### C-Level
`ceo-advisor`, `cto-advisor`, `cfo-advisor`, `cmo-advisor`, `cro-advisor`, `coo-advisor`, `board-meeting`, `board-deck-builder`, `competitive-intel`, `ma-playbook`, `intl-expansion`

### Compliance / Legal
`gdpr-audit-prep`, `soc2-audit-prep`, `iso27001-audit-prep`, `iso13485-audit-prep`, `fda-qsr-audit-prep`, `ai-act-readiness`, `gdpr-dsgvo-expert`, `quality-manager-qms-iso13485`

### Project Management
`scrum-master`, `senior-pm`, `jira-expert`, `confluence-expert`, `atlassian-admin`, `team-communications`

### Research
`deep-research`, `litreview`, `patent`, `syllabus`, `notebooklm`, `grants`, `dossier`, `pulse`

### Productivity
`inbox-triage`, `inbox-setup`, `capture`, `reflect`, `roast`, `handoff`, `andreessen`

## Добавление нового скила

```bash
# 1. Создай папку в центральном хранилище
mkdir -p ~/.ai-skills/my-awesome-skill
code ~/.ai-skills/my-awesome-skill/SKILL.md

# 2. Напиши скил (следуй шаблону ниже)
# 3. Перелинкуй проект
bash ~/.ai-skills/link-skills.sh /путь/к/проекту
```

### Шаблон SKILL.md

```markdown
# My Awesome Skill

Краткое описание: для чего этот скил, когда вызывать.

## Инструкция

1. Сначала сделай это
2. Потом сделай то
3. В конце — итоговый формат

## Помни

- Контекст: что важно знать
- Ограничения: чего НЕ делать
- Формат ответа: как оформить
```

## Где оригинал

Скилы собраны из:
- **finflow** — основной источник (378 скилов)
- **gemini skills** (34 скила) — инструментальные (gdb-cli, tmux, jq и др.)
- **.agents skills** (28 скилов) — продуктивность (writing, review, triage и др.)

Исходный репозиторий: https://github.com/nicedoc/skills
