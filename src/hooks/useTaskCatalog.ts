import { useState, useMemo } from 'react';
import { DrillTask, UserProgress } from '../types';
import { getTaskProgress } from '../utils/taskProgress';

export interface CatalogFilters {
  searchQuery: string;
  difficultyFilter: 'all' | 'junior' | 'middle' | 'senior';
  categoryFilter: string;
  stageFilter: string;
}

export interface TaskCatalogResult {
  filters: CatalogFilters;
  setSearchQuery: (v: string) => void;
  setDifficultyFilter: (v: CatalogFilters['difficultyFilter']) => void;
  setCategoryFilter: (v: string) => void;
  setStageFilter: (v: string) => void;
  collapsedGroups: Set<string>;
  toggleGroup: (block: string) => void;
  categories: string[];
  filteredCatalog: DrillTask[];
  groupedCatalog: [string, DrillTask[]][];
}

export function useTaskCatalog(allTasks: DrillTask[], progressMap: Record<string, UserProgress>): TaskCatalogResult {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<CatalogFilters['difficultyFilter']>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach(t => {
      if (t.block) set.add(t.block);
    });
    return Array.from(set);
  }, [allTasks]);

  const filteredCatalog = useMemo(() => {
    return allTasks.filter(task => {
      const prog = getTaskProgress(progressMap, task.id);
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = difficultyFilter === 'all' || task.difficulty === difficultyFilter;
      const matchesCat = categoryFilter === 'all' || task.block === categoryFilter;
      let matchesStage = true;
      if (stageFilter !== 'all') {
        if (stageFilter === 'unstarted')
          matchesStage = !progressMap[task.id] || progressMap[task.id].learningStage === 1;
        else if (stageFilter === 'mastered') matchesStage = progressMap[task.id]?.learningStage >= 7;
        else matchesStage = progressMap[task.id]?.learningStage === parseInt(stageFilter);
      }
      return matchesSearch && matchesDiff && matchesCat && matchesStage;
    });
  }, [allTasks, searchQuery, difficultyFilter, categoryFilter, stageFilter, progressMap]);

  const groupedCatalog = useMemo(() => {
    const map: Record<string, DrillTask[]> = {};
    filteredCatalog.forEach(t => {
      if (!map[t.block]) map[t.block] = [];
      map[t.block].push(t);
    });
    return Object.entries(map).sort(([, a], [, b]) => b.length - a.length);
  }, [filteredCatalog]);

  const toggleGroup = (block: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(block)) next.delete(block);
      else next.add(block);
      return next;
    });
  };

  return {
    filters: { searchQuery, difficultyFilter, categoryFilter, stageFilter },
    setSearchQuery,
    setDifficultyFilter,
    setCategoryFilter,
    setStageFilter,
    collapsedGroups,
    toggleGroup,
    categories,
    filteredCatalog,
    groupedCatalog,
  };
}
