/**
 * Catalogo articoli impianti antizanzare.
 *
 * ESTRATTO 1:1 da Calcolatore_Impianto_Antizanzare.html (righe 270-490).
 * Non modificare a mano se non per aggiornare prezzi/codici: la corrispondenza
 * con il calcolatore originale e' cio' che garantisce che i preventivi tornino.
 *
 * priceRaw = prezzo di listino come da foglio "Anagrafica"
 * costRaw  = costo reale (solo Geyser); null = costo calcolato come listino - sconto
 * div      = metri per rotolo o pezzi per confezione (1 = sfuso)
 * kind     = 'd' portaugello dritto | 'a' portaugello angolato (90/135/45)
 */

export const C = {
  brands: {
    geyser:     {label:"Geyser", netCost:false, disc:0,  sys:"geyser"},
    pro:        {label:"Zanzero PRO (1/4\")", netCost:true, disc:30, sys:"pro"},
    smart:      {label:"Zanzero SMART (1/4\")", netCost:true, disc:30, sys:"smart"},
    gardheaven: {label:"Gardheaven", netCost:true, disc:50, sys:"gardheaven"},
  },
  machines: {
    geyser: [
      {code:"415", label:"Geyser Pro (240 m)",      priceRaw:1331.97, costRaw:975,    perLine:60, lines:1},
      {code:"446", label:"Geyser Pro Dual (2×240 m)", priceRaw:1456.56, costRaw:1066.2, perLine:60, lines:2},
      {code:"436", label:"Geyser Pro Lite (100 m)", priceRaw:963.93,  costRaw:705.6,  perLine:25, lines:1},
    ],
    pro: [
      {code:"ZA100", label:"ZA100 Basic",  priceRaw:959.02,  costRaw:null, perLine:35,  lines:1},
      {code:"ZA150", label:"ZA150 Basic",  priceRaw:1000,    costRaw:null, perLine:50,  lines:1},
      {code:"ZA200", label:"ZA200 Basic",  priceRaw:1040.98, costRaw:null, perLine:70,  lines:1},
      {code:"ZA350", label:"ZA350 Basic",  priceRaw:1131.15, costRaw:null, perLine:120, lines:1},
      {code:"ZA100WIFI", label:"ZA100 Advance WiFi", priceRaw:1147.54, costRaw:null, perLine:35,  lines:1},
      {code:"ZA150WIFI", label:"ZA150 Advance WiFi", priceRaw:1188.52, costRaw:null, perLine:50,  lines:1},
      {code:"ZA200WIFI", label:"ZA200 Advance WiFi", priceRaw:1229.51, costRaw:null, perLine:70,  lines:1},
      {code:"ZA350WIFI", label:"ZA350 Advance WiFi", priceRaw:1311.48, costRaw:null, perLine:120, lines:1},
      {code:"ZA100DUAL", label:"ZA100 Dual", priceRaw:1475.41, costRaw:null, perLine:35,  lines:2},
      {code:"ZA150DUAL", label:"ZA150 Dual", priceRaw:1557.38, costRaw:null, perLine:50,  lines:2},
      {code:"ZA200DUAL", label:"ZA200 Dual", priceRaw:1639.34, costRaw:null, perLine:70,  lines:2},
      {code:"ZA350DUAL", label:"ZA350 Dual", priceRaw:1721.31, costRaw:null, perLine:120, lines:2},
      {code:"ZA150P.DUAL.PLUS", label:"ZA150 Premium 2 linee", priceRaw:2250, costRaw:null, perLine:50, lines:2},
    ],
    smart: [
      {code:"ZA10",      label:"ZA10 (kit 10 ug.)",  priceRaw:1022.13, costRaw:null, perLine:10, lines:1},
      {code:"ZA18",      label:"ZA18 (kit 20 ug.)",  priceRaw:1235.25, costRaw:null, perLine:20, lines:1},
      {code:"ZA18SD.LT", label:"ZA18 SD 2 prod. 1 uscita", priceRaw:1533.61, costRaw:null, perLine:20, lines:1},
      {code:"ZA18 SD",   label:"ZA18 SD 2 prod. 2 uscite", priceRaw:1704.1, costRaw:null, perLine:20, lines:2},
      {code:"ZA10 SLIM", label:"ZA10 Slim",          priceRaw:690, costRaw:null, perLine:10, lines:1},
    ],
    gardheaven: [
      {code:"Comfort01", label:"Comfort 01 — 1 linea", priceRaw:3300, costRaw:null, perLine:150, lines:1},
      {code:"Comfort02", label:"Comfort 02 Dual — 2 linee (150 ug./linea)",     priceRaw:3740, costRaw:null, perLine:150, lines:2},
      {code:"Hobby01",   label:"Hobby 1 — 2 linee 64 ug. (app)",  priceRaw:1199, costRaw:null, perLine:32, lines:2},
      {code:"Hobby02",   label:"Hobby 2 — 1 linea 32 ug. (app)",  priceRaw:1149, costRaw:null, perLine:32, lines:1},
      {code:"Hobby03",   label:"Hobby 3 — 2 linee 64 ug. (manuale)", priceRaw:1149, costRaw:null, perLine:32, lines:2},
      {code:"Hobby04",   label:"Hobby 4 — 1 linea 32 ug. (manuale)", priceRaw:1099, costRaw:null, perLine:32, lines:1},
      {code:"Hobby05",   label:"Hobby 5 — 2 linee 64 ug. (app)",  priceRaw:1350, costRaw:null, perLine:32, lines:2},
    ],
  },
  sys: {
    geyser: {
      tubo:[
        {code:"4213", label:"Ø6 nero 100 m",    priceRaw:44.10, costRaw:32.28, div:100},
        {code:"4224", label:"Ø6 marrone 100 m", priceRaw:47.38, costRaw:34.68, div:100},
        {code:"4223", label:"Ø6 bianco 100 m",  priceRaw:48.11, costRaw:35.22, div:100},
        {code:"4248", label:"Ø8 nero 100 m",    priceRaw:75.66, costRaw:55.38, div:100},
        {code:"4271", label:"Ø8 nero 25 m",     priceRaw:19.80, costRaw:14.49, div:25},
      ],
      ugello:[
        // portataLmin = dato DICHIARATO da Stocker, non calcolato
        {code:"4219", label:"Anti-gocc. standard", priceRaw:2.75, costRaw:2.01, div:1, foroMm:0.3, portataLmin:0.04},
        {code:"4253", label:"Anti-gocc. 135°",     priceRaw:4.75, costRaw:3.48, div:1, foroMm:0.3, portataLmin:0.04},
      ],
      porta:[
        {code:"4236", label:"Dritto Ø6 (sfuso)", priceRaw:0.78, costRaw:0.57, div:1, kind:"d"},
        {code:"4207", label:"Dritto Ø6 (conf. 5 pz)", priceRaw:4.80, costRaw:3.51, div:5, kind:"d"},
        {code:"4220", label:"90° Ø6",    priceRaw:0.70, costRaw:0.51, div:1, kind:"a"},
        {code:"4238", label:"135° Ø6",   priceRaw:1.56, costRaw:1.14, div:1, kind:"a"},
      ],
      tsel:[
        {code:"4222", label:"T Ø6",           priceRaw:0.86, costRaw:0.63, div:1},
        {code:"4245", label:"T Ø8-6-8 riduz.", priceRaw:1.15, costRaw:0.84, div:1},
        {code:"4240", label:"T Ø8",            priceRaw:1.15, costRaw:0.84, div:1},
      ],
      /* Il calcolatore originale usava come tappo l'art. 4207, che e'
         invece un raccordo dritto: serve a giuntare due spezzoni di tubo
         o come portaugello dritto. Il tappo e' il 4215.
         In cantiere 4215 + 4207 insieme fanno una chiusura di fine linea:
         se serve come voce unica si aggiungera' piu' avanti. */
      tappo:{code:"4215", label:"Tappo chiusura Ø6 (conf. 5 pz)", priceRaw:3.65, costRaw:2.67, div:5},
      // Il T Ø8-6-8 riduce da solo: nessun raccordo di riduzione separato
      riduzioni:[],
      inline:null,
      accessori:[
        {code:"4258", label:"Valvola non ritorno Ø6 (sfuso)", priceRaw:2.5,  costRaw:1.83, div:1},
        {code:"4259", label:"Valvola non ritorno Ø8 (sfuso)", priceRaw:5.45, costRaw:3.99, div:1},
        {code:"4269", label:"Filtro entrata acqua Ø8", priceRaw:18.32, costRaw:13.41, div:1},
        {code:"4267", label:"Raccordo rapido rubinetto Ø8", priceRaw:11.76, costRaw:8.61, div:1},
        {code:"4268", label:"Raccordo rapido valvola entrata Ø8", priceRaw:5.74, costRaw:4.2, div:1},
        {code:"4221", label:"Kit direzionamento ugelli 19 cm", priceRaw:5.74, costRaw:4.2, div:1},
        {code:"4263", label:"Kit direzionamento ugelli 50 cm", priceRaw:12.25, costRaw:8.97, div:1},
        {code:"4262", label:"Staffa montante a L (2 pz)", priceRaw:36.23, costRaw:26.52, div:1},
        {code:"444",  label:"Cappuccio protettivo Geyser Pro", priceRaw:15.78, costRaw:11.55, div:1},
        {code:"4205", label:"Asta prolungamento 40 cm (5 pz)", priceRaw:9.47, costRaw:6.93, div:1},
        {code:"4237", label:"Asta prolungamento 40 cm (sfuso)", priceRaw:0.53, costRaw:0.39, div:1},
        {code:"4218", label:"Raccordo 135° Ø6", priceRaw:8.77, costRaw:6.42, div:1},
        {code:"4207", label:"Raccordo dritto Ø6 giuntatubo (conf. 5 pz)", priceRaw:4.80, costRaw:3.51, div:5},
        {code:"4239", label:"Raccordo 90° Ø8 (sfuso)",   priceRaw:0.78, costRaw:0.57, div:1},
        {code:"4243", label:"Raccordo 90° Ø6-8 (sfuso)", priceRaw:0.94, costRaw:0.69, div:1},
        {code:"4241", label:"Raccordo dritto Ø8 (sfuso)",   priceRaw:0.74, costRaw:0.54, div:1},
        {code:"4244", label:"Raccordo dritto Ø6-8 (sfuso)", priceRaw:0.82, costRaw:0.60, div:1},
        {code:"4261", label:"Valvola non ritorno Ø8 (5 pz)", priceRaw:29.55, costRaw:21.63, div:1},
        {code:"4246", label:"Fissatubo a P Ø6 (sfuso)", priceRaw:0.45, costRaw:0.33, div:1},
        {code:"4250", label:"Fissatubo a P Ø8 (sfuso)", priceRaw:0.53, costRaw:0.39, div:1},
        {code:"4247", label:"Fissatubo a U Ø6 (sfuso)", priceRaw:0.53, costRaw:0.39, div:1},
        {code:"4251", label:"Fissatubo a U Ø8 (sfuso)", priceRaw:0.53, costRaw:0.39, div:1},
        {code:"4214", label:"Fermatubo Ø6 (10 pz)", priceRaw:1.35, costRaw:0.99, div:1},
        {code:"4216", label:"Picchetti fissatubo 20 cm (10 pz)", priceRaw:3.28, costRaw:2.4, div:1},
        {code:"4217", label:"Fascette 30 cm (10 pz)", priceRaw:1.19, costRaw:0.87, div:1},
        {code:"4270", label:"Fascette 30 cm (100 pz)", priceRaw:9.02, costRaw:6.6, div:1},
        {code:"4264", label:"Kit Geyser Pro 100 m Ø6-8", priceRaw:140.98, costRaw:103.2, div:1},
        {code:"4265", label:"Kit Geyser Pro 150 m Ø6-8", priceRaw:184.43, costRaw:135, div:1},
        {code:"4266", label:"Kit Geyser Pro 240 m Ø6-8", priceRaw:300.82, costRaw:220.2, div:1},
      ],
    },
    pro: {
      tubo:[
        {code:"AI14100N", label:"Tubo 1/4\" nero (m)",   priceRaw:1.0,  costRaw:null, div:1},
        {code:"AI14100V", label:"Tubo 1/4\" verde (m)",  priceRaw:1.04, costRaw:null, div:1},
        {code:"AI38100N", label:"Tubo 3/8\" nero (m)",   priceRaw:3.95, costRaw:null, div:1},
        {code:"AI38100T", label:"Tubo 3/8\" aspirazione acqua (m)", priceRaw:2.9, costRaw:null, div:1},
      ],
      ugello:[
        {code:"AI040302", label:"Ugello standard",   priceRaw:5.1, costRaw:null, div:1, foroMm:0.3},
        {code:"AI040303", label:"Ugello antigoccia 0.4", priceRaw:5.3, costRaw:null, div:1, foroMm:0.4},
      ],
      porta:[
        {code:"AI529014", label:"Portaugello 1/4\" dritto", priceRaw:4.47, costRaw:null, div:1, kind:"d"},
        {code:"AI510014", label:"Portaugello dritto econ.", priceRaw:2.5,  costRaw:null, div:1, kind:"d"},
        {code:"AI519014", label:"Portaugello 1/4\" 90°",    priceRaw:4.3,  costRaw:null, div:1, kind:"a"},
        {code:"AI514514", label:"Portaugello 45°",          priceRaw:2.91, costRaw:null, div:1, kind:"a"},
      ],
      tsel:[
        {code:"AI191414", label:"Raccordo T 1/4\"", priceRaw:5.75, costRaw:null, div:1},
        {code:"AI193838", label:"Raccordo T 3/8\"", priceRaw:10.5, costRaw:null, div:1},
      ],
      tappo:{code:"AI300014", label:"Tappo fine linea 1/4\"", priceRaw:2.5, costRaw:null, div:1},
      tappoExtra:[
        {code:"AI300038", label:"Tappo fine linea 3/8\"", priceRaw:6.8, costRaw:null, div:1},
      ],
      // Serve per derivare un ugello 1/4" da una dorsale 3/8"
      riduzioni:[
        {code:"AI161438", label:"Manicotto riduzione 3/8-1/4", priceRaw:6.8, costRaw:null, div:1},
        {code:"AI251438", label:"Riduzione innesto 3/8-1/4",  priceRaw:8.2, costRaw:null, div:1},
      ],
      inline:{code:"AI501414", label:"Portaugello in linea tubo/tubo 1/4\"", priceRaw:5.6, costRaw:null, div:1},
      accessori:[
        {code:"AC300030", label:"Sensore vento",   priceRaw:120,  costRaw:null, div:1},
        {code:"AC300020", label:"Sensore pioggia", priceRaw:43.6, costRaw:null, div:1},
        {code:"AC300010", label:"Sonda livello prodotto", priceRaw:39.9, costRaw:null, div:1},
        {code:"AC200002", label:"Serbatoio 2 lt (per sonda)", priceRaw:5.5, costRaw:null, div:1},
        {code:"AC200005", label:"Serbatoio 5 lt", priceRaw:5.2, costRaw:null, div:1},
        {code:"KT900014", label:"Kit filtro completo 1/4\"", priceRaw:67, costRaw:null, div:1},
        {code:"KT900038", label:"Kit filtro completo 3/8\"", priceRaw:53, costRaw:null, div:1},
        {code:"KT901114", label:"Kit cassetta filtro aspiraz. 1/4\"", priceRaw:185, costRaw:null, div:1},
        {code:"KT901138", label:"Kit cassetta filtro aspiraz. 3/8\"", priceRaw:175, costRaw:null, div:1},
        {code:"KT800038", label:"Kit attacco rapido", priceRaw:22, costRaw:null, div:1},
        {code:"AI700014", label:"Riduttore di pressione 1/4\"", priceRaw:36, costRaw:null, div:1},
        {code:"AI700038", label:"Riduttore di pressione 3/8\"", priceRaw:36, costRaw:null, div:1},
        {code:"RC333838", label:"Raccordo acqua 3/8\" con valvola NR", priceRaw:27, costRaw:null, div:1},
        {code:"AI183838", label:"Gomito 90° 3/8\"", priceRaw:14.2, costRaw:null, div:1},
        {code:"AI360038", label:"Croce 3/8\"",      priceRaw:14,   costRaw:null, div:1},
        {code:"AC400012", label:"Cavalletto monoprodotto ZA20", priceRaw:53.33, costRaw:null, div:1},
        {code:"AC400011", label:"Cavalletto monoprodotto da ZA100", priceRaw:66.7, costRaw:null, div:1},
        {code:"AC400022", label:"Cavalletto Dual/multizona", priceRaw:82, costRaw:null, div:1},
        {code:"AC900014", label:"Collare fissatubo 1/4\"", priceRaw:1.4, costRaw:null, div:1},
        {code:"AC900038", label:"Collare fissatubo 3/8\"", priceRaw:1.4, costRaw:null, div:1},
        {code:"AC900114", label:"Picchetto fissaggio tubo a terra", priceRaw:0.3, costRaw:null, div:1},
        {code:"KT905000", label:"Cassetta manutenzione (77 pz)", priceRaw:400, costRaw:null, div:1},
      ],
    },
    smart: {
      tubo:[
        {code:"AI14025N", label:"Tubo mandata nero 25 m", priceRaw:34.43, costRaw:null, div:25},
      ],
      ugello:[
        {code:"KT040302.5", label:"Ugello 0,15 (kit 5)", priceRaw:29.92, costRaw:null, div:5, foroMm:0.15},
      ],
      porta:[
        {code:"KT529014.5", label:"Portaugello dritto 1/4\" (kit 5)", priceRaw:25.82, costRaw:null, div:5, kind:"d"},
        {code:"KT519014.5", label:"Portaugello 90° (kit 5)",         priceRaw:25.82, costRaw:null, div:5, kind:"a"},
        {code:"KT519014P.5",label:"Portaugello 90° POM (kit 5)",     priceRaw:12.79, costRaw:null, div:5, kind:"a"},
      ],
      tsel:[
        {code:"KT191414.5", label:"Raccordo T (kit 5)",     priceRaw:29.92, costRaw:null, div:5},
        {code:"KT191414P.5",label:"Raccordo T POM (kit 5)", priceRaw:14.92, costRaw:null, div:5},
      ],
      tappo:{code:"KT300014.5", label:"Tappo fine linea (kit 5)", priceRaw:15.41, costRaw:null, div:5},
      riduzioni:[],  // sistema a kit, solo 1/4"
      inline:{code:"KT501414.5", label:"Portaugello in linea tubo/tubo (kit 5)", priceRaw:29.92, costRaw:null, div:5},
      accessori:[
        {code:"AC300010", label:"Sonda di livello", priceRaw:34.02, costRaw:null, div:1},
        {code:"KT900014", label:"Kit filtro completo 1/4\"", priceRaw:57.38, costRaw:null, div:1},
        {code:"KTZA1005P", label:"Kit estensione 5 spot", priceRaw:81.15, costRaw:null, div:1},
        {code:"KTZA1015P", label:"Kit estensione 15 spot", priceRaw:234.43, costRaw:null, div:1},
        {code:"KT501414.5", label:"Kit 5 portaugelli linea tubo/tubo", priceRaw:29.92, costRaw:null, div:1},
        {code:"KT514514.5", label:"Kit 5 portaugello 45°", priceRaw:17.21, costRaw:null, div:1},
        {code:"KT161414.5", label:"Kit 5 manicotto tubo/tubo", priceRaw:25.82, costRaw:null, div:1},
        {code:"KT181414.5", label:"Kit 5 gomito 90°", priceRaw:29.92, costRaw:null, div:1},
        {code:"KTC900014.25", label:"Kit 25 collare fissatubo", priceRaw:29.92, costRaw:null, div:1},
      ],
    },
    gardheaven: {
      tubo:[
        {code:"TBPA30BAR1/4", label:"Tubo PA 1/4\" 30 bar 100 m",  priceRaw:125,   costRaw:null, div:100},
        {code:"TBPA60BAR1/4", label:"Tubo PA 1/4\" 60 bar 100 m",  priceRaw:165,   costRaw:null, div:100},
        {code:"TBPA80BAR3/8", label:"Tubo PA 3/8\" 80 bar 100 m",  priceRaw:177.5, costRaw:null, div:100},
      ],
      /* Le misure sul listino Gardheaven 2026 sono scritte "0,015 mm",
         "0,02 mm" e cosi' via: e' un errore di virgola, sono DECIMI di
         quei valori (0,15 mm, 0,2 mm). Confermato da Simone, che monta
         gli 0,1 e 0,15 sul raffrescamento e riconosce lo 0,3 come la
         misura dell'ugello Stocker. Se fossero millimetri veri, uno
         "0,015 mm" avrebbe un foro venti volte piu' stretto di quello
         Stocker, cioe' quattrocento volte meno portata: impossibile.
         Le etichette qui sotto riportano la misura VERA. */
      ugello:[
        {code:"UGEL0015", label:"Ugello 0,15 mm",          priceRaw:5.5, costRaw:null, div:1, foroMm:0.15},
        {code:"UGEL002",  label:"Ugello 0,2 mm",           priceRaw:5.5, costRaw:null, div:1, foroMm:0.2},
        {code:"UGEL001",  label:"Ugello 0,1 mm (fine)",    priceRaw:5.5, costRaw:null, div:1, foroMm:0.1},
        {code:"UGEL003",  label:"Ugello 0,3 mm",           priceRaw:5.5, costRaw:null, div:1, foroMm:0.3},
        {code:"UGEL004",  label:"Ugello 0,4 mm",           priceRaw:6.2, costRaw:null, div:1, foroMm:0.4},
        {code:"UGEL0015C",label:"Ugello 0,15 mm ceramico", priceRaw:6.6, costRaw:null, div:1, foroMm:0.15},
        {code:"UGEL002C", label:"Ugello 0,2 mm ceramico",  priceRaw:6.6, costRaw:null, div:1, foroMm:0.2},
      ],
      porta:[
        {code:"RACCPUD1/4", label:"Porta ugello dritto 1/4\"",   priceRaw:6.6, costRaw:null, div:1, kind:"d"},
        {code:"BASINXUG1/4",label:"Base innesto 90° ugello 1/4\"", priceRaw:3.3, costRaw:null, div:1, kind:"a"},
      ],
      tsel:[
        {code:"RACCT1/4", label:"Raccordo T 1/4\"", priceRaw:5.6, costRaw:null, div:1},
        {code:"RACCT3/8", label:"Raccordo T 3/8\"", priceRaw:10,  costRaw:null, div:1},
      ],
      tappo:{code:"RACCFL1/4", label:"Fine linea cieco 1/4\"", priceRaw:3.3, costRaw:null, div:1},
      tappoExtra:[
        {code:"RACCFL3/8", label:"Fine linea cieco 3/8\"", priceRaw:2.4, costRaw:null, div:1},
      ],
      riduzioni:[
        {code:"RIDDRI3/8-1/4", label:"Riduzione dritta 3/8→1/4", priceRaw:4.6, costRaw:null, div:1},
      ],
      inline:{code:"RACCPUD1/4", label:"Raccordo dritto portaugello 6-6", priceRaw:6.6, costRaw:null, div:1},
      accessori:[
        {code:"PROXUGUNI15",  label:"Prolunga pieghevole ugello 15 cm", priceRaw:8.5, costRaw:null, div:1},
        {code:"GRAFISSTB1/4", label:"Graffa fissatubo 1/4\"", priceRaw:0.6, costRaw:null, div:1},
        {code:"GRAFISSTB3/8", label:"Graffa fissatubo 3/8\"", priceRaw:0.8, costRaw:null, div:1},
        {code:"RACCL1/4",     label:"Raccordo L 90° 1/4\"", priceRaw:4.7, costRaw:null, div:1},
        {code:"RACCL3/8",     label:"Raccordo L 90° 3/8\"", priceRaw:6.2, costRaw:null, div:1},
        {code:"TAGL_TUBO_01", label:"Taglia tubo professionale", priceRaw:39, costRaw:null, div:1},
      ],
    },
  },
};

