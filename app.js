/* Teşkilat Masası — tıklanabilir ön tasarım. Değişiklikler yalnız bu tarayıcıda saklanır. */
(function(){
const V = window.VERI;
const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString('tr-TR');
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY = 'teskilat-onizleme-v1';

let D;
try { D = JSON.parse(localStorage.getItem(KEY)); } catch(e){ D = null; }
if(!D || !D.uyeler){
  D = {rol:null, uyeler:V.uyeler.slice(), talepler:JSON.parse(JSON.stringify(V.TALEPLER)), gorevler:V.GOREVLER.slice(), mesajlar:V.MESAJLAR.slice(), yoklama:{}};
}
{ const q = new URLSearchParams(location.search).get('rol'); if(q && V.ROLLER.some(r=>r.id===q)) D.rol = q; }
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(D)); }catch(e){} };
const rol = () => V.ROLLER.find(r => r.id === D.rol);

function inScope(x){
  const r = rol(); if(!r) return false;
  if(r.ilce && x.ilce !== r.ilce) return false;
  if(r.mah && x.mah && x.mah !== r.mah) return false;
  return true;
}
const uyeler = () => D.uyeler.filter(inScope).sort((a,b)=>a.kayit<b.kayit?1:-1);
const talepler = () => D.talepler.filter(inScope);
const gorevler = () => D.gorevler.filter(g => { const r = rol(); if(r.id==='mah') return g.kim===r.ad; return inScope(g); });
const ilceler = () => { const r = rol(); return r.ilce ? V.ILCELER.filter(i => i.ad === r.ilce) : V.ILCELER; };

function toast(t){
  const el = document.createElement('div'); el.className='toast'; el.textContent=t; document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2600);
}

/* ---------- simgeler (alt sekme) ---------- */
const IC = {
  ev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z"/></svg>',
  uye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 14.4c1.6.7 2.6 2.3 3 4.6"/></svg>',
  arti:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  talep:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  gorev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/></svg>'
};

/* ---------- menü ---------- */
function navItems(){
  const r = rol();
  const yeni = talepler().filter(t => t.durum==='Yeni').length;
  const all = [
    {h:'genel', t:'Genel bakış'},
    {g:'Üyeler'},
    {h:'uyeler', t:'Üye listesi'},
    {h:'uye-ekle', t:'Yeni üye kaydı'},
    {h:'aktar', t:'Excel\'den aktar', yok:['mah']},
    {g:'İletişim'},
    {h:'mesaj', t:'Toplu mesaj', yok:['mah']},
    {h:'talepler', t:'Talepler', c:yeni},
    {h:'asistan', t:'Yapay zekâ asistanı', yok:['mah']},
    {g:'Teşkilat'},
    {h:'gorevler', t:'Görevler'},
    {h:'etkinlikler', t:'Toplantı ve yoklama'},
    {h:'teskilat', t:'Teşkilat ve yetkiler', yok:['mah']},
    {h:'raporlar', t:'Raporlar', yok:['mah']}
  ];
  return all.filter(i => !i.yok || !i.yok.includes(r.id));
}

function shell(baslik, govde, aktif){
  const r = rol();
  const nav = navItems().map(i => i.g ? `<div class="grp">${i.g}</div>` :
    `<a href="#/${i.h}" class="${aktif===i.h?'on':''}">${i.t}${i.c?`<span class="cnt">${i.c}</span>`:''}</a>`).join('');
  const mt = [['genel','Özet',IC.ev],['uyeler','Üyeler',IC.uye],['uye-ekle','Kayıt',IC.arti],['talepler','Talepler',IC.talep],['gorevler','Görevler',IC.gorev]]
    .map(([h,t,ic]) => h==='uye-ekle'
      ? `<a href="#/${h}" class="add"><span class="c">${ic}</span><em>${t}</em></a>`
      : `<a href="#/${h}" class="${aktif===h?'on':''}">${ic}<span>${t}</span></a>`).join('');
  return `<div class="app">
    <aside class="side">
      <div class="brand"><div class="logo"><div class="mark">parti<br>logosu</div><div><b>Adana İl Başkanlığı</b><small>Teşkilat Masası</small></div></div></div>
      <nav class="nav">${nav}</nav>
      <div class="who"><b>${r.ad}</b>${r.gorev}<br><span style="color:#8d98a9">${r.alan}</span><button data-act="cikis">Kullanıcı değiştir</button></div>
    </aside>
    <div class="main">
      <header class="top"><h1>${baslik}</h1><span class="scope">${r.alan}</span><input class="search" placeholder="Üye, telefon ya da mahalle ara" data-act="ara" aria-label="Ara"></header>
      <div class="wrap">${govde}</div>
      <div class="foot">Ön tasarım: tüm kişi, telefon ve sayılar örnektir. Hazırlayan Webizmo.</div>
    </div>
    <nav class="mtab">${mt}</nav>
  </div>`;
}

/* ---------- ekranlar ---------- */
const E = {};

E.giris = () => `<div class="login">
  <div class="l">
    <div class="logo" style="display:flex;gap:12px;align-items:center"><div class="mark" style="width:46px;height:46px;border-radius:50%;border:2px dashed #5b6779;display:grid;place-items:center;font-size:11px;text-align:center;line-height:1.1;color:#8d98a9">parti<br>logosu</div><div><b style="color:#fff">Adana İl Başkanlığı</b><br><small style="color:#8d98a9">Teşkilat Masası</small></div></div>
    <div>
      <h1>İl, ilçe, mahalle ve sandık düzeyinde teşkilat takibi</h1>
      <p>Üye kaydı, bölge yetkisi, toplu mesaj, talepler, görevler ve toplantı yoklaması aynı programda.</p>
      <p style="color:#8d98a9;font-size:13.5px">Bu bir ön tasarımdır. Kişi adları, telefonlar ve sayılar örnektir; parti adı ve logosu sonradan eklenir.</p>
    </div>
    <small style="color:#6f7a8c">Hazırlayan Webizmo</small>
  </div>
  <div class="r"><form class="box" data-act="giris">
    <h2 style="margin:0 0 4px;font-size:22px">Giriş</h2>
    <p class="muted" style="margin:0">Hangi görevliyle gireceğinizi seçin. Her görevli yalnız kendi bölgesini görür.</p>
    <div class="roles">${V.ROLLER.map((r,i)=>`<label><input type="radio" name="rol" value="${r.id}" ${i===0?'checked':''}><span class="av">${r.kisa}</span><span><b>${r.ad}</b><small>${r.gorev}. ${r.alan}</small></span></label>`).join('')}</div>
    <div class="f"><label>Telefon numarası<input value="0532 ••• •• 26" readonly></label>
    <label>SMS ile gelen kod<input value="4 8 1 9" readonly></label></div>
    <button class="btn p" style="width:100%;margin-top:16px">Giriş yap</button>
    <p class="muted" style="font-size:13px;margin-top:12px">Gerçek programda giriş telefona gelen tek kullanımlık kodla yapılır; şifre gerekmez.</p>
  </form></div>
</div>`;

