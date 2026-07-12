/* =========================================================
   ABSENKU — core utils & data layer
   ========================================================= */
'use strict';
const $ = (sel,root)=> (root||document).querySelector(sel);
const $$ = (sel,root)=> Array.from((root||document).querySelectorAll(sel));
const el = (tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!==undefined) e.innerHTML=html; return e; };
const uid = ()=> Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const HARI_PENDEK = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
function pad2(n){ return n<10?'0'+n:''+n; }
function fmtDateISO(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function todayISO(){ return fmtDateISO(new Date()); }
function parseISO(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function fmtTanggalPanjang(iso){ const d=parseISO(iso); return d.getDate()+' '+BULAN[d.getMonth()]+' '+d.getFullYear(); }
function fmtTanggalPendek(iso){ const d=parseISO(iso); return d.getDate()+' '+BULAN[d.getMonth()].slice(0,3); }
function addDays(iso,n){ const d=parseISO(iso); d.setDate(d.getDate()+n); return fmtDateISO(d); }
function nowMinutes(){ const d=new Date(); return d.getHours()*60+d.getMinutes(); }
function hmToMin(hm){ const [h,m]=hm.split(':').map(Number); return h*60+m; }
function jamBentrok(a,b){
  if(!a || !b || a.hari!==b.hari) return false;
  const aStart=hmToMin(a.jamMulai), aEnd=hmToMin(a.jamSelesai);
  const bStart=hmToMin(b.jamMulai), bEnd=hmToMin(b.jamSelesai);
  return aStart<bEnd && bStart<aEnd;
}
function todayHariIndex(){ return new Date().getDay(); }

// ---- ICONS ----
const ICONS = {
  check:'<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>',
  plus:'<path d="M11 5v6H5v2h6v6h2v-6h6v-2h-6V5z"/>',
  minus:'<path d="M5 11h14v2H5z"/>',
  back:'<path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z"/>',
  close:'<path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>',
  edit:'<path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
  trash:'<path d="M6 21c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v14zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
  moreV:'<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
  calendar:'<path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zM5 9h14v11H5V9z"/>',
  clock:'<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.2 3.1.8-1.3-4.5-2.7z"/>',
  swap:'<path d="M9.5 3 5 7.5 9.5 12V9H17V6H9.5V3zm5 9L19 16.5 14.5 21v-3H7v-3h7.5v-3z"/>',
  warn:'<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
  home:'<path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z"/>',
  hist:'<path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zm.5 4H12v6l4.7 2.8.8-1.3-4-2.4V7z"/>',
  settings:'<path d="M19.4 13a7.6 7.6 0 0 0 .1-1 7.6 7.6 0 0 0-.1-1l2.1-1.6a.5.5 0 0 0 .1-.6l-2-3.5a.5.5 0 0 0-.6-.2l-2.5 1a7.5 7.5 0 0 0-1.7-1L14.3 2a.5.5 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.4l-.4 2.6a7.5 7.5 0 0 0-1.7 1l-2.5-1a.5.5 0 0 0-.6.2l-2 3.5a.5.5 0 0 0 .1.6L4.6 11c0 .3-.1.6-.1 1s0 .7.1 1L2.5 14.6a.5.5 0 0 0-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.3.4.5.4h4c.2 0 .5-.2.5-.4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.5a.5.5 0 0 0-.1-.6L19.4 13zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/>',
  send:'<path d="M2 21 23 12 2 3v7l15 2-15 2z"/>',
  arrowR:'<path d="M8.6 5 7.2 6.4 12.8 12l-5.6 5.6L8.6 19l7-7z"/>',
  flame:'<path d="M12 2s-5 5.2-5 10a5 5 0 0 0 10 0c1.2 1.3 2 3 2 4.5A6.5 6.5 0 0 1 5.5 22 6.5 6.5 0 0 1 3 16.5C3 11 8 8 8 8c-1 2 .4 3.5 1.5 3.5C10.5 11.5 9 8 12 2z"/>',
  medal:'<path d="M12 2 9.5 7l-5.4.6L8 11l-1 5.4L12 14l5 2.4-1-5.4 3.9-3.4L14.5 7 12 2zm0 15.8-4.2 2.1L9 15l-3.2-2.8L10.2 12 12 8l1.8 4 4.4.2L15 15l.8 4.9L12 17.8z"/>',
  archive:'<path d="M20.5 3h-17L2 7v13a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7l-1.5-4zM12 17.5 6.5 12H10v-2h4v2h3.5L12 17.5zM4.1 5h15.8l.6 2H3.5l.6-2z"/>',
  empty:'<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3-9h6v2H9z"/>',
  download:'<path d="M12 3v10.2l3.6-3.6L17 11l-5 5-5-5 1.4-1.4L12 13.2V3h0zM5 19h14v2H5z"/>',
  upload:'<path d="M12 21V10.8l-3.6 3.6L7 13l5-5 5 5-1.4 1.4L12 10.8V21h0zM5 3h14v2H5z"/>',
  user:'<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-9 2.2-9 5v3h18v-3c0-2.8-4.6-5-9-5z"/>',
  wifi:'<path d="M12 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8.2 15.2a5.5 5.5 0 0 1 7.6 0l1.4-1.4a7.5 7.5 0 0 0-10.4 0l1.4 1.4zM5 12a10.5 10.5 0 0 1 14 0l1.4-1.4a12.5 12.5 0 0 0-16.8 0L5 12z"/>',
  offline:'<path d="M12 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8.2 15.2a5.5 5.5 0 0 1 7.6 0l1.4-1.4a7.5 7.5 0 0 0-10.4 0l1.4 1.4z"/><path d="M3.5 3.5l17 17" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" fill="none"/>',
  bell:'<path d="M12 22a2.2 2.2 0 0 0 2.2-2.2h-4.4A2.2 2.2 0 0 0 12 22zm7-6v-5c0-3.1-1.6-5.6-4.5-6.3V4a1.5 1.5 0 0 0-3 0v.7C8.6 5.4 7 7.9 7 11v5l-2 2v1h14v-1l-2-2z"/>',
  info:'<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
};
function svg(name,cls){ return '<svg class="'+(cls||'icon')+'" viewBox="0 0 24 24" fill="currentColor">'+ICONS[name]+'</svg>'; }

// ---- Haptic feedback ----
function haptic(ms){ try{ if('vibrate' in navigator) navigator.vibrate(ms||50); }catch(e){} }

// ---- IndexedDB layer ----
const DBKEYS = ['profile','matkul','jadwalOverride','riwayatAbsen','settings','appState','semesters'];
function defaultDB(){
  return {
    profile:{ nama:'', nim:'', universitas:'', fakultas:'', jurusan:'', semesterSekarang:1, tanggalMulaiSemester:null, tanggalSelesaiSemester:null, isEstimasi:false, tanggalPertamaKuliahUser:null },
    matkul:[],
    jadwalOverride:[],
    riwayatAbsen:[],
    settings:{ 
      limitAbsenUmum:3, 
      temaMode:'dark', 
      colorTheme:'cyan', 
      formatPesanWA:'Halo Kak, selamat {waktu}.\n\nSaya ingin mengabarkan bahwa hari ini saya berhalangan hadir di perkuliahan Kakak.\n\nNama: {nama}\nNIM: {nim}\nMata Kuliah: {matkul}\nTanggal: {tanggal}\nAlasan: {alasan_kata}\nKeterangan: {keterangan}\n\nTerima kasih banyak atas pengertiannya, Kak.', 
      namaPJdefault:{}, 
      reminderAktif:false,
      muteKirimPJSelamanya: false,
      muteKeteranganSelamanya: false
    },
    appState:{ sudahOnboarding:false, sesiTerakhirDibuka:null, semesterSelesaiDiakui:false, absenCommittedTanggal:null, qcBisukanTanggal:null, qcSelesaiTanggal:null, qcLewatiHarianTanggal:null, qcLewatiHarianMatkulIds:null, qcAbaikanMatkul:{}, activeSemesterId:null },
    semesters:[]
  };
}
const DB = { data:null };

// ---- IndexedDB primitives ----
const IDB_NAME = 'absenku_idb';
const IDB_STORE = 'absenku_store';
const IDB_KEY = 'absenku_store';
let _idbInstance = null;
function idbOpen(){
  return new Promise((resolve,reject)=>{
    if(_idbInstance){ resolve(_idbInstance); return; }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e)=>{
      const db = e.target.result;
      if(!db.objectStoreNames.contains(IDB_STORE)){ db.createObjectStore(IDB_STORE); }
    };
    req.onsuccess = (e)=>{ _idbInstance = e.target.result; resolve(_idbInstance); };
    req.onerror = (e)=>{ reject(e); };
  });
}
function idbGet(key){
  return idbOpen().then(db=> new Promise((resolve,reject)=>{
    const tx = db.transaction(IDB_STORE,'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.get(key);
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = (e)=> reject(e);
  }));
}
function idbSet(key,value){
  return idbOpen().then(db=> new Promise((resolve,reject)=>{
    const tx = db.transaction(IDB_STORE,'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req = store.put(value,key);
    req.onsuccess = ()=> resolve(true);
    req.onerror = (e)=> reject(e);
  }));
}
async function dbLoad(){
  const def = defaultDB();
  let raw = null;
  try{ raw = await idbGet(IDB_KEY); }catch(e){ console.warn('gagal buka IndexedDB', e); }
  if(!raw){
    // Migrasi dari localStorage lama (jika ada) sebelum IndexedDB dipakai
    let legacy = null;
    try{ legacy = localStorage.getItem('absenku_db'); }catch(e){}
    if(legacy){
      try{ raw = JSON.parse(legacy); }catch(e){ raw = null; }
    }
  }
  if(!raw){ DB.data = def; return; }
  try{
    const parsed = raw;
    DB.data = Object.assign({}, def, parsed);
    for(const k of DBKEYS){ if(DB.data[k]===undefined) DB.data[k]=def[k]; }
    DB.data.settings = Object.assign({}, def.settings, parsed.settings||{});
    DB.data.appState = Object.assign({}, def.appState, parsed.appState||{});
    DB.data.profile = Object.assign({}, def.profile, parsed.profile||{});
    DB.data.semesters = parsed.semesters || def.semesters;
  }catch(e){ DB.data = def; }
}
let saveTimer=null;
async function dbSave(){
  try{ await idbSet(IDB_KEY, DB.data); }catch(e){ console.warn('gagal nyimpen data', e); }
}
function dbSaveDebounced(){ clearTimeout(saveTimer); saveTimer=setTimeout(dbSave,120); }

/* =========================================================
   Navigation layer stack (for hardware/back button handling)
   ========================================================= */
const NAV = { stack: [], suppressNextPopstate:false };
function navPush(layer){
  NAV.stack.push(layer);
  try{ history.pushState({absenkuLayer:NAV.stack.length}, ''); }catch(e){}
}
function navPop(fromPopstate){
  if(fromPopstate && NAV.suppressNextPopstate){
    NAV.suppressNextPopstate = false;
    return;
  }
  const top = NAV.stack[NAV.stack.length - 1];
  if(fromPopstate && top && top.confirmExit && !top._confirmedExit){
    // Tombol back hardware ditekan: batalkan dulu navigasi historinya (agar user
    // tetap terlihat di layar ini), lalu tampilkan dialog konfirmasi.
    try{ history.pushState({absenkuLayer:NAV.stack.length}, ''); }catch(e){}
    showDialog({
      title: top.confirmExit.title,
      body: top.confirmExit.body,
      actions: [
        { label: 'Lanjutkan', style: 'btn-text' },
        { label: 'Keluar', style: 'btn-filled', onClick: () => { top._confirmedExit = true; navPop(); } }
      ]
    });
    return;
  }
  const layer = NAV.stack.pop();
  if(layer && layer.close) layer.close();
  if(!fromPopstate){
    haptic(30);
    NAV.suppressNextPopstate = true;
    try{ history.back(); }catch(e){ NAV.suppressNextPopstate = false; }
  }
}
window.addEventListener('popstate', ()=>{
  if(NAV.stack.length>0 || NAV.suppressNextPopstate){
    navPop(true);
  }
});

// ---- Snackbar ----
function showSnackbar(msg, actionLabel, actionFn){
  const host = $('#snackbar-host');
  const fabWrap = $('#fab-wrap');
  host.classList.toggle('above-fab', !!(fabWrap && fabWrap.children.length>0));
  const bar = el('div','snackbar');
  bar.innerHTML = '<span style="flex:1">'+msg+'</span>' + (actionLabel? '<button>'+actionLabel+'</button>':'');
  if(actionLabel && actionFn){ $('button',bar).addEventListener('click', ()=>{ actionFn(); bar.remove(); }); }
  host.appendChild(bar);
  setTimeout(()=>{ bar.style.transition='opacity var(--dur-m) var(--ease-emph), transform var(--dur-m) var(--ease-emph)'; bar.style.opacity='0'; bar.style.transform='translateY(10px)'; setTimeout(()=>bar.remove(),300); }, 3200);
}

// ---- Dialog ----
function showDialog({title, body, actions}){
  const container = $('#dialog-container');
  const scrim = $('#scrim');
  const dlg = el('div','dialog');
  dlg.innerHTML = '<h3>'+title+'</h3><p>'+(body||'')+'</p><div class="row"></div>';
  const row = $('.row',dlg);
  function close(){ dlg.classList.remove('show'); scrim.classList.remove('show'); setTimeout(()=>dlg.remove(),250); }
  actions.forEach(a=>{
    const b = el('button','btn '+(a.style||'btn-text'), a.label);
    b.addEventListener('click', ()=>{ navPop(); if(a.onClick) a.onClick(); });
    row.appendChild(b);
  });
  container.appendChild(dlg);
  scrim.classList.add('show');
  scrim.onclick = ()=>{ if(actions.some(a=>a.dismissOnScrim!==false)){} };
  requestAnimationFrame(()=>dlg.classList.add('show'));
  navPush({type:'dialog', close:close});
  return {close};
}

// ---- Bottom sheet ----
function openSheet(buildFn, opts){
  opts = opts||{};
  const container = $('#sheet-container');
  const fullscreen = !!opts.fullscreen;

  // Dynamic Scrim & Z-Index: hitung tingkat tumpukan berdasarkan jumlah .sheet aktif saat ini
  const baseZ = 61 + ($$('.sheet').length * 2);
  const scrim = el('div', 'scrim');
  scrim.style.zIndex = baseZ;

  const sheet = el('div', fullscreen?'sheet fullscreen':'sheet');
  sheet.style.zIndex = baseZ + 1;
  sheet.innerHTML = fullscreen
    ? '<div class="sheet-fs-topbar"><button class="btn-icon statelayer sheet-fs-close">'+svg('back')+'</button>'+(opts.title? '<h2>'+opts.title+'</h2>':'')+'</div><div class="sheet-body"></div>'
    : '<div class="sheet-handle"></div>' + (opts.title? '<div class="sheet-title">'+opts.title+'</div>':'') + '<div class="sheet-body"></div>';
  const body = $('.sheet-body',sheet);
  buildFn(body, closeSheet);
  container.appendChild(scrim);
  container.appendChild(sheet);
  if(fullscreen) pushStatusBarLayer('--clr-surface');
  function closeSheet(){
    sheet.classList.remove('show'); scrim.classList.remove('show');
    if(fullscreen) popStatusBarLayer();
    setTimeout(()=>{ sheet.remove(); scrim.remove(); },320);
  }

  // Isolasi Klik: scrim baru ini menutupi sheet di bawahnya secara absolut
  scrim.classList.add('show');
  scrim.onclick = () => navPop();
  if(fullscreen){ $('.sheet-fs-close',sheet).onclick = ()=> navPop(); }

  // Fisika Real-Time & Responsif: drag pada keseluruhan .sheet, bukan cuma handle
  let startY = 0, currentY = 0, isDragging = false, lastY = 0, lastTime = 0, velocity = 0;
  sheet.addEventListener('touchstart', (e) => {
    if(fullscreen) return;
    startY = e.touches[0].clientY;
    lastY = startY;
    lastTime = Date.now();
    velocity = 0;
    isDragging = false;
  }, {passive: true});
  sheet.addEventListener('touchmove', (e) => {
    if(fullscreen) return;
    const y = e.touches[0].clientY;
    const deltaY = y - startY;
    // Hanya izinkan drag ke bawah jika sheet-body berada di posisi paling atas
    if(deltaY > 0 && body.scrollTop <= 0){
      if(!isDragging){ isDragging = true; sheet.style.transition = 'none'; }
      currentY = deltaY;
      sheet.style.transform = `translateY(${currentY}px)`;
      const now = Date.now();
      const dt = now - lastTime;
      if(dt > 0) velocity = (y - lastY) / dt;
      lastY = y; lastTime = now;
    } else if(isDragging){
      currentY = 0;
      sheet.style.transform = 'translateY(0px)';
    }
  }, {passive: true});
  sheet.addEventListener('touchend', () => {
    if(fullscreen || !isDragging){ isDragging = false; return; }
    isDragging = false;
    sheet.style.transition = 'transform var(--dur-m) var(--ease-emph)';
    const highVelocity = velocity > 0.5; // px/ms
    if(currentY > sheet.clientHeight * 0.25 || highVelocity){
      // FIX LAG: animasikan dulu ke luar layar, baru navPop setelah transisi selesai
      sheet.style.transform = 'translateY(100%)';
      setTimeout(()=>{ navPop(true); }, 280);
    } else {
      sheet.style.transform = 'translateY(0)'; // Kembalikan
    }
    currentY = 0; velocity = 0;
  });

  requestAnimationFrame(()=>sheet.classList.add('show'));
  navPush({type:'sheet', close:closeSheet});
  return { el:sheet, close:closeSheet, refresh:(fn)=>{ body.innerHTML=''; fn(body,closeSheet); } };
}

// ---- Side panel ----
function openSidePanel(buildFn){
  const panel = $('#sidepanel');
  const scrim = $('#scrim');
  panel.innerHTML='';
  buildFn(panel, closePanel);
  pushStatusBarLayer('--clr-surface-container-high');
  function closePanel(){ panel.classList.remove('show'); scrim.classList.remove('show'); popStatusBarLayer(); }

  let spStartX = 0, spStartY = 0;
  panel.addEventListener('touchstart', (e) => {
    spStartX = e.touches[0].clientX;
    spStartY = e.touches[0].clientY;
  }, {passive: true});
  
  panel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - spStartX;
    const dy = e.changedTouches[0].clientY - spStartY;
    // Deteksi swipe ke kanan (minimal 50px dan lebih dominan horizontal)
    if (dx > 50 && Math.abs(dx) > Math.abs(dy)) {
      closePanel();
    }
  });

  scrim.classList.add('show');
  scrim.onclick = ()=> navPop();
  requestAnimationFrame(()=>panel.classList.add('show'));
  navPush({type:'panel', close:closePanel});
  return { close:closePanel, refresh:(fn)=>{ panel.innerHTML=''; fn(panel,closePanel); } };
}

// ---- screen switch ----
function showScreen(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $('#'+id).classList.add('active');
}

/* =========================================================
   Domain logic
   ========================================================= */
function displayNamaMatkul(m){
  return m.namaLengkap;
}
function estimasiTanggalSelesai(startISO){ return addDays(startISO, 19*7); }
function tentukanSemesterGanjilGenap(refDate){
  const bulan = refDate.getMonth()+1;
  return (bulan>=8 || bulan<=1) ? 'ganjil' : 'genap';
}
function estimasiMulaiSemesterDariTahunMasuk(tahunMasuk){
  const now = new Date();
  const tipe = tentukanSemesterGanjilGenap(now);
  let mulaiTahun = now.getFullYear();
  let mulaiBulan = 8;
  if(tipe==='genap'){
    mulaiBulan = 2;
    if(now.getMonth()+1===1) mulaiTahun -= 1;
  } else {
    if(now.getMonth()+1===1) mulaiTahun -= 1;
  }
  if(tahunMasuk && mulaiTahun < tahunMasuk){ mulaiTahun = tahunMasuk; mulaiBulan = 8; }
  return fmtDateISO(new Date(mulaiTahun, mulaiBulan-1, 1));
}

// ---- FITUR SEMESTER: helper filter matkul berdasarkan activeSemesterId ----
// ---- FITUR SEMESTER: manajemen data semester ----
function buatSemesterBaru(nama){
  const s = { id: uid(), nama: nama || ('Semester ' + (DB.data.semesters.length + 1)), dibuatPada: Date.now() };
  DB.data.semesters.push(s);
  DB.data.appState.activeSemesterId = s.id;
  dbSaveDebounced();
  return s;
}
function pindahSemesterAktif(semesterId){
  DB.data.appState.activeSemesterId = semesterId;
  dbSaveDebounced();
}
function semesterAktif(){
  return DB.data.semesters.find(s=>s.id===DB.data.appState.activeSemesterId) || null;
}
function matkulSemesterAktif(){
  const activeId = DB.data.appState.activeSemesterId;
  if(!activeId) return DB.data.matkul; // belum ada semester dipilih -> tampilkan semua (kompatibel data lama)
  return DB.data.matkul.filter(m => !m.semesterId || m.semesterId === activeId);
}
function jadwalEfektifTanggal(iso){
  const hariIdx = parseISO(iso).getDay();
  const hasil = [];
  matkulSemesterAktif().forEach(m=>{
    if(m.arsip) return;
    const hariMatkul = HARI.indexOf(m.hari);
    let base = (hariMatkul===hariIdx) ? { matkulId:m.id, jamMulai:m.jamMulai, jamSelesai:m.jamSelesai, mode:m.modeDefault, sumber:'default', pengali:1 } : null;
    if(base) hasil.push(base);
  });
  DB.data.jadwalOverride.forEach(o=>{
    if(o.status!=='aktif') return;
    const m = matkulSemesterAktif().find(x=>x.id===o.matkulId);
    if(!m) return;
    let berlaku=false;
    if(o.tipeDurasi==='mingguIni'){ berlaku = (iso===o.tanggalBerlaku) || (o.hariBaru===HARI[hariIdx] && iso>=o.tanggalBerlaku && iso<addDays(o.tanggalBerlaku,7)); }
    else if(o.tipeDurasi==='duaMinggu'){ berlaku = o.hariBaru===HARI[hariIdx] && iso>=o.tanggalBerlaku && iso<addDays(o.tanggalBerlaku,14); }
    else if(o.tipeDurasi==='permanen'){ berlaku = o.hariBaru===HARI[hariIdx] && iso>=o.tanggalBerlaku; }
    else if(o.tipeDurasi==='double'){ berlaku = o.hariBaru===HARI[hariIdx] && iso>=o.tanggalBerlaku; }
    if(!berlaku) return;
    if(o.tipeDurasi!=='double'){
      const idxDefault = hasil.findIndex(h=>h.matkulId===o.matkulId && h.sumber==='default');
      if(idxDefault>-1 && m.hari!==o.hariBaru) hasil.splice(idxDefault,1);
      const already = hasil.findIndex(h=>h.matkulId===o.matkulId && h.sumber==='override');
      if(already>-1) hasil.splice(already,1);
    }
    hasil.push({ matkulId:o.matkulId, jamMulai:o.jamBaruMulai, jamSelesai:o.jamBaruSelesai, mode:m.modeDefault, sumber:'override', pengali:o.pengaliKehadiran||1, overrideId:o.id });
  });
  hasil.sort((a,b)=> hmToMin(a.jamMulai)-hmToMin(b.jamMulai));
  return hasil;
}
function matkulById(id){ return DB.data.matkul.find(m=>m.id===id); }
function limitUntukMatkul(m){ return (m.limitAbsenKhusus!=null && m.limitAbsenKhusus!=='') ? Number(m.limitAbsenKhusus) : DB.data.settings.limitAbsenUmum; }
function riwayatAktif(){
  const activeId = DB.data.appState.activeSemesterId;
  return DB.data.riwayatAbsen.filter(r=>{
    if(r.dihapusPada) return false;
    if(!activeId) return true; // belum ada semester dipilih -> tampilkan semua
    return !r.semesterId || r.semesterId === activeId;
  });
}
function sudahAbsenPadaTanggal(matkulId, tanggal){ return riwayatAktif().some(r => r.matkulId === matkulId && r.tanggal === tanggal && !r.inputLama); }
function absenTerpakaiUntukMatkul(matkulId){
  return riwayatAktif().filter(r=>r.matkulId===matkulId).reduce((sum,r)=>{
    return sum + (r.pengaliKehadiranSnapshot||1);
  },0);
}
function totalPertemuanEstimasi(m){ return 14; }

/* ---- INTUITIVE TRACKER: EVALUASI RADAR HARIAN ---- */
function evaluasiRadarHarian(){
  let isBesok = false;
  let targetTanggal = todayISO();
  let jadwal = jadwalEfektifTanggal(targetTanggal);
  
  if (jadwal.length > 0) {
    let maxSelesai = 0;
    jadwal.forEach(j => { let endMin = hmToMin(j.jamSelesai); if (endMin > maxSelesai) maxSelesai = endMin; });
    if (nowMinutes() > maxSelesai) {
      isBesok = true;
      targetTanggal = addDays(todayISO(), 1);
      jadwal = jadwalEfektifTanggal(targetTanggal);
    }
  } else {
    isBesok = true;
    targetTanggal = addDays(todayISO(), 1);
    jadwal = jadwalEfektifTanggal(targetTanggal);
  }
  
  let labelHari = isBesok ? 'Besok' : 'Hari ini';
  if (jadwal.length === 0) {
    return [{ status: 'libur', bg: 'var(--clr-surface-container)', fg: 'var(--clr-on-surface)', title: 'Kosong', desc: 'Tidak ada jadwal kelas ' + labelHari.toLowerCase() + '.', list: null, labelHari, isKedepan: false }];
  }
  
  let habis = [], kritis = [], waspada = [], aman = [];
  let habisKedepan = [], kritisKedepan = [], waspadaKedepan = [], amanKedepan = [];
  
  jadwal.forEach(j => {
    const m = matkulById(j.matkulId);
    if(!m) return;
    const sisa = limitUntukMatkul(m) - absenTerpakaiUntukMatkul(m.id);
    const sudahAbsen = sudahAbsenPadaTanggal(m.id, targetTanggal);
    
    if (sudahAbsen) {
      if (sisa <= 0) habisKedepan.push(m.namaLengkap);
      else if (sisa === 1) kritisKedepan.push(m.namaLengkap);
      else if (sisa === 2) waspadaKedepan.push(m.namaLengkap);
      else amanKedepan.push(m.namaLengkap);
    } else {
      if (sisa <= 0) habis.push(m.namaLengkap);
      else if (sisa === 1) kritis.push(m.namaLengkap);
      else if (sisa === 2) waspada.push(m.namaLengkap);
      else aman.push(m.namaLengkap);
    }
  });

  const bgHabis = 'var(--clr-error-container)', fgHabis = 'var(--clr-on-error-container)';
  const bgKritis = 'var(--clr-tertiary-container)', fgKritis = 'var(--clr-on-tertiary-container)';
  const bgWaspada = 'var(--clr-secondary-container)', fgWaspada = 'var(--clr-on-secondary-container)';
  const bgAman = 'var(--clr-primary-container)', fgAman = 'var(--clr-on-primary-container)';

  const cards = [];
  
  const semuaHabis = (habis.length === jadwal.length) && jadwal.length > 0;
  const semuaHabisKedepan = (habisKedepan.length === jadwal.length) && jadwal.length > 0;
  
  const semuaKritis = (kritis.length === jadwal.length) && jadwal.length > 0;
  const semuaKritisKedepan = (kritisKedepan.length === jadwal.length) && jadwal.length > 0;
  
  const semuaWaspada = (waspada.length === jadwal.length) && jadwal.length > 0;
  const semuaWaspadaKedepan = (waspadaKedepan.length === jadwal.length) && jadwal.length > 0;
  
  const isSingle = jadwal.length === 1;

  let titleHabis = semuaHabis ? (isSingle ? `${labelHari.toUpperCase()} JANGAN BOLOS!` : `${labelHari.toUpperCase()} JANGAN BOLOS SEMUA!`) : (labelHari === 'Besok' ? 'Besok jangan bolos:' : `Jangan bolos ${habis.length} kelas hari ini!`);
  let descHabis = semuaHabis ? (isSingle ? 'Jatah absen untuk kelas ini sudah habis.' : 'Jatah absen untuk semua kelas ini sudah habis.') : null;
  let listHabis = habis;

  let titleHabisKedepan = semuaHabisKedepan ? (isSingle ? 'KEDEPANNYA JANGAN BOLOS!' : 'KEDEPANNYA JANGAN BOLOS SEMUA!') : 'Awas jatah bolos habis kedepannya:';
  let descHabisKedepan = semuaHabisKedepan ? (isSingle ? 'Jatah absen untuk kelas ini sudah habis.' : 'Jatah absen untuk semua kelas ini sudah habis.') : null;
  let listHabisKedepan = habisKedepan;

  let titleKritis = semuaKritis ? (isSingle ? `Jatah terakhir ${labelHari.toLowerCase()}!` : `Jatah terakhir semua ${labelHari.toLowerCase()}!`) : `Jatah terakhir ${labelHari.toLowerCase()}:`;
  let descKritis = semuaKritis ? (isSingle ? 'Kelas ini tersisa 1 kali absen lagi.' : 'Semua kelas tersisa 1 kali absen lagi.') : null;
  let listKritis = kritis;

  let titleKritisKedepan = semuaKritisKedepan ? (isSingle ? 'Jatah terakhir kedepannya!' : 'Jatah terakhir semua kedepannya!') : 'Jatah terakhir untuk kedepannya:';
  let descKritisKedepan = semuaKritisKedepan ? (isSingle ? 'Kelas ini tersisa 1 kali absen lagi.' : 'Semua kelas tersisa 1 kali absen lagi.') : null;
  let listKritisKedepan = kritisKedepan;

  let titleWaspada = semuaWaspada ? (isSingle ? `Sisa jatah tipis ${labelHari.toLowerCase()}!` : `Sisa jatah tipis semua ${labelHari.toLowerCase()}!`) : (labelHari === 'Besok' ? 'Waspadai sisa jatah besok:' : 'Waspadai sisa jatah hari ini:');
  let descWaspada = semuaWaspada ? (isSingle ? 'Jatah absen kelas ini mulai menipis.' : 'Jatah absen semua kelas mulai menipis.') : null;
  let listWaspada = waspada;

  let titleWaspadaKedepan = semuaWaspadaKedepan ? (isSingle ? 'Sisa jatah tipis kedepannya!' : 'Sisa jatah tipis semua kedepannya!') : 'Waspadai sisa jatah kedepannya:';
  let descWaspadaKedepan = semuaWaspadaKedepan ? (isSingle ? 'Jatah absen kelas ini mulai menipis.' : 'Jatah absen semua kelas mulai menipis.') : null;
  let listWaspadaKedepan = waspadaKedepan;

  if (habis.length > 0) cards.push({ bg: bgHabis, fg: fgHabis, title: titleHabis, desc: descHabis, list: listHabis, labelHari, status: 'habis', isKedepan: false });
  if (kritis.length > 0) cards.push({ bg: bgKritis, fg: fgKritis, title: titleKritis, desc: descKritis, list: listKritis, labelHari, status: 'kritis', isKedepan: false });
  if (waspada.length > 0) cards.push({ bg: bgWaspada, fg: fgWaspada, title: titleWaspada, desc: descWaspada, list: listWaspada, labelHari, status: 'waspada', isKedepan: false });

  if (habisKedepan.length > 0) cards.push({ bg: bgHabis, fg: fgHabis, title: titleHabisKedepan, desc: descHabisKedepan, list: listHabisKedepan, labelHari, status: 'habis', isKedepan: true });
  if (kritisKedepan.length > 0) cards.push({ bg: bgKritis, fg: fgKritis, title: titleKritisKedepan, desc: descKritisKedepan, list: listKritisKedepan, labelHari, status: 'kritis', isKedepan: true });
  if (waspadaKedepan.length > 0) cards.push({ bg: bgWaspada, fg: fgWaspada, title: titleWaspadaKedepan, desc: descWaspadaKedepan, list: listWaspadaKedepan, labelHari, status: 'waspada', isKedepan: true });

  const adaKedepan = habisKedepan.length > 0 || kritisKedepan.length > 0 || waspadaKedepan.length > 0 || amanKedepan.length > 0;
  
  if (habis.length === 0 && kritis.length === 0 && waspada.length === 0 && !adaKedepan) {
    if (aman.length > 0) cards.push({ bg: bgAman, fg: fgAman, title: (isSingle ? `Aman ${labelHari.toLowerCase()}!` : `Aman semua ${labelHari.toLowerCase()}!`), desc: 'Boleh bolos kok kalau mau.', list: aman, labelHari, status: 'aman', isKedepan: false });
  } else if (aman.length > 0) {
    cards.push({ bg: bgAman, fg: fgAman, title: `Kelas yang aman ${labelHari.toLowerCase()}:`, desc: null, list: aman, labelHari, status: 'aman', isKedepan: false });
  }

  if (amanKedepan.length > 0) {
    const semuaAmanKedepan = (amanKedepan.length === jadwal.length) && jadwal.length > 0;
    const tAmanKedepan = semuaAmanKedepan ? (isSingle ? 'Aman kedepannya!' : 'Aman semua kedepannya!') : 'Kelas yang aman kedepannya:';
    const dAmanKedepan = semuaAmanKedepan ? (isSingle ? 'Jatah absen kelas masih banyak.' : 'Semua jatah absen kelas masih banyak.') : null;
    cards.push({ bg: bgAman, fg: fgAman, title: tAmanKedepan, desc: dAmanKedepan, list: amanKedepan, labelHari, status: 'aman', isKedepan: true });
  }

  if (cards.length === 0) {
    cards.push({ bg: bgAman, fg: fgAman, title: (isSingle ? `Aman ${labelHari.toLowerCase()}!` : `Aman semua ${labelHari.toLowerCase()}!`), desc: 'Boleh bolos kok kalau mau.', list: aman, labelHari, status: 'aman', isKedepan: false });
  }

  return cards;
}

function hitungStreak(){
  const sorted = riwayatAktif().filter(r=>r.alasan==='bolos').map(r=>r.tanggal).sort();
  if(sorted.length===0){
    const mulai = DB.data.profile.tanggalMulaiSemester;
    if(!mulai) return 0;
    const diffDays = Math.round((parseISO(todayISO())-parseISO(mulai))/86400000);
    return Math.max(diffDays,0);
  }
  const last = sorted[sorted.length-1];
  const diffDays = Math.round((parseISO(todayISO())-parseISO(last))/86400000);
  return Math.max(diffDays,0);
}
function greetingWaktu(){
  const h = new Date().getHours();
  if(h>=4 && h<11) return 'pagi';
  if(h>=11 && h<15) return 'siang';
  if(h>=15 && h<18) return 'sore';
  return 'malam';
}
function generatePesanWA(entries){
  const p = DB.data.profile;
  const tpl = DB.data.settings.formatPesanWA;
  const alasanKata = {izin:'Izin', sakit:'Sakit', bolos:'Tidak Hadir'};
  const waktu = greetingWaktu();
  if(entries.length===1){
    const e = entries[0];
    const m = matkulById(e.matkulId);
    let t = tpl;
    if(!e.keterangan){
      t = t.split('\n').filter(line => !line.includes('{keterangan}')).join('\n').replace(/\n{3,}/g, '\n\n');
    }
    return t.replace(/{nama}/g,p.nama).replace(/{nim}/g,p.nim).replace(/{matkul}/g, m?m.namaLengkap:'-')
      .replace(/{alasan}/g, e.alasan).replace(/{alasan_kata}/g, alasanKata[e.alasan]||e.alasan)
      .replace(/{tanggal}/g, fmtTanggalPanjang(e.tanggal)).replace(/{keterangan}/g, e.keterangan||'')
      .replace(/{waktu}/g, waktu);
  }
  let out = 'Assalamualaikum, selamat '+waktu+'. Izin melaporkan ketidakhadiran untuk beberapa kuliah hari ini.\n\n';
  out += 'Nama: '+p.nama+'\nNIM: '+p.nim+'\n\n';
  entries.forEach((e,i)=>{
    const m = matkulById(e.matkulId);
    out += (i+1)+'. '+(m?m.namaLengkap:'-')+' — '+(alasanKata[e.alasan]||e.alasan);
    if(e.keterangan) out += ' ('+e.keterangan+')';
    out += '\n';
  });
  out += '\nTerima kasih banyak sebelumnya.';
  return out;
}
function kirimWA(text, nomor){
  const url = 'https://wa.me/'+(nomor?nomor.replace(/\\D/g,''):'')+'?text='+encodeURIComponent(text);
  window.open(url,'_blank');
}

/* =========================================================
   FLOW TITLE AUTO-FIT — mastiin judul flow (.flow-title-large)
   selalu jadi 4-5 baris (ga kurang, ga lebih), biar padding ke
   subtitle/tombol rapih walau isi teksnya pendek atau panjang.
   ========================================================= */
function fitFlowTitle(elm, opts){
  if(!elm) return;
  const minLines = (opts && opts.minLines) || 4;
  const maxLines = (opts && opts.maxLines) || 5;
  const baseFont = 50, minFont = 22, growCap = 96, step = 1;

  elm.style.fontSize = baseFont + 'px';

  function countLines(){
    const lh = parseFloat(getComputedStyle(elm).lineHeight) || (parseFloat(getComputedStyle(elm).fontSize) * 1.1);
    return Math.max(1, Math.round(elm.getBoundingClientRect().height / lh));
  }
  function overflowsWidth(){
    return elm.scrollWidth > elm.clientWidth + 1;
  }

  let size = baseFont;
  let n = countLines();

  if(n > maxLines){
    while(n > maxLines && size > minFont){
      size -= step;
      elm.style.fontSize = size + 'px';
      n = countLines();
    }
  }
}
function fitFlowTitles(scope){
  $$('.flow-title-large', scope).forEach(t => fitFlowTitle(t));
}

/* =========================================================
   ONBOARDING — INTUITIVE STEP BY STEP
   ========================================================= */
const OB = { step:1, totalSteps:3, tempMatkul:[], editMode:false };
function obGoto(step){
  OB.step = step;
  renderOnboarding();
}
function obNavStep(step){
  navPush({type:'onboardstep', close:()=>{ obGoto(step-1<1?1:step-1); } });
  obGoto(step);
}
function obEditStep(step){
  navPush({type:'onboardstep', close:()=>{ OB.editMode=false; obGoto(5); } });
  OB.editMode = true;
  obGoto(step);
}
function obAdvanceAfterEdit(nextStep){
  if(OB.editMode){ OB.editMode=false; navPop(); }
  else { obNavStep(nextStep); }
}
function renderOnboarding(){
  const root = $('#scr-onboarding');
  root.innerHTML='';
  const wrap = el('div','stack'); wrap.style.cssText='flex:1;overflow:hidden;';
  const body = el('div','scroll-y'); body.style.paddingTop='24px'; body.style.paddingBottom='16px'; body.style.flex='1';
  wrap.appendChild(body);

  // Capsule pill progress indicator — sama persis dengan wizard "tambah absen"
  const indicators = el('div','flow-capsule-indicators');
  for(let i=1;i<=OB.totalSteps;i++){
    const cls = 'flow-capsule-dot' + (i < OB.step ? ' done' : '') + (i === OB.step ? ' active' : '');
    indicators.appendChild(el('div', cls));
  }
  wrap.appendChild(indicators);

  root.appendChild(wrap);
  if(OB.step===1) obStep1(body);
  else if(OB.step===2) obStep2(body);
  else obStep3(body);
}
function stepFooterOnboard(container, onNext, nextLabel, disabled){
  const foot = el('div','row gap12 mt24');
  foot.style.width = '100%';
  if(OB.step>1){
    const back = el('button','flow-btn-choice compact tonal statelayer');
    back.style.cssText = 'flex:0 0 auto;width:auto;min-width:112px;';
    back.innerHTML = '<span>Balik</span>';
    back.onclick = ()=> navPop();
    foot.appendChild(back);
  }
  const next = el('button','flow-btn-choice compact primary statelayer');
  next.style.cssText = 'flex:1;width:auto;';
  next.innerHTML = '<span>'+(nextLabel||'Lanjut')+'</span>'+svg('arrowR');
  if(disabled) next.setAttribute('disabled','');
  next.onclick = onNext;
  foot.appendChild(next);
  container.appendChild(foot);
}
function obStep1(c){
  const wrap = el('div', 'onboard-step-container animate-slide-up');
  wrap.innerHTML = `
    <h2 class="flow-title-large">Kenalan & Aturan Main</h2>
    <p class="flow-subtitle">Data ini dipakai buat template izin otomatis ke PJ Kelas.</p>
    <div class="stack gap16 mt12" style="width:100%;">
      <div class="field"><label>Nama Lengkap / Panggilan</label><input type="text" id="ob-nama" placeholder="Contoh: Budi"></div>
      <div class="field"><label>NIM</label><input type="text" id="ob-nim" placeholder="Contoh: 12345678"></div>
      <div class="field mt8"><label>Batas Maksimal Absen (Umum)</label><input type="number" id="ob-limit" value="${DB.data.settings.limitAbsenUmum || 3}" min="0"></div>
    </div>
  `;
  c.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));
  const p = DB.data.profile;
  $('#ob-nama', wrap).value = p.nama || '';
  $('#ob-nim', wrap).value = p.nim || '';

  stepFooterOnboard(wrap, ()=>{
    const nama = $('#ob-nama').value.trim(), nim = $('#ob-nim').value.trim();
    if(!nama || !nim){ showSnackbar('Nama dan NIM wajib diisi ya!'); return; }
    // Save UI values
    p.nama = nama; p.nim = nim;
    DB.data.settings.limitAbsenUmum = Number($('#ob-limit').value) || 3;
    // Auto-fill unused fields silently
    p.universitas = p.universitas || '';
    p.fakultas = p.fakultas || '';
    p.jurusan = p.jurusan || '';
    p.semesterSekarang = p.semesterSekarang || 1;
    dbSaveDebounced();
    obAdvanceAfterEdit(2);
  });
}
function obStep2(c){
  // Ini adalah obStep3 versi lama (Mata Kuliah)
  const wrap = el('div', 'onboard-step-container animate-slide-up');
  wrap.innerHTML = `
    <h2 class="flow-title-large">Mata kuliah yang kamu ambil semester ini</h2>
    <p class="flow-subtitle">Tambahkan kelas yang kamu jalani. Bisa ditambah lagi nanti.</p>
    <div class="stack gap12 mt12" id="ob-matkul-list" style="width:100%;"></div>
  `;
  c.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));
  const list = $('#ob-matkul-list', wrap);

  function renderList(){
    list.innerHTML='';
    OB.tempMatkul.forEach((m,idx)=>{
      const card = el('div','card-outlined row between');
      card.style.borderWidth = '2px';
      const bentrok = OB.tempMatkul.some((o,i)=> i!==idx && jamBentrok(m,o));
      card.innerHTML = '<div class="stack" style="gap:2px"><div class="txt-title-sm">'+m.namaLengkap+'</div>'+
        '<div class="txt-body muted">'+m.hari+', '+m.jamMulai+'–'+m.jamSelesai+' • '+(m.modeDefault==='online'?'Online':'Offline')+'</div>'+
        (bentrok? '<div class="txt-body" style="color:var(--clr-error); font-weight:700;">Bentrok dengan kelas lain</div>':'')+'</div>';
      const del = el('button','btn-icon statelayer', svg('trash'));
      del.onclick=()=>{ OB.tempMatkul.splice(idx,1); renderList(); };
      card.appendChild(del);
      list.appendChild(card);
    });
    const addBtn = el('div','matkul-add-item statelayer');
    addBtn.innerHTML = '<div class="row gap8" style="justify-content:center;color:var(--clr-primary);font-weight:700;">'+svg('plus')+'<span>Tambah Mata Kuliah</span></div>';
    addBtn.onclick = ()=> openTambahMatkulSheet(m=>{ OB.tempMatkul.push(m); renderList(); });
    list.appendChild(addBtn);
  }
  renderList();

  stepFooterOnboard(wrap, ()=>{
    if(OB.tempMatkul.length===0){ showSnackbar('Tambahkan minimal satu kelas'); return; }
    DB.data.matkul = OB.tempMatkul.map(m=>({ id:uid(), namaLengkap:m.namaLengkap, hari:m.hari, jamMulai:m.jamMulai, jamSelesai:m.jamSelesai, modeDefault:m.modeDefault, limitAbsenKhusus:null, arsip:false }));
    dbSaveDebounced();
    obAdvanceAfterEdit(3);
  });
}
function openTambahMatkulSheet(onAdd){
  openSheet((body,close)=>{
    body.appendChild(el('h3','txt-title mt8','Mata Kuliah Baru'));
    const f1=el('div','field mt16'); f1.innerHTML='<label>Nama Lengkap Mata Kuliah</label>'; const inpNama=el('input'); inpNama.placeholder='cth: Landasan Pendidikan'; f1.appendChild(inpNama); body.appendChild(f1);
    const hariWrap = el('div','field mt12'); hariWrap.innerHTML='<label>Hari</label>';
    const selHari = el('select'); HARI.slice(1).concat(HARI[0]).forEach(h=>{ const o=el('option'); o.value=h; o.textContent=h; selHari.appendChild(o); });
    hariWrap.appendChild(selHari); body.appendChild(hariWrap);
    const jamRow = el('div','row gap12 mt12');
    const fj1=el('div','field'); fj1.style.flex='1'; fj1.innerHTML='<label>Jam Mulai</label>'; const inpJ1=el('input'); inpJ1.type='time'; inpJ1.value='08:00'; fj1.appendChild(inpJ1);
    const fj2=el('div','field'); fj2.style.flex='1'; fj2.innerHTML='<label>Jam Selesai</label>'; const inpJ2=el('input'); inpJ2.type='time'; inpJ2.value='10:00'; fj2.appendChild(inpJ2);
    jamRow.appendChild(fj1); jamRow.appendChild(fj2); body.appendChild(jamRow);
    const modeDefWrap = el('div','field mt12'); modeDefWrap.innerHTML='<label>Sistem Default Kelas</label>';
    const modeDefSeg = el('div','segmented'); modeDefSeg.innerHTML='<button data-v="offline" class="active">Offline</button><button data-v="online">Online</button>';
    modeDefWrap.appendChild(modeDefSeg); body.appendChild(modeDefWrap);
    let modeDefault='offline';
    modeDefSeg.addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; modeDefault=b.dataset.v; $$('button',modeDefSeg).forEach(x=>x.classList.toggle('active',x===b)); });
    const btn = el('button','btn btn-filled statelayer mt24', 'Simpan'); btn.style.width='100%';
    btn.onclick = ()=>{
      const nama = inpNama.value.trim();
      if(!nama){ showSnackbar('Nama jangan dikosongkan'); return; }
      if(hmToMin(inpJ2.value)<=hmToMin(inpJ1.value)){ showSnackbar('Jam selesai harus lebih telat dari jam mulai'); return; }
      haptic();
      onAdd({ namaLengkap:nama, hari:selHari.value, jamMulai:inpJ1.value, jamSelesai:inpJ2.value, modeDefault });
      navPop();
    };
    body.appendChild(btn);
  }, {title:''});
}
function obStep3(c){
  const wrap = el('div', 'onboard-step-container animate-slide-up');
  wrap.innerHTML = `
    <div style="margin-top: 40px; color: var(--clr-primary);">${svg('check', 'icon')}</div>
    <h2 class="flow-title-large" style="margin-top:16px;">Semua udah siap, gas pakai sekarang!</h2>
    <p class="flow-subtitle mt8">Kalender akademik otomatis dihitung mulai hari ini. Jika butuh penyesuaian khusus (seperti batas absen tiap matkul), kamu bisa atur belakangan di menu <b>Pengaturan</b>.</p>
    <div class="flow-footer-actions" style="margin-top:32px;">
      <button class="btn btn-filled statelayer" id="btn-ob-finish" style="height:52px;font-size:16px;width:100%;">Mulai Gunakan Absenku</button>
    </div>
  `;
  c.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));
  $('#btn-ob-finish', wrap).onclick = ()=>{
    // Auto-setup calendar in the background
    const p = DB.data.profile;
    if(!p.tanggalMulaiSemester) {
      p.tanggalMulaiSemester = todayISO();
      p.tanggalSelesaiSemester = estimasiTanggalSelesai(todayISO());
      p.isEstimasi = true;
    }
    DB.data.appState.sudahOnboarding = true;
    DB.data.appState.qcBisukanTanggal = todayISO();
    dbSave();
    NAV.stack = [];
    bootMain();
  };
}
function startOnboarding(){
  OB.step=1; OB.tempMatkul = DB.data.matkul.length? DB.data.matkul.map(m=>({...m})) : [];
  showScreen('scr-onboarding');
  renderOnboarding();
}

