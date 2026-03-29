import { useState, useMemo } from 'react';
import { ArrowLeft, Clock, CheckCircle, Search, Trash2, Edit2, X, Camera, Send, Mail, MessageCircle, FileDown, Phone, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import useStore from '../store';
import { supabase } from '../store';
import { scanMatricola } from '../services/ocrService';
import PrivacyModal from './PrivacyModal';

export default function ArchivioCommissioni({ onNavigate }) {
  const commissioni = useStore((state) => state.commissioni);
  const updateCommissione = useStore((state) => state.updateCommissione);
  const deleteCommissione = useStore((state) => state.deleteCommissione);
  const completeCommissione = useStore((state) => state.completeCommissione);
  const recoverMissingCommissioni = useStore((state) => state.recoverMissingCommissioni);
  const cleanDuplicateCommissioni = useStore((state) => state.cleanDuplicateCommissioni);
  
  // Operatore loggato
  const operatoreLoggato = (() => {
    try { return localStorage.getItem('ompra_ultimo_operatore') || ''; } catch { return ''; }
  })();
  const isAdmin = operatoreLoggato.toLowerCase() === 'admin';

  // Filtro venditore (solo admin)
  const [filtroVenditore, setFiltroVenditore] = useState('');

  // Filtro date export
  const [filtroDataDa, setFiltroDataDa] = useState('');
  const [filtroDataA, setFiltroDataA] = useState('');

  // Default a "Chiuse"
  const [filterStatus, setFilterStatus] = useState('completed');
  const [filtroTipoOperazione, setFiltroTipoOperazione] = useState(''); // '' | 'vendita' | 'reso' | 'cambio'
  const [mostraPreventivi, setMostraPreventivi] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recovering, setRecovering] = useState(false);
  const [editingCommissione, setEditingCommissione] = useState(null);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [newSerial, setNewSerial] = useState('');
  const [scanning, setScanning] = useState(false);
  
  // Modal invio commissione
  const [sendingCommissione, setSendingCommissione] = useState(null);
  
  // Modal anteprima dopo completamento
  const [previewCommissione, setPreviewCommissione] = useState(null);
  
  // Modal privacy GDPR bloccante
  const [privacyCommissione, setPrivacyCommissione] = useState(null);
  
  // Modal modifica commissione completa
  const [editingFullCommissione, setEditingFullCommissione] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editForm, setEditForm] = useState({
    prodotti: [],
    accessori: [],
    totale: '',
    caparra: '',
    metodoPagamento: '',
    note: '',
    tipoDocumento: 'scontrino',
    tipoOperazione: 'vendita',
    ivaCompresa: false
  });

  // Statistiche
  const stats = useMemo(() => ({
    total: commissioni.length,
    pending: commissioni.filter(c => c.status === 'pending').length,
    completed: commissioni.filter(c => c.status === 'completed').length
  }), [commissioni]);

  // Lista venditori unici (solo admin)
  const venditori = useMemo(() => {
    if (!isAdmin) return [];
    return [...new Set(commissioni.map(c => c.operatore).filter(Boolean))].sort();
  }, [commissioni, isAdmin]);

  // Filtra commissioni
  const filteredCommissioni = useMemo(() => {
    return commissioni
      .filter(c => {
        // Filtro per operatore: venditore vede solo le sue, admin filtra per scelta
        if (!isAdmin && operatoreLoggato) {
          if (c.operatore !== operatoreLoggato) return false;
        }
        if (isAdmin && filtroVenditore) {
          if (c.operatore !== filtroVenditore) return false;
        }

        if (filterStatus === 'pending' && c.status !== 'pending') return false;
        if (filterStatus === 'completed' && c.status !== 'completed') return false;

        // Preventivi separati da tutto il resto
        if (mostraPreventivi) {
          if (!c.is_preventivo) return false;
        } else {
          if (c.is_preventivo) return false; // nasconde preventivi nelle altre viste
        }

        if (!mostraPreventivi && filtroTipoOperazione) {
          const tipo = c.tipoOperazione || 'vendita';
          if (tipo !== filtroTipoOperazione) return false;
        }
        
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchCliente = c.cliente?.toLowerCase().includes(term);
          const matchProdotto = c.prodotti?.some(p => 
            p.brand?.toLowerCase().includes(term) ||
            p.model?.toLowerCase().includes(term) ||
            p.serialNumber?.toLowerCase().includes(term)
          );
          return matchCliente || matchProdotto;
        }
        return true;
      })
      .filter(c => {
        if (filtroDataDa) {
          const da = new Date(filtroDataDa);
          da.setHours(0, 0, 0, 0);
          if (new Date(c.createdAt) < da) return false;
        }
        if (filtroDataA) {
          const a = new Date(filtroDataA);
          a.setHours(23, 59, 59, 999);
          if (new Date(c.createdAt) > a) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [commissioni, filterStatus, filtroTipoOperazione, mostraPreventivi, searchTerm, isAdmin, operatoreLoggato, filtroVenditore, filtroDataDa, filtroDataA]);

  // Formatta data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatta metodo pagamento
  const formatMetodoPagamento = (metodo) => {
    const metodi = {
      'contanti': 'Contanti',
      'carta': 'Carta',
      'bonifico': 'Bonifico'
    };
    return metodi[metodo] || metodo;
  };

  // Formatta prezzo per testo
  const formatPrezzoText = (prod) => {
    if (prod.isOmaggio) return 'OMAGGIO';
    if (prod.prezzo === null || prod.prezzo === undefined || prod.prezzo === 0) return 'KIT';
    return `€${prod.prezzo}`;
  };

  // Genera testo commissione per condivisione
  const getCommIndirizzo = (comm) => {
    const info = comm.clienteInfo;
    if (!info) return null;
    const parts = [];
    if (info.indirizzo) parts.push(info.indirizzo);
    if (info.cap || info.localita) parts.push(`${info.cap || ''} ${info.localita || ''}`.trim());
    if (info.provincia) parts.push(`(${info.provincia})`);
    return parts.length > 0 ? parts.join(' - ') : null;
  };

  const getCommEmail = (comm) => {
    return comm.clienteInfo?.email || null;
  };

  const generateCommissioneText = (comm) => {
    let text = `📋 *COMMISSIONE OMPRA*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *Cliente:* ${comm.cliente}\n`;
    if (comm.telefono) {
      text += `📱 *Tel:* ${comm.telefono}\n`;
    }
    const indirizzo = getCommIndirizzo(comm);
    if (indirizzo) {
      text += `📍 *Indirizzo:* ${indirizzo}\n`;
    }
    const email = getCommEmail(comm);
    if (email) {
      text += `📧 *Email:* ${email}\n`;
    }
    if (comm.operatore) {
      text += `👷 *Operatore:* ${comm.operatore}\n`;
    }
    text += `📅 ${formatDate(comm.createdAt)}\n\n`;
    
    text += `📦 *PRODOTTI:*\n`;
    comm.prodotti?.forEach((prod, idx) => {
      const prezzo = formatPrezzoText(prod);
      text += `${idx + 1}. ${prod.brand} ${prod.model}\n`;
      if (prod.serialNumber) {
        text += `   SN: ${prod.serialNumber}\n`;
      }
      text += `   Prezzo: ${prezzo}\n`;
    });
    
    if (comm.accessori?.length > 0) {
      text += `\n🔧 *ACCESSORI:*\n`;
      comm.accessori.forEach(acc => {
        const qta = acc.quantita || 1;
        const accPrezzo = (parseFloat(acc.prezzo) || 0) * qta;
        const qtaLabel = qta > 1 ? ` ×${qta}` : '';
        text += `• ${acc.nome}${qtaLabel} - €${accPrezzo.toFixed(2)}\n`;
      });
    }
    
    text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *TOTALE: €${comm.totale?.toFixed(2) || '0.00'}*`;
    
    // Aggiungi caparra se presente
    if (comm.caparra) {
      text += `\n💳 *CAPARRA: €${comm.caparra.toFixed(2)}* (${formatMetodoPagamento(comm.metodoPagamento)})`;
      const daSaldare = comm.totale - comm.caparra;
      text += `\n📌 *DA SALDARE: €${daSaldare.toFixed(2)}*`;
    }
    
    // Aggiungi note se presenti
    if (comm.note) {
      text += `\n\n📝 *Note:* ${comm.note}`;
    }
    
    return text;
  };

  // Genera PDF
  const generatePDF = (comm, returnBlob = false) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 15;

    const checkPageBreak = (neededSpace = 10) => {
      if (y + neededSpace > pageHeight - 15) {
        doc.addPage();
        y = 15;
      }
    };

    // Header semplice con bordo
    doc.setDrawColor(0, 107, 63);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, pageWidth - 2 * margin, 25);
    
    doc.setTextColor(0, 107, 63);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('OMPRA', pageWidth / 2, y + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Commissione di Vendita', pageWidth / 2, y + 17, { align: 'center' });
    doc.text(formatDate(comm.createdAt), pageWidth / 2, y + 22, { align: 'center' });

    y += 32;

    // Cliente, Telefono, Indirizzo e Operatore con bordino
    const commAddr = getCommIndirizzo(comm);
    const commEmail = getCommEmail(comm);
    let cLines = 1;
    if (comm.telefono) cLines++;
    if (commAddr) cLines++;
    if (commEmail) cLines++;
    const boxHeight = 12 + (cLines * 6);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, pageWidth - 2 * margin, boxHeight);
    
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('CLIENTE', margin + 3, y + 5);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(comm.cliente || '', margin + 3, y + 12);

    let cY = y + 12;

    // Telefono sotto il nome cliente
    if (comm.telefono) {
      cY += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`Tel: ${comm.telefono}`, margin + 3, cY);
    }

    // Indirizzo sotto il telefono
    if (commAddr) {
      cY += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(commAddr, margin + 3, cY);
    }

    // Email
    if (commEmail) {
      cY += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`Email: ${commEmail}`, margin + 3, cY);
    }

    if (comm.operatore) {
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('OPERATORE', pageWidth - margin - 35, y + 5);
      
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(comm.operatore, pageWidth - margin - 35, y + 12);
    }

    y += boxHeight + 7;

    // === TABELLA ARTICOLI ===
    const colQta = margin;
    const colDesc = margin + 14;
    const colUnit = pageWidth - margin - 58;
    const colTot = pageWidth - margin - 26;
    const rightEdge = pageWidth - margin;

    // Header tabella
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, pageWidth - 2 * margin, 7, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 7, rightEdge, y + 7);

    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('QTÀ', colQta + 1, y + 5);
    doc.text('DESCRIZIONE', colDesc, y + 5);
    doc.text('P.ZO UNIT.', colUnit, y + 5);
    doc.text('TOTALE', colTot, y + 5);
    y += 9;

    // Prodotti
    comm.prodotti?.forEach((prod) => {
      const rowH = prod.serialNumber ? 13 : 8;
      checkPageBreak(rowH + 4);
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.15);
      doc.line(margin, y + rowH, rightEdge, y + rowH);

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text('1', colQta + 4, y + 5, { align: 'center' });

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`${prod.brand} ${prod.model}`, colDesc, y + 5);

      if (prod.serialNumber) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(`SN: ${prod.serialNumber}`, colDesc, y + 10);
      } else {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(180, 140, 0);
        doc.text('Matricola da inserire', colDesc, y + 10);
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      if (prod.isOmaggio) {
        doc.text('OMAGGIO', colTot, y + 5);
      } else if (prod.prezzo === null || prod.prezzo === undefined || prod.prezzo === 0) {
        doc.text('KIT', colTot, y + 5);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text(`€ ${prod.prezzo.toFixed(2)}`, colUnit, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.text(`€ ${prod.prezzo.toFixed(2)}`, colTot, y + 5);
      }

      y += rowH + 2;
    });

    // Accessori
    if (comm.accessori && comm.accessori.length > 0) {
      y += 1;
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.setFont('helvetica', 'bold');
      doc.text('ACCESSORI', colDesc, y + 3);
      y += 5;

      comm.accessori.forEach((acc) => {
        const qta = acc.quantita || 1;
        const unitPrezzo = parseFloat(acc.prezzo) || 0;
        const totPrezzo = unitPrezzo * qta;

        checkPageBreak(14);
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.15);
        doc.line(margin, y + 8, rightEdge, y + 8);

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(String(qta), colQta + 4, y + 5, { align: 'center' });

        doc.text(acc.nome, colDesc, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.text(`€ ${unitPrezzo.toFixed(2)}`, colUnit, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.text(`€ ${totPrezzo.toFixed(2)}`, colTot, y + 5);

        y += 10;
      });
    }

    // Sezione Totale con caparra
    y += 8;
    const totaleBoxHeight = comm.caparra ? 28 : 14;
    checkPageBreak(totaleBoxHeight + 30);
    doc.setDrawColor(0, 107, 63);
    doc.setLineWidth(0.5);
    
    doc.rect(margin, y, pageWidth - 2 * margin, totaleBoxHeight);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTALE', margin + 5, y + 9);

    doc.setFontSize(14);
    doc.text(`€ ${(comm.totale || 0).toFixed(2)}`, pageWidth - margin - 5, y + 9, { align: 'right' });

    if (comm.caparra) {
      y += 12;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`CAPARRA (${formatMetodoPagamento(comm.metodoPagamento)})`, margin + 5, y + 5);
      doc.text(`€ ${comm.caparra.toFixed(2)}`, pageWidth - margin - 5, y + 5, { align: 'right' });
      
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 107, 63);
      doc.text('DA SALDARE', margin + 5, y + 5);
      const daSaldare = comm.totale - comm.caparra;
      doc.text(`€ ${daSaldare.toFixed(2)}`, pageWidth - margin - 5, y + 5, { align: 'right' });
      
      y += 10;
    } else {
      y += totaleBoxHeight;
    }

    // Note
    if (comm.note) {
      checkPageBreak(20);
      y += 5;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTE:', margin, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      
      const noteLines = doc.splitTextToSize(comm.note, pageWidth - 2 * margin);
      y += 5;
      noteLines.forEach((line) => {
        checkPageBreak(6);
        doc.text(line, margin, y);
        y += 4;
      });
    }

    // Footer
    checkPageBreak(15);
    y += 10;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Documento non fiscale - Solo per uso interno', pageWidth / 2, y, { align: 'center' });

    const fileName = `Commissione_${(comm.cliente || 'Cliente').replace(/\s+/g, '_')}_${new Date(comm.createdAt).toISOString().slice(0, 10)}.pdf`;
    
    if (returnBlob) {
      return { blob: doc.output('blob'), fileName };
    }
    
    doc.save(fileName);
    return fileName;
  };

  // Invia via WhatsApp
  const handleSendWhatsApp = (comm) => {
    const text = generateCommissioneText(comm);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSendingCommissione(null);
    setPreviewCommissione(null);
  };

  // Solo download PDF
  const handleDownloadPDF = (comm) => {
    generatePDF(comm);
    setSendingCommissione(null);
  };

  // Stampa PDF - apre in nuova tab pronta per stampare
  const handlePrintPDF = (comm) => {
    const { blob } = generatePDF(comm, true);
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print();
        }, 300);
      });
    }
    setSendingCommissione(null);
    setPreviewCommissione(null);
  };

  // Apri modal per aggiungere matricola
  const handleEditProduct = (commissione, productIndex) => {
    setEditingCommissione(commissione);
    setEditingProductIndex(productIndex);
    setNewSerial(commissione.prodotti[productIndex].serialNumber || '');
  };

  // Salva matricola
  const handleSaveSerial = async () => {
    if (!newSerial.trim()) {
      alert('Inserisci una matricola!');
      return;
    }
    
    const updatedProdotti = [...editingCommissione.prodotti];
    updatedProdotti[editingProductIndex] = {
      ...updatedProdotti[editingProductIndex],
      serialNumber: newSerial.trim()
    };
    
    updateCommissione(editingCommissione.id, { prodotti: updatedProdotti });
    
    // Controlla se tutte le matricole NECESSARIE sono state inserite
    const tutteMatricoleInserite = updatedProdotti.every(p => !richiedeMatricola(p.brand, p.model) || p.serialNumber);
    
    setEditingCommissione(null);
    setEditingProductIndex(null);
    setNewSerial('');
    
    // Se tutte le matricole sono inserite, chiedi se vuole completare
    if (tutteMatricoleInserite) {
      const vuoleCompletare = confirm('✅ Tutte le matricole inserite!\n\nVuoi completare la commissione e procedere all\'invio?');
      
      if (vuoleCompletare) {
        // Recupera la commissione aggiornata
        const commAggiornata = { ...editingCommissione, prodotti: updatedProdotti };
        const result = await completeCommissione(commAggiornata.id);
        
        if (result.success) {
          // Mostra anteprima per condividere
          setPreviewCommissione({ ...commAggiornata, status: 'completed' });
        } else {
          alert('Errore: ' + result.error);
        }
      }
    }
  };

  // OCR per matricola
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    setScanning(true);
    
    try {
      const result = await scanMatricola(file);
      if (result.success && result.matricola) {
        setNewSerial(result.matricola);
      } else {
        alert(result.error || 'Matricola non leggibile');
      }
    } catch (error) {
      alert('Errore durante scansione');
    } finally {
      setScanning(false);
    }
  };

  // Prodotti che NON richiedono matricola (batterie, caricabatterie, accessori, consumabili)
  const richiedeMatricola = (brand, model) => {
    if (!model) return false;
    const m = model.toLowerCase();
    const noSerial = [
      'batteria', 'battery', 'caricabatterie', 'caricatore', 'charger',
      'olio', 'oil', 'filo', 'wire', 'accessori', 'accessory',
      'casco', 'helmet', 'guanti', 'gloves', 'protezione', 'protection',
      'borsa', 'bag', 'zaino', 'backpack', 'tracolla', 'harness',
      'testina', 'head', 'lama', 'blade', 'catena', 'chain',
      'spranga', 'bar', 'carburante', 'fuel', 'lubrificante',
      'ak', 'ap ', 'ar ', 'al1', 'al3', 'al5',
    ];
    return !noSerial.some(kw => m.includes(kw));
  };

  // Completa commissione - ora mostra anteprima invece di chiudere subito
  const handleComplete = async (commissione) => {
    if (commissione.prodotti.some(p => richiedeMatricola(p.brand, p.model) && !p.serialNumber)) {
      alert('Aggiungi prima le matricole delle macchine!');
      return;
    }
    
    const result = await completeCommissione(commissione.id);
    if (result.success) {
      // Mostra anteprima per condividere
      setPreviewCommissione({ ...commissione, status: 'completed' });
    } else {
      alert('Errore: ' + result.error);
    }
  };

  // Elimina commissione
  const handleDelete = (id) => {
    if (confirm('Eliminare questa commissione e la vendita associata dallo storico?')) {
      deleteCommissione(id);
    }
  };

  // Apri modifica commissione completa
  const handleOpenEditFull = (comm) => {
    setEditingFullCommissione(comm);
    const dateRef = new Date(comm.completedAt || comm.createdAt);
    const yyyy = dateRef.getFullYear();
    const mm = String(dateRef.getMonth() + 1).padStart(2, '0');
    const dd = String(dateRef.getDate()).padStart(2, '0');
    setEditForm({
      data: `${yyyy}-${mm}-${dd}`,
      cliente: comm.cliente || '',
      telefono: comm.telefono || '',
      operatore: comm.operatore || '',
      prodotti: comm.prodotti.map(p => ({ ...p, aliquotaIva: p.aliquotaIva || 22 })),
      accessori: comm.accessori ? comm.accessori.map(a => ({ ...a, aliquotaIva: a.aliquotaIva || 22 })) : [],
      totale: comm.totale?.toString() || '',
      caparra: comm.caparra?.toString() || '',
      metodoPagamento: comm.metodoPagamento || '',
      note: comm.note || '',
      tipoDocumento: comm.tipoDocumento || 'scontrino',
      tipoOperazione: comm.tipoOperazione || 'vendita',
      ivaCompresa: comm.ivaCompresa || false
    });
  };

  // Aggiorna prezzo prodotto in modifica
  const handleEditProductPrice = (index, newPrice) => {
    const updated = [...editForm.prodotti];
    updated[index].prezzo = newPrice === '' ? null : parseFloat(newPrice);
    const newTotale = calcolaTotaleEdit({ ...editForm, prodotti: updated });
    setEditForm({ ...editForm, prodotti: updated, totale: newTotale });
  };

  // Aggiorna matricola prodotto in modifica
  const handleEditProductSerial = (index, value) => {
    const updated = [...editForm.prodotti];
    updated[index] = { ...updated[index], serialNumber: value };
    setEditForm({ ...editForm, prodotti: updated });
  };

  // Calcola totale automatico da prodotti + accessori
  const calcolaTotaleEdit = (form) => {
    const sommaProdotti = (form.prodotti || []).reduce((s, p) => s + (parseFloat(p.prezzo) || 0), 0);
    const sommaAccessori = (form.accessori || []).reduce((s, a) => s + (parseFloat(a.prezzo) || 0) * (parseInt(a.quantita) || 1), 0);
    const tot = sommaProdotti + sommaAccessori;
    return tot > 0 ? tot.toString() : form.totale;
  };

  // Rimuovi prodotto in modifica
  const handleRemoveEditProduct = (index) => {
    if (editForm.prodotti.length <= 1 && editForm.accessori.length === 0) {
      alert('Devi avere almeno un articolo!');
      return;
    }
    const updated = editForm.prodotti.filter((_, i) => i !== index);
    const newTotale = calcolaTotaleEdit({ ...editForm, prodotti: updated });
    setEditForm({ ...editForm, prodotti: updated, totale: newTotale });
  };

  // Aggiungi prodotto in modifica
  const handleAddEditProduct = () => {
    const updated = [...editForm.prodotti, { brand: '', model: '', serialNumber: '', prezzo: null, aliquotaIva: 22 }];
    setEditForm({ ...editForm, prodotti: updated });
  };

  // Aggiorna campo generico prodotto in modifica
  const handleEditProductField = (index, field, value) => {
    const updated = [...editForm.prodotti];
    updated[index] = { ...updated[index], [field]: value };
    setEditForm({ ...editForm, prodotti: updated });
  };

  // Aggiorna accessorio in modifica
  const handleEditAccessorio = (index, field, value) => {
    const updated = [...editForm.accessori];
    if (field === 'prezzo' || field === 'quantita') {
      updated[index][field] = value === '' ? 0 : parseFloat(value);
    } else {
      updated[index][field] = value;
    }
    const newTotale = calcolaTotaleEdit({ ...editForm, accessori: updated });
    setEditForm({ ...editForm, accessori: updated, totale: newTotale });
  };

  // Rimuovi accessorio in modifica
  const handleRemoveEditAccessorio = (index) => {
    const updated = editForm.accessori.filter((_, i) => i !== index);
    const newTotale = calcolaTotaleEdit({ ...editForm, accessori: updated });
    setEditForm({ ...editForm, accessori: updated, totale: newTotale });
  };

  // Aggiungi accessorio in modifica
  const handleAddEditAccessorio = () => {
    setEditForm({
      ...editForm,
      accessori: [...editForm.accessori, { nome: '', prezzo: 0, quantita: 1, aliquotaIva: 22 }]
    });
  };

  // Cicla aliquota IVA prodotto in modifica: 22 → 10 → 4 → 22
  const cycleIvaProdotto = (index) => {
    const map = { 22: 10, 10: 4, 4: 22 };
    const updated = [...editForm.prodotti];
    updated[index] = { ...updated[index], aliquotaIva: map[updated[index].aliquotaIva || 22] || 22 };
    setEditForm({ ...editForm, prodotti: updated });
  };

  // Cicla aliquota IVA accessorio in modifica: 22 → 10 → 4 → 22
  const cycleIvaAccessorioEdit = (index) => {
    const map = { 22: 10, 10: 4, 4: 22 };
    const updated = [...editForm.accessori];
    updated[index] = { ...updated[index], aliquotaIva: map[updated[index].aliquotaIva || 22] || 22 };
    setEditForm({ ...editForm, accessori: updated });
  };

  // Stile badge IVA
  const getIvaBadgeStyle = (aliquota) => {
    if (aliquota === 4)  return 'bg-green-100 text-green-700 border-green-300';
    if (aliquota === 10) return 'bg-amber-100 text-amber-700 border-amber-300';
    return 'bg-gray-100 text-gray-500 border-gray-300';
  };

  // Calcolo dettaglio IVA per anteprima nel modal modifica
  const getDettaglioIvaEdit = () => {
    const items = [];
    editForm.prodotti.forEach(p => {
      if (p.prezzo > 0 && !p.isOmaggio) items.push({ importo: parseFloat(p.prezzo) || 0, aliquota: p.aliquotaIva || 22 });
    });
    editForm.accessori.forEach(a => {
      const prezzo = parseFloat(a.prezzo) || 0;
      if (prezzo > 0) items.push({ importo: prezzo * (parseInt(a.quantita) || 1), aliquota: a.aliquotaIva || 22 });
    });
    if (items.length === 0) return null;
    const gruppi = {};
    items.forEach(({ importo, aliquota }) => {
      gruppi[aliquota] = (gruppi[aliquota] || 0) + importo;
    });
    const righe = Object.entries(gruppi).map(([aliq, totale]) => {
      const a = parseFloat(aliq);
      let imponibile, iva;
      if (editForm.ivaCompresa) {
        imponibile = totale / (1 + a / 100);
        iva = totale - imponibile;
      } else {
        imponibile = totale;
        iva = totale * (a / 100);
      }
      return { aliquota: a, totale, imponibile, iva };
    });
    const totImponibile = righe.reduce((s, r) => s + r.imponibile, 0);
    const totIva = righe.reduce((s, r) => s + r.iva, 0);
    return { righe, totImponibile, totIva };
  };

  // Salva modifiche commissione
  const handleSaveEditFull = () => {
    if (!editForm.cliente.trim()) {
      alert('Inserisci il nome del cliente!');
      return;
    }
    const totale = parseFloat(editForm.totale);
    if (isNaN(totale) || (totale <= 0 && editForm.tipoOperazione === 'vendita')) {
      alert('Inserisci un totale valido!');
      return;
    }

    const caparra = editForm.caparra ? parseFloat(editForm.caparra) : null;
    if (caparra && caparra > 0 && !editForm.metodoPagamento) {
      alert('Seleziona il metodo di pagamento della caparra!');
      return;
    }

    // Calcola data aggiornata
    const newDate = new Date(editForm.data + 'T12:00:00').toISOString();
    const dateUpdates = { createdAt: newDate };
    if (editingFullCommissione.status === 'completed') {
      dateUpdates.completedAt = newDate;
    }

    updateCommissione(editingFullCommissione.id, {
      ...dateUpdates,
      cliente: editForm.cliente.trim(),
      telefono: editForm.telefono.trim() || null,
      operatore: editForm.operatore.trim() || null,
      prodotti: editForm.prodotti,
      accessori: editForm.accessori,
      totale: totale,
      caparra: caparra > 0 ? caparra : null,
      metodoPagamento: caparra > 0 ? editForm.metodoPagamento : null,
      note: editForm.note.trim() || null,
      tipoDocumento: editForm.tipoDocumento,
      tipoOperazione: editForm.tipoOperazione || 'vendita',
      ivaCompresa: editForm.ivaCompresa || false
    });

    setEditingFullCommissione(null);
    setEditForm({ data: '', cliente: '', telefono: '', operatore: '', prodotti: [], accessori: [], totale: '', caparra: '', metodoPagamento: '', note: '', tipoDocumento: 'scontrino', tipoOperazione: 'vendita', ivaCompresa: false });
  };

  // Formatta prezzo per visualizzazione
  const formatPrezzo = (prod) => {
    if (prod.isOmaggio) {
      return <span className="text-xs text-green-600 font-medium">OMAGGIO</span>;
    }
    if (prod.prezzo === null || prod.prezzo === undefined || prod.prezzo === 0) {
      return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">KIT</span>;
    }
    return <span className="font-medium">€ {prod.prezzo}</span>;
  };

  // Recupera commissioni mancanti dallo storico
  const handleRecover = async () => {
    if (!confirm('Recuperare le commissioni mancanti dallo storico vendite?')) return;
    setRecovering(true);
    try {
      const count = await recoverMissingCommissioni();
      if (count > 0) {
        alert(`✅ Recuperate ${count} commissioni dallo storico!`);
      } else {
        alert('Nessuna commissione da recuperare — archivio e storico sono allineati.');
      }
    } catch (e) {
      alert('Errore durante il recupero: ' + e.message);
    }
    setRecovering(false);
  };

  // Pulisci duplicati
  const handleCleanDuplicates = async () => {
    if (!confirm('Eliminare le commissioni duplicate (stesso cliente e totale)?')) return;
    setRecovering(true);
    try {
      const count = await cleanDuplicateCommissioni();
      if (count > 0) {
        alert(`🧹 Eliminati ${count} duplicati!`);
      } else {
        alert('Nessun duplicato trovato.');
      }
    } catch (e) {
      alert('Errore: ' + e.message);
    }
    setRecovering(false);
  };

  // Export Excel (SheetJS - .xlsx vero, nessun warning)
  const exportExcel = async () => {
    if (!window.XLSX) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    const XLSX = window.XLSX;
    const comms = filteredCommissioni;

    const headers = [
      'Data', 'Stato', 'Cliente', 'Telefono', 'Operatore',
      'Prodotti', 'Accessori',
      'Totale (IVA incl.)', 'Totale (IVA escl.)',
      'Caparra €', 'Da Saldare €', 'Metodo Pag.', 'Documento', 'Note'
    ];

    let totaleGen = 0;
    let totaleCaparre = 0;

    const rows = comms.map(comm => {
      const prodottiStr = (comm.prodotti || []).map(p => {
        let s = `${p.brand} ${p.model}`;
        if (p.serialNumber) s += ` SN:${p.serialNumber}`;
        if (p.isOmaggio) s += ' [OMAGGIO]';
        else if (p.prezzo) s += ` €${p.prezzo}`;
        return s;
      }).join('; ');

      const accessoriStr = (comm.accessori || []).map(a => {
        const qta = a.quantita || 1;
        const tot = (parseFloat(a.prezzo) || 0) * qta;
        return qta > 1 ? `${a.nome} x${qta} €${tot.toFixed(2)}` : `${a.nome} €${tot.toFixed(2)}`;
      }).join('; ');

      const totaleIvato = comm.totale || 0;
      const totaleEscl = Math.round((totaleIvato / 1.22) * 100) / 100;
      const caparra = comm.caparra || 0;
      const daSaldare = totaleIvato - caparra;
      totaleGen += totaleIvato;
      totaleCaparre += caparra;

      return [
        new Date(comm.createdAt).toLocaleDateString('it-IT'),
        comm.status === 'completed' ? 'Completata' : 'In attesa',
        comm.cliente || '',
        comm.telefono || '',
        comm.operatore || '',
        prodottiStr,
        accessoriStr,
        totaleIvato,
        totaleEscl,
        caparra > 0 ? caparra : '',
        caparra > 0 ? daSaldare : '',
        comm.metodoPagamento ? formatMetodoPagamento(comm.metodoPagamento) : '',
        comm.tipoDocumento === 'fattura' ? 'Fattura' : 'Scontrino',
        comm.note || ''
      ];
    });

    const totaleEsclGen = Math.round((totaleGen / 1.22) * 100) / 100;
    const rigaTotali = ['', '', '', '', '', '', 'TOTALE', totaleGen, totaleEsclGen, totaleCaparre, totaleGen - totaleCaparre, '', '', ''];

    const wsData = [headers, ...rows, rigaTotali];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [
      { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 14 }, { wch: 14 },
      { wch: 40 }, { wch: 30 }, { wch: 16 }, { wch: 16 },
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 30 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Commissioni');

    const periodoLabel = filtroDataDa || filtroDataA ? `_${filtroDataDa || ''}_${filtroDataA || ''}` : '';
    XLSX.writeFile(wb, `commissioni_ompra_${new Date().toISOString().slice(0, 10)}${periodoLabel}.xlsx`);
    setShowExportMenu(false);
  };

  // Export CSV
  const exportCSV = () => {
    const comms = filteredCommissioni;
    const headers = ['Data', 'Stato', 'Cliente', 'Telefono', 'Operatore', 'Prodotti', 'Accessori', 'Totale', 'Caparra', 'Da Saldare', 'Metodo Pag.', 'Documento', 'Note'];
    
    const rows = comms.map(comm => {
      const prodottiStr = (comm.prodotti || []).map(p => `${p.brand} ${p.model}${p.serialNumber ? ' SN:' + p.serialNumber : ''}`).join(' | ');
      const accessoriStr = (comm.accessori || []).map(a => {
        const qta = a.quantita || 1;
        return qta > 1 ? `${a.nome} x${qta}` : a.nome;
      }).join(' | ');
      const caparra = comm.caparra || 0;
      
      return [
        formatDate(comm.createdAt),
        comm.status === 'completed' ? 'Completata' : 'In attesa',
        comm.cliente || '',
        comm.telefono || '',
        comm.operatore || '',
        prodottiStr,
        accessoriStr,
        (comm.totale || 0).toFixed(2),
        caparra > 0 ? caparra.toFixed(2) : '',
        caparra > 0 ? (comm.totale - caparra).toFixed(2) : '',
        comm.metodoPagamento ? formatMetodoPagamento(comm.metodoPagamento) : '',
        comm.tipoDocumento === 'fattura' ? 'Fattura' : 'Scontrino',
        comm.note || ''
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissioni_ompra_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 text-white sticky top-0 z-10" style={{ backgroundColor: '#006B3F' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="mr-3">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Archivio Commissioni</h1>
          </div>
          
          {/* Export */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 rounded-lg bg-white/20"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl py-2 min-w-[160px] z-20">
                <button
                  onClick={exportExcel}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FileDown className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Excel (.xlsx)</div>
                    <div className="text-xs text-gray-500">Per Microsoft Excel</div>
                  </div>
                </button>
                <button
                  onClick={exportCSV}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FileDown className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">CSV</div>
                    <div className="text-xs text-gray-500">Universale</div>
                  </div>
                </button>
                <div className="border-t my-1"></div>
                <button
                  onClick={() => { setShowExportMenu(false); handleRecover(); }}
                  disabled={recovering}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <Download className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-medium">{recovering ? 'Elaborazione...' : 'Recupera da storico'}</div>
                    <div className="text-xs text-gray-500">Importa commissioni mancanti</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowExportMenu(false); handleCleanDuplicates(); }}
                  disabled={recovering}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium">{recovering ? 'Elaborazione...' : 'Pulisci duplicati'}</div>
                    <div className="text-xs text-gray-500">Rimuovi commissioni doppie</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {stats.pending} in attesa
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> {stats.completed} completate
          </span>
        </div>
      </div>

      {/* Filtri */}
      <div className="p-4 bg-white border-b space-y-3">
          {/* Filtro venditore (solo admin) */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Venditore:</span>
              <select
                value={filtroVenditore}
                onChange={e => setFiltroVenditore(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">— Tutti —</option>
                {venditori.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}
          {/* Badge venditore (non admin) */}
          {!isAdmin && operatoreLoggato && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Le tue commissioni:</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{operatoreLoggato}</span>
            </div>
          )}
        {/* Filtro date */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Periodo:</span>
            <input
              type="date"
              value={filtroDataDa}
              onChange={e => setFiltroDataDa(e.target.value)}
              className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-xs text-gray-400">→</span>
            <input
              type="date"
              value={filtroDataA}
              onChange={e => setFiltroDataA(e.target.value)}
              className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {(filtroDataDa || filtroDataA) && (
              <button
                onClick={() => { setFiltroDataDa(''); setFiltroDataA(''); }}
                className="text-xs text-red-400 hover:text-red-600 font-bold px-1"
                title="Cancella filtro date"
              >✕</button>
            )}
            <button
              onClick={() => {
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                setFiltroDataDa(`${y}-${m}-01`);
                const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
                setFiltroDataA(`${y}-${m}-${lastDay}`);
              }}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg whitespace-nowrap hover:bg-green-200"
            >
              Mese
            </button>
          </div>
        {/* Ricerca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca cliente o prodotto..."
            className="w-full pl-10 p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filtro status - RIMOSSO "Tutte", solo In attesa e Chiuse */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${
              filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" /> In attesa ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${
              filterStatus === 'completed' ? 'text-white' : 'bg-gray-100 text-gray-700'
            }`}
            style={filterStatus === 'completed' ? { backgroundColor: '#006B3F' } : {}}
          >
            <CheckCircle className="w-4 h-4" /> Chiuse ({stats.completed})
          </button>
        </div>

        {/* Filtro tipo operazione */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: '', label: 'Tutte', style: 'bg-gray-600' },
            { value: 'vendita', label: '✓ Vendite', style: 'bg-green-600' },
            { value: 'reso', label: '🔄 Resi', style: 'bg-red-600' },
            { value: 'cambio', label: '🔃 Cambi', style: 'bg-orange-500' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { setFiltroTipoOperazione(opt.value); setMostraPreventivi(false); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !mostraPreventivi && filtroTipoOperazione === opt.value
                  ? `${opt.style} text-white`
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => { setMostraPreventivi(true); setFiltroTipoOperazione(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mostraPreventivi ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            📋 Preventivi
          </button>
        </div>
      </div>

      {/* Lista commissioni */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {filteredCommissioni.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nessuna commissione trovata</p>
          </div>
        ) : (
          filteredCommissioni.map((comm) => (
            <div 
              key={comm.id} 
              className="bg-white rounded-lg p-4 border-l-4"
              style={{ borderLeftColor: comm.status === 'pending' ? '#f59e0b' : '#22c55e' }}
            >
              {/* Header commissione */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {comm.status === 'pending' ? (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                        ⏳ In attesa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        ✓ Completata
                      </span>
                    )}
                    {/* Badge tipo documento */}
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      comm.tipoDocumento === 'fattura' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {comm.tipoDocumento === 'fattura' ? '📄 Fattura' : '🧾 Scontrino'}
                    </span>
                    {/* Badge tipo operazione */}
                    {comm.tipoOperazione === 'reso' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        🔄 Reso
                      </span>
                    )}
                    {comm.tipoOperazione === 'cambio' && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        🔃 Cambio
                      </span>
                    )}
                    {/* Badge PRIVACY — visibile finché non confermata */}
                    {comm.privacy_required && !comm.privacy_acknowledged && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-bold animate-pulse">
                        ⚠️ PRIVACY
                      </span>
                    )}
                    {/* Badge PREVENTIVO */}
                    {comm.is_preventivo && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">
                        📋 Preventivo
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-lg mt-1">{comm.cliente}</p>
                  {comm.telefono && (
                    <a 
                      href={`tel:${comm.telefono}`}
                      className="text-xs text-blue-600 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {comm.telefono}
                    </a>
                  )}
                  {getCommIndirizzo(comm) && (
                    <p className="text-xs text-gray-500">📍 {getCommIndirizzo(comm)}</p>
                  )}
                  {getCommEmail(comm) && (
                    <p className="text-xs text-gray-500">📧 {getCommEmail(comm)}</p>
                  )}
                  {comm.operatore && (
                    <p className="text-xs text-gray-500">👷 {comm.operatore}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    📅 {new Date(comm.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    {' '}
                    <span className="font-medium text-gray-700">
                      🕐 {new Date(comm.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: '#006B3F' }}>
                    € {comm.totale?.toFixed(2)}
                  </p>
                  {comm.caparra && (
                    <p className="text-xs text-yellow-600">
                      Caparra: €{comm.caparra.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Prodotti */}
              <div className="space-y-2 mb-3">
                {comm.prodotti?.map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{prod.brand} {prod.model}</span>
                      {prod.serialNumber ? (
                        <span className="text-xs text-gray-500 ml-2 font-mono">SN: {prod.serialNumber}</span>
                      ) : (
                        <span className="text-xs text-yellow-600 ml-2">⚠️ Matricola mancante</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {formatPrezzo(prod)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Accessori */}
              {comm.accessori?.length > 0 && (
                <div className="text-xs text-gray-500 mb-3">
                  Accessori: {comm.accessori.map(a => {
                    const qta = a.quantita || 1;
                    return qta > 1 ? `${a.nome} ×${qta}` : a.nome;
                  }).join(', ')}
                </div>
              )}

              {/* Note */}
              {comm.note && (
                <div className="text-xs text-gray-600 mb-3 p-2 bg-gray-100 rounded">
                  📝 {comm.note}
                </div>
              )}
              
              {/* Azioni con sistema colori */}
              <div className="flex gap-2 pt-2 border-t">
                {/* VERDE OMPRA - Conferma */}
                {comm.status === 'pending' && (
                  <button
                    onClick={() => {
                      if (comm.privacy_required && !comm.privacy_acknowledged) {
                        setPrivacyCommissione({ id: comm.id, cliente: comm.cliente });
                      } else {
                        handleComplete(comm);
                      }
                    }}
                    disabled={comm.prodotti.some(p => richiedeMatricola(p.brand, p.model) && !p.serialNumber)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: '#006B3F' }}
                  >
                    ✓ Completa e Registra
                  </button>
                )}
                
                {/* GIALLO - Modifica (per tutte le commissioni) */}
                <button
                  onClick={() => handleOpenEditFull(comm)}
                  className="py-2 px-3 rounded-lg text-sm font-medium bg-yellow-400 text-yellow-900 flex items-center gap-1 hover:bg-yellow-500"
                >
                  <Edit2 className="w-4 h-4" /> Modifica
                </button>
                
                {/* VERDE CHIARO - Invia/Condividi */}
                <button
                  onClick={() => setSendingCommissione(comm)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <Send className="w-4 h-4" /> Invia
                </button>
                
                {/* GRIGIO - Stampa PDF */}
                <button
                  onClick={() => handlePrintPDF(comm)}
                  className="p-2 text-gray-700 rounded-lg bg-gray-100 hover:bg-gray-200"
                  title="Stampa"
                >
                  <Printer className="w-4 h-4" />
                </button>
                
                {/* BLU - Scarica PDF */}
                <button
                  onClick={() => generatePDF(comm)}
                  className="p-2 text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100"
                  title="Scarica PDF"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                
                {/* ROSSO - Elimina */}
                <button
                  onClick={() => handleDelete(comm.id)}
                  className="p-2 text-red-500 rounded-lg bg-red-50 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input file OCR nascosto */}
      <input
        type="file"
        id="commissione-ocr-input"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Modal Modifica Matricola */}
      {editingCommissione && editingProductIndex !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Aggiungi Matricola</h3>
              <button onClick={() => { setEditingCommissione(null); setNewSerial(''); }}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Prodotto:</p>
              <p className="font-bold">
                {editingCommissione.prodotti[editingProductIndex].brand}{' '}
                {editingCommissione.prodotti[editingProductIndex].model}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600">Matricola</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Inserisci matricola"
                  className="flex-1 p-3 border rounded-lg"
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                />
                {/* BLU - Foto/Scansione */}
                <button
                  onClick={() => document.getElementById('commissione-ocr-input')?.click()}
                  disabled={scanning}
                  className="px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  {scanning ? '...' : <Camera className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* VERDE OMPRA - Salva */}
            <button
              onClick={handleSaveSerial}
              className="w-full py-3 rounded-lg font-bold text-white"
              style={{ backgroundColor: '#006B3F' }}
            >
              Salva Matricola
            </button>
          </div>
        </div>
      )}

      {/* Modal Invia Commissione */}
      {sendingCommissione && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Invia Commissione</h3>
              <button onClick={() => setSendingCommissione(null)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-bold">{sendingCommissione.cliente}</p>
              {sendingCommissione.telefono && (
                <p className="text-sm text-blue-600">📱 {sendingCommissione.telefono}</p>
              )}
              <p className="text-sm text-gray-600">€ {sendingCommissione.totale?.toFixed(2)}</p>
            </div>
            
            <div className="space-y-2">
              {/* VERDE CHIARO - WhatsApp */}
              <button
                onClick={() => handleSendWhatsApp(sendingCommissione)}
                className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </button>
              
              {/* GRIGIO SCURO - Stampa */}
              <button
                onClick={() => handlePrintPDF(sendingCommissione)}
                className="w-full py-3 rounded-lg font-medium text-white bg-gray-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" /> Stampa
              </button>
              
              {/* BLU - Solo PDF */}
              <button
                onClick={() => handleDownloadPDF(sendingCommissione)}
                className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 flex items-center justify-center gap-2"
              >
                <FileDown className="w-5 h-5" /> Scarica PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Anteprima dopo completamento */}
      {previewCommissione && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          {/* Pulsanti condivisione in alto */}
          <div className="fixed top-4 left-4 flex flex-wrap gap-2 z-50 max-w-[70vw]">
            <button
              onClick={() => handleSendWhatsApp(previewCommissione)}
              className="bg-green-500 text-white rounded-full p-3 shadow-lg flex items-center gap-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={() => handlePrintPDF(previewCommissione)}
              className="bg-gray-700 text-white rounded-full p-3 shadow-lg flex items-center gap-1"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs font-medium hidden sm:inline">Stampa</span>
            </button>
            <button
              onClick={() => { generatePDF(previewCommissione); }}
              className="bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center gap-1"
            >
              <FileDown className="w-5 h-5" />
              <span className="text-xs font-medium hidden sm:inline">PDF</span>
            </button>
          </div>
          <button
            onClick={() => setPreviewCommissione(null)}
            className="fixed top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Anteprima Commissione */}
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[85vh] overflow-auto">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-4">
              <h1 className="text-3xl font-bold text-center" style={{ color: '#006B3F' }}>
                OMPRA
              </h1>
              <p className="text-center text-gray-600 text-sm">Commissione di Vendita</p>
              <p className="text-center text-gray-500 text-xs mt-1">
                {formatDate(previewCommissione.createdAt)}
              </p>
            </div>

            {/* Badge completata */}
            <div className="mb-4 p-2 bg-green-100 border border-green-300 rounded-lg text-center">
              <span className="text-green-800 font-medium">✅ Vendita registrata!</span>
            </div>

            {/* Cliente */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#f0f9f4' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-600 uppercase">Cliente</p>
                  <p className="text-xl font-bold" style={{ color: '#006B3F' }}>
                    {previewCommissione.cliente}
                  </p>
                  {previewCommissione.telefono && (
                    <a href={`tel:${previewCommissione.telefono}`} className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {previewCommissione.telefono}
                    </a>
                  )}
                </div>
                {previewCommissione.operatore && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600 uppercase">Operatore</p>
                    <p className="text-sm font-medium text-gray-700">
                      👷 {previewCommissione.operatore}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Prodotti */}
            <div className="mb-4">
              <h2 className="text-sm font-bold mb-2 text-gray-700 uppercase">Articoli</h2>
              <div className="space-y-2">
                {previewCommissione.prodotti?.map((prod, idx) => (
                  <div key={idx} className="p-3 rounded-lg border-l-4 bg-green-50" style={{ borderLeftColor: '#006B3F' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{prod.brand} {prod.model}</p>
                        {prod.tipo && <p className="text-xs text-blue-600">{prod.tipo}</p>}
                        <p className="font-mono text-xs text-gray-600">SN: {prod.serialNumber}</p>
                      </div>
                      {formatPrezzo(prod)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessori */}
            {previewCommissione.accessori?.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 text-gray-700 uppercase">Accessori</h2>
                <div className="space-y-1">
                  {previewCommissione.accessori.map((acc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-800 text-sm">
                        {acc.nome}
                        {(acc.quantita || 1) > 1 && <span className="text-gray-500 ml-1">×{acc.quantita}</span>}
                      </p>
                      <p className="font-semibold">€ {((parseFloat(acc.prezzo) || 0) * (acc.quantita || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totale */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#006B3F' }}>
              <div className="flex justify-between items-center text-white">
                <p className="text-lg font-bold uppercase">Totale</p>
                <p className="text-3xl font-bold">€ {previewCommissione.totale?.toFixed(2)}</p>
              </div>
              
              {previewCommissione.caparra && (
                <div className="mt-3 pt-3 border-t border-white/30">
                  <div className="flex justify-between items-center text-white/90 text-sm">
                    <p>Caparra ({formatMetodoPagamento(previewCommissione.metodoPagamento)})</p>
                    <p className="font-semibold">€ {previewCommissione.caparra.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center text-yellow-300 mt-1">
                    <p className="font-bold">Da saldare</p>
                    <p className="text-xl font-bold">€ {(previewCommissione.totale - previewCommissione.caparra).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            {previewCommissione.note && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 uppercase font-bold mb-1">Note</p>
                <p className="text-gray-800 text-sm">{previewCommissione.note}</p>
              </div>
            )}

            {/* Istruzioni */}
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#e0f2fe' }}>
              <p className="text-sm text-center" style={{ color: '#0369a1' }}>
                Usa i pulsanti in alto per condividere
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Documento non fiscale - Solo per uso interno
              </p>
              <p className="text-xs text-gray-400 mt-1">
                OMPRA Gestionale v1.5
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifica Commissione Completa */}
      {editingFullCommissione && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">✏️ Modifica Commissione</h3>
              <button onClick={() => setEditingFullCommissione(null)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Toggle IVA compresa / esclusa */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tipo prezzi</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setEditForm({ ...editForm, ivaCompresa: false })}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${!editForm.ivaCompresa ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-600'}`}
                  >
                    IVA esclusa
                  </button>
                  <button
                    onClick={() => setEditForm({ ...editForm, ivaCompresa: true })}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${editForm.ivaCompresa ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-600'}`}
                  >
                    IVA compresa
                  </button>
                </div>
                {!editForm.ivaCompresa && <p className="text-xs text-gray-400 mt-1">Prezzi imponibili — IVA calcolata separatamente</p>}
                {editForm.ivaCompresa && <p className="text-xs text-gray-400 mt-1">Prezzi già comprensivi di IVA — verrà applicato lo scorporo</p>}
              </div>

              {/* Data commissione */}
              <div>
                <label className="text-xs font-bold text-gray-500">Data</label>
                <input
                  type="date"
                  className="w-full p-2 border-2 rounded-lg mt-1 font-medium"
                  style={{ borderColor: '#006B3F' }}
                  value={editForm.data}
                  onChange={(e) => setEditForm({ ...editForm, data: e.target.value })}
                />
              </div>

              {/* Dati cliente e operatore */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-500">Cliente</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg mt-1"
                    value={editForm.cliente}
                    onChange={(e) => setEditForm({ ...editForm, cliente: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">Telefono</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded-lg mt-1"
                      value={editForm.telefono}
                      onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                      placeholder="Opzionale"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">Operatore</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg mt-1"
                      value={editForm.operatore}
                      onChange={(e) => setEditForm({ ...editForm, operatore: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Prodotti */}
              <div>
                <label className="text-sm font-bold text-gray-700">Prodotti</label>
                <div className="space-y-2 mt-2">
                  {editForm.prodotti.map((prod, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      {/* Riga 1: brand + model (solo se vuoti = nuova riga) */}
                      {(!prod.brand && !prod.model) ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Brand"
                            className="w-24 p-2 border rounded text-sm"
                            value={prod.brand || ''}
                            onChange={(e) => handleEditProductField(idx, 'brand', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Modello"
                            className="flex-1 p-2 border rounded text-sm"
                            value={prod.model || ''}
                            onChange={(e) => handleEditProductField(idx, 'model', e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{prod.brand} {prod.model}</p>
                          {prod.tipo && <p className="text-xs text-blue-600">{prod.tipo}</p>}
                        </div>
                      )}
                      {/* Riga 2: matricola + prezzo + elimina */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Matricola (SN)"
                          className="flex-1 p-2 border rounded text-sm font-mono"
                          value={prod.serialNumber || ''}
                          onChange={(e) => handleEditProductSerial(idx, e.target.value)}
                        />
                        {(prod.aliquotaIva && prod.aliquotaIva !== 22) && (
                          <span className={`text-xs px-1.5 py-0.5 rounded border font-medium shrink-0 ${prod.aliquotaIva === 4 ? 'bg-green-100 text-green-700 border-green-300' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
                            {prod.aliquotaIva}%
                          </span>
                        )}
                        <input
                          type="number"
                          placeholder="Prezzo"
                          className="w-20 p-2 border rounded text-sm text-right"
                          value={prod.prezzo || ''}
                          onChange={(e) => handleEditProductPrice(idx, e.target.value)}
                        />
                        <button
                          onClick={() => handleRemoveEditProduct(idx)}
                          className="p-1 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddEditProduct}
                    className="text-sm text-blue-600 font-medium"
                  >
                    + Aggiungi prodotto
                  </button>
                </div>
              </div>

              {/* Accessori */}
              <div>
                <label className="text-sm font-bold text-gray-700">Accessori</label>
                <div className="space-y-2 mt-2">
                  {editForm.accessori.map((acc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nome"
                        className="flex-1 p-2 border rounded text-sm"
                        value={acc.nome}
                        onChange={(e) => handleEditAccessorio(idx, 'nome', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Qtà"
                        className="w-14 p-2 border rounded text-sm text-center"
                        min="1"
                        value={acc.quantita || 1}
                        onChange={(e) => handleEditAccessorio(idx, 'quantita', parseInt(e.target.value) || 1)}
                      />
                      <input
                        type="number"
                        placeholder="€"
                        className="w-20 p-2 border rounded text-sm text-right"
                        value={acc.prezzo || ''}
                        onChange={(e) => handleEditAccessorio(idx, 'prezzo', e.target.value)}
                      />
                      <button 
                        onClick={() => handleRemoveEditAccessorio(idx)}
                        className="p-1 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddEditAccessorio}
                    className="text-sm text-blue-600"
                  >
                    + Aggiungi accessorio
                  </button>
                </div>
              </div>

              {/* Totale */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-bold text-gray-700">Totale *</label>
                  <button
                    onClick={() => {
                      const calc = calcolaTotaleEdit(editForm);
                      setEditForm({ ...editForm, totale: calc });
                    }}
                    className="text-xs text-blue-600 underline"
                  >
                    ↻ Ricalcola
                  </button>
                </div>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                  <input
                    type="number"
                    className="w-full p-3 pl-8 border rounded-lg text-lg font-bold"
                    value={editForm.totale}
                    onChange={(e) => setEditForm({ ...editForm, totale: e.target.value })}
                  />
                </div>
                {(() => {
                  const det = getDettaglioIvaEdit();
                  if (!det) return null;
                  return (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">📊 Dettaglio IVA</p>
                      {det.righe.map(r => (
                        <div key={r.aliquota} className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Imponibile {r.aliquota}%</span>
                          <span>€ {r.imponibile.toFixed(2)} <span className="text-gray-400">(IVA € {r.iva.toFixed(2)})</span></span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold text-gray-800 mt-2 pt-2 border-t border-gray-300">
                        <span>Totale imponibile</span>
                        <span>€ {det.totImponibile.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Totale IVA</span>
                        <span>€ {det.totIva.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Caparra */}
              <div>
                <label className="text-sm font-bold text-gray-700">Caparra</label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full p-2 pl-8 border rounded-lg"
                      value={editForm.caparra}
                      onChange={(e) => setEditForm({ ...editForm, caparra: e.target.value })}
                    />
                  </div>
                  <select
                    className="p-2 border rounded-lg"
                    value={editForm.metodoPagamento}
                    onChange={(e) => setEditForm({ ...editForm, metodoPagamento: e.target.value })}
                  >
                    <option value="">Metodo...</option>
                    <option value="contanti">Contanti</option>
                    <option value="carta">Carta</option>
                    <option value="bonifico">Bonifico</option>
                  </select>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-bold text-gray-700">Note</label>
                <textarea
                  className="w-full p-2 border rounded-lg mt-1 text-sm"
                  rows={2}
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                />
              </div>

              {/* Tipo Documento */}
              <div>
                <label className="text-sm font-bold text-gray-700">Tipo documento</label>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setEditForm({ ...editForm, tipoDocumento: 'scontrino' })}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                      editForm.tipoDocumento === 'scontrino'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    🧾 Scontrino
                  </button>
                  <button
                    onClick={() => setEditForm({ ...editForm, tipoDocumento: 'fattura' })}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                      editForm.tipoDocumento === 'fattura'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    📄 Fattura
                  </button>
                </div>
              </div>

              {/* Tipo Operazione */}
              <div>
                <label className="text-sm font-bold text-gray-700">Tipo operazione</label>
                <div className="flex gap-2 mt-2">
                  {[
                    { value: 'vendita', label: '✓ Vendita', active: 'bg-green-600' },
                    { value: 'reso', label: '🔄 Reso', active: 'bg-red-600' },
                    { value: 'cambio', label: '🔃 Cambio', active: 'bg-orange-500' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setEditForm({ ...editForm, tipoOperazione: opt.value })}
                      className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                        editForm.tipoOperazione === opt.value
                          ? `${opt.active} text-white`
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex gap-2">
              <button
                onClick={() => setEditingFullCommissione(null)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveEditFull}
                className="flex-1 py-3 rounded-lg text-white font-bold"
                style={{ backgroundColor: '#006B3F' }}
              >
                Salva Modifiche
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal privacy GDPR bloccante */}
      {privacyCommissione && (
        <PrivacyModal
          commissioneId={privacyCommissione.id}
          nomeCliente={privacyCommissione.cliente}
          onConfirmed={() => {
            // Aggiorna lo stato locale senza ricaricare tutto
            updateCommissione(privacyCommissione.id, { privacy_acknowledged: true });
            setPrivacyCommissione(null);
          }}
        />
      )}

    </div>
  );
}
