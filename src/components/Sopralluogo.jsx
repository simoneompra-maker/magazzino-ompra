// src/components/Sopralluogo.jsx
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Archive, ChevronRight, Leaf, FileText, Package, Calendar, Trash2, RefreshCw } from 'lucide-react';
import {
  salvaSopralluogo, aggiornaSopralluogo, getSopralluoghi, eliminaSopralluogo,
  getPianiSopralluogo, getInterventiPiano, scegliPiani,
} from '../services/sopralluoghiService';

const OPERATORE_KEY = 'ompra_ultimo_operatore';
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const OMPRA = {
  nome: 'OMPRA Srl',
  indirizzo: 'Via Roncade, 7 – 31048 San Biagio di Callalta (TV)',
  tel: '0422 892426',
  email: 'info@ompra.it',
  web: 'www.ompra.it',
};

// ── Gemini helper ────────────────────────────────────────────
async function geminiText(prompt) {
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── Genera relazione ─────────────────────────────────────────
async function generaRelazione(form, pianoNutrizione, pianoPrevenzione, interventi, operatore) {
  const pianoTesto = interventi.length > 0
    ? interventi.map(i =>
        `- ${i.timing}: ${i.label}${i.dose_effettiva ? ` — ${i.dose_effettiva} g/m²` : ''}${i.nota ? ` (${i.nota})` : ''}`
      ).join('\n')
    : 'Piano da definire.';

  const prompt = `Sei Simone Taffarello, agrotecnico OMPRA Srl, esperto in tappeti erbosi ornamentali. Scrivi una relazione tecnica di sopralluogo professionale in italiano.

DATI SOPRALLUOGO:
- Data: ${form.data_sopralluogo}
- Tecnico: ${operatore}
- Cliente: ${form.cliente || '—'}
- Luogo: ${form.luogo || '—'}
- Superficie: ${form.superficie ? form.superficie + ' m²' : 'non indicata'}
- Irrigazione: ${form.irrigazione || '—'}

ANALISI TERRENO:
- Tessitura: ${form.tessitura || '—'}
- Compattamento: ${form.compattamento || '—'}
- Drenaggio: ${form.drenaggio || '—'}
- pH stimato: ${form.ph || '—'}
- CE (conducibilità elettrica): ${form.ce_terreno ? form.ce_terreno + ' mS/cm' : '—'}
- Lavorazioni pregresse: ${form.lavorazioni_preg || 'nessuna indicazione'}

CONDIZIONI VEGETATIVE:
- Stato vegetativo: ${form.stato_vegetativo || '—'}
- Infestanti: ${form.infestanti || '—'}

NOTE TECNICHE:
${form.note_tecniche || 'Nessuna nota aggiuntiva.'}

PIANO CONSIGLIATO:
- Nutrizione: ${pianoNutrizione?.label || '—'}
- Prevenzione terreno: ${pianoPrevenzione?.label || '—'}

INTERVENTI PREVISTI (nutrizione):
${pianoTesto}

Genera la relazione con queste 5 sezioni numerate:
1. PREMESSA — chi ha richiesto il sopralluogo, data, luogo, superficie
2. STATO DEL TERRENO — analisi tessitura, compattamento, drenaggio, pH, CE
3. VALUTAZIONE FITOTECNICA — condizioni vegetative, infestanti, diagnosi
4. PIANO D'INTERVENTO CONSIGLIATO — fasi con prodotti e dosaggi
5. CONCLUSIONI — raccomandazioni operative

Stile professionale e diretto, prima persona come tecnico. ~500 parole. Non inventare dati non forniti.`;

  return await geminiText(prompt);
}

// ── Stampa PDF ───────────────────────────────────────────────
function stampaPDF(form, relazione, pianiScelti, interventiNutrizione, operatore) {
  const data = form.data_sopralluogo
    ? new Date(form.data_sopralluogo + 'T12:00:00').toLocaleDateString('it-IT')
    : '—';
  const oggi = new Date().toLocaleDateString('it-IT');

  const tabellaInterventi = interventiNutrizione.length > 0 ? `
    <h3 style="color:#006B3F;font-size:13px;margin:14px 0 6px">PIANO DI CONCIMAZIONE — ${pianiScelti.nutrizione?.label || ''}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <thead><tr style="background:#006B3F;color:white">
        <th style="padding:5px 8px;text-align:left">Periodo</th>
        <th style="padding:5px 8px;text-align:left">Prodotto</th>
        <th style="padding:5px 8px;text-align:center">Dose</th>
        <th style="padding:5px 8px;text-align:left">Note</th>
      </tr></thead>
      <tbody>
        ${interventiNutrizione.map((i, idx) => `
          <tr style="background:${idx % 2 === 0 ? '#f9fafb' : '#fff'}">
            <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb">${i.timing}</td>
            <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;font-weight:600">${i.label}</td>
            <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;text-align:center">${i.dose_effettiva ? i.dose_effettiva + ' g/m²' : '—'}</td>
            <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;color:#6b7280">${i.nota || ''}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    ${form.superficie ? `<p style="font-size:10px;color:#6b7280;margin-top:4px">* Dosi per 100 m² — superficie dichiarata: ${form.superficie} m²</p>` : ''}
  ` : '';

  const html = `<!DOCTYPE html><html lang="it"><head>
    <meta charset="UTF-8">
    <title>Relazione Sopralluogo — ${form.cliente || 'Cliente'}</title>
    <style>
      body{font-family:Arial,sans-serif;font-size:11px;color:#111;margin:0;padding:24px 32px}
      h2{font-size:14px;color:#006B3F;margin:14px 0 6px;border-bottom:1.5px solid #006B3F;padding-bottom:3px}
      p{margin:0 0 5px;line-height:1.55}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #006B3F;padding-bottom:12px;margin-bottom:14px}
      .logo{font-size:22px;font-weight:900;color:#006B3F;letter-spacing:-1px}
      .adr{text-align:right;font-size:10px;color:#6b7280}
      .meta{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:10px 14px;margin-bottom:14px;display:grid;grid-template-columns:1fr 1fr;gap:4px}
      .ml{color:#6b7280;font-size:10px} .mv{font-weight:600;color:#111;font-size:10px}
      .rel{white-space:pre-wrap;line-height:1.6;font-size:11px}
      .ftr{margin-top:20px;border-top:1px solid #e5e7eb;padding-top:8px;font-size:9px;color:#9ca3af;text-align:center}
      @media print{body{padding:16px 24px}}
    </style>
  </head><body>
    <div class="hdr">
      <div class="logo">OMPRA</div>
      <div class="adr">
        <div style="font-weight:700;font-size:11px;color:#111">${OMPRA.nome}</div>
        <div>${OMPRA.indirizzo}</div>
        <div>Tel: ${OMPRA.tel} — ${OMPRA.email}</div>
      </div>
    </div>

    <div style="font-size:17px;font-weight:900;color:#006B3F;margin-bottom:12px">RELAZIONE TECNICA DI SOPRALLUOGO</div>

    <div class="meta">
      <div><span class="ml">Data: </span><span class="mv">${data}</span></div>
      <div><span class="ml">Tecnico: </span><span class="mv">${operatore}</span></div>
      <div><span class="ml">Cliente: </span><span class="mv">${form.cliente || '—'}</span></div>
      <div><span class="ml">Luogo: </span><span class="mv">${form.luogo || '—'}</span></div>
      <div><span class="ml">Superficie: </span><span class="mv">${form.superficie ? form.superficie + ' m²' : '—'}</span></div>
      <div><span class="ml">Tessitura: </span><span class="mv">${form.tessitura || '—'}</span></div>
      <div><span class="ml">Irrigazione: </span><span class="mv">${form.irrigazione || '—'}</span></div>
      <div><span class="ml">pH: </span><span class="mv">${form.ph || '—'}</span></div>
      ${form.ce_terreno ? `<div><span class="ml">CE: </span><span class="mv">${form.ce_terreno} mS/cm</span></div>` : ''}
      ${form.compattamento ? `<div><span class="ml">Compattamento: </span><span class="mv">${form.compattamento}</span></div>` : ''}
    </div>

    <h2>RELAZIONE TECNICA</h2>
    <div class="rel">${relazione || '(relazione non generata)'}</div>

    ${tabellaInterventi}

    <div class="ftr">
      Redatto da ${operatore} — ${oggi} — ${OMPRA.nome} — ${OMPRA.indirizzo} — ${OMPRA.web}<br>
      Documento riservato. Riproduzione vietata senza autorizzazione scritta.
    </div>
  </body></html>`;

  const w = window.open('', '_blank');
  if (!w) { alert('Abilita i popup per stampare.'); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 600);
}

// ── UI atoms ─────────────────────────────────────────────────
function Btn({ children, onClick, color = 'green', outline = false, disabled = false, fullWidth = false }) {
  const base = `${fullWidth ? 'w-full' : ''} py-3 px-4 text-sm rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5`;
  const styles = {
    green: outline ? 'border-2 border-green-700 text-green-700 bg-white' : 'bg-green-700 text-white shadow-sm',
    gray: 'border-2 border-gray-300 text-gray-600 bg-white',
    red: outline ? 'border-2 border-red-500 text-red-600 bg-white' : 'bg-red-600 text-white',
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${styles[color]}`}>{children}</button>;
}

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function Field({ label, required, children }) {
  return <div><Label required={required}>{label}</Label>{children}</div>;
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-600" />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-600 bg-white">
      <option value="">{placeholder || '— seleziona —'}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ChipGroup({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            value === o.value ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-300'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ProgressBar({ step, total = 4 }) {
  return (
    <div className="flex gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-green-700' : 'bg-gray-200'}`} />
      ))}
    </div>
  );
}

function Header({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <Leaf className="w-5 h-5 text-green-700 shrink-0" />
      <span className="font-bold text-gray-800 text-sm truncate">{title}</span>
    </div>
  );
}

// ── Passo 1: Cliente ─────────────────────────────────────────
function Passo1({ form, setForm }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Cliente e localizzazione</p>
      <Field label="Nome cliente" required>
        <TextInput value={form.cliente} onChange={v => setForm(f => ({ ...f, cliente: v }))} placeholder="es. Mario Rossi" />
      </Field>
      <Field label="Luogo / indirizzo">
        <TextInput value={form.luogo} onChange={v => setForm(f => ({ ...f, luogo: v }))} placeholder="es. Via Roma 5, Treviso" />
      </Field>
      <Field label="Data sopralluogo" required>
        <TextInput type="date" value={form.data_sopralluogo} onChange={v => setForm(f => ({ ...f, data_sopralluogo: v }))} />
      </Field>
      <Field label="Superficie (m²)">
        <TextInput type="number" value={form.superficie} onChange={v => setForm(f => ({ ...f, superficie: v }))} placeholder="es. 800" />
      </Field>
    </div>
  );
}

// ── Passo 2: Terreno ─────────────────────────────────────────
function Passo2({ form, setForm }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Analisi del terreno</p>

      <Field label="Tessitura" required>
        <ChipGroup value={form.tessitura} onChange={v => setForm(f => ({ ...f, tessitura: v }))}
          options={[
            { value: 'normale', label: 'Normale' },
            { value: 'sabbioso', label: 'Sabbioso' },
            { value: 'franco-sabbioso', label: 'Franco-sabbioso' },
            { value: 'argilloso', label: 'Argilloso' },
          ]} />
      </Field>

      <Field label="Sistema irrigazione">
        <SelectInput value={form.irrigazione} onChange={v => setForm(f => ({ ...f, irrigazione: v }))}
          options={[
            { value: 'centralizzata', label: 'Centralizzata / automatica' },
            { value: 'manuale', label: 'Manuale' },
            { value: 'assente', label: 'Assente' },
          ]} />
      </Field>

      <Field label="Compattamento">
        <ChipGroup value={form.compattamento} onChange={v => setForm(f => ({ ...f, compattamento: v }))}
          options={[
            { value: 'normale', label: 'Normale' },
            { value: 'medio', label: 'Medio' },
            { value: 'elevato', label: 'Elevato' },
          ]} />
      </Field>

      <Field label="Drenaggio">
        <ChipGroup value={form.drenaggio} onChange={v => setForm(f => ({ ...f, drenaggio: v }))}
          options={[
            { value: 'buono', label: 'Buono' },
            { value: 'normale', label: 'Normale' },
            { value: 'scarso', label: 'Scarso' },
            { value: 'ristagni', label: 'Con ristagni' },
          ]} />
      </Field>

      <Field label="pH stimato">
        <SelectInput value={form.ph} onChange={v => setForm(f => ({ ...f, ph: v }))}
          options={[
            { value: '< 6 (acido)', label: '< 6 — Acido' },
            { value: '6-7 (ottimale)', label: '6–7 — Ottimale' },
            { value: '7-8 (neutro-alcalino)', label: '7–8 — Neutro-alcalino' },
            { value: '> 8 (alcalino)', label: '> 8 — Alcalino' },
          ]}
          placeholder="— non misurato —" />
      </Field>

      <Field label="CE — Conducibilità Elettrica (mS/cm)">
        <SelectInput value={form.ce_terreno} onChange={v => setForm(f => ({ ...f, ce_terreno: v }))}
          options={[
            { value: '< 0.5', label: '< 0.5 — Molto bassa' },
            { value: '0.5-1.0', label: '0.5–1.0 — Normale' },
            { value: '1.0-2.0', label: '1.0–2.0 — Moderata' },
            { value: '> 2.0', label: '> 2.0 — Elevata (stress salino)' },
          ]}
          placeholder="— non misurata —" />
      </Field>
    </div>
  );
}

// ── Passo 3: Condizioni vegetative ───────────────────────────
function Passo3({ form, setForm }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Condizioni vegetative</p>

      <Field label="Stato vegetativo">
        <ChipGroup value={form.stato_vegetativo} onChange={v => setForm(f => ({ ...f, stato_vegetativo: v }))}
          options={[
            { value: 'ottimo', label: 'Ottimo' },
            { value: 'buono', label: 'Buono' },
            { value: 'discreto', label: 'Discreto' },
            { value: 'critico', label: 'Critico' },
            { value: 'assente', label: 'Assente / da rifare' },
          ]} />
      </Field>

      <Field label="Infestanti presenti">
        <textarea value={form.infestanti} onChange={e => setForm(f => ({ ...f, infestanti: e.target.value }))}
          placeholder="es. Trifoglio, plantago, poa annua..." rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-600 resize-none" />
      </Field>

      <Field label="Lavorazioni pregresse">
        <textarea value={form.lavorazioni_preg} onChange={e => setForm(f => ({ ...f, lavorazioni_preg: e.target.value }))}
          placeholder="es. Arieggiatura marzo 2024, trasemina autunno 2023..." rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-600 resize-none" />
      </Field>

      <Field label="Note tecniche">
        <textarea value={form.note_tecniche} onChange={e => setForm(f => ({ ...f, note_tecniche: e.target.value }))}
          placeholder="Osservazioni, problemi specifici, richieste del cliente..." rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-600 resize-none" />
      </Field>
    </div>
  );
}

// ── Passo 4: Riepilogo & AI ───────────────────────────────────
function Passo4({ form, pianiScelti, relazione, setRelazione, onGenera, loadingAI, errorAI }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Riepilogo & Generazione relazione</p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-1">
        <p className="text-xs font-bold text-green-800 mb-1.5">RIEPILOGO</p>
        {[
          ['Cliente', form.cliente],
          ['Luogo', form.luogo],
          ['Superficie', form.superficie ? form.superficie + ' m²' : null],
          ['Tessitura', form.tessitura],
          ['Irrigazione', form.irrigazione],
          ['pH', form.ph],
          ['CE', form.ce_terreno ? form.ce_terreno + ' mS/cm' : null],
          ['Stato vegetativo', form.stato_vegetativo],
        ].map(([k, v]) => v ? (
          <p key={k} className="text-xs text-gray-700"><span className="font-semibold">{k}:</span> {v}</p>
        ) : null)}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <p className="text-xs font-bold text-gray-700 mb-2">PIANO CONSIGLIATO</p>
        <p className="text-xs text-gray-600">🌱 <span className="font-semibold text-green-700">{pianiScelti.nutrizione?.label || '—'}</span></p>
        <p className="text-xs text-gray-600">🪱 <span className="font-semibold">{pianiScelti.prev_terreno?.label || '—'}</span></p>
        <p className="text-xs text-gray-600">🌿 <span className="font-semibold">{pianiScelti.prev_fogliare?.label || '—'}</span></p>
        <p className="text-xs text-gray-400 mt-1">Terreno: <span className="font-medium capitalize">{pianiScelti.terreno}</span></p>
      </div>

      {errorAI && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-xs text-red-600">{errorAI}</p>
        </div>
      )}

      {!relazione ? (
        <Btn onClick={onGenera} disabled={loadingAI} fullWidth>
          {loadingAI ? '⏳ Generazione in corso...' : '✨ Genera relazione con AI'}
        </Btn>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-gray-700">RELAZIONE GENERATA — editabile</p>
            <button onClick={onGenera} disabled={loadingAI}
              className="text-xs text-blue-600 underline disabled:opacity-40">
              {loadingAI ? '...' : 'Rigenera'}
            </button>
          </div>
          <textarea value={relazione} onChange={e => setRelazione(e.target.value)} rows={10}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-green-600 resize-none font-mono" />
          <p className="text-xs text-gray-400">Puoi modificare il testo prima di salvare.</p>
        </div>
      )}
    </div>
  );
}

