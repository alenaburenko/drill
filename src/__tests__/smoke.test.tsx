import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';
import { CodeEditor } from '../components/CodeEditor';
import { itleadTasks } from '../tasks/itlead';

// ── Smoke: App renders ────────────────────────────────────────────────────
describe('App', () => {
  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});

// ── CodeEditor ────────────────────────────────────────────────────────────
describe('CodeEditor', () => {
  test('renders with code content', () => {
    const { container } = render(<CodeEditor code="function hello() { return 42; }" onChange={() => {}} />);
    expect(container.querySelector('[class]')).toBeTruthy();
  });

  test('accepts readOnly prop', () => {
    const { container } = render(<CodeEditor code="const x = 1;" onChange={() => {}} readOnly={true} />);
    expect(container.querySelector('[class]')).toBeTruthy();
  });
});

// ── TaskView (basic rendering check) ─────────────────────────────────────
describe('TaskView', () => {
  test('renders with a valid task', async () => {
    const { TaskView } = await import('../components/TaskView');
    const task = itleadTasks[0];
    const { container } = render(
      <TaskView
        task={task}
        progress={{ learningStage: 1, peeksCount: 0, lastPracticed: null, history: [] }}
        onSaveProgress={() => {}}
        onBack={() => {}}
      />,
    );
    expect(container.textContent).toBeTruthy();
  });
});