E.genel = () => {
  const r = rol(), il = ilceler();
  const toplam = r.id==='mah' ? 186 : il.reduce((a,b)=>a+b.uye,0);
  const hedef = r.id==='mah' ? 300 : il.reduce((a,b)=>a+b.hedef,0);
  const T = talepler(), yeni = T.filter(t=>t.durum==='Yeni').length, acik = T.filter(t=>t.durum!=='Cevaplandı').length;
  const G = gorevler(), risk = G.filter(g=>g.durum==='Gecikme riski').length;
  const ilceHtml = r.id==='mah'
    ? mahDagilim()
    : il.slice(0,8).map(i=>{const p=Math.round(i.uye/i.hedef*100);return `<div class="ilce"><span>${i.ad}</span><div class="bar ${p<45?'w':''}"><i style="width:${p}%"></i></div><span class="v">${fmt(i.uye)} / ${fmt(i.hedef)}</span></div>`}).join('') + (il.length>8?`<p style="margin:10px 0 0"><a href="#/raporlar">15 ilçenin tamamı</a></p>`:'');
  return shell(`Günaydın ${r.id==='il'?r.ad:r.ad.split(' ')[0]+(r.id==='ilce'?' Bey':' Hanım')}`, `
  <div class="kpis">
    <div class="kpi"><div class="n">${fmt(toplam)}</div><div class="l">${r.id==='mah'?'Mahalledeki üye':'Kayıtlı üye'}</div><div class="d">Bu hafta ${r.id==='mah'?'9':r.id==='ilce'?'86':'412'} yeni kayıt</div></div>
    <div class="kpi"><div class="n">%${Math.round(toplam/hedef*100)}</div><div class="l">Yıl sonu hedefine ulaşma</div><div class="d w">Hedef ${fmt(hedef)} üye</div></div>
    <div class="kpi"><div class="n">${acik}</div><div class="l">Açık talep</div><div class="d ${yeni?'w':''}">${yeni} talebe henüz kimse bakmadı</div></div>
    <div class="kpi"><div class="n">${G.filter(g=>g.durum!=='Tamamlandı').length}</div><div class="l">Süren görev</div><div class="d ${risk?'w':''}">${risk} görevde gecikme riski</div></div>
  </div>
  <div class="grid g2">
    <div class="stack">
      <div class="card"><h2>${r.id==='mah'?'Sandık bazında üye dağılımı':'İlçe hedefleri'} <small>kayıtlı / hedef</small></h2>${ilceHtml}</div>
      <div class="card"><h2>Bakılmayı bekleyen talepler</h2><ul class="list">${T.filter(t=>t.durum!=='Cevaplandı').slice(0,4).map(t=>`<li><div class="m"><b><a href="#/talep/${t.id}" style="color:inherit">${esc(t.konu)}</a></b><span>${t.ilce} / ${t.mah}, ${t.kanal}</span></div>${durumTag(t.durum)}<span class="when">${t.zaman}</span></li>`).join('') || '<li class="muted">Açık talep yok.</li>'}</ul></div>
    </div>
    <div class="stack">
      ${r.id!=='mah'?`<div class="yz"><div class="h">Yapay zekâ haftalık özeti</div>${r.id==='il'?'Bu hafta 412 yeni üye kaydedildi; artışın yarısı Seyhan ve Çukurova\'dan. Yüreğir\'de 5 mahallenin 3\'ünde hâlâ temsilci yok, kayıtlar orada yavaş. Ceyhan\'da iki talep 2 günden uzun süredir cevapsız. Salı toplantısına 220 davetliden 164\'ü katılımını onayladı.':'Seyhan\'da bu hafta 86 yeni üye kaydedildi. Reşatbey ve Cemalpaşa hedefin üstünde, Döşeme ve Ziyapaşa geride. Sandık görevlisi listesinde 68 kişi eksik.'}<p style="margin:10px 0 0"><a href="#/asistan">Ayrıntılı özet ve öneriler</a></p></div>`:''}
      <div class="card"><h2>Yaklaşan toplantılar</h2><ul class="list">${V.ETKINLIKLER.filter(e=>e.durum!=='Tamamlandı' && (r.id==='il'||e.ilce===r.ilce)).map(e=>`<li><div class="m"><b><a href="#/etkinlik/${e.id}" style="color:inherit">${e.ad}</a></b><span>${e.tarih}, ${e.saat}. ${e.yer}</span></div></li>`).join('')}</ul></div>
      <div class="card"><h2>Görevlerim ve ekip</h2><ul class="list">${G.filter(g=>g.durum!=='Tamamlandı').slice(0,4).map(g=>`<li><div class="m"><b>${g.ad}</b><span>${g.kim}, son gün ${g.son}</span></div>${gorevTag(g.durum)}</li>`).join('')}</ul></div>
    </div>
  </div>`, 'genel');
};

function mahDagilim(){
  const S = [[1201,22],[1202,18],[1203,15],[1204,9],[1205,14],[1206,11]];
  return S.map(([k,n])=>`<div class="ilce"><span>Sandık ${k}</span><div class="bar ${n<12?'w':''}"><i style="width:${Math.round(n/25*100)}%"></i></div><span class="v">${n} / 25</span></div>`).join('') + '<p class="muted" style="font-size:13px;margin:10px 0 0">Reşatbey\'de 14 sandık var, ilk 6\'sı gösteriliyor. Temsilci yalnız kendi mahallesini görür.</p>';
}

const durumTag = d => `<span class="tag ${({'Yeni':'t-w','Görüldü':'t-n','İlgileniliyor':'t-a','Cevaplandı':'t-ok'})[d]}">${d}</span>`;
const gorevTag = d => `<span class="tag ${({'Sürüyor':'t-a','Tamamlandı':'t-ok','Gecikme riski':'t-b','Başlamadı':'t-n'})[d]}">${d}</span>`;