/* =========================================================
   DASHBOARD
   ========================================================= */
let radarIndex = 0;
function renderDashboard(){
  const root = $('#tab-dashboard');
  root.innerHTML='';
  const p = DB.data.profile;
  const hariIni = HARI[todayHariIndex()];
  const jadwalHariIni = jadwalEfektifTanggal(todayISO());
  
  // Header
  const header = el('div','stack');
  const jam = new Date().getHours();
  const sapaan = jam<10?'Pagi':(jam<15?'Siang':(jam<18?'Sore':'Malam'));
  header.innerHTML = '<div class="txt-headline">'+sapaan+', '+(p.nama.split(' ')[0]||'Kamu')+'</div>'+
    '<div class="txt-body muted mt8">'+hariIni+', '+fmtTanggalPanjang(todayISO())+'</div>';
  root.appendChild(header);
  
  // INTUITIVE TRACKER: CARD INDIKASI HARIAN (CAROUSEL)
  if (window._radarCarouselInterval) { clearInterval(window._radarCarouselInterval); window._radarCarouselInterval = null; }
  const radarCards = evaluasiRadarHarian();
  const statCard = el('div','card mt8');
  statCard.style.border = 'none';
  statCard.style.background = 'transparent';
  statCard.style.padding = '0';
  root.appendChild(statCard);

  // radarIndex sekarang di scope global (lihat atas file) agar tidak reset saat pindah tab

  // Container dibuat SEKALI SAJA — tidak di-re-render penuh tiap ganti card
  const containerEl = el('div','radar-card-container statelayer');
  containerEl.style.cssText = 'position:relative; overflow:hidden; border-radius:32px; padding:28px; height:260px; display:flex; flex-direction:column; justify-content:flex-start; text-align:left; box-shadow: 0 16px 32px rgba(0,0,0,0.08); cursor:'+(radarCards.length>1?'pointer':'default')+';';
  const contentEl = el('div','radar-content-anim');
  contentEl.style.position = 'relative';
  containerEl.appendChild(contentEl);
  statCard.appendChild(containerEl);

  if (radarCards.length > 1) {
    containerEl.onclick = () => { advanceRadar(); resetRadarTimer(); };
  }

  // Konfigurasi badge per status: label & ikon yang beda-beda tapi treatment
  // visualnya (posisi, ukuran, style) seragam untuk SEMUA status.
  const STATUS_BADGE = {
    habis:   { icon: 'warn',  label: 'Bahaya Absen' },
    kritis:  { icon: 'flame', label: 'Jatah Kritis' },
    waspada: { icon: 'bell',  label: 'Perlu Diwaspadai' },
    aman:    { icon: 'check', label: 'Aman Terkendali' },
    libur:   { icon: 'check', label: 'Aman Terkendali' },
  };

  function renderRadarCard(isAdvancing = false){
    const c = radarCards[radarIndex];

    // Terapkan premium background: Cahaya lebih soft dan natural
    containerEl.style.background = `
      radial-gradient(circle at 90% -10%, rgba(255,255,255,0.25) 0%, transparent 80%), 
      radial-gradient(circle at 0% 120%, color-mix(in srgb, ${c.fg} 10%, transparent) 0%, transparent 70%), 
      linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%), 
      ${c.bg}
    `;
    containerEl.style.color = c.fg;

    // Terapkan Glass Edge Bevel yang lebih halus
    containerEl.style.boxShadow = 'inset 0 1.5px 2px rgba(255,255,255,0.25), inset 0 -1.5px 2px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)';
    containerEl.style.border = `1px solid color-mix(in srgb, ${c.fg} 12%, transparent)`;

    const count = c.list ? c.list.length : 0;
    const badgeCfg = STATUS_BADGE[c.status] || null;

    let titleFontSize = 'clamp(22px, 6vw, 28px)';
    let listFontSize = 'clamp(14px, 4vw, 15px)';
    let listGap = '8px';
    let descFontSize = 'clamp(14px, 4vw, 15px)';

    if (count <= 1) {
      titleFontSize = 'clamp(28px, 8vw, 34px)';
      listFontSize = 'clamp(18px, 5vw, 20px)';
      listGap = '14px';
      descFontSize = 'clamp(16px, 4.5vw, 18px)';
    } else if (count === 2) {
      titleFontSize = 'clamp(24px, 7vw, 30px)';
      listFontSize = 'clamp(16px, 4.5vw, 18px)';
      listGap = '10px';
      descFontSize = 'clamp(15px, 4vw, 16px)';
    }

    let finalBadgeLabel = badgeCfg ? badgeCfg.label : '';
    let finalBadgeIcon = badgeCfg ? badgeCfg.icon : '';
    if (badgeCfg && c.isKedepan) {
      finalBadgeLabel = 'UNTUK KEDEPANNYA';
      finalBadgeIcon = 'bell';
    }

    const badgeHtml = badgeCfg
      ? `<div style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:999px; background:${c.fg}; color:${c.bg}; opacity:0.9; font-size:12px; font-weight:800; letter-spacing:0.3px; text-transform:uppercase; width:fit-content; margin-bottom:14px;">${svg(finalBadgeIcon)}<span>${finalBadgeLabel}</span></div>`
      : '';

    const listHtml = c.list ? `<ul class="radar-card-list" style="margin-top:20px; padding:0; font-size:${listFontSize}; font-weight:700; opacity:0.95; display:flex; flex-direction:column; gap:${listGap};">` + c.list.map(n=>`<li style="list-style:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${n}</li>`).join('') + '</ul>' : '';
    const descHtml = c.desc ? `<div style="font-size:${descFontSize}; font-weight:500; opacity:0.85; margin-top:14px; line-height:1.5;">${c.desc}</div>` : '';

    containerEl.style.padding = '32px 28px';
    containerEl.style.justifyContent = 'flex-start';

    // Tidak ada decoHtml lagi, langsung render konten teks murni
    contentEl.innerHTML = `
      <div style="position:relative; z-index:2;">
        ${badgeHtml}
        <div style="font-family:var(--font-display); font-size:${titleFontSize}; font-weight:800; line-height:1.15; letter-spacing:-0.5px; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden;">
          ${c.title}
        </div>
        ${descHtml}
        ${listHtml}
      </div>
    `;

    contentEl.classList.remove('radar-content-anim');
    if (isAdvancing || !window._radarFirstLoadAnim) {
      void contentEl.offsetWidth;
      contentEl.classList.add('radar-content-anim');
      window._radarFirstLoadAnim = true;
    }
  }

  function advanceRadar(){
    radarIndex = (radarIndex + 1) % radarCards.length;
    renderRadarCard(true);
  }

  function resetRadarTimer(){
    if (window._radarCarouselInterval) clearInterval(window._radarCarouselInterval);
    if (radarCards.length > 1) {
      window._radarCarouselInterval = setInterval(advanceRadar, 4000);
    }
  }

  renderRadarCard();
  // resetRadarTimer(); // dihapus: jangan reset timer/carousel tiap kali dashboard di-render ulang (pindah tab)
  
  // Override List (Jadwal Pindahan Aktif) - di bawah Radar Card
  const activeOv = DB.data.jadwalOverride.filter(o=>o.status==='aktif');
  if(activeOv.length){
    const details = el('details','card mt8');
    details.innerHTML = '<summary class="txt-title-sm statelayer" style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;outline:none;">Jadwal Pindahan Aktif ('+activeOv.length+')'+svg('arrowR')+'</summary>';
    const inner = el('div','stack gap8 mt12');
    activeOv.forEach(o=>{
      const m = matkulById(o.matkulId);
      inner.innerHTML += '<div class="txt-body muted"><b>'+(m?m.namaLengkap:'?')+'</b> &rarr; '+o.hariBaru+' '+o.jamBaruMulai+'-'+o.jamBaruSelesai+'</div>';
    });
    details.appendChild(inner);
    root.appendChild(details);
  }
  
  // Kuliah Hari Ini
  const jadwalCard = el('div','card mt8');
  if(jadwalHariIni.length===0){
    jadwalCard.innerHTML = '<div class="txt-body muted">Tidak ada kelas terjadwal hari ini.</div>';
  } else {
    const nowM = nowMinutes();
    jadwalCard.innerHTML = jadwalHariIni.map(j=>{
      const m = matkulById(j.matkulId); if(!m) return '';
      const start=hmToMin(j.jamMulai), end=hmToMin(j.jamSelesai);
      let status = nowM<start? 'Belum mulai' : (nowM>end? 'Selesai':'Berlangsung');
      let color = nowM<start? 'var(--clr-on-surface-variant)' : (nowM>end? 'var(--clr-outline)':'var(--clr-primary)');
      return '<div class="row between statelayer" style="padding:10px 0;align-items:flex-start;cursor:pointer;" onclick="haptic(); openDetailProgressMatkul(\''+m.id+'\')"><div class="row gap12" style="align-items:flex-start;"><span class="dot" style="background:'+(j.mode==='online'?'var(--clr-online)':'var(--clr-offline)')+';margin-top:7px;"></span><span class="txt-body-lg" style="font-weight:700;">'+m.namaLengkap+'</span></div><div class="stack" style="align-items:flex-end;gap:4px;flex-shrink:0;margin-left:12px;"><span class="txt-body" style="color:var(--clr-on-surface-variant);white-space:nowrap;font-weight:500;">'+j.jamMulai+'-'+j.jamSelesai+'</span><span class="txt-body" style="color:'+color+';font-weight:700;white-space:nowrap;">'+status+'</span></div></div>';
    }).join('<div class="divider"></div>');
  }
  root.appendChild(jadwalCard);
  
  // Peringatan Limit
  const overList = matkulSemesterAktif().filter(m=>!m.arsip && absenTerpakaiUntukMatkul(m.id)>limitUntukMatkul(m));
  if(overList.length){
    const warnCard = el('div','card mt8'); warnCard.style.border='2px solid var(--clr-error)';
    warnCard.innerHTML = '<div class="row gap8 breathe-urgent" style="color:var(--clr-error);font-weight:700;width:fit-content;">'+svg('warn')+'<span>Melebihi Batas Absen Aman!</span></div>'+
      '<div class="stack gap8 mt8">'+overList.map(m=>'<div class="row between"><span class="txt-body" style="font-weight:500;">'+m.namaLengkap+'</span><span class="badge">'+absenTerpakaiUntukMatkul(m.id)+'/'+limitUntukMatkul(m)+'</span></div>').join('')+'</div>';
    root.appendChild(warnCard);
  }
  
  setTimeout(() => { const ring = $('.animated-ring', root); if(ring) ring.style.strokeDashoffset = ring.dataset.off; }, 50);
}

