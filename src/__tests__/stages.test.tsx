import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StageStudy from '../components/StageStudy';
import StageRetype from '../components/StageRetype';
import StageHint from '../components/StageHint';
import StageExam from '../components/StageExam';
import StageMastered from '../components/StageMastered';
import TestConsole from '../components/TestConsole';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { itleadTasks } from '../tasks/itlead';

const task = itleadTasks[0];
const t = {
  startPracticeBtn: 'Почати практику',
  taskCondition: 'Умова задачі',
  referenceSolution: 'Еталонне рішення',
  logicBreakdown: 'Розбір логіки',
  testConsole: 'Консоль тестів',
  runTests: 'Запустити тести',
  running: 'Виконується',
  runningWorker: 'Запуск sandbox...',
  pressRunTests: 'Натисніть «Запустити тести»',
  testsOnPractice: 'Тести доступні під час практики',
  intervalDone: 'Завдання вивчено, інтервал запущено',
  copyForRetyping: 'Скопіюйте для передруку',
  hint: 'Підказка',
  hideHint: 'Сховати підказку',
  peekSolution: 'Подивитись рішення',
  peekAnyway: 'Все одно подивитись',
  solutionHidden: 'Рішення приховано',
  solutionHiddenDesc: 'Спробуйте згадати рішення самостійно',
  timeExpired: 'Час вичерпано',
  timeExpiredDesc: (n: number) => `Ваші ${n} хвилин минули`,
  retryExam: 'Спробувати знову',
  examActive: 'Екзамен активний',
  examActiveDesc: 'Пишіть код у редакторі та запускайте тести',
  currentTime: 'Залишилось:',
  masteredFull: 'Завдання вивчено!',
  masterySummary: 'Вітаємо з опануванням завдання',
  masteryResults: 'Результати',
  masteryStatus: 'Статус',
  masteryStatusVal: 'Вивчено',
  masteryPeeks: 'Підглядання',
  masteryRepeat: 'Повторення',
  masteryRepeatVal: '∞',
  allTestsPassed: (hasNext: boolean) => hasNext ? 'Всі тести пройдено!' : 'Завершено!',
  testError: 'Помилка:',
  testPassed: 'Пройдено',
  testFailed: 'Провалено',
} as const;

// ── StageStudy ──────────────────────────────────────────────────────────
describe('StageStudy', () => {
  test('renders start practice button', () => {
    render(<StageStudy task={task} t={t} onStartPractice={() => {}} />);
    expect(screen.getByText('Почати практику')).toBeTruthy();
  });

  test('shows task description and breakdown', () => {
    const { container } = render(<StageStudy task={task} t={t} onStartPractice={() => {}} />);
    expect(container.textContent).toContain('Розбір логіки');
    expect(container.textContent).toContain('Умова задачі');
  });

  test('calls onStartPractice when button clicked', () => {
    let called = false;
    render(<StageStudy task={task} t={t} onStartPractice={() => { called = true; }} />);
    fireEvent.click(screen.getByText('Почати практику'));
    expect(called).toBe(true);
  });
});

// ── StageRetype ─────────────────────────────────────────────────────────
describe('StageRetype', () => {
  test('renders solution description and toggle', () => {
    const { container } = render(
      <StageRetype task={task} t={t} showComments={false} onToggleComments={() => {}} />
    );
    expect(container.textContent).toContain('Скопіюйте для передруку');
  });

  test('toggle comments affects comments visibility', () => {
    let toggled = false;
    const { container } = render(
      <StageRetype task={task} t={t} showComments={false} onToggleComments={() => { toggled = true; }} />
    );
    const toggle = container.querySelector('[class*="cursor-pointer"]');
    if (toggle) fireEvent.click(toggle);
    // Toggle is a click handler, not necessarily a button
    expect(toggled).toBe(true);
  });
});

// ── StageHint ────────────────────────────────────────────────────────────
describe('StageHint', () => {
  test('shows solution hidden state when peek is closed', () => {
    render(
      <StageHint task={task} t={t} peekOpen={false} showComments={false}
        onPeek={() => {}} onToggleComments={() => {}} />
    );
    expect(screen.getByText('Рішення приховано')).toBeTruthy();
  });

  test('shows peek button that triggers onPeek', () => {
    let peeked = false;
    render(
      <StageHint task={task} t={t} peekOpen={false} showComments={false}
        onPeek={() => { peeked = true; }} onToggleComments={() => {}} />
    );
    fireEvent.click(screen.getByText('Все одно подивитись'));
    expect(peeked).toBe(true);
  });

  test('shows hide hint button when peek is open', () => {
    render(
      <StageHint task={task} t={t} peekOpen={true} showComments={false}
        onPeek={() => {}} onToggleComments={() => {}} />
    );
    expect(screen.getByText('Сховати підказку')).toBeTruthy();
  });
});