let F = {ilce:'', mah:'', riza:'', gonullu:'', q:''};
E.uyeler = () => {
  const r = rol();
  let L = uyeler();
  if(F.ilce) L = L.filter(u=>u.ilce===F.ilce);
  if(F.mah) L = L.filter(u=>u.mah===F.mah);
  if(F.riza) L = L.filter(u=>u.riza===F.riza);
  if(F.gonullu) L = L.filter(u=>u.gonullu.includes(F.gonullu));
  if(F.q){ const q=F.q.toLocaleLowerCase('tr'); L = L.filter(u=>(u.ad+' '+u.mah+' '+u.ilce+' '+u.sandik).toLocaleLowerCase('tr').includes(q)); }
  const ilOps = ilceler().map(i=>`<option ${F.ilce===i.ad?'selected':''}>${i.ad}</option>`).join('');
  const mahOps = (F.ilce||r.ilce) ? V.ILCELER.find(i=>i.ad===(F.ilce||r.ilce)).mah.filter(m=>!r.mah||m===r.mah).map(m=>`<option ${F.mah===m?'selected':''}>${m}</option>`).join('') : '';
  return shell('Üye listesi', `
  <div class="filters">
    <input placeholder="Ad, mahalle ya da sandık no" value="${esc(F.q)}" data-f="q" style="flex:1;min-width:200px">
    ${r.ilce?'':`<select data-f="ilce"><option value="">Tüm ilçeler</option>${ilOps}</select>`}
    ${r.mah?'':`<select data-f="mah"><option value="">Tüm mahalleler</option>${mahOps}</select>`}
    <select data-f="gonullu"><option value="">Gönüllülük alanı</option>${V.GONULLU.map(g=>`<option ${F.gonullu===g?'selected':''}>${g}</option>`).join('')}</select>
    <select data-f="riza"><option value="">Açık rıza durumu</option><option ${F.riza==='Alındı'?'selected':''}>Alındı</option><option ${F.riza==='Bekliyor'?'selected':''}>Bekliyor</option></select>
  </div>
  <div class="card">
    <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
      <h2 style="margin:0">${L.length} üye <small>örnek kayıtlar</small></h2>
      <div class="btns"><a class="btn s" href="#/mesaj">Bu listeye mesaj gönder</a><button class="btn s hide-m" data-act="excel">Excel'e aktar</button><a class="btn s p" href="#/uye-ekle">Yeni üye</a></div>
    </div>
    <div class="tbl"><table><thead><tr><th>Ad soyad</th><th>İlçe / mahalle</th><th class="hide-m">Sandık</th><th class="hide-m">Telefon</th><th class="hide-m">Gönüllülük</th><th>Rıza</th><th class="hide-m">Kayıt</th></tr></thead>
    <tbody>${L.slice(0,40).map(u=>`<tr class="click" data-go="#/uye/${u.id}"><td><b style="font-weight:600">${esc(u.ad)}</b>${u.durum==='Başvuru'?' <span class="tag t-w">Başvuru</span>':''}</td><td>${u.ilce} / ${u.mah}</td><td class="hide-m">${u.sandik}</td><td class="hide-m">${u.tel}</td><td class="hide-m">${u.gonullu.join(', ')||'<span class="muted">-</span>'}</td><td>${u.riza==='Alındı'?'<span class="tag t-ok">Alındı</span>':'<span class="tag t-w">Bekliyor</span>'}</td><td class="hide-m">${u.kayit.split('-').reverse().join('.')}</td></tr>`).join('') || `<tr><td colspan="7" class="empty">Bu süzgece uyan üye yok.</td></tr>`}</tbody></table></div>
    ${L.length>40?`<p class="muted" style="font-size:13px">İlk 40 kayıt gösteriliyor.</p>`:''}
  </div>
  <p class="note" style="margin-top:16px">Telefon numaraları listede gizli görünür; tamamını yalnız yetkili görevli üye kartında görür ve her görüntüleme kayda geçer. Açık rızası alınmamış üyeye toplu mesaj gitmez.</p>`, 'uyeler');
};

E.uye = id => {
  const u = D.uyeler.find(x=>x.id===id);
  if(!u || !inScope(u)) return shell('Üye kartı', `<div class="card empty">Bu üye sizin bölgenizde değil, kartını göremezsiniz.</div>`, 'uyeler');
  const bas = u.ad.split(' ').map(x=>x[0]).join('').slice(0,2);
  return shell('Üye kartı', `
  <p style="margin:0 0 14px"><a href="#/uyeler">Üye listesine dön</a></p>
  <div class="grid g2">
    <div class="card">
      <div class="row" style="align-items:center;margin-bottom:16px"><span class="av big">${bas}</span><div><h2 style="margin:0;font-size:20px">${esc(u.ad)}</h2><span class="muted">Üye no ${u.id}. ${u.durum==='Aktif'?'Aktif üye':'Başvuru incelemede'}</span></div></div>
      <dl class="dl">
        <dt>İlçe / mahalle</dt><dd>${u.ilce} / ${u.mah}</dd>
        <dt>Sandık no</dt><dd>${u.sandik}</dd>
        <dt>Telefon</dt><dd>${u.tel} <button class="btn s" data-act="telgoster" style="margin-left:6px">Numarayı göster</button></dd>
        <dt>Yaş, meslek</dt><dd>${u.yas}, ${u.meslek}</dd>
        <dt>Gönüllülük</dt><dd>${u.gonullu.join(', ')||'-'}</dd>
        <dt>Kayıt</dt><dd>${u.kayit.split('-').reverse().join('.')}, ${u.kaynak}, kaydeden ${u.kaydeden}</dd>
        <dt>Açık rıza</dt><dd>${u.riza==='Alındı'?'<span class="tag t-ok">Alındı</span> SMS onayıyla':'<span class="tag t-w">Bekliyor</span> <button class="btn s" data-act="riza" data-id="'+u.id+'">Onay SMS\'i gönder</button>'}</dd>
      </dl>
      <div class="btns" style="margin-top:18px"><button class="btn" data-act="ara-tel">Ara</button><button class="btn" data-act="wa">WhatsApp yaz</button><button class="btn" data-act="gorev-ver">Görev ver</button></div>
    </div>
    <div class="card"><h2>Hareketler</h2><ul class="list">
      <li><div class="m"><b>İl danışma toplantısına davet edildi</b><span>SMS, iletildi</span></div><span class="when">16.11</span></li>
      <li><div class="m"><b>Yüreğir tanışma toplantısına katıldı</b><span>QR yoklama</span></div><span class="when">14.11</span></li>
      <li><div class="m"><b>Üye kaydı oluşturuldu</b><span>${u.kaynak}, ${u.kaydeden}</span></div><span class="when">${u.kayit.split('-').reverse().join('.').slice(0,5)}</span></li>
    </ul>
    <p class="note" style="margin-top:12px">Kartı kim açtı, kim telefonu gördü, kim değişiklik yaptı tarih ve saatiyle kayıtlıdır.</p></div>
  </div>`, 'uyeler');
};

E['uye-ekle'] = () => {
  const r = rol();
  const il = r.ilce || 'Seyhan';
  const mahs = V.ILCELER.find(i=>i.ad===il).mah.filter(m=>!r.mah||m===r.mah);
  return shell('Yeni üye kaydı', `
  <div class="grid g2">
  <form class="card f" data-act="kaydet">
    <h2 style="margin:0">Saha kayıt formu <small>telefondan doldurulur</small></h2>
    <div class="two"><label>Ad<input name="ad" required placeholder="Ör. Ayşe"></label><label>Soyad<input name="soyad" required placeholder="Ör. Yıldız"></label></div>
    <div class="two"><label>Cep telefonu<input name="tel" required inputmode="tel" placeholder="05xx xxx xx xx"></label><label>T.C. kimlik no<input inputmode="numeric" placeholder="Üyelik başvurusu için"></label></div>
    <div class="two"><label>İlçe<select name="ilce" ${r.ilce?'disabled':''}>${ilceler().map(i=>`<option ${i.ad===il?'selected':''}>${i.ad}</option>`).join('')}</select></label>
    <label>Mahalle<select name="mah">${mahs.map(m=>`<option>${m}</option>`).join('')}</select></label></div>
    <div class="two"><label>Sandık no<input name="sandik" inputmode="numeric" placeholder="Seçmen kaydından"></label><label>Meslek<select name="meslek">${V.MESLEK.map(m=>`<option>${m}</option>`).join('')}</select></label></div>
    <fieldset style="border:0;padding:0;margin:0"><legend style="font-size:13.5px;color:var(--ink-2);font-weight:500;margin-bottom:6px">Gönüllü olmak istediği alanlar</legend>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px">${V.GONULLU.map(g=>`<label class="chk"><input type="checkbox" name="g" value="${g}">${g}</label>`).join('')}</div></fieldset>
    <label class="chk" style="background:var(--bg);padding:12px;border-radius:6px"><input type="checkbox" name="riza" required><span>Kişisel verilerin korunması aydınlatma metni okundu. Açık rıza için kişinin telefonuna onay SMS'i gönderilecek.</span></label>
    <div class="btns"><button class="btn p">Kaydet ve onay SMS'i gönder</button><a class="btn" href="#/uyeler">Vazgeç</a></div>
  </form>
  <div class="stack">
    <div class="note"><b style="color:var(--ink)">Sahada nasıl kullanılır?</b><br>Mahalle temsilcisi formu telefonundan açar, kişiyle birlikte doldurur. İnternet yoksa kayıt telefonda bekler, bağlantı gelince kendiliğinden gönderilir.</div>
    <div class="note"><b style="color:var(--ink)">Tekrar kayıt kontrolü</b><br>Aynı telefon ya da kimlik numarası daha önce kaydedildiyse program uyarır, iki kayıt oluşmaz.</div>
    <div class="note"><b style="color:var(--ink)">Siyasi görüş özel nitelikli kişisel veridir</b><br>Kayıt, kişinin açık rızası olmadan aktif üyeye dönüşmez. Veriler Türkiye'deki sunucuda tutulur.</div>
  </div></div>`, 'uye-ekle');
};