/* =========================================================
   TAB KELAS — Daftar Kelas per Hari
   ========================================================= */
function renderKelas(){
  const root = $('#tab-kelas');
  root.innerHTML='';

  // Set default hari ke hari ini jika belum ada
  if(!APP.selectedHariKelas) APP.selectedHariKelas = HARI[todayHariIndex()];

  const headerWrap = el('div','stack');
  headerWrap.innerHTML = '<div class="txt-headline">Daftar Kelas</div>'+
                         '<div class="txt-body muted mt8">Pantau batas absensi setiap mata kuliah</div>';
  root.appendChild(headerWrap);

  // Kapsul Filter Horizontal
  const filterWrap = el('div', 'chip-row no-tab-swipe mt16');
  filterWrap.style.cssText = 'flex-shrink:0; overflow-x:auto; flex-wrap:nowrap; padding-top:4px; padding-bottom:16px; align-items:center; -webkit-overflow-scrolling:touch; scrollbar-width:none; margin-left:-24px; margin-right:-24px; padding-left:24px; padding-right:24px;';

  const listContainer = el('div', 'stack gap12 mt8');

  const renderList = () => {
    listContainer.innerHTML = '';
    const items = matkulSemesterAktif().filter(m => !m.arsip && m.hari === APP.selectedHariKelas);
    if(items.length === 0){
      listContainer.innerHTML = '<div class="empty mt24"><svg class="icon" viewBox="0 0 24 24" fill="currentColor" style="width:48px;height:48px;opacity:0.3;"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3-9h6v2H9z"/></svg><div class="txt-body muted mt8">Tidak ada jadwal kelas di hari '+APP.selectedHariKelas+'</div></div>';
      return;
    }
    const activeOvByMatkul = {};
    DB.data.jadwalOverride.filter(o=>o.status==='aktif').forEach(o=>{ activeOvByMatkul[o.matkulId] = true; });
    items.forEach(m=>{
      const used = absenTerpakaiUntukMatkul(m.id), lim = limitUntukMatkul(m)||1;
      const pct = clamp(used/lim,0,1);
      const color = pct>=1?'var(--clr-error)':(pct>=0.66?'#C08A2E':'var(--clr-primary)');

      const card = el('div','card row between statelayer');
      card.style.cursor = 'pointer';
      card.onclick = () => { haptic(); openDetailProgressMatkul(m.id); };

      const pindahanChip = activeOvByMatkul[m.id] ? '<span class="chip" style="height:24px; padding:0 8px; font-size:10.5px; border:none; background:var(--clr-primary-container); color:var(--clr-on-primary-container);">Pindahan</span>' : '';

      card.innerHTML = `
        <div class="stack" style="gap:4px;flex:1;">
          <div class="row gap8">
            <div class="txt-body-lg" style="font-weight:700;">${m.namaLengkap}</div>
            ${pindahanChip}
          </div>
          <div class="txt-body muted" style="font-size:13px;">${m.jamMulai} - ${m.jamSelesai} • ${m.modeDefault==='online'?'Online':'Offline'}</div>
          <div class="progressbar mt12" style="width:100%">
            <div style="width:${pct*100}%;background:${color}"></div>
          </div>
        </div>
        <div class="stack" style="align-items:flex-end; justify-content:flex-end; margin-left:16px;">
          <div class="txt-title-sm" style="color:${color};font-size:18px;font-family:var(--font-display); line-height:1;">${used}/${lim}</div>
        </div>
      `;
      listContainer.appendChild(card);
    });
  };

  HARI.forEach(h => {
    const btn = el('button', 'chip statelayer ' + (h === APP.selectedHariKelas ? 'selected' : ''));
    btn.style.cssText = 'flex-shrink:0; font-weight:700; border-width:2px; height:44px; border-radius:var(--shape-full);';
    btn.textContent = h;
    btn.onclick = () => {
      haptic(20);
      APP.selectedHariKelas = h;
      Array.from(filterWrap.children).forEach(b => { b.classList.toggle('selected', b.textContent === h); });
      renderList();
    };
    filterWrap.appendChild(btn);
  });

  root.appendChild(filterWrap);
  root.appendChild(listContainer);
  renderList();

  const spacer = el('div');
  spacer.style.height = '40px';
  root.appendChild(spacer);
}

/* =========================================================
   CLICKABLE PROGRESS DETAIL (BOTTOM SHEET DETAILED TIMELINE)
   ========================================================= */
function openDetailProgressMatkul(matkulId) {
  const m = matkulById(matkulId);
  if (!m) return;
  const limit = limitUntukMatkul(m);

  openSheet((body, closeSheet) => {
    function renderContent() {
      body.innerHTML = '';
      const list = riwayatAktif().filter(r => r.matkulId === matkulId).sort((a,b) => b.tanggal.localeCompare(a.tanggal));

      body.appendChild(el('p', 'txt-body muted mt8', 'Riwayat presensi kelas semester berjalan'));

      const isOver = list.length > limit;
      const bg = isOver ? 'var(--clr-error-container)' : 'var(--clr-primary-container)';
      const fg = isOver ? 'var(--clr-on-error-container)' : 'var(--clr-on-primary-container)';
      const accent = isOver ? 'var(--clr-error)' : 'var(--clr-primary)';
      const accentOn = isOver ? 'var(--clr-on-error)' : 'var(--clr-on-primary)';

      const statusCard = el('div', 'mt16');
      statusCard.style.cssText = `position:relative;overflow:hidden;background:${bg};color:${fg};border-radius:32px;padding:24px;`;
      statusCard.innerHTML = `
        <div style="position:absolute;top:-44px;right:-36px;width:150px;height:150px;border-radius:50%;background:${accent};opacity:0.12;"></div>
        <div style="position:absolute;bottom:-64px;left:-34px;width:130px;height:130px;border-radius:50%;background:${accent};opacity:0.08;"></div>
        <div style="position:relative;">
          <div class="txt-title-sm" style="font-weight:700;font-size:16px;line-height:1.3;">${m.namaLengkap}</div>
          <div class="row between" style="align-items:flex-end;margin-top:22px;gap:12px;">
            <div class="stack" style="gap:2px;">
              <span style="font-size:11.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;opacity:0.7;">Total Ketidakhadiran</span>
              <div style="font-family:var(--font-display);font-weight:800;font-size:46px;line-height:1.05;letter-spacing:-1.5px;">${list.length}<span style="font-size:22px;font-weight:600;opacity:0.6;">/${limit}</span></div>
            </div>
            <span style="flex-shrink:0;display:inline-flex;align-items:center;height:34px;padding:0 16px;border-radius:999px;background:${accent};color:${accentOn};font-size:11.5px;font-weight:800;letter-spacing:0.2px;white-space:nowrap;">${isOver ? 'MELEBIHI BATAS' : 'BATAS TOLERANSI ' + limit + 'X'}</span>
          </div>
        </div>
      `;
      body.appendChild(statusCard);

      const actionRow = el('div', 'row between mt24');
      actionRow.innerHTML = '<span class="txt-body muted" style="font-weight:700; font-size:11.5px; letter-spacing:0.5px; text-transform:uppercase;">INPUT DATA LAMA</span>';
      const btns = el('div', 'row gap8');
      const btnMinus = el('button', 'btn-icon statelayer');
      btnMinus.style.background = 'var(--clr-surface-container-high)';
      btnMinus.style.width = '44px';
      btnMinus.style.height = '44px';
      btnMinus.innerHTML = svg('minus');
      const btnPlus = el('button', 'btn-icon statelayer');
      btnPlus.style.background = 'var(--clr-surface-container-high)';
      btnPlus.style.width = '44px';
      btnPlus.style.height = '44px';
      btnPlus.innerHTML = svg('plus');

      btnPlus.onclick = () => {
        haptic();
        if (list.length >= limit) { showSnackbar('Batas absen sudah maksimal!'); return; }
        const entry = {
          id: uid(),
          matkulId: m.id,
          tanggal: todayISO(),
          hari: HARI[todayHariIndex()],
          alasan: 'data_lama',
          keterangan: 'Data Lama (Input Manual)',
          sudahDikirimWA: false,
          waktuDibuat: Date.now(),
          dihapusPada: null,
          overrideId: null,
          semesterId: DB.data.appState.activeSemesterId,
          pengaliKehadiranSnapshot: 1,
          inputLama: true
        };
        DB.data.riwayatAbsen.push(entry);
        dbSaveDebounced();
        syncActiveTabUI();
        renderContent();
      };

      btnMinus.onclick = () => {
        haptic();
        const candidates = list;
        if (candidates.length === 0) { showSnackbar('Belum ada data absen untuk dikurangi'); return; }
        const target = candidates[0];
        target.dihapusPada = Date.now();
        dbSaveDebounced();
        syncActiveTabUI();
        renderContent();
      };

      btns.appendChild(btnMinus);
      btns.appendChild(btnPlus);
      actionRow.appendChild(btns);
      body.appendChild(actionRow);

      const titleH = el('div', 'txt-title-sm mt24', 'Catatan Absensi');
      body.appendChild(titleH);

      if (list.length === 0) {
        const empty = el('div', 'empty mt12');
        empty.innerHTML = svg('check') + '<div class="txt-body" style="font-weight:700;margin-top:8px;">Presensi Aman Terkendali</div><div class="txt-body muted" style="font-size:13px;">Kehadiran kamu di kelas ini masih 100%.</div>';
        body.appendChild(empty);
        return;
      }

      const timeline = el('div', 'stack gap12 mt12');
      list.forEach(r => {
        const card = el('div', 'card row between statelayer', '');
        card.style.padding = '14px 18px';
        card.style.cursor = 'pointer';
        card.innerHTML = `
          <div class="stack" style="gap:4px;flex:1;">
            <div class="txt-body-lg" style="font-weight:700;">${fmtTanggalPanjang(r.tanggal)}</div>
            <div class="txt-body muted" style="font-size:13.5px;">${r.keterangan || 'Tanpa catatan tambahan'}</div>
          </div>
          <div class="row gap12">
            <span class="chip ${r.alasan} selected" style="height: 32px; padding: 0 12px; font-size:12px; border:none; font-weight:700;">${r.alasan === 'data_lama' ? 'DATA LAMA' : r.alasan.toUpperCase()}</span>
            <button class="btn-icon statelayer btn-quick-delete" data-id="${r.id}" style="width:40px;height:40px;color:var(--clr-error);">${svg('trash')}</button>
          </div>
        `;
        card.onclick = () => { haptic(); openEditRiwayat(r); };
        $('.btn-quick-delete', card).onclick = (e) => {
          e.stopPropagation();
          showDialog({
            title: 'Hapus catatan ini?',
            body: 'Dapat dipulihkan kapan saja lewat menu Baru Saja Dihapus dalam 30 hari.',
            actions: [
              { label: 'Batal', style: 'btn-text' },
              { label: 'Hapus', style: 'btn-filled', onClick: () => {
                haptic();
                r.dihapusPada = Date.now();
                dbSaveDebounced();
                syncActiveTabUI();
                renderContent();
                showSnackbar('Catatan dihapus');
              }}
            ]
          });
        };
        timeline.appendChild(card);
      });
      body.appendChild(timeline);
    }

    renderContent();
  }, { title: 'Detail Presensi Kelas', fullscreen: true });
}

