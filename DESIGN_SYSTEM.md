# Drill — Design System

Dark terminal/IDE design system for code memorization platform.

---

## Tokens (CSS Custom Properties)

All tokens are defined in `src/index.css` under `:root`.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0a0a0a` | Page background |
| `--bg-surface` | `#111111` | Card/section surface |
| `--bg-elevated` | `#1a1a1a` | Elevated cards |
| `--bg-card` | `#141414` | Task cards |
| `--border` | `#252525` | Default borders |
| `--border-muted` | `#1e1e1e` | Subtle borders |

### Accent

| Token | Value |
|-------|-------|
| `--accent` | `#f97316` (orange-500) |
| `--accent-dim` | `#7c3a0e` |
| `--accent-glow` | `rgba(249,115,22,0.18)` |
| `--accent-hover` | `#ea6c05` |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#e8e8e8` | Body text, headings |
| `--text-secondary` | `#888888` | Secondary text |
| `--text-muted` | `#4a4a4a` | Placeholder, disabled |

### Semantic colors

| Token | Value | Usage |
|-------|-------|-------|
| `--green` | `#22c55e` | Success, passed tests |
| `--red` | `#ef4444` | Error, failed tests |
| `--amber` | `#f59e0b` | Warnings, peeks |
| `--blue` | `#3b82f6` | Info links |
| `--purple` | `#a855f7` | Rare accent |

### Typography scale (modular 1.25)

| Token | Value |
|-------|-------|
| `--font-size-xs` | `10px` |
| `--font-size-sm` | `13px` |
| `--font-size-base` | `16px` |
| `--font-size-lg` | `20px` |
| `--font-size-xl` | `25px` |
| `--font-size-2xl` | `31px` |
| `--font-size-3xl` | `39px` |
| `--font-size-4xl` | `49px` |

### Font families (Tailwind `@theme`)

- `--font-sans`: Inter, system-ui, sans-serif
- `--font-mono`: JetBrains Mono, monospace

### Border radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `6px` |
| `--radius-md` | `10px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `22px` |
| `--radius-2xl` | `28px` |

### Spacing grid (4px base)

Semantic tokens: `--space-{1..16}` = `{4..64}px` in 4px steps.

### Z-index layers

| Token | Value |
|-------|-------|
| `--z-base` | 0 |
| `--z-dropdown` | 100 |
| `--z-sticky` | 200 |
| `--z-overlay` | 300 |
| `--z-modal` | 400 |
| `--z-notification` | 500 |

---

## Components

### `ui/Button`

**File:** `src/components/ui/Button.tsx`

Variants:

| Variant | Style |
|---------|-------|
| `primary` | Orange background, black text |
| `success` | Green background, black text |
| `secondary` | Elevated bg, border |
| `ghost` | Transparent, secondary text |
| `danger` | Transparent, red border + text |

Sizes: `sm` (11px / 24px), `md` (12px / 32px), `lg` (14px / 44px)

```tsx
<Button variant="primary" size="lg" glow onClick={handleClick}>
  <Play className="w-4 h-4" />
  Start Practice
</Button>
```

### `ui/Card`

**File:** `src/components/ui/Card.tsx`

Variants:

| Variant | Background | Border |
|---------|------------|--------|
| `default` | `--bg-surface` | `--border` |
| `accent` | `rgba(249,115,22,0.04)` | `rgba(249,115,22,0.15)` |
| `elevated` | `--bg-elevated` | `--border` |

Padding: `sm` (12px), `md` (20px), `lg` (24px). Always `rounded-2xl`.

```tsx
<Card variant="elevated" padding="sm" onClick={handleSelect} className="group hover:border-orange-800/40">
  <h4>{task.title}</h4>
</Card>
```

### `ui/Badge`

**File:** `src/components/ui/Badge.tsx`

Variants: `accent`, `danger`, `success`, `stage`, `stage-mastered`, `stage-active`, `info`

Sizes: `sm` (9px), `md` (10px). Always uppercase, tracking-wider, rounded-md, font-mono.

```tsx
<Badge variant="danger" size="sm">Stage 3</Badge>
```

### `ui/SectionHeader`

**File:** `src/components/ui/SectionHeader.tsx`

Props: `icon`, `title`, `subtitle`, `action`, `color`.

```tsx
<SectionHeader
  icon={<Clock className="w-4 h-4" />}
  title="Repetition Queue (3)"
  subtitle="Spaced Schedule"
  action={<button onClick={...}>View All</button>}
/>
```

### `ui/EmptyState`

**File:** `src/components/ui/EmptyState.tsx`

```tsx
<EmptyState description="No overdue repetitions. Great job!" />
```

### `ui/StatCard`

**File:** `src/components/ui/StatCard.tsx`

```tsx
<StatCard value="85%" label="Test Accuracy" color="var(--green)" />
```

### `ui/ProgressBar`

**File:** `src/components/ui/ProgressBar.tsx`

```tsx
<ProgressBar value={12} max={540} />
```

---

## Utility CSS classes (index.css)

| Class | Usage |
|-------|-------|
| `.btn-glow` | Adds accent glow shadow on hover |
| `.badge-accent` | Orange accent pill badge |
| `.code-block` | Code display block |
| `.group-header` | Collapsible section header |
| `.progress-bar-track` | Progress bar track |
| `.progress-bar-fill` | Progress bar fill (orange gradient) |
| `.cursor-blink` | Terminal cursor blink effect |
| `.animate-fade-in-up` | Entry animation |

---

## Patterns

### Card shell (section layout)

Every section follows this structure:

```
Card
  └─ SectionHeader (icon, title, subtitle/action)
  └─ Content
```

### Hover interactions

Cards that are clickable get `group` + `hover:border-orange-800/40` + `group-hover:text-orange-400` on child headings.

### Form inputs

All inputs share: `rounded-xl px-3 py-2 outline-none border bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-primary)]`.