let AK = 1;
E.aktar = () => {
  const adim = ['Dosyayı seç','Sütunları eşle','Kontrol','Aktar'];
  let govde = '';
  if(AK===1) govde = `<div class="card" style="text-align:center;padding:40px 20px"><h2>Üye listesini Excel'den yükleyin</h2><p class="muted">Elinizdeki Excel ya da CSV dosyası. Sütun adları farklı olabilir, bir sonraki adımda eşlersiniz.</p><button class="btn p" data-act="ak" data-n="2">Örnek dosyayı seç: seyhan-uyeler-kasim.xlsx</button></div>`;
  if(AK===2) govde = `<div class="card"><h2>Sütun eşleme <small>seyhan-uyeler-kasim.xlsx, 124 satır</small></h2><div class="tbl"><table><thead><tr><th>Dosyadaki sütun</th><th>Örnek değer</th><th>Programdaki alan</th></tr></thead><tbody>
    ${[['ADI SOYADI','Mehmet Kara','Ad soyad'],['GSM','0532 ••• •• 41','Cep telefonu'],['MAH.','Kurtuluş','Mahalle'],['SANDIK','1047','Sandık no'],['MESLEĞİ','Esnaf','Meslek'],['NOT','Sandıkta görev alabilir','Not']].map(x=>`<tr><td><b style="font-weight:600">${x[0]}</b></td><td class="muted">${x[1]}</td><td><select><option>${x[2]}</option><option>Kullanma</option></select></td></tr>`).join('')}
    </tbody></table></div><div class="btns" style="margin-top:14px"><button class="btn p" data-act="ak" data-n="3">Kontrol et</button></div></div>`;
  if(AK===3) govde = `<div class="card"><h2>Kontrol sonucu</h2><ul class="list">
    <li><span class="tag t-ok">115</span><div class="m"><b>Satır sorunsuz</b><span>Aktarılmaya hazır</span></div></li>
    <li><span class="tag t-w">6</span><div class="m"><b>Telefonu zaten kayıtlı</b><span>Mevcut kayıtla birleştirilecek, yeni kayıt açılmayacak</span></div></li>
    <li><span class="tag t-b">3</span><div class="m"><b>Mahalle adı tanınmadı</b><span>"Kurtulus", "Resatbey", "Cemal paşa": önerilen düzeltmeyle aktarılacak</span></div></li></ul>
    <div class="btns" style="margin-top:14px"><button class="btn p" data-act="ak" data-n="4">124 kaydı aktar</button><button class="btn" data-act="ak" data-n="2">Geri</button></div></div>`;
  if(AK===4) govde = `<div class="card" style="text-align:center;padding:40px 20px"><h2>Aktarım tamamlandı</h2><p>118 yeni üye eklendi, 6 kayıt mevcut üyelerle birleştirildi.</p><p class="muted">Rızası alınmamış 31 kişiye onay SMS'i gönderebilirsiniz.</p><div class="btns" style="justify-content:center"><button class="btn p" data-act="toast" data-t="31 kişiye onay SMS'i sıraya alındı">Onay SMS'i gönder</button><a class="btn" href="#/uyeler">Üye listesine git</a><button class="btn" data-act="ak" data-n="1">Baştan başla</button></div></div>`;
  return shell('Excel\'den aktar', `<div class="step">${adim.map((a,i)=>`<span class="${AK===i+1?'on':''}">${i+1}. ${a}</span>`).join('')}</div>${govde}`, 'aktar');
};

let M = {ilce:'', grup:'Tüm üyeler', kanal:['SMS'], metin:'Sayın {ad}, 24 Kasım Salı saat 19:00\'da il başkanlığımızda yapılacak danışma toplantımıza davetlisiniz. Katılımınızı bu mesaja EVET yazarak bildirebilirsiniz.'};
E.mesaj = () => {
  const r = rol();
  const il = M.ilce ? V.ILCELER.filter(i=>i.ad===M.ilce) : ilceler();
  const top = il.reduce((a,b)=>a+b.uye,0);
  const oran = {'Tüm üyeler':1,'Sandık görevlisi gönüllüleri':.12,'Gençler (18-30 yaş)':.27,'Son 30 günde kayıt olanlar':.4}[M.grup];
  const kisi = Math.round(top*oran), rizali = Math.round(kisi*.86);
  const ornek = M.metin.replace('{ad}','Ayşe Yıldız');
  return shell('Toplu mesaj', `
  <div class="grid g2">
    <div class="card f">
      <h2 style="margin:0">Kime gidecek?</h2>
      <div class="two">
        <label>Bölge<select data-m="ilce" ${r.ilce?'disabled':''}><option value="">${r.ilce||'Adana geneli'}</option>${r.ilce?'':V.ILCELER.map(i=>`<option ${M.ilce===i.ad?'selected':''}>${i.ad}</option>`).join('')}</select></label>
        <label>Grup<select data-m="grup">${['Tüm üyeler','Sandık görevlisi gönüllüleri','Gençler (18-30 yaş)','Son 30 günde kayıt olanlar'].map(g=>`<option ${M.grup===g?'selected':''}>${g}</option>`).join('')}</select></label>
      </div>
      <div class="note"><b style="color:var(--ink);font-size:15px">${fmt(rizali)} kişiye</b> gidecek. Seçilen grupta ${fmt(kisi)} üye var; açık rızası olmayan ${fmt(kisi-rizali)} kişi otomatik çıkarıldı.</div>
      <h2 style="margin:6px 0 0">Hangi kanaldan?</h2>
      <div class="chan">
        ${[['SMS','Herkese ulaşır, kısa metin'],['WhatsApp','Onaylı şablonla, okundu bilgisi'],['E-posta','Uzun duyuru ve ek dosya']].map(([k,a])=>`<label><input type="checkbox" data-kanal="${k}" ${M.kanal.includes(k)?'checked':''}><span><b>${k}</b><small>${a}</small></span></label>`).join('')}
      </div>
      <label>Mesaj metni <small class="muted">{ad} yazdığınız yere kişinin adı gelir</small><textarea data-m="metin">${esc(M.metin)}</textarea></label>
      <div class="btns"><button class="btn s" type="button" data-act="yz-metin" data-tip="kisa">Yapay zekâ: kısalt</button><button class="btn s" type="button" data-act="yz-metin" data-tip="sicak">Yapay zekâ: daha samimi yaz</button><span class="muted" style="font-size:13px;align-self:center">${M.metin.length} karakter, ${Math.ceil(M.metin.length/155)} SMS</span></div>
      <div class="btns" style="margin-top:4px"><button class="btn p" type="button" data-act="gonder">${fmt(rizali)} kişiye gönder</button><button class="btn" type="button" data-act="toast" data-t="Gönderim 24.11 sabah 10:00'a planlandı">İleri tarihe planla</button></div>
    </div>
    <div class="stack">
      <div class="card"><h2>Telefonda görünüşü</h2><div class="preview"><div class="bubble">${esc(ornek)}</div></div>
      <p class="muted" style="font-size:13px;margin-bottom:0">EVET yazanlar toplantının katılım listesine kendiliğinden eklenir.</p></div>
      <div class="card"><h2>Son gönderimler</h2><ul class="list">${D.mesajlar.slice(0,4).map(m=>`<li><div class="m"><b>${esc(m.metin)}</b><span>${m.hedef}, ${m.kanal}, ${fmt(m.kisi)} kişi</span></div><span class="when">${m.iletim}<br>${m.tarih.slice(0,5)}</span></li>`).join('')}</ul></div>
    </div>
  </div>`, 'mesaj');
};

