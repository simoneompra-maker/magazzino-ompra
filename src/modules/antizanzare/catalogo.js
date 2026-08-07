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
        {code:"4219", label:"Anti-gocc. standard", priceRaw:2.75, costRaw:2.01, div:1},
        {code:"4253", label:"Anti-gocc. 135°",     priceRaw:4.75, costRaw:3.48, div:1},
      ],
      porta:[
        {code:"4236", label:"Dritto Ø6", priceRaw:0.78, costRaw:0.57, div:1, kind:"d"},
        {code:"4220", label:"90° Ø6",    priceRaw:0.70, costRaw:0.51, div:1, kind:"a"},
        {code:"4238", label:"135° Ø6",   priceRaw:1.56, costRaw:1.14, div:1, kind:"a"},
      ],
      tsel:[
        {code:"4222", label:"T Ø6",           priceRaw:0.86, costRaw:0.63, div:1},
        {code:"4245", label:"T Ø8-6-8 riduz.", priceRaw:1.15, costRaw:0.84, div:1},
        {code:"4240", label:"T Ø8",            priceRaw:1.15, costRaw:0.84, div:1},
      ],
      tappo:{code:"4207", label:"Chiusura fine linea Ø6", priceRaw:0.96, costRaw:0.70, div:1},
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
        {code:"4239", label:"Raccordo 90° Ø8 (sfuso)",   priceRaw:0.78, costRaw:0.57, div:1},
        {code:"4243", label:"Raccordo 90° Ø6-8 (sfuso)", priceRaw:0.94, costRaw:0.69, div:1},
        {code:"4241", label:"Raccordo dritto Ø8 (sfuso)",   priceRaw:0.74, costRaw:0.54, div:1},
        {code:"4244", label:"Raccordo dritto Ø6-8 (sfuso)", priceRaw:0.82, costRaw:0.60, div:1},
        {code:"4261", label:"Valvola non ritorno Ø8 (5 pz)", priceRaw:29.55, costRaw:21.63, div:1},
        {code:"4215", label:"Tappi chiusura Ø6 (5 pz)", priceRaw:3.65, costRaw:2.67, div:1},
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
        {code:"AI040302", label:"Ugello standard",   priceRaw:5.1, costRaw:null, div:1},
        {code:"AI040303", label:"Ugello antigoccia 0.4", priceRaw:5.3, costRaw:null, div:1},
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
        {code:"KT040302.5", label:"Ugello 0,15 (kit 5)", priceRaw:29.92, costRaw:null, div:5},
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
      ugello:[
        {code:"UGEL0015", label:"Ugello 0,015 mm",          priceRaw:5.5, costRaw:null, div:1},
        {code:"UGEL002",  label:"Ugello 0,02 mm",           priceRaw:5.5, costRaw:null, div:1},
        {code:"UGEL001",  label:"Ugello 0,01 mm (fine)",    priceRaw:5.5, costRaw:null, div:1},
        {code:"UGEL003",  label:"Ugello 0,03 mm",           priceRaw:5.5, costRaw:null, div:1},
        {code:"UGEL004",  label:"Ugello 0,04 mm",           priceRaw:6.2, costRaw:null, div:1},
        {code:"UGEL0015C",label:"Ugello 0,015 mm ceramico", priceRaw:6.6, costRaw:null, div:1},
        {code:"UGEL002C", label:"Ugello 0,02 mm ceramico",  priceRaw:6.6, costRaw:null, div:1},
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
  {code:"4255",     label:"Palo innalzamento ugello 80 cm (ferro)",  priceRaw:15.7,  costRaw:11.49, div:1},
  {code:"4256",     label:"Palo innalzamento ugello 100 cm (ferro)", priceRaw:17.21, costRaw:12.6,  div:1},
  {code:"4257",     label:"Palo innalzamento ugello 150 cm (ferro)", priceRaw:18.85, costRaw:13.8,  div:1},
  {code:"AC101005", label:"Tubolare inox 50 cm",       priceRaw:12.8, costRaw:8.96,  div:1},
  {code:"AC101010", label:"Tubolare inox 100 cm",      priceRaw:18.9, costRaw:13.23, div:1},
  {code:"AC101015", label:"Tubolare inox 150 cm",      priceRaw:23.4, costRaw:16.38, div:1},
  {code:"AC101109", label:"Tubolare PVC tipo bambù 50 cm",  priceRaw:4.32, costRaw:3.02, div:1},
  {code:"AC101110", label:"Tubolare PVC tipo bambù 100 cm", priceRaw:3.12, costRaw:2.18, div:1},
];

/* ===== metodi di montaggio ugelli ===== */
export const METODI = [
  { id: 'm1d', label: 'T + portaugello dritto',  porta: 'd', usaT: true,  riser: false },
  { id: 'm1a', label: 'T + portaugello 90°',     porta: 'a', usaT: true,  riser: false },
  { id: 'm2q', label: 'In linea, senza T',       porta: null, usaT: false, riser: false },
  { id: 'm3d', label: 'Riser + portaugello dritto', porta: 'd', usaT: true, riser: true },
  { id: 'm3a', label: 'Riser + portaugello 90°',    porta: 'a', usaT: true, riser: true },
  // Derivazione da dorsale Ø8 / 3-8": T + (riduzione) + spezzone di tubo + portaugello
  { id: 'm4d', label: 'Derivazione da tronco + dritto', porta: 'd', usaT: true, riser: false, deriva: true },
  { id: 'm4a', label: 'Derivazione da tronco + 90°',    porta: 'a', usaT: true, riser: false, deriva: true },
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

/* ===== valori di default (allineati al calcolatore originale) ===== */
export const DEFAULTS = {
  passo: 4,
  metodo: 'm1d',
  mTronco: 0,
  riserM: 2,
  derivM: 1,        // metri di tubo 1/4" per ogni derivazione dal tronco
  usaTappo: true,
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
