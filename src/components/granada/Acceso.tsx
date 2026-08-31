import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Hoja de acceso.
 *
 * El cuaderno se puede consultar y calcular sin identificarse: la cuenta solo
 * hace falta para entregar al profesor y para que «Mi progreso» sepa de quién
 * son las entregas. Por eso es una hoja que se abre a demanda y no un muro
 * delante de la aplicación.
 */
export const Acceso: React.FC<{ onCerrar: () => void }> = ({ onCerrar }) => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const alEntrar = (respuesta: { credential?: string }) => {
    const resultado = loginWithGoogle(respuesta);
    if (!resultado.success) {
      setError(resultado.error || 'No se pudo iniciar sesión.');
      return;
    }
    onCerrar();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Acceso con cuenta de la UGR"
      onClick={onCerrar}
      style={{
        position: 'fixed', inset: 0, zIndex: 70,
        background: 'rgba(21, 12, 16, 0.62)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="gr-sebka"
        style={{
          position: 'relative', overflow: 'hidden',
          width: '100%', maxWidth: 420,
          background: 'var(--surface)', color: 'var(--text-main)',
          border: '1px solid var(--border-strong)', borderTop: '4px solid var(--oro)',
          borderRadius: 'var(--radius-xl)', padding: '1.4rem', boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="btn btn-sm btn-ghost"
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}
        >
          <X size={16} />
        </button>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-title)', margin: '0 0 0.35rem' }}>
            Entrar con tu cuenta
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 1rem', lineHeight: 1.55 }}>
            Usa tu correo de la Universidad de Granada (@correo.ugr.es, @go.ugr.es o
            @ugr.es). Se admite Gmail para quien aún no tenga la cuenta institucional
            operativa, pero la entrega quedará marcada como externa.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={alEntrar}
              onError={() => setError('No se pudo completar el acceso con Google. Inténtalo de nuevo.')}
              theme="outline"
              shape="pill"
              size="large"
              text="signin_with"
              locale="es"
              width="300"
            />
          </div>

          {error && (
            <p style={{
              display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: '0.9rem',
              padding: '0.7rem 0.85rem', borderRadius: 10, fontSize: '0.8rem',
              background: 'var(--semantic-bad-bg)', color: 'var(--accent-red)'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </p>
          )}

          <p style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
            Sin identificarte puedes leer los protocolos y usar todas las calculadoras;
            la cuenta solo se necesita para entregar y para seguir tu progreso.
          </p>
        </div>
      </div>
    </div>
  );
};
