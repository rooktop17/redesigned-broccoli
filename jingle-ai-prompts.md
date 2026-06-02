# "Hızlı O!" — AI Jingle Üretim Paketi (Suno + ElevenLabs)

KKTC kurye-kargo markası **Hızlı O!** için Türk Besteciler Konseyi'nin seçtiği
nakaratı, AI müzik/ses araçlarında üretmek için hazır prompt'lar. Hepsi
kopyala-yapıştır içindir.

> Konsey nakaratı (referans):
> ```
> Hızlı O! Hızlı O!
> Bas telefona, gelsin o!
> Kurye o, kargo o,
> Kapına kadar, hızlı o!
> ```

---

## 1) SUNO

Suno'da iki kutu vardır: **Style of Music** (kısa, virgülle ayrılmış) ve
**Lyrics** (yapı etiketli). "Custom Mode"u açıp aşağıdakileri yapıştırın.

### 1.A — Konsey (Ortak Karar) Versiyonu  ★ Ana jingle

**Style of Music:**
```
upbeat Turkish pop advertising jingle, catchy radio jingle, energetic, mixed male & female gang vocals, punchy synth bass, deep 808 boom intro, hand claps, bright major key, 120 BPM, anthemic memorable hook, clean modern mix
```

**Title:** `Hızlı O!`

**Lyrics:**
```
[Intro]
(deep boom) Hızlı O!

[Chorus]
Hızlı O! Hızlı O!
Bas telefona, gelsin o!
Kurye o, kargo o,
Kapına kadar, hızlı o!

[Verse]
Gece gündüz yolda o,
KKTC'nin gücü o.
Kim yetişir anında?
Tek bir isim: Hızlı O!

[Bridge]
Al getir, kap götür,
İşini hızlı bitir!

[Chorus]
Hızlı O! Hızlı O!
Bas telefona, gelsin o!
Kurye o, kargo o,
Kapına kadar, hızlı o!

[Outro]
(claps) Hızlı O!... Hızlı O!
```

> İpucu: 15–20 sn'lik kısa spot istiyorsanız sadece **[Intro] + [Chorus] + [Outro]**
> bırakın. Suno v4.5+ için "Persona" ve "Instrumental" seçeneklerini kapalı tutun.

---

### 1.B — Persona Stilleri (aynı nakarat, farklı tür)

Aynı sözleri kullanıp yalnızca **Style** kutusunu değiştirin.

**Barış Manço / Anadolu Rock:**
```
70s Anatolian rock, Turkish psychedelic folk rock, electric bağlama saz riff, warm storyteller baritone male vocal, groovy fuzz bass, vintage organ, analog tape warmth, mid tempo, nostalgic but catchy
```

**Sezen Aksu / Klasik Türkçe Pop:**
```
polished 90s Türkçe pop, emotive female lead vocal, lush strings, bright piano, soft claps, memorable la-la hook, radio-friendly, warm production
```

**Serdar Ortaç / Dans-Pop:**
```
2000s Turkish dance-pop, fast 128 BPM, bright synth lead, four-on-the-floor kick, energetic male vocal, club-ready, super catchy chorus
```

**Ceza / Türkçe Rap:**
```
Turkish hip hop, fast aggressive flow, boom-bap meets trap, hard 808 sub bass, vinyl scratches, confident male rapper, energetic, street
```

**Ezhel / Melodik Trap:**
```
melodic Turkish trap, autotuned male vocal, dark 808 bass, atmospheric pads, half-time hi-hats, laid-back catchy hook, modern
```

**Şebnem Ferah / Rock:**
```
Turkish alt-rock, powerful female vocal, distorted electric guitar riff, driving drums, anthemic chorus, energetic, radio rock
```

---

## 2) ELEVENLABS

ElevenLabs'te üç ayrı ürün işinize yarar:

### 2.A — Eleven Music (metinden şarkı)

**Prompt (Compose / "Describe your song"):**
```
A high-energy Turkish radio advertising jingle for a courier & cargo brand called
"Hızlı O" in Northern Cyprus (KKTC). Bright major-key pop with a punchy synth bass,
hand claps and a mixed male & female gang-vocal chorus. Opens with a deep boom.
About 20 seconds, anthemic, extremely catchy and memorable, clean modern mix.
```

**Lyrics (varsa "Add lyrics" alanına):**
```
Hızlı O! Hızlı O!
Bas telefona, gelsin o!
Kurye o, kargo o,
Kapına kadar, hızlı o!
Gece gündüz yolda o,
KKTC'nin gücü o.
Tek bir isim: Hızlı O!
```

---

### 2.B — Text to Speech (radyo spotu / anons)

Jingle üzerine konuşan spiker sesi için. **Multilingual v2** modeli, Türkçe
destekleyen bir ses seçin (ör. enerjik erkek anons sesi).

**Seslendirme metni:**
```
Bir tık yeter! Hızlı O — kurye o, kargo o.
Gece gündüz yolda. KKTC'nin gücü o.
Bas telefona... gelsin o!
```

**Önerilen ayarlar (Voice Settings):**
| Ayar | Değer | Neden |
|---|---|---|
| Stability | %35–45 | Reklam enerjisi, canlı tonlama |
| Similarity | %80 | Ses karakteri korunur |
| Style Exaggeration | %30–40 | Heyecanlı spiker tavrı |
| Speed | ~1.05x | Hafif tempolu, "hızlı" hissi |

> İpucu: Vurgu için araya `...` ve büyük harf kullanın ("gelsin o!"). Cümle
> sonlarını `!` ile bitirip coşkulu okuma alın.

---

### 2.C — Sound Effects (giriş "boom"u + efektler)

ElevenLabs **Sound Effects** sekmesinde her biri ayrı üretilir:

**Boom (giriş vuruşu):**
```
deep cinematic sub-bass boom impact, short and punchy, with a quick tail, clean
```
`Duration: ~1.5s · Prompt influence: high`

**Whoosh (kuryenin "hızlı" geçişi):**
```
fast swoosh transition, energetic air whoosh, short, bright
```

**Bildirim "tık" (telefona basış):**
```
crisp UI tap click, single short notification blip, clean
```

---

## 3) Tam Radyo Spotu Kurgusu (15 sn)

ElevenLabs + Suno parçalarını birleştirme sırası:

```
0.0s  [SFX] boom  +  [SFX] tık
0.5s  [SUNO]  Chorus:  "Hızlı O! Hızlı O! / Bas telefona, gelsin o!"
6.0s  [TTS]   Spiker:  "Kurye o, kargo o. KKTC'nin gücü o."
10.0s [SUNO]  Outro:   "Kapına kadar... Hızlı O!"  (+ claps)
14.0s [TTS]   "Hızlı O — bas telefona, gelsin o!"
```

---

### Notlar
- Suno'da en akılda kalıcı sonuç için **Chorus**'u parçanın başına da koymak işe yarar.
- ElevenLabs Music çıktısını referans alıp Suno'da "remix" denenebilir (ya da tersi).
- Tüm sözler Türkçe; markaların telaffuzu için "Hızlı O" yazımı korunmalıdır.