/* ===== accessori universali (validi per ogni brand) ===== */
export const UNIVERSAL = [
  // I tre pali sono venduti a coppie: div 2 porta prezzo e costo al singolo
  // palo, cosi' la quantita' che si digita e' il numero di pali montati.
  {code:"4255",     label:"Palo innalzamento ugello 80 cm (ferro, conf. 2 pz)",  priceRaw:15.7,  costRaw:11.49, div:2},
  {code:"4256",     label:"Palo innalzamento ugello 100 cm (ferro, conf. 2 pz)", priceRaw:17.21, costRaw:12.6,  div:2},
  {code:"4257",     label:"Palo innalzamento ugello 150 cm (ferro, conf. 2 pz)", priceRaw:18.85, costRaw:13.8,  div:2},
  {code:"AC101005", label:"Tubolare inox 50 cm",       priceRaw:12.8, costRaw:8.96,  div:1},
  {code:"AC101010", label:"Tubolare inox 100 cm",      priceRaw:18.9, costRaw:13.23, div:1},
  {code:"AC101015", label:"Tubolare inox 150 cm",      priceRaw:23.4, costRaw:16.38, div:1},
  {code:"AC101109", label:"Tubolare PVC tipo bambù 50 cm",  priceRaw:4.32, costRaw:3.02, div:1},
  {code:"AC101110", label:"Tubolare PVC tipo bambù 100 cm", priceRaw:3.12, costRaw:2.18, div:1},
];

