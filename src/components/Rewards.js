import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import {
  ShoppingBag, Package, Gift, Plus, Trash2, Edit2, CheckCircle,
  Sparkles, Zap, Shield, FlaskConical, Heart, Crown, Star,
  ChevronRight, AlertTriangle, X
} from 'lucide-react';

const iconOptions = [
  '🎁', '🎮', '🎬', '☕', '🍕', '🎵', '📚', '🏆', '🌟', '💎',
  '🚀', '🎯', '🎪', '🎨', '🎭', '🎸', '🏖️', '🛍️', '🍿', '🥳'
];

const exampleRewards = [
  { id: 1, name: 'Café gratuito', cost: 100, icon: '☕', claimed: false, color: 'from-amber-400 to-yellow-600' },
  { id: 2, name: 'Noche de películas', cost: 200, icon: '🎬', claimed: false, color: 'from-purple-400 to-pink-600' },
  { id: 3, name: 'Gaming time (2h)', cost: 300, icon: '🎮', claimed: false, color: 'from-blue-400 to-indigo-600' },
  { id: 4, name: 'Libro nuevo', cost: 250, icon: '📚', claimed: false, color: 'from-green-400 to-emerald-600' },
  { id: 5, name: 'Masaje relajante', cost: 500, icon: '💆', claimed: false, color: 'from-pink-400 to-rose-600' },
];

const colorOptions = [
  'from-pink-400 to-purple-600', 'from-blue-400 to-indigo-600',
  'from-green-400 to-emerald-600', 'from-yellow-400 to-amber-600',
  'from-orange-400 to-red-600', 'from-purple-400 to-pink-600',
  'from-teal-400 to-cyan-600', 'from-rose-400 to-pink-600'
];

const RARITY = {
  common: { label: 'Común', color: '#6b7280', bg: '#f3f4f6' },
  uncommon: { label: 'Inusual', color: '#16a34a', bg: '#f0fdf4' },
  rare: { label: 'Raro', color: '#2563eb', bg: '#eff6ff' },
  epic: { label: 'Épico', color: '#9333ea', bg: '#faf5ff' },
  legendary: { label: 'Legendario', color: '#d97706', bg: '#fffbeb' },
};

const shopData = [
  {
    shopId: 'potion_small',
    name: 'Poción de Vida',
    icon: '🧪',
    cost: 150,
    description: 'Restaura 25 HP instantáneamente. Ideal para recuperarse de días sin actividad.',
    effect: 'heal',
    hpRestore: 25,
    rarity: 'common',
    iconComponent: FlaskConical,
  },
  {
    shopId: 'shield',
    name: 'Escudo del Día',
    icon: '🛡️',
    cost: 200,
    description: 'Protege tu HP de la pérdida diaria por inactividad durante 24 horas.',
    effect: 'shield',
    rarity: 'uncommon',
    iconComponent: Shield,
  },
  {
    shopId: 'xp_boost',
    name: 'XP Booster',
    icon: '⚡',
    cost: 300,
    description: 'Duplica la XP ganada en tareas y hábitos durante las próximas 24 horas.',
    effect: 'xp_boost',
    rarity: 'rare',
    iconComponent: Zap,
  },
  {
    shopId: 'potion_revival',
    name: 'Elixir de Revival',
    icon: '💊',
    cost: 500,
    description: 'Revive a tu personaje desde la muerte, restaurando todo el HP. ¡Muy poderoso!',
    effect: 'revive',
    hpRestore: 100,
    rarity: 'legendary',
    iconComponent: Heart,
  },
];

function HPBar({ hp, maxHp }) {
  const pct = Math.max(0, Math.min(100, ((hp ?? 100) / (maxHp ?? 100)) * 100));
  const color = pct < 30 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#22c55e';
  const isDanger = pct < 30;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Heart style={{ width: 16, height: 16, color, flexShrink: 0, animation: isDanger ? 'pulse 1s infinite' : 'none' }} />
      <div style={{ flex: 1, height: 10, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: 999, transition: 'width 0.5s ease, background 0.5s'
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 50, textAlign: 'right' }}>
        {hp ?? 100}/{maxHp ?? 100} HP
      </span>
    </div>
  );
}