let TF = '';
E.talepler = () => {
  let T = talepler();
  if(TF) T = T.filter(t=>t.durum===TF);
  return shell('Talepler', `
  <div class="tabs">${['','Yeni','Görüldü','İlgileniliyor','Cevaplandı'].map(d=>`<button class="${TF===d?'on':''}" data-act="tf" data-d="${d}">${d||'Tümü'} (${(d?talepler().filter(t=>t.durum===d):talepler()).length})</button>`).join('')}</div>
  <div class="card"><ul class="list">${T.map(t=>`<li style="cursor:pointer" data-go="#/talep/${t.id}"><div class="m"><b>${esc(t.konu)}</b><span>${esc(t.kim)}, ${t.ilce} / ${t.mah}. ${t.kanal}. Yapay zekâ: ${t.kat}, öncelik ${t.onc.toLocaleLowerCase('tr')}</span><br><span>${t.atanan?'İlgilenen: '+t.atanan:'<b style="color:var(--warn);display:inline;font-size:13.5px">Henüz kimse üstlenmedi</b>'}</span></div>${durumTag(t.durum)}<span class="when">${t.zaman}</span></li>`).join('') || '<li class="muted">Bu durumda talep yok.</li>'}</ul></div>
  <p class="note" style="margin-top:16px">Telefon, WhatsApp, e-posta, web formu ve sahadan gelen talepler tek listede toplanır. Yapay zekâ her talebi okur, konusunu ve önceliğini çıkarır, cevap taslağı hazırlar. 24 saat içinde kimsenin üstlenmediği talep ilçe başkanına bildirilir.</p>`, 'talepler');
};