/* ===== prodotti di consumo =====
 *
 * Insetticida e repellente del brand della centralina: nel preventivo
 * entrano come kit di partenza, e sono la base del calcolo dei consumi.
 *
 * litri = contenuto della confezione, serve a convertire il prezzo in
 *         euro/litro e a dire quante confezioni servono per la stagione
 * tipo  = 'insetticida' | 'repellente' | 'altro'
 *
 * Fonti: Listino Unificato per Stocker/Zanzero (colonna Categoria =
 * Consumabile) e listino Gardheaven 2026 pag. 6 per Gardheaven, che nel
 * Listino Unificato non compare.
 */
export const CONSUMABILI = {
  geyser: [
    {code:"45130", label:"Etokraft zanzaricida 1 L",    priceRaw:38.40,  costRaw:28.11,  div:1, litri:1,    tipo:"insetticida"},
    {code:"45147", label:"Etokraft zanzaricida 5 L",    priceRaw:174.59, costRaw:127.80, div:1, litri:5,    tipo:"insetticida"},
    {code:"45135", label:"Etokraft zanzaricida 250 ml", priceRaw:13.89,  costRaw:10.17,  div:1, litri:0.25, tipo:"insetticida"},
    {code:"45148", label:"Pirekraft concentrato 500 ml",priceRaw:37.46,  costRaw:27.42,  div:1, litri:0.5,  tipo:"insetticida"},
    {code:"45149", label:"Pirekraft concentrato 5 L",   priceRaw:287.70, costRaw:210.60, div:1, litri:5,    tipo:"insetticida"},
    {code:"45128", label:"Nebuzan repellente 1 L",      priceRaw:34.34,  costRaw:25.14,  div:1, litri:1,    tipo:"repellente"},
    {code:"45138", label:"Nebuzan repellente 5 L",      priceRaw:131.56, costRaw:96.30,  div:1, litri:5,    tipo:"repellente"},
    {code:"45129", label:"Florifens disabituante 250 ml",priceRaw:11.11, costRaw:null,   div:1, litri:0.25, tipo:"repellente"},
    {code:"45124", label:"Florifens disabituante 1 L",  priceRaw:31.60,  costRaw:null,   div:1, litri:1,    tipo:"repellente"},
    {code:"45136", label:"Florifens disabituante 5 L",  priceRaw:125.41, costRaw:null,   div:1, litri:5,    tipo:"repellente"},
    {code:"45137", label:"Florifens larvicida 50 ml",   priceRaw:11.93,  costRaw:null,   div:1, litri:0.05, tipo:"altro"},
  ],
  pro: [
    {code:"VPPM1000", label:"Vapo Perm Plus insetticida 1 L",      priceRaw:40.98,  costRaw:null, div:1, litri:1, tipo:"insetticida"},
    {code:"VPPM5000", label:"Vapo Perm Plus insetticida 5 L",      priceRaw:194.26, costRaw:null, div:1, litri:5, tipo:"insetticida"},
    {code:"VPSS10TR", label:"Vapo Silver Shield tea tree/rosm. 1 L",priceRaw:32.79, costRaw:null, div:1, litri:1, tipo:"repellente"},
    {code:"VPSS05LC", label:"Vapo Silver Shield limone/cedro 5 L", priceRaw:155.44, costRaw:null, div:1, litri:5, tipo:"repellente"},
    {code:"VPNA5000", label:"Vapo Nature rosmarino 5 L",           priceRaw:159.32, costRaw:null, div:1, litri:5, tipo:"repellente"},
  ],
  smart: [
    {code:"A0133", label:"Vapo Ciper 1 L",               priceRaw:32.79,  costRaw:null, div:1, litri:1,  tipo:"insetticida"},
    {code:"A0134", label:"Vapo Ciper 5 L",               priceRaw:143.44, costRaw:null, div:1, litri:5,  tipo:"insetticida"},
    {code:"A0135", label:"Vapo Ciper 10 L",              priceRaw:271.31, costRaw:null, div:1, litri:10, tipo:"insetticida"},
    {code:"A0136", label:"Vapo Perm Plus Tri Active 1 L",priceRaw:59.02,  costRaw:null, div:1, litri:1,  tipo:"insetticida"},
    {code:"A0137", label:"Vapo Perm Plus Tri Active 5 L",priceRaw:277.87, costRaw:null, div:1, litri:5,  tipo:"insetticida"},
    {code:"A0138", label:"Vapo Perm Plus Tri Active 10 L",priceRaw:540.16,costRaw:null, div:1, litri:10, tipo:"insetticida"},
    {code:"A0139", label:"Vapo Silver Shield 1 L",       priceRaw:46.72,  costRaw:null, div:1, litri:1,  tipo:"repellente"},
    {code:"A0140", label:"Vapo Silver Shield 5 L",       priceRaw:227.05, costRaw:null, div:1, litri:5,  tipo:"repellente"},
    {code:"A0141", label:"Vapo Nature 1 L",              priceRaw:46.72,  costRaw:null, div:1, litri:1,  tipo:"repellente"},
    {code:"A0142", label:"Vapo Nature 5 L",              priceRaw:227.05, costRaw:null, div:1, litri:5,  tipo:"repellente"},
    {code:"A0143", label:"Vapo Nature 10 L",             priceRaw:442.62, costRaw:null, div:1, litri:10, tipo:"repellente"},
  ],
  gardheaven: [
    {code:"FIREWALL-Inse1L", label:"Insetticida abbattente Firewall 1 L", priceRaw:32,  costRaw:null, div:1, litri:1,   tipo:"insetticida"},
    {code:"FIREWALL-Inse5L", label:"Insetticida abbattente Firewall 5 L", priceRaw:139, costRaw:null, div:1, litri:5,   tipo:"insetticida"},
    {code:"CHEF-BarrArom1L", label:"Barriera aromatica Chef 1 L",         priceRaw:49,  costRaw:null, div:1, litri:1,   tipo:"repellente"},
    {code:"CHEF-BarrArom5L", label:"Barriera aromatica Chef 5 L",         priceRaw:199, costRaw:null, div:1, litri:5,   tipo:"repellente"},
    {code:"ANTICALC-05L",    label:"Liquido anticalcare 0,5 L",           priceRaw:26,  costRaw:null, div:1, litri:0.5, tipo:"altro"},
  ],
};

