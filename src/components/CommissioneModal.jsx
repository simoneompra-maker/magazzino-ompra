import { X, Share2, MessageCircle, Mail, FileDown, ArrowLeft, Check, Phone } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function CommissioneModal({ data, isKit = false, onBack, onConfirm, onClose, isSaving = false }) {
  const isConfirmed = data.confirmed;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString || new Date());
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatta metodo pagamento per visualizzazione
  const formatMetodoPagamento = (metodo) => {
    const metodi = {
      'contanti': 'Contanti',
      'carta': 'Carta',
      'pos': 'POS',
      'bonifico': 'Bonifico'
    };
    return metodi[metodo] || metodo;
  };

  // Calcola totale prodotti
  const getTotaleProdotti = () => {
    if (isKit && data.prodotti) {
      return data.prodotti.reduce((sum, p) => sum + (p.prezzo || 0), 0);
    }
    return data.saleData?.prezzo || data.prezzo || 0;
  };

  // Calcola totale accessori
  const getTotaleAccessori = () => {
    const accessori = isKit ? data.accessori : data.saleData?.accessori;
    if (!accessori || accessori.length === 0) return 0;
    return accessori.reduce((sum, a) => sum + (parseFloat(a.prezzo) || 0), 0);
  };

  // Totale complessivo
  const getTotale = () => {
    if (isKit) {
      return data.totale || (getTotaleProdotti() + getTotaleAccessori());
    }
    return data.saleData?.totale || data.totale || data.prezzo || 0;
  };

  // Calcola da saldare
  const getDaSaldare = () => {
    const totale = getTotale();
    const caparra = data.caparra || 0;
    return totale - caparra;
  };

  // Ottieni cliente
  const getCliente = () => {
    return isKit ? data.cliente : (data.saleData?.cliente || data.cliente);
  };

  // Ottieni telefono
  const getTelefono = () => {
    return data.telefono || null;
  };

  // Ottieni operatore
  const getOperatore = () => {
    return isKit ? data.operatore : (data.saleData?.operatore || data.operatore);
  };

  // Formatta prezzo per testo
  const formatPrezzoText = (prod) => {
    if (prod.isOmaggio) return 'OMAGGIO';
    if (prod.prezzo === null || prod.prezzo === undefined || prod.prezzo === 0) return 'KIT';
    return `€${prod.prezzo.toFixed(2)}`;
  };

  // === CALCOLO SCORPORO IVA ===
  // Raccoglie tutti gli importi con le rispettive aliquote
  const getDettaglioIva = () => {
    const items = [];
    
    // Prodotti
    const prodotti = isKit && data.prodotti ? data.prodotti : [{
      prezzo: getTotaleProdotti(),
      aliquotaIva: data.prodotti?.[0]?.aliquotaIva || 22,
      isOmaggio: false
    }];
    
    prodotti.forEach(p => {
      if (p.isOmaggio || !p.prezzo) return;
      items.push({ importo: p.prezzo, aliquota: p.aliquotaIva || 22 });
    });
    
    // Accessori
    const acc = isKit ? data.accessori : data.saleData?.accessori;
    if (acc) {
      acc.forEach(a => {
        const prezzo = (parseFloat(a.prezzo) || 0) * (a.quantita || 1);
        if (prezzo <= 0) return;
        items.push({ importo: prezzo, aliquota: a.aliquotaIva || 22 });
      });
    }
    
    // Raggruppa per aliquota
    const perAliquota = {};
    items.forEach(({ importo, aliquota }) => {
      if (!perAliquota[aliquota]) perAliquota[aliquota] = 0;
      perAliquota[aliquota] += importo;
    });
    
    // Calcola scorporo
    const righe = Object.entries(perAliquota)
      .sort(([a], [b]) => Number(b) - Number(a)) // 22, 10, 4
      .map(([aliquota, totale]) => {
        const aliq = Number(aliquota);
        let imponibile, iva;
        if (data.ivaCompresa) {
          imponibile = totale / (1 + aliq / 100);
          iva = totale - imponibile;
        } else {
          imponibile = totale;
          iva = totale * (aliq / 100);
        }
        return { aliquota: aliq, totale, imponibile, iva };
      });
    
    const totImponibile = righe.reduce((s, r) => s + r.imponibile, 0);
    const totIva = righe.reduce((s, r) => s + r.iva, 0);
    
    return { righe, totImponibile, totIva };
  };

  // Controlla se ci sono aliquote miste (non solo 22%)
  const hasAliquoteMiste = () => {
    const { righe } = getDettaglioIva();
    return righe.length > 1 || (righe.length === 1 && righe[0].aliquota !== 22);
  };

  // Helper: aggiunge sezione IVA al PDF
  const addIvaToPDF = (doc, margin, pageWidth, yStart) => {
    let y = yStart;
    if (getTotale() <= 0) return y;
    
    const { righe: righeIva, totImponibile, totIva } = getDettaglioIva();
    
    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('DETTAGLIO IVA', margin, y);
    y += 4;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    righeIva.forEach(r => {
      doc.setTextColor(80, 80, 80);
      doc.text(`Imponibile ${r.aliquota}%: € ${r.imponibile.toFixed(2)}`, margin, y);
      doc.setTextColor(130, 130, 130);
      doc.text(`IVA € ${r.iva.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
      y += 4;
    });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Totale imponibile: € ${totImponibile.toFixed(2)}`, margin, y);
    doc.setTextColor(100, 100, 100);
    doc.text(`IVA totale: € ${totIva.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
    y += 3;
    
    return y;
  };

  // Genera PDF - versione minimal bianca per risparmio inchiostro
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 15;

    // Colore header (arancione per preventivo, verde per commissione)
    const headerColor = data.isPreventivo ? [249, 115, 22] : [0, 107, 63];

    // Header semplice con bordo
    doc.setDrawColor(...headerColor);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, pageWidth - 2 * margin, 25);
    
    doc.setTextColor(...headerColor);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('OMPRA', pageWidth / 2, y + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(data.isPreventivo ? 'PREVENTIVO' : 'Commissione di Vendita', pageWidth / 2, y + 17, { align: 'center' });
    doc.text(formatDate(data.saleDate || data.createdAt || new Date()), pageWidth / 2, y + 22, { align: 'center' });

    y += 32;

    // Cliente, Telefono e Operatore con bordino
    const boxHeight = getTelefono() ? 24 : 18;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, pageWidth - 2 * margin, boxHeight);
    
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('CLIENTE', margin + 3, y + 5);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(getCliente(), margin + 3, y + 12);

    // Telefono sotto il nome cliente
    if (getTelefono()) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`Tel: ${getTelefono()}`, margin + 3, y + 18);
    }

    if (getOperatore()) {
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('OPERATORE', pageWidth - margin - 35, y + 5);
      
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(getOperatore(), pageWidth - margin - 35, y + 12);
    }

    y += boxHeight + 5;

    // Badge Tipo Documento
    const tipoDoc = data.tipoDocumento === 'fattura' ? 'FATTURA' : 'SCONTRINO';
    const badgeWidth = 30;
    const badgeX = (pageWidth - badgeWidth) / 2;
    
    if (data.tipoDocumento === 'fattura') {
      doc.setFillColor(219, 234, 254); // bg-blue-100
      doc.setTextColor(30, 64, 175); // text-blue-800
    } else {
      doc.setFillColor(220, 252, 231); // bg-green-100
      doc.setTextColor(22, 101, 52); // text-green-800
    }
    
    doc.roundedRect(badgeX, y, badgeWidth, 7, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(tipoDoc, pageWidth / 2, y + 5, { align: 'center' });
    
    y += 12;

    // Prodotti
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODOTTI', margin, y);
    y += 5;

    const prodotti = isKit && data.prodotti ? data.prodotti : [{
      brand: data.brand,
      model: data.model,
      serialNumber: data.serialNumber,
      prezzo: getTotaleProdotti()
    }];

    prodotti.forEach((prod) => {
      // Riga con bordino sottile
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 12, pageWidth - margin, y + 12);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`${prod.brand} ${prod.model}`, margin, y + 5);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      if (prod.serialNumber) {
        doc.text(`SN: ${prod.serialNumber}`, margin, y + 10);
      } else {
        doc.text('Matricola da inserire', margin, y + 10);
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      if (prod.isOmaggio) {
        doc.text('OMAGGIO', pageWidth - margin, y + 7, { align: 'right' });
      } else if (prod.prezzo === null || prod.prezzo === undefined || prod.prezzo === 0) {
        doc.text('KIT', pageWidth - margin, y + 7, { align: 'right' });
      } else {
        doc.text(`€ ${prod.prezzo.toFixed(2)}`, pageWidth - margin, y + 7, { align: 'right' });
      }

      y += 15;
    });

    // Accessori
    const accessori = isKit ? data.accessori : data.saleData?.accessori;
    if (accessori && accessori.length > 0) {
      y += 3;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('ACCESSORI', margin, y);
      y += 5;

      accessori.forEach((acc) => {
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        const accHeight = acc.matricola ? 13 : 8;
        doc.line(margin, y + accHeight, pageWidth - margin, y + accHeight);

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(acc.nome, margin, y + 5);

        if (acc.matricola) {
          doc.setFontSize(7);
          doc.setTextColor(100, 100, 100);
          doc.text(`SN: ${acc.matricola}`, margin, y + 10);
        }

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(`€ ${parseFloat(acc.prezzo || 0).toFixed(2)}`, pageWidth - margin, y + 5, { align: 'right' });

        y += acc.matricola ? 15 : 10;
      });
    }

    // Sezione Totale con caparra
    y += 8;
    doc.setDrawColor(0, 107, 63);
    doc.setLineWidth(0.5);
    
    // Altezza box dipende se c'è caparra
    const totaleBoxHeight = data.caparra ? 28 : 14;
    doc.rect(margin, y, pageWidth - 2 * margin, totaleBoxHeight);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(data.ivaCompresa ? 'TOTALE (I.C.)' : 'TOTALE', margin + 5, y + 9);

    doc.setFontSize(14);
    doc.text(`€ ${getTotale().toFixed(2)}`, pageWidth - margin - 5, y + 9, { align: 'right' });

    // Se c'è caparra, mostra dettagli
    if (data.caparra) {
      y += 12;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`CAPARRA (${formatMetodoPagamento(data.metodoPagamento)})`, margin + 5, y + 5);
      doc.text(`€ ${data.caparra.toFixed(2)}`, pageWidth - margin - 5, y + 5, { align: 'right' });
      
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 107, 63);
      doc.text('DA SALDARE', margin + 5, y + 5);
      doc.text(`€ ${getDaSaldare().toFixed(2)}`, pageWidth - margin - 5, y + 5, { align: 'right' });
      
      y += 10;
    } else {
      y += totaleBoxHeight;
    }

    // Dettaglio IVA nel PDF
    y = addIvaToPDF(doc, margin, pageWidth, y);

    // Note
    if (data.note) {
      y += 5;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTE:', margin, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      
      // Gestisci note lunghe su più righe
      const noteLines = doc.splitTextToSize(data.note, pageWidth - 2 * margin);
      y += 5;
      noteLines.forEach((line) => {
        doc.text(line, margin, y);
        y += 4;
      });
    }

    // Footer
    y += 10;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    if (data.isPreventivo) {
      doc.setTextColor(249, 115, 22);
      doc.setFontSize(9);
      doc.text('Preventivo valido 30 giorni', pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text('Documento non fiscale - Solo per uso interno', pageWidth / 2, y, { align: 'center' });
    }

    const prefix = data.isPreventivo ? 'Preventivo' : 'Commissione';
    const fileName = `${prefix}_${getCliente().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    
    return { fileName, doc };
  };

  // Genera PDF e restituisce il blob (per condivisione)
  const generatePDFBlob = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 15;

    // Colore header (arancione per preventivo, verde per commissione)
    const headerColor = data.isPreventivo ? [249, 115, 22] : [0, 107, 63];

    // Header semplice con bordo
    doc.setDrawColor(...headerColor);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, pageWidth - 2 * margin, 25);
    
    doc.setTextColor(...headerColor);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('OMPRA', pageWidth / 2, y + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(data.isPreventivo ? 'PREVENTIVO' : 'Commissione di Vendita', pageWidth / 2, y + 17, { align: 'center' });
    doc.text(formatDate(data.saleDate || data.createdAt || new Date()), pageWidth / 2, y + 22, { align: 'center' });

    y += 32;

    // Cliente, Telefono e Operatore
    const boxHeight = getTelefono() ? 24 : 18;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, pageWidth - 2 * margin, boxHeight);
    
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('CLIENTE', margin + 3, y + 5);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(getCliente(), margin + 3, y + 12);

    if (getTelefono()) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`Tel: ${getTelefono()}`, margin + 3, y + 18);
    }

    if (getOperatore()) {
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('OPERATORE', pageWidth - margin - 35, y + 5);
      
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(getOperatore(), pageWidth - margin - 35, y + 12);
    }

    y += boxHeight + 5;

    // Badge Tipo Documento
    const tipoDoc = data.tipoDocumento === 'fattura' ? 'FATTURA' : 'SCONTRINO';
    const badgeWidth = 30;
    const badgeX = (pageWidth - badgeWidth) / 2;
    
    if (data.tipoDocumento === 'fattura') {
      doc.setFillColor(219, 234, 254);
      doc.setTextColor(30, 64, 175);
    } else {
      doc.setFillColor(220, 252, 231);
      doc.setTextColor(22, 101, 52);
    }
    
    doc.roundedRect(badgeX, y, badgeWidth, 7, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(tipoDoc, pageWidth / 2, y + 5, { align: 'center' });
    
    y += 12;

    // Prodotti
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODOTTI', margin, y);
    y += 5;

    const prodotti = isKit && data.prodotti ? data.prodotti : [{
      brand: data.brand,
      model: data.model,
      serialNumber: data.serialNumber,
      prezzo: getTotaleProdotti()
    }];

    prodotti.forEach((prod) => {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 12, pageWidth - margin, y + 12);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`${prod.brand} ${prod.model}`, margin, y + 5);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      if (prod.serialNumber) {
        doc.text(`SN: ${prod.serialNumber}`, margin, y + 10);
      } else {
        doc.text('Matricola da inserire', margin, y + 10);
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      if (prod.isOmaggio) {
        doc.text('OMAGGIO', pageWidth - margin, y + 7, { align: 'right' });
      } else if (prod.prezzo === null || prod.prezzo === undefined || prod.prezzo === 0) {
        doc.text('KIT', pageWidth - margin, y + 7, { align: 'right' });
      } else {
        doc.text(`€ ${prod.prezzo.toFixed(2)}`, pageWidth - margin, y + 7, { align: 'right' });
      }

      y += 15;
    });

    // Accessori
    const accessoriPDF = isKit ? data.accessori : data.saleData?.accessori;
    if (accessoriPDF && accessoriPDF.length > 0) {
      y += 3;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('ACCESSORI', margin, y);
      y += 5;

      accessoriPDF.forEach((acc) => {
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        const accHeight = acc.matricola ? 13 : 8;
        doc.line(margin, y + accHeight, pageWidth - margin, y + accHeight);

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(acc.nome, margin, y + 5);

        if (acc.matricola) {
          doc.setFontSize(7);
          doc.setTextColor(100, 100, 100);
          doc.text(`SN: ${acc.matricola}`, margin, y + 10);
        }

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(`€ ${parseFloat(acc.prezzo || 0).toFixed(2)}`, pageWidth - margin, y + 5, { align: 'right' });

        y += acc.matricola ? 15 : 10;
      });
    }

    // Sezione Totale con caparra
    y += 8;
    doc.setDrawColor(0, 107, 63);
    doc.setLineWidth(0.5);
    
    const totaleBoxHeight = data.caparra ? 28 : 14;
    doc.rect(margin, y, pageWidth - 2 * margin, totaleBoxHeight);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(data.ivaCompresa ? 'TOTALE (I.C.)' : 'TOTALE', margin + 5, y + 9);

    doc.setFontSize(14);
    doc.text(`€ ${getTotale().toFixed(2)}`, pageWidth - margin - 5, y + 9, { align: 'right' });

    if (data.caparra) {
      y += 12;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`CAPARRA (${formatMetodoPagamento(data.metodoPagamento)})`, margin + 5, y + 5);
      doc.text(`€ ${data.caparra.toFixed(2)}`, pageWidth - margin - 5, y + 5, { align: 'right' });
      
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 107, 63);
      doc.text('DA SALDARE', margin + 5, y + 5);
      doc.text(`€ ${getDaSaldare().toFixed(2)}`, pageWidth - margin - 5, y + 5, { align: 'right' });
      
      y += 10;
    } else {
      y += totaleBoxHeight;
    }

    // Dettaglio IVA nel PDF
    y = addIvaToPDF(doc, margin, pageWidth, y);

    // Note
    if (data.note) {
      y += 5;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTE:', margin, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      
      const noteLines = doc.splitTextToSize(data.note, pageWidth - 2 * margin);
      y += 5;
      noteLines.forEach((line) => {
        doc.text(line, margin, y);
        y += 4;
      });
    }

    // Footer
    y += 10;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    if (data.isPreventivo) {
      doc.setTextColor(249, 115, 22);
      doc.setFontSize(9);
      doc.text('Preventivo valido 30 giorni', pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text('Documento non fiscale - Solo per uso interno', pageWidth / 2, y, { align: 'center' });
    }

    const prefix = data.isPreventivo ? 'Preventivo' : 'Commissione';
    const fileName = `${prefix}_${getCliente().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    const blob = doc.output('blob');
    
    return { blob, fileName };
  };

  // Condividi PDF direttamente (come WhatsApp)
  const sharePDF = async () => {
    try {
      const { blob, fileName } = generatePDFBlob();
      const file = new File([blob], fileName, { type: 'application/pdf' });
      
      const title = data.isPreventivo ? 'Preventivo OMPRA' : 'Commissione OMPRA';
      const text = data.isPreventivo 
        ? `Preventivo per ${getCliente()}`
        : `Commissione per ${getCliente()}`;
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: text
        });
      } else {
        // Fallback: scarica il PDF
        generatePDF();
      }
    } catch (err) {
      console.log('Errore condivisione PDF:', err);
      // Fallback: scarica il PDF
      generatePDF();
    }
  };

  // Condividi via WhatsApp
  const shareWhatsApp = () => {
    let text = `📋 *COMMISSIONE OMPRA*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *Cliente:* ${getCliente()}\n`;
    if (getTelefono()) {
      text += `📱 *Tel:* ${getTelefono()}\n`;
    }
    if (getOperatore()) {
      text += `👷 *Operatore:* ${getOperatore()}\n`;
    }
    // Tipo documento
    text += `🧾 *Documento:* ${data.tipoDocumento === 'fattura' ? 'FATTURA' : 'SCONTRINO'}\n`;
    text += `📅 ${formatDate(new Date())}\n\n`;
    text += `📦 *PRODOTTI:*\n`;
    
    if (isKit && data.prodotti) {
      data.prodotti.forEach((p, idx) => {
        text += `${idx + 1}. ${p.brand} ${p.model}\n`;
        if (p.serialNumber) {
          text += `   SN: ${p.serialNumber}\n`;
        }
        text += `   Prezzo: ${formatPrezzoText(p)}\n`;
      });
    } else {
      text += `• ${data.brand} ${data.model}\n`;
      text += `  SN: ${data.serialNumber}\n`;
      text += `  € ${getTotaleProdotti().toFixed(2)}\n`;
    }
    
    const accessori = isKit ? data.accessori : data.saleData?.accessori;
    if (accessori && accessori.length > 0) {
      text += `\n🔧 *ACCESSORI:*\n`;
      accessori.forEach(a => {
        text += `• ${a.nome} - €${parseFloat(a.prezzo || 0).toFixed(2)}\n`;
      });
    }
    
    text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *TOTALE${data.ivaCompresa ? ' (I.C.)' : ''}: €${getTotale().toFixed(2)}*`;
    
    // Dettaglio IVA
    const { righe: righeIva, totImponibile, totIva } = getDettaglioIva();
    if (getTotale() > 0) {
      text += `\n\n📊 *Dettaglio IVA:*`;
      righeIva.forEach(r => {
        text += `\nImponibile ${r.aliquota}%: €${r.imponibile.toFixed(2)} (IVA €${r.iva.toFixed(2)})`;
      });
      text += `\n*Totale imponibile: €${totImponibile.toFixed(2)}*`;
    }
    
    // Aggiungi caparra se presente
    if (data.caparra) {
      text += `\n\n💳 *CAPARRA: €${data.caparra.toFixed(2)}* (${formatMetodoPagamento(data.metodoPagamento)})`;
      text += `\n📌 *DA SALDARE: €${getDaSaldare().toFixed(2)}*`;
    }
    
    // Aggiungi note se presenti
    if (data.note) {
      text += `\n\n📝 *Note:* ${data.note}`;
    }
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Scarica PDF e apri Gmail
  const shareGmailWithPDF = () => {
    generatePDF();
    
    setTimeout(() => {
      const subject = `Commissione OMPRA - ${getCliente()} - ${formatDate(new Date())}`;
      let body = `Buongiorno,\n\nin allegato la commissione di vendita.\n\nCliente: ${getCliente()}`;
      
      if (getTelefono()) {
        body += `\nTelefono: ${getTelefono()}`;
      }
      
      body += `\nTotale: € ${getTotale().toFixed(2)}`;
      
      if (data.caparra) {
        body += `\nCaparra versata: € ${data.caparra.toFixed(2)} (${formatMetodoPagamento(data.metodoPagamento)})`;
        body += `\nDa saldare: € ${getDaSaldare().toFixed(2)}`;
      }
      
      if (data.note) {
        body += `\n\nNote: ${data.note}`;
      }
      
      body += `\n\nCordiali saluti`;
      
      const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(url, '_blank');
    }, 500);
  };

  // Condividi generico
  const shareGeneric = async () => {
    if (navigator.share) {
      try {
        let text = `OMPRA - Commissione Vendita\n`;
        text += `Cliente: ${getCliente()}\n`;
        if (getTelefono()) {
          text += `Tel: ${getTelefono()}\n`;
        }
        if (getOperatore()) {
          text += `Operatore: ${getOperatore()}\n`;
        }
        text += `Totale: € ${getTotale().toFixed(2)}`;
        
        if (data.caparra) {
          text += `\nCaparra: € ${data.caparra.toFixed(2)}`;
          text += `\nDa saldare: € ${getDaSaldare().toFixed(2)}`;
        }
        
        await navigator.share({
          title: 'Commissione OMPRA',
          text: text
        });
      } catch (err) {
        console.log('Errore condivisione:', err);
      }
    }
  };

  const accessori = isKit ? data.accessori : data.saleData?.accessori;

  // Formatta prezzo per visualizzazione
  const formatPrezzoDisplay = (prod) => {
    if (prod.isOmaggio) {
      return <span className="text-sm text-green-600 font-medium">OMAGGIO</span>;
    }
    if (prod.prezzo === null || prod.prezzo === undefined || prod.prezzo === 0) {
      return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">KIT</span>;
    }
    return <span className="text-lg font-bold">€ {prod.prezzo.toFixed(2)}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      
      {/* Header con pulsanti */}
      {!isConfirmed ? (
        // ANTEPRIMA: Modifica e Conferma
        <>
          <button
            onClick={onBack}
            className="fixed top-4 left-4 bg-gray-600 text-white rounded-full p-3 shadow-lg z-50 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Modifica</span>
          </button>
          <button
            onClick={onClose}
            className="fixed top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg z-50"
          >
            <X className="w-6 h-6" />
          </button>
        </>
      ) : (
        // CONFERMATA: Pulsante condivisione
        <>
          <button
            onClick={sharePDF}
            className="fixed top-4 left-4 bg-green-500 text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 z-50"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-bold">Condividi</span>
          </button>
          <button
            onClick={onClose}
            className="fixed top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg z-50"
          >
            <X className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Container per Foglio + Pulsante */}
      <div className="flex flex-col max-h-[95vh] w-full max-w-md">
        {/* Foglio Commissione */}
        <div 
          className="bg-white rounded-lg shadow-2xl p-6 overflow-auto flex-1"
          style={{ touchAction: 'pinch-zoom' }}
        >
        {/* Badge anteprima */}
        {!isConfirmed && (
          <div className={`mb-4 p-2 rounded-lg text-center border ${
            data.isPreventivo 
              ? 'bg-orange-100 border-orange-300' 
              : 'bg-blue-100 border-blue-300'
          }`}>
            <span className={`font-medium ${data.isPreventivo ? 'text-orange-800' : 'text-blue-800'}`}>
              {data.isPreventivo ? '📝 Anteprima Preventivo' : '👁️ Anteprima - Controlla i dati'}
            </span>
          </div>
        )}

        {/* Header OMPRA */}
        <div className="border-b-2 border-gray-800 pb-4 mb-4">
          <h1 
            className="text-3xl font-bold text-center"
            style={{ color: data.isPreventivo ? '#F97316' : '#006B3F' }}
          >
            OMPRA
          </h1>
          <p className="text-center text-gray-600 text-sm">
            {data.isPreventivo ? 'PREVENTIVO' : 'Commissione di Vendita'}
          </p>
          <p className="text-center text-gray-500 text-xs mt-1">
            {formatDate(data.saleDate || data.createdAt || new Date().toISOString())}
          </p>
        </div>

        {/* Cliente e Operatore */}
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#f0f9f4' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Cliente</p>
              <p className="text-xl font-bold" style={{ color: '#006B3F' }}>
                {getCliente()}
              </p>
              {getTelefono() && (
                <a 
                  href={`tel:${getTelefono()}`}
                  className="text-sm text-blue-600 flex items-center gap-1 mt-1"
                >
                  <Phone className="w-3 h-3" />
                  {getTelefono()}
                </a>
              )}
            </div>
            {getOperatore() && (
              <div className="text-right">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Operatore</p>
                <p className="text-sm font-medium text-gray-700">
                  👷 {getOperatore()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Badge se in attesa */}
        {data.isPending && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
            <span className="text-yellow-800 font-medium">⏳ In attesa di consegna</span>
          </div>
        )}

        {/* Badge Tipo Documento (nascosto se preventivo) */}
        {!data.isPreventivo && (
          <div className="mb-4 flex justify-center">
            <span 
              className={`px-4 py-2 rounded-full font-bold text-sm ${
                data.tipoDocumento === 'fattura' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}
            >
              {data.tipoDocumento === 'fattura' ? '📄 FATTURA' : '🧾 SCONTRINO'}
            </span>
          </div>
        )}

        {/* Prodotti */}
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-700 uppercase">
            {isKit && data.prodotti?.length > 1 ? 'Articoli' : 'Articolo'}
          </h2>
          
          {isKit && data.prodotti ? (
            <div className="space-y-2">
              {data.prodotti.map((prod, index) => (
                <div 
                  key={prod.id || index} 
                  className="p-3 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: prod.isOmaggio ? '#ecfdf5' : '#fffbeb', 
                    borderLeftColor: prod.isOmaggio ? '#10b981' : (prod.isOrdered ? '#f59e0b' : '#006B3F')
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold">{prod.brand} {prod.model}</p>
                      {prod.serialNumber ? (
                        <p className="font-mono text-xs text-gray-600">SN: {prod.serialNumber}</p>
                      ) : (
                        <p className="text-xs text-yellow-600">⚠️ Matricola da inserire</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {(prod.aliquotaIva && prod.aliquotaIva !== 22) && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          prod.aliquotaIva === 4 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {prod.aliquotaIva}%
                        </span>
                      )}
                      {formatPrezzoDisplay(prod)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="p-3 rounded-lg border-l-4"
              style={{ backgroundColor: '#fffbeb', borderLeftColor: '#f59e0b' }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold">{data.brand} {data.model}</p>
                  <p className="font-mono text-xs text-gray-600">SN: {data.serialNumber}</p>
                </div>
                <p className="text-lg font-bold">€ {getTotaleProdotti().toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Accessori */}
        {accessori && accessori.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold mb-2 text-gray-700 uppercase">Accessori</h2>
            <div className="space-y-1">
              {accessori.map((acc, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm">{acc.nome}</p>
                    {acc.matricola && (
                      <p className="text-xs text-gray-500 font-mono">SN: {acc.matricola}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {(acc.aliquotaIva && acc.aliquotaIva !== 22) && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        acc.aliquotaIva === 4 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {acc.aliquotaIva}%
                      </span>
                    )}
                    <p className="font-semibold shrink-0 ml-1">€ {parseFloat(acc.prezzo || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Totale */}
        <div 
          className="p-4 rounded-lg mt-4"
          style={{ backgroundColor: '#006B3F' }}
        >
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold uppercase">Totale</p>
              {data.ivaCompresa && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">I.C.</span>
              )}
            </div>
            <p className="text-3xl font-bold">€ {getTotale().toFixed(2)}</p>
          </div>
          
          {/* Caparra e Da saldare */}
          {data.caparra && (
            <div className="mt-3 pt-3 border-t border-white/30">
              <div className="flex justify-between items-center text-white/90 text-sm">
                <p>Caparra ({formatMetodoPagamento(data.metodoPagamento)})</p>
                <p className="font-semibold">€ {data.caparra.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center text-yellow-300 mt-1">
                <p className="font-bold">Da saldare</p>
                <p className="text-xl font-bold">€ {getDaSaldare().toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Dettaglio IVA / Scorporo */}
        {getTotale() > 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">📊 Dettaglio IVA</p>
            {(() => {
              const { righe, totImponibile, totIva } = getDettaglioIva();
              return (
                <>
                  {righe.map(r => (
                    <div key={r.aliquota} className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Imponibile {r.aliquota}%</span>
                      <span>€ {r.imponibile.toFixed(2)} <span className="text-gray-400">(IVA € {r.iva.toFixed(2)})</span></span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold text-gray-800 mt-2 pt-2 border-t border-gray-300">
                    <span>Totale imponibile</span>
                    <span>€ {totImponibile.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Totale IVA</span>
                    <span>€ {totIva.toFixed(2)}</span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Note */}
        {data.note && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 uppercase font-bold mb-1">Note</p>
            <p className="text-gray-800 text-sm">{data.note}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          {data.isPreventivo ? (
            <>
              <p className="text-sm text-orange-600 font-medium">
                📝 Preventivo valido 30 giorni
              </p>
              <p className="text-xs text-gray-400 mt-1">
                OMPRA Gestionale
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500">
                Documento non fiscale - Solo per uso interno
              </p>
              <p className="text-xs text-gray-400 mt-1">
                OMPRA Gestionale v1.5
              </p>
            </>
          )}
        </div>

        {/* Istruzioni (solo dopo conferma) */}
        {isConfirmed && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: data.isPreventivo ? '#fff7ed' : '#e0f2fe' }}>
            <p className="text-sm text-center" style={{ color: data.isPreventivo ? '#c2410c' : '#0369a1' }}>
              {data.isPreventivo 
                ? '📝 Preventivo pronto! Usa il pulsante in alto per condividere'
                : '✅ Vendita registrata! Usa i pulsanti in alto per condividere'}
            </p>
          </div>
        )}
      </div>

      {/* Pulsante Conferma sotto il foglio (solo in anteprima) */}
      {!isConfirmed && (
        <button
          onClick={onConfirm}
          disabled={isSaving}
          className={`mt-4 w-full py-4 rounded-lg font-bold text-lg text-white flex items-center justify-center gap-2 shadow-lg flex-shrink-0 ${isSaving ? 'opacity-50' : ''}`}
          style={{ backgroundColor: data.isPreventivo ? '#F97316' : '#006B3F' }}
        >
          {isSaving ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Salvataggio...
            </>
          ) : (
            <>
              <Check className="w-6 h-6" />
              {data.isPreventivo 
                ? 'GENERA PREVENTIVO' 
                : data.isPending 
                  ? 'CONFERMA COMMISSIONE' 
                  : 'CONFERMA VENDITA'}
            </>
          )}
        </button>
      )}
      </div>
    </div>
  );
}
