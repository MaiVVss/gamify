import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  Camera, X, RefreshCw, Moon, Sun, Shield, Sword, Zap, Heart,
  Star, Trophy, Flame, Target, Brain, Briefcase, Users, DollarSign, Home,
  ChevronRight, Award, TrendingUp, Scroll
} from 'lucide-react';

// ── Datos RPG ─────────────────────────────────────────────────────────────────

const CLASSES = [
  { id: 'warrior', name: 'Guerrero', icon: '⚔️', color: '#ef4444', desc: 'Fuerza física y constancia' },
  { id: 'mage', name: 'Mago', icon: '🧙', color: '#8b5cf6', desc: 'Mente brillante y creatividad' },
  { id: 'rogue', name: 'Pícaro', icon: '🗡️', color: '#10b981', desc: 'Velocidad y adaptabilidad' },
  { id: 'paladin', name: 'Paladín', icon: '🛡️', color: '#f59e0b', desc: 'Equilibrio y liderazgo' },
  { id: 'ranger', name: 'Explorador', icon: '🏹', color: '#06b6d4', desc: 'Exploración y hábitos al aire libre' },
];

const RANKS = [
  { min: 0, max: 100, name: 'Recluta', icon: '🪨', color: '#6b7280' },
  { min: 100, max: 250, name: 'Aprendiz', icon: '⚗️', color: '#3b82f6' },
  { min: 250, max: 500, name: 'Veterano', icon: '⚔️', color: '#8b5cf6' },
  { min: 500, max: 1000, name: 'Élite', icon: '🏆', color: '#f59e0b' },
  { min: 1000, max: 2500, name: 'Héroe', icon: '🌟', color: '#ef4444' },
  { min: 2500, max: Infinity, name: 'Leyenda', icon: '👑', color: '#ec4899' },
];

const AREA_STATS = {
  health: { stat: 'VIT', label: 'Vitalidad', icon: Heart, color: '#22c55e' },
  career: { stat: 'INT', label: 'Inteligencia', icon: Brain, color: '#3b82f6' },
  relationships: { stat: 'CAR', label: 'Carisma', icon: Users, color: '#ec4899' },
  personal: { stat: 'SAB', label: 'Sabiduría', icon: Star, color: '#8b5cf6' },
  finances: { stat: 'FOR', label: 'Fortuna', icon: DollarSign, color: '#f59e0b' },
  home: { stat: 'DES', label: 'Destreza', icon: Home, color: '#f97316' },
};

const avatarStyles = [
  { id: 'adventurer', name: 'Aventurero', icon: '🗡️' },
  { id: 'avataaars', name: 'Humanoide', icon: '👤' },
  { id: 'bottts', name: 'Robot', icon: '🤖' },
  { id: 'fun-emoji', name: 'Emoji', icon: '😊' },
  { id: 'lorelei', name: 'Lorelei', icon: '👩' },
  { id: 'pixel-art', name: 'Pixel Art', icon: '👾' },
];

const avatarBgColors = [
  { id: 'b6e3f4', hex: '#b6e3f4', name: 'Azul' },
  { id: 'c0aede', hex: '#c0aede', name: 'Lila' },
  { id: 'd1d4f9', hex: '#d1d4f9', name: 'Lavanda' },
  { id: 'ffd5dc', hex: '#ffd5dc', name: 'Rosa' },
  { id: 'c7f5d3', hex: '#c7f5d3', name: 'Menta' },
  { id: 'fde68a', hex: '#fde68a', name: 'Ámbar' },
];

const accentColors = [
  { id: 'purple', hex: '#9333ea' }, { id: 'blue', hex: '#3b82f6' },
  { id: 'green', hex: '#22c55e' }, { id: 'orange', hex: '#f97316' },
  { id: 'pink', hex: '#ec4899' }, { id: 'red', hex: '#ef4444' },
];

// ── Sub-componentes ────────────────────────────────────────────────────────────