function renderFab(context){
  const wrap = $('#fab-wrap'); wrap.innerHTML='';
  const fabScrim = $('#fab-scrim');
  fabScrim.classList.remove('show');

  const options = el('div','fab-options');
  const optPindah = el('button','fab mini fab-option statelayer');
  optPindah.innerHTML = svg('swap')+'<span>Pindah Jadwal</span>';
  optPindah.onclick = ()=>{ navPop(); setTimeout(()=>{ haptic(); openPindahJadwalFlow(); },200); };
  const optAbsen = el('button','fab mini fab-option emph statelayer');
  optAbsen.innerHTML = svg('plus')+'<span>Absen</span>';
  optAbsen.onclick = ()=>{ navPop(); setTimeout(()=>{ haptic(); startAestheticAbsenFlow(); },200); };
  options.appendChild(optPindah); options.appendChild(optAbsen);

  const main = el('button','fab fab-main statelayer');
  main.innerHTML = svg('plus');
  function collapseFabMenu(){ wrap.classList.remove('open'); fabScrim.classList.remove('show'); }

  /* ---- MATERIAL 3 EXPRESSIVE: Container Transform (FAB Morphing) ----
     Override: sebelum membuka .fab-options, hitung koordinat tombol FAB
     utama relatif terhadap .fab-options lalu isi custom property
     --morph-x / --morph-y agar clip-path "tumbuh" dari titik tombol FAB. */
  main.onclick = ()=>{
    if(wrap.classList.contains('open')){ navPop(); }
    else{
      haptic(30);
      const mainRect = main.getBoundingClientRect();
      const optsRect = options.getBoundingClientRect();
      const originX = (mainRect.left + mainRect.width / 2) - optsRect.left;
      const originY = (mainRect.top + mainRect.height / 2) - optsRect.top;
      options.style.setProperty('--morph-x', originX + 'px');
      options.style.setProperty('--morph-y', originY + 'px');
      wrap.classList.add('open'); fabScrim.classList.add('show'); navPush({type:'fabmenu', close:collapseFabMenu});
    }
  };
  fabScrim.onclick = ()=>{ if(wrap.classList.contains('open')) navPop(); };

  wrap.appendChild(options); wrap.appendChild(main);
}

/* =========================================================
   AESTHETIC ABSEN FLOW — STEP-BY-STEP (MATERIAL YOU)
   ========================================================= */
const FLOW = {
  courses: [],      // Array jadwal matkul efektif hari ini
  results: {},      // Map untuk menyimpan respon: { matkulId: { absent: bool, alasan: string, keterangan: string } }
  currentIndex: 0,  // Indeks matkul yang sedang dikonfigurasi saat ini
  history: []       // Stack function renderer sebelumnya untuk handle back button bertingkat
};

function startAestheticAbsenFlow() {
  const jadwalHariIni = jadwalEfektifTanggal(todayISO());
  if (jadwalHariIni.length === 0) {
    showSnackbar('Tidak ada jadwal kuliah terdaftar untuk hari ini.');
    return;
  }

  // Reset State Flow
  FLOW.courses = [];
  FLOW.results = {};
  FLOW.currentIndex = 0;
  FLOW.history = [];
  FLOW.uniformEntries = [];

  // Pindah layar ke scr-absen-flow
  showScreen('scr-absen-flow');

  // Push navigasi global utama
  navPush({
    type: 'absen-flow',
    close: () => {
      showScreen('scr-main');
      syncActiveTabUI();
    },
    confirmExit: {
      title: 'Batalkan Pengisian?',
      body: 'Konfigurasi absen yang sedang kamu rancang tidak akan tersimpan.'
    }
  });

  renderFlowStep1();
}

function renderFlowHeader(stepTitle, stepPercent, ctx) {
  ctx = ctx || { screenId: 'scr-absen-flow', history: FLOW.history };
  const root = $('#'+ctx.screenId);

  let header = $('.flow-header', root);
  if (!header) {
    header = el('div', 'flow-header');
    root.appendChild(header);
  }
  header.innerHTML = `
    <button class="btn-icon statelayer" id="flow-back-btn">${svg('back')}</button>
    <span class="txt-title-sm" style="font-family: var(--font-display); font-weight:700; font-size:17px; letter-spacing:-0.1px;">${stepTitle}</span>
    <span class="btn-icon" style="visibility:hidden;" aria-hidden="true"></span>
  `;

  const TOTAL_DOTS = 6;
  const activeIdx = Math.max(0, Math.min(TOTAL_DOTS - 1, Math.round((stepPercent / 100) * (TOTAL_DOTS - 1))));

  let indicators = $('.flow-capsule-indicators', root);
  if (!indicators) {
    indicators = el('div', 'flow-capsule-indicators');
    root.appendChild(indicators);
  }
  indicators.innerHTML = '';
  for (let i = 0; i < TOTAL_DOTS; i++) {
    const cls = 'flow-capsule-dot' + (i < activeIdx ? ' done' : '') + (i === activeIdx ? ' active' : '');
    indicators.appendChild(el('div', cls));
  }

  // Bind Buttons
  $('#flow-back-btn', header).onclick = () => {
    if (ctx.history.length > 0) {
      haptic(20);
      const prevStep = ctx.history.pop();
      prevStep();
    } else {
      navPop();
    }
  };

}

function getFlowBody(ctx) {
  ctx = ctx || { screenId: 'scr-absen-flow' };
  const root = $('#'+ctx.screenId);
  let body = $('.flow-body', root);
  if (!body) {
    body = el('div', 'flow-body');
    root.appendChild(body);
  }
  body.innerHTML = '';
  return body;
}

/* ---- STEP 1: SELECT SIFTING FILTER ---- */
function renderFlowStep1() {
  renderFlowHeader('Penyaringan Absen', 15);
  const body = getFlowBody();

  const wrap = el('div', 'flow-body-content');
  wrap.innerHTML = `
    <h1 class="flow-title-large">Tidak hadir di mata kuliah apa saja hari ini?</h1>
    <div class="flow-grid-2x2">
      <button class="flow-btn-large statelayer" id="flow-opt-all">
        ${svg('calendar')}
        <span class="flow-btn-title">Semua Kelas</span>
        <span class="flow-btn-desc">Absen semua jadwal</span>
      </button>
      <button class="flow-btn-large statelayer" id="flow-opt-online">
        ${svg('wifi')}
        <span class="flow-btn-title">Online Saja</span>
        <span class="flow-btn-desc">Saring kelas daring</span>
      </button>
      <button class="flow-btn-large statelayer" id="flow-opt-offline">
        ${svg('offline')}
        <span class="flow-btn-title">Offline Saja</span>
        <span class="flow-btn-desc">Saring kelas tatap muka</span>
      </button>
      <button class="flow-btn-large statelayer" id="flow-opt-manual">
        ${svg('edit')}
        <span class="flow-btn-title">Pilih Manual</span>
        <span class="flow-btn-desc">Pilih sendiri secara manual</span>
      </button>
    </div>
  `;
  body.appendChild(wrap);

  const rawToday = jadwalEfektifTanggal(todayISO()).filter(j => !sudahAbsenPadaTanggal(j.matkulId, todayISO()) && absenTerpakaiUntukMatkul(j.matkulId) < limitUntukMatkul(matkulById(j.matkulId)));

  const handleFilterSelection = (filtered) => {
    haptic();
    if (filtered.length === 0) {
      showSnackbar('Tidak ada mata kuliah yang cocok dengan kriteria filter.');
      return;
    }
    FLOW.courses = filtered;
    FLOW.currentIndex = 0;
    FLOW.history.push(() => renderFlowStep1());
    processCurrentCourse();
  };

  $('#flow-opt-all', wrap).onclick = () => {
    haptic();
    if (rawToday.length === 0) {
      showSnackbar('Tidak ada mata kuliah yang cocok dengan kriteria filter.');
      return;
    }
    FLOW.history.push(() => renderFlowStep1());
    startUniformAbsenFlow(rawToday);
  };
  $('#flow-opt-online', wrap).onclick = () => handleFilterSelection(rawToday.filter(j => j.mode === 'online'));
  $('#flow-opt-offline', wrap).onclick = () => handleFilterSelection(rawToday.filter(j => j.mode === 'offline'));
  
  $('#flow-opt-manual', wrap).onclick = () => {
    haptic();
    FLOW.history.push(() => renderFlowStep1());
    renderFlowManualSelection();
  };
}

/* ---- OPSI "SEMUA KELAS": ABSEN SERAGAM LANGSUNG (2 HALAMAN) ---- */
function startUniformAbsenFlow(courses) {
  FLOW.courses = courses;
  renderUniformReasonPage();
}

function renderUniformReasonPage() {
  renderFlowHeader('Absen Semua Kelas', 55);
  const body = getFlowBody();

  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  const listHtml = FLOW.courses.map(j => {
    const m = matkulById(j.matkulId);
    return `<div class="card-outlined row between" style="padding:14px 18px;max-width:320px;width:100%;border-width:2px;">
      <span class="txt-body-lg" style="font-weight:700;">${m ? m.namaLengkap : '-'}</span>
      <span class="txt-body muted" style="font-size:13px;font-weight:500;">${j.jamMulai} - ${j.jamSelesai}</span>
    </div>`;
  }).join('');

  wrap.innerHTML = `
    <h1 class="flow-title-large">Kenapa<br>tidak hadir<br>semua kelas<br>hari ini?</h1>
    <div class="stack gap8 mt8" style="width:100%;max-width:320px;margin:8px auto 0;">${listHtml}</div>

    <div class="flow-choices-stack" style="margin-top:16px;">
      <button class="flow-btn-choice izin statelayer" id="btn-uniform-izin">
        <div class="stack" style="text-align:left;gap:2px;">
          <span style="font-weight:700;">Izin</span>
          <span style="font-size:11px;font-weight:500;opacity:0.8;">Ada keperluan darurat di luar</span>
        </div>
        ${svg('arrowR')}
      </button>
      <button class="flow-btn-choice sakit statelayer" id="btn-uniform-sakit">
        <div class="stack" style="text-align:left;gap:2px;">
          <span style="font-weight:700;">Sakit</span>
          <span style="font-size:11px;font-weight:500;opacity:0.8;">Kondisi kesehatan kurang baik</span>
        </div>
        ${svg('arrowR')}
      </button>
      <button class="flow-btn-choice bolos statelayer" id="btn-uniform-bolos">
        <div class="stack" style="text-align:left;gap:2px;">
          <span style="font-weight:700;">Bolos</span>
          <span style="font-size:11px;font-weight:500;opacity:0.8;">Tanpa keterangan yang mendesak</span>
        </div>
        ${svg('arrowR')}
      </button>
    </div>
  `;
  body.appendChild(wrap);

  const pick = (alasan) => {
    haptic();
    commitUniformAbsen(alasan);
    FLOW.history.push(() => renderUniformReasonPage());
    renderUniformSharePage();
  };
  $('#btn-uniform-izin', wrap).onclick = () => pick('izin');
  $('#btn-uniform-sakit', wrap).onclick = () => pick('sakit');
  $('#btn-uniform-bolos', wrap).onclick = () => pick('bolos');
}

function commitUniformAbsen(alasan) {
  const today = todayISO();
  FLOW.uniformEntries = FLOW.courses.map(j => {
    const existingIdx = DB.data.riwayatAbsen.findIndex(r => r.matkulId === j.matkulId && r.tanggal === today && !r.dihapusPada);
    const entry = {
      id: existingIdx > -1 ? DB.data.riwayatAbsen[existingIdx].id : uid(),
      matkulId: j.matkulId,
      tanggal: today,
      hari: HARI[todayHariIndex()],
      alasan: alasan,
      keterangan: '',
      sudahDikirimWA: false,
      waktuDibuat: Date.now(),
      dihapusPada: null,
      overrideId: j.overrideId || null,
      semesterId: DB.data.appState.activeSemesterId,
          pengaliKehadiranSnapshot: j.pengali || 1
    };
    if (existingIdx > -1) { DB.data.riwayatAbsen[existingIdx] = entry; }
    else { DB.data.riwayatAbsen.push(entry); }
    return entry;
  });
  dbSaveDebounced();
  markAbsenCommittedHariIni();
}

function renderUniformSharePage() {
  renderFlowHeader('Bagikan ke PJ', 90);
  const body = getFlowBody();

  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  wrap.innerHTML = `
    <h1 class="flow-title-large">Bagikan laporan ketidakhadiran ke PJ</h1>
    <div class="stack gap8 mt8" id="uniform-share-list" style="width:100%;max-width:320px;margin:8px auto 0;"></div>
    <div class="flow-footer-actions" style="margin-top:24px;">
      <button class="btn btn-filled statelayer" id="btn-uniform-finish" style="height:52px;font-size:16px;">Selesai</button>
    </div>
  `;
  body.appendChild(wrap);

  const host = $('#uniform-share-list', wrap);
  FLOW.uniformEntries.forEach(entry => {
    const m = matkulById(entry.matkulId);
    if (!m) return;
    const item = el('div', 'card-outlined row between');
    item.style.padding = '12px 16px';
    item.style.width = '100%';
    item.style.borderWidth = '2px';
    item.innerHTML = `
      <span class="txt-body-lg" style="font-weight:700;">${m.namaLengkap}</span>
      <button class="btn-icon statelayer" data-matkul="${m.id}" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);width:44px;height:44px;">${svg('send')}</button>
    `;
    const shareBtn = $('button', item);
    shareBtn.onclick = () => {
      haptic();
      const text = generatePesanWA([{ matkulId: entry.matkulId, alasan: entry.alasan, keterangan: entry.keterangan, tanggal: entry.tanggal }]);
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        grid_wa(text);
      }
      entry.sudahDikirimWA = true;
      const idx = DB.data.riwayatAbsen.findIndex(r => r.id === entry.id);
      if (idx > -1) { DB.data.riwayatAbsen[idx].sudahDikirimWA = true; dbSaveDebounced(); }
      shareBtn.style.background = 'var(--clr-primary)';
      shareBtn.style.color = 'var(--clr-on-primary)';
      shareBtn.innerHTML = svg('check');
    };
    host.appendChild(item);
  });

  $('#btn-uniform-finish', wrap).onclick = () => {
    haptic();
    navPop();
    showSnackbar('Konfigurasi laporan absensi berhasil disimpan!');
    renderDashboard();
  };
}

// Wrapper WA helper
function grid_wa(text){ kirimWA(text); }

/* ---- STEP 1B: MANUAL SELECT ---- */
function renderFlowManualSelection() {
  renderFlowHeader('Pilih Manual', 25);
  const body = getFlowBody();
  const rawToday = jadwalEfektifTanggal(todayISO()).filter(j => !sudahAbsenPadaTanggal(j.matkulId, todayISO()));

  // FIX: `wrap` sebelumnya tidak pernah dideklarasikan (ReferenceError),
  // sehingga konten "Pilih Manual" gagal ter-render sama sekali.
  const wrap = el('div', 'flow-body-content');
  wrap.style.paddingTop = '16px';

  wrap.innerHTML = `
    <h1 class="flow-title-large">Centang mata kuliah yang tidak hadir hari ini</h1>
    <div class="stack gap12 mt8" style="width: 100%; max-width: 320px; text-align: left; margin: 8px auto 0;" id="manual-list-host"></div>
    <div class="flow-footer-actions">
      <button class="btn btn-filled statelayer" id="btn-manual-confirm" style="height:52px;font-size:16px;">Lanjut</button>
    </div>
  `;
  body.appendChild(wrap);

  const host = $('#manual-list-host', wrap);
  rawToday.forEach(j => {
    const m = matkulById(j.matkulId);
    if (!m) return;
    const item = el('div', 'card-outlined row gap16 statelayer');
    item.style.cursor = 'pointer';
    item.style.padding = '14px 18px';
    item.style.maxWidth = '360px';
    item.style.width = '100%';
    item.style.borderWidth = '2px';
    item.innerHTML = `
      <input type="checkbox" class="manual-flow-chk" data-matkul="${m.id}" style="width:24px;height:24px;">
      <div class="stack" style="gap:2px;">
        <span class="txt-body-lg" style="font-weight:700;">${m.namaLengkap}</span>
        <span class="txt-body muted" style="font-size:12.5px;font-weight:500;">${j.jamMulai} - ${j.jamSelesai}</span>
      </div>
    `;
    item.onclick = (e) => {
      if (e.target.tagName !== 'INPUT') {
        const chk = $('input', item);
        chk.checked = !chk.checked;
      }
    };
    host.appendChild(item);
  });

  $('#btn-manual-confirm', wrap).onclick = () => {
    const checkedBoxes = $$('.manual-flow-chk:checked', host);
    if (checkedBoxes.length === 0) {
      showSnackbar('Pilih minimal satu mata kuliah untuk melanjutkan.');
      return;
    }
    const selectedIds = checkedBoxes.map(chk => chk.dataset.matkul);
    FLOW.courses = rawToday.filter(j => selectedIds.includes(j.matkulId));
    FLOW.currentIndex = 0;
    FLOW.history.push(() => renderFlowManualSelection());
    processCurrentCourse();
  };
}

/* ---- CONTROL LOOP FOR EACH COURSE ---- */
function processCurrentCourse() {
  if (FLOW.currentIndex >= FLOW.courses.length) {
    renderFlowRecap();
    return;
  }
  renderQuestionA();
}

/* ---- QUESTION A: ABSEN GA? ---- */
function renderQuestionA() {
  const index = FLOW.currentIndex;
  const courseConfig = FLOW.courses[index];
  const m = matkulById(courseConfig.matkulId);

  const stepPercent = 30 + Math.round((index / FLOW.courses.length) * 50);
  renderFlowHeader(`Matkul ${index + 1} dari ${FLOW.courses.length}`, stepPercent);

  const body = getFlowBody();
  const wrap = el('div', 'flow-body-content');

  wrap.innerHTML = `
    <h1 class="flow-title-large">Apakah kamu hadir di kelas <b style="color: var(--clr-primary); font-style: italic; font-weight: 800;">${m.namaLengkap}</b> hari ini?</h1>
    <p class="flow-subtitle">Waktu perkuliahan: ${courseConfig.jamMulai} - ${courseConfig.jamSelesai}</p>
    
    <div class="flow-choices-stack">
      <button class="flow-btn-choice primary statelayer" id="btn-choice-tidak">
        <span>Tidak</span>
        ${svg('arrowR')}
      </button>
      <button class="flow-btn-choice tonal statelayer" id="btn-choice-ya">
        <span>Ya</span>
        ${svg('check')}
      </button>
    </div>
  `;
  body.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));

  $('#btn-choice-tidak', wrap).onclick = () => {
    haptic();
    FLOW.results[m.id] = { absent: true, alasan: 'izin', keterangan: '' };
    FLOW.history.push(() => renderQuestionA());
    renderQuestionB();
  };

  $('#btn-choice-ya', wrap).onclick = () => {
    haptic();
    FLOW.results[m.id] = { absent: false };
    FLOW.history.push(() => renderQuestionA());
    FLOW.currentIndex++;
    processCurrentCourse();
  };
}

/* ---- QUESTION B: PILIH ALASAN ---- */
function renderQuestionB() {
  const index = FLOW.currentIndex;
  const courseConfig = FLOW.courses[index];
  const m = matkulById(courseConfig.matkulId);

  const stepPercent = 35 + Math.round((index / FLOW.courses.length) * 50);
  renderFlowHeader(`Alasan (${index + 1}/${FLOW.courses.length})`, stepPercent);

  const body = getFlowBody();
  const wrap = el('div', 'flow-body-content');

  wrap.innerHTML = `
    <h1 class="flow-title-large">Mengapa <b>tidak hadir</b> di kelas <b style="color: var(--clr-primary); font-style: italic; font-weight: 800;">${m.namaLengkap}</b>?</h1>
    
    <div class="flow-choices-stack">
      <button class="flow-btn-choice izin statelayer" id="btn-reason-izin">
        <div class="stack" style="text-align:left;gap:2px;">
          <span style="font-weight:700;">Izin</span>
          <span style="font-size:11px;font-weight:500;opacity:0.8;">Ada keperluan darurat di luar</span>
        </div>
        ${svg('arrowR')}
      </button>
      
      <button class="flow-btn-choice sakit statelayer" id="btn-reason-sakit">
        <div class="stack" style="text-align:left;gap:2px;">
          <span style="font-weight:700;">Sakit</span>
          <span style="font-size:11px;font-weight:500;opacity:0.8;">Kondisi kesehatan kurang baik</span>
        </div>
        ${svg('arrowR')}
      </button>
      
      <button class="flow-btn-choice bolos statelayer" id="btn-reason-bolos">
        <div class="stack" style="text-align:left;gap:2px;">
          <span style="font-weight:700;">Bolos</span>
          <span style="font-size:11px;font-weight:500;opacity:0.8;">Tanpa keterangan yang mendesak</span>
        </div>
        ${svg('arrowR')}
      </button>
    </div>
  `;
  body.appendChild(wrap);

  const saveReasonAndNext = (reason) => {
    haptic();
    FLOW.results[m.id].alasan = reason;
    FLOW.history.push(() => renderQuestionB());
    renderQuestionC();
  };

  $('#btn-reason-izin', wrap).onclick = () => saveReasonAndNext('izin');
  $('#btn-reason-sakit', wrap).onclick = () => saveReasonAndNext('sakit');
  $('#btn-reason-bolos', wrap).onclick = () => saveReasonAndNext('bolos');
}

