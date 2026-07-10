// i18n.ts — UI translations for Drill Practice Platform
// Covers all UI strings. Task content (description, breakdown) stays as-is.

export type Lang = 'uk' | 'en';

const translations = {
  uk: {
    // Header
    appTitle: 'DRILL',
    appBadge: 'Тренажер заучування',
    appSubtitle: "Ефективне запам'ятовування коду через інтервальні повторення",

    // Nav tabs
    navTrainer: 'Тренажер',
    navCatalog: 'Каталог',
    navUpload: 'Завантаження',
    navProgress: 'Прогрес',

    // Dashboard
    personalQueue: 'Персональна черга',
    trainerReady: 'Ваш тренажер готовий до запуску',
    trainerDesc: (due: number, newT: number) =>
      `Повторення закріплює знання у довгостроковій пам'яті. Сьогодні заплановано <b>${due} повторень</b> та доступно <b>${newT} нових задач</b>.`,
    continuePractice: 'ПРОДОВЖИТИ ЗАУЧУВАННЯ',
    scheduledRepetitions: (n: number) => `Заплановано ${n} повторень`,
    availableNewTasks: (n: number) => `та доступно ${n} нових задач`,

    // Repetition queue
    repetitionQueue: 'Черга на повторення',
    intervalSchedule: 'Інтервальний розклад',
    noRepetitions: 'Немає прострочених задач на повторення. Відмінний результат!',
    startPractice: 'Почати практику',

    // New tasks
    newTasks: 'Нові кодові задачі',
    viewAll: 'Дивитися всі',

    // Stats
    yourProgress: 'Ваш прогрес',
    masteredTasks: 'Освоєні задачі',
    inLearning: 'В заучуванні',
    testAccuracy: 'Точність тестів',
    totalPeeks: 'Всього підглядань',
    peeksTimes: (n: number) => `${n} разів`,

    // How it works
    howItWorks: 'Як працює тренажер?',
    howDesc: 'Кожна кодова задача заучується у 6 етапів:',
    stages: [
      'Вивчення розбору та еталона',
      'Ручне переписування зразок перед очима',
      "Написання за пам'яттю з підказками",
      'Відновлення пропусків cloze',
      'Написання з нуля по умові',
      'Live-coding Іспит з таймером',
    ],
    howNote:
      'Успішне виконання тестів просуває задачу вперед і планує інтервальне повторення. Будь-яка помилка залишає задачу на поточному етапі для додаткового закріплення!',

    // Catalog
    searchPlaceholder: 'Пошук за назвою або ID...',
    filters: 'Фільтри:',
    allDifficulties: 'Усі складності',
    allCategories: 'Усі категорії',
    allStages: 'Усі етапи заучування',
    unstartedStage: 'Не розпочато (Stage 1)',
    masteredLabel: 'Освоєно',
    practiceBtn: 'Практикуватись',
    noTasksFound: 'Задач за вашими фільтрами не знайдено. Спробуйте скинути фільтри або виконайте новий пошук.',
    stageOf: (s: number) => `Етап ${s} / 6`,
    tasksCount: (n: number) => `${n} задач`,

    // Upload
    importJson: 'Імпорт масиву задач (JSON)',
    importJsonDesc:
      'Ви можете імпортувати власні задачі або цілу базу. Формат має відповідати інтерфейсу DrillTask [].',
    importBtn: 'Завантажити нові задачі',
    createTask: 'Створити індивідуальну задачу',
    createTaskDesc: 'Додайте окрему задачу вручну заповнивши всі необхідні поля.',
    taskTitle: 'Назва задачі *',
    taskTitlePlaceholder: 'Наприклад: Знайти найглибший елемент',
    categoryBlock: 'Категорія (Block)',
    difficulty: 'Складність',
    descriptionLabel: 'Опис умови задачі',
    descriptionPlaceholder: 'Сформулюйте умову задачі...',
    codeTemplates: 'Шаблони коду',
    starterLabel: 'Starter Code (заготовка функції)',
    solutionLabel: 'Reference Solution (еталонне рішення)',
    clozeLabel1: 'Cloze Step 1 (мінімальні підказки)',
    clozeLabel2: 'Cloze Step 2 (середні підказки)',
    clozeLabel3: 'Cloze Step 3 (максимальні пропуски)',
    testCodeLabel: 'Test Code (код автотестів)',
    createSaveBtn: 'Створити та зберегти задачу',
    taskAdded: 'Нову задачу успішно додано до каталогу!',

    // Backup
    exportImport: 'Експорт та імпорт прогресу заучування',
    exportImportDesc:
      'Ви можете скопіювати резервну копію вашого поточного прогресу, або вставити раніше збережену копію для відновлення.',
    backupTitle: 'Резервне копіювання прогресу',
    backupDesc: 'Натисніть на кнопку нижче, щоб сформувати текстову резервну копію.',
    generateBackup: 'Згенерувати резервну копію прогресу',
    restoreTitle: 'Відновлення прогресу',
    restoreWarning: 'Попередження: Імпорт прогресу перезапише вашу поточну статистику та історію занять.',
    restorePlaceholder: 'Вставте сюди скопійовану резервну копію (JSON)...',
    restoreBtn: 'Відновити прогрес заучування',
    restoreConfirm: 'Ви дійсно хочете перезаписати весь поточний прогрес заучування?',
    restoreSuccess: 'Прогрес заучування успішно відновлено!',
    restoreError: (msg: string) => `Помилка імпорту прогресу: ${msg}`,
    pasteFirst: 'Будь ласка, вставте текст резервної копії.',

    // TaskView
    back: 'Назад',
    stageLabel: (n: number) => `Етап ${n}`,
    examTimer: 'Екзамен:',
    peeksLabel: 'Підглядань:',
    maxTime: 'Макс. час:',
    minSuffix: 'хв',

    // Stage headers
    stageHeaders: [
      {
        title: 'Етап 1: Вивчення коду',
        desc: 'Уважно вивчіть умову задачі, готове еталонне рішення та докладний розбір логіки нижче. Коли будете готові перейти до практики — натисніть кнопку внизу.',
      },
      {
        title: 'Етап 2: Переписування рішень',
        desc: 'Зліва відображено готове еталонне рішення. Ваше завдання — повністю переписати його руками в редакторі справа і запустити тести. Жодного копіювання!',
      },
      {
        title: 'Етап 3: Відтворення з підказкою',
        desc: 'Рішення повністю приховано. Спробуйте написати код самостійно. Якщо виникнуть труднощі, ви можете скористатися кнопкою «Підглянути».',
      },
      {
        title: 'Етап 4: Заповнення пропусків',
        desc: 'Нижче наведено код з пропущеними ключовими рядками. Відновіть відсутні частини логіки замість коментарів /* ??? */.',
      },
      {
        title: 'Етап 5: З чистого листа',
        desc: 'Орієнтуйтеся тільки на опис задачі та початкову заготовку функції. Рішення повністю приховано.',
      },
      {
        title: 'Етап 6: Live-coding Екзамен',
        desc: 'Найсуворіший етап. Чистий редактор, увімкнений таймер, переглянути рішення неможливо. Пройдіть тести!',
      },
      {
        title: 'Етап 7: Задача освоєна! 🎉',
        desc: 'Вітаємо! Ви повністю вивчили та заучили рішення цієї задачі за інтервальним методом.',
      },
    ],

    // Task workspace
    taskCondition: 'Умова задачі',
    referenceSolution: 'Еталонне рішення (JavaScript)',
    copyForRetyping: 'Зразок для переписування',
    hint: 'Підказка',
    hideHint: 'Сховати підказку',
    peekSolution: 'Підглянути рішення',
    solutionHidden: 'Рішення приховано',
    solutionHiddenDesc: "Спробуйте написати код самостійно за пам'яттю, щоб зміцнити нейронні зв'язки.",
    peekAnyway: 'Все одно підглянути (+1 до статистики)',
    startPracticeBtn: 'Розпочати практику (Перейти до Етапу 2)',
    logicBreakdown: 'Розбір логіки та аналіз',
    timeExpired: 'Час вийшов! 😢',
    timeExpiredDesc: (min: number) => `Ви не вклалися у відведений ліміт часу (${min} хв). Спробуйте ще раз!`,
    retryExam: 'Спробувати знову (Перезапустити екзамен)',
    examActive: 'Йде Live-coding іспит',
    examActiveDesc: 'Підказки повністю відключені. Час обмежений. Ви повинні самостійно відтворити код і пройти тести.',
    currentTime: 'Поточний час:',
    mastered: 'Освоєно 🎉',
    masterySummary: "Ви успішно пройшли всі 6 етапів запам'ятовування. Ця задача тепер вважається освоєною!",
    masteryResults: 'Ваші результати:',
    masteryStatus: 'Статус:',
    masteryStatusVal: 'Освоєно (7/7)',
    masteryPeeks: 'Підглянуто разів:',
    masteryRepeat: 'Повторення:',
    masteryRepeatVal: 'через 30 днів',
    stage1Right: 'Ознайомтеся з описом та рішенням зліва. Коли будете готові — натисніть «Розпочати практику»!',
    stage1Title: 'Етап 1: Ознайомлення з матеріалом',
    masteredFull: 'Задача успішно освоєна! 🎉',
    resetCode: 'Скинути',
    resetConfirm: 'Ви дійсно хочете скинути поточний код до початкового стану?',
    testConsole: 'КОНСОЛЬ ТЕСТУВАЛЬНИКА',
    runTests: 'Запустити тести',
    running: 'Запуск...',
    runningWorker: 'Виконання тестування в Web Worker...',
    testsOnPractice: 'Тести будуть доступні на етапах практики (2-6).',
    pressRunTests: 'Натисніть «Запустити тести» для перевірки вашого коду.',
    intervalDone: 'Інтервальне повторення налаштовано. Наступна практика рекомендується через 30 днів.',
    allTestsPassed: (next: boolean) =>
      `🎉 ВІТАЄМО! Всі тести пройдено успішно. ${next ? 'Переходимо на наступний етап...' : 'Екзамен здано!'}`,
    testPassed: 'Passed',
    testFailed: 'Failed',
    testError: 'Помилка:',
    category: 'Категорія:',
    id: 'ID:',
  },
  en: {
    appTitle: 'DRILL',
    appBadge: 'Code Trainer',
    appSubtitle: 'Effective code memorization through spaced repetition',

    navTrainer: 'Trainer',
    navCatalog: 'Catalog',
    navUpload: 'Upload',
    navProgress: 'Progress',

    personalQueue: 'Personal Queue',
    trainerReady: 'Your trainer is ready to go',
    trainerDesc: (due: number, newT: number) =>
      `Repetition cements knowledge in long-term memory. Today you have <b>${due} repetitions</b> scheduled and <b>${newT} new tasks</b> available.`,
    continuePractice: 'CONTINUE PRACTICE',
    scheduledRepetitions: (n: number) => `${n} repetitions scheduled`,
    availableNewTasks: (n: number) => `and ${n} new tasks available`,

    repetitionQueue: 'Repetition Queue',
    intervalSchedule: 'Spaced Schedule',
    noRepetitions: 'No overdue repetitions. Great job!',
    startPractice: 'Start practice',

    newTasks: 'New Code Tasks',
    viewAll: 'View all',

    yourProgress: 'Your Progress',
    masteredTasks: 'Mastered tasks',
    inLearning: 'In progress',
    testAccuracy: 'Test accuracy',
    totalPeeks: 'Total peeks',
    peeksTimes: (n: number) => `${n} times`,

    howItWorks: 'How does it work?',
    howDesc: 'Each code task is learned in 6 stages:',
    stages: [
      'Study the breakdown and reference',
      'Retype the solution by hand',
      'Write from memory with hints',
      'Fill in cloze blanks',
      'Write from scratch',
      'Live-coding Exam with timer',
    ],
    howNote:
      'Passing tests advances the task and schedules spaced repetition. Any failure keeps the task at the current stage for extra reinforcement!',

    searchPlaceholder: 'Search by title or ID...',
    filters: 'Filters:',
    allDifficulties: 'All difficulties',
    allCategories: 'All categories',
    allStages: 'All learning stages',
    unstartedStage: 'Not started (Stage 1)',
    masteredLabel: 'Mastered',
    practiceBtn: 'Practice',
    noTasksFound: 'No tasks found for your filters. Try clearing filters or search again.',
    stageOf: (s: number) => `Stage ${s} / 6`,
    tasksCount: (n: number) => `${n} tasks`,

    importJson: 'Import Task Array (JSON)',
    importJsonDesc:
      'You can import your own tasks or an entire database. Format must match the DrillTask [] interface.',
    importBtn: 'Import new tasks',
    createTask: 'Create Custom Task',
    createTaskDesc: 'Add a single task manually by filling in all required fields.',
    taskTitle: 'Task Title *',
    taskTitlePlaceholder: 'e.g. Find deepest element',
    categoryBlock: 'Category (Block)',
    difficulty: 'Difficulty',
    descriptionLabel: 'Task Description',
    descriptionPlaceholder: 'Write the task statement...',
    codeTemplates: 'Code Templates',
    starterLabel: 'Starter Code (function skeleton)',
    solutionLabel: 'Reference Solution',
    clozeLabel1: 'Cloze Step 1 (minimal blanks)',
    clozeLabel2: 'Cloze Step 2 (medium blanks)',
    clozeLabel3: 'Cloze Step 3 (maximum blanks)',
    testCodeLabel: 'Test Code (auto-test code)',
    createSaveBtn: 'Create & Save Task',
    taskAdded: 'New task successfully added to the catalog!',

    exportImport: 'Export & Import Learning Progress',
    exportImportDesc:
      'You can copy a backup of your current progress, or paste a previously saved backup to restore it.',
    backupTitle: 'Backup Progress',
    backupDesc: 'Click the button below to generate a text backup you can save to a notepad.',
    generateBackup: 'Generate Progress Backup',
    restoreTitle: 'Restore Progress',
    restoreWarning:
      'Warning: Importing progress will overwrite your current stats and session history in localStorage.',
    restorePlaceholder: 'Paste your copied backup here (JSON)...',
    restoreBtn: 'Restore Learning Progress',
    restoreConfirm: 'Are you sure you want to overwrite all current learning progress?',
    restoreSuccess: 'Learning progress successfully restored!',
    restoreError: (msg: string) => `Progress import error: ${msg}`,
    pasteFirst: 'Please paste the backup text first.',

    back: 'Back',
    stageLabel: (n: number) => `Stage ${n}`,
    examTimer: 'Exam:',
    peeksLabel: 'Peeks:',
    maxTime: 'Max time:',
    minSuffix: 'min',

    stageHeaders: [
      {
        title: 'Stage 1: Study the Code',
        desc: 'Carefully study the task description, the reference solution, and the detailed breakdown below. When ready to start practicing — click the button below.',
      },
      {
        title: 'Stage 2: Retype the Solution',
        desc: 'The reference solution is shown on the left. Your task is to fully retype it by hand in the editor on the right and run the tests. No copy-paste!',
      },
      {
        title: 'Stage 3: Reproduce from Memory',
        desc: 'The solution is fully hidden. Try to write the code on your own. If you struggle, you can use the "Peek" button (each peek is recorded).',
      },
      {
        title: 'Stage 4: Fill in the Blanks',
        desc: 'Below is code with missing key lines. Restore the missing logic instead of the /* ??? */ comments to pass the tests.',
      },
      {
        title: 'Stage 5: From Scratch',
        desc: 'Only the task description and the starter function skeleton are available. The solution is fully hidden, and hints are disabled at this stage.',
      },
      {
        title: 'Stage 6: Live-coding Exam',
        desc: 'The hardest stage. Clean editor, active timer, no peeking. Pass the tests to prove full mastery!',
      },
      {
        title: 'Stage 7: Task Mastered! 🎉',
        desc: 'Congratulations! You have fully learned and memorized this task using the spaced repetition method.',
      },
    ],

    taskCondition: 'Task Description',
    referenceSolution: 'Reference Solution (JavaScript)',
    copyForRetyping: 'Reference for Retyping',
    hint: 'Hint',
    hideHint: 'Hide hint',
    peekSolution: 'Peek at solution',
    solutionHidden: 'Solution Hidden',
    solutionHiddenDesc: 'Try to write the code from memory to strengthen your neural connections.',
    peekAnyway: 'Peek anyway (+1 to stats)',
    startPracticeBtn: 'Start Practice (Go to Stage 2)',
    logicBreakdown: 'Logic Breakdown & Analysis',
    timeExpired: 'Time Expired! 😢',
    timeExpiredDesc: (min: number) => `You didn't finish within the time limit (${min} min). Try again!`,
    retryExam: 'Try Again (Restart Exam)',
    examActive: 'Live-coding Exam in Progress',
    examActiveDesc:
      'Hints are fully disabled. Time is limited. You must independently reproduce the code and pass the tests.',
    currentTime: 'Current time:',
    mastered: 'Mastered 🎉',
    masterySummary: 'You successfully completed all 6 memorization stages. This task is now considered mastered!',
    masteryResults: 'Your results:',
    masteryStatus: 'Status:',
    masteryStatusVal: 'Mastered (7/7)',
    masteryPeeks: 'Peeks:',
    masteryRepeat: 'Next review:',
    masteryRepeatVal: 'in 30 days',
    stage1Right: 'Study the description and solution on the left. When ready — click "Start Practice"!',
    stage1Title: 'Stage 1: Study the Material',
    masteredFull: 'Task Successfully Mastered! 🎉',
    resetCode: 'Reset',
    resetConfirm: 'Do you really want to reset the current code to its initial state?',
    testConsole: 'TEST CONSOLE',
    runTests: 'Run Tests',
    running: 'Running...',
    runningWorker: 'Running tests in Web Worker...',
    testsOnPractice: 'Tests are available in practice stages (2-6).',
    pressRunTests: 'Click "Run Tests" to verify your code.',
    intervalDone: 'Spaced repetition scheduled. Next practice recommended in 30 days.',
    allTestsPassed: (next: boolean) =>
      `🎉 GREAT JOB! All tests passed. ${next ? 'Moving to next stage...' : 'Exam passed!'}`,
    testPassed: 'Passed',
    testFailed: 'Failed',
    testError: 'Error:',
    category: 'Category:',
    id: 'ID:',
  },
} as const;

export type Translations = typeof translations.uk;
export type T = Translations;

export function getT(lang: Lang): T {
  return translations[lang] as unknown as T;
}