/** Consumabili del brand, eventualmente filtrati per tipo. */
export const consumabiliPerBrand = (brandId, tipo = null) => {
  const l = CONSUMABILI[brandId] || [];
  return tipo ? l.filter((p) => p.tipo === tipo) : l;
};

/**
 * Pressione di esercizio tipica, in bar. Valori di partenza dichiarati da
 * Simone; restano modificabili sul singolo progetto perche' dipendono da
 * come la centralina e' regolata.
 */
export const PRESSIONE_BAR = {
  geyser: 12,
  pro: 17,
  smart: 17,
  gardheaven: 17,
};

/** Il raffrescamento Gardheaven gira molto piu' alto, con ugelli da 0,1-0,15. */
export const PRESSIONE_RAFFRESCAMENTO = 50;

/**
 * Punto di taratura del modello di portata: Stocker dichiara 0,04 l/min
 * per l'ugello da 0,3 mm a 12 bar. Tutto il resto si estrapola da qui.
 */
export const TARATURA_PORTATA = { foroMm: 0.3, bar: 12, lMin: 0.04 };

/**
 * Portata stimata di un ugello, in litri al minuto.
 *
 * Legge dell'ugello: la portata cresce col QUADRATO del diametro e con la
 * RADICE della pressione. La costante e' fissata sul dato dichiarato da
 * Stocker, quindi sullo 0,3 mm il modello restituisce esattamente il valore
 * di targa e sulle misure vicine resta attendibile.
 *
 * ATTENZIONE ai fori molto piccoli. Sotto i 0,2 mm il confronto con le
 * tabelle pubblicate di settore mostra scarti fino al doppio: a quelle
 * misure a limitare il flusso non e' piu' il foro ma la camera di
 * turbolenza, che questa formula non descrive. Per gli ugelli da
 * raffrescamento il numero e' quindi un ordine di grandezza, da
 * sostituire col dato del costruttore appena disponibile.
 */