E.talep = id => {
  const t = D.talepler.find(x=>x.id===id);
  if(!t || !inScope(t)) return shell('Talep', `<div class="card empty">Bu talep sizin bölgenizde değil.</div>`, 'talepler');
  const r = rol();
  const gordum = t.gorenler.includes(r.ad);
  return shell(`Talep ${t.id}`, `
  <p style="margin:0 0 14px"><a href="#/talepler">Taleplere dön</a></p>
  <div class="grid g2">
    <div class="stack">
      <div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0;font-size:18px">${esc(t.konu)}</h2>${durumTag(t.durum)}</div>
        <p class="muted" style="margin:6px 0 14px">${esc(t.kim)}, ${t.ilce} / ${t.mah}. ${t.kanal}, ${t.zaman}</p>
        <div class="note" style="color:var(--ink);font-size:14.5px">${esc(t.metin)}</div></div>
      <div class="yz"><div class="h">Yapay zekâ özeti</div>${esc(t.ozet)}<p style="margin:10px 0 0"><span class="tag t-a">${t.kat}</span> <span class="tag ${t.onc==='Yüksek'?'t-b':'t-n'}">Öncelik: ${t.onc}</span></p></div>
      <div class="card f"><h2 style="margin:0">Cevap</h2><label>Yapay zekânın hazırladığı taslak, düzenleyebilirsiniz<textarea data-act="cvp">${esc(t.cevap)}</textarea></label>
        <div class="btns"><button class="btn p" data-act="cevapla" data-id="${t.id}">${t.kanal==='E-posta'?'E-postayla':t.kanal==='Telefon'?'SMS ile':'WhatsApp\'tan'} cevapla</button><button class="btn" data-act="toast" data-t="Talep bir göreve dönüştürüldü">Göreve dönüştür</button></div></div>
    </div>
    <div class="stack">
      <div class="card"><h2>Kim baktı, kim ilgileniyor?</h2>
        <div class="btns" style="margin-bottom:14px"><button class="btn ${gordum?'':'p'}" data-act="gordum" data-id="${t.id}" ${gordum?'disabled':''}>${gordum?'Gördünüz':'Gördüm'}</button><button class="btn" data-act="ustlen" data-id="${t.id}">${t.atanan===r.ad?'Sizde':'İlgileniyorum'}</button></div>
        <ul class="list">${t.gorenler.map(g=>`<li><span class="av">${g.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div class="m"><b>${g}</b><span>${g===t.atanan?'İlgileniyor':'Gördü'}</span></div></li>`).join('') || '<li class="muted">Henüz kimse görmedi.</li>'}</ul></div>
      <div class="card"><h2>Bu kişiden önceki talepler</h2><p class="muted" style="margin:0">Önceki talep yok. Üye kaydı ${t.kim.includes('muhtar')?'bulunamadı; kayıt önerilir':'bulundu'}.</p></div>
    </div>
  </div>`, 'talepler');
};

E.asistan = () => shell('Yapay zekâ asistanı', `
  <div class="grid g2e">
    <div class="stack">
      <div class="yz"><div class="h">Haftalık durum özeti, 12-18 Kasım</div>
      <p style="margin:0 0 8px">Bu hafta 412 yeni üye kaydedildi, il toplamı 4.814'e çıktı. Yıl sonu hedefinin %49'undayız.</p>
      <p style="margin:0 0 8px">Artışın yarısı Seyhan ve Çukurova'dan geldi. Yüreğir'de 5 mahallenin 3'ünde temsilci olmadığı için kayıt hızı il ortalamasının yarısında.</p>
      <p style="margin:0">7 talepten 2'si iki günden uzun süredir cevapsız; ikisi de Ceyhan'da. Salı toplantısı için 220 davetliden 164'ü EVET yazdı.</p></div>
      <div class="card"><h2>Önerilen işler</h2><ul class="list">
        <li><div class="m"><b>Yüreğir'de Levent, Dadaloğlu ve Yamaçlı'ya temsilci atayın</b><span>Bu mahallelerde 18 gönüllü kayıtlı; en çok ziyaret yapan 3 kişi aday olarak listelendi.</span></div><button class="btn s" data-act="toast" data-t="Ozan Tekin'e görev olarak atandı">Görev ver</button></li>
        <li><div class="m"><b>Salı toplantısına EVET yazmayan 56 kişiye hatırlatma</b><span>Pazartesi 18:00'de SMS önerilir.</span></div><button class="btn s" data-act="toast" data-t="Hatırlatma 23.11 18:00'e planlandı">Planla</button></li>
        <li><div class="m"><b>Ceyhan'daki 2 talebe bugün dönüş yapılsın</b><span>Murat Coşkun'a bildirim gönderilecek.</span></div><button class="btn s" data-act="toast" data-t="Murat Coşkun'a bildirim gönderildi">Bildir</button></li>
      </ul></div>
    </div>
    <div class="stack">
      <div class="card f"><h2 style="margin:0">Asistana sorun</h2>
        <label>Örnek: "Seyhan'da sandık görevlisi olmak isteyen kaç kişi var?"<textarea data-act="soru" style="min-height:70px">Salı toplantısı için sosyal medya paylaşım metni yaz</textarea></label>
        <button class="btn p" data-act="sor">Sor</button>
        <div id="cevap"></div>
      </div>
      <p class="note">Asistan yalnız programdaki kayıtlarla ve sizin yetkinizdeki bölgeyle çalışır. Gönderim yapmaz, taslak hazırlar; son kararı görevli verir.</p>
    </div>
  </div>`, 'asistan');

E.gorevler = () => {
  const G = gorevler();
  return shell('Görevler', `
  <div class="card">
    <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px"><h2 style="margin:0">${G.length} görev</h2>${rol().id!=='mah'?'<button class="btn s p" data-act="toast" data-t="Yeni görev formu gerçek programda açılır">Görev ver</button>':''}</div>
    <div class="tbl"><table><thead><tr><th>Görev</th><th>Sorumlu</th><th class="hide-m">Bölge</th><th>İlerleme</th><th class="hide-m">Son gün</th><th>Durum</th></tr></thead><tbody>
    ${G.map(g=>{const p=Math.round(g.ilerleme/g.hedef*100);return `<tr><td><b style="font-weight:600">${g.ad}</b></td><td>${g.kim}</td><td class="hide-m">${g.ilce}${g.mah?' / '+g.mah:''}</td><td style="min-width:120px"><div class="bar ${g.durum==='Gecikme riski'?'w':''}"><i style="width:${p}%"></i></div><small class="muted">${g.ilerleme} / ${g.hedef}</small></td><td class="hide-m">${g.son}</td><td>${gorevTag(g.durum)}</td></tr>`}).join('')}
    </tbody></table></div>
  </div>
  <p class="note" style="margin-top:16px">Görevli işini telefondan günceller (ör. "26 hane ziyaret edildi"). Son güne 2 gün kala ilerleme yarının altındaysa görev "gecikme riski" olur ve görevi veren kişiye bildirim gider.</p>`, 'gorevler');
};

E.etkinlikler = () => {
  const r = rol();
  const L = V.ETKINLIKLER.filter(e=>r.id==='il'||e.ilce===r.ilce);
  return shell('Toplantı ve yoklama', `
  <div class="card"><div class="tbl"><table><thead><tr><th>Toplantı</th><th>Tarih</th><th class="hide-m">Yer</th><th class="num">Davetli</th><th class="num">Katılan</th><th></th></tr></thead><tbody>
  ${L.map(e=>`<tr class="click" data-go="#/etkinlik/${e.id}"><td><b style="font-weight:600">${e.ad}</b></td><td>${e.tarih}, ${e.saat}</td><td class="hide-m">${e.yer}</td><td class="num">${e.davet}</td><td class="num">${e.durum==='Tamamlandı'?e.katilim:(D.yoklama[e.id]||[]).length||'-'}</td><td>${e.durum==='Tamamlandı'?'<span class="tag t-ok">Tamamlandı</span>':'<span class="tag t-a">QR yoklamayı aç</span>'}</td></tr>`).join('')}
  </tbody></table></div></div>`, 'etkinlikler');
};

E.etkinlik = id => {
  const e = V.ETKINLIKLER.find(x=>x.id===id);
  const gel = D.yoklama[id] || [];
  return shell(e.ad, `
  <p style="margin:0 0 14px"><a href="#/etkinlikler">Toplantılara dön</a></p>
  <div class="grid g2e">
    <div class="card" style="text-align:center">
      <h2>Girişte bu kodu okutun</h2>
      <canvas id="qr" class="qr" width="29" height="29" aria-label="Yoklama için QR kod, örnek"></canvas>
      <p class="muted" style="font-size:13.5px">Üye telefon kamerasıyla okutur, adı kendiliğinden listeye düşer. Telefonu olmayanı görevli isimle işaretler.</p>
      <div class="btns" style="justify-content:center"><button class="btn p" data-act="okut" data-id="${id}">Okutmayı dene</button><button class="btn" data-act="toast" data-t="QR kod yazdırma sayfası açılır">Yazdır</button></div>
    </div>
    <div class="card"><h2>Katılım <small>${e.tarih}, ${e.saat}</small></h2>
      <div class="kpis" style="grid-template-columns:repeat(3,1fr)"><div class="kpi"><div class="n">${e.davet}</div><div class="l">Davetli</div></div><div class="kpi"><div class="n">164</div><div class="l">EVET yazan</div></div><div class="kpi"><div class="n">${gel.length}</div><div class="l">Gelen</div></div></div>
      <ul class="list">${gel.slice().reverse().map(g=>`<li><span class="av">${g.ad.split(' ').map(x=>x[0]).join('')}</span><div class="m"><b>${g.ad}</b><span>${g.yer}</span></div><span class="when">${g.saat}</span></li>`).join('') || '<li class="muted">Henüz giriş yapan yok. "Okutmayı dene" ile örnek giriş ekleyin.</li>'}</ul>
      <p class="note" style="margin-top:10px">Toplantıdan sonra gelmeyenlere teşekkür ya da "sizi özledik" mesajı tek tıkla gönderilir.</p></div>
  </div>`, 'etkinlikler');
};

E.teskilat = () => {
  const r = rol();
  const sey = `<div class="n2"><span><b>Seyhan İlçe Başkanlığı</b><br><small>Hüseyin Kaya. 8 mahalle, 1.420 üye</small></span><span class="tag t-n">İlçe yetkisi</span></div>
    <div class="n3"><span>Reşatbey<br><small>Elif Demir. 14 sandık</small></span><span class="tag t-n">Mahalle yetkisi</span></div>
    <div class="n3"><span>Kurtuluş<br><small>Ahmet Kara. 11 sandık</small></span><span class="tag t-n">Mahalle yetkisi</span></div>
    <div class="n3"><span>Döşeme<br><small class="" style="color:var(--warn)">Temsilci atanmadı</small></span><button class="btn s" data-act="toast" data-t="Görevli atama formu açılır">Ata</button></div>`;
  return shell('Teşkilat ve yetkiler', `
  <div class="grid g2">
    <div class="card tree"><h2>Teşkilat şeması</h2>
      ${r.id==='il'?`<div class="n1"><span><b>Adana İl Başkanlığı</b><br><small>15 ilçe, 4.814 üye, 62 görevli</small></span><span class="tag t-a">İl yetkisi</span></div>`:''}
      ${sey}
      ${r.id==='il'?`<div class="n2"><span><b>Çukurova İlçe Başkanlığı</b><br><small>Fatma Yıldız. 6 mahalle, 980 üye</small></span><span class="tag t-n">İlçe yetkisi</span></div>
      <div class="n2"><span><b>Yüreğir İlçe Başkanlığı</b><br><small>Ozan Tekin. 5 mahalle, 3 temsilci eksik</small></span><span class="tag t-w">Eksik</span></div>
      <div class="n2"><span><b>Gençlik Kolları</b><br><small>Seda Arslan. İl geneli, yalnız 18-30 yaş</small></span><span class="tag t-n">Kol yetkisi</span></div>
      <p class="muted" style="font-size:13.5px">ve 12 ilçe daha</p>`:''}
    </div>
    <div class="card"><h2>Kim neyi görür?</h2><div class="tbl"><table><thead><tr><th>Görev</th><th>Gördüğü bölge</th><th>Yapabildiği</th></tr></thead><tbody>
      <tr><td>İl yöneticisi</td><td>Tüm il</td><td>Her şey, raporlar, toplu mesaj</td></tr>
      <tr><td>İlçe başkanı</td><td>Kendi ilçesi</td><td>Üye, görev, ilçeye mesaj</td></tr>
      <tr><td>Mahalle temsilcisi</td><td>Kendi mahallesi</td><td>Üye kaydı, ziyaret, talep</td></tr>
      <tr><td>Kol başkanı</td><td>Kendi kolu</td><td>Kol üyelerine mesaj</td></tr>
    </tbody></table></div>
    <p class="note" style="margin-top:12px">Görevden ayrılan kişinin erişimi tek tıkla kapanır; kayıtları kendisinden sonra gelen görevliye geçer. Toplu Excel indirme yalnız il yetkisinde açıktır.</p>
    <p style="margin:12px 0 0"><button class="btn s" data-act="cikis">Başka görevliyle girip farkı görün</button></p></div>
  </div>`, 'teskilat');
};

E.raporlar = () => {
  const il = ilceler(), max = Math.max(...V.AYLIK.map(a=>a.n));
  return shell('Raporlar', `
  <div class="grid g2">
    <div class="card"><h2>İlçe bazında hedef <small>yıl sonu</small></h2>${il.map(i=>{const p=Math.round(i.uye/i.hedef*100);return `<div class="ilce"><span>${i.ad}</span><div class="bar ${p<45?'w':''}"><i style="width:${p}%"></i></div><span class="v">%${p}, ${fmt(i.uye)}</span></div>`}).join('')}</div>
    <div class="stack">
      <div class="card"><h2>Aylık yeni üye</h2>
        <div style="display:flex;align-items:flex-end;gap:12px;height:170px;padding-top:10px">${V.AYLIK.map(a=>`<div style="flex:1;text-align:center;font-size:12.5px"><div style="font-weight:600;margin-bottom:4px">${fmt(a.n)}</div><div style="height:${Math.round(a.n/max*120)}px;background:var(--acc);border-radius:4px 4px 0 0"></div><div class="muted" style="margin-top:4px">${a.ay}</div></div>`).join('')}</div>
        <p class="muted" style="font-size:13px;margin-bottom:0">Kasım 18'e kadar.</p></div>
      <div class="btns"><button class="btn" data-act="toast" data-t="Rapor PDF olarak indirilir">PDF indir</button><button class="btn" data-act="toast" data-t="Rapor Excel olarak indirilir">Excel indir</button></div>
    </div>
  </div>
  <div class="card" style="margin-top:16px"><h2>Görevli performansı <small>son 30 gün</small></h2><div class="tbl"><table><thead><tr><th>Görevli</th><th class="hide-m">Görev</th><th class="num">Üye kaydı</th><th class="num">Hane ziyareti</th><th class="num">Talep</th><th class="num">Ort. cevap</th></tr></thead><tbody>
  ${V.GOREVLILER.filter(g=>rol().id==='il'||g.ad==='Hüseyin Kaya'||g.ad==='Elif Demir').map(g=>`<tr><td><b style="font-weight:600">${g.ad}</b></td><td class="hide-m">${g.gorev}</td><td class="num">${g.kayit}</td><td class="num">${g.ziyaret}</td><td class="num">${g.talep}</td><td class="num">${g.cevap}</td></tr>`).join('')}
  </tbody></table></div></div>`, 'raporlar');
};

/* ---------- yönlendirme ---------- */
function render(){
  const h = location.hash.replace(/^#\//,'') || 'genel';
  const [ad, id] = h.split('/');
  if(!rol() && ad!=='giris'){ location.hash = '#/giris'; return; }
  const fn = E[ad] || E.genel;
  $('#app').innerHTML = fn(id);
  window.scrollTo(0,0);
  if(ad==='etkinlik') qr();
  document.title = (ad==='giris'?'Giriş':(document.querySelector('.top h1')||{}).textContent||'') + ' | Teşkilat Masası';
}
window.addEventListener('hashchange', render);

function qr(){
  const c = $('#qr'); if(!c) return; const x = c.getContext('2d');
  let s = 7; const r = () => (s = (s*16807)%2147483647)/2147483647;
  x.fillStyle='#fff'; x.fillRect(0,0,29,29); x.fillStyle='#1c2230';
  for(let i=0;i<29;i++) for(let j=0;j<29;j++) if(r()<.47) x.fillRect(i,j,1,1);
  [[0,0],[22,0],[0,22]].forEach(([a,b])=>{x.fillStyle='#fff';x.fillRect(a-0,b,7,7);x.fillStyle='#1c2230';x.fillRect(a,b,7,7);x.fillStyle='#fff';x.fillRect(a+1,b+1,5,5);x.fillStyle='#1c2230';x.fillRect(a+2,b+2,3,3);});
}

const YZ = {
  kisa:'Sayın {ad}, 24 Kasım Salı 19:00\'da il başkanlığımızdaki danışma toplantısına davetlisiniz. Katılım için EVET yazın.',
  sicak:'Merhaba {ad}, 24 Kasım Salı akşamı saat 19:00\'da il başkanlığımızda buluşuyoruz. Fikirlerinizi duymak istiyoruz, sizi de aramızda görmek isteriz. Gelecekseniz bu mesaja EVET yazmanız yeterli.'
};

document.addEventListener('click', ev => {
  const go = ev.target.closest('[data-go]');
  if(go && !ev.target.closest('a,button')){ location.hash = go.dataset.go; return; }
  const b = ev.target.closest('[data-act]'); if(!b || b.tagName==='FORM' || b.tagName==='TEXTAREA' || b.tagName==='INPUT') return;
  const a = b.dataset.act;
  if(a==='cikis'){ D.rol=null; save(); location.hash='#/giris'; }
  if(a==='toast') toast(b.dataset.t);
  if(a==='excel') toast('Görünen liste Excel olarak indirilir');
  if(a==='telgoster') { const n=b.parentElement.firstChild; n.textContent = n.textContent.replace('••• ••','418 27'); b.outerHTML='<span class="muted" style="font-size:13px">Görüntüleme kayda geçti</span>'; }
  if(a==='ara-tel') toast('Telefon araması başlatılır');
  if(a==='wa') toast('WhatsApp\'ta bu kişiyle sohbet açılır');
  if(a==='gorev-ver') toast('Bu üyeyle ilgili görev formu açılır');
  if(a==='riza'){ const u=D.uyeler.find(x=>x.id===b.dataset.id); u.riza='Alındı'; save(); toast('Onay SMS\'i gönderildi, kişi onayladı (örnek)'); render(); }
  if(a==='ak'){ AK=+b.dataset.n; render(); }
  if(a==='tf'){ TF=b.dataset.d; render(); }
  if(a==='yz-metin'){ M.metin = YZ[b.dataset.tip]; render(); }
  if(a==='gonder'){ D.mesajlar.unshift({tarih:'18.11.2026 '+new Date().toTimeString().slice(0,5), hedef:(M.ilce||rol().ilce||'Adana geneli')+', '+M.grup.toLocaleLowerCase('tr'), kanal:M.kanal.join(' + ')||'SMS', kisi:+b.textContent.replace(/\D/g,''), metin:'İl danışma toplantısı daveti', iletim:'gönderiliyor'}); save(); toast('Gönderim başladı. İletim raporu bu ekranda görünecek.'); render(); }
  if(a==='gordum'){ const t=D.talepler.find(x=>x.id===b.dataset.id); if(!t.gorenler.includes(rol().ad)) t.gorenler.push(rol().ad); if(t.durum==='Yeni') t.durum='Görüldü'; save(); render(); }
  if(a==='ustlen'){ const t=D.talepler.find(x=>x.id===b.dataset.id); t.atanan=rol().ad; if(!t.gorenler.includes(rol().ad)) t.gorenler.push(rol().ad); if(t.durum!=='Cevaplandı') t.durum='İlgileniliyor'; save(); toast('Talep sizin üzerinize alındı; diğer görevliler bunu görüyor'); render(); }
  if(a==='cevapla'){ const t=D.talepler.find(x=>x.id===b.dataset.id); t.durum='Cevaplandı'; t.atanan=t.atanan||rol().ad; if(!t.gorenler.includes(rol().ad)) t.gorenler.push(rol().ad); save(); toast('Cevap gönderildi ve talebin geçmişine eklendi'); render(); }
  if(a==='okut'){ const id=b.dataset.id; const L=D.yoklama[id]=D.yoklama[id]||[]; const u=D.uyeler[(L.length*7+3)%D.uyeler.length]; const t=new Date(); t.setHours(18,52+L.length); L.push({ad:u.ad, yer:u.ilce+' / '+u.mah, saat:t.toTimeString().slice(0,5)}); save(); render(); }
  if(a==='sor'){ $('#cevap').innerHTML = `<div class="yz" style="margin-top:4px"><div class="h">Taslak paylaşım</div>Adana'nın sesi olmaya devam ediyoruz. 24 Kasım Salı saat 19:00'da il başkanlığımızda danışma toplantımızı yapıyoruz. İlçelerimizden, mahallelerimizden gelen talepleri birlikte konuşacağız. Kapımız herkese açık.<p class="muted" style="font-size:13px;margin:8px 0 0">Instagram ve X için iki ayrı uzunlukta hazırlandı. Görsel önerisi: geçen toplantıdan salon fotoğrafı.</p><div class="btns" style="margin-top:10px"><button class="btn s" data-act="toast" data-t="Metin kopyalandı">Kopyala</button></div></div>`; }
});

document.addEventListener('input', ev => {
  const t = ev.target;
  if(t.dataset.f==='q'){ F.q=t.value; clearTimeout(window._q); window._q=setTimeout(()=>{ render(); const i=document.querySelector('[data-f=q]'); i.focus(); i.setSelectionRange(i.value.length,i.value.length); },350); }
  if(t.dataset.m==='metin'){ M.metin=t.value; }
});
document.addEventListener('change', ev => {
  const t = ev.target;
  if(t.dataset.f && t.dataset.f!=='q'){ F[t.dataset.f]=t.value; if(t.dataset.f==='ilce') F.mah=''; render(); }
  if(t.dataset.m && t.dataset.m!=='metin'){ M[t.dataset.m]=t.value; render(); }
  if(t.dataset.kanal){ const k=t.dataset.kanal; M.kanal = t.checked ? [...new Set([...M.kanal,k])] : M.kanal.filter(x=>x!==k); }
});
document.addEventListener('keydown', ev => {
  if(ev.key==='Enter' && ev.target.dataset.act==='ara'){ F.q=ev.target.value; location.hash='#/uyeler'; render(); }
});
document.addEventListener('submit', ev => {
  ev.preventDefault();
  const f = ev.target;
  if(f.dataset.act==='giris'){ D.rol = f.rol.value; save(); location.hash = '#/genel'; render(); }
  if(f.dataset.act==='kaydet'){
    const r = rol();
    const u = {id:'U'+(24200+D.uyeler.length), ad:f.ad.value.trim()+' '+f.soyad.value.trim(), cins:'', ilce:r.ilce||f.ilce.value, mah:f.mah.value, sandik:+f.sandik.value||1101, yas:'-', meslek:f.meslek.value,
      tel:(f.tel.value.slice(0,4)||'05xx')+' ••• •• '+(f.tel.value.slice(-2)||'00'), kayit:'2026-11-18', kaynak:'Saha formu', riza:'Bekliyor', durum:'Başvuru',
      gonullu:[...f.querySelectorAll('[name=g]:checked')].map(x=>x.value), kaydeden:r.ad};
    D.uyeler.unshift(u); save(); toast('Kayıt alındı. Kişinin telefonuna onay SMS\'i gitti.'); location.hash='#/uye/'+u.id;
  }
});

/* Ekranlar düğmesi */
const ekr = [['giris','Giriş (görevli seçimi)'],['genel','Genel bakış'],['uyeler','Üye listesi'],['uye/U24100','Üye kartı'],['uye-ekle','Yeni üye kaydı'],['aktar','Excel\'den aktar'],['mesaj','Toplu mesaj'],['talepler','Talepler'],['talep/T-318','Talep ayrıntısı'],['asistan','Yapay zekâ asistanı'],['gorevler','Görevler'],['etkinlik/E1','QR yoklama'],['teskilat','Teşkilat ve yetkiler'],['raporlar','Raporlar']];
const sc = document.createElement('div'); sc.className='scr';
sc.innerHTML = `<div class="menu">${ekr.map(([h,t])=>`<a href="#/${h}">${t}</a>`).join('')}<a href="#/sifirla" data-reset>Örnek veriyi sıfırla</a></div><button aria-expanded="false">Ekranlar</button>`;
document.body.appendChild(sc);
sc.querySelector('button').onclick = () => { sc.classList.toggle('open'); };
sc.addEventListener('click', e => {
  const l = e.target.closest('a'); if(!l) return;
  sc.classList.remove('open');
  if(l.hasAttribute('data-reset')){ e.preventDefault(); try{localStorage.removeItem(KEY);}catch(x){} location.hash='#/giris'; location.reload(); return; }
  const h = l.getAttribute('href').slice(2);
  if(h!=='giris' && !rol()){ D.rol='il'; save(); }
});

render();
})();