// ── StageExam ────────────────────────────────────────────────────────────
describe('StageExam', () => {
  test('shows exam active state', () => {
    render(
      <StageExam task={task} t={t} examActive={true} timerSec={300}
        formatTime={(s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`}
        onRetry={() => {}} />
    );
    expect(screen.getByText('Екзамен активний')).toBeTruthy();
  });

  test('shows time expired when timer is 0 and exam not active', () => {
    render(
      <StageExam task={task} t={t} examActive={false} timerSec={0}
        formatTime={(s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`}
        onRetry={() => {}} />
    );
    expect(screen.getByText('Час вичерпано')).toBeTruthy();
  });

  test('retry button calls onRetry', () => {
    let retried = false;
    render(
      <StageExam task={task} t={t} examActive={false} timerSec={0}
        formatTime={(s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`}
        onRetry={() => { retried = true; }} />
    );
    fireEvent.click(screen.getByText('Спробувати знову'));
    expect(retried).toBe(true);
  });
});

// ── StageMastered ───────────────────────────────────────────────────────
describe('StageMastered', () => {
  test('shows mastered message and peeks count', () => {
    const { container } = render(<StageMastered t={t} peeksCount={3} />);
    expect(container.textContent).toContain('Завдання вивчено!');
    expect(container.textContent).toContain('3');
  });

  test('shows mastery results section', () => {
    const { container } = render(<StageMastered t={t} peeksCount={0} />);
    expect(container.textContent).toContain('Результати');
    expect(container.textContent).toContain('Вивчено');
  });
});

// ── TestConsole ─────────────────────────────────────────────────────────
describe('TestConsole', () => {
  test('shows press run tests message when idle', () => {
    render(
      <TestConsole currentStage={3} isRunning={false} runResults={null} t={t} onRunTests={() => {}} />
    );
    expect(screen.getByText('Натисніть «Запустити тести»')).toBeTruthy();
  });

  test('shows running state when isRunning', () => {
    render(
      <TestConsole currentStage={3} isRunning={true} runResults={null} t={t} onRunTests={() => {}} />
    );
    expect(screen.getByText('Запуск sandbox...')).toBeTruthy();
  });

  test('shows test results', () => {
    const { container } = render(
      <TestConsole currentStage={3} isRunning={false}
        runResults={{ success: true, results: [{ name: 'test 1', success: true }] }}
        t={t} onRunTests={() => {}} />
    );
    expect(container.textContent).toContain('test 1');
    expect(container.textContent).toContain('Пройдено');
  });

  test('shows all tests passed message', () => {
    const { container } = render(
      <TestConsole currentStage={3} isRunning={false}
        runResults={{ success: true, results: [{ name: 'test 1', success: true }] }}
        t={t} onRunTests={() => {}} />
    );
    expect(container.textContent).toContain('Всі тести пройдено!');
  });

  test('shows error card when runResults has error', () => {
    const { container } = render(
      <TestConsole currentStage={3} isRunning={false}
        runResults={{ success: false, error: 'SyntaxError: unexpected token' }}
        t={t} onRunTests={() => {}} />
    );
    expect(container.textContent).toContain('SyntaxError');
  });

  test('stage 1 shows testsOnPractice message', () => {
    render(
      <TestConsole currentStage={1} isRunning={false} runResults={null} t={t} onRunTests={() => {}} />
    );
    expect(screen.getByText('Тести доступні під час практики')).toBeTruthy();
  });

  test('stage 7 shows intervalDone message', () => {
    render(
      <TestConsole currentStage={7} isRunning={false} runResults={null} t={t} onRunTests={() => {}} />
    );
    expect(screen.getByText('Завдання вивчено, інтервал запущено')).toBeTruthy();
  });
});

// ── ToggleSwitch ────────────────────────────────────────────────────────
describe('ToggleSwitch', () => {
  test('renders with label', () => {
    const { container } = render(<ToggleSwitch checked={false} onChange={() => {}} label="Коментарі" />);
    expect(container.textContent).toContain('Коментарі');
  });

  test('calls onChange on click', () => {
    let toggled = false;
    const { container } = render(<ToggleSwitch checked={false} onChange={() => { toggled = true; }} label="Коментарі" />);
    fireEvent.click(container.firstElementChild!);
    expect(toggled).toBe(true);
  });
});