export function portataStimata(foroMm, bar) {
  const d = Math.max(0, parseFloat(foroMm) || 0);
  const p = Math.max(0, parseFloat(bar) || 0);
  if (d <= 0 || p <= 0) return 0;
  const k = TARATURA_PORTATA.lMin / (TARATURA_PORTATA.foroMm ** 2 * Math.sqrt(TARATURA_PORTATA.bar));
  return k * d * d * Math.sqrt(p);
}

/**
 * Portata da usare per un ugello: il dato dichiarato se c'e', altrimenti
 * la stima. Restituisce anche da dove viene il numero, cosi' l'interfaccia
 * puo' dirlo invece di far finta che siano tutti equivalenti.
 */
export function portataUgello(articolo, bar) {
  if (!articolo) return { lMin: 0, fonte: 'ignota' };
  if (articolo.portataLmin > 0) {
    return { lMin: articolo.portataLmin, fonte: 'dichiarata' };
  }
  const stima = portataStimata(articolo.foroMm, bar);
  return { lMin: stima, fonte: stima > 0 ? 'stimata' : 'ignota' };
}

/** Giorni di stagione usati come punto di partenza: maggio-settembre. */
export const GIORNI_STAGIONE = 150;

/* ===== metodi di montaggio ugelli ===== */
export const METODI = [
  { id: 'm1d', label: 'T + portaugello dritto',  porta: 'd', usaT: true,  risalita: false },
  { id: 'm1a', label: 'T + portaugello 90°',     porta: 'a', usaT: true,  risalita: false },
  { id: 'm2q', label: 'In linea, senza T',       porta: null, usaT: false, risalita: false },
  { id: 'm3d', label: 'Risalita + portaugello dritto', porta: 'd', usaT: true, risalita: true },
  { id: 'm3a', label: 'Risalita + portaugello 90°',    porta: 'a', usaT: true, risalita: true },
  // Derivazione da dorsale Ø8 / 3-8": T + (riduzione) + spezzone di tubo + portaugello
  { id: 'm4d', label: 'Derivazione da Ø maggiore + dritto', porta: 'd', usaT: true, risalita: false, deriva: true },
  { id: 'm4a', label: 'Derivazione da Ø maggiore + 90°',    porta: 'a', usaT: true, risalita: false, deriva: true },
];

