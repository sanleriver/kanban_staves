// Cambia solo esta línea según tu entorno
// const API_URL = 'http://127.0.0.1:8000/api';   // local
const API_URL = 'https://courageous-joy-production.up.railway.app/api'; // prod

/*  configuración de áreas  */
const AREAS = [
  {id: 'load',  name: 'Load to Stores', vertical: true,  capacidad: 12, incremento: 10, tipo: 'Arrume'},
  {id: 'dist',  name: 'Dist',           vertical: false, capacidad: 5,  incremento: 10, tipo: 'Línea'},
  {id: 'store', name: 'Stores',         vertical: false, capacidad: 16, incremento: 1,  tipo: 'Arrume'},
  {id: 'dmg',   name: 'Damage',         vertical: false, capacidad: 8,  incremento: 10, tipo: 'Arrume'},
  {id: 'wip',   name: 'WIP',            vertical: true,  capacidad: 20, incremento: 1,  tipo: 'Arrume'}
];

/*  helpers API  */
async function getAll(area) {
  const res = await fetch(`${API_URL}/casilleros/por-area/?area=${encodeURIComponent(area)}`);
  return res.json();
}
async function incrementa(area, numero, cant) {
  await fetch(`${API_URL}/casilleros/incrementa/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({area, numero, cantidad: cant})
  });
  renderAll();          // recargar vista
}

/*  colores semáforo  */
function pinta(card, valor, tipo) {
  card.classList.remove('verde', 'amarillo', 'rojo');
  if (valor === 0) { card.classList.add('verde'); return; }
  if (tipo === 'Línea') {
    if (valor >= 10 && valor <= 50) card.classList.add('amarillo');
    if (valor >= 120)               card.classList.add('rojo');
  } else {                 // Arrume
    if (valor >= 1 && valor <= 5)   card.classList.add('amarillo');
    if (valor >= 10)                card.classList.add('rojo');
  }
}

/*  tarjeta individual  */
function crearCard(numero, valor, tipo, inc, area) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="label">${tipo} ${numero}</div>
    <div class="valor">${valor}</div>
    <button onclick="incrementa('${area}',${numero},${inc})">+${inc}</button>
    <button onclick="incrementa('${area}',${numero},-${inc})">-${inc}</button>`;
  pinta(card, valor, tipo);
  return card;
}

/*  construye un área completa  */
function crearArea(cfg, data) {
  const div = document.createElement('div');
  div.className = `area ${cfg.id}`;   // load / dist / store / dmg / wip
  div.innerHTML = `<h3>${cfg.name}</h3>`;

  const wrap = document.createElement('div');
  if (cfg.vertical) {                 // columna
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '6px';
  } else {                            // línea / cuadrícula
    wrap.style.display = 'flex';
    wrap.style.flexWrap = 'wrap';
    wrap.style.gap = '6px';
    wrap.style.justifyContent = 'center';
  }

  for (let i = 1; i <= cfg.capacidad; i++) {
    const obj = data.find(c => c.numero === i) || {valor: 0};
    wrap.appendChild(crearCard(i, obj.valor, cfg.tipo, cfg.incremento, cfg.name));
  }
  div.appendChild(wrap);
  return div;
}

/*  renderizado total  */
async function renderAll() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  /* 1. columna izquierda (Load to Stores) */
  const colIzq = document.createElement('div');
  colIzq.className = 'col-izq';
  colIzq.appendChild(await crearArea(AREAS[0], await getAll('Load to Stores')));
  grid.appendChild(colIzq);

  /* 2. ZONA CENTRAL (Dist arriba, Stores+Damage abajo) */
  const centro = document.createElement('div');
  centro.className = 'centro';

  // Fila Dist + Stores + Damage (horizontal)
  const par = document.createElement('div');
  par.className = 'par';
  const distData = await getAll('Dist');
  const storeData = await getAll('Stores');
  const dmgData   = await getAll('Damage');
  par.appendChild(await crearArea(AREAS[1], distData));
  par.appendChild(await crearArea(AREAS[2], storeData));
  par.appendChild(await crearArea(AREAS[3], dmgData));
  centro.appendChild(par);

  grid.appendChild(centro);

  /* 3. COLUMNA DERECHA (WIP) */
  const colDer = document.createElement('div');
  colDer.className = 'col-der';
  colDer.appendChild(await crearArea(AREAS[4], await getAll('WIP')));
  grid.appendChild(colDer);

  /* ensamblado final */
  grid.appendChild(colIzq);
  grid.appendChild(centro);
  grid.appendChild(colDer);
}

/*  primera carga  */
renderAll();