/* ---- QUESTION C: KETERANGAN TAMBAHAN ---- */
function renderQuestionC() {
  const index = FLOW.currentIndex;
  const courseConfig = FLOW.courses[index];
  const m = matkulById(courseConfig.matkulId);

  if (DB.data.settings.muteKeteranganSelamanya) {
    FLOW.results[m.id].keterangan = '';
    FLOW.history.push(() => renderQuestionC());
    renderQuestionD();
    return;
  }

  const stepPercent = 40 + Math.round((index / FLOW.courses.length) * 50);
  renderFlowHeader(`Keterangan (${index + 1}/${FLOW.courses.length})`, stepPercent);

  const body = getFlowBody();
  const wrap = el('div', 'flow-body-content');

  wrap.innerHTML = `
    <h1 class="flow-title-large">Ingin menambahkan catatan khusus?</h1>
    
    <div class="flow-input-container">
      <textarea class="flow-textarea" id="flow-notes-area" placeholder="Tulis catatan di sini..."></textarea>
      
      <div class="flow-footer-actions">
        <button class="btn btn-filled statelayer" id="btn-notes-save" style="height:52px;font-size:16px;">Simpan & Lanjut</button>
        <button class="btn btn-text statelayer" id="btn-notes-skip" style="height:44px;">Lewati Catatan</button>
        <button class="btn-text statelayer text-mute-notes" id="btn-mute-notes-forever" style="align-self:center;color:var(--clr-on-surface-variant);font-weight:700;margin-top:8px;">Bisukan Keterangan Selamanya</button>
      </div>
    </div>
  `;
  body.appendChild(wrap);

  const notesArea = $('#flow-notes-area', wrap);

  $('#btn-notes-save', wrap).onclick = () => {
    haptic();
    FLOW.results[m.id].keterangan = notesArea.value.trim();
    FLOW.history.push(() => renderQuestionC());
    renderQuestionD();
  };

  $('#btn-notes-skip', wrap).onclick = () => {
    haptic();
    FLOW.results[m.id].keterangan = '';
    FLOW.history.push(() => renderQuestionC());
    renderQuestionD();
  };

  $('#btn-mute-notes-forever', wrap).onclick = () => {
    haptic();
    DB.data.settings.muteKeteranganSelamanya = true;
    dbSaveDebounced();
    FLOW.results[m.id].keterangan = '';
    FLOW.history.push(() => renderQuestionC());
    renderQuestionD();
  };
}

/* ---- QUESTION D: BAGIKAN KE PJ (PER MATKUL) ---- */
function renderQuestionD() {
  const index = FLOW.currentIndex;
  const courseConfig = FLOW.courses[index];
  const m = matkulById(courseConfig.matkulId);

  if (DB.data.settings.muteKirimPJSelamanya) {
    FLOW.results[m.id].sudahDikirimWA = false;
    FLOW.currentIndex++;
    processCurrentCourse();
    return;
  }

  const res = FLOW.results[m.id];
  const alasanKata = { izin: 'Izin', sakit: 'Sakit', bolos: 'Tidak Hadir' };

  const stepPercent = 45 + Math.round((index / FLOW.courses.length) * 50);
  renderFlowHeader(`Bagikan (${index + 1}/${FLOW.courses.length})`, stepPercent);

  const body = getFlowBody();
  const wrap = el('div', 'flow-body-content');

  wrap.innerHTML = `
    <h1 class="flow-title-large">Bagikan laporan ke PJ kelas <b style="color: var(--clr-primary); font-style: italic; font-weight: 800;">${m.namaLengkap}</b>?</h1>
    
    <div class="flow-choices-stack">
      <button class="flow-btn-choice primary statelayer" id="btn-share-pj">
        ${svg('send')}
        <span>Bagikan ke PJ</span>
      </button>
      <button class="flow-btn-choice tonal statelayer" id="btn-share-skip">
        <span>Lewati</span>
        ${svg('arrowR')}
      </button>
      <button class="btn-text statelayer text-mute-forever" id="btn-mute-pj-forever" style="align-self:center;color:var(--clr-on-surface-variant);font-weight:700;margin-top:12px;">Bisukan Ini Selamanya</button>
    </div>
  `;
  body.appendChild(wrap);

  const goNext = () => {
    const idxSnapshot = index;
    FLOW.history.push(() => { FLOW.currentIndex = idxSnapshot; renderQuestionD(); });
    FLOW.currentIndex++;
    processCurrentCourse();
  };

  $('#btn-mute-pj-forever', wrap).onclick = () => {
    haptic();
    DB.data.settings.muteKirimPJSelamanya = true;
    dbSaveDebounced();
    goNext();
  };

  const skipBtn = $('#btn-share-skip', wrap);

  $('#btn-share-pj', wrap).onclick = () => {
    haptic();
    res.sudahDikirimWA = true;
    const text = generatePesanWA([{ matkulId: m.id, alasan: res.alasan, keterangan: res.keterangan, tanggal: todayISO() }]);
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      kirimWA(text);
    }
    skipBtn.innerHTML = `<span>Lanjutkan</span>${svg('arrowR')}`;
  };

  skipBtn.onclick = () => {
    haptic();
    if (!res.sudahDikirimWA) res.sudahDikirimWA = false;
    goNext();
  };
}

/* ---- RECAP & SAVE ---- */
function renderFlowRecap() {
  renderFlowHeader('Ringkasan', 95);
  const body = getFlowBody();

  const absences = [];
  FLOW.courses.forEach(j => {
    const res = FLOW.results[j.matkulId];
    if (res && res.absent) {
      absences.push({
        courseConfig: j,
        matkulId: j.matkulId,
        alasan: res.alasan,
        keterangan: res.keterangan,
        sudahDikirimWA: !!res.sudahDikirimWA
      });
    }
  });

  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  if (absences.length === 0) {
    wrap.innerHTML = `
      <div style="margin-top: 40px; color: var(--clr-primary);">${svg('check', 'icon')}</div>
      <h1 class="flow-title-large" style="margin-top: 16px;">Semua aman terkendali!</h1>
      <div class="flow-footer-actions" style="margin-top: 24px;">
        <button class="btn btn-filled statelayer" id="btn-finish-all" style="height:52px;">Selesai & Balik</button>
      </div>
    `;
    body.appendChild(wrap);
    $('#btn-finish-all', wrap).onclick = () => {
      haptic();
      markAbsenCommittedHariIni();
      navPop();
    };
    return;
  }

  wrap.innerHTML = `
    <h1 class="flow-title-large">Periksa kembali rekapnya</h1>
    <div class="stack gap12 mt8" style="width:100%;max-width:320px;margin:8px auto 0;" id="recap-list-host"></div>
    <div class="flow-footer-actions" style="margin-top: 16px;">
      <button class="btn btn-filled statelayer" id="btn-recap-save" style="height:52px;font-size:16px;">Simpan</button>
    </div>
  `;
  body.appendChild(wrap);

  const host = $('#recap-list-host', wrap);
  absences.forEach(a => {
    const m = matkulById(a.matkulId);
    if (!m) return;
    const item = el('div', 'recap-item-card');
    item.style.borderWidth = '2px';
    item.innerHTML = `
      <div class="stack" style="gap:2px;">
        <span class="txt-title-sm" style="font-size:14.5px;font-weight:700;">${m.namaLengkap}</span>
        <span class="txt-body muted" style="font-size:12px;font-weight:500;">${a.keterangan || 'Tanpa catatan'}</span>
        <span class="txt-body muted" style="font-size:11px;font-weight:600;color:${a.sudahDikirimWA ? 'var(--clr-primary)' : 'var(--clr-on-surface-variant)'};">${a.sudahDikirimWA ? 'Sudah dibagikan ke PJ' : 'Belum dibagikan ke PJ'}</span>
      </div>
      <span class="chip ${a.alasan} selected" style="pointer-events:none;height:28px;padding: 0 10px;font-size:11px;border:none;font-weight:700;">${a.alasan.toUpperCase()}</span>
    `;
    host.appendChild(item);
  });

  const saveToDatabase = () => {
    const today = todayISO();
    const saveEntries = [];

    absences.forEach(a => {
      const existingIdx = DB.data.riwayatAbsen.findIndex(r => r.matkulId === a.matkulId && r.tanggal === today && !r.dihapusPada);
      const entry = {
        id: existingIdx > -1 ? DB.data.riwayatAbsen[existingIdx].id : uid(),
        matkulId: a.matkulId,
        tanggal: today,
        hari: HARI[todayHariIndex()],
        alasan: a.alasan,
        keterangan: a.keterangan,
        sudahDikirimWA: a.sudahDikirimWA,
        waktuDibuat: Date.now(),
        dihapusPada: null,
        overrideId: a.courseConfig.overrideId || null,
        semesterId: DB.data.appState.activeSemesterId,
          pengaliKehadiranSnapshot: a.courseConfig.pengali || 1
      };

      if (existingIdx > -1) {
        DB.data.riwayatAbsen[existingIdx] = entry;
      } else {
        DB.data.riwayatAbsen.push(entry);
      }
      saveEntries.push(entry);
    });

    dbSaveDebounced();
    markAbsenCommittedHariIni();
    navPop();
    showSnackbar('Konfigurasi laporan absensi berhasil disimpan!');
    renderDashboard();
  };

  $('#btn-recap-save', wrap).onclick = () => {
    haptic();
    saveToDatabase();
  };
}

/* =========================================================
   PINDAH JADWAL — WIZARD STEP-BY-STEP (setara dengan wizard Tambah Absen)
   ========================================================= */
const PJ = {
  matkulId: null,
  hariBaru: null,
  jamMulai: '08:00',
  jamSelesai: '10:00',
  tanggalBerlaku: null,
  durasi: 'mingguIni',
  pengaliAktif: false,
  pengaliKehadiran: 2,
  history: []
};
const PJ_CTX = { screenId: 'scr-pindah-flow', history: PJ.history };
const PJ_DUR_OPTS = [
  ['mingguIni', 'Cuma Minggu Ini', 'Berlaku sekali saja untuk minggu ini'],
  ['duaMinggu', 'Minggu Ini + Depan', 'Berlaku 2 minggu berturut-turut'],
  ['permanen', 'Permanen', 'Berlaku seterusnya sampai diubah lagi'],
  ['double', 'Jadwal Tambahan', 'Nambah kelas, bukan gantikan yang lama']
];

function openPindahJadwalFlow(){
  const kelasAktif = matkulSemesterAktif().filter(m => !m.arsip);
  if(kelasAktif.length === 0){
    showSnackbar('Belum ada mata kuliah terdaftar.');
    return;
  }
  PJ.matkulId = null;
  PJ.hariBaru = null;
  PJ.jamMulai = '08:00';
  PJ.jamSelesai = '10:00';
  PJ.tanggalBerlaku = todayISO();
  PJ.durasi = 'mingguIni';
  PJ.pengaliAktif = false;
  PJ.pengaliKehadiran = 2;
  PJ.history.length = 0;

  showScreen('scr-pindah-flow');
  navPush({
    type: 'pindah-flow',
    close: () => { showScreen('scr-main'); syncActiveTabUI(); },
    confirmExit: {
      title: 'Batalkan Pemindahan?',
      body: 'Pengaturan jadwal baru yang sedang kamu rancang tidak akan tersimpan.'
    }
  });

  renderPJStep1();
}

/* ---- STEP 1: PILIH KELAS ---- */
function renderPJStep1(){
  renderFlowHeader('Pindah Jadwal', 8, PJ_CTX);
  const body = getFlowBody(PJ_CTX);
  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  const kelasAktif = matkulSemesterAktif().filter(m => !m.arsip);
  wrap.innerHTML = `
    <h1 class="flow-title-large">Kelas mana yang mau dipindah?</h1>
    <div class="stack gap12 mt8" style="width:100%;max-width:320px;margin:8px auto 0;" id="pj-kelas-host"></div>
    <div class="flow-footer-actions">
      <button class="btn btn-filled statelayer" id="pj-step1-next" style="height:52px;font-size:16px;">Lanjut</button>
    </div>
  `;
  body.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));

  const host = $('#pj-kelas-host', wrap);
  kelasAktif.forEach(m => {
    const item = el('div', 'card-outlined row between statelayer');
    item.style.cssText = 'cursor:pointer;padding:14px 18px;border-width:2px;';
    item.dataset.id = m.id;
    item.innerHTML = `
      <div class="stack" style="gap:2px;">
        <span class="txt-body-lg" style="font-weight:700;">${m.namaLengkap}</span>
        <span class="txt-body muted" style="font-size:12.5px;font-weight:500;">${m.hari}, ${m.jamMulai}-${m.jamSelesai}</span>
      </div>
      <span class="pj-check" style="opacity:0;color:var(--clr-primary);">${svg('check')}</span>
    `;
    item.onclick = () => {
      haptic();
      PJ.matkulId = m.id;
      $$('.card-outlined', host).forEach(x => { 
        x.style.borderColor = 'var(--clr-outline-variant)'; 
        x.style.background = 'var(--clr-surface)'; 
        x.style.borderRadius = 'var(--shape-lg)';
        $('.pj-check', x).style.opacity = '0'; 
      });
      item.style.borderColor = 'var(--clr-primary)'; 
      item.style.background = 'var(--clr-primary-container)'; 
      item.style.borderRadius = 'var(--shape-lg) var(--shape-xs) var(--shape-lg) var(--shape-lg)';
      $('.pj-check', item).style.opacity = '1';
    };
    host.appendChild(item);
  });

  $('#pj-step1-next', wrap).onclick = () => {
    if(!PJ.matkulId){ showSnackbar('Pilih dulu kelas yang mau dipindah'); return; }
    haptic();
    const m = matkulById(PJ.matkulId);
    PJ.hariBaru = m.hari; PJ.jamMulai = m.jamMulai; PJ.jamSelesai = m.jamSelesai;
    PJ.history.push(() => renderPJStep1());
    renderPJStep2();
  };
}

/* ---- STEP 2: PILIH HARI BARU ---- */
function renderPJStep2(){
  const m = matkulById(PJ.matkulId);
  renderFlowHeader('Hari Baru', 24, PJ_CTX);
  const body = getFlowBody(PJ_CTX);
  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  let selected = PJ.hariBaru || m.hari;

  const hariUrut = HARI.slice(1).concat(HARI[0]);
  function renderHariButtonInner(h){
    const isOrigin = h === m.hari;
    return '<span>'+h+(isOrigin ? ' <span class="pj-origin-tag">· asal</span>' : '')+'</span>' + (h === selected ? svg('check') : '');
  }
  function hariBtnClass(h){
    const isOrigin = h === m.hari;
    return 'flow-btn-choice compact ' + (h === selected ? 'primary' : 'tonal') + (isOrigin ? ' origin-day' : '');
  }
  const listHtml = hariUrut.map(h => `
    <button class="${hariBtnClass(h)}" data-h="${h}">
      ${renderHariButtonInner(h)}
    </button>
  `).join('');

  wrap.innerHTML = `
    <h1 class="flow-title-large">Kelas <b style="color: var(--clr-primary); font-style: italic; font-weight: 800;">${m.namaLengkap}</b> pindahnya ke hari apa nih?</h1>
    <div class="flow-choices-stack" style="gap:8px;max-height:100%;margin-top:0;">${listHtml}</div>
    <div class="flow-footer-actions" style="margin-top:14px;">
      <button class="flow-btn-choice primary statelayer" id="pj-confirm-hari" style="justify-content:center;text-align:center;">
        <span id="pj-confirm-hari-label"></span>
      </button>
    </div>
    <div style="height: 64px; flex-shrink: 0;"></div>
  `;
  body.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));

  const confirmLabel = $('#pj-confirm-hari-label', wrap);
  function updateConfirmLabel(){
    confirmLabel.textContent = (selected === m.hari)
      ? 'Tetap di hari ' + m.hari
      : 'Pindah dari ' + m.hari + ' ke ' + selected;
  }
  updateConfirmLabel();

  $$('.flow-btn-choice[data-h]', wrap).forEach(btn => {
    btn.onclick = () => {
      haptic();
      selected = btn.dataset.h;
      $$('.flow-btn-choice[data-h]', wrap).forEach(x => {
        const active = x.dataset.h === selected;
        x.classList.toggle('primary', active);
        x.classList.toggle('tonal', !active);
        x.innerHTML = renderHariButtonInner(x.dataset.h);
      });
      updateConfirmLabel();
    };
  });

  $('#pj-confirm-hari', wrap).onclick = () => {
    haptic();
    PJ.hariBaru = selected;
    PJ.history.push(() => renderPJStep2());
    renderPJStep3();
  };
}

/* ---- STEP 3: ATUR JAM BARU ---- */
function renderPJStep3(){
  renderFlowHeader('Jam Baru', 42, PJ_CTX);
  const body = getFlowBody(PJ_CTX);
  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  wrap.innerHTML = `
    <h1 class="flow-title-large">Jam berapa kelasnya yang baru, nih?</h1>
    <p class="flow-subtitle">Atur jam mulai dan jam selesai untuk jadwal barunya.</p>
    <div class="flow-input-container">
      <div class="row gap12">
        <div class="field" style="flex:1;"><label>Jam Mulai</label><input type="time" id="pj-jam1" value="${PJ.jamMulai}"></div>
        <div class="field" style="flex:1;"><label>Jam Selesai</label><input type="time" id="pj-jam2" value="${PJ.jamSelesai}"></div>
      </div>
      <div class="flow-footer-actions">
        <button class="btn btn-filled statelayer" id="pj-step3-next" style="height:52px;font-size:16px;">Lanjut</button>
      </div>
    </div>
  `;
  body.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));

  $('#pj-step3-next', wrap).onclick = () => {
    const j1 = $('#pj-jam1', wrap).value, j2 = $('#pj-jam2', wrap).value;
    if(hmToMin(j2) <= hmToMin(j1)){ showSnackbar('Jam selesai harus lebih telat dari jam mulai'); return; }
    haptic();
    PJ.jamMulai = j1; PJ.jamSelesai = j2;
    PJ.history.push(() => renderPJStep3());
    renderPJStep4();
  };
}

/* ---- STEP 4: TANGGAL MULAI & DURASI BERLAKU ---- */
function renderPJStep4(){
  renderFlowHeader('Durasi Berlaku', 58, PJ_CTX);
  const body = getFlowBody(PJ_CTX);
  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  const durHtml = PJ_DUR_OPTS.map(([v, label, desc]) => `
    <button class="flow-btn-choice ${v === PJ.durasi ? 'primary' : 'tonal'} statelayer" data-v="${v}">
      <div class="stack" style="text-align:left;gap:2px;">
        <span style="font-weight:700;">${label}</span>
        <span style="font-size:11px;font-weight:500;opacity:0.8;">${desc}</span>
      </div>
      ${svg('arrowR')}
    </button>
  `).join('');

  wrap.innerHTML = `
    <h1 class="flow-title-large">Perubahan ini berlaku mulai kapan?</h1>
    <div class="flow-input-container" style="margin-top:0;">
      <div class="field"><label>Tanggal Mulai Berlaku</label><input type="date" id="pj-tanggal" value="${PJ.tanggalBerlaku || todayISO()}"></div>
    </div>
    <p class="flow-subtitle" style="margin-top:20px;">Berapa lama perubahan ini berlaku?</p>
    <div class="flow-choices-stack" style="gap:10px;margin-top:0;">${durHtml}</div>
    <div class="flow-footer-actions" id="pj-step4-next-wrap" style="margin-top:16px;">
      <button class="btn btn-filled statelayer" id="pj-step4-next" style="height:52px;font-size:16px;">Lanjut</button>
    </div>
    <div style="height: 64px; flex-shrink: 0;"></div>
  `;
  body.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));

  $$('.flow-btn-choice', wrap).forEach(btn => {
    btn.onclick = () => {
      haptic();
      PJ.durasi = btn.dataset.v;
      $$('.flow-btn-choice', wrap).forEach(x => {
        const active = x.dataset.v === PJ.durasi;
        x.classList.toggle('primary', active);
        x.classList.toggle('tonal', !active);
      });
    };
  });

  $('#pj-step4-next', wrap).onclick = () => {
    const tgl = $('#pj-tanggal', wrap).value;
    if(!tgl){ showSnackbar('Tentukan dulu tanggal mulai berlaku'); return; }
    haptic();
    PJ.tanggalBerlaku = tgl;
    PJ.history.push(() => renderPJStep4());
    renderPJStep5();
  };
}

/* ---- STEP 5: PENGALI KEHADIRAN (OPSIONAL) ---- */
function renderPJStep5(){
  renderFlowHeader('Pengali Kehadiran', 74, PJ_CTX);
  const body = getFlowBody(PJ_CTX);
  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  wrap.innerHTML = `
    <h1 class="flow-title-large">Ini setara berapa kali kehadiran?</h1>
    <p class="flow-subtitle">Kalau pertemuan ini jadi pengganti beberapa kelas sekaligus, atur pengalinya di sini.</p>
    <div class="flow-choices-stack">
      <button class="flow-btn-choice ${!PJ.pengaliAktif ? 'primary' : 'tonal'} statelayer" id="pj-pengali-normal">
        <span>Seperti Biasa (1x)</span>
        ${!PJ.pengaliAktif ? svg('check') : ''}
      </button>
      <button class="flow-btn-choice ${PJ.pengaliAktif ? 'primary' : 'tonal'} statelayer" id="pj-pengali-lebih">
        <span>Lebih dari 1x</span>
        ${PJ.pengaliAktif ? svg('check') : ''}
      </button>
    </div>
    <div class="flow-input-container ${PJ.pengaliAktif ? '' : 'hidden'}" id="pj-pengali-input-wrap" style="margin-top:8px;">
      <div class="field"><label>Setara berapa kehadiran</label><input type="number" id="pj-pengali-val" min="2" value="${PJ.pengaliKehadiran || 2}"></div>
    </div>
    <div class="flow-footer-actions" style="margin-top:16px;">
      <button class="btn btn-filled statelayer" id="pj-step5-next" style="height:52px;font-size:16px;">Lanjut</button>
    </div>
  `;
  body.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));

  const inputWrap = $('#pj-pengali-input-wrap', wrap);

  $('#pj-pengali-normal', wrap).onclick = () => {
    haptic();
    PJ.pengaliAktif = false;
    PJ.pengaliKehadiran = 1;
    $('#pj-pengali-normal', wrap).classList.remove('tonal'); $('#pj-pengali-normal', wrap).classList.add('primary');
    $('#pj-pengali-lebih', wrap).classList.remove('primary'); $('#pj-pengali-lebih', wrap).classList.add('tonal');
    inputWrap.classList.add('hidden');
  };
  $('#pj-pengali-lebih', wrap).onclick = () => {
    haptic();
    PJ.pengaliAktif = true;
    $('#pj-pengali-normal', wrap).classList.remove('primary'); $('#pj-pengali-normal', wrap).classList.add('tonal');
    $('#pj-pengali-lebih', wrap).classList.remove('tonal'); $('#pj-pengali-lebih', wrap).classList.add('primary');
    inputWrap.classList.remove('hidden');
  };
  $('#pj-step5-next', wrap).onclick = () => {
    haptic();
    if(PJ.pengaliAktif){
      PJ.pengaliKehadiran = Number($('#pj-pengali-val', wrap).value) || 2;
    }
    PJ.history.push(() => renderPJStep5());
    renderPJStep6();
  };
}

