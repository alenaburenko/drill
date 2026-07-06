# 📚 Каталог AI-скілів

Повний список усіх **433 скілів** у `~/.ai-skills/`.

> **Як користуватись:** у Claude Code пиши `/ім'я-скіла`, у Cursor — `@ім'я-скіла`.

<details>
<summary><strong>Інжиніринг</strong> (191 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `api-and-interface-design` | Проєктування стабільних API та інтерфейсів. REST, GraphQL, межі модулів, type contracts |
| `api-endpoint-builder` | Створення production-ready REST API з валідацією, обробкою помилок, auth та документацією |
| `ax-extract-workflow` | Реконструкція воркфлоу з ax-сесій, комітів, скілів та tool traces. «Як це було зроблено?» |
| `brooks-lint` | Рев'ю коду через класичні книги з програмування: design smells, coupling, архітектурні ризики |
| `browser-testing-with-devtools` | Тестування в браузері через Chrome DevTools MCP: DOM, console, network, a11y, performance |
| `bug-hunter` | Системний пошук та фікс багів. Від симптомів до першопричини, з регресійними тестами |
| `code-review-and-quality` | Багатовимірне рев'ю коду перед мержем: безпека, продуктивність, підтримуваність |
| `code-simplification` | Спрощення коду без зміни поведінки. Рефакторинг для читабельності |
| `context-engineering` | Оптимізація контексту AI-агента: правила, пам'ять, rules files, сесійна продуктивність |
| `debugging-and-error-recovery` | Системний дебагінг: root-cause аналіз, від помилки до виправлення, prevention |
| `deprecation-and-migration` | Управління deprecated API та міграціями: коли видаляти, як мігрувати, backward compatibility |
| `diagnose` | Цикл діагностики: відтворити → мінімізувати → гіпотеза → інструментувати → фікс → регресія |
| `diagnosing-bugs` | Цикл діагностики складних багів та регресій продуктивності |
| `doubt-driven-development` | Адверсаріальне рев'ю кожного нетривіального рішення перед тим як воно стає остаточним |
| `ecl-harness-engineer` | ECL Agent Harness: AGENTS.md, change tracking, lint checks, CI gates, handoff docs |
| `engineering-agenthub-skills-agenthub` | Multi-agent колаборація: N паралельних subagents на одній задачі через git worktree isolation |
| `engineering-agenthub-skills-board` | Читання та запис AgentHub message board для координації агентів |
| `engineering-agenthub-skills-eval` | Оцінка та ранжування результатів агентів AgentHub по метриках або LLM judge |
| `engineering-agenthub-skills-init` | Створення AgentHub сесії: задача, кількість агентів, критерії оцінки |
| `engineering-agenthub-skills-merge` | Злиття гілки переможця, архівація програних, очищення worktrees |
| `engineering-agenthub-skills-run` | Повний цикл: init → baseline → spawn → eval → merge одним викликом |
| `engineering-agenthub-skills-spawn` | Запуск N паралельних агентів в ізольованих git worktrees |
| `engineering-agenthub-skills-status` | DAG стан, прогрес агентів, статус гілок AgentHub сесії |
| `engineering-autoresearch-agent-skills-autoresearch-agent` | Автономний експериментальний цикл: оптимізація файлу по метриці (Karpathy-style) |
| `engineering-autoresearch-agent-skills-loop` | Запуск циклу експериментів з інтервалом (10min, 1h, daily, weekly, monthly) |
| `engineering-autoresearch-agent-skills-resume` | Відновлення призупиненого експерименту: checkout, читання історії, продовження |
| `engineering-autoresearch-agent-skills-run` | Одна ітерація: редагувати файл → оцінити → зберегти або відкинути |
| `engineering-autoresearch-agent-skills-setup` | Налаштування експерименту: domain, target file, eval command, metric, evaluator |
| `engineering-autoresearch-agent-skills-status` | Дашборд експерименту: результати, активні цикли, прогрес |
| `engineering-behuman-skills-behuman` | Людяні відповіді AI: менш роботизовано, більш автентично, без списків |
| `engineering-caveman-skills-caveman` | Ультра-стиснутий режим. ~75% менше токенів за рахунок скорочень |
| `engineering-chaos-engineering-skills-chaos-engineering` | Chaos engineering: fault injection, gameday, resilience test, blast radius, steady state |
| `engineering-claude-coach-skills-claude-coach` | Персональний коуч Claude. Для першого разу: навчити бути power user |
| `engineering-code-tour-skills-code-tour` | CodeTour .tour файли: покрокові walkthroughs з посиланнями на файли та рядки |
| `engineering-collab-proof-skills-collab-proof` | Аналіз внеску: що Claude vs що ти. Session retrospective, collaboration evidence |
| `engineering-data-quality-auditor-skills-data-quality-auditor` | Аудит даних: completeness, consistency, accuracy, anomaly detection, profile distributions |
| `engineering-demo-video-skills-demo-video` | Створення demo відео: product walkthrough, feature showcase, animated presentation, GIF |
| `engineering-docker-development-skills-docker-development` | Docker: Dockerfile, compose, multi-stage, security hardening, optimization |
| `engineering-feature-flags-architect-skills-feature-flags-architect` | Feature flags: додавання, видалення, аудит. LaunchDarkly, GrowthBook, kill switch |
| `engineering-grill-me-skills-grill-me` | Stress-test плану: питання до спільного розуміння, resolve decision tree |
| `engineering-grill-with-docs-skills-grill-with-docs` | Challenging plan vs CONTEXT.md та ADR. Оновлення документації по ходу |
| `engineering-handoff-skills-handoff` | Handoff: компактифікація сесії для наступного агента. References до артефактів |
| `engineering-helm-chart-builder-skills-helm-chart-builder` | Helm charts: scaffolding, values design, templates, dependency management, security |
| `engineering-karpathy-coder-skills-karpathy-coder` | 4 принципи Karpathy: surface assumptions, keep it simple, surgical changes, define verifiability |
| `engineering-kubernetes-operator-skills-kubernetes-operator` | Kubernetes Operator: CRD design, reconcile loop, controller-runtime, kubebuilder |
| `engineering-llm-cost-optimizer-skills-llm-cost-optimizer` | Оптимізація LLM витрат: token usage, model selection, cost analysis, A/B models |
| `engineering-llm-wiki-skills-llm-wiki` | Персональна база знань в Obsidian: LLM інкрементально обробляє джерела, оновлює сторінки |
| `engineering-prompt-governance-skills-prompt-governance` | Промпти в production: versioning, A/B tests, registry, regression prevention, eval |
| `engineering-security-guidance-skills-security-guidance` | PreToolUse hook: 12 security ризиків (XSS, SQL injection, command injection, unsafe deserialization) |
| `engineering-skills-agent-designer` | Дизайн multi-agent: orchestration pattern (supervisor/swarm/pipeline), tool schemas, eval |
| `engineering-skills-agent-workflow-designer` | Workflow дизайн: sequential, parallel, hierarchical. Handoff contracts, failure handling |
| `engineering-skills-api-design-reviewer` | Рев'ю REST API: linting, breaking-change detection, design scorecards, conventions |
| `engineering-skills-api-test-suite-builder` | Генерація API тестів: integration tests, contract tests, REST endpoints |
| `engineering-skills-browser-automation` | Автоматизація браузера: скрапінг, форми, скріншоти, structured data, web automation |
| `engineering-skills-changelog-generator` | Release notes з Conventional Commits: parsing, semantic bump, changelog rendering |
| `engineering-skills-chaos-engineering` | Chaos engineering: fault injection, gameday, resilience, blast radius, steady state |
| `engineering-skills-ci-cd-pipeline-builder` | CI/CD pipelines: stack detection, baseline, checks, deploy stages, quality gates |
| `engineering-skills-codebase-onboarding` | Codebase analysis → onboarding docs: для інженерів, tech leads, contractors |
| `engineering-skills-database-designer` | Дизайн БД: схеми, міграції, оптимізація запитів, SQL vs NoSQL, data modeling |
| `engineering-skills-database-schema-designer` | ERD діаграми, нормалізація, table relationships, schema migrations |
| `engineering-skills-dependency-auditor` | Аудит залежностей: vulnerabilities, license conflicts, upgrade paths, transitive risks |
| `engineering-skills-engineering-advanced-skills` | Індекс 37 advanced engineering скілів: agent designer, MCP, RAG, K8s, observability |
| `engineering-skills-env-secrets-manager` | .env та secrets: аудит, drift detection, rotation readiness, гігієна змінних оточення |
| `engineering-skills-feature-flags-architect` | Feature flags: додавання, аудит, stale flags, LaunchDarkly, GrowthBook, rollout plan |
| `engineering-skills-focused-fix` | Фокус: зробити X робочим end-to-end. Один модуль, без відволікань |
| `engineering-skills-full-page-screenshot` | Full-page screenshot: SPA, scroll containers, lazy images, tall pages |
| `engineering-skills-git-worktree-manager` | Git worktrees: branch isolation, port allocation, environment sync, cleanup |
| `engineering-skills-interview-system-designer` | Дизайн інтерв'ю: hiring pipelines, calibration, questions, competency rubrics |
| `engineering-skills-kubernetes-operator` | Kubernetes Operator: CRD, reconcile, controller-runtime, kubebuilder |
| `engineering-skills-mcp-server-builder` | MCP сервери з OpenAPI: Python/TS, schema validation, production-ready, testing |
| `engineering-skills-migration-architect` | Zero-downtime міграції: planning, compatibility, rollback, мінімізація impact |
| `engineering-skills-monorepo-navigator` | Monorepo: Turborepo, Nx, pnpm. Cross-package impact, selective builds, remote caching |
| `engineering-skills-observability-designer` | Observability: metrics, logs, traces, SLI/SLO, golden signals, alert optimization |
| `engineering-skills-performance-profiler` | Профілювання: CPU, memory, I/O, flamegraphs, bundle analysis, data optimization |
| `engineering-skills-pr-review-expert` | Рев'ю PR: code changes, security, quality assessment, diff analysis |
| `engineering-skills-rag-architect` | RAG pipeline: chunking, embeddings, vector DB, retrieval quality (precision@k, recall@k) |
| `engineering-skills-runbook-generator` | Генерація runbooks: deploy, incident response, maintenance, rollback — per service |
| `engineering-skills-secrets-vault-manager` | Secrets management: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP |
| `engineering-skills-self-eval` | Чесна оцінка AI-роботи: two-axis scoring. Detects inflation, calibrates якість |
| `engineering-skills-ship-gate` | Pre-production audit: безпека, database, monitoring, secrets, конфіги |
| `engineering-skills-skill-security-auditor` | Сканер безпеки AI-скілів: vulnerabilities, malicious patterns перед установкою |
| `engineering-skills-skill-tester` | Валідація скілів: structure, Python tests, security audit, quality scoring, meta-skill |
| `engineering-skills-skill-tester-assets-sample-skill` | Приклад скіла для тестування: sample-text-processor з assets |
| `engineering-skills-slo-architect` | SLO/SLI/error budgets: define, review, operate. Burn rate, alerting, reliability |
| `engineering-skills-spec-driven-workflow` | Spec-first: acceptance criteria, feature planning, tests from specifications |
| `engineering-skills-sql-database-assistant` | SQL: запити, оптимізація, міграції, ORM (Prisma, Drizzle, TypeORM, SQLAlchemy) |
| `engineering-skills-tc-tracker` | Трекінг технічних змін: JSON records, state machine, AI handoff, init/status/close |
| `engineering-skills-tech-debt-tracker` | Сканування tech debt: severity scoring, trends, remediation plans, prioritization |
| `engineering-slo-architect-skills-slo-architect` | SLO/SLI/error budgets: define, burn rate, alerting, service level objectives |
| `engineering-statistical-analyst-skills-statistical-analyst` | Статистика: hypothesis tests, A/B experiments, sample size, effect sizes, significance |
| `engineering-team-a11y-audit-skills-a11y-audit` | Accessibility audit: WCAG 2.2 A/AA. React, Next.js, Vue, Angular, Svelte, HTML |
| `engineering-team-google-workspace-cli-skills-google-workspace-cli` | Google Workspace через gws CLI: Gmail, Drive, Sheets, Calendar, Docs, Admin |
| `engineering-team-playwright-pro-skills-browserstack` | Запуск Playwright тестів на BrowserStack |
| `engineering-team-playwright-pro-skills-coverage` | Аналіз покриття тестами: gaps, report, recommendation |
| `engineering-team-playwright-pro-skills-fix` | Фікс падаючих або flaky Playwright тестів |
| `engineering-team-playwright-pro-skills-generate` | Генерація Playwright тестів: write tests, generate from spec |
| `engineering-team-playwright-pro-skills-init` | Налаштування Playwright в проєкті: установка, конфіг, first test |
| `engineering-team-playwright-pro-skills-migrate` | Міграція з Cypress або Selenium на Playwright |
| `engineering-team-playwright-pro-skills-pw` | Playwright: E2E тести, browser automation, flaky fix, CI/CD, codegen |
| `engineering-team-playwright-pro-skills-report` | Генерація тестових звітів Playwright |
| `engineering-team-playwright-pro-skills-review` | Рев'ю Playwright тестів на якість: best practices, maintainability |
| `engineering-team-playwright-pro-skills-testrail` | Синхронізація тестів з TestRail: upload results, manage cases |
| `engineering-team-self-improving-agent-skills-extract` | Екстракт патерну в окремий скіл: SKILL.md, reference docs, examples |
| `engineering-team-self-improving-agent-skills-promote` | Промоут з MEMORY.md в CLAUDE.md або .claude/rules/ для постійного enforcement |
| `engineering-team-self-improving-agent-skills-remember` | Збереження в auto-memory з timestamp та контекстом |
| `engineering-team-self-improving-agent-skills-review` | Аналіз auto-memory: promotion candidates, stale entries, consolidation, health |
| `engineering-team-self-improving-agent-skills-self-improving-agent` | Куратор auto-memory: аналіз патернів, промоут, екстракт в скіли, правила |
| `engineering-team-self-improving-agent-skills-status` | Memory health: line counts, capacity, stale entries, recommendations |
| `engineering-team-skills-adversarial-reviewer` | Адверсаріальне рев'ю: breaks self-review monoculture. Дійсно критичний погляд |
| `engineering-team-skills-ai-security` | AI/ML безпека: prompt injection, jailbreak, model inversion, data poisoning, MITRE ATLAS |
| `engineering-team-skills-aws-solution-architect` | AWS архітектури: serverless, CloudFormation, cost optimization, security для стартапів |
| `engineering-team-skills-azure-cloud-architect` | Azure: Bicep/ARM, cost optimization, DevOps pipelines, infrastructure |
| `engineering-team-skills-cloud-security` | Cloud security: IAM, S3, security groups, IaC gaps, privilege escalation |
| `engineering-team-skills-code-reviewer` | Code review: TS, JS, Python, Go, Rust, Java, C#, .NET, Ruby, PHP. Multi-language |
| `engineering-team-skills-email-template-builder` | Email системи: React Email, Resend, Postmark, SendGrid, AWS SES, i18n, dark mode |
| `engineering-team-skills-engineering-skills` | Індекс engineering-team: frontend, backend, QA, DevOps, security, AI/ML, data, cloud |
| `engineering-team-skills-epic-design` | 2.5D immersive сайти з scroll storytelling, кінематографічні ефекти |
| `engineering-team-skills-gcp-cloud-architect` | GCP: Cloud Run, GKE, BigQuery, cost optimization, infrastructure |
| `engineering-team-skills-incident-commander` | Incident response: detection → resolution → post-incident review. SRE practices, timeline |
| `engineering-team-skills-incident-response` | Security incident: SEV1-SEV4 classification, triage, escalation, forensics, evidence |
| `engineering-team-skills-ms365-tenant-manager` | M365 tenant admin: Azure AD, Exchange Online, Teams, Security, compliance |
| `engineering-team-skills-named-persona-adversarial-review` | Code review: Torvalds, Thompson, Carmack, Kent Beck, Jobs. Реальні філософії |
| `engineering-team-skills-red-team` | Red team: MITRE ATT&CK, kill-chain planning, offensive security, attack path analysis |
| `engineering-team-skills-security-pen-testing` | Pen testing: OWASP Top 10, vulnerability scanning, static analysis, dependency check |
| `engineering-team-skills-senior-architect` | Архітектура: microservices vs monolith, diagrams, trade-offs, dependencies, protocols |
| `engineering-team-skills-senior-backend` | Backend: REST APIs, microservices, databases, auth, security hardening, scaling |
| `engineering-team-skills-senior-computer-vision` | Computer vision: CNN, ViT, YOLO, detection, segmentation, visual AI systems |
| `engineering-team-skills-senior-data-engineer` | Data engineering: ETL/ELT, Spark, Airflow, dbt, Kafka, data pipelines, infrastructure |
| `engineering-team-skills-senior-data-scientist` | Data science: stat modeling, experiment design, causal inference, predictive analytics |
| `engineering-team-skills-senior-devops` | DevOps: CI/CD, IaC, Docker, K8s, cloud (AWS/GCP/Azure), monitoring, automation |
| `engineering-team-skills-senior-frontend` | Frontend: React, Next.js, TypeScript, Tailwind. Performance, bundle analysis, a11y |
| `engineering-team-skills-senior-fullstack` | Fullstack: Next.js, FastAPI, MERN, Django. Scaffolding, quality, security, complexity |
| `engineering-team-skills-senior-ml-engineer` | ML: MLOps, model deployment, feature stores, drift monitoring, RAG, LLMs, cost opt |
| `engineering-team-skills-senior-prompt-engineer` | Prompt engineering: optimization, eval sets, RAG quality, agents, tool configurations |
| `engineering-team-skills-senior-qa` | QA: unit, integration, E2E. Jest, React Testing Library, Istanbul, coverage analysis |
| `engineering-team-skills-senior-secops` | SecOps: SAST/DAST, vulnerability management, compliance, CVE remediation, secure SDLC |
| `engineering-team-skills-senior-security` | Security: STRIDE, DREAD, threat modeling, data-flow diagrams, secret scan, risk scoring |
| `engineering-team-skills-stripe-integration-expert` | Stripe: subscriptions, proration, usage-based billing, webhooks, customer portal, idempotency |
| `engineering-team-skills-tdd-guide` | TDD: unit tests, fixtures, mocks, coverage, red-green-refactor. Jest, Pytest, JUnit |
| `engineering-team-skills-tech-stack-evaluator` | Оцінка tech stack: TCO, security, ecosystem health, comparison, decision framework |
| `engineering-team-skills-threat-detection` | Threat hunting: IOC analysis, anomaly detection, behavioral analytics, MITRE ATT&CK |
| `engineering-team-snowflake-development-skills-snowflake-development` | Snowflake: SQL, Dynamic Tables, Cortex AI, Snowpark, Streams/Tasks |
| `engineering-terraform-patterns-skills-terraform-patterns` | Terraform: module design, state management, providers, IaC patterns, security |
| `engineering-universal-scraping-architect-skills-universal-scraping-architect` | Scraping: Firecrawl, Python, document extraction, API parsing, data pipelines |
| `engineering-workflow-builder-skills-workflow-builder` | Дизайн multi-agent workflow: .js scripts для Claude Code Workflow tool, orchestration |
| `engineering-write-a-skill-skills-write-a-skill` | Створення AI-скілів: структура, progressive disclosure, bundled resources, SKILL.md |
| `engineering-zero-hallucination-coder-skills-zero-hallucination-coder` | Без галюцинацій: Discuss → Map → Decompose → Execute → Verify. Ніяких вигаданих API |
| `frontend-ui-engineering` | Створення production-quality UI: компоненти, стейт-менеджмент, верстка, інтеракції |
| `gdb-cli` | GDB-дебагінг: core dumps, crash analysis, deadlocks, live processes з source code |
| `git-guardrails-claude-code` | Захист від небезпечних git-команд: push, reset --hard, clean, branch -D через hooks |
| `git-workflow-and-versioning` | Структурування git-процесів: коміти, гілки, конфлікти, parallel work |
| `global-chat-agent-discovery` | Пошук 18K+ MCP серверів та AI-агентів через 6+ реєстрів |
| `grill-me` | Stress-test через інтерв'ю: resolve decision tree до спільного розуміння |
| `grill-with-docs` | Grilling: план vs CONTEXT.md + ADR. Оновлення документації по ходу |
| `handoff` | Компактний handoff документ для передачі контексту наступному агенту |
| `improve-codebase-architecture` | Сканування кодової бази → HTML звіт про точки покращення → grill через вибране |
| `incremental-implementation` | Інкрементальна реалізація: жодного великого файлу за раз. Поступові зміни |
| `interview-me` | One-question-at-a-time інтерв'ю до ~95% впевненості в справжніх вимогах |
| `jq` | Експертна робота з jq: JSON querying, filtering, transformation, shell pipelines |
| `logic-lens` | Глибоке рев'ю коду: формальна логіка та reasoning frameworks для пошуку багів та anti-patterns |
| `loop-library` | AI-agent loops: знайти, порівняти, аудит, дизайн. Triggers, actions, guardrails |
| `migrate-to-shoehorn` | Міграція тестів з `as` type assertions на @total-typescript/shoehorn |
| `observability-and-instrumentation` | Логування, метрики, трейсінг, алерти. Щоб production був visible та diagnosable |
| `performance-optimization` | Оптимізація: Core Web Vitals, load times, перформанс регресії, бандл |
| `performance-optimizer` | Пошук та фікс вузьких місць: код, БД, API. Вимірювання «до/після» |
| `planning-and-task-breakdown` | Розбиття спеки на впорядковані задачі. Коли задача здається завеликою |
| `production-audit` | Аудит production-readiness: RLS, webhooks, secrets, grants, Stripe idempotency, mobile UX |
| `prototype` | Прототип для перевірки дизайну: terminal app для логіки або UI варіації |
| `python-pptx-generator` | Генерація PowerPoint презентацій через python-pptx з реальним контентом |
| `qa` | Інтерактивна QA-сесія: баги → GitHub issues. Дослідження кодової бази для контексту |
| `rayden-code` | Генерація React коду з Rayden UI компонентами, tokens, premium layout |
| `request-refactor-plan` | План рефакторингу з маленькими комітами → GitHub issue через user interview |
| `review` | Двовісне рев'ю: Standards (код vs coding standards) + Spec (код vs PRD/issue) |
| `runapi-cli` | Генерація AI-зображень, відео та аудіо через RunAPI CLI |
| `scaffold-exercises` | Структура вправ: секції, задачі, рішення, explainers з лінтінгом |
| `setup-matt-pocock-skills` | Налаштування репозиторію: issue tracker, triage labels, domain docs |
| `setup-pre-commit` | Husky pre-commit hooks: Prettier, type-check, тести. Лінт-стейдж |
| `shipping-and-launch` | Підготовка до production: pre-launch checklist, моніторинг, staged rollout |
| `skill-check` | Валідація скілів: structure, semantics, naming, specification compliance |
| `source-driven-development` | Кожне рішення — з офіційної документації. Без outdated патернів |
| `spec-driven-development` | Спеки перед кодом: коли вимоги нечіткі, документації немає, варто спочатку spikнути |
| `squirrel` | Повний AI-цикл: план → код → тести → lint → баги → production-grade docs. 8 фаз |
| `tdd` | Test-driven development: червоно-зелений-рефакторинг. Інтеграційні тести |
| `test-driven-development` | Розробка через тести: будь-яка логіка починається з тесту, баг-репорт → тест першим |
| `tmux` | Експертне управління tmux: сесії, вікна, панелі, remote workflows, shell scripting |
| `to-issues` | Розбиття плану/spec/PRD на GitHub issues через tracer-bullet вертикальні slices |
| `to-prd` | Створення PRD з поточної розмови та публікація в issue tracker |
| `triage` | Тріаж issues та PR: категоризація, верифікація, grill, agent-ready briefs, state machine |
| `ubiquitous-language` | DDD-глосарій з розмови: терміни, двозначності, канонічні назви → UBIQUITOUS_LANGUAGE.md |
| `unship` | UI variants comparison: вибрати один, почистити unused код, зберегти найкраще |
| `using-agent-skills` | Мета-скіл: виявити та викликати потрібний скіл для поточної задачі |

</details>

<details>
<summary><strong>Безпека</strong> (5 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `bumblebee` | Bumblebee: supply-chain inventory scan на macOS/Linux. Compromised packages, extensions, MCP |
| `codebase-audit-pre-push` | Глибокий аудит перед пушем: junk files, dead code, security holes, optimization issues |
| `container-security-hardening` | Посилення безпеки контейнерів: secure base images, runtime, secrets, CVE remediation |
| `security-and-hardening` | Посилення безпеки: user input, auth, data storage, external integrations, OWASP |
| `skill-audit` | Пре-інсталяційний сканер безпеки AI-скілів. 7.5% з 14,706 скілів шкідливі |

</details>

<details>
<summary><strong>Дизайн</strong> (1 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `design-an-interface` | Генерація радикально різних дизайнів інтерфейсів через паралельні sub-agents |

</details>

<details>
<summary><strong>Продукт</strong> (17 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `product-team-agile-product-owner-skills-agile-product-owner` | Agile PO: user stories, acceptance criteria, sprint planning, velocity, backlog |
| `product-team-apple-hig-expert-skills-apple-hig-expert` | Аудит iOS/macOS/watchOS/visionOS за Apple HIG + Liquid Glass (WWDC25) |
| `product-team-code-to-prd-skills-code-to-prd` | Reverse-engineer code → PRD: routes, components, API, state management, user flows |
| `product-team-research-summarizer-skills-research-summarizer` | Резюмування досліджень: academic papers, web articles, reports → structured findings |
| `product-team-skills-competitive-teardown` | Аналіз конкурентів: pricing, reviews, SEO, social → structured competitive intel |
| `product-team-skills-experiment-designer` | Продуктові експерименти: гіпотези, sample size, A/B, prioritization, statistical rigor |
| `product-team-skills-landing-page-generator` | Лендінги як Next.js/React (TSX) компоненти з Tailwind: hero, features, pricing, FAQ |
| `product-team-skills-product-analytics` | Продуктова аналітика: KPI, дашборди, cohort analysis, retention, feature adoption |
| `product-team-skills-product-discovery` | Product discovery: validation, assumptions, discovery sprints, problem-solution fit |
| `product-team-skills-product-manager-toolkit` | PM toolkit: RICE prioritization, customer interviews, PRD templates, discovery, GTM |
| `product-team-skills-product-skills` | Індекс 12 продуктових скілів: RICE, OKR, UX research, design tokens, analytics |
| `product-team-skills-product-strategist` | Стратегічне продуктове лідерство: OKR cascade, quarterly planning, vision docs |
| `product-team-skills-roadmap-communicator` | Roadmap narratives, release notes, changelogs, stakeholder updates |
| `product-team-skills-saas-scaffolder` | SaaS boilerplate: auth, БД, billing, API, dashboard. Next.js 14+, PostgreSQL |
| `product-team-skills-spec-to-repo` | Spec → репозиторій: scaffold, boilerplate, структура, конфігурація |
| `product-team-skills-ui-design-system` | UI дизайн-система: design tokens, component docs, responsive calculations, handoff |
| `product-team-skills-ux-researcher-designer` | UX research: personas, journey mapping, usability testing, research synthesis |

</details>

<details>
<summary><strong>Маркетинг</strong> (49 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `marketing-landing-skills-landing` | Преміум landing page: 3D CSS, GSAP, mouse-parallax, однофайловий HTML |
| `marketing-skill-skills-ab-test-setup` | A/B tests: hypothesis, variants, metrics, implementation, analysis |
| `marketing-skill-skills-ad-creative` | Ad creative: copy, headlines, variations, bulk generation, scaling |
| `marketing-skill-skills-aeo` | AEO: контент для AI (ChatGPT, Perplexity, Claude, Gemini). Відрізняється від SEO |
| `marketing-skill-skills-analytics-tracking` | Analytics: GA4, GTM, events, conversion tracking, data quality audit |
| `marketing-skill-skills-app-store-optimization` | ASO: keywords, competitor rankings, metadata, App Store + Google Play |
| `marketing-skill-skills-brand-guidelines` | Brand: colors, typography, logo, voice, tone, застосування, enforcement |
| `marketing-skill-skills-campaign-analytics` | Campaign analytics: multi-touch attribution, funnel, ROI, performance |
| `marketing-skill-skills-churn-prevention` | Churn reduction: cancel flow, save offers, dunning, exit surveys |
| `marketing-skill-skills-cold-email` | B2B cold outreach: sequences, copy, personalization, deliverability |
| `marketing-skill-skills-competitor-alternatives` | Competitor pages: vs pages, alternatives, comparison для SEO та sales |
| `marketing-skill-skills-content-creator` | Deprecated: redirect до правильного content specialist |
| `marketing-skill-skills-content-humanizer` | Людянізація AI-контенту: remove clichés, додай особистості, живості |
| `marketing-skill-skills-content-production` | Content pipeline: topic → blank page → published-ready. Blog, article, guide |
| `marketing-skill-skills-content-strategy` | Content strategy: topics, channels, formats, calendar, distribution |
| `marketing-skill-skills-copy-editing` | Copy editing: proofread, polish, feedback, consistency, style guide |
| `marketing-skill-skills-copywriting` | Copywriting: homepage, landing, pricing, feature, about, product pages |
| `marketing-skill-skills-email-sequence` | Email sequences: drip campaigns, automated flows, lifecycle, marketing automation |
| `marketing-skill-skills-form-cro` | Form CRO: lead capture, contact, demo, application (не signup) |
| `marketing-skill-skills-free-tool-strategy` | Free tool marketing: lead gen, SEO, brand awareness, engineering-as-marketing |
| `marketing-skill-skills-launch-strategy` | Launch: product, feature, Product Hunt, announcement, GTM planning |
| `marketing-skill-skills-local-seo-manager` | Local SEO: GBP, reviews, citations, local keywords, service areas |
| `marketing-skill-skills-marketing-context` | Marketing context: brand voice, ICP, positioning — для всіх marketing скілів |
| `marketing-skill-skills-marketing-demand-acquisition` | Demand gen: LinkedIn/Google/Meta ads, SEO, partnerships, programs |
| `marketing-skill-skills-marketing-ideas` | Marketing ideas: inspiration, growth strategies для SaaS продуктів |
| `marketing-skill-skills-marketing-ops` | Marketing router: оркестрація multi-skill campaign, координація |
| `marketing-skill-skills-marketing-psychology` | Marketing psychology: mental models, behavioral science, cognitive biases |
| `marketing-skill-skills-marketing-skills` | Directory: знайди потрібний marketing скіл, routing, capabilities |
| `marketing-skill-skills-marketing-strategy-pmm` | Product marketing: positioning, GTM, competitive intel, product launches |
| `marketing-skill-skills-onboarding-cro` | Onboarding CRO: activation, time-to-value, activation rate, friction reduction |
| `marketing-skill-skills-page-cro` | Page CRO: homepage, landing, pricing, blog — conversion optimization |
| `marketing-skill-skills-paid-ads` | Paid ads: Google Ads, Meta, LinkedIn, Twitter. Budget, targeting, creative |
| `marketing-skill-skills-paywall-upgrade-cro` | Paywall CRO: upgrade screens, upsell modals, feature gates, in-app purchases |
| `marketing-skill-skills-popup-cro` | Popup CRO: exit intent, overlays, slide-ins, banners, conversion |
| `marketing-skill-skills-pricing-strategy` | SaaS pricing: tier structure, value metrics, pricing page, increases |
| `marketing-skill-skills-programmatic-seo` | Programmatic SEO: template pages, scale, directory sites, structured data |
| `marketing-skill-skills-prompt-engineer-toolkit` | Prompt engineering: A/B eval, versioning, production prompts, LLM testing |
| `marketing-skill-skills-referral-program` | Referral program: design, launch, optimize, affiliate, word-of-mouth |
| `marketing-skill-skills-schema-markup` | Schema markup: structured data, JSON-LD, rich results, validation |
| `marketing-skill-skills-seo-audit` | SEO audit: technical SEO, rankings, on-page, off-page, keyword analysis |
| `marketing-skill-skills-signup-flow-cro` | Signup CRO: registration, trial activation, friction, conversion rate |
| `marketing-skill-skills-site-architecture` | Site architecture: URL hierarchy, navigation, internal linking, IA |
| `marketing-skill-skills-social-content` | Social content: LinkedIn, Twitter/X, Instagram, TikTok, Facebook — creation |
| `marketing-skill-skills-social-media-analyzer` | Social media analytics: engagement rates, ROI, benchmarks, platform analysis |
| `marketing-skill-skills-social-media-manager` | SMM: strategy, content calendar, community, growth, multi-platform |
| `marketing-skill-skills-webinar-marketing` | Webinar marketing: plan, promote, run, improve virtual events, demand gen |
| `marketing-skill-skills-x-twitter-growth` | X/Twitter growth: audience, viral content, engagement, threads, analytics |
| `marketing-skill-skills-youtube-full` | YouTube: transcripts, search, channels, playlists, content monitoring |
| `marketing-skill-video-content-strategist-skills-video-content-strategist` | Use when planning video content strategy, writing video scripts, optimizing YouTube channels, building short-form video pipelines (Reels, TikTok, Shorts), or re |

</details>

<details>
<summary><strong>Бізнес</strong> (20 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `business-growth-skills-business-growth-skills` | Індекс бізнес-скілів: customer success, sales engineering, revenue ops, contracts |
| `business-growth-skills-contract-and-proposal-writer` | Бізнес-документи: contracts, proposals, SOW, NDA, MSA. Jurisdiction-aware Markdown |
| `business-growth-skills-customer-success-manager` | Customer health: churn risk, expansion, health scoring, weighted models для SaaS |
| `business-growth-skills-revenue-operations` | Revenue ops: pipeline health, forecasting, GTM efficiency, sales analytics |
| `business-growth-skills-sales-engineer` | Pre-sales: RFP/RFI analysis, battlecards, POC planning, competitive comparison |
| `business-operations-skills-business-operations-skills` | Business ops: process docs, SLAs, capacity, internal comms, SOP, procurement |
| `business-operations-skills-capacity-planner` | Capacity planning: headcount, utilization modeling, forecasting для ops leader |
| `business-operations-skills-internal-comms` | Internal comms: reorg announcements, policy changes, impact analysis, sequencing |
| `business-operations-skills-knowledge-ops` | Knowledge ops: SOPs, runbooks, validation, cleanup, knowledge management |
| `business-operations-skills-process-mapper` | Process mapping: end-to-end documentation, workflow optimization, swimlanes |
| `business-operations-skills-procurement-optimizer` | SaaS audit: spend categorization, vendor rationalization, UNSPSC, cost optimization |
| `business-operations-skills-vendor-management` | Vendor management: scorecard, SLA compliance, risk assessment, contract review |
| `commercial-skills-channel-economics` | Channel economics: cost-to-serve, ROI, direct vs partner, margin analysis |
| `commercial-skills-commercial-forecaster` | Commercial forecast: bookings, ARR, pipeline, NRR для CRO board review |
| `commercial-skills-commercial-policy` | Commercial policy: discount rules, approver thresholds, exception flows, framework |
| `commercial-skills-commercial-skills` | Індекс комерційних скілів: pricing, deal desk, partnerships, policy, forecast |
| `commercial-skills-deal-desk` | Deal review: discount authority, unit economics, MSA redlines, risk assessment |
| `commercial-skills-partnerships-architect` | Partnership evaluation: referral/reseller/OEM tier, structure, economics |
| `commercial-skills-pricing-strategist` | Pricing design: subscription, usage-based, value-based, freemium, Van Westendorp |
| `commercial-skills-rfp-responder` | RFP/RFI response: multi-section parsing, security questionnaires, commercial terms |

</details>

<details>
<summary><strong>Фінанси</strong> (4 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `finance-business-investment-advisor-skills-business-investment-advisor` | Investment analysis: capital expenditure, ROI, hiring, technology, real estate |
| `finance-skills-finance-skills` | Індекс фінансових скілів: financial analyst, ratio analysis, DCF, SaaS metrics |
| `finance-skills-financial-analyst` | Financial analysis: ratio, DCF, budget variance, rolling forecasts, decision support |
| `finance-skills-saas-metrics-coach` | SaaS financial health: ARR, MRR, churn, LTV, CAC, NRR, метрики радника |

</details>

<details>
<summary><strong>C-Level</strong> (68 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `c-level-advisor-arquiteto-de-empresa-skills-arquiteto-de-empresa` | Arquiteto de Empresa: бізнес з нуля як OKF-дерево .md файлів з frontmatter |
| `c-level-advisor-c-level-agents-skills-boardroom` | /cs:boardroom — 6-phase C-suite deliberation. Board memo output |
| `c-level-advisor-c-level-agents-skills-brief` | /cs:brief — One-page strategy brief. Перший крок strategic sprint pipeline |
| `c-level-advisor-c-level-agents-skills-c-level-agents` | 13 C-suite агентів (CFO, CMO, CRO...) + 21 /cs:* команд. Founder-mode exec team |
| `c-level-advisor-c-level-agents-skills-caio-review` | /cs:caio-review — CAIO: model selection, AI risk, cost economics, AI hiring |
| `c-level-advisor-c-level-agents-skills-cco-review` | /cs:cco-review — CCO: retention, segmentation, CS team, churn |
| `c-level-advisor-c-level-agents-skills-cdo-review` | /cs:cdo-review — CDO: training data, data architecture, data product |
| `c-level-advisor-c-level-agents-skills-cfo-review` | /cs:cfo-review — CFO: unit economics, runway, dilution, capital allocation |
| `c-level-advisor-c-level-agents-skills-ciso-review` | /cs:ciso-review — CISO: data compliance, production access, security |
| `c-level-advisor-c-level-agents-skills-cmo-review` | /cs:cmo-review — CMO: positioning, ICP, message house, channel mix, CAC |
| `c-level-advisor-c-level-agents-skills-cpo-review` | /cs:cpo-review — CPO: roadmap, PMF, portfolio, feature prioritization |
| `c-level-advisor-c-level-agents-skills-cro-review` | /cs:cro-review — CRO: pipeline, win rate, NRR, ramp time, forecast |
| `c-level-advisor-c-level-agents-skills-cross-eval` | /cs:cross-eval — Multi-model consensus: Claude + Codex + Gemini cross-review |
| `c-level-advisor-c-level-agents-skills-cto-review` | /cs:cto-review — CTO: architecture, scaling, tech debt, build-vs-buy |
| `c-level-advisor-c-level-agents-skills-decide` | /cs:decide — Log decision: two-layer memory. Approved → durable record |
| `c-level-advisor-c-level-agents-skills-execute` | /cs:execute — 90-day execution plan: weekly milestones, DRIs, cadence |
| `c-level-advisor-c-level-agents-skills-founder-mode` | /cs:founder-mode — Авто-роутинг питання до C-role advisor або boardroom |
| `c-level-advisor-c-level-agents-skills-freeze` | /cs:freeze — Lock decision for cooldown. Prevent impulse reversal |
| `c-level-advisor-c-level-agents-skills-gc-review` | /cs:gc-review — GC: contracts, IP, regulatory, term sheets, employment |
| `c-level-advisor-c-level-agents-skills-office-hours` | /cs:office-hours — YC-style 6 questions: problem, customer, distribution, defensibility |
| `c-level-advisor-c-level-agents-skills-onboard` | /cs:onboard — Founder interview: 7-dimension company context → ~/.claude/company-context.md |
| `c-level-advisor-c-level-agents-skills-post-mortem` | /cs:post-mortem — Retrospective: scored vs original assumptions. Closes strategic loop |
| `c-level-advisor-c-level-agents-skills-vpe-review` | /cs:vpe-review — VPE: throughput, eng hiring, team structure, delivery |
| `c-level-advisor-chief-ai-officer-advisor-skills-chief-ai-officer-advisor` | CAIO advisory: build-vs-buy AI, EU AI Act risk, cost economics, AI org |
| `c-level-advisor-chief-customer-officer-advisor-skills-chief-customer-officer-advisor` | CCO advisory: retention decomposition, segmentation, CS strategy, NRR |
| `c-level-advisor-chief-data-officer-advisor-skills-chief-data-officer-advisor` | CDO advisory: AI data rights, data product, B2B data-as-a-service, governance |
| `c-level-advisor-executive-mentor-skills-board-prep` | Board prep: adversarial scenario, numbers mastery, hard questions, narrative |
| `c-level-advisor-executive-mentor-skills-challenge` | Pre-mortem: imagine failure in 12 months. Weaknesses, assumptions, risks |
| `c-level-advisor-executive-mentor-skills-executive-mentor` | Adversarial partner: stress-test, board prep, hard calls, post-mortem |
| `c-level-advisor-executive-mentor-skills-hard-call` | /em:hard-call — Framework для рішень без хороших опцій. 10/10/10 + regret |
| `c-level-advisor-executive-mentor-skills-postmortem` | /em:postmortem — Blameless 5-Whys + change register. Що пішло не так |
| `c-level-advisor-executive-mentor-skills-stress-test` | /em:stress-test — Stress-test assumptions перед тим як ставити на план |
| `c-level-advisor-general-counsel-advisor-skills-general-counsel-advisor` | GC advisory: contracts, IP, term sheets, regulatory для стартапів |
| `c-level-advisor-skills-agent-protocol` | C-suite agent protocol: invocation syntax, loop prevention, isolation, responses |
| `c-level-advisor-skills-arquiteto-de-empresa` | Arquiteto de Empresa: бізнес з нуля як .md дерево з frontmatter type та links |
| `c-level-advisor-skills-board-deck-builder` | Board decks: всі C-suite перспективи, investor updates, quarterly review |
| `c-level-advisor-skills-board-meeting` | 6-phase board meeting: context, isolated C-suite contributions, critic, synthesis |
| `c-level-advisor-skills-c-level-skills` | Індекс 33 C-level скілів: 14 ролей, оркестрація, cross-cutting, culture |
| `c-level-advisor-skills-ceo-advisor` | CEO: strategy, org development, stakeholder management, board presentations |
| `c-level-advisor-skills-cfo-advisor` | CFO: financial modeling, unit economics, fundraising, cash, board packages |
| `c-level-advisor-skills-change-management` | Change management: ADKAR для стартапів, comms templates, resistance, fatigue |
| `c-level-advisor-skills-chief-ai-officer-advisor` | CAIO: build-vs-buy AI, EU AI Act, cost economics, AI strategy |
| `c-level-advisor-skills-chief-customer-officer-advisor` | CCO: retention, segmentation, CS strategy, NRR для стартапів |
| `c-level-advisor-skills-chief-data-officer-advisor` | CDO: AI data rights, data product, B2B data, governance для стартапів |
| `c-level-advisor-skills-chief-of-staff` | C-suite orchestration: routing, board meetings, decision tracking, synthesis |
| `c-level-advisor-skills-chro-advisor` | CHRO: hiring strategy, comp design, org structure, culture, retention, scaling |
| `c-level-advisor-skills-ciso-advisor` | CISO: risk quantification, SOC 2/ISO 27001/HIPAA/GDPR, security architecture |
| `c-level-advisor-skills-cmo-advisor` | CMO: brand, growth model, marketing budget, org design, positioning |
| `c-level-advisor-skills-company-os` | Company OS: EOS, OKR, hybrid, accountability, meeting cadence, operating rhythm |
| `c-level-advisor-skills-competitive-intel` | Competitive intel: tracking, battlecards, market moves, positioning analysis |
| `c-level-advisor-skills-context-engine` | Context engine: load, stale detection, enrichment, refresh for C-suite advisors |
| `c-level-advisor-skills-coo-advisor` | COO: process design, OKR execution, operational cadence, scaling, playbooks |
| `c-level-advisor-skills-cpo-advisor` | CPO: product vision, portfolio strategy, PMF, product org, prioritization |
| `c-level-advisor-skills-cro-advisor` | CRO: forecasting, sales model, pricing, NRR, team scaling, revenue architecture |
| `c-level-advisor-skills-cs-onboard` | Founder onboard: 7 dimensions → company-context.md. /cs:setup для першого разу |
| `c-level-advisor-skills-cto-advisor` | CTO: tech debt, engineering scaling, technology strategy, architecture |
| `c-level-advisor-skills-culture-architect` | Culture: mission/vision/values → behaviors, culture code, measurement |
| `c-level-advisor-skills-decision-logger` | Two-layer memory: raw transcripts (L1) + approved decisions (L2) |
| `c-level-advisor-skills-founder-coach` | Founder coach: archetype, delegation, energy, calendar, leadership development |
| `c-level-advisor-skills-general-counsel-advisor` | GC: contracts, IP, term sheets, regulatory, MSA, NDA, DPA для стартапів |
| `c-level-advisor-skills-internal-narrative` | One company story: employees, investors, customers, candidates, partners |
| `c-level-advisor-skills-intl-expansion` | International expansion: market selection, localization, regulatory, GTM |
| `c-level-advisor-skills-ma-playbook` | M&A: due diligence, valuation, integration, deal structure, acquisition prep |
| `c-level-advisor-skills-org-health-diagnostic` | Org health: 8 dimensions, traffic-light scoring, drill-down recommendations |
| `c-level-advisor-skills-scenario-war-room` | What-if modeling: compound adversity, multi-variable, cascading scenarios |
| `c-level-advisor-skills-strategic-alignment` | Strategy cascade: boardroom → contributor. Fix misalignment, OKR linkage |
| `c-level-advisor-skills-vpe-advisor` | VPE: DORA 4, bottleneck ID, eng hiring funnel, delivery throughput |
| `c-level-advisor-vpe-advisor-skills-vpe-advisor` | VPE: DORA 4, eng hiring, delivery, bottleneck identification, team scaling |

</details>

<details>
<summary><strong>Комплаєнс та Регуляторика</strong> (29 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `compliance-os-skills-ai-act-readiness` | /cs:ai-act-readiness — EU AI Act 6-question. Перед EU deployment, annual refresh |
| `compliance-os-skills-aims-audit` | /cs:aims-audit — ISO 42001 AIMS internal audit 6-question. Перед сертифікацією |
| `compliance-os-skills-compliance-os` | Compliance OS: configure frameworks, compute overlap, simulate audits, consolidate evidence |
| `compliance-os-skills-compliance-readiness` | /cs:compliance-readiness — Multi-framework 6-question check. Перед стартом програми |
| `compliance-os-skills-fda-qsr-audit-prep` | /cs:fda-qsr-audit-prep — FDA 21 CFR 820 audit 6-question. Інтегровано з ISO 13485 |
| `compliance-os-skills-gdpr-audit-prep` | /cs:gdpr-audit-prep — GDPR audit 6-question з посиланнями на статті |
| `compliance-os-skills-iso13485-audit-prep` | /cs:iso13485-audit-prep — ISO 13485 QMS audit. Design controls + CAPA + post-market |
| `compliance-os-skills-iso27001-audit-prep` | /cs:iso27001-audit-prep — ISO 27001 ISMS audit. Clause 9.2, surveillance prep |
| `compliance-os-skills-soc2-audit-prep` | /cs:soc2-audit-prep — SOC 2 Type II readiness. Observation period, evidence collection |
| `fsi-compliance-checker` | Маппінг змін на PCI-DSS v4.0 та MAS TRM. Audit-trail findings для фінрегуляторів |
| `ra-qm-team-compliance-team-eu-ai-act-skills-eu-ai-act-specialist` | EU AI Act: risk tier (Art. 5/6), obligations, documentation per Article для compliance |
| `ra-qm-team-compliance-team-iso42001-skills-iso42001-specialist` | ISO 42001 AIMS: gaps vs Clauses 4-10, evidence, certification readiness |
| `ra-qm-team-skills-agent-decision-receipts` | Tamper-evident receipts для agent actions: deploy, delete, pay, grant-access |
| `ra-qm-team-skills-capa-officer` | CAPA: root cause, corrective action, effectiveness verification, medtech QMS |
| `ra-qm-team-skills-eu-ai-act-specialist` | EU AI Act operational: Article-level, risk tier, obligations, compliance evidence |
| `ra-qm-team-skills-fda-consultant-specialist` | FDA: 510(k)/PMA/De Novo, QMSR, ISO 13485 для meddevices, regulatory pathways |
| `ra-qm-team-skills-gdpr-dsgvo-expert` | GDPR + DSGVO: privacy scans, DPIA, data subject rights, Art. 12(3) deadline |
| `ra-qm-team-skills-information-security-manager-iso27001` | ISO 27001 ISMS для HealthTech: risk assessment, controls, certification |
| `ra-qm-team-skills-isms-audit-expert` | ISMS audit: ISO 27001 compliance, control assessment, certification support |
| `ra-qm-team-skills-iso42001-specialist` | ISO 42001 AIMS: gap analysis, evidence package, certification readiness |
| `ra-qm-team-skills-mdr-745-specialist` | EU MDR 2017/745: classification, technical doc, clinical evidence, PMS |
| `ra-qm-team-skills-qms-audit-expert` | ISO 13485 QMS audit: planning, execution, nonconformity, CAPA verification |
| `ra-qm-team-skills-quality-documentation-manager` | Document control: numbering, versioning, change management, 21 CFR Part 11 |
| `ra-qm-team-skills-quality-manager-qmr` | QMR: QMS governance, management review, regulatory compliance, leadership |
| `ra-qm-team-skills-quality-manager-qms-iso13485` | ISO 13485 QMS: design, documentation, auditing, CAPA, compliance для medtech |
| `ra-qm-team-skills-ra-qm-skills` | Індекс 15 RA/QM скілів: ISO 13485, MDR, FDA, ISO 14971 risk, CAPA, SOC 2 |
| `ra-qm-team-skills-regulatory-affairs-head` | Regulatory: FDA 510(k), De Novo, PMA, submissions, regulatory strategy |
| `ra-qm-team-skills-risk-management-specialist` | ISO 14971 risk management: analysis, evaluation, control, post-production |
| `ra-qm-team-skills-soc2-compliance` | SOC 2: Trust Service Criteria, control matrices, gap analysis, Type I/II |

</details>

<details>
<summary><strong>Управління проєктами</strong> (9 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `project-management-skills-atlassian-admin` | Atlassian admin: Jira, Confluence, Bitbucket, Trello, users, permissions, security |
| `project-management-skills-atlassian-templates` | Atlassian templates: Jira/Confluence blueprints, custom layouts, macros |
| `project-management-skills-confluence-expert` | Confluence: spaces, KB, templates, macros, permissions, page hierarchies |
| `project-management-skills-jira-expert` | Jira: projects, JQL, workflows, custom fields, automation, reports, planning |
| `project-management-skills-meeting-analyzer` | Meeting analysis: behavioral patterns, anti-patterns, coaching feedback |
| `project-management-skills-pm-skills` | Індекс 8 PM скілів: senior PM, scrum master, Jira, Confluence, Atlassian |
| `project-management-skills-scrum-master` | Scrum Master: sprint planning, velocity, retrospectives, agile coaching, standups |
| `project-management-skills-senior-pm` | Senior PM: portfolio management, risk analysis, resource optimization, governance |
| `project-management-skills-team-communications` | Internal comms: 3P updates, newsletters, FAQ, incident reports, status reports |

</details>

<details>
<summary><strong>Дослідження</strong> (14 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `research-deep-research-skills-deep-research` | Multi-source дослідження: fan-out, parallel sub-agents, triangulation, synthesis |
| `research-dossier-skills-dossier` | Decision-grade досьє: hypothesis-tested profile компанії, людини, організації |
| `research-grants-skills-grants` | NIH grant research: grill-me intake, funder missions, review criteria, LOI |
| `research-litreview-skills-litreview` | Literature review: PubMed, OpenAlex via free APIs. Academic paper orientation |
| `research-notebooklm-skills-notebooklm` | Browser automation для Google NotebookLM: notebooks, sources, questions |
| `research-ops-skills-clinical-research` | Clinical study design: endpoints, classification, study design, submission prep |
| `research-ops-skills-market-research` | Market research: TAM/SAM/SOM top-down + bottoms-up, survey design, methodology |
| `research-ops-skills-product-research` | Product research: generative interviews, usability tests, research repository |
| `research-ops-skills-research-finance` | R&D budget: multi-period budget, burn rate, runway, F&A split, portfolio finance |
| `research-ops-skills-research-ops-skills` | Індекс research ops: clinical, market, product, finance — enterprise research |
| `research-patent-skills-patent` | Patent intelligence: novelty search, freedom-to-operate, landscape, validity |
| `research-pulse-skills-pulse` | Pulse research: Reddit, HN, web, X/Twitter. Configurable recent window |
| `research-research-skills-research` | Entry point: hybrid router → specialist skill (pulse, dossier, deep-research) |
| `research-syllabus-skills-syllabus` | Reading list з syllabus: Consensus academic search, curated supplementary |

</details>

<details>
<summary><strong>Продуктивність</strong> (17 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `caveman` | Ультра-стиснутий режим. ~75% менше токенів за рахунок скорочень |
| `documentation-and-adrs` | ADRs та документація: запишіть рішення перед тим як забути |
| `edit-article` | Редагування статей: restructure, clarity, tightening prose, improve flow |
| `idea-refine` | Уточнення ідей: divergent + convergent thinking, stress-test припущень |
| `obsidian-vault` | Пошук, створення, управління нотатками в Obsidian з wikilinks та index notes |
| `productivity-andreessen-skills-andreessen` | Andreessen-mode: blunt, market-first, pressure-test ideas, ventures, features |
| `productivity-capture-skills-capture` | Brain dump → structured actionable system. Zero information loss |
| `productivity-email-skills-inbox-setup` | Inbox triage setup: interview → personalized KB. Один раз |
| `productivity-email-skills-inbox-triage` | Inbox triage: швидко, з персоналізованими правилами, batch processing |
| `productivity-handoff-skills-handoff` | Handoff: compact session → agent. Redact secrets, save to .handoff/ |
| `productivity-reflect-skills-reflect` | Mid-conversation pause: zoom out, reassess direction, assumptions, bias |
| `productivity-roast-skills-roast` | Roast ідеї: brutal second opinion, panel, metrics, before building |
| `write-a-skill` | Створення AI-скілів: SKILL.md, структура, progressive disclosure, templates |
| `writing-beats` | Article as journey of beats: choose-your-own-adventure writing |
| `writing-fragments` | Mining fragments: heterogeneous nuggets → один документ, zero loss |
| `writing-shape` | Shaping: openings, paragraph-by-paragraph, argument, conversational |
| `zoom-out` | Zoom-out: broader context, higher-level perspective, як все вписується |

</details>

<details>
<summary><strong>Markdown / HTML</strong> (5 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `markdown-html-skills-design-system` | Brand → design system: fonts, colors, style, HTML themes, onboarding wizard |
| `markdown-html-skills-markdown-html-orchestrator` | Markdown → HTML: documents, specs, plans, RFCs, reports з інтерактивністю |
| `markdown-html-skills-md-document` | Long-form markdown → HTML: TOC, scrollspy, search, code-copy, interactive |
| `markdown-html-skills-md-review` | Markdown review → 2-column HTML: diff blocks, severity tags, code review |
| `markdown-html-skills-md-slides` | Markdown → HTML презентація: slides, transitions, interactive |

</details>

<details>
<summary><strong>Інструменти</strong> (4 скілів) ⬇️</summary>

| Команда | Опис |
|---------|------|
| `agenttrace-session-audit` | Аудит AI-сесій: витрати, помилки, затримки, аномалії, health, diffs, CI gates |
| `audit-skills` | Експертний аудитор безпеки AI-скілів. Статичний аналіз: malicious patterns, data leaks, payloads |
| `ci-cd-and-automation` | Налаштування CI/CD пайплайнів: quality gates, test runners, деплой автоматизація |
| `technical-change-tracker` | Трекінг змін: JSON records, state machine, AI session handoff для безшовної континуальності |

</details>

---
## 🔍 Швидкий пошук

```bash
ls ~/.ai-skills/ | grep ключове_слово
head -20 ~/.ai-skills/<skill-name>/SKILL.md
```

## ✏️ Як додати свій скіл

```bash
mkdir -p ~/.ai-skills/miy-skil
code ~/.ai-skills/miy-skil/SKILL.md
link-skills .
```