// ── Tab Piano ────────────────────────────────────────────────
function TabPiano({ pianiScelti, interventiNutrizione, interventiPrevTerreno, form }) {
  const superficie = parseFloat(form.superficie) || 0;

  const Sezione = ({ titolo, interventi, color }) => {
    if (!interventi.length) return null;
    const bg = { green: 'bg-green-700', blue: 'bg-blue-600', amber: 'bg-amber-500' }[color] || 'bg-green-700';
    return (
      <div className="mb-4">
        <div className={`${bg} text-white text-xs font-bold px-3 py-2 rounded-t-xl`}>{titolo}</div>
        <div className="border border-gray-200 rounded-b-xl overflow-hidden">
          {interventi.map((i, idx) => (
            <div key={i.id} className={`px-3 py-2.5 border-b border-gray-100 last:border-0 ${idx % 2 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="flex justify-between gap-2 items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{i.label}</p>
                  <p className="text-xs text-gray-500">{i.timing}</p>
                  {i.nota && <p className="text-xs text-gray-400 italic mt-0.5">{i.nota}</p>}
                </div>
                {i.dose_effettiva && (
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-green-700">{i.dose_effettiva} g/m²</p>
                    {superficie > 0 && (
                      <p className="text-xs text-gray-400">{((i.dose_effettiva * superficie) / 1000).toFixed(1)} kg</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!interventiNutrizione.length && !interventiPrevTerreno.length) {
    return <p className="text-xs text-gray-400 text-center py-8">Nessun intervento disponibile.</p>;
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3">
        Terreno: <span className="font-semibold text-green-700 capitalize">{pianiScelti.terreno}</span>
        {superficie > 0 && <span className="ml-2">· {superficie} m²</span>}
      </p>
      <Sezione titolo={`🌱 ${pianiScelti.nutrizione?.label || 'Nutrizione'}`} interventi={interventiNutrizione} color="green" />
      <Sezione titolo={`🪱 ${pianiScelti.prev_terreno?.label || 'Prevenzione terreno'}`} interventi={interventiPrevTerreno} color="blue" />
    </div>
  );
}

// ── Tab Quantità ─────────────────────────────────────────────
function TabPreventivo({ interventiNutrizione, interventiPrevTerreno, form }) {
  const superficie = parseFloat(form.superficie) || 0;
  if (!superficie) {
    return <p className="text-xs text-gray-400 text-center py-8">Inserisci la superficie nel passo 1 per calcolare le quantità.</p>;
  }

  const prodMap = {};
  [...interventiNutrizione, ...interventiPrevTerreno].forEach(i => {
    if (!i.dose_effettiva) return;
    if (!prodMap[i.label]) prodMap[i.label] = { label: i.label, tipo: i.tipo, dose_totale: 0 };
    prodMap[i.label].dose_totale += i.dose_effettiva;
  });

  const prodotti = Object.values(prodMap);
  if (!prodotti.length) return <p className="text-xs text-gray-400 text-center py-8">Nessun prodotto con dose definita.</p>;

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3">Calcolate per <span className="font-semibold">{superficie} m²</span> · dosi cumulative annue</p>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-green-700 text-white text-xs font-bold px-3 py-2">
          <span>Prodotto</span>
          <span className="text-center">kg/anno</span>
          <span className="text-right">Tipo</span>
        </div>
        {prodotti.map((p, idx) => {
          const kg = (p.dose_totale * superficie) / 1000;
          return (
            <div key={p.label} className={`grid grid-cols-3 px-3 py-2.5 text-xs border-b border-gray-100 last:border-0 ${idx % 2 ? 'bg-gray-50' : 'bg-white'}`}>
              <span className="font-semibold text-gray-800 truncate pr-1">{p.label}</span>
              <span className="text-center font-bold text-green-700">{kg.toFixed(1)} kg</span>
              <span className="text-right text-gray-500 capitalize">{p.tipo}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-2">* Dosi indicate per 100 m² — arrotonda per eccesso negli ordini.</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPALE
// ════════════════════════════════════════════════════════════
export default function Sopralluogo({ onNavigate }) {
  const operatore = (() => {
    try { return localStorage.getItem(OPERATORE_KEY) || 'Tecnico'; } catch { return 'Tecnico'; }
  })();

  const [vista, setVista] = useState('home');   // home | wizard | risultato | archivio
  const [step, setStep]   = useState(1);         // 1-4

  const emptyForm = {
    cliente: '', luogo: '',
    data_sopralluogo: new Date().toISOString().slice(0, 10),
    superficie: '', irrigazione: '', tessitura: '', compattamento: '',
    drenaggio: '', ph: '', ce_terreno: '', stato_vegetativo: '',
    infestanti: '', lavorazioni_preg: '', note_tecniche: '',
  };
  const [form, setForm] = useState(emptyForm);

  const [piani, setPiani] = useState([]);
  const [pianiScelti, setPianiScelti] = useState({ nutrizione: null, prev_terreno: null, prev_fogliare: null, terreno: 'normale' });
  const [interventiNutrizione, setInterventiNutrizione] = useState([]);
  const [interventiPrevTerreno, setInterventiPrevTerreno] = useState([]);

  const [relazione, setRelazione]   = useState('');
  const [loadingAI, setLoadingAI]   = useState(false);
  const [errorAI, setErrorAI]       = useState('');
  const [salvando, setSalvando]     = useState(false);

  const [archivio, setArchivio]               = useState([]);
  const [archivioLoading, setArchivioLoading] = useState(false);
  const [archivioRecord, setArchivioRecord]   = useState(null);

  const [activeTab, setActiveTab] = useState('relazione');

  // Carica piani DB al mount
  useEffect(() => {
    getPianiSopralluogo().then(setPiani).catch(console.error);
  }, []);

  // Aggiorna piani scelti al cambio tessitura
  useEffect(() => {
    if (!form.tessitura || !piani.length) return;
    setPianiScelti(scegliPiani(form.tessitura, piani));
  }, [form.tessitura, piani]);

  const loadArchivio = useCallback(async () => {
    setArchivioLoading(true);
    try { setArchivio(await getSopralluoghi()); }
    catch (e) { console.error(e); }
    finally { setArchivioLoading(false); }
  }, []);

  useEffect(() => {
    if (vista === 'archivio') loadArchivio();
  }, [vista, loadArchivio]);

  // Carica interventi per entrambi i piani
  const caricaInterventi = useCallback(async (scelti) => {
    const [intNutr, intPrev] = await Promise.all([
      scelti.nutrizione  ? getInterventiPiano(scelti.nutrizione.id)  : Promise.resolve([]),
      scelti.prev_terreno ? getInterventiPiano(scelti.prev_terreno.id) : Promise.resolve([]),
    ]);
    setInterventiNutrizione(intNutr);
    setInterventiPrevTerreno(intPrev);
    return { intNutr, intPrev };
  }, []);

  // Genera relazione AI
  const handleGenera = async () => {
    setLoadingAI(true);
    setErrorAI('');
    try {
      let intNutr = interventiNutrizione;
      let intPrev = interventiPrevTerreno;
      if (!intNutr.length && !intPrev.length) {
        const r = await caricaInterventi(pianiScelti);
        intNutr = r.intNutr;
        intPrev = r.intPrev;
      }
      const testo = await generaRelazione(form, pianiScelti.nutrizione, pianiScelti.prev_terreno, intNutr, operatore);
      setRelazione(testo);
    } catch (e) {
      setErrorAI('Errore AI: ' + e.message);
    } finally {
      setLoadingAI(false);
    }
  };

  // Salva e vai al risultato
  const handleSalvaEProcedi = async () => {
    setSalvando(true);
    try {
      let intNutr = interventiNutrizione;
      let intPrev = interventiPrevTerreno;
      if (!intNutr.length && !intPrev.length) {
        const r = await caricaInterventi(pianiScelti);
        intNutr = r.intNutr;
        intPrev = r.intPrev;
      }
      const record = {
        operatore,
        stato: relazione ? 'completata' : 'bozza',
        cliente:           form.cliente           || null,
        luogo:             form.luogo             || null,
        data_sopralluogo:  form.data_sopralluogo  || null,
        superficie:        form.superficie ? parseInt(form.superficie) : null,
        irrigazione:       form.irrigazione       || null,
        tessitura:         form.tessitura         || null,
        compattamento:     form.compattamento     || null,
        drenaggio:         form.drenaggio         || null,
        lavorazioni_preg:  form.lavorazioni_preg  || null,
        infestanti:        form.infestanti        || null,
        ph:                form.ph                || null,
        stato_vegetativo:  form.stato_vegetativo  || null,
        note_tecniche:     form.note_tecniche     || null,
        relazione_ai:      relazione              || null,
        piano_id:          pianiScelti.nutrizione?.id || null,
      };
      const saved = await salvaSopralluogo(record);
      setArchivioRecord(saved);
      setVista('risultato');
      setActiveTab('relazione');
    } catch (e) {
      alert('Errore salvataggio: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  // Aggiorna relazione record salvato
  const handleAggiornaRelazione = async () => {
    if (!archivioRecord) return;
    try {
      await aggiornaSopralluogo(archivioRecord.id, { relazione_ai: relazione, stato: 'completata' });
      alert('Salvato.');
    } catch (e) { alert('Errore: ' + e.message); }
  };

  // Riapri da archivio
  const handleRiapri = async (r) => {
    setForm({
      cliente: r.cliente || '', luogo: r.luogo || '',
      data_sopralluogo: r.data_sopralluogo || '',
      superficie: r.superficie ? String(r.superficie) : '',
      irrigazione: r.irrigazione || '', tessitura: r.tessitura || '',
      compattamento: r.compattamento || '', drenaggio: r.drenaggio || '',
      ph: r.ph || '', ce_terreno: '', stato_vegetativo: r.stato_vegetativo || '',
      infestanti: r.infestanti || '', lavorazioni_preg: r.lavorazioni_preg || '',
      note_tecniche: r.note_tecniche || '',
    });
    setRelazione(r.relazione_ai || '');
    setArchivioRecord(r);
    const scelti = scegliPiani(r.tessitura || '', piani);
    setPianiScelti(scelti);
    await caricaInterventi(scelti);
    setVista('risultato');
    setActiveTab('relazione');
  };

  const handleElimina = async (id) => {
    if (!confirm('Eliminare questo sopralluogo?')) return;
    try { await eliminaSopralluogo(id); loadArchivio(); }
    catch (e) { alert('Errore: ' + e.message); }
  };

  const reset = () => {
    setForm(emptyForm); setStep(1); setRelazione(''); setErrorAI('');
    setArchivioRecord(null); setInterventiNutrizione([]); setInterventiPrevTerreno([]);
    setPianiScelti({ nutrizione: null, prev_terreno: null, prev_fogliare: null, terreno: 'normale' });
  };

  const canProceed = () => {
    if (step === 1) return form.cliente.trim() && form.data_sopralluogo;
    if (step === 2) return !!form.tessitura;
    return true;
  };

  // ════════════════════════════════════════════════════════════
  // HOME
  // ════════════════════════════════════════════════════════════
  if (vista === 'home') return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Sopralluogo Agronomico" onBack={() => onNavigate('home')} />
      <div className="px-4 pt-5 pb-10 space-y-3 max-w-lg mx-auto">

        <div className="bg-green-700 text-white rounded-2xl px-4 py-4 mb-4">
          <p className="text-xs opacity-70">Operatore: {operatore}</p>
          <p className="text-base font-bold mt-0.5">PratoVivo — Sopralluogo</p>
          <p className="text-xs opacity-70 mt-0.5">Analisi terreno · Piano annuo · Relazione PDF</p>
        </div>

        {[
          { icon: Plus, label: 'Nuovo sopralluogo', sub: 'Wizard guidato + relazione AI', onClick: () => { reset(); setVista('wizard'); setStep(1); }, accent: true },
          { icon: Archive, label: 'Archivio sopralluoghi', sub: 'Storico, riapertura, ristampa', onClick: () => setVista('archivio'), accent: false },
        ].map(item => (
          <button key={item.label} onClick={item.onClick}
            className={`w-full flex items-center justify-between rounded-2xl px-4 py-4 active:scale-95 transition-transform shadow-sm ${
              item.accent ? 'bg-white border-2 border-green-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.accent ? 'bg-green-50' : 'bg-gray-50'}`}>
                <item.icon className={`w-5 h-5 ${item.accent ? 'text-green-700' : 'text-gray-500'}`} />
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${item.accent ? 'text-green-800' : 'text-gray-700'}`}>{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════
  // ARCHIVIO
  // ════════════════════════════════════════════════════════════
  if (vista === 'archivio') return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Archivio Sopralluoghi" onBack={() => setVista('home')} />
      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs text-gray-400">{archivio.length} sopralluoghi</p>
          <button onClick={loadArchivio} className="p-1.5 rounded-lg hover:bg-gray-100">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        {archivioLoading && <p className="text-xs text-center text-gray-400 py-8">Caricamento...</p>}
        {!archivioLoading && !archivio.length && (
          <div className="text-center py-12">
            <Archive className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Nessun sopralluogo salvato</p>
          </div>
        )}
        <div className="space-y-2">
          {archivio.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{r.cliente || 'Cliente non specificato'}</p>
                  <p className="text-xs text-gray-500 truncate">{r.luogo || '—'}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {r.data_sopralluogo && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {new Date(r.data_sopralluogo + 'T12:00').toLocaleDateString('it-IT')}
                      </span>
                    )}
                    {r.superficie && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{r.superficie} m²</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.stato === 'completata' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.stato}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleRiapri(r)} className="p-2 rounded-lg bg-green-50 hover:bg-green-100">
                    <FileText className="w-4 h-4 text-green-700" />
                  </button>
                  <button onClick={() => handleElimina(r.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════
  // WIZARD
  // ════════════════════════════════════════════════════════════
  if (vista === 'wizard') {
    const titoli = ['Cliente', 'Terreno', 'Condizioni', 'Riepilogo & AI'];
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title={`Passo ${step}/4 — ${titoli[step - 1]}`} onBack={() => step > 1 ? setStep(s => s - 1) : setVista('home')} />
        <div className="flex-1 px-4 pt-4 pb-36 max-w-lg mx-auto w-full overflow-y-auto">
          <ProgressBar step={step} />
          {step === 1 && <Passo1 form={form} setForm={setForm} />}
          {step === 2 && <Passo2 form={form} setForm={setForm} />}
          {step === 3 && <Passo3 form={form} setForm={setForm} />}
          {step === 4 && (
            <Passo4
              form={form} pianiScelti={pianiScelti}
              relazione={relazione} setRelazione={setRelazione}
              onGenera={handleGenera} loadingAI={loadingAI} errorAI={errorAI}
            />
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex gap-2 max-w-lg mx-auto">
            {step > 1 && <Btn color="gray" onClick={() => setStep(s => s - 1)} fullWidth>← Indietro</Btn>}
            <Btn onClick={step < 4 ? () => setStep(s => s + 1) : handleSalvaEProcedi}
              disabled={!canProceed() || salvando} fullWidth>
              {step < 4 ? 'Avanti →' : salvando ? 'Salvataggio...' : '💾 Salva e apri'}
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // RISULTATO
  // ════════════════════════════════════════════════════════════
  if (vista === 'risultato') {
    const tabs = [
      { id: 'relazione', icon: FileText, label: 'Relazione' },
      { id: 'piano',     icon: Calendar, label: 'Piano'     },
      { id: 'quantita',  icon: Package,  label: 'Quantità'  },
    ];
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          title={form.cliente || 'Risultato sopralluogo'}
          onBack={() => setVista('home')}
        />
        <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10">
          <div className="flex max-w-lg mx-auto px-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === t.id ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500'}`}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-4 pt-4 pb-28 max-w-lg mx-auto w-full overflow-y-auto">
          {activeTab === 'relazione' && (
            relazione ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Relazione tecnica</p>
                  <button onClick={() => { setVista('wizard'); setStep(4); }} className="text-xs text-blue-600 underline">Modifica</button>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">{relazione}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-gray-400 mb-3">Relazione non generata.</p>
                <Btn onClick={() => { setVista('wizard'); setStep(4); }}>Genera relazione AI</Btn>
              </div>
            )
          )}
          {activeTab === 'piano' && (
            <TabPiano pianiScelti={pianiScelti}
              interventiNutrizione={interventiNutrizione}
              interventiPrevTerreno={interventiPrevTerreno}
              form={form} />
          )}
          {activeTab === 'quantita' && (
            <TabPreventivo interventiNutrizione={interventiNutrizione}
              interventiPrevTerreno={interventiPrevTerreno} form={form} />
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex gap-2 max-w-lg mx-auto">
            <Btn color="gray" onClick={() => stampaPDF(form, relazione, pianiScelti, interventiNutrizione, operatore)} fullWidth>
              🖨️ PDF
            </Btn>
            {relazione && archivioRecord && (
              <Btn onClick={handleAggiornaRelazione} fullWidth>💾 Aggiorna</Btn>
            )}
            <Btn color="green" outline onClick={() => { reset(); setVista('wizard'); setStep(1); }}>
              <Plus className="w-4 h-4" />
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