/* ---- STEP 6: RINGKASAN & SIMPAN ---- */
function renderPJStep6(){
  const m = matkulById(PJ.matkulId);
  renderFlowHeader('Ringkasan', 95, PJ_CTX);
  const body = getFlowBody(PJ_CTX);
  const wrap = el('div', 'flow-body-content');
  wrap.style.justifyContent = 'flex-start';
  wrap.style.paddingTop = '16px';

  const durLabel = (PJ_DUR_OPTS.find(d => d[0] === PJ.durasi) || [,''])[1];
  wrap.innerHTML = `
    <h1 class="flow-title-large">Yuk, periksa kembali jadwal barunya</h1>
    <div class="stack gap12 mt8" style="width:100%;max-width:320px;margin:8px auto 0;" id="pj-recap-host"></div>
    <div class="flow-footer-actions" style="margin-top:16px;">
      <button class="btn btn-filled statelayer" id="pj-btn-save" style="height:52px;font-size:16px;">Simpan Jadwal Baru</button>
    </div>
  `;
  body.appendChild(wrap);
  fitFlowTitle($('.flow-title-large', wrap));

  const host = $('#pj-recap-host', wrap);
  const rows = [
    ['Mata Kuliah', m.namaLengkap],
    ['Hari Baru', PJ.hariBaru],
    ['Jam', PJ.jamMulai + ' - ' + PJ.jamSelesai],
    ['Mulai Berlaku', fmtTanggalPanjang(PJ.tanggalBerlaku)],
    ['Durasi Berlaku', durLabel],
    ['Pengali Kehadiran', PJ.pengaliAktif ? (PJ.pengaliKehadiran + 'x kehadiran') : 'Normal (1x)']
  ];
  rows.forEach(([label, val]) => {
    const item = el('div', 'recap-item-card');
    item.style.borderWidth = '2px';
    item.innerHTML = `<span class="txt-body muted" style="font-size:12.5px;font-weight:600;">${label}</span><span class="txt-body-lg" style="font-weight:700;font-size:14px;text-align:right;">${val}</span>`;
    host.appendChild(item);
  });

  $('#pj-btn-save', wrap).onclick = () => {
    const bentrok = DB.data.matkul.some(o => o.id !== m.id && o.hari === PJ.hariBaru && jamBentrok(
      { hari: PJ.hariBaru, jamMulai: PJ.jamMulai, jamSelesai: PJ.jamSelesai },
      { hari: o.hari, jamMulai: o.jamMulai, jamSelesai: o.jamSelesai }
    ));
    const save = () => {
      DB.data.jadwalOverride.push({
        id: uid(), matkulId: m.id, tanggalBerlaku: PJ.tanggalBerlaku, hariBaru: PJ.hariBaru,
        jamBaruMulai: PJ.jamMulai, jamBaruSelesai: PJ.jamSelesai, tipeDurasi: PJ.durasi,
        pengaliKehadiran: PJ.pengaliAktif ? PJ.pengaliKehadiran : 1, status: 'aktif'
      });
      dbSaveDebounced(); haptic(); navPop(); showSnackbar('Jadwal baru berhasil disimpan'); renderDashboard();
    };
    if(bentrok){
      showDialog({ title: 'Jadwal bentrok', body: 'Ada kelas terjadwal lain di jam yang sama. Tetap ingin memindahkan?', actions: [
        { label: 'Batal', style: 'btn-text' },
        { label: 'Tetap Simpan', style: 'btn-filled', onClick: save }
      ]});
    } else save();
  };
}

/* =========================================================
   RIWAYAT
   ========================================================= */
const RIW = { selectMode:false, selected:new Set() };
function alasanWarna(a){ return a==='izin'?'var(--clr-izin)':(a==='sakit'?'var(--clr-sakit)':'var(--clr-bolos)'); }
function alasanBg(a){ return a==='izin'?'var(--clr-izin-container)':(a==='sakit'?'var(--clr-sakit-container)':'var(--clr-bolos-container)'); }
function renderRiwayat(){
  const root = $('#tab-riwayat'); root.innerHTML='';
  const topbar = el('div','topbar pad-h');
  if(RIW.selectMode){
    topbar.innerHTML = '<button class="btn-icon statelayer" id="riw-cancel-sel">'+svg('close')+'</button><h2><span id="riw-count">'+RIW.selected.size+'</span> dipilih</h2><button class="btn-icon statelayer" id="riw-del-sel" style="color:var(--clr-error)">'+svg('trash')+'</button>';
  } else {
    topbar.innerHTML = '<h2>Riwayat Laporan</h2><button class="btn-icon statelayer" id="riw-menu">'+svg('moreV')+'</button>';
  }
  root.appendChild(topbar);
  const list = el('div','scroll-y'); list.style.paddingBottom='24px';
  root.appendChild(list);
  const items = riwayatAktif().slice().sort((a,b)=> b.tanggal.localeCompare(a.tanggal) || b.waktuDibuat-a.waktuDibuat);
  if(items.length===0){
    const empty = el('div','empty');
    empty.innerHTML = svg('empty')+'<div class="txt-title-sm">Belum ada riwayat</div><div class="txt-body">Kamu bisa mulai menambahkan laporan absen dari halaman Dashboard.</div>';
    list.appendChild(empty);
  } else {
    let lastMonth='';
    items.forEach(r=>{
      const d = parseISO(r.tanggal);
      const monthLabel = BULAN[d.getMonth()]+' '+d.getFullYear();
      if(monthLabel!==lastMonth){ list.appendChild(el('div','sticky-header',monthLabel)); lastMonth=monthLabel; }
      const m = matkulById(r.matkulId);
      const card = el('div','card-outlined row between statelayer pad-h', '');
      card.style.margin='6px 20px'; card.style.cursor='pointer'; card.style.borderWidth='2px';
      card.dataset.id = r.id;
      card.innerHTML = (RIW.selectMode? '<input type="checkbox" class="riw-chk" data-id="'+r.id+'" style="width:24px;height:24px;margin-right:12px;pointer-events:none;" '+(RIW.selected.has(r.id)?'checked':'')+'>':'')+
        '<div class="stack" style="gap:4px;flex:1;"><div class="txt-body-lg" style="font-weight:700;">'+(m?m.namaLengkap:'(Kelas Dihapus)')+'</div><div class="txt-body muted">'+(r.inputLama? 'Input data lama' : fmtTanggalPendek(r.tanggal)+' • '+r.hari)+'</div></div>'+
        '<span class="chip '+r.alasan+' selected" style="border:none;height:28px;padding:0 10px;font-size:11px;font-weight:700;">'+r.alasan[0].toUpperCase()+r.alasan.slice(1)+'</span>';
      card.addEventListener('click', () => {
        if(RIW.selectMode){
          toggleSelect(r.id);
          const chk = card.querySelector('.riw-chk');
          if(chk) chk.checked = RIW.selected.has(r.id);
          const counter = document.getElementById('riw-count');
          if(counter) counter.innerText = RIW.selected.size;
        } else {
          openRiwayatDetail(r);
        }
      });
      let pressTimer, pressStartX=0, pressStartY=0;
      card.addEventListener('touchstart', (e)=>{
        pressStartX = e.touches[0].clientX; pressStartY = e.touches[0].clientY;
        pressTimer=setTimeout(()=>{ enterRiwayatSelectMode(r.id); },500);
      });
      card.addEventListener('touchmove', (e)=>{
        const dx = e.touches[0].clientX-pressStartX, dy = e.touches[0].clientY-pressStartY;
        if(Math.abs(dx)>10 || Math.abs(dy)>10) clearTimeout(pressTimer);
      });
      card.addEventListener('touchend', ()=> clearTimeout(pressTimer));
      card.addEventListener('touchcancel', ()=> clearTimeout(pressTimer));
      list.appendChild(card);
    });
  }
  if(!RIW.selectMode){
    $('#riw-menu').onclick = openRiwayatSidePanel;
  } else {
    $('#riw-cancel-sel').onclick = ()=> navPop();
    $('#riw-del-sel').onclick = ()=>{
      if(RIW.selected.size===0){ showSnackbar('Belum ada data terpilih'); return; }
      showDialog({title:'Hapus '+RIW.selected.size+' riwayat?', body:'Dapat dipulihkan kapan saja lewat menu Baru Saja Dihapus dalam 30 hari.', actions:[
        {label:'Batal',style:'btn-text'},
        {label:'Hapus',style:'btn-filled', onClick:()=>{
          haptic();
          RIW.selected.forEach(id=>{ const r = DB.data.riwayatAbsen.find(x=>x.id===id); if(r) r.dihapusPada=Date.now(); });
          dbSaveDebounced(); navPop(); showSnackbar('Data berhasil dihapus');
        }}
      ]});
    };
  }
  // Swipe-to-select logic
  let isDraggingSel = false, lastDragId = null;
  list.addEventListener('touchstart', (e) => {
    if(!RIW.selectMode) return;
    isDraggingSel = true;
  }, {passive: true});
  list.addEventListener('touchmove', (e) => {
    if(!RIW.selectMode || !isDraggingSel) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if(!el) return;
    const c = el.closest('.card-outlined');
    if(c && c.dataset.id && c.dataset.id !== lastDragId) {
      lastDragId = c.dataset.id;
      RIW.selected.add(lastDragId);
      const chk = c.querySelector('.riw-chk');
      if(chk) chk.checked = true;
      const counter = document.getElementById('riw-count');
      if(counter) counter.innerText = RIW.selected.size;
    }
  }, {passive: true});
  list.addEventListener('touchend', () => {
    isDraggingSel = false;
    lastDragId = null;
  });
}
function enterRiwayatSelectMode(firstId){
  if(RIW.selectMode) return;
  RIW.selectMode = true;
  if(firstId) toggleSelect(firstId);
  navPush({type:'riwayat-select', close: exitRiwayatSelectMode});
  renderRiwayat();
}
function exitRiwayatSelectMode(){
  RIW.selectMode = false;
  RIW.selected.clear();
  renderRiwayat();
}
function toggleSelect(id){ if(RIW.selected.has(id)) RIW.selected.delete(id); else RIW.selected.add(id); }
function openRiwayatDetail(r){
  openSheet((body,close)=>{
    const m = matkulById(r.matkulId);
    body.appendChild(el('h3','txt-title mt8', m?m.namaLengkap:'(Kelas Dihapus)'));
    body.appendChild(el('div','txt-body muted mt8', r.inputLama? 'Input data lama' : fmtTanggalPanjang(r.tanggal)+' • '+r.hari));
    const chip = el('span','chip '+r.alasan+' selected mt12', r.alasan[0].toUpperCase()+r.alasan.slice(1));
    chip.style.border = 'none';
    chip.style.fontWeight = '700';
    body.appendChild(chip);
    body.appendChild(el('div','txt-body mt16', r.keterangan? r.keterangan : '<span class="muted">Tidak ada catatan alasan khusus</span>'));
    body.appendChild(el('div','txt-body muted mt12', r.sudahDikirimWA? 'Sudah diteruskan via pesan':'Belum diteruskan via pesan'));
    const row = el('div','row gap8 mt24');
    if(!r.sudahDikirimWA){
      const kirim = el('button','btn btn-tonal statelayer', 'Kirim Laporan');
      kirim.onclick = ()=>{ kirimWA(generatePesanWA([r])); r.sudahDikirimWA=true; dbSaveDebounced(); navPop(); renderRiwayat(); };
      row.appendChild(kirim);
    }
    const edit = el('button','btn btn-outlined statelayer', 'Ubah');
    edit.onclick = ()=>{ navPop(); setTimeout(()=>openEditRiwayat(r),260); };
    row.appendChild(edit);
    const hapus = el('button','btn statelayer', 'Hapus'); hapus.style.color='var(--clr-error)';
    hapus.onclick = ()=>{ showDialog({title:'Hapus riwayat?', body:'Dapat dipulihkan dari daftar Baru Saja Dihapus.', actions:[{label:'Batal',style:'btn-text'},{label:'Hapus',style:'btn-filled',onClick:()=>{ haptic(); r.dihapusPada=Date.now(); dbSaveDebounced(); navPop(); renderRiwayat(); showSnackbar('Riwayat dihapus'); }}]}); };
    row.appendChild(hapus);
    body.appendChild(row);
  },{title:''});
}
function openEditRiwayat(r){
  openSheet((body)=>{
    body.appendChild(el('h3','txt-title mt8','Ubah Laporan'));
    const isDataLama = r.inputLama === true || r.alasan === 'data_lama';
    if (isDataLama) {
      const tglWrap = el('div','field mt16');
      tglWrap.innerHTML = '<label>Ubah Tanggal (Data Lama)</label>';
      const inpTgl = el('input'); inpTgl.type = 'date'; inpTgl.value = r.tanggal;
      inpTgl.addEventListener('change', () => r.tanggal = inpTgl.value);
      tglWrap.appendChild(inpTgl);
      body.appendChild(tglWrap);
    } else {
      body.appendChild(el('div','txt-body muted mt8', fmtTanggalPanjang(r.tanggal)));
    }
    const chipRow = el('div','chip-row mt16');
    ['izin','sakit','bolos'].forEach(a=>{
      // Data lama diperlakukan seperti data normal saat mengedit
      const isSelected = r.alasan === a || (isDataLama && r.alasan === 'data_lama' && a === 'bolos'); // default bolos jika belum dipilih
      if (isSelected && isDataLama) r.alasan = a; // Paksa ubah alasan data lama ke alasan reguler
      const chip = el('button','chip '+a+(isSelected?' selected':''), a[0].toUpperCase()+a.slice(1));
      chip.style.border = 'none';
      chip.style.fontWeight = '700';
      chip.onclick = ()=>{ r.alasan=a; $$('.chip',chipRow).forEach(x=>x.classList.remove('selected')); chip.classList.add('selected'); };
      chipRow.appendChild(chip);
    });
    body.appendChild(chipRow);
    body.appendChild(el('label','txt-label mt16','Edit Keterangan'));
    const ta = el('textarea','m3-input'); ta.value=r.keterangan||''; ta.style.marginTop='8px'; ta.addEventListener('input',()=>r.keterangan=ta.value);
    body.appendChild(ta);

    const actionRow = el('div','row gap12 mt24');
    const btnSimpan = el('button','btn btn-filled statelayer', 'Simpan');
    btnSimpan.onclick=()=>{ dbSaveDebounced(); navPop(); syncActiveTabUI(); showSnackbar('Laporan berhasil diperbarui'); };

    if (isDataLama) {
      btnSimpan.style.width = '100%';
      actionRow.appendChild(btnSimpan);
    } else {
      const btnKirim = el('button','btn btn-tonal statelayer');
      btnKirim.innerHTML = svg('send')+'<span>'+(r.sudahDikirimWA ? 'Kirim Ulang' : 'Kirim ke PJ')+'</span>';
      btnKirim.onclick = () => {
        haptic();
        kirimWA(generatePesanWA([r]));
        r.sudahDikirimWA = true;
        dbSaveDebounced();
        navPop();
        syncActiveTabUI();
      };
      btnKirim.style.flex = '1';
      btnSimpan.style.flex = '1';
      actionRow.appendChild(btnKirim);
      actionRow.appendChild(btnSimpan);
    }
    body.appendChild(actionRow);
  },{title:''});
}
function renderSidePanelMain(panel){
  panel.innerHTML = '<div class="topbar pad-h"><h2>Menu Utama</h2></div>'+
    '<div class="stack" style="padding:8px 12px;">'+
    '<button class="list-item statelayer" id="sp-settings" style="width:100%;text-align:left;">'+svg('settings')+'<span class="txt-body-lg" style="font-weight:600;">Pengaturan</span></button>'+
    '<button class="list-item statelayer" id="sp-trash" style="width:100%;text-align:left;">'+svg('archive')+'<span class="txt-body-lg" style="font-weight:600;">Baru Saja Dihapus</span></button>'+
    '</div>';
  $('#sp-settings',panel).onclick = ()=>{ navPop(); setTimeout(openSettings,260); };
  $('#sp-trash',panel).onclick = ()=>{ renderTrashPanel(panel); };
}
function openRiwayatSidePanel(){
  openSidePanel((panel)=> renderSidePanelMain(panel));
}
function renderTrashPanel(panel){
  panel.innerHTML='';
  const top = el('div','topbar pad-h');
  top.innerHTML = '<button class="btn-icon statelayer" id="trash-back">'+svg('back')+'</button><h2>Baru Saja Dihapus</h2>';
  panel.appendChild(top);
  const wrap = el('div','stack', '');
  wrap.style.cssText='padding:8px 12px;flex:1;overflow-y:auto;';
  $('#trash-back',top).onclick = ()=>{ renderSidePanelMain(panel); };
  const deleted = DB.data.riwayatAbsen.filter(r=>r.dihapusPada);
  if(deleted.length===0){
    wrap.innerHTML = '<div class="empty">'+svg('archive')+'<div class="txt-body">Tidak ada data terhapus baru-baru ini.</div></div>';
  } else {
    deleted.sort((a,b)=>b.dihapusPada-a.dihapusPada).forEach(r=>{
      const m = matkulById(r.matkulId);
      const row = el('div','card-outlined row between mt8');
      row.style.borderWidth = '2px';
      row.innerHTML = '<div class="stack" style="gap:2px;padding-left:4px;"><div class="txt-body-lg" style="font-weight:700;">'+(m?m.namaLengkap:'?')+'</div><div class="txt-body muted">'+fmtTanggalPendek(r.tanggal)+'</div></div>';
      const restore = el('button','btn-text statelayer','Pulihkan');
      restore.onclick = ()=>{ r.dihapusPada=null; dbSaveDebounced(); row.remove(); showSnackbar('Riwayat berhasil dikembalikan'); renderRiwayat(); };
      row.appendChild(restore);
      wrap.appendChild(row);
    });
    const clearAll = el('button','btn btn-text statelayer mt16','Kosongkan Semua'); clearAll.style.color='var(--clr-error)'; clearAll.style.width='100%';
    clearAll.onclick = ()=> showDialog({title:'Kosongkan semua?', body:'Semua data terhapus akan dilenyapkan secara permanen.', actions:[{label:'Batal',style:'btn-text'},{label:'Bersihkan',style:'btn-filled',onClick:()=>{ DB.data.riwayatAbsen = DB.data.riwayatAbsen.filter(r=>!r.dihapusPada); dbSaveDebounced(); wrap.innerHTML='<div class="empty">'+svg('archive')+'<div class="txt-body">Tidak ada data terhapus.</div></div>'; }}]});
    wrap.appendChild(clearAll);
  }
  panel.appendChild(wrap);
}
function bersihkanTrashLama(){
  const THIRTY = 30*86400000;
  const now = Date.now();
  const before = DB.data.riwayatAbsen.length;
  DB.data.riwayatAbsen = DB.data.riwayatAbsen.filter(r=> !(r.dihapusPada && (now-r.dihapusPada)>THIRTY));
  if(DB.data.riwayatAbsen.length!==before) dbSaveDebounced();
}

/* =========================================================
   SETTINGS
   ========================================================= */
