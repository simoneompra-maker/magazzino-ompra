// src/components/OCRScanner.jsx
import { useState } from 'react';
import { scanMatricola } from '../services/ocrService';

// Colori OMPRA
const OMPRA_GREEN = '#006B3F';
const OMPRA_YELLOW = '#FFDD00';

function OCRScanner({ onMatricolaDetected, disabled = false }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    setScanning(true);
    setResult(null);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    console.log('📸 Inizio scansione...');

    try {
      const ocrResult = await scanMatricola(file);

      if (ocrResult.success) {
        console.log('✅ Rilevato:', ocrResult.brand, ocrResult.modello, ocrResult.matricola);
        
        setResult({
          status: 'success',
          brand: ocrResult.brand,
          modello: ocrResult.modello,
          matricola: ocrResult.matricola,
          confidence: ocrResult.confidence,
          time: ocrResult.responseTime
        });

        setTimeout(() => {
          onMatricolaDetected({
            brand: ocrResult.brand,
            modello: ocrResult.modello,
            matricola: ocrResult.matricola
          });
          setPreview(null);
          setResult(null);
        }, 1500);

      } else {
        console.warn('⚠️ Errore OCR:', ocrResult.error);
        
        setResult({
          status: 'error',
          error: ocrResult.error,
          brand: ocrResult.brand,
          modello: ocrResult.modello,
          matricola: ocrResult.matricola
        });

        setTimeout(() => {
          if (result?.status === 'error') {
            setPreview(null);
            setResult(null);
          }
        }, 8000);
      }

    } catch (error) {
      console.error('❌ Errore:', error);
      setResult({ status: 'error', error: 'Errore imprevisto' });
    } finally {
      setScanning(false);
    }
  };

  const handleRetry = () => {
    setPreview(null);
    setResult(null);
    document.getElementById('ocr-file-input-camera')?.click();
  };

  const handleUseResult = () => {
    if (result) {
      onMatricolaDetected({
        brand: result.brand,
        modello: result.modello,
        matricola: result.matricola
      });
    }
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="ocr-scanner">
      {/* Input fotocamera */}
      <input
        type="file"
        id="ocr-file-input-camera"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {/* Input galleria */}
      <input
        type="file"
        id="ocr-file-input-gallery"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Pulsanti */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={() => document.getElementById('ocr-file-input-camera')?.click()}
          disabled={disabled || scanning}
          style={{
            flex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 16px',
            backgroundColor: scanning ? '#94a3b8' : OMPRA_GREEN,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: disabled || scanning ? 'not-allowed' : 'pointer',
            justifyContent: 'center'
          }}
        >
          {scanning ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>🔄</span>
              <span>Scansione...</span>
            </>
          ) : (
            <>
              <span>📸</span>
              <span>Scatta Foto</span>
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={() => document.getElementById('ocr-file-input-gallery')?.click()}
          disabled={disabled || scanning}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '14px 12px',
            backgroundColor: '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: disabled || scanning ? 'not-allowed' : 'pointer',
            justifyContent: 'center'
          }}
        >
          <span>📁</span>
          <span>Galleria</span>
        </button>
      </div>

      {/* Modal risultato */}
      {preview && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            {/* Preview immagine */}
            <img
              src={preview}
              alt="Scansione"
              style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: '16px',
                maxHeight: '200px',
                objectFit: 'contain'
              }}
            />

            {/* Loading */}
            {scanning && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: OMPRA_GREEN }}>
                  Lettura in corso...
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                  Riconoscimento Brand, Modello e Matricola
                </div>
              </div>
            )}

            {/* Successo */}
            {result?.status === 'success' && (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: OMPRA_GREEN }}>
                  Rilevato con successo!
                </div>
                
                {/* Brand */}
                {result.brand && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px', textTransform: 'uppercase' }}>
                      Brand
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: OMPRA_GREEN,
                      backgroundColor: OMPRA_YELLOW,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>
                      {result.brand}
                    </div>
                  </div>
                )}
                
                {/* Modello */}
                {result.modello && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px', textTransform: 'uppercase' }}>
                      Modello
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1e40af',
                      backgroundColor: '#dbeafe',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>
                      {result.modello}
                    </div>
                  </div>
                )}
                
                {/* Matricola */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px', textTransform: 'uppercase' }}>
                    Matricola
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    display: 'inline-block'
                  }}>
                    {result.matricola}
                  </div>
                </div>
                
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
                  ⏱️ {Math.round(result.time / 100) / 10}s • Aggiunta automatica...
                </div>
              </div>
            )}

            {/* Errore */}
            {result?.status === 'error' && (
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>⚠️</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', color: '#dc2626' }}>
                  {result.error}
                </div>

                {/* Dati parziali */}
                {(result.brand || result.modello || result.matricola) && (
                  <div style={{ 
                    backgroundColor: '#fef9c3', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    border: '1px solid #fbbf24'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#92400e' }}>
                      Dati rilevati (parziali):
                    </div>
                    {result.brand && <div style={{ fontSize: '14px' }}>Brand: <strong>{result.brand}</strong></div>}
                    {result.modello && <div style={{ fontSize: '14px' }}>Modello: <strong>{result.modello}</strong></div>}
                    {result.matricola && <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>Matricola: <strong>{result.matricola}</strong></div>}
                  </div>
                )}

                {/* Pulsanti */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleRetry}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: OMPRA_GREEN,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Riprova
                  </button>
                  {result.matricola && (
                    <button
                      onClick={handleUseResult}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Usa questi
                    </button>
                  )}
                  <button
                    onClick={() => { setPreview(null); setResult(null); }}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OCRScanner;
