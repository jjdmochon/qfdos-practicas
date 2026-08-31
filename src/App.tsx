import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity, Calculator, CheckCircle2, ClipboardCheck, Droplets,
  GraduationCap, Grid3x3, Layers, Lock, LogOut, Moon, Settings, ShieldAlert,
  Sun, Users, X
} from 'lucide-react';

import { PracticasProtocols } from './components/practicas/PracticasProtocols';
import { PracticasYieldCalculator } from './components/practicas/PracticasYieldCalculator';
import { PracticasSolutionsCalculator } from './components/practicas/PracticasSolutionsCalculator';
import { PracticasSpectroscopyWorkshop } from './components/practicas/PracticasSpectroscopyWorkshop';
import { PracticasLabEquipment } from './components/practicas/PracticasLabEquipment';
import { PracticasExamSimulator } from './components/practicas/PracticasExamSimulator';
import { PracticasPairReport } from './components/practicas/PracticasPairReport';
import { PracticasSafetyRules } from './components/practicas/PracticasSafetyRules';
import { PracticasProgreso } from './components/practicas/PracticasProgreso';
import { LimiteDeError } from './components/LimiteDeError';
import { Portada } from './components/granada/Portada';
import { Acceso } from './components/granada/Acceso';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { recurso } from './services/rutas';

export type Seccion =
  | 'progreso' | 'safety' | 'protocols' | 'yields' | 'solutions'
  | 'spectroscopy' | 'equipment' | 'exam' | 'pair_report';

interface Apartado {
  id: Seccion;
  /** Rótulo largo, para las pestañas y el menú completo */
  titulo: string;
  /** Rótulo corto, para la barra inferior del móvil */
  corto: string;
  icono: React.ReactNode;
  descripcion: string;
  /** Alias admitido en ?seccion=… (accesos directos del manifiesto) */
  alias: string;
}

const APARTADOS: Apartado[] = [
  { id: 'progreso',     titulo: 'Mi progreso',           corto: 'Progreso',  alias: 'progreso',    icono: <ClipboardCheck size={16} />, descripcion: 'Qué has entregado y qué te falta' },
  { id: 'safety',       titulo: '0 · Seguridad',          corto: 'Seguridad', alias: 'seguridad',   icono: <ShieldAlert size={16} />,    descripcion: 'Checklist obligatorio y firma' },
  { id: 'protocols',    titulo: '1 · Protocolos',         corto: 'Síntesis',  alias: 'protocolos',  icono: <Layers size={16} />,         descripcion: 'Guía paso a paso y esquemas' },
  { id: 'yields',       titulo: '2 · Rendimientos',       corto: 'Cálculo',   alias: 'rendimientos',icono: <Calculator size={16} />,     descripcion: 'Estequiometría y cuaderno' },
  { id: 'solutions',    titulo: '3 · Disoluciones',       corto: 'Disol.',    alias: 'disoluciones',icono: <Droplets size={16} />,       descripcion: 'Sólidos, ácidos y diluciones' },
  { id: 'spectroscopy', titulo: '4 · Espectroscopia',     corto: 'Espectros', alias: 'espectros',   icono: <Activity size={16} />,       descripcion: '¹H, ¹³C, DEPT y HR-MS' },
  { id: 'equipment',    titulo: '5 · Material',           corto: 'Material',  alias: 'material',    icono: <Settings size={16} />,       descripcion: 'Puesto de trabajo y montajes' },
  { id: 'exam',         titulo: '6 · Examen',             corto: 'Examen',    alias: 'examen',      icono: <GraduationCap size={16} />,  descripcion: 'Simulacro con estructuras y PM' },
  { id: 'pair_report',  titulo: '7 · Cuaderno parejas',   corto: 'Cuaderno',  alias: 'cuaderno',    icono: <Users size={16} />,          descripcion: 'Informe conjunto y recepción' }
];

/** Las cuatro que se alcanzan de un pulgar; la quinta abre el resto. */
const EN_BARRA: Seccion[] = ['progreso', 'safety', 'protocols', 'yields'];

const CLAVE_SEGURIDAD = 'qfdos_practicas_safety_accepted';