function StatBar({ label, stat, value, max, color, icon: Icon }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon style={{ width: 14, height: 14, color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: 1 }}>{stat}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{Math.round(value)}</span>
      </div>
      <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 999, transition: 'width 1s ease'
        }} />
      </div>
    </div>
  );
}

function RadarChart({ stats }) {
  const size = 200;
  const cx = 100, cy = 100, r = 70;
  const keys = Object.keys(stats);
  const n = keys.length;
  const points = keys.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const val = stats[keys[i]] / 100;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  });
  const gridPoints = keys.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');
  const grid1 = gridPoints.map(p => `${cx + (p.x - cx) * 0.33},${cy + (p.y - cy) * 0.33}`).join(' ');
  const grid2 = gridPoints.map(p => `${cx + (p.x - cx) * 0.66},${cy + (p.y - cy) * 0.66}`).join(' ');
  const grid3 = gridPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid */}
      <polygon points={grid3} fill="none" stroke="var(--border-color)" strokeWidth="1" />
      <polygon points={grid2} fill="none" stroke="var(--border-color)" strokeWidth="1" />
      <polygon points={grid1} fill="none" stroke="var(--border-color)" strokeWidth="1" />
      {/* Axes */}
      {gridPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--border-color)" strokeWidth="1" />
      ))}
      {/* Data */}
      <polygon points={polygon} fill="#8b5cf644" stroke="#8b5cf6" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#8b5cf6" />
      ))}
      {/* Labels */}
      {gridPoints.map((p, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const lx = cx + (r + 18) * Math.cos(angle);
        const ly = cy + (r + 18) * Math.sin(angle);
        const v = Object.values(AREA_STATS);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontWeight="700" fill="var(--text-secondary)">{v[i]?.stat}</text>
        );
      })}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function Profile({ addNotification }) {
  const {
    gameData, updateGameData, setTheme, setAccentColor,
    getAvatarUrl, updateAvatar, themes, rankSystem
  } = useData();

  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('character');
  const [selectedClass, setSelectedClass] = useState(gameData.user?.rpgClass || 'warrior');
  const [avatarSeed, setAvatarSeed] = useState(gameData.user?.avatar?.seed || 'default');

  const user = gameData.user;
  const currentTheme = user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;
  const hp = user?.hp ?? 100;
  const maxHp = user?.maxHp ?? 100;
  const hpPct = Math.min(100, (hp / maxHp) * 100);
  const hpColor = hpPct < 30 ? '#ef4444' : hpPct < 60 ? '#f59e0b' : '#22c55e';

  // Calcular rank actual
  const currentRank = RANKS.find(r => user.xp >= r.min && user.xp < r.max) || RANKS[0];
  const nextRank = RANKS.find(r => r.min > user.xp) || RANKS[RANKS.length - 1];
  const xpToNextRank = nextRank.min - user.xp;
  const rankProgress = ((user.xp - currentRank.min) / (nextRank.min - currentRank.min)) * 100;

  // Calcular stats RPG desde áreas de vida
  const rpgStats = useMemo(() => {
    const areas = gameData.lifeAreas || [];
    const result = {};
    Object.keys(AREA_STATS).forEach(areaId => {
      const area = areas.find(a => a.id === areaId);
      result[areaId] = area?.progress || 0;
    });
    return result;
  }, [gameData.lifeAreas]);

  // Calcular fortalezas y debilidades
  const strengths = useMemo(() => {
    return Object.entries(rpgStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .filter(([,v]) => v > 0);
  }, [rpgStats]);

  const weaknesses = useMemo(() => {
    return Object.entries(rpgStats)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 2);
  }, [rpgStats]);

  // Equipo / logros como "equipment"
  const achievements = gameData.achievements || [];
  const totalTasksDone = user.totalTasksCompleted || 0;
  const totalHabitsDone = user.totalHabitsCompleted || 0;

  const handleSaveClass = () => {
    updateGameData(prev => ({
      ...prev,
      user: { ...prev.user, rpgClass: selectedClass }
    }));
    addNotification(`⚔️ Clase "${CLASSES.find(c => c.id === selectedClass)?.name}" seleccionada`, 'success');
  };

  const randomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatarSeed(seed);
    updateAvatar({ seed });
  };

  // Título RPG basado en nivel y stats
  const rpgTitle = useMemo(() => {
    const cls = CLASSES.find(c => c.id === (user.rpgClass || 'warrior'));
    return `${currentRank.icon} ${cls?.name || 'Guerrero'} ${currentRank.name}`;
  }, [user, currentRank]);

  const tabs = [
    { id: 'character', label: 'Personaje', icon: '⚔️' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'customize', label: 'Apariencia', icon: '🎨' },
  ];

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.text}`}>

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        padding: '32px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: '#8b5cf610', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 60, width: 160, height: 160, borderRadius: '50%', background: '#a78bfa08', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              border: `3px solid ${currentRank.color}`,
              boxShadow: `0 0 20px ${currentRank.color}44`,
              overflow: 'hidden'
            }}>
              <img src={getAvatarUrl(100)} alt="Avatar" style={{ width: '100%', height: '100%' }} />
            </div>
            <button
              onClick={() => setShowAvatarEditor(true)}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: '#8b5cf6', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <Camera style={{ width: 12, height: 12, color: '#fff' }} />
            </button>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                background: `${currentRank.color}22`, color: currentRank.color,
                border: `1px solid ${currentRank.color}44`,
                padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700
              }}>
                {currentRank.icon} {currentRank.name}
              </span>
              <span style={{ color: '#a78bfa', fontSize: 12 }}>NIVEL {user.level}</span>
            </div>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>
              {rpgTitle}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#c4b5fd', fontSize: 13 }}>
              {totalTasksDone} misiones · {totalHabitsDone} hábitos · {achievements.length} logros
            </p>

            {/* XP bar to next rank */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#a78bfa' }}>XP: {user.xp}</span>
                <span style={{ fontSize: 11, color: '#a78bfa99' }}>{nextRank.name} en {xpToNextRank} XP</span>
              </div>
              <div style={{ height: 6, background: '#ffffff18', borderRadius: 999 }}>
                <div style={{
                  height: '100%', width: `${Math.min(100, rankProgress)}%`,
                  background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`,
                  borderRadius: 999, transition: 'width 1s'
                }} />
              </div>
            </div>
          </div>

          {/* HP + Coins */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 140 }}>
              <div style={{ fontSize: 11, color: '#a78bfa', marginBottom: 6 }}>❤️ Vida</div>
              <div style={{ height: 10, background: '#ffffff18', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${hpPct}%`, background: hpColor, borderRadius: 999, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 11, color: hpColor, marginTop: 4, fontWeight: 700 }}>{hp}/{maxHp} HP</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fcd34d' }}>🪙 {user.coins}</div>
              <div style={{ fontSize: 11, color: '#a78bfa' }}>Coins</div>
            </div>
          </div>
        </div>
      </div>

       {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
       <div style={{ padding: '0 0 24px 0' }}>
         <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', borderRadius: 14, padding: 4, maxWidth: 400, marginBottom: 24 }}>
           {tabs.map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
               flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
               background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
               color: activeTab === tab.id ? '#4f46e5' : 'var(--text-secondary)',
               fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 13,
               boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
               transition: 'all 0.15s'
             }}>
               {tab.icon} {tab.label}
             </button>
           ))}
         </div>

        {/* ── CHARACTER TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'character' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>

            {/* Clase RPG */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, border: '1px solid var(--border-color)', gridColumn: 'span 2' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>⚔️ Clase de Personaje</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {CLASSES.map(cls => {
                  const isSelected = selectedClass === cls.id || user.rpgClass === cls.id;
                  return (
                    <button key={cls.id} onClick={() => setSelectedClass(cls.id)} style={{
                      padding: '14px 12px', borderRadius: 12, border: `2px solid ${isSelected ? cls.color : 'var(--border-color)'}`,
                      background: isSelected ? `${cls.color}10` : 'var(--bg-secondary)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{cls.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? cls.color : 'var(--text-primary)' }}>{cls.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{cls.desc}</div>
                    </button>
                  );
                })}
              </div>
              {selectedClass !== user.rpgClass && (
                <button onClick={handleSaveClass} style={{
                  marginTop: 14, padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 700
                }}>
                  Confirmar Clase
                </button>
              )}
            </div>

            {/* Fortalezas */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 14px', fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>💪 Fortalezas</h3>
              {strengths.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: 13 }}>Completa más áreas de vida para descubrir tus fortalezas</p>
              ) : strengths.map(([areaId, val]) => {
                const info = AREA_STATS[areaId];
                const Icon = info?.icon || Star;
                return (
                  <div key={areaId} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    background: `${info?.color || '#6b7280'}10`, borderRadius: 10, marginBottom: 8,
                    border: `1px solid ${info?.color || '#6b7280'}22`
                  }}>
                    <Icon style={{ width: 18, height: 18, color: info?.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1f2937' }}>{info?.label}</div>
                      <div style={{ height: 4, background: '#e5e7eb', borderRadius: 999, marginTop: 4 }}>
                        <div style={{ height: '100%', width: `${val}%`, background: info?.color, borderRadius: 999 }} />
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: info?.color, fontSize: 14 }}>{val}%</span>
                  </div>
                );
              })}
            </div>

            {/* Debilidades */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 14px', fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>🩹 Debilidades</h3>
              {weaknesses.map(([areaId, val]) => {
                const info = AREA_STATS[areaId];
                const Icon = info?.icon || Target;
                return (
                  <div key={areaId} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    background: '#fef2f2', borderRadius: 10, marginBottom: 8, border: '1px solid #fee2e2'
                  }}>
                    <Icon style={{ width: 18, height: 18, color: '#ef4444', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1f2937' }}>{info?.label}</div>
                      <div style={{ height: 4, background: '#e5e7eb', borderRadius: 999, marginTop: 4 }}>
                        <div style={{ height: '100%', width: `${val}%`, background: '#ef4444', borderRadius: 999 }} />
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: '#ef4444', fontSize: 14 }}>{val}%</span>
                  </div>
                );
              })}
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic' }}>
                Trabaja estas áreas para mejorar tu poder total
              </p>
            </div>

            {/* Logros recientes */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, border: '1px solid var(--border-color)', gridColumn: 'span 2' }}>
              <h3 style={{ margin: '0 0 14px', fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>🏆 Logros Desbloqueados</h3>
              {achievements.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Aún no has desbloqueado logros. ¡Completa misiones!</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {achievements.slice(0, 12).map((id, i) => (
                    <div key={i} style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, boxShadow: '0 2px 8px rgba(251,191,36,0.3)'
                    }} title={`Logro #${id}`}>⭐</div>
                  ))}
                  {achievements.length > 12 && (
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)'
                    }}>+{achievements.length - 12}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STATS TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>

            {/* Radar Chart */}
            <div style={{
              background: 'var(--bg-card)', borderRadius: 16, padding: 24,
              border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text-primary)', alignSelf: 'flex-start' }}>📡 Mapa de Poder</h3>
              <RadarChart stats={rpgStats} />
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8, textAlign: 'center' }}>
                Basado en el progreso de tus áreas de vida
              </p>
            </div>

            {/* Stats bars */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text-primary)' }}>⚡ Atributos</h3>
              {Object.entries(AREA_STATS).map(([areaId, info]) => {
                const Icon = info.icon;
                const val = rpgStats[areaId] || 0;
                return (
                  <StatBar
                    key={areaId}
                    label={info.label}
                    stat={info.stat}
                    value={val}
                    max={100}
                    color={info.color}
                    icon={Icon}
                  />
                );
              })}
            </div>

            {/* Combat Stats */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text-primary)' }}>⚔️ Estadísticas de Batalla</h3>
              {[
                { label: 'Misiones completadas', val: user.totalTasksCompleted || 0, icon: '✅', color: '#10b981' },
                { label: 'Hábitos dominados', val: user.totalHabitsCompleted || 0, icon: '🔥', color: '#f59e0b' },
                { label: 'Racha actual', val: `${user.streak || 0} días`, icon: '⚡', color: '#8b5cf6' },
                { label: 'XP Total', val: user.xp || 0, icon: '🌟', color: '#3b82f6' },
                { label: 'Logros', val: achievements.length, icon: '🏆', color: '#ec4899' },
                { label: 'Malos hábitos vencidos', val: (gameData.badHabits || []).filter(bh => bh.daysClean >= 30).length, icon: '🏅', color: '#14b8a6' },
              ].map((stat, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--border-color)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{stat.icon}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{stat.label}</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 15, color: stat.color }}>{stat.val}</span>
                </div>
              ))}
            </div>

            {/* Rangos */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text-primary)' }}>👑 Camino al Poder</h3>
              {RANKS.map((rank, i) => {
                const isReached = user.xp >= rank.min;
                const isCurrent = user.xp >= rank.min && user.xp < rank.max;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 10, marginBottom: 6,
                    background: isCurrent ? `${rank.color}15` : 'transparent',
                    border: isCurrent ? `1px solid ${rank.color}44` : '1px solid transparent'
                  }}>
                    <span style={{ fontSize: 18, opacity: isReached ? 1 : 0.3 }}>{rank.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isReached ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {rank.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{rank.min}+ XP</div>
                    </div>
                    {isCurrent && <span style={{ fontSize: 10, color: rank.color, fontWeight: 700 }}>ACTUAL</span>}
                    {isReached && !isCurrent && <span style={{ fontSize: 16 }}>✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CUSTOMIZE TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'customize' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>

            {/* Avatar */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text-primary)' }}>🎭 Avatar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{ position: 'relative' }}>
                  <img src={getAvatarUrl(100)} alt="Avatar"
                    style={{ width: 100, height: 100, borderRadius: '50%', border: '3px solid var(--border-color)' }} />
                  <button onClick={randomizeAvatar} style={{
                    position: 'absolute', bottom: 0, right: 0, width: 28, height: 28,
                    borderRadius: '50%', background: 'var(--brand-primary)', border: '2px solid var(--bg-card)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <RefreshCw style={{ width: 12, height: 12, color: '#fff' }} />
                  </button>
                </div>
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 8 }}>Estilo</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {avatarStyles.map(s => {
                      const isSel = gameData.user?.avatar?.style === s.id;
                      return (
                        <button key={s.id} onClick={() => updateAvatar({ style: s.id })} style={{
                          padding: '8px 4px', borderRadius: 8, border: `2px solid ${isSel ? '#4f46e5' : '#e5e7eb'}`,
                          background: isSel ? '#eef2ff' : '#f9fafb', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#374151'
                        }}>
                          {s.icon} {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 8 }}>Fondo</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {avatarBgColors.map(c => (
                      <button key={c.id} onClick={() => updateAvatar({ backgroundColor: c.id })} style={{
                        width: 32, height: 32, borderRadius: '50%', border: gameData.user?.avatar?.backgroundColor === c.id ? `3px solid var(--text-primary)` : `2px solid transparent`,
                        background: c.hex, cursor: 'pointer', outline: 'none'
                      }} title={c.name} />
                    ))}
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 8 }}>Seed (código)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={avatarSeed} onChange={e => setAvatarSeed(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none' }}
                      placeholder="Tu nombre o código..." />
                    <button onClick={() => updateAvatar({ seed: avatarSeed })} style={{
                      padding: '8px 14px', borderRadius: 8, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13
                    }}>OK</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tema */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text-primary)' }}>🌙 Tema</h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { id: 'light', label: 'Claro', icon: '☀️', activeStyle: { border: '2px solid #f59e0b', background: '#fffbeb', color: '#b45309' } },
                  { id: 'dark', label: 'Oscuro', icon: '🌙', activeStyle: { border: '2px solid #8b5cf6', background: 'var(--bg-secondary)', color: 'var(--text-primary)' } }
                ].map(t => {
                  const isActive = currentTheme === t.id;
                  return (
                    <button key={t.id} onClick={() => setTheme(t.id)} style={{
                      flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
                      border: isActive ? t.activeStyle.border : '1px solid var(--border-color)',
                      background: isActive ? t.activeStyle.background : 'var(--bg-card)',
                      color: isActive ? t.activeStyle.color : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 500, fontSize: 14, transition: 'all 0.15s'
                    }}>
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>

              <h3 style={{ margin: '0 0 12px', fontWeight: 800, color: '#1f2937' }}>🎨 Color de Acento</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {accentColors.map(c => (
                  <button key={c.id} onClick={() => setAccentColor(c.id)} style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: c.hex, border: gameData.user?.accentColor === c.id ? `3px solid var(--text-primary)` : `2px solid transparent`,
                    cursor: 'pointer', outline: 'none', transform: gameData.user?.accentColor === c.id ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.15s'
                  }} />
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #fee2e2' }}>
              <h3 style={{ margin: '0 0 12px', fontWeight: 800, color: '#ef4444' }}>⚠️ Zona Peligrosa</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                Resetear tu cuenta borrará todo progreso, XP, hábitos y recompensas permanentemente.
              </p>
              <button onClick={() => {
                if (window.confirm('¿Estás absolutamente seguro? Se perderá TODO el progreso.')) {
                  localStorage.setItem('accountWasReset', 'true');
                  localStorage.clear();
                  window.location.reload();
                }
              }} style={{
                width: '100%', padding: '11px 0', borderRadius: 10, border: '1px solid #fca5a5',
                background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: 14
              }}>
                💀 Resetear Cuenta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Avatar Editor Modal (minimal) ──────────────────────────────────── */}
      {showAvatarEditor && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16
        }}>
          <div className={`${themeConfig.card} p-6 w-full max-w-md rounded-2xl border ${themeConfig.border} shadow-[0_20px_60px_rgba(0,0,0,0.2)]`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className={`m-0 font-extrabold text-xl ${themeConfig.text}`}>🎭 Editar Avatar</h2>
              <button onClick={() => setShowAvatarEditor(false)} className={`${themeConfig.bg} border-none rounded-lg p-2 cursor-pointer`}>
                <X style={{ width: 16, height: 16 }} className={themeConfig.textMuted} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative' }}>
                <img src={getAvatarUrl(100)} alt="Preview" className={`w-24 h-24 rounded-full border-4 ${themeConfig.border}`} />
                <button onClick={randomizeAvatar} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <RefreshCw style={{ width: 14, height: 14, color: '#fff' }} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <input value={avatarSeed} onChange={e => setAvatarSeed(e.target.value)}
                className={`flex-1 px-4 py-2.5 bg-transparent border ${themeConfig.border} rounded-xl text-sm outline-none`}
                placeholder="Escribe tu nombre para generar avatar..." />
              <button onClick={() => updateAvatar({ seed: avatarSeed })} className="px-6 py-2.5 rounded-xl border-none bg-brand-600 text-white font-extrabold cursor-pointer">OK</button>
            </div>
            <button onClick={() => setShowAvatarEditor(false)} className={`w-full mt-4 py-2.5 rounded-xl border ${themeConfig.border} ${themeConfig.bg} ${themeConfig.textMuted} font-bold cursor-pointer`}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
