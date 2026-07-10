import React from 'react';
import { DrillTask, UserProgress } from '../types';
import { getT, Lang } from '../i18n';
import { diffBadge } from '../utils/badges';
import { getTaskProgress } from '../utils/taskProgress';
import { TaskCatalogResult } from '../hooks/useTaskCatalog';
import { Button, Card, Badge, EmptyState } from './ui';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { playClick } from '../utils/sound';
import { setRoute } from '../router';

interface CatalogViewProps {
  allTasks: DrillTask[];
  progressMap: Record<string, UserProgress>;
  lang: Lang;
  catalog: TaskCatalogResult;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  allTasks, progressMap, lang, catalog,
}) => {
  const t = getT(lang);
  const {
    filters, setSearchQuery, setDifficultyFilter, setCategoryFilter,
    setStageFilter, collapsedGroups, toggleGroup, categories,
    groupedCatalog,
  } = catalog;

  return (
    <Card padding="md">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between mb-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={filters.searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full lg:w-80 px-3 py-2 text-sm outline-none border font-mono"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="font-mono text-[11px] uppercase tracking-widest flex items-center gap-1.5 px-2 py-1.5 border" style={{ color: 'var(--neon-cyan)', borderColor: 'var(--border)' }}>
            <Filter className="w-3.5 h-3.5" />{t.filters}
          </span>
          {[
            { val: filters.difficultyFilter, set: setDifficultyFilter, opts: [['all', t.allDifficulties], ['junior', 'Junior'], ['middle', 'Middle'], ['senior', 'Senior']] },
            { val: filters.categoryFilter, set: setCategoryFilter, opts: [['all', t.allCategories], ...categories.map(c => [c, c])] },
            { val: filters.stageFilter, set: setStageFilter, opts: [['all', t.allStages], ['unstarted', t.unstartedStage], ['2', 'Stage 2'], ['3', 'Stage 3'], ['4', 'Stage 4'], ['5', 'Stage 5'], ['6', 'Stage 6'], ['mastered', t.masteredLabel]] },
          ].map(({ val, set, opts }, fi) => (
            <select key={fi} value={val} onChange={e => set(e.target.value)}
              className="text-[11px] uppercase tracking-wider px-2 py-1.5 outline-none border font-mono"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Grouped task list */}
      {groupedCatalog.length === 0 ? (
        <EmptyState description={t.noTasksFound} />
      ) : (
        <div className="space-y-6">
          {groupedCatalog.map(([block, tasks]) => {
            const isCollapsed = collapsedGroups.has(block);
            return (
              <div key={block}>
                <button
                  onClick={() => toggleGroup(block)}
                  className="w-full group-header hover:opacity-80 transition-opacity mb-3"
                >
                  <span className="flex-1 text-left">{block.toUpperCase()}</span>
                  <Badge variant="accent" size="sm" className="ml-2">{t.tasksCount(tasks.length)}</Badge>
                  {isCollapsed ? <ChevronDown className="w-3 h-3 ml-2" /> : <ChevronUp className="w-3 h-3 ml-2" />}
                </button>

                {!isCollapsed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => {
                      const prog = getTaskProgress(progressMap, task.id);
                      const isMastered = prog.learningStage >= 7;
                      return (
                        <Card key={task.id} variant="elevated" padding="lg" className={isMastered ? "card-retro-rainbow group" : "group"}>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="accent" size="md" className={diffBadge(task.difficulty)}>{task.difficulty}</Badge>
                              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{task.id.slice(-8)}</span>
                            </div>
                            <h4 className="text-base font-bold transition-colors group-hover:text-[var(--neon-cyan)] line-clamp-1">{task.title}</h4>
                            <p className="text-sm mt-2 line-clamp-2 leading-relaxed font-mono" style={{ color: 'var(--text-muted)' }}>
                              {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                            <Badge variant={isMastered ? 'stage-mastered' : 'stage'} size="md">
                              {isMastered ? t.masteredLabel : t.stageOf(prog.learningStage)}
                            </Badge>
                            <Button variant="primary" size="md" onClick={() => { playClick(); setRoute({ tab: 'catalog', taskId: task.id }); }}>
                              {t.practiceBtn}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