function seccionInicial(firmado: boolean): Seccion {
  const pedida = new URLSearchParams(window.location.search).get('seccion');
  const apartado = APARTADOS.find(a => a.alias === pedida || a.id === pedida);
  if (apartado && (firmado || apartado.id === 'safety')) return apartado.id;
  return firmado ? 'progreso' : 'safety';
}

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const [firmado, setFirmado] = useState<boolean>(() => !!localStorage.getItem(CLAVE_SEGURIDAD));
  const [seccion, setSeccion] = useState<Seccion>(() => seccionInicial(!!localStorage.getItem(CLAVE_SEGURIDAD)));
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [accesoAbierto, setAccesoAbierto] = useState(false);
  const [avisoBloqueo, setAvisoBloqueo] = useState(false);

  // Al cambiar de apartado se vuelve arriba: en el móvil, si no, se aterriza a
  // media página y parece que no ha pasado nada.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [seccion]);

  const ir = useCallback((destino: Seccion) => {
    setMenuAbierto(false);
    if (destino !== 'safety' && !firmado) {
      setAvisoBloqueo(true);
      setSeccion('safety');
      return;
    }
    setAvisoBloqueo(false);
    setSeccion(destino);
  }, [firmado]);

  const alFirmar = () => {
    setFirmado(true);
    setAvisoBloqueo(false);
    setSeccion('protocols');
  };

  const bloqueada = (id: Seccion) => id !== 'safety' && !firmado;

  return (
    <div className="gr-app">
      <header className="gr-cabecera gr-sebka">
        <div className="gr-cabecera-fila">
          <div className="gr-marca">
            <img src={recurso('iconos/granada.svg')} alt="" aria-hidden="true" />
            <div style={{ minWidth: 0 }}>
              <p className="gr-titulo">Prácticas de Química Farmacéutica II</p>
              <p className="gr-subtitulo">Facultad de Farmacia · UGR</p>
            </div>
          </div>

          <div className="gr-acciones">
            <button
              className="gr-boton-icono"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <button
                className="gr-boton-icono"
                onClick={logout}
                aria-label={`Salir de la cuenta de ${user?.name ?? ''}`}
                title={`${user?.name ?? ''} · Salir`}
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button
                className="gr-boton-icono"
                onClick={() => setAccesoAbierto(true)}
                style={{ width: 'auto', padding: '0 0.8rem', fontWeight: 700, fontSize: '0.8rem', gap: 6 }}
              >
                Entrar
              </button>
            )}
          </div>
        </div>

        <p className="gr-lema">Prácticas de laboratorio · Campus de Cartuja</p>
      </header>

      {/* Pestañas: en el móvil se deslizan; en escritorio caben casi todas */}
      <nav className="gr-tira no-print" aria-label="Apartados del cuaderno">
        <div className="gr-pestanas" role="tablist">
          {APARTADOS.map(a => (
            <button
              key={a.id}
              role="tab"
              aria-selected={seccion === a.id}
              data-bloqueada={bloqueada(a.id)}
              className="gr-pestana"
              onClick={() => ir(a.id)}
              title={a.descripcion}
            >
              {bloqueada(a.id) ? <Lock size={14} /> : a.icono}
              {a.titulo}
              {a.id === 'safety' && (
                <span
                  className={`qfdos-badge ${firmado ? 'badge-mint' : 'badge-red'}`}
                  style={{ fontSize: '0.6rem', padding: '1px 6px' }}
                >
                  {firmado ? 'FIRMADO' : 'OBLIGATORIO'}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="gr-contenido">
        {seccion === 'progreso' && <Portada firmado={firmado} onIr={ir} />}

        {avisoBloqueo && !firmado && (
          <div className="gr-aviso no-print" role="status">
            <ShieldAlert size={18} style={{ flexShrink: 0, color: 'var(--granate)' }} />
            <div style={{ flex: 1 }}>
              <strong>Antes de entrar al laboratorio hay que firmar las normas.</strong>{' '}
              Marca las 16 normas de seguridad y firma abajo: el resto del cuaderno se
              desbloquea al instante.
            </div>
            <button
              onClick={() => setAvisoBloqueo(false)}
              className="btn btn-sm btn-ghost"
              aria-label="Cerrar aviso"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {seccion === 'progreso' && (
          <LimiteDeError zona="Mi progreso">
            <PracticasProgreso onIr={(d) => ir(d as Seccion)} />
          </LimiteDeError>
        )}
        {seccion === 'safety' && (
          <PracticasSafetyRules onAcceptAndProceed={alFirmar} isUnlocked={firmado} />
        )}
        {seccion === 'protocols' && (
          <LimiteDeError zona="Protocolos de sintesis"><PracticasProtocols /></LimiteDeError>
        )}
        {seccion === 'yields' && (
          <LimiteDeError zona="Calculadora de rendimientos"><PracticasYieldCalculator /></LimiteDeError>
        )}
        {seccion === 'solutions' && (
          <LimiteDeError zona="Preparacion de disoluciones"><PracticasSolutionsCalculator /></LimiteDeError>
        )}
        {seccion === 'spectroscopy' && (
          <LimiteDeError zona="Taller de espectroscopia"><PracticasSpectroscopyWorkshop /></LimiteDeError>
        )}
        {seccion === 'equipment' && (
          <LimiteDeError zona="Material y montajes"><PracticasLabEquipment /></LimiteDeError>
        )}
        {seccion === 'exam' && (
          <LimiteDeError zona="Simulador de examen"><PracticasExamSimulator /></LimiteDeError>
        )}
        {seccion === 'pair_report' && (
          <LimiteDeError zona="Cuaderno de parejas"><PracticasPairReport /></LimiteDeError>
        )}
      </main>

      <footer className="gr-pie">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-title)' }}>
          Universidad de Granada · Facultad de Farmacia
        </p>
        <p>
          Química Farmacéutica II · Grupo E · Prácticas de laboratorio.
          Los datos que introduces se guardan en tu propio dispositivo; solo se envían
          al profesor cuando pulsas «entregar».
        </p>
      </footer>

      {/* Barra inferior: solo móvil */}
      <nav className="gr-barra no-print" aria-label="Navegación principal">
        <div className="gr-barra-fila">
          {EN_BARRA.map(id => {
            const a = APARTADOS.find(x => x.id === id)!;
            return (
              <button
                key={id}
                aria-selected={seccion === id}
                onClick={() => ir(id)}
              >
                {bloqueada(id) ? <Lock size={19} /> : a.icono}
                {a.corto}
              </button>
            );
          })}
          <button aria-selected={menuAbierto} onClick={() => setMenuAbierto(v => !v)}>
            <Grid3x3 size={19} />
            Más
          </button>
        </div>
      </nav>

      {menuAbierto && (
        <div
          className="no-print"
          role="dialog"
          aria-label="Todos los apartados"
          onClick={() => setMenuAbierto(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(18, 12, 24, 0.6)', backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'flex-end'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', background: 'var(--surface)',
              borderRadius: '18px 18px 0 0', border: '1px solid var(--border-color)',
              borderBottom: 'none', padding: '1rem 1rem calc(1rem + env(safe-area-inset-bottom))',
              maxHeight: '80vh', overflowY: 'auto'
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border-strong)', margin: '0 auto 0.9rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {APARTADOS.map(a => (
                <button
                  key={a.id}
                  onClick={() => ir(a.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                    padding: '0.75rem', borderRadius: 12, cursor: 'pointer',
                    border: '1px solid var(--border-color)',
                    background: seccion === a.id ? 'var(--primary-bg)' : 'var(--surface-raised)',
                    color: 'var(--text-main)', fontWeight: 600, fontSize: '0.8rem'
                  }}
                >
                  <span style={{ color: 'var(--granate)', display: 'flex' }}>
                    {bloqueada(a.id) ? <Lock size={16} /> : a.icono}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block' }}>{a.titulo}</span>
                    <span style={{ display: 'block', fontWeight: 500, fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {a.descripcion}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {firmado && (
              <p style={{ marginTop: '0.9rem', fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={14} style={{ color: 'var(--vega)' }} /> Normas de seguridad firmadas
              </p>
            )}
          </div>
        </div>
      )}

      {accesoAbierto && <Acceso onCerrar={() => setAccesoAbierto(false)} />}
    </div>
  );
};

export default App;
