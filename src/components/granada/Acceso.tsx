import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle, FlaskConical, GraduationCap, Layers, Atom } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recurso } from '../../services/rutas';

/**
 * Pantalla de acceso.
 *
 * Es lo primero que se ve, igual que en la plataforma del curso: el cuaderno
 * registra firmas de seguridad y entregas que van a nombre de alguien, así que
 * identificarse no es un extra que se pide al final, sino la puerta.
 *
 * Reutiliza las clases .login-* del sistema heredado; el color lo pone
 * granada.css, que las reescribe con el morado de la Facultad.
 */
export const Acceso: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const alEntrar = (respuesta: { credential?: string }) => {
    setCargando(true);
    setError(null);
    const resultado = loginWithGoogle(respuesta);
    if (!resultado.success) {
      setError(resultado.error || 'No se pudo iniciar sesión.');
    }
    setCargando(false);
  };

  return (
    <div className="login-root gr-sebka">
      <div className="login-bg-grid" aria-hidden="true" />

      <div className="login-deco" aria-hidden="true">
        <FlaskConical size={120} strokeWidth={0.5} color="rgba(228,188,107,0.10)" style={{ position: 'absolute', top: '8%', left: '6%' }} />
        <Atom size={90} strokeWidth={0.5} color="rgba(255,255,255,0.06)" style={{ position: 'absolute', bottom: '12%', right: '8%' }} />
        <Layers size={90} strokeWidth={0.5} color="rgba(228,188,107,0.07)" style={{ position: 'absolute', top: '55%', left: '3%' }} />
      </div>

      <div className="login-card">
        <div className="login-card-header">
          <div className="login-logo-ring">
            <img
              src={recurso('iconos/granada.svg')}
              alt=""
              aria-hidden="true"
              style={{ width: 52, height: 52, borderRadius: 12 }}
            />
          </div>

          <div className="login-badge-row">
            <span className="qfdos-badge badge-teal" style={{ fontSize: '0.68rem' }}>2627 QFDOS E</span>
            <span className="qfdos-badge badge-mint" style={{ fontSize: '0.68rem' }}>Curso 2026/2027</span>
          </div>

          <h1 className="login-title">Prácticas de Química Farmacéutica II</h1>
          <p className="login-subtitle">
            Cuaderno de laboratorio · Facultad de Farmacia, UGR
          </p>
        </div>

        <div className="login-divider">
          <span>Acceso con cuenta institucional</span>
        </div>

        <div className="login-google-wrap">
          {cargando ? (
            <div className="login-loading">
              <span className="login-spinner" />
              <span>Verificando credenciales UGR…</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={alEntrar}
              onError={() => setError('No se pudo completar el acceso con Google. Inténtalo de nuevo.')}
              theme="outline"
              shape="rectangular"
              size="large"
              text="signin_with"
              locale="es"
              useOneTap={false}
              width="320"
            />
          )}

          {error && (
            <div className="login-error">
              <AlertCircle size={16} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="login-info-grid">
          <div className="login-info-box">
            <GraduationCap size={18} color="var(--teal-ink)" />
            <div>
              <strong>Estudiantes</strong>
              <p>
                Entra con tu cuenta de la UGR (<code>@correo.ugr.es</code> o{' '}
                <code>@go.ugr.es</code>). Si todavía no la tienes activa, también
                sirve una cuenta de <code>Gmail</code>, aunque la entrega quedará
                marcada como externa.
              </p>
            </div>
          </div>
          <div className="login-info-box login-info-box--professor">
            <Layers size={18} color="var(--navy-ink)" />
            <div>
              <strong>Profesorado</strong>
              <p>La recepción de cuadernos requiere <code>juandiaz@ugr.es</code></p>
            </div>
          </div>
        </div>

        <p className="login-footer-note">
          Universidad de Granada · Departamento de Química Farmacéutica y Orgánica
        </p>
      </div>
    </div>
  );
};
