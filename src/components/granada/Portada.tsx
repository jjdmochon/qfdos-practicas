import React from 'react';
import { CheckCircle2, FlaskConical, Lock, Download } from 'lucide-react';
import type { Seccion } from '../../App';
import { MiSemanaPracticas } from '../MiSemanaPracticas';

/**
 * Portada del cuaderno.
 *
 * Los elementos de Granada no son adorno suelto: la celosía sebka de la
 * Alhambra teje el fondo, el perfil nevado de Sierra Nevada cierra la caja y
 * la paleta granate-oro viene de la granada del escudo de la ciudad y de la
 * Universidad. Debajo, lo primero que necesita quien va a entrar al
 * laboratorio: si ha firmado las normas y qué semana le toca.
 */
export const Portada: React.FC<{ firmado: boolean; onIr: (s: Seccion) => void }> = ({ firmado, onIr }) => (
  <>
    <section className="gr-portada gr-sebka">
      <div className="gr-portada-cuerpo">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span className="gr-etiqueta">
            <FlaskConical size={13} /> Cuaderno de laboratorio
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,247,242,0.85)', fontWeight: 600 }}>
            Química Farmacéutica II · Grupo E · Curso 2026/2027
          </span>
        </div>

        <h1>Último curso, última síntesis</h1>

        <p>
          Todo lo que necesitas para las prácticas, en el bolsillo y también sin cobertura:
          normas de seguridad firmadas, protocolos de Propranolol y DHPP paso a paso,
          reactivo limitante y rendimiento calculados sobre la marcha, disoluciones,
          elucidación de espectros, simulacro de examen y el informe conjunto por parejas.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '0.9rem' }}>
          <button
            className="btn btn-sm"
            onClick={() => onIr(firmado ? 'protocols' : 'safety')}
            style={{
              background: 'var(--oro)', color: '#2b1608', border: 'none',
              fontWeight: 800, borderRadius: 10, padding: '10px 16px'
            }}
          >
            {firmado ? 'Ir a los protocolos' : 'Firmar las normas de seguridad'}
          </button>

          <a
            href="https://drive.google.com/file/d/1zHi7DsEEQ9TsXbelODcG5hcy8_pMl4Bl/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{
              background: 'rgba(255,255,255,0.12)', color: '#fff7f2',
              border: '1px solid rgba(255,255,255,0.28)', borderRadius: 10,
              padding: '10px 16px', fontWeight: 700, textDecoration: 'none'
            }}
          >
            <Download size={15} /> Guion en PDF
          </a>
        </div>

        <div className="gr-datos">
          <div className="gr-dato">
            {firmado
              ? <><CheckCircle2 size={13} style={{ verticalAlign: '-2px' }} /> Normas firmadas</>
              : <><Lock size={13} style={{ verticalAlign: '-2px' }} /> Seguridad pendiente</>}
          </div>
          <div className="gr-dato">⚗️ 3 reacciones: Propranolol I y II · DHPP</div>
          <div className="gr-dato">🔬 12 espectros ¹H, ¹³C, DEPT y HRMS</div>
          <div className="gr-dato">👥 Informe por parejas</div>
        </div>
      </div>

      {/* Perfil de Sierra Nevada: el horizonte que se ve desde la Facultad */}
      <svg className="gr-sierra" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 60 L0 40 L90 22 L150 34 L240 8 L310 30 L400 14 L470 32 L560 6 L640 28 L730 16 L820 36 L910 18 L1000 34 L1090 20 L1200 38 L1200 60 Z"
          fill="rgba(234,241,247,0.16)"
        />
        <path
          d="M0 60 L0 50 L120 40 L220 48 L330 30 L430 44 L540 26 L650 42 L760 32 L880 46 L1000 36 L1120 46 L1200 40 L1200 60 Z"
          fill="rgba(234,241,247,0.30)"
        />
      </svg>
    </section>

    <MiSemanaPracticas />
  </>
);
