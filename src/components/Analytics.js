import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  Sword, Shield, Zap, Flame, Star, Trophy, Crown, Heart,
  TrendingUp, TrendingDown, Target, Clock, Brain, Award, Scroll,
  ChevronUp, ChevronDown, Activity, Map
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const AREA_META = {
  health:        { label: 'Salud',     icon: '❤️', color: '#22c55e', stat: 'VIT' },
  career:        { label: 'Carrera',   icon: '💼', color: '#3b82f6', stat: 'INT' },
  relationships: { label: 'Relaciones',icon: '👥', color: '#ec4899', stat: 'CAR' },
  personal:      { label: 'Personal',  icon: '🧠', color: '#8b5cf6', stat: 'SAB' },
  finances:      { label: 'Finanzas', icon: '💰', color: '#f59e0b', stat: 'FOR' },
  home:          { label: 'Hogar',     icon: '🏠', color: '#f97316', stat: 'DES' },
};

const TIME_LABELS = {
  morning: { label: 'Mañana', icon: '🌅', color: '#f59e0b' },
  afternoon: { label: 'Tarde', icon: '☀️', color: '#f97316' },
  evening: { label: 'Tarde/Noche', icon: '🌆', color: '#8b5cf6' },
  night: { label: 'Noche', icon: '🌙', color: '#6366f1' },
  all: { label: 'Todo el día', icon: '🔆', color: '#3b82f6' },
};