/**
 * Manodopera: tariffa unica per ugello, indipendente da dove l'ugello
 * viene fissato. Concordata col tecnico dopo aver misurato alcuni
 * montaggi: le ore impiegate per centralina, tubi e ugelli risultavano
 * circa la meta' del numero di ugelli, quindi 22 EUR/ugello equivalgono
 * a ~44 EUR/ora e coprono l'intero montaggio.
 *
 * Uniformare la tariffa allinea i costi gia' in fase di preventivo.
 */
export const EUR_PER_UGELLO = 22;

/**
 * Aliquota IVA ordinaria. Tutti i prezzi del catalogo sono IVA ESCLUSA:
 * il Listino Unificato ha le due colonne separate e quella lorda e'
 * esattamente il netto piu' 22%.
 */
export const ALIQUOTA_IVA = 22;

/* ===== valori di default (allineati al calcolatore originale) ===== */
export const DEFAULTS = {
  passo: 4,
  metodo: 'm1d',
  risalitaM: 2,     // metri di tubo per alzare l'ugello da terra
  anello: true,     // di norma il circuito si chiude ad anello: nessun tappo
  manoMode: 'det',        // det | manual
  manoMac: 0,             // programmazione centralina: di norma inclusa
  manoRate: EUR_PER_UGELLO,
  margine: 0,             // % di ricarico sul materiale
};

