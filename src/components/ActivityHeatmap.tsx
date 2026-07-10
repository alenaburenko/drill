import React, { useMemo } from 'react';
import { UserProgress } from '../types';
import { Sparkles } from 'lucide-react';

interface ActivityHeatmapProps {
  progressMap: Record<string, UserProgress>;
  lang: 'uk' | 'en';
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ progressMap, lang }) => {
  const activityData = useMemo(() => {
    // 1. Gather all history attempts
    const counts: Record<string, number> = {};
    Object.values(progressMap).forEach((progress) => {
      const p = progress as UserProgress;
      if (p?.history) {
        p.history.forEach(attempt => {
          if (attempt.date) {
            const dateStr = attempt.date.split('T')[0]; // YYYY-MM-DD
            counts[dateStr] = (counts[dateStr] || 0) + (attempt.success ? 2 : 1); // Success counts more!
          }
        });
      }
    });

    // 2. Generate last 12 weeks grid starting from Sunday of 11 weeks ago
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Find the Sunday of the current week
    const currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() - dayOfWeek);
    currentSunday.setHours(0, 0, 0, 0);

    // Start date is Sunday of 11 weeks ago
    const startDate = new Date(currentSunday);
    startDate.setDate(currentSunday.getDate() - 11 * 7);

    const grid: { date: Date; dateStr: string; count: number; isFuture: boolean }[][] = [];
    
    // 12 columns (weeks)
    for (let w = 0; w < 12; w++) {
      const week: typeof grid[0] = [];
      // 7 rows (days, Sunday to Saturday)
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + w * 7 + d);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const isFuture = currentDate > today;
        const count = counts[dateStr] || 0;
        
        week.push({
          date: currentDate,
          dateStr,
          count: isFuture ? 0 : count,
          isFuture,
        });
      }
      grid.push(week);
    }
    return { grid, totalActivities: Object.values(counts).reduce((a, b) => a + b, 0) };
  }, [progressMap]);

  const { grid, totalActivities } = activityData;

  const dayLabels = lang === 'uk' ? ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthsUk = ['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Верес', 'Жовт', 'Лист', 'Груд'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = lang === 'uk' ? monthsUk : monthsEn;

  // Find month labels to show at top
  const monthLabels = useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, wIdx) => {
      const firstDayOfWeek = week[0].date;
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        labels.push({ text: months[month], colIndex: wIdx });
        lastMonth = month;
      }
    });
    return labels.filter((l, i, arr) => i === 0 || l.colIndex - arr[i-1].colIndex >= 2);
  }, [grid, months]);

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'uk' ? 'Календар кодової активності' : 'Code Activity Heatmap'}</span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {lang === 'uk' ? `Всього активностей: ${totalActivities}` : `Total activities: ${totalActivities}`}
        </span>
      </div>

      <div className="flex gap-2 items-end justify-center pt-2">
        {/* Day of week labels */}
        <div className="flex flex-col gap-[3px] text-[8px] font-mono text-[var(--text-muted)] select-none pb-[2px] pr-1">
          {dayLabels.map((lbl, idx) => (
            <div key={lbl} className="h-[9px] flex items-center justify-end" style={{ opacity: idx % 2 === 0 ? 0.4 : 1 }}>
              {lbl}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex flex-col gap-1">
          {/* Month labels row */}
          <div className="h-3 relative text-[8px] font-mono text-[var(--text-muted)] select-none">
            {monthLabels.map(lbl => (
              <span key={lbl.colIndex} className="absolute" style={{ left: `${lbl.colIndex * 13}px` }}>
                {lbl.text}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {grid.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map(day => {
                  let bgColor = 'var(--bg-elevated)';
                  let opacity = 0.2;
                  let glow = 'none';
                  
                  if (day.isFuture) {
                    opacity = 0.05;
                  } else if (day.count > 0) {
                    opacity = 1;
                    if (day.count === 1) {
                      bgColor = 'var(--accent-dim)';
                    } else if (day.count <= 3) {
                      bgColor = 'var(--accent)';
                      glow = '0 0 6px var(--accent-glow)';
                    } else {
                      bgColor = 'var(--neon-magenta)';
                      glow = '0 0 10px rgba(255, 0, 255, 0.4)';
                    }
                  }

                  return (
                    <div
                      key={day.dateStr}
                      title={`${day.dateStr} : ${day.count} ${lang === 'uk' ? 'дій' : 'activities'}`}
                      className="w-[9px] h-[9px] rounded-[1px] transition-all hover:scale-125 cursor-pointer border"
                      style={{
                        background: bgColor,
                        borderColor: day.count > 0 ? 'transparent' : 'var(--border)',
                        opacity,
                        boxShadow: glow,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[8px] font-mono text-[var(--text-muted)] pr-2">
        <span>{lang === 'uk' ? 'Менше' : 'Less'}</span>
        <div className="w-[8px] h-[8px] rounded-[1px] border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', opacity: 0.2 }} />
        <div className="w-[8px] h-[8px] rounded-[1px]" style={{ background: 'var(--accent-dim)' }} />
        <div className="w-[8px] h-[8px] rounded-[1px]" style={{ background: 'var(--accent)', boxShadow: '0 0 4px var(--accent-glow)' }} />
        <div className="w-[8px] h-[8px] rounded-[1px]" style={{ background: 'var(--neon-magenta)', boxShadow: '0 0 6px rgba(255, 0, 255, 0.4)' }} />
        <span>{lang === 'uk' ? 'Більше' : 'More'}</span>
      </div>
    </div>
  );
};
