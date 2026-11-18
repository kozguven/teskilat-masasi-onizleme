/* Örnek veri — tamamı kurgusaldır. Kişi adları ve telefonlar gerçek kişilere ait değildir. */
(function(){
  let s = 20261124;
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pick = a => a[Math.floor(rnd() * a.length)];

  const ILCELER = [
    {ad:'Seyhan',     uye:1420, hedef:2500, mah:['Reşatbey','Kurtuluş','Cemalpaşa','Döşeme','Gürselpaşa','Yeşilyurt','Ziyapaşa','Mithatpaşa']},
    {ad:'Çukurova',   uye:980,  hedef:1800, mah:['Toros','Huzurevleri','Belediyeevleri','Yurt','Güzelyalı','Mahfesığmaz']},
    {ad:'Yüreğir',    uye:760,  hedef:1600, mah:['Kiremithane','Levent','Dadaloğlu','Sinanpaşa','Yamaçlı']},
    {ad:'Sarıçam',    uye:410,  hedef:900,  mah:['Gültepe','Yıldırım Beyazıt','Buruk']},
    {ad:'Ceyhan',     uye:520,  hedef:1000, mah:['Konakoğlu','Büyükkırım','Muradiye']},
    {ad:'Kozan',      uye:330,  hedef:700,  mah:['Tufanpaşa','Cumhuriyet']},
    {ad:'İmamoğlu',   uye:95,   hedef:250,  mah:['Cumhuriyet']},
    {ad:'Karataş',    uye:88,   hedef:250,  mah:['Yeni']},
    {ad:'Karaisalı',  uye:64,   hedef:200,  mah:['Merkez']},
    {ad:'Pozantı',    uye:41,   hedef:150,  mah:['Merkez']},
    {ad:'Yumurtalık', uye:31,   hedef:120,  mah:['Merkez']},
    {ad:'Aladağ',     uye:22,   hedef:120,  mah:['Merkez']},
    {ad:'Tufanbeyli', uye:20,   hedef:100,  mah:['Merkez']},
    {ad:'Feke',       uye:18,   hedef:100,  mah:['Merkez']},
    {ad:'Saimbeyli',  uye:15,   hedef:100,  mah:['Merkez']}
  ];

  const AD_E = ['Ahmet','Mehmet','Mustafa','Ali','Hüseyin','Hasan','İbrahim','Murat','Emre','Burak','Serkan','Yusuf','Ömer','Halil','Cengiz','Okan','Kadir','Ramazan','Sinan','Tolga'];
  const AD_K = ['Fatma','Ayşe','Emine','Hatice','Zeynep','Elif','Merve','Büşra','Esra','Derya','Gülsüm','Sevda','Kader','Selin','Nuray','Songül'];
  const SOYAD = ['Yılmaz','Kaya','Demir','Şahin','Çelik','Yıldız','Aydın','Öztürk','Arslan','Doğan','Aslan','Çetin','Kara','Koç','Kurt','Özdemir','Polat','Güneş','Tekin','Avcı','Bulut','Keskin','Ünal','Uçar','Toprak','Gök','Ateş','Durmaz','Sarı','Coşkun'];
  const MESLEK = ['Esnaf','Öğretmen','Emekli','Çiftçi','Mühendis','Öğrenci','Ev hanımı','Şoför','Memur','Hemşire','Serbest meslek','İşçi','Avukat','Muhasebeci'];
  const GONULLU = ['Sandık görevlisi','Saha ziyareti','Sosyal medya','Etkinlik düzeni','Ulaşım desteği'];
  const KAYNAK = ['Saha formu','Saha formu','Saha formu','Excel aktarımı','Web formu','İlçe binası'];

  // Odak bölgeler (giriş yapan rollerin görmesi için yoğunlaştırılır)
  const uyeler = [];
  for(let i=0;i<96;i++){
    let il;
    if(i<26) il = ILCELER[0];
    else if(i<40) il = ILCELER[1];
    else if(i<52) il = ILCELER[2];
    else il = pick(ILCELER.slice(0, rnd()<.75 ? 6 : 15));
    let mah = (i<11) ? 'Reşatbey' : pick(il.mah);
    const k = rnd()<.42;
    const ad = (k?pick(AD_K):pick(AD_E)) + ' ' + pick(SOYAD);
    const gun = Math.floor(rnd()*75);
    const t = new Date(2026,10,18); t.setDate(t.getDate()-gun);
    const g = [];
    if(rnd()<.45) g.push(pick(GONULLU));
    if(rnd()<.2) { const x = pick(GONULLU); if(!g.includes(x)) g.push(x); }
    uyeler.push({
      id: 'U' + (24100 + i),
      ad, cins: k?'K':'E',
      ilce: il.ad, mah,
      sandik: 1000 + Math.floor(rnd()*380),
      yas: 19 + Math.floor(rnd()*52),
      meslek: pick(MESLEK),
      tel: '05' + pick(['32','33','35','42','44','05','52','54']) + ' ••• •• ' + String(10+Math.floor(rnd()*89)),
      kayit: t.toISOString().slice(0,10),
      kaynak: pick(KAYNAK),
      riza: rnd()<.86 ? 'Alındı' : 'Bekliyor',
      durum: rnd()<.9 ? 'Aktif' : 'Başvuru',
      gonullu: g,
      kaydeden: i<11 ? 'Elif Demir' : pick(['Elif Demir','Hüseyin Kaya','Ozan Tekin','Seda Arslan','Kemal Uçar','Saha ekibi'])
    });
  }

  const ROLLER = [
    {id:'il',  ad:'Taner Bey', gorev:'İl yöneticisi', alan:'Adana geneli, 15 ilçe', ilce:null, mah:null, kisa:'TB'},
    {id:'ilce',ad:'Hüseyin Kaya', gorev:'Seyhan İlçe Başkanı', alan:'Yalnız Seyhan ilçesi', ilce:'Seyhan', mah:null, kisa:'HK'},
    {id:'mah', ad:'Elif Demir', gorev:'Reşatbey Mahalle Temsilcisi', alan:'Yalnız Seyhan / Reşatbey', ilce:'Seyhan', mah:'Reşatbey', kisa:'ED'}
  ];

  const TALEPLER = [
    {id:'T-318', konu:'Kiremithane Mahallesi\'nde 3 sokakta aydınlatma yok', kim:'Recep Durmaz', ilce:'Yüreğir', mah:'Kiremithane', kanal:'WhatsApp', zaman:'Bugün 09:42', durum:'Yeni', kat:'Belediye hizmeti', onc:'Yüksek', atanan:null, gorenler:[],
      metin:'Merhaba, Kiremithane\'de 1204, 1206 ve 1211. sokaklarda iki haftadır sokak lambaları yanmıyor. Akşam çocuklar okuldan dönerken çok karanlık oluyor. Belediyeye yazdık ama dönüş olmadı.',
      ozet:'3 sokakta (1204, 1206, 1211) iki haftadır aydınlatma yok; belediyeye yapılan başvuru cevapsız. Okul dönüşü güvenlik kaygısı var.',
      cevap:'Recep Bey merhaba, bildiriminiz için teşekkür ederiz. Konuyu Yüreğir ilçe başkanlığımız aracılığıyla bu hafta ilgili birime iletiyoruz; gelişmeyi size buradan yazacağız.'},
    {id:'T-317', konu:'Üyelik kartım hâlâ gelmedi', kim:'Songül Keskin', ilce:'Seyhan', mah:'Reşatbey', kanal:'Telefon', zaman:'Bugün 08:15', durum:'Görüldü', kat:'Üyelik işlemi', onc:'Normal', atanan:'Elif Demir', gorenler:['Elif Demir'],
      metin:'Ekim başında Reşatbey\'deki standda üye oldum, üyelik kartım hâlâ elime ulaşmadı. Kayıt tamamlandı mı bilmiyorum.',
      ozet:'Ekim başı stantta üye olmuş, kart ulaşmamış; kaydın durumunu soruyor.',
      cevap:'Songül Hanım merhaba, kaydınız sistemimizde aktif görünüyor. Kartınız Reşatbey temsilcimiz Elif Demir aracılığıyla bu hafta elden teslim edilecek.'},
    {id:'T-316', konu:'Gençlik kollarına katılmak istiyorum', kim:'Burak Toprak', ilce:'Çukurova', mah:'Huzurevleri', kanal:'Web formu', zaman:'Dün 22:10', durum:'İlgileniliyor', kat:'Gönüllülük', onc:'Normal', atanan:'Seda Arslan', gorenler:['Seda Arslan','Taner Bey'],
      metin:'Üniversite 3. sınıf öğrencisiyim, sosyal medya ve etkinliklerde gönüllü olmak istiyorum.',
      ozet:'Üniversite öğrencisi; sosyal medya ve etkinlik gönüllüsü olmak istiyor.',
      cevap:'Burak Bey merhaba, ilginiz için teşekkür ederiz. Gençlik kolları başkanımız Seda Arslan sizi bu hafta arayacak.'},
    {id:'T-315', konu:'Muradiye\'de mahalle ziyareti talebi', kim:'Halil Ünal (muhtar)', ilce:'Ceyhan', mah:'Muradiye', kanal:'Telefon', zaman:'Dün 16:30', durum:'Yeni', kat:'Ziyaret / toplantı', onc:'Normal', atanan:null, gorenler:[],
      metin:'Mahallemizde çiftçilerimizle bir sohbet toplantısı yapılmasını istiyoruz. Kahvehanede 40-50 kişi toplanabilir.',
      ozet:'Muhtar, Muradiye\'de çiftçilerle 40-50 kişilik bir sohbet toplantısı istiyor.',
      cevap:'Halil Bey merhaba, davetiniz için teşekkür ederiz. Ceyhan ilçe başkanımız uygun tarih için sizi arayacak.'},
    {id:'T-314', konu:'Engelli üyemiz toplantıya ulaşım istiyor', kim:'Kader Polat', ilce:'Seyhan', mah:'Cemalpaşa', kanal:'WhatsApp', zaman:'Dün 11:05', durum:'Cevaplandı', kat:'Ulaşım desteği', onc:'Yüksek', atanan:'Hüseyin Kaya', gorenler:['Hüseyin Kaya','Taner Bey'],
      metin:'Babam tekerlekli sandalye kullanıyor, Salı günkü il toplantısına gelmek istiyor. Araç ayarlanabilir mi?',
      ozet:'Tekerlekli sandalye kullanan üye Salı il toplantısı için araç istiyor.',
      cevap:'Kader Hanım, Salı 18:15\'te evinizin önünden alınacak şekilde araç ayarlandı. Şoförümüzün numarası mesajla gelecek.'},
    {id:'T-313', konu:'Pazar yeri düzeni hakkında şikâyet', kim:'Mustafa Avcı', ilce:'Kozan', mah:'Tufanpaşa', kanal:'E-posta', zaman:'16.11 14:20', durum:'Görüldü', kat:'Belediye hizmeti', onc:'Düşük', atanan:'Kemal Uçar', gorenler:['Kemal Uçar'],
      metin:'Perşembe pazarında tezgâh yerleri her hafta değişiyor, esnaf mağdur oluyor.',
      ozet:'Perşembe pazarında tezgâh yerlerinin düzensizliği; esnaf şikâyeti.',
      cevap:'Mustafa Bey merhaba, konuyu Kozan ilçe teşkilatımız değerlendirip size dönecek.'},
    {id:'T-312', konu:'Sandık görevlisi olmak istiyorum', kim:'Nuray Gök', ilce:'Sarıçam', mah:'Gültepe', kanal:'Saha', zaman:'15.11 10:00', durum:'Cevaplandı', kat:'Gönüllülük', onc:'Normal', atanan:'Ozan Tekin', gorenler:['Ozan Tekin'],
      metin:'Seçimlerde sandık görevlisi olarak görev almak istiyorum, daha önce de görev yaptım.',
      ozet:'Deneyimli; sandık görevlisi olmak istiyor.',
      cevap:'Nuray Hanım, adınızı sandık görevlisi listesine ekledik. Eğitim tarihini ayrıca bildireceğiz.'}
  ];

  const GOREVLER = [
    {id:1, ad:'Reşatbey hane ziyaretleri (40 hane)', kim:'Elif Demir', ilce:'Seyhan', mah:'Reşatbey', son:'22.11.2026', ilerleme:26, hedef:40, durum:'Sürüyor'},
    {id:2, ad:'Seyhan sandık görevlisi listesini tamamla', kim:'Hüseyin Kaya', ilce:'Seyhan', mah:null, son:'30.11.2026', ilerleme:112, hedef:180, durum:'Sürüyor'},
    {id:3, ad:'İl danışma toplantısı salon ve ses düzeni', kim:'Kemal Uçar', ilce:'Seyhan', mah:null, son:'23.11.2026', ilerleme:1, hedef:1, durum:'Tamamlandı'},
    {id:4, ad:'Yüreğir mahalle temsilcisi atamaları (5 mahalle)', kim:'Ozan Tekin', ilce:'Yüreğir', mah:null, son:'25.11.2026', ilerleme:2, hedef:5, durum:'Gecikme riski'},
    {id:5, ad:'Gençlik kolları tanışma etkinliği duyurusu', kim:'Seda Arslan', ilce:'Çukurova', mah:null, son:'27.11.2026', ilerleme:0, hedef:1, durum:'Başlamadı'},
    {id:6, ad:'Reşatbey: Songül Keskin üyelik kartı teslimi', kim:'Elif Demir', ilce:'Seyhan', mah:'Reşatbey', son:'20.11.2026', ilerleme:0, hedef:1, durum:'Başlamadı'},
    {id:7, ad:'Ceyhan Muradiye çiftçi toplantısı tarihi', kim:'Murat Coşkun', ilce:'Ceyhan', mah:null, son:'21.11.2026', ilerleme:0, hedef:1, durum:'Gecikme riski'}
  ];

  const ETKINLIKLER = [
    {id:'E1', ad:'İl danışma toplantısı', yer:'İl başkanlığı binası, Seyhan', tarih:'24.11.2026 Salı', saat:'19:00', ilce:'Seyhan', davet:220, katilim:0, durum:'Yaklaşıyor'},
    {id:'E2', ad:'Seyhan mahalle temsilcileri toplantısı', yer:'Seyhan ilçe binası', tarih:'27.11.2026 Cuma', saat:'18:30', ilce:'Seyhan', davet:46, katilim:0, durum:'Yaklaşıyor'},
    {id:'E3', ad:'Gençlik kolları tanışma buluşması', yer:'Çukurova, Turgut Özal Bulvarı', tarih:'30.11.2026 Pazartesi', saat:'20:00', ilce:'Çukurova', davet:130, katilim:0, durum:'Yaklaşıyor'},
    {id:'E4', ad:'Yüreğir ilçe tanışma toplantısı', yer:'Yüreğir ilçe binası', tarih:'14.11.2026 Cumartesi', saat:'14:00', ilce:'Yüreğir', davet:160, katilim:118, durum:'Tamamlandı'}
  ];

  const MESAJLAR = [
    {tarih:'16.11.2026 10:00', hedef:'Seyhan, tüm üyeler', kanal:'SMS', kisi:1236, metin:'İl danışma toplantısı daveti', iletim:'%97 iletildi'},
    {tarih:'12.11.2026 18:30', hedef:'Yüreğir, tüm üyeler', kanal:'WhatsApp', kisi:648, metin:'İlçe tanışma toplantısı hatırlatması', iletim:'%91 okundu'},
    {tarih:'08.11.2026 09:15', hedef:'Sandık görevlisi gönüllüleri', kanal:'E-posta', kisi:214, metin:'Sandık görevlisi eğitimi bilgilendirmesi', iletim:'%64 açıldı'}
  ];

  const AYLIK = [{ay:'Haz',n:180},{ay:'Tem',n:240},{ay:'Ağu',n:310},{ay:'Eyl',n:690},{ay:'Eki',n:1460},{ay:'Kas',n:1934}];

  const GOREVLILER = [
    {ad:'Hüseyin Kaya', gorev:'Seyhan İlçe Başkanı', kayit:188, ziyaret:96, talep:14, cevap:'3 saat'},
    {ad:'Elif Demir', gorev:'Reşatbey Mahalle Temsilcisi', kayit:64, ziyaret:71, talep:9, cevap:'1 saat'},
    {ad:'Seda Arslan', gorev:'Gençlik Kolları Başkanı', kayit:142, ziyaret:20, talep:11, cevap:'5 saat'},
    {ad:'Ozan Tekin', gorev:'Yüreğir İlçe Başkanı', kayit:97, ziyaret:58, talep:12, cevap:'9 saat'},
    {ad:'Kemal Uçar', gorev:'Kozan İlçe Başkanı', kayit:41, ziyaret:33, talep:6, cevap:'1 gün'},
    {ad:'Murat Coşkun', gorev:'Ceyhan İlçe Başkanı', kayit:56, ziyaret:29, talep:8, cevap:'2 gün'}
  ];

  window.VERI = {ILCELER, uyeler, ROLLER, TALEPLER, GOREVLER, ETKINLIKLER, MESAJLAR, AYLIK, GOREVLILER, GONULLU, MESLEK};
})();