function settingsTopbar(title, onBack){
  const tb = el('div','topbar pad-h');
  tb.innerHTML = '<button class="btn-icon statelayer" id="set-back">'+svg('back')+'</button><h2>'+title+'</h2>';
  $('#set-back',tb).onclick = onBack;
  return tb;
}
function openSettings(){
  showScreen('scr-settings');
  navPush({type:'screen', close:()=>{ showScreen('scr-main'); syncActiveTabUI(); } });
  renderSettingsMain();
}
function closeSettingsToMain(){ navPop(); }
function renderSettingsMain(){
  const root = $('#scr-settings'); root.innerHTML='';
  root.appendChild(settingsTopbar('Pengaturan', closeSettingsToMain));
  const list = el('div','scroll-y pad-h'); list.style.paddingBottom='40px';
  const items = [
    ['user','Profil Pengguna', renderSettingsProfil],
    ['calendar','Kalender Akademik', renderSettingsSemester],
    ['hist','Mata Kuliah Terdaftar', renderSettingsMatkul],
    ['warn','Kebijakan Limit Absen', renderSettingsAturan],
    ['swap','Jadwal Pindahan Aktif', renderSettingsOverride],
    ['send','Template Format Pesan', renderSettingsTemplate],
    ['download','Cadangkan & Pulihkan', renderSettingsExportImport],
    ['trash','Mulai Semester Baru', renderSettingsResetSemester],
    ['settings','Kustomisasi Tampilan', renderSettingsTampilan],
    ['info','Tentang Aplikasi', renderSettingsTentang],
  ];
  items.forEach(([icon,label,fn])=>{
    const b = el('button','list-item statelayer', '');
    b.style.cssText='width:100%;text-align:left;margin-top:4px;';
    b.innerHTML = svg(icon)+'<span class="txt-body-lg" style="flex:1;font-weight:600;">'+label+'</span>'+svg('arrowR');
    b.onclick = ()=>{ navPush({type:'screen', close:renderSettingsMain}); fn(); };
    list.appendChild(b);
  });
  root.appendChild(list);
}
function settingsSubScreen(title, buildFn){
  const root = $('#scr-settings'); root.innerHTML='';
  root.appendChild(settingsTopbar(title, ()=> navPop()));
  const body = el('div','scroll-y pad-h'); body.style.paddingBottom='40px'; body.style.paddingTop='12px';
  buildFn(body);
  root.appendChild(body);
}
function renderSettingsProfil(){
  settingsSubScreen('Profil Pengguna', (body)=>{
    const p = DB.data.profile;
    const fields = [['nama','Nama Lengkap'],['nim','NIM'],['universitas','Universitas'],['fakultas','Fakultas'],['jurusan','Jurusan / Prodi'],['semesterSekarang','Semester Berjalan']];
    fields.forEach(([key,label])=>{
      const f = el('div','field mt12'); f.innerHTML='<label>'+label+'</label>';
      const inp = el('input'); inp.type = key==='semesterSekarang'?'number':'text'; inp.value=p[key]||'';
      inp.addEventListener('change', ()=>{ p[key] = key==='semesterSekarang'?Number(inp.value):inp.value; dbSaveDebounced(); showSnackbar('Data berhasil disimpan'); renderDashboard(); });
      f.appendChild(inp); body.appendChild(f);
    });
  });
}
function renderSettingsSemester(){
  settingsSubScreen('Kalender Akademik', (body)=>{
    const p = DB.data.profile;
    const f1 = el('div','field mt12'); f1.innerHTML='<label>Tanggal Mulai Semester</label>'; const i1=el('input'); i1.type='date'; i1.value=p.tanggalMulaiSemester||''; f1.appendChild(i1); body.appendChild(f1);
    const f2 = el('div','field mt12'); f2.innerHTML='<label>Tanggal Perkiraan Selesai</label>'; const i2=el('input'); i2.type='date'; i2.value=p.tanggalSelesaiSemester||''; f2.appendChild(i2); body.appendChild(f2);
    const row = el('div','row gap8 mt16'); row.innerHTML='<input type="checkbox" id="set-estimasi" '+(p.isEstimasi?'checked':'')+' style="width:24px;height:24px;"><label for="set-estimasi" class="txt-body" style="font-weight:600;padding-left:4px;">Ini merupakan data perkiraan kasar</label>';
    body.appendChild(row);
    const btn = el('button','btn btn-filled statelayer mt24','Simpan Perubahan'); btn.style.width='100%';
    btn.onclick=()=>{ p.tanggalMulaiSemester=i1.value; p.tanggalSelesaiSemester=i2.value; p.isEstimasi=$('#set-estimasi').checked; dbSaveDebounced(); showSnackbar('Data berhasil diperbarui'); renderDashboard(); };
    body.appendChild(btn);
  });
}
function renderSettingsMatkul(){
  settingsSubScreen('Mata Kuliah Terdaftar', (body)=>{
    const list = el('div','stack gap12'); body.appendChild(list);
    function refresh(){
      list.innerHTML='';
      DB.data.matkul.forEach(m=>{
        const card = el('div','card-outlined'); card.style.borderWidth='2px'; if(m.arsip) card.style.opacity='.55';
        card.innerHTML = '<div class="row between"><div class="txt-title-sm" style="font-weight:700;">'+m.namaLengkap+(m.arsip?' (Arsip)':'')+'</div></div>'+
          '<div class="txt-body muted mt8"><b>'+m.hari+'</b>, '+m.jamMulai+'-'+m.jamSelesai+' • '+(m.modeDefault==='online'?'Online':'Offline')+'<br>Limit khusus: '+(m.limitAbsenKhusus!=null?m.limitAbsenKhusus:'Bawaan ('+DB.data.settings.limitAbsenUmum+')')+'</div>';
        const counterRow = el('div','row between mt12');
        counterRow.innerHTML = '<span class="txt-body muted">Jumlah absen tercatat: <b style="color:var(--clr-on-surface);">'+absenTerpakaiUntukMatkul(m.id)+'</b></span>';
        const counterBtns = el('div','row gap8');
        const minusBtn = el('button','btn-icon statelayer'); minusBtn.innerHTML = svg('minus'); minusBtn.style.background='var(--clr-surface-container-high)';
        const plusBtn = el('button','btn-icon statelayer'); plusBtn.innerHTML = svg('plus'); plusBtn.style.background='var(--clr-surface-container-high)';
        minusBtn.onclick = ()=> kurangiAbsenManual(m, refresh);
        plusBtn.onclick = ()=> tambahAbsenManual(m, refresh);
        counterBtns.appendChild(minusBtn); counterBtns.appendChild(plusBtn);
        counterRow.appendChild(counterBtns);
        card.appendChild(counterRow);
        const row = el('div','row gap8 mt12');
        const edit = el('button','btn btn-outlined statelayer','Ubah'); edit.onclick=()=>openEditMatkulSheet(m,refresh);
        const del = el('button','btn statelayer','Hapus'); del.style.color='var(--clr-error)';
        del.onclick = ()=>{
          const punyaRiwayat = riwayatAktif().some(r=>r.matkulId===m.id);
          showDialog({title:'Hapus '+m.namaLengkap+'?', body: punyaRiwayat? 'Memiliki catatan presensi aktif. Kelas akan diarsipkan tanpa menghilangkan riwayat absensi lama.':'Kelas akan dihapus permanen.', actions:[
            {label:'Batal',style:'btn-text'},
            {label: punyaRiwayat?'Arsipkan':'Hapus Permanen', style:'btn-filled', onClick:()=>{
              haptic();
              if(punyaRiwayat){ m.arsip=true; } else {
                DB.data.matkul = DB.data.matkul.filter(x=>x.id!==m.id);
                DB.data.jadwalOverride = DB.data.jadwalOverride.filter(o=>o.matkulId!==m.id);
              }
              dbSaveDebounced(); refresh(); renderDashboard(); showSnackbar('Kelas berhasil diperbarui');
            }}
          ]});
        };
        row.appendChild(edit); row.appendChild(del); card.appendChild(row);
        list.appendChild(card);
      });
      const addBtn = el('div','matkul-add-item statelayer mt8');
      addBtn.innerHTML = '<div class="row gap8" style="justify-content:center;color:var(--clr-primary);font-weight:700;">'+svg('plus')+'<span>Tambah Mata Kuliah</span></div>';
      addBtn.onclick = ()=> openTambahMatkulSheet(m=>{ DB.data.matkul.push({id:uid(), namaLengkap:m.namaLengkap, hari:m.hari, jamMulai:m.jamMulai, jamSelesai:m.jamSelesai, modeDefault:m.modeDefault, limitAbsenKhusus:null, arsip:false, semesterId: DB.data.appState.activeSemesterId}); dbSaveDebounced(); refresh(); renderDashboard(); triggerReevaluasiQuickCheck(); });
      list.appendChild(addBtn);
    }
    refresh();
  });
}
function openEditMatkulSheet(m, onDone){
  openSheet((body)=>{
    body.appendChild(el('h3','txt-title mt8','Ubah Mata Kuliah'));
    const f1=el('div','field mt16'); f1.innerHTML='<label>Nama Lengkap</label>'; const inpNama=el('input'); inpNama.value=m.namaLengkap; f1.appendChild(inpNama); body.appendChild(f1);
    const hariWrap = el('div','field mt12'); hariWrap.innerHTML='<label>Hari</label>';
    const selHari = el('select'); HARI.slice(1).concat(HARI[0]).forEach(h=>{ const o=el('option'); o.value=h; o.textContent=h; if(h===m.hari) o.selected=true; selHari.appendChild(o); });
    hariWrap.appendChild(selHari); body.appendChild(hariWrap);
    const jamRow = el('div','row gap12 mt12');
    const fj1=el('div','field'); fj1.style.flex='1'; fj1.innerHTML='<label>Jam Mulai</label>'; const inpJ1=el('input'); inpJ1.type='time'; inpJ1.value=m.jamMulai; fj1.appendChild(inpJ1);
    const fj2=el('div','field'); fj2.style.flex='1'; fj2.innerHTML='<label>Jam Selesai</label>'; const inpJ2=el('input'); inpJ2.type='time'; inpJ2.value=m.jamSelesai; fj2.appendChild(inpJ2);
    jamRow.appendChild(fj1); jamRow.appendChild(fj2); body.appendChild(jamRow);
    const limitWrap = el('div','field mt12'); limitWrap.innerHTML='<label>Limit Khusus (Kosongkan untuk limit umum)</label>'; const inpLimit=el('input'); inpLimit.type='number'; inpLimit.value=m.limitAbsenKhusus!=null?m.limitAbsenKhusus:''; limitWrap.appendChild(inpLimit); body.appendChild(limitWrap);
    const btn = el('button','btn btn-filled statelayer mt24','Simpan Perubahan'); btn.style.width='100%';
    btn.onclick=()=>{
      if(hmToMin(inpJ2.value)<=hmToMin(inpJ1.value)){ showSnackbar('Jam selesai harus lebih telat dari jam mulai'); return; }
      m.namaLengkap=inpNama.value.trim()||m.namaLengkap; m.hari=selHari.value; m.jamMulai=inpJ1.value; m.jamSelesai=inpJ2.value; m.limitAbsenKhusus = inpLimit.value===''?null:Number(inpLimit.value); dbSaveDebounced(); haptic(); navPop(); onDone(); showSnackbar('Kelas berhasil diubah');
    };
    body.appendChild(btn);
  },{title:''});
}
function tambahAbsenManual(m, refresh){
  showDialog({
    title: 'Tambah data lama — '+m.namaLengkap,
    body: 'Pilih alasan ketidakhadiran yang mau ditambahkan ke riwayat sebagai input data lama (bukan absensi hari ini).',
    actions: [
      { label:'Izin', style:'btn-tonal', onClick:()=> simpanAbsenManual(m, 'izin', refresh) },
      { label:'Sakit', style:'btn-tonal', onClick:()=> simpanAbsenManual(m, 'sakit', refresh) },
      { label:'Bolos', style:'btn-filled', onClick:()=> simpanAbsenManual(m, 'bolos', refresh) },
      { label:'Batal', style:'btn-text' }
    ]
  });
}
function simpanAbsenManual(m, alasan, refresh){
  haptic();
  const entry = {
    id: uid(),
    matkulId: m.id,
    tanggal: todayISO(),
    hari: HARI[todayHariIndex()],
    alasan: alasan,
    keterangan: '',
    sudahDikirimWA: false,
    waktuDibuat: Date.now(),
    dihapusPada: null,
    overrideId: null,
    semesterId: DB.data.appState.activeSemesterId,
          pengaliKehadiranSnapshot: 1,
    inputLama: true
  };
  DB.data.riwayatAbsen.push(entry);
  dbSaveDebounced();
  refresh();
  renderDashboard();
  showSnackbar('Data lama berhasil ditambahkan');
}
function kurangiAbsenManual(m, refresh){
  const candidates = riwayatAktif().filter(r=>r.matkulId===m.id).sort((a,b)=> b.waktuDibuat-a.waktuDibuat);
  if(candidates.length===0){ showSnackbar('Belum ada data absen untuk dikurangi'); return; }
  const target = candidates[0];
  showDialog({title:'Kurangi data absen?', body:'Catatan absen '+m.namaLengkap+' yang paling baru akan dihapus. Dapat dipulihkan lewat menu Baru Saja Dihapus.', actions:[
    {label:'Batal',style:'btn-text'},
    {label:'Kurangi',style:'btn-filled',onClick:()=>{
      haptic();
      target.dihapusPada = Date.now();
      dbSaveDebounced();
      refresh();
      renderDashboard();
      showSnackbar('Data absen berhasil dikurangi');
    }}
  ]});
}
function renderSettingsAturan(){
  settingsSubScreen('Kebijakan Limit Absen', (body)=>{
    const f = el('div','field'); f.innerHTML='<label>Kuota Absen Bawaan (Umum)</label>'; const inp=el('input'); inp.type='number'; inp.value=DB.data.settings.limitAbsenUmum;
    inp.addEventListener('change',()=>{ DB.data.settings.limitAbsenUmum=Number(inp.value)||0; dbSaveDebounced(); renderDashboard(); showSnackbar('Limit umum disimpan'); });
    f.appendChild(inp); body.appendChild(f);
    body.appendChild(el('div','txt-title-sm mt24','Limit Khusus per Mata Kuliah'));
    matkulSemesterAktif().filter(m=>!m.arsip).forEach(m=>{
      const row = el('div','row between mt12');
      row.innerHTML = '<span class="txt-body-lg" style="flex:1;padding-right:12px;">'+m.namaLengkap+'</span>';
      const inp2 = el('input','m3-input'); inp2.type='number'; inp2.placeholder='Umum'; inp2.value = m.limitAbsenKhusus!=null?m.limitAbsenKhusus:'';
      inp2.addEventListener('change', ()=>{ m.limitAbsenKhusus = inp2.value===''?null:Number(inp2.value); dbSaveDebounced(); renderDashboard(); });
      row.appendChild(inp2);
      body.appendChild(row);
    });

    body.appendChild(el('div','txt-title-sm mt24','Wizard Absen'));
    const fMutePJ = el('div','row gap8 mt16');
    fMutePJ.innerHTML = '<input type="checkbox" id="set-mute-pj" '+(DB.data.settings.muteKirimPJSelamanya?'':'checked')+' style="width:24px;height:24px;"><label for="set-mute-pj" class="txt-body" style="font-weight:600;padding-left:4px;">Aktifkan kembali Wizard Kirim Ke PJ</label>';
    body.appendChild(fMutePJ);
    $('#set-mute-pj', fMutePJ).addEventListener('change', (e) => {
      DB.data.settings.muteKirimPJSelamanya = !e.target.checked; // Jika dicentang aktifkan kembali, berarti status mutenya = false
      dbSaveDebounced();
      showSnackbar('Pengaturan berhasil diperbarui');
    });

    const fMuteNotes = el('div','row gap8 mt16');
    fMuteNotes.innerHTML = '<input type="checkbox" id="set-mute-notes" '+(DB.data.settings.muteKeteranganSelamanya?'':'checked')+' style="width:24px;height:24px;"><label for="set-mute-notes" class="txt-body" style="font-weight:600;padding-left:4px;">Aktifkan kembali Wizard Keterangan Tambahan</label>';
    body.appendChild(fMuteNotes);
    $('#set-mute-notes', fMuteNotes).addEventListener('change', (e) => {
      DB.data.settings.muteKeteranganSelamanya = !e.target.checked;
      dbSaveDebounced();
      showSnackbar('Pengaturan berhasil diperbarui');
    });
  });
}
function renderSettingsOverride(){
  settingsSubScreen('Jadwal Pindahan Aktif', (body)=>{
    const active = DB.data.jadwalOverride.filter(o=>o.status==='aktif');
    if(active.length===0){ body.appendChild(el('div','empty',svg('swap')+'<div class="txt-body">Tidak ada jadwal pindahan aktif saat ini</div>')); return; }
    active.forEach(o=>{
      const m = matkulById(o.matkulId);
      const card = el('div','card-outlined mt12'); card.style.borderWidth='2px';
      const durLabel = {mingguIni:'Minggu ini saja', duaMinggu:'2 minggu', permanen:'Seterusnya (Permanen)', double:'Double Kelas'}[o.tipeDurasi];
      card.innerHTML = '<div class="txt-title-sm" style="font-weight:700;">'+(m?m.namaLengkap:'?')+'</div><div class="txt-body muted mt8">'+o.hariBaru+', '+o.jamBaruMulai+'-'+o.jamBaruSelesai+'<br>Mulai '+fmtTanggalPendek(o.tanggalBerlaku)+' • '+durLabel+(o.pengaliKehadiran>1?' • x'+o.pengaliKehadiran:'')+'</div>';
      const btn = el('button','btn btn-text statelayer mt8','Batalkan Pindahan'); btn.style.color='var(--clr-error)';
      btn.onclick=()=>{ o.status='dibatalkan'; dbSaveDebounced(); renderSettingsOverride(); renderDashboard(); showSnackbar('Jadwal alternatif dinonaktifkan'); };
      card.appendChild(btn);
      body.appendChild(card);
    });
  });
}
function renderSettingsTemplate(){
  settingsSubScreen('Template Format Pesan', (body)=>{
    body.appendChild(el('div','txt-body muted','Variabel dinamis yang dapat disisipkan: {nama} {nim} {matkul} {alasan} {alasan_kata} {tanggal} {keterangan} {waktu}'));
    const ta = el('textarea','m3-input'); ta.style.marginTop='12px'; ta.style.minHeight='180px'; ta.value = DB.data.settings.formatPesanWA;
    body.appendChild(ta);
    const btn = el('button','btn btn-filled statelayer mt16','Simpan Template'); btn.style.width='100%';
    btn.onclick = ()=>{ DB.data.settings.formatPesanWA = ta.value; dbSaveDebounced(); showSnackbar('Format template disimpan'); };
    body.appendChild(btn);
  });
}
function renderSettingsExportImport(){
  settingsSubScreen('Cadangkan & Pulihkan', (body)=>{
    body.appendChild(el('p','txt-body muted','Ekspor data absensi kamu ke berkas JSON eksternal, atau pulihkan kembali dari berkas yang ada.'));
    const exportBtn = el('button','btn btn-filled statelayer mt16','Cadangkan Data (Ekspor)'); exportBtn.style.width='100%';
    exportBtn.innerHTML = svg('download')+'<span>Ekspor JSON</span>';
    exportBtn.onclick = ()=>{
      const blob = new Blob([JSON.stringify(DB.data,null,2)],{type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='absenku-cadangan-'+todayISO()+'.json'; a.click();
      setTimeout(()=>URL.revokeObjectURL(url),2000);
      showSnackbar('Data berhasil diekspor');
    };
    body.appendChild(exportBtn);
    const importBtn = el('button','btn btn-outlined statelayer mt12','Pulihkan Data (Impor)'); importBtn.style.width='100%';
    importBtn.innerHTML = svg('upload')+'<span>Impor JSON</span>';
    const fileInp = el('input'); fileInp.type='file'; fileInp.accept='application/json'; fileInp.style.display='none';
    fileInp.addEventListener('change', ()=>{
      const file = fileInp.files[0]; if(!file) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        try{
          const parsed = JSON.parse(reader.result);
          showDialog({title:'Pulihkan & Timpa?', body:'Langkah ini akan menimpa seluruh konfigurasi semester yang ada saat ini.', actions:[
            {label:'Batal',style:'btn-text'},
            {label:'Timpa',style:'btn-filled', onClick:()=>{ DB.data = Object.assign(defaultDB(), parsed); dbSave(); showSnackbar('Data absensi dipulihkan'); renderDashboard(); }}
          ]});
        }catch(e){ showSnackbar('Berkas tidak cocok atau rusak'); }
      };
      reader.readAsText(file);
    });
    importBtn.onclick = ()=> fileInp.click();
    body.appendChild(importBtn); body.appendChild(fileInp);
  });
}
function renderSettingsResetSemester(){
  settingsSubScreen('Mulai Semester Baru', (body)=>{
    body.appendChild(el('div','banner','Tindakan ini akan mengosongkan seluruh riwayat ketidakhadiran & memindahkan jadwal aktif untuk menyambut kalender perkuliahan baru.'));
    const btn = el('button','btn statelayer mt24','Mulai Lembaran Baru'); btn.style.width='100%'; btn.style.background='var(--clr-error-container)'; btn.style.color='var(--clr-on-error-container)'; btn.style.height='52px'; btn.style.borderRadius='var(--shape-full)';
    btn.onclick = ()=>{
      showDialog({title:'Mulai semester baru?', body:'Seluruh riwayat presensi saat ini akan dikosongkan. Pastikan kamu sudah melihat rekap akhir.', actions:[
        {label:'Batal',style:'btn-text'},
        {label:'Lanjut',style:'btn-filled', onClick:()=>{
          setTimeout(()=>{ showDialog({title:'Sudah sangat yakin?', body:'Langkah pembersihan riwayat semester ini bersifat permanen.', actions:[
            {label:'Batal',style:'btn-text'},
            {label:'Bersihkan & Reset',style:'btn-filled', onClick:()=>{ navPop(); navPop(); showRekapSemester(true); }}
          ]}); }, 260);
        }}
      ]});
    };
    body.appendChild(btn);
  });
}

/* =========================================================
   SETTINGS TAMPILAN — INTEGRATED MULTI-THEME SELECTOR
   ========================================================= */
function renderSettingsTampilan(){
  settingsSubScreen('Kustomisasi Tampilan', (body)=>{
    body.appendChild(el('div','txt-title-sm mt8','Tema Gelap / Terang'));
    const seg = el('div','segmented mt12'); seg.innerHTML='<button data-v="light">Light</button><button data-v="dark">Dark</button>';
    $$('button',seg).forEach(b=> b.classList.toggle('active', b.dataset.v===DB.data.settings.temaMode));
    seg.addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; DB.data.settings.temaMode=b.dataset.v; applyTheme(); dbSaveDebounced(); $$('button',seg).forEach(x=>x.classList.toggle('active',x===b)); });
    body.appendChild(seg);

    body.appendChild(el('div','txt-title-sm mt24','Aksen Warna Material You'));
    const grid = el('div','chip-row mt12');
    const colors = [
      ['brown', 'Cokelat'],
      ['cyan', 'Cyan'],
      ['purple', 'Ungu'],
      ['blue', 'Biru'],
      ['green', 'Hijau'],
      ['yellow', 'Kuning']
    ];
    colors.forEach(([v, label]) => {
      const btn = el('button', 'chip' + (DB.data.settings.colorTheme === v ? ' selected' : ''), label);
      btn.style.padding = '8px 16px';
      btn.onclick = () => {
        DB.data.settings.colorTheme = v;
        applyTheme();
        dbSaveDebounced();
        $$('button', grid).forEach(x => x.classList.toggle('selected', x === btn));
        showSnackbar('Skema warna ' + label + ' diterapkan');
      };
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  });
}

function renderSettingsTentang(){
  settingsSubScreen('Tentang Aplikasi', (body)=>{
    body.appendChild(el('div','card mt8'));
    body.lastChild.innerHTML = '<div class="txt-title-sm">Absenku</div><div class="txt-body muted mt8">Versi 1.0.1<br>Manajemen presensi dan ketidakhadiran mandiri yang aman, berjalan offline, dan ramah satu genggaman tangan.</div>';
  });
}

function applyTheme(){
  const mode = DB.data.settings.temaMode;
  const color = DB.data.settings.colorTheme || 'brown';
  
  if(mode==='light'||mode==='dark') document.documentElement.setAttribute('data-theme',mode);
  else document.documentElement.removeAttribute('data-theme');

  document.documentElement.setAttribute('data-color-theme', color);
  syncStatusBarColor();
}

/* =========================================================
   STATUS BAR COLOR SYNC
   ========================================================= */
const STATUSBAR_STACK = ['--clr-surface'];
function resolveCssVar(varName){
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}
function syncStatusBarColor(){
  const varName = STATUSBAR_STACK[STATUSBAR_STACK.length-1] || '--clr-surface';
  const hex = resolveCssVar(varName);
  const meta = document.getElementById('meta-theme-color');
  if(meta && hex) meta.setAttribute('content', hex);
}
function pushStatusBarLayer(varName){
  STATUSBAR_STACK.push(varName);
  syncStatusBarColor();
}
function popStatusBarLayer(){
  STATUSBAR_STACK.pop();
  syncStatusBarColor();
}

/* =========================================================
   QUICK-CHECK
   ========================================================= */
function shouldShowQuickCheck(){
  const jadwalHariIni = jadwalEfektifTanggal(todayISO());
  if (jadwalHariIni.length === 0) return false;
  const today = todayISO();
  if(DB.data.appState.absenCommittedTanggal === today) return false;
  if(DB.data.appState.qcBisukanTanggal === today) return false;
  return true;
}
function navPopSilent(){
  NAV.stack.pop();
  NAV.suppressNextPopstate = true;
  try{ history.back(); }catch(e){ NAV.suppressNextPopstate = false; }
}
function markAbsenCommittedHariIni(){
  DB.data.appState.absenCommittedTanggal = todayISO();
  dbSaveDebounced();
}
function renderQuickCheck(){
  // Pastikan key state Quick Check baru selalu ada & aman di DB
  if(DB.data.appState.qcSelesaiTanggal===undefined) DB.data.appState.qcSelesaiTanggal = null;
  if(DB.data.appState.qcLewatiHarianTanggal===undefined) DB.data.appState.qcLewatiHarianTanggal = null;
  if(DB.data.appState.qcLewatiHarianMatkulIds===undefined) DB.data.appState.qcLewatiHarianMatkulIds = null;
  if(!DB.data.appState.qcAbaikanMatkul) DB.data.appState.qcAbaikanMatkul = {};

  const todayIso = todayISO();
  const jadwalHariIni = jadwalEfektifTanggal(todayIso);
  const nowMin = nowMinutes();

  // KONDISI KRITIS: seluruh jadwal hari ini sudah habis jatah absennya
  const semuaHabisJatah = jadwalHariIni.length > 0 && jadwalHariIni.every(j => {
    const m = matkulById(j.matkulId);
    return m && absenTerpakaiUntukMatkul(m.id) >= limitUntukMatkul(m);
  });

  if (semuaHabisJatah) {
    const root = $('#scr-quickcheck'); root.innerHTML = '';
    const wrap = el('div', 'flow-body-content scroll-y');
    // HARDCODE warna merah darah pekat & padding rata atas
    wrap.style.cssText = 'display:flex;flex-direction:column;justify-content:flex-start;padding:calc(64px + var(--sat)) 24px 32px;flex:1;background:#8A0000;color:#FFFFFF;';
    wrap.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:32px;margin:auto 0;">
        <h1 style="text-align:left;font-family:var(--font-display);font-size:clamp(38px, 12vw, 52px);font-weight:900;line-height:1.15;letter-spacing:-1.5px;text-transform:uppercase;word-break:break-word;">
          HARI INI TOLONG PASTIKAN UNTUK HADIR. KARENA SEMUA JATAH ABSEN MU DI HARI INI TELAH HABIS.
        </h1>
        <button class="flow-btn-choice statelayer" id="btn-kritis-paham" style="background:#FFFFFF;color:#8A0000;border:none;width:100%;border-radius:64px;justify-content:center;text-align:center;min-height:72px;font-size:18px;">
          <span>Saya Mengerti & Akan Hadir</span>
        </button>
      </div>
    `;
    root.appendChild(wrap);
    $('#btn-kritis-paham', wrap).onclick = () => {
      haptic();
      DB.data.appState.qcSelesaiTanggal = todayISO();
      dbSaveDebounced();
      navPop();
      finishQuickCheck();
    };
    showScreen('scr-quickcheck');
    navPush({type:'screen', close:()=> finishQuickCheck()});
    return;
  }

  let jadwalBerlangsung = null;
  let maxSelesai = 0;
  jadwalHariIni.forEach(j=>{
    const start = hmToMin(j.jamMulai), end = hmToMin(j.jamSelesai);
    if(end > maxSelesai) maxSelesai = end;
    // Pakai >= dan <= agar kelas yang baru mulai/baru selesai tetap terhitung "berlangsung"
    if(nowMin >= start && nowMin <= end) jadwalBerlangsung = j;
  });

  const sudahLewatSemua = jadwalHariIni.length > 0 && nowMin > maxSelesai;
  const matkul = jadwalBerlangsung ? matkulById(jadwalBerlangsung.matkulId) : null;
  const matkulIniSudahDiabaikan = matkul ? (DB.data.appState.qcAbaikanMatkul[matkul.id] === todayIso) : false;

  // "Lewati harian" (tombol Bisukan) hanya berlaku untuk matkul yang SUDAH ADA
  // saat tombol itu ditekan. Kalau matkul yang sedang berlangsung sekarang baru
  // ditambahkan setelahnya (id-nya tidak ada di snapshot), anggap belum di-lewati
  // supaya Quick Check tetap muncul untuk kelas baru tersebut.
  const sudahDilewatiHarian = matkul
    ? (DB.data.appState.qcLewatiHarianTanggal === todayIso
        && Array.isArray(DB.data.appState.qcLewatiHarianMatkulIds)
        && DB.data.appState.qcLewatiHarianMatkulIds.includes(matkul.id))
    : (DB.data.appState.qcLewatiHarianTanggal === todayIso);

  // KONDISI A: ada kelas yang sedang berlangsung sekarang
  if(matkul && !sudahDilewatiHarian && !matkulIniSudahDiabaikan){
    tampilkanUIQuickCheck({
      judul: `${matkul.namaLengkap} hadir?`,
      subjudul: 'Kelas ini sedang berlangsung sekarang.',
      labelYa: 'Ya', labelTidak: 'Tidak',
      tampilkanSkip: true,
      onYa: ()=>{
        showDialog({
          title: 'Yakin hadir?',
          body: 'Konfirmasi kehadiran kamu di kelas ini sebelum tercatat.',
          actions: [
            { label: 'Batal', style: 'btn-text' },
            { label: 'Yakin (Bisukan)', style: 'btn-text muted', onClick: () => {
                DB.data.appState.qcAbaikanMatkul[matkul.id] = todayIso;
                dbSaveDebounced();
                navPop();
              } },
            { label: 'Yakin', style: 'btn-filled', onClick: () => {
                markAbsenCommittedHariIni();
                navPop();
              } }
          ]
        });
      },
      onTidak: ()=>{
        navPopSilent();
        setTimeout(()=>startAestheticAbsenFlow(), 200);
      }
    });
    return;
  }

  // KONDISI B: semua jadwal hari ini sudah lewat waktunya
  if(sudahLewatSemua && DB.data.appState.qcSelesaiTanggal !== todayIso){
    tampilkanUIQuickCheck({
      judul: 'Tadi hadir semua?',
      subjudul: 'Semua jadwal kelas kamu hari ini sudah lewat.',
      labelYa: 'Ya', labelTidak: 'Tidak',
      tampilkanSkip: false,
      onYa: ()=>{
        DB.data.appState.qcSelesaiTanggal = todayIso;
        markAbsenCommittedHariIni();
        navPop();
      },
      onTidak: ()=>{
        navPopSilent();
        setTimeout(()=>startAestheticAbsenFlow(), 200);
      }
    });
    return;
  }

  // KONDISI C: tidak ada kondisi khusus, tampilkan Quick Check harian biasa
  let jmlHabis = 0, jmlKritis = 0, jmlWaspada = 0, jmlAman = 0;
  jadwalHariIni.forEach(j=>{
    const m = matkulById(j.matkulId);
    if(!m) return;
    const sisa = limitUntukMatkul(m) - absenTerpakaiUntukMatkul(m.id);
    if (sisa <= 0) jmlHabis++;
    else if (sisa === 1) jmlKritis++;
    else if (sisa === 2) jmlWaspada++;
    else jmlAman++;
  });

  let kalimatDinamis = '';
  let kalimatWarna = 'var(--clr-on-surface-variant)';
  if (jmlHabis > 0) {
    kalimatDinamis = `(Awas, jatah bolos ${jmlHabis} kelas kamu udah habis!)`;
    kalimatWarna = 'var(--clr-error)';
  } else if (jmlKritis > 0) {
    kalimatDinamis = '(Hati-hati, jatah absen tipis. Tersisa 1x lagi!)';
    kalimatWarna = 'var(--clr-tertiary)';
  } else {
    kalimatDinamis = '(Jatah absen hari ini masih aman semua kok.)';
    kalimatWarna = 'var(--clr-primary)';
  }

  tampilkanUIQuickCheck({
    judul: 'Mau absen hari ini?',
    subjudul: `Yuk catat kehadiran kamu hari ini sebelum lanjut buka aplikasi.<br><br><span style="font-weight:700;color:${kalimatWarna};">${kalimatDinamis}</span>`,
    labelYa: 'Mau', labelTidak: 'Lanjut ke Aplikasi',
    tampilkanSkip: true,
    onYa: ()=>{
      navPopSilent();
      setTimeout(()=>startAestheticAbsenFlow(), 200);
    },
    onTidak: ()=> navPop()
  });
}

function tampilkanUIQuickCheck({judul, subjudul, labelYa, labelTidak, onYa, onTidak, tampilkanSkip}){
  const root = $('#scr-quickcheck'); root.innerHTML='';
  const wrap = el('div','flow-body-content scroll-y'); wrap.style.cssText='padding-top:40px;padding-bottom:32px;justify-content:flex-start;flex:1;';

  wrap.appendChild(el('h1','flow-title-large',judul));
  if(subjudul) wrap.appendChild(el('p','flow-subtitle',subjudul));

  const row = el('div','flow-choices-stack'); row.style.marginTop='28px';
  const btnYa = el('button','flow-btn-choice primary statelayer');
  btnYa.innerHTML = '<span>'+labelYa+'</span>'+svg('check');
  btnYa.onclick = ()=>{ haptic(); onYa(); };
  const btnTidak = el('button','flow-btn-choice tonal statelayer');
  btnTidak.innerHTML = '<span>'+labelTidak+'</span>'+svg('arrowR');
  btnTidak.onclick = ()=>{ haptic(); onTidak(); };
  row.appendChild(btnYa); row.appendChild(btnTidak);
  wrap.appendChild(row);

  if(tampilkanSkip){
    const btnBisukan = el('button','btn-text statelayer','Bisukan pesan ini untuk hari ini');
    btnBisukan.style.cssText='align-self:center;color:var(--clr-on-surface-variant);font-weight:700;margin-top:12px;';
    btnBisukan.onclick = ()=>{
      haptic();
      DB.data.appState.qcLewatiHarianTanggal = todayISO();
      // Simpan snapshot id matkul yang sudah ada saat "Lewati" ditekan, supaya
      // matkul baru yang ditambahkan setelahnya tidak ikut ter-lewati otomatis.
      DB.data.appState.qcLewatiHarianMatkulIds = matkulSemesterAktif().map(m=>m.id);
      DB.data.appState.qcBisukanTanggal = todayISO();
      dbSaveDebounced();
      navPop();
    };
    wrap.appendChild(btnBisukan);
  }

  root.appendChild(wrap);
  showScreen('scr-quickcheck');
  navPush({type:'screen', close:()=> finishQuickCheck()});
}
function finishQuickCheck(){
  showScreen('scr-main'); syncActiveTabUI(); renderDashboard();
}
// Dipanggil setiap ada perubahan yang bisa mempengaruhi kondisi Quick Check
// (misalnya matkul baru ditambahkan). Ini membuat Quick Check langsung
// muncul/update tanpa perlu tutup-buka app lagi.
function triggerReevaluasiQuickCheck(){
  if(!shouldShowQuickCheck()) return;
  // Re-evaluate & tampilkan Quick Check dengan data terbaru, baik saat Quick
  // Check sedang aktif di layar (langsung ter-refresh) maupun saat belum
  // tampil sama sekali (mis. langsung setelah simpan matkul baru).
  renderQuickCheck();
}

/* =========================================================
   REKAP SEMESTER
   ========================================================= */
function showRekapSemester(fromReset){
  const root = $('#scr-recap'); root.innerHTML='';
  const wrap = el('div','scroll-y pad-h'); wrap.style.cssText='padding-top:32px;padding-bottom:32px;';
  wrap.appendChild(el('div','txt-display','Semester ini selesai!'));
  wrap.appendChild(el('div','txt-body muted mt8','Berikut ringkasan lengkap evaluasi kehadiran kamu selama satu semester ini.'));
  const items = DB.data.matkul;
  let totalIzin=0,totalSakit=0,totalBolos=0;
  riwayatAktif().forEach(r=>{ if(r.alasan==='izin')totalIzin++; else if(r.alasan==='sakit')totalSakit++; else totalBolos++; });
  let budgetTotalJatah=0, budgetTerpakai=0;
  items.forEach(m=>{ budgetTotalJatah += limitUntukMatkul(m); budgetTerpakai += absenTerpakaiUntukMatkul(m.id); });
  const budgetSisa = Math.max(0, budgetTotalJatah - budgetTerpakai);
  const budget = { persentaseSisa: budgetTotalJatah>0 ? Math.round((budgetSisa/budgetTotalJatah)*100) : 100 };
  const scoreCard = el('div','card mt24');
  scoreCard.innerHTML = '<div class="ring-wrap">'+ringSVG(budget.persentaseSisa/100,172,14)+'<div class="ring-center"><div class="num">'+budget.persentaseSisa+'%</div><div class="lbl">Sisa Jatah</div></div></div>';
  wrap.appendChild(scoreCard);
  const bd = el('div','card mt16');
  bd.innerHTML = '<div class="txt-title-sm" style="font-weight:700;">Rincian Berdasarkan Alasan</div>'+
    '<div class="row between mt12"><span class="txt-body" style="font-weight:500;">Izin</span><span class="txt-title-sm" style="color:var(--clr-izin);font-weight:700;">'+totalIzin+'</span></div>'+
    '<div class="row between mt8"><span class="txt-body" style="font-weight:500;">Sakit</span><span class="txt-title-sm" style="color:var(--clr-sakit);font-weight:700;">'+totalSakit+'</span></div>'+
    '<div class="row between mt8"><span class="txt-body" style="font-weight:500;">Tidak Hadir (Bolos)</span><span class="txt-title-sm" style="color:var(--clr-bolos);font-weight:700;">'+totalBolos+'</span></div>';
  wrap.appendChild(bd);
  const perMatkul = el('div','stack gap8 mt16');
  perMatkul.appendChild(el('div','txt-title-sm','Rincian Per Mata Kuliah'));
  let matkulTerbanyak=null, maxAbsen=-1;
  items.forEach(m=>{
    const used = absenTerpakaiUntukMatkul(m.id);
    if(used>maxAbsen){ maxAbsen=used; matkulTerbanyak=m; }
    const card = el('div','card-outlined row between');
    card.style.borderWidth = '2px';
    card.innerHTML = '<span class="txt-body-lg" style="font-weight:700;">'+m.namaLengkap+'</span><span class="txt-body muted" style="font-weight:600;">'+used+' kali absen</span>';
    perMatkul.appendChild(card);
  });
  wrap.appendChild(perMatkul);
  if(matkulTerbanyak && maxAbsen>0){
    const hi = el('div','card mt16'); hi.style.background='var(--clr-error-container)'; hi.style.color='var(--clr-on-error-container)';
    hi.innerHTML = '<div class="txt-title-sm" style="font-weight:700;">Absen Terbanyak</div><div class="txt-body mt8" style="font-weight:500;"><b>'+matkulTerbanyak.namaLengkap+'</b> — '+maxAbsen+' kali</div>';
    wrap.appendChild(hi);
  }
  const btn = el('button','btn btn-filled statelayer mt24','Lanjut Bersihkan & Reset'); btn.style.width='100%'; btn.style.height='52px';
  btn.onclick = ()=>{
    DB.data.riwayatAbsen = [];
    DB.data.jadwalOverride = [];
    DB.data.appState.semesterSelesaiDiakui = true;
    dbSave();
    NAV.stack = [];
    OB.step=2; OB.tempMatkul = DB.data.matkul.map(m=>({...m}));
    showScreen('scr-onboarding');
    renderOnboarding();
  };
  wrap.appendChild(btn);
  root.appendChild(wrap);
  showScreen('scr-recap');
  if(!fromReset) navPush({type:'screen', close:()=>{ showScreen('scr-main'); syncActiveTabUI(); }});
}

/* =========================================================
   PWA — SERVICE WORKER & MANIFEST BOOTSTRAPPER
   ========================================================= */
function setupPWA(){
  try{
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./sw.js').catch(err=>{
        console.warn('Gagal memuat sw.js lokal (Ini normal jika berjalan lokal):', err);
      });
    }
  }catch(e){ console.warn('PWA Bootstrap gagal:', e); }
}

/* =========================================================
   APP INIT
   ========================================================= */
function ringSVG(pct, size, stroke, colorVar){
  const r = (size-stroke)/2, c = 2*Math.PI*r, off = c*(1-clamp(pct,0,1));
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'">'+
    '<circle class="ring-bg" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke-width="'+stroke+'"/>'+
    '<circle class="ring-fg animated-ring" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke-width="'+stroke+'" style="stroke:'+(colorVar||'var(--clr-primary)')+'" stroke-dasharray="'+c+'" stroke-dashoffset="'+c+'" data-off="'+off+'"/></svg>';
}
const TABS_ORDER = ['dashboard','kelas','riwayat'];
function getTabEls(){ return TABS_ORDER.map(id=>document.getElementById('tab-'+id)); }
function layoutTabs(activeIndex, animate){
  if(animate===undefined) animate=true;
  getTabEls().forEach((elx,i)=>{
    if(!elx) return;
    elx.style.transition = animate
      ? 'transform 0.38s cubic-bezier(0.2,0.8,0.2,1), opacity 0.32s ease'
      : 'none';
    if(i<activeIndex){
      elx.style.transform='translate3d(-25%,0,0) scale(0.95)';
      elx.style.opacity='0';
      elx.style.pointerEvents='none';
    } else if(i===activeIndex){
      elx.style.transform='translate3d(0,0,0) scale(1)';
      elx.style.opacity='1';
      elx.style.pointerEvents='auto';
    } else {
      elx.style.transform='translate3d(100%,0,0) scale(1)';
      elx.style.opacity='1';
      elx.style.pointerEvents='none';
    }
  });
}
function scrollElOfTab(tab){
  if(tab==='dashboard') return document.getElementById('tab-dashboard');
  if(tab==='kelas') return document.getElementById('tab-kelas');
  if(tab==='riwayat') return document.querySelector('#tab-riwayat .scroll-y');
  return null;
}
function syncActiveTabUI(){
  $$('.nav-btn').forEach(b=> b.classList.toggle('active', b.dataset.tab===APP.activeTab));
  if(APP.activeTab==='dashboard'){ renderDashboard(); } else if(APP.activeTab==='kelas'){ renderKelas(); } else { renderRiwayat(); }
  const activeEl = scrollElOfTab(APP.activeTab);
  if(activeEl) activeEl.scrollTop = APP.scrollPos[APP.activeTab]||0;
  layoutTabs(TABS_ORDER.indexOf(APP.activeTab));
}
function switchTab(t){
  const prevEl = scrollElOfTab(APP.activeTab);
  if(prevEl) APP.scrollPos[APP.activeTab] = prevEl.scrollTop;
  APP.activeTab = t;
  syncActiveTabUI();
}

// ==================== GESTURE SWIPE ANTAR TAB ====================
function initTabSwipe(){
  const container = document.getElementById('tabs-wrap');
  if(!container) return;
  let startX=0, startY=0, startTime=0, isDragging=false, isScrolling=null;
  const activeIndex = () => TABS_ORDER.indexOf(APP.activeTab);
  const triggerReset = () => layoutTabs(activeIndex(), true);

  const onStart = (e) => {
    if(e.touches.length>1) return;
    const isExempt = e.target.closest && e.target.closest('.no-tab-swipe');
    if(isExempt){ isDragging=false; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    isDragging = true;
    isScrolling = null;
    getTabEls().forEach(elx=>{ if(elx) elx.style.transition='none'; });
  };

  const onMove = (e) => {
    if(!isDragging) return;
    const x = e.touches[0].clientX, y = e.touches[0].clientY;
    const deltaX = x-startX, deltaY = y-startY;
    if(isScrolling===null){
      if(Math.abs(deltaY)>Math.abs(deltaX) && Math.abs(deltaY)>5) isScrolling=true;
      else if(Math.abs(deltaX)>5) isScrolling=false;
    }
    if(isScrolling) return;
    if(isScrolling===false && e.cancelable) e.preventDefault();

    const sw = window.innerWidth;
    const idx = activeIndex();
    const els = getTabEls();
    const currentTabEl = els[idx], nextTabEl = els[idx+1], prevTabEl = els[idx-1];
    if(!currentTabEl) return;

    if(deltaX<0){
      if(nextTabEl){
        nextTabEl.style.transform = `translate3d(${sw+deltaX}px,0,0)`;
        const progress = Math.min(Math.abs(deltaX)/sw, 1);
        currentTabEl.style.transform = `translate3d(${deltaX*0.25}px,0,0) scale(${1-progress*0.05})`;
        currentTabEl.style.opacity = 1-progress;
      } else {
        currentTabEl.style.transform = `translate3d(${deltaX*0.2}px,0,0)`;
      }
    } else if(deltaX>0){
      if(prevTabEl){
        currentTabEl.style.transform = `translate3d(${deltaX}px,0,0)`;
        const progress = Math.min(deltaX/sw, 1);
        prevTabEl.style.transform = `translate3d(${-sw*0.25*(1-progress)}px,0,0) scale(${0.95+progress*0.05})`;
        prevTabEl.style.opacity = progress;
      } else {
        currentTabEl.style.transform = `translate3d(${deltaX*0.2}px,0,0)`;
      }
    }
  };

  const onEnd = (e) => {
    if(!isDragging) return;
    isDragging = false;
    if(isScrolling){ triggerReset(); return; }

    const x = e.changedTouches[0].clientX;
    const deltaX = x-startX;
    const sw = window.innerWidth;
    const velocity = Math.abs(deltaX)/(Date.now()-startTime);
    const crossedThreshold = Math.abs(deltaX)>sw*0.3 || velocity>0.6;

    const idx = activeIndex();
    if(crossedThreshold){
      if(deltaX<0 && idx<TABS_ORDER.length-1) switchTab(TABS_ORDER[idx+1]);
      else if(deltaX>0 && idx>0) switchTab(TABS_ORDER[idx-1]);
      else triggerReset();
    } else {
      triggerReset();
    }
  };

  container.addEventListener('touchstart', onStart, {passive:false});
  container.addEventListener('touchmove', onMove, {passive:false});
  container.addEventListener('touchend', onEnd);
}

const APP = { activeTab:'dashboard', scrollPos:{dashboard:0, kelas:0, riwayat:0}, selectedHariKelas: null };
function bootMain(){
  showScreen('scr-main');
  renderFab();
  syncActiveTabUI();
  bersihkanTrashLama();
}
function wireNav(){
  $$('.nav-btn').forEach(b => b.addEventListener('click', (e) => {
    const pill = $('.navpill', b);
    if(pill) {
      pill.classList.remove('animate-squish');
      void pill.offsetWidth; // trigger reflow
      pill.classList.add('animate-squish');
    }
    switchTab(b.dataset.tab);
  }));
}
document.addEventListener('pointerdown', (e) => {
  const target = e.target.closest('.statelayer');
  if(!target) return;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size/2;
  const y = e.clientY - rect.top - size/2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  target.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
});
/* ==========================================================
   MATERIAL 3 EXPRESSIVE — Physics-based Interactions
   (Rubber-band scroll telah dihapus karena glitchy & bentrok
   dengan native scroll pada perangkat sentuh)
   ========================================================== */
function initPhysicsInteractions(){
}

async function initApp(){
  await dbLoad();
  applyTheme();
  wireNav();
  initTabSwipe();
  document.querySelectorAll('.scroll-y').forEach(el => {
    el.style.transformOrigin = 'top center';
    el.addEventListener('scroll', () => {
      if(el.scrollTop <= 0) {
        el.style.transformOrigin = 'top center';
        el.style.transform = 'scaleY(1.02)';
        setTimeout(() => el.style.transform = 'scaleY(1)', 150);
      } else if(el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.style.transformOrigin = 'bottom center';
        el.style.transform = 'scaleY(1.02)';
        setTimeout(() => el.style.transform = 'scaleY(1)', 150);
      }
    });
  });
  setupPWA();
  if(!DB.data.appState.sudahOnboarding){
    startOnboarding();
  } else if(shouldShowQuickCheck()){
    bootMain();
    renderQuickCheck();
  } else {
    bootMain();
  }
}
document.addEventListener('DOMContentLoaded', initApp);
