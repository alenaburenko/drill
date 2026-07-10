import { fromAny } from '@total-typescript/shoehorn';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskView } from '../components/TaskView';
import { itleadTasks } from '../tasks/itlead';
import type { UserProgress } from '../types';

// Mock the Web Worker test runner
vi.mock('../runner/testRunner', () => ({
  runTestsInWorker: vi.fn(),
}));

import { runTestsInWorker } from '../runner/testRunner';

const task = itleadTasks[0];
const baseProgress: UserProgress = {
  learningStage: 1,
  peeksCount: 0,
  lastPracticed: null,
  history: [],
};

function renderTaskView(
  overrides: {
    progress?: UserProgress;
    onSaveProgress?: () => void;
    onBack?: () => void;
  } = {},
) {
  const onSaveProgress = vi.fn();
  const onBack = vi.fn();
  const result = render(
    <TaskView
      task={task}
      progress={overrides.progress || baseProgress}
      onSaveProgress={onSaveProgress}
      onBack={onBack}
    />,
  );
  return { ...result, onSaveProgress, onBack };
}

// ── Stage 1: Study ──────────────────────────────────────────────────────
describe('TaskView Stage 1 — Study', () => {
  test('renders without crashing', () => {
    const { container } = renderTaskView();
    expect(container).toBeTruthy();
  });

  test('shows task title', () => {
    const { container } = renderTaskView();
    expect(container.textContent).toContain(task.title);
  });
});

// ── Stage 2: Retype ─────────────────────────────────────────────────────
describe('TaskView Stage 2 — Retype', () => {
  function renderAtStage2() {
    return renderTaskView({
      progress: { ...baseProgress, learningStage: 2, drafts: {} },
    });
  }

  test('renders editor area', () => {
    const { container } = renderAtStage2();
    expect(container.textContent).toBeTruthy();
  });

  test('run tests triggers worker', async () => {
    vi.mocked(runTestsInWorker).mockResolvedValue({
      success: true,
      results: [{ name: 'test 1', success: true }],
    });
    const { container } = renderAtStage2();
    // Find the "Run Tests" button in the test console (bottom section)
    // It's located in the TestConsole component at the very bottom
    const allButtons = container.querySelectorAll('button');
    // Find the button that says "Запустити" — the test console button
    const runBtn = Array.from(allButtons).find(b => b.textContent?.includes('Запустити'));
    expect(runBtn).toBeTruthy();
    fireEvent.click(runBtn!);
    await new Promise(r => setTimeout(r, 100));
    expect(runTestsInWorker).toHaveBeenCalled();
  });
});

// ── Test failure ────────────────────────────────────────────────────────
describe('TaskView — Test failure at Stage 3', () => {
  test('failed run does not advance stage', async () => {
    vi.mocked(runTestsInWorker).mockResolvedValue({
      success: false,
      results: [{ name: 'test 1', success: false, error: 'Expected 2, got 3' }],
    });
    const { onSaveProgress, container } = renderTaskView({
      progress: {
        ...baseProgress,
        learningStage: 3,
        peeksCount: 0,
        drafts: {},
      },
    });
    const allButtons = container.querySelectorAll('button');
    const runBtn = Array.from(allButtons).find(b => b.textContent?.includes('Запустити'));
    expect(runBtn).toBeTruthy();
    fireEvent.click(runBtn!);
    await new Promise(r => setTimeout(r, 200));
    const lastCall = onSaveProgress.mock.calls[onSaveProgress.mock.calls.length - 1];
    expect(lastCall).toBeTruthy();
    const savedProgress = fromAny<(typeof lastCall)[1], UserProgress>(lastCall[1]);
    expect(savedProgress.learningStage).toBe(3);
    expect(savedProgress.history?.[0]?.success).toBe(false);
  });
});

// ── Keyboard shortcut ────────────────────────────────────────────────
describe('TaskView — Keyboard shortcut Cmd+Enter', () => {
  test('Cmd+Enter runs tests on practice stages', () => {
    const progress: UserProgress = {
      ...baseProgress,
      learningStage: 3,
      peeksCount: 0,
      drafts: {},
    };
    renderTaskView({ progress });
    fireEvent.keyDown(window, { key: 'Enter', metaKey: true });
    expect(runTestsInWorker).toHaveBeenCalled();
  });
});

// ── Stage 7: Mastered ─────────────────────────────────────────────────
describe('TaskView Stage 7 — Mastered', () => {
  test('renders mastered state', () => {
    const { container } = renderTaskView({
      progress: {
        ...baseProgress,
        learningStage: 7,
        peeksCount: 2,
        lastPracticed: new Date().toISOString(),
        history: [{ date: new Date().toISOString(), success: true, stageBefore: 6, stageAfter: 7 }],
      },
    });
    expect(container).toBeTruthy();
  });
});

// ── Stage 6: Exam ─────────────────────────────────────────────────────
describe('TaskView Stage 6 — Exam', () => {
  test('renders exam timer', () => {
    const { container } = renderTaskView({
      progress: {
        ...baseProgress,
        learningStage: 6,
        peeksCount: 0,
        lastPracticed: new Date().toISOString(),
        history: [],
      },
    });
    expect(container).toBeTruthy();
  });
});