function ShopItem({ item, canAfford, onBuy }) {
  const rarity = RARITY[item.rarity] || RARITY.common;
  const Icon = item.iconComponent;
  return (
    <div style={{
      background: 'var(--bg-card)', border: `2px solid ${rarity.color}33`,
      borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', overflow: 'hidden',
      boxShadow: `0 2px 12px ${rarity.color}18`,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${rarity.color}28`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 12px ${rarity.color}18`; }}
    >
      {/* Rarity badge */}
      <span style={{
        position: 'absolute', top: 12, right: 12,
        background: 'var(--bg-secondary)', color: rarity.color,
        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
        border: `1px solid ${rarity.color}44`, textTransform: 'uppercase', letterSpacing: 1
      }}>{rarity.label}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${rarity.color}22, ${rarity.color}44)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
        }}>
          {item.icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{item.name}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.description}</p>
        </div>
      </div>

      <button
        onClick={() => onBuy(item.shopId)}
        disabled={!canAfford}
        style={{
          padding: '10px 0', borderRadius: 10, border: 'none', cursor: canAfford ? 'pointer' : 'not-allowed',
          background: canAfford
            ? `linear-gradient(135deg, ${rarity.color}, ${rarity.color}cc)`
            : 'var(--bg-secondary)',
          color: canAfford ? '#fff' : 'var(--text-secondary)',
          fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'opacity 0.15s'
        }}
      >
        🪙 {item.cost} coins {canAfford ? '— Comprar' : '— Insuficientes'}
      </button>
    </div>
  );
}

function InventoryItem({ item, onUse }) {
  const canUse = item.effect === 'heal' || item.effect === 'revive' || item.effect === 'shield';
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14,
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: 'var(--bg-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
      }}>
        {item.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{item.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.description}</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
          Comprado {new Date(item.purchasedAt).toLocaleDateString('es-ES')}
        </div>
      </div>
      {canUse && (
        <button
          onClick={() => onUse(item.id)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0
          }}
        >
          ✨ Usar
        </button>
      )}
    </div>
  );
}