/** Elenco brand come array ordinato, per popolare le select. */
export const brandList = () =>
  Object.entries(C.brands).map(([id, b]) => ({ id, ...b }));

/** Macchine disponibili per un brand. */
export const macchinePerBrand = (brandId) => C.machines[brandId] || [];

/** Materiali di sistema per un brand (tubo, ugello, porta, tsel, tappo, inline). */
export const sysPerBrand = (brandId) => C.sys[C.brands[brandId]?.sys] || null;

/** Accessori del brand + universali, come nel calcolatore (ACC). */
export const accessoriPerBrand = (brandId) => [
  ...(sysPerBrand(brandId)?.accessori || []),
  ...UNIVERSAL,
];

/** Portaugelli filtrati per tipo: 'd' dritti, 'a' angolati. */
export const portaPerTipo = (brandId, kind) =>
  (sysPerBrand(brandId)?.porta || []).filter((p) => p.kind === kind);

/** true se il brand supporta il metodo 2 (raccordo in linea). */
export const supportaInline = (brandId) => Boolean(sysPerBrand(brandId)?.inline);

/**
 * true se il brand ha una dorsale di diametro maggiore da cui derivare.
 * Geyser lo fa con il T Ø8-6-8, Zanzero e Gardheaven con T 3/8" + riduzione.
 * SMART e' un sistema a kit tutto 1/4": non deriva.
 */
export const supportaDerivazione = (brandId) => {
  const s = sysPerBrand(brandId);
  if (!s) return false;
  if (brandId === 'smart') return false;
  return (s.tubo || []).some((t) => /3\/8|Ø8/i.test(t.label));
};

/** Articoli di riduzione 3/8 -> 1/4 disponibili per il brand. */
export const riduzioniPerBrand = (brandId) => sysPerBrand(brandId)?.riduzioni || [];
