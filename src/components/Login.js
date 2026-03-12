import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sword, Shield, Star, Flame, Trophy, Zap } from 'lucide-react';

function Login() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('No se pudo iniciar sesión. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>

      {/* Decorative background orbs */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        top: -100, left: -100, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
        bottom: -80, right: -80, pointerEvents: 'none'
      }} />

      {/* Floating icons */}
      {[
        { icon: '⚔️', top: '15%', left: '8%', delay: '0s' },
        { icon: '🏆', top: '20%', right: '10%', delay: '0.5s' },
        { icon: '🔥', bottom: '25%', left: '6%', delay: '1s' },
        { icon: '⭐', bottom: '15%', right: '8%', delay: '1.5s' },
        { icon: '🛡️', top: '60%', left: '12%', delay: '0.8s' },
        { icon: '✨', top: '40%', right: '6%', delay: '0.3s' },
      ].map((item, i) => (
        <div key={i} style={{
          position: 'absolute', fontSize: 24, opacity: 0.3,
          top: item.top, left: item.left, right: item.right, bottom: item.bottom,
          animation: `float 6s ease-in-out infinite`,
          animationDelay: item.delay
        }}>{item.icon}</div>
      ))}

      {/* Main card */}
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 24, padding: '48px 40px',
        maxWidth: 420, width: '90%',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        textAlign: 'center', position: 'relative', zIndex: 10
      }}>

        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 38,
          boxShadow: '0 8px 32px rgba(139,92,246,0.5)'
        }}>
          ⚔️
        </div>

        <h1 style={{ margin: '0 0 8px', color: '#fff', fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>
          Gamify Life
        </h1>
        <p style={{ margin: '0 0 8px', color: '#a78bfa', fontSize: 14, fontWeight: 500 }}>
          Tu épico viaje comienza aquí
        </p>
        <p style={{ margin: '0 0 40px', color: '#6b7280', fontSize: 13 }}>
          Convierte tus hábitos y tareas en aventuras RPG
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {['🏆 Logros', '⚔️ Malos Hábitos', '🛡️ Sistema HP', '🪙 Recompensas'].map((pill, i) => (
            <span key={i} style={{
              padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: 'rgba(255,255,255,0.08)', color: '#c4b5fd',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>{pill}</span>
          ))}
        </div>

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: '100%', padding: '16px 24px', borderRadius: 14,
            border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
            background: isLoading
              ? 'rgba(255,255,255,0.08)'
              : 'linear-gradient(135deg, #fff, #f0f0f0)',
            color: '#1f2937',
            fontWeight: 700, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            boxShadow: isLoading ? 'none' : '0 8px 24px rgba(255,255,255,0.15)',
            transition: 'all 0.2s',
            transform: 'translateY(0)'
          }}
          onMouseEnter={e => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,255,255,0.2)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.15)';
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: '2px solid #9ca3af', borderTopColor: '#4f46e5',
                animation: 'spin 0.8s linear infinite'
              }} />
              Conectando...
            </>
          ) : (
            <>
              {/* Google logo */}
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Iniciar sesión con Google
            </>
          )}
        </button>

        {error && (
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 10,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', fontSize: 13
          }}>
            ⚠️ {error}
          </div>
        )}

        <p style={{ margin: '24px 0 0', color: '#4b5563', fontSize: 12 }}>
          Al iniciar sesión, tus datos se guardan de forma segura en la nube ☁️
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(-5deg); }
          66% { transform: translateY(-6px) rotate(5deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;