// ── Mini Components ───────────────────────────────────────────────────────────
function QuestCard({ title, subtitle, icon, color, value, maxValue, badge }) {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: 18, border: '1px solid #e5e7eb',
      borderLeft: `4px solid ${color}`, transition: 'box-shadow 0.2s'
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${color}22`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
          }}>{icon}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1f2937' }}>{title}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{subtitle}</div>
          </div>
        </div>
        {badge && (
          <span style={{
            padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
            background: `${color}18`, color, border: `1px solid ${color}44`
          }}>{badge}</span>
        )}
      </div>
      {maxValue > 0 && (
        <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 1s' }} />
        </div>
      )}
      <div style={{ fontSize: 18, fontWeight: 900, color, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function BossCard({ habit }) {
  const pct = Math.min(100, Math.max(0, 100 - habit.daysClean * 3));
  const bossColor = pct > 60 ? '#ef4444' : pct > 30 ? '#f59e0b' : '#22c55e';
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f2937, #374151)',
      borderRadius: 14, padding: 16, color: '#fff', position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{habit.icon || '👿'}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{habit.name}</div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>{habit.daysClean} días limpio</div>
        </div>
        {pct <= 0 && <span style={{ marginLeft: 'auto', fontSize: 18 }}>🏆</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#9ca3af' }}>☠️ Vida del Demonio</span>
        <span style={{ fontSize: 10, color: bossColor, fontWeight: 700 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 8, background: '#4b5563', borderRadius: 999 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: bossColor, borderRadius: 999, transition: 'width 1s' }} />
      </div>
      {habit.milestones?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {habit.milestones.map(m => (
            <span key={m} style={{ fontSize: 10, background: '#22c55e22', color: '#22c55e', padding: '2px 6px', borderRadius: 999, border: '1px solid #22c55e33' }}>✅ {m}d</span>
          ))}
        </div>
      )}
    </div>
  );
}

// mini bar chart for the week
function WeekBarChart({ data }) {
  const max = Math.max(...data.map(d => d.completed), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
      {data.map((d, i) => {
        const pct = (d.completed / max) * 100;
        const isToday = i === data.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: 60, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${Math.max(4, pct)}%`, borderRadius: 4,
                background: isToday ? '#8b5cf6' : '#e5e7eb',
                transition: 'height 0.5s'
              }} />
            </div>
            <span style={{ fontSize: 9, color: isToday ? '#8b5cf6' : '#9ca3af', fontWeight: isToday ? 700 : 400 }}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function Analytics({ addNotification }) {
  const { gameData, themes } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;

  const habits = gameData.habits || [];
  const tasks = gameData.tasks || [];
  const badHabits = gameData.badHabits || [];
  const lifeAreas = gameData.lifeAreas || [];
  const user = gameData.user;

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const overview = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const completedHabits = habits.filter(h => h.completedToday).length;
    const totalHabitsEver = user.totalHabitsCompleted || 0;
    const totalTasksEver = user.totalTasksCompleted || 0;
    const avgStreak = habits.length > 0
      ? Math.round(habits.reduce((s, h) => s + h.streak, 0) / habits.length) : 0;
    const power = Math.round(
      (user.xp || 0) * 0.4 +
      (user.streak || 0) * 5 +
      totalHabitsEver * 2 +
      totalTasksEver * 3
    );
    return { completedTasks, completedHabits, avgStreak, power, totalHabitsEver, totalTasksEver };
  }, [habits, tasks, user]);

  // Stats por área de vida
  const areaStats = useMemo(() => {
    return lifeAreas.map(area => ({
      ...area,
      meta: AREA_META[area.id],
      habitCount: habits.filter(h => h.category === area.id).length,
      completedHabits: habits.filter(h => h.category === area.id && h.completedToday).length,
    })).sort((a, b) => b.progress - a.progress);
  }, [lifeAreas, habits]);

  // Distribución temporal de hábitos
  const timeDistribution = useMemo(() => {
    const dist = {};
    habits.forEach(h => {
      const t = h.timeOfDay || 'morning';
      dist[t] = (dist[t] || 0) + 1;
    });
    return Object.entries(dist).sort(([,a], [,b]) => b - a);
  }, [habits]);

  // Productividad últimos 7 días (simulada basada en streaks)
  const weekData = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayName = days[d.getDay()];
      // Aproximación: hábitos con streak >= (7-i) días estaban activos ese día
      const daysAgo = 6 - i;
      const completed = habits.filter(h => h.streak >= daysAgo && h.totalCompletions > daysAgo).length;
      return { day: dayName, completed, total: habits.length };
    });
  }, [habits]);

  // Top hábitos por racha
  const topHabits = useMemo(() => {
    return [...habits].sort((a, b) => b.streak - a.streak).slice(0, 5);
  }, [habits]);

  // Recomendaciones RPG
  const quests = useMemo(() => {
    const q = [];
    const completionRate = habits.length > 0 ? (habits.filter(h => h.completedToday).length / habits.length) * 100 : 0;

    if (completionRate < 50 && habits.length > 0) q.push({
      type: 'danger', icon: '⚠️', color: '#ef4444',
      title: 'Tasa de Completion Baja',
      desc: `Solo ${Math.round(completionRate)}% de hábitos completados hoy`,
      suggestion: 'Reduce el número de hábitos o muévelos a horarios que funcionen mejor',
      xp: 50
    });

    if ((user.streak || 0) === 0) q.push({
      type: 'warning', icon: '🔥', color: '#f59e0b',
      title: 'Sin Racha Activa',
      desc: 'Tu racha se reinició. ¡Hora de volver al combate!',
      suggestion: 'Completa al menos 1 hábito hoy para reiniciar tu racha',
      xp: 30
    });

    const abandonedHabits = habits.filter(h => h.streak === 0 && h.totalCompletions > 0);
    if (abandonedHabits.length > 0) q.push({
      type: 'info', icon: '🗡️', color: '#8b5cf6',
      title: `${abandonedHabits.length} Hábito(s) Olvidados`,
      desc: 'Tienes hábitos con racha rota que necesitan atención',
      suggestion: 'Reinicia los más importantes o elimina los innecesarios',
      xp: 40
    });

    const weakestArea = areaStats.length > 0 ? areaStats[areaStats.length - 1] : null;
    if (weakestArea && weakestArea.progress < 20) q.push({
      type: 'focus', icon: '🎯', color: '#3b82f6',
      title: `Área Débil: ${weakestArea.meta?.label}`,
      desc: `Solo ${weakestArea.progress}% de progreso en esta área`,
      suggestion: `Añade 1-2 hábitos de ${weakestArea.meta?.label} para fortalecer esta stat`,
      xp: 60
    });

    if (badHabits.length > 0) {
      const bestBad = [...badHabits].sort((a, b) => b.daysClean - a.daysClean)[0];
      if (bestBad.daysClean >= 7) q.push({
        type: 'success', icon: '🏆', color: '#10b981',
        title: `¡${bestBad.daysClean} días sin "${bestBad.name}"!`,
        desc: 'Estás ganando la batalla contra un mal hábito',
        suggestion: 'Mantén la racha y desbloquea el milestone de 30 días',
        xp: bestBad.daysClean >= 30 ? 150 : 50
      });
    }

    return q;
  }, [habits, user, areaStats, badHabits]);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '🗺️' },
    { id: 'habits', label: 'Hábitos', icon: '🔥' },
    { id: 'areas', label: 'Áreas', icon: '⚔️' },
    { id: 'battles', label: 'Batallas', icon: '👹' },
  ];

  return (
    <div className={`space-y-6 ${themeConfig.text}`}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
        borderRadius: 20, padding: '24px 28px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: '#8b5cf610' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ margin: 0, color: '#fff', fontSize: 26, fontWeight: 900 }}>⚔️ Sala de Guerra</h1>
          <p style={{ margin: '6px 0 16px', color: '#a78bfa', fontSize: 13 }}>
            El diario de batalla de tu personaje. Analiza tus victorias y derrotas.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Poder Total', val: overview.power, icon: '⚡', color: '#a78bfa' },
              { label: 'Misiones', val: overview.totalTasksEver, icon: '✅', color: '#34d399' },
              { label: 'Hábitos', val: overview.totalHabitsEver, icon: '🔥', color: '#fbbf24' },
              { label: 'Racha', val: `${user.streak || 0}d`, icon: '🏆', color: '#f87171' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.icon} {s.val}</div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 14, padding: 4 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: activeTab === tab.id ? '#fff' : 'transparent',
            color: activeTab === tab.id ? '#4f46e5' : '#6b7280',
            fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 12,
            boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s'
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quest Log */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#1f2937', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Scroll style={{ width: 18, height: 18, color: '#4f46e5' }} /> Diario de Misiones
            </h3>
            {quests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af' }}>
                <Trophy style={{ width: 36, height: 36, margin: '0 auto 8px', opacity: 0.3 }} />
                <p style={{ margin: 0, fontWeight: 600 }}>¡Eres imparable! No hay alertas activas</p>
              </div>
            ) : quests.map((q, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                borderRadius: 12, marginBottom: 10, background: `${q.color}08`,
                border: `1px solid ${q.color}22`
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{q.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1f2937', marginBottom: 2 }}>{q.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{q.desc}</div>
                  <div style={{ fontSize: 12, color: q.color, fontWeight: 600 }}>💡 {q.suggestion}</div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>Recompensa</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: q.color }}>+{q.xp} XP</div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly chart */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#1f2937' }}>📅 Actividad Semanal</h3>
            <WeekBarChart data={weekData} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Última semana</span>
              <span style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 700 }}>
                {weekData.reduce((s, d) => s + d.completed, 0)} hábitos completados
              </span>
            </div>
          </div>

          {/* Distribución temporal */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 14px', fontWeight: 800, color: '#1f2937' }}>⏰ Tu Horario de Batalla</h3>
            {timeDistribution.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: 13 }}>Crea hábitos para ver tu distribución de horarios</p>
            ) : timeDistribution.map(([time, count]) => {
              const meta = TIME_LABELS[time] || { label: time, icon: '🕐', color: '#6b7280' };
              const pct = habits.length > 0 ? (count / habits.length) * 100 : 0;
              return (
                <div key={time} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{meta.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{meta.label}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{count} hábitos</span>
                    </div>
                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: meta.color, borderRadius: 999, transition: 'width 1s' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── HABITS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'habits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            <QuestCard title="Hoy completados" subtitle={`de ${habits.length} hábitos`} icon="✅" color="#10b981"
              value={overview.completedHabits} maxValue={habits.length} badge="HOY" />
            <QuestCard title="Racha promedio" subtitle="días consecutivos" icon="🔥" color="#f59e0b"
              value={`${overview.avgStreak} días`} maxValue={0} />
            <QuestCard title="Total acumulado" subtitle="completados en total" icon="🏆" color="#8b5cf6"
              value={overview.totalHabitsEver} maxValue={0} />
            <QuestCard title="Malos hábitos" subtitle="enemigos activos" icon="⚔️" color="#ef4444"
              value={badHabits.length} maxValue={0} />
          </div>

          {/* Top hábitos */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#1f2937' }}>🏅 Campeones — Top Hábitos por Racha</h3>
            {topHabits.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: 13 }}>Aún no hay hábitos con racha</p>
            ) : topHabits.map((h, i) => {
              const area = AREA_META[h.category];
              const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
              return (
                <div key={h.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: i < topHabits.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <span style={{ fontSize: 20 }}>{medals[i]}</span>
                  <span style={{ fontSize: 22 }}>{h.icon || '⭐'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1f2937' }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{area?.label || h.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: 16 }}>🔥 {h.streak}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>días</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dificultad breakdown */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 14px', fontWeight: 800, color: '#1f2937' }}>⚡ Dificultad de tu Arsenal</h3>
            {[
              { id: 'easy', label: 'Fácil', color: '#22c55e', icon: '🟢' },
              { id: 'medium', label: 'Medio', color: '#f59e0b', icon: '🟡' },
              { id: 'hard', label: 'Difícil', color: '#f97316', icon: '🟠' },
              { id: 'extreme', label: 'Extremo', color: '#ef4444', icon: '🔴' },
            ].map(diff => {
              const count = habits.filter(h => h.difficulty === diff.id).length;
              const pct = habits.length > 0 ? (count / habits.length) * 100 : 0;
              return (
                <div key={diff.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 14 }}>{diff.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', width: 70 }}>{diff.label}</span>
                  <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: diff.color, borderRadius: 999, transition: 'width 1s' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af', minWidth: 30, textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AREAS TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'areas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {areaStats.map((area, i) => {
              const meta = area.meta || {};
              const isStrong = i < 2;
              const isWeak = i >= areaStats.length - 2;
              return (
                <div key={area.id} style={{
                  background: '#fff', borderRadius: 16, padding: 18, border: '1px solid #e5e7eb',
                  borderLeft: `4px solid ${meta.color || '#6b7280'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>{meta.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#1f2937' }}>{meta.label}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{area.habitCount} hábitos</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {isStrong && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#dcfce7', color: '#16a34a', fontWeight: 700 }}>FORTALEZA</span>}
                      {isWeak && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#fee2e2', color: '#dc2626', fontWeight: 700 }}>DEBILIDAD</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{meta.stat} — {meta.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: meta.color }}>{area.progress}%</span>
                  </div>
                  <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${area.progress}%`,
                      background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
                      borderRadius: 999, transition: 'width 1s'
                    }} />
                  </div>

                  {area.completedHabits > 0 && (
                    <div style={{ fontSize: 11, color: '#16a34a', marginTop: 6, fontWeight: 600 }}>
                      ✅ {area.completedHabits}/{area.habitCount} hábitos completados hoy
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* XP per area */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 14px', fontWeight: 800, color: '#1f2937' }}>🎯 XP por Área de Vida (estimado)</h3>
            {areaStats.map(area => {
              const areaHabits = habits.filter(h => h.category === area.id);
              const xpEarned = areaHabits.reduce((s, h) => s + (h.earnedXP || 0) + (h.totalCompletions || 0) * (h.xp || 10), 0);
              const meta = area.meta || {};
              return (
                <div key={area.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{meta.icon}</span>
                  <span style={{ fontSize: 13, color: '#374151', width: 90 }}>{meta.label}</span>
                  <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${Math.min(100, xpEarned / 10)}%`, background: meta.color, borderRadius: 999 }} />
                  </div>
                  <span style={{ minWidth: 48, textAlign: 'right', fontSize: 12, fontWeight: 700, color: meta.color }}>
                    {xpEarned} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BATTLES TAB (Bad Habits + Boss Battles) ─────────────────────────── */}
      {activeTab === 'battles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{
            background: 'linear-gradient(135deg, #1a0a0a, #3b1515)',
            borderRadius: 16, padding: '20px 24px', color: '#fff'
          }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>⚔️ Registro de Batallas</h2>
            <p style={{ margin: '6px 0 0', color: '#fca5a5', fontSize: 13 }}>
              Cada mal hábito es un jefe. Tu racha limpia reduce su vida. ¡Derrótalo!
            </p>
          </div>

          {badHabits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 24px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>⚔️</span>
              <p style={{ fontWeight: 700, color: '#374151' }}>No hay batallas activas</p>
              <p style={{ color: '#9ca3af', fontSize: 13 }}>Ve a Hábitos → Malos Hábitos para agregar enemigos</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {[...badHabits].sort((a, b) => b.daysClean - a.daysClean).map(bh => (
                <BossCard key={bh.id} habit={bh} />
              ))}
            </div>
          )}

          {/* Battle log - estadísticas de malos hábitos */}
          {badHabits.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 14px', fontWeight: 800, color: '#1f2937' }}>📜 Historial de Campaña</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Demonios activos', val: badHabits.length, icon: '👹', color: '#ef4444' },
                  { label: 'Mejor racha', val: `${Math.max(...badHabits.map(b => b.daysClean), 0)}d`, icon: '🏆', color: '#f59e0b' },
                  { label: 'Milestones 7d', val: badHabits.filter(b => b.milestones?.includes(7)).length, icon: '⭐', color: '#8b5cf6' },
                  { label: 'Milestones 30d', val: badHabits.filter(b => b.milestones?.includes(30)).length, icon: '👑', color: '#10b981' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: 14, background: '#f9fafb', borderRadius: 12 }}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div style={{ fontWeight: 900, fontSize: 20, color: s.color, marginTop: 6 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