function MyRewardCard({ reward, coins, onClaim, onEdit, onDelete }) {
  const canAfford = coins >= reward.cost;
  const isAvailable = !reward.claimed;
  const progress = Math.min(100, (coins / reward.cost) * 100);

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
      padding: 20, display: 'flex', alignItems: 'center', gap: 16,
      opacity: reward.claimed ? 0.65 : 1,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
      position: 'relative'
    }}
      onMouseEnter={e => { if (!reward.claimed) e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
    >
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg, var(--tw-gradient-from, #6366f1), var(--tw-gradient-to, #8b5cf6))`,
        backgroundImage: `linear-gradient(135deg, #6366f1, #8b5cf6)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
      }}
        className={`bg-gradient-to-br ${reward.color}`}
      >
        {reward.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15, marginBottom: 4 }}>{reward.name}</div>
        {isAvailable && (
          <>
            <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 999, margin: '6px 0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: canAfford ? 'linear-gradient(90deg, #f59e0b, #f97316)' : 'var(--border-color)',
                borderRadius: 999, transition: 'width 0.5s'
              }} />
            </div>
            <div style={{ fontSize: 12, color: canAfford ? '#16a34a' : 'var(--text-secondary)' }}>
              {canAfford ? '✅ ¡Puedes canjearlo!' : `Faltan ${reward.cost - coins} coins`}
            </div>
          </>
        )}
        {reward.claimed && (
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
            ✅ Canjeado {reward.claimedAt ? new Date(reward.claimedAt).toLocaleDateString('es-ES') : ''}
          </div>
        )}
      </div>

      {/* Cost & actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
          🪙 {reward.cost}
        </div>
        {isAvailable && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onEdit(reward)}
              style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer', color: '#3b82f6' }}>
              <Edit2 style={{ width: 14, height: 14 }} />
            </button>
            <button onClick={() => onDelete(reward.id)}
              style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fef2f2', cursor: 'pointer', color: '#ef4444' }}>
              <Trash2 style={{ width: 14, height: 14 }} />
            </button>
            <button
              onClick={() => onClaim(reward.id)}
              disabled={!canAfford}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: canAfford ? 'pointer' : 'not-allowed',
                background: canAfford ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'var(--bg-secondary)',
                color: canAfford ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: 13
              }}
            >
              Canjear
            </button>
          </div>
        )}
      </div>

      {/* Sparkle when affordable */}
      {isAvailable && canAfford && (
        <Sparkles style={{ position: 'absolute', top: 10, right: 10, width: 16, height: 16, color: '#f59e0b' }} />
      )}
    </div>
  );
}

function Rewards({ addNotification }) {
  const { gameData, updateGameData, buyItem, usePotion: activatePotion, SHOP_ITEMS, themes } = useData();
  const [activeTab, setActiveTab] = useState('shop');
  const [rewards, setRewards] = useState(
    gameData.rewards.length > 0 ? gameData.rewards : exampleRewards
  );
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({ name: '', cost: 100, icon: '🎁', color: colorOptions[0] });
  const [rewardFilter, setRewardFilter] = useState('available');

  const currentTheme = gameData.user?.theme || 'light';
  const themeConfig = themes[currentTheme] || themes.light;
  const coins = gameData.user?.coins || 0;
  const hp = gameData.user?.hp ?? 100;
  const maxHp = gameData.user?.maxHp ?? 100;
  const isDead = gameData.user?.isDead || false;

  useEffect(() => {
    if (gameData.rewards.length === 0) {
      updateGameData({ rewards: exampleRewards });
    }
  }, [gameData.rewards.length, updateGameData]);

  // ── Shop ──────────────────────────────────────────────────────────────────
  const handleBuyItem = (shopId) => {
    const item = SHOP_ITEMS.find(i => i.shopId === shopId);
    if (!item) return;
    if (coins < item.cost) {
      addNotification(`Necesitas ${item.cost - coins} coins más para comprar "${item.name}"`, 'error');
      return;
    }
    buyItem(shopId);
  };


  // ── My Rewards ────────────────────────────────────────────────────────────
  const handleClaimReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.claimed) return;
    if (coins < reward.cost) {
      addNotification(`No tienes suficientes coins. Necesitas ${reward.cost - coins} más`, 'error');
      return;
    }
    const updatedRewards = rewards.map(r =>
      r.id === rewardId ? { ...r, claimed: true, claimedAt: new Date().toISOString() } : r
    );
    setRewards(updatedRewards);
    updateGameData({
      rewards: updatedRewards,
      user: { ...gameData.user, coins: coins - reward.cost }
    });
    addNotification(`🎉 ¡"${reward.name}" canjeada exitosamente!`, 'success');
  };

  const handleAddReward = () => {
    if (!newReward.name.trim()) { addNotification('El nombre es requerido', 'error'); return; }
    const reward = { id: Date.now(), ...newReward, claimed: false, createdAt: new Date().toISOString() };
    const updated = [...rewards, reward];
    setRewards(updated);
    updateGameData({ rewards: updated });
    setNewReward({ name: '', cost: 100, icon: '🎁', color: colorOptions[0] });
    setShowModal(false);
    addNotification('Recompensa creada', 'success');
  };

  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setNewReward({ name: reward.name, cost: reward.cost, icon: reward.icon, color: reward.color });
    setShowEditModal(true);
  };

  const handleUpdateReward = () => {
    if (!newReward.name.trim()) { addNotification('El nombre es requerido', 'error'); return; }
    const updatedReward = { ...editingReward, ...newReward };
    const updated = rewards.map(r => r.id === editingReward.id ? updatedReward : r);
    setRewards(updated);
    updateGameData({ rewards: updated });
    setShowEditModal(false);
    setEditingReward(null);
    setNewReward({ name: '', cost: 100, icon: '🎁', color: colorOptions[0] });
  };

  const handleDeleteReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;
    if (window.confirm(`¿Eliminar "${reward.name}"?`)) {
      const updated = rewards.filter(r => r.id !== rewardId);
      setRewards(updated);
      updateGameData({ rewards: updated });
    }
  };

  const filteredRewards = rewardFilter === 'available'
    ? rewards.filter(r => !r.claimed)
    : rewards.filter(r => r.claimed);

  const inventory = gameData.inventory || [];
  const tabs = [
    { id: 'shop', label: 'Tienda RPG', icon: ShoppingBag },
    { id: 'rewards', label: 'Mis Recompensas', icon: Gift },
    { id: 'inventory', label: `Inventario ${inventory.length > 0 ? `(${inventory.length})` : ''}`, icon: Package },
  ];

  return (
    <div className={`space-y-6 ${themeConfig.text}`}>

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)',
        borderRadius: 20, padding: '24px 28px', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>⚔️ Tienda del Aventurero</h1>
          <p style={{ margin: '6px 0 0', color: '#c4b5fd', fontSize: 14 }}>
            Gana coins completando tareas y hábitos. Úsalos para sobrevivir y recompensarte.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fcd34d' }}>🪙 {coins}</div>
            <div style={{ fontSize: 11, color: '#a78bfa' }}>Coins</div>
          </div>
          <div style={{ minWidth: 160 }}>
            <div style={{ fontSize: 11, color: '#a78bfa', marginBottom: 6 }}>❤️ Vida del personaje</div>
            <HPBar hp={hp} maxHp={maxHp} />
          </div>
        </div>
      </div>

      {/* ── Advertencia HP bajo / Muerto ───────────────────────────────────── */}
      {isDead && (
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
          borderRadius: 16, padding: '18px 24px', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>💀</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>¡Tu personaje ha muerto!</div>
              <div style={{ fontSize: 13, color: '#fca5a5', marginTop: 4 }}>
                Usa una Poción de Revival desde tu inventario para revivir. Sin ella, perderás recompensas acumuladas.
              </div>
            </div>
          </div>
          {inventory.some(i => i.effect === 'revive') && (
            <button
              onClick={() => activatePotion(inventory.find(i => i.effect === 'revive').id)}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0
              }}
            >
              💊 Revivir
            </button>
          )}
        </div>
      )}

      {!isDead && hp < (maxHp * 0.3) && (
        <div style={{
          background: 'linear-gradient(135deg, #7c2d12, #9a3412)',
          borderRadius: 16, padding: '14px 20px', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <AlertTriangle style={{ width: 20, height: 20, color: '#fb923c', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 700 }}>⚠️ HP crítico — </span>
            <span style={{ fontSize: 13, color: '#fed7aa' }}>
              Tu personaje está muy débil. Completa tareas o usa una poción de vida antes de que sea tarde.
            </span>
          </div>
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', borderRadius: 14, padding: 4 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: isActive ? 'var(--bg-card)' : 'transparent',
              color: isActive ? '#4f46e5' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500, fontSize: 13,
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.15s'
            }}>
              <Icon style={{ width: 15, height: 15 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── SHOP TAB ────────────────────────────────────────────────────────── */}
      {activeTab === 'shop' && (
        <div className="animate-fadeIn">
          <p className={themeConfig.textMuted} style={{ fontSize: 13, marginBottom: 16 }}>
            Items del sistema para mantener a tu personaje con vida y potenciar tu progreso.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {shopData.map(item => (
              <ShopItem
                key={item.shopId}
                item={item}
                canAfford={coins >= item.cost}
                onBuy={handleBuyItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── REWARDS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'rewards' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['available', 'claimed'].map(f => (
                <button key={f} onClick={() => setRewardFilter(f)} style={{
                  padding: '7px 16px', borderRadius: 24, border: 'none', cursor: 'pointer',
                  background: rewardFilter === f ? '#4f46e5' : 'var(--bg-secondary)',
                  color: rewardFilter === f ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: 13
                }}>
                  {f === 'available' ? `📦 Disponibles (${rewards.filter(r => !r.claimed).length})` : `✅ Canjeadas (${rewards.filter(r => r.claimed).length})`}
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(true)} style={{
              padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Plus style={{ width: 15, height: 15 }} /> Nueva Recompensa
            </button>
          </div>

          {filteredRewards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
              <Gift style={{ width: 40, height: 40, margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>
                {rewardFilter === 'available' ? 'No hay recompensas disponibles' : 'Aún no has canjeado nada'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredRewards.map(reward => (
                <MyRewardCard
                  key={reward.id}
                  reward={reward}
                  coins={coins}
                  onClaim={handleClaimReward}
                  onEdit={handleEditReward}
                  onDelete={handleDeleteReward}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── INVENTORY TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div>
          {inventory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
              <Package style={{ width: 40, height: 40, margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Tu inventario está vacío</p>
              <p style={{ margin: '6px 0 0', fontSize: 13 }}>Compra items en la Tienda RPG para verlos aquí</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {inventory.map(item => (
                <InventoryItem key={item.id} item={item} onUse={activatePotion} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Modal Nueva Recompensa ───────────────────────────────────────────── */}
      {(showModal || showEditModal) && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16
        }}>
          <div className={`${themeConfig.card} p-6 w-full max-w-md rounded-2xl border ${themeConfig.border} max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className={`m-0 font-extrabold text-xl ${themeConfig.text}`}>
                {showEditModal ? 'Editar Recompensa' : 'Nueva Recompensa'}
              </h2>
              <button onClick={() => { setShowModal(false); setShowEditModal(false); setEditingReward(null); }}
                className={`${themeConfig.bg} border-none rounded-lg p-2 cursor-pointer`}>
                <X style={{ width: 16, height: 16 }} className={themeConfig.textMuted} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className={`block font-semibold text-[13px] ${themeConfig.text} mb-1.5`}>Nombre *</label>
                <input type="text" value={newReward.name}
                  onChange={e => setNewReward({ ...newReward, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-transparent border ${themeConfig.border} rounded-xl text-sm outline-none`}
                  placeholder="Ej: Noche de películas" />
              </div>
              <div>
                <label className={`block font-semibold text-[13px] ${themeConfig.text} mb-1.5`}>Costo (coins) *</label>
                <input type="number" value={newReward.cost}
                  onChange={e => setNewReward({ ...newReward, cost: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3.5 py-2.5 bg-transparent border ${themeConfig.border} rounded-xl text-sm outline-none`}
                  min="1" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8 }}>Icono</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
                  {iconOptions.map(icon => (
                    <button key={icon} onClick={() => setNewReward({ ...newReward, icon })}
                      className={`w-9 h-9 rounded-lg border ${newReward.icon === icon ? 'border-brand-500 bg-brand-50' : themeConfig.border + ' ' + themeConfig.bg} cursor-pointer text-base flex items-center justify-center transition-all`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8 }}>Color</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {colorOptions.map(color => (
                    <button key={color} onClick={() => setNewReward({ ...newReward, color })}
                      className={`h-10 rounded-lg bg-gradient-to-r ${color} transition-all ${newReward.color === color ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => { setShowModal(false); setShowEditModal(false); setEditingReward(null); }}
                className={`flex-1 py-2.5 rounded-xl border ${themeConfig.border} ${themeConfig.bg} cursor-pointer font-bold ${themeConfig.textMuted}`}>
                Cancelar
              </button>
              <button onClick={showEditModal ? handleUpdateReward : handleAddReward}
                className="flex-1 py-2.5 rounded-xl border-none bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold cursor-pointer">
                {showEditModal ? 'Guardar Cambios' : 'Crear Recompensa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rewards;
