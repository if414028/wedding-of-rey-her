"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Wish = { id: string; timestamp: string; name: string; message: string };

const WISHES_PER_PAGE = 5;

const galleryItems = [
  { caption: "A quiet beginning", src: "/images/cover-reynaldo-herlina.webp" },
  { caption: "Growing together", src: "/images/story-reynaldo-herlina.webp" },
  { caption: "Our forever", src: "/images/hero-reynaldo-herlina.webp" },
  { caption: "Held close", src: "/images/gallery-agn02729.webp" },
  { caption: "A promise begins", src: "/images/gallery-dsc02128.webp" },
  { caption: "Joyfully ours", src: "/images/gallery-dsc02362.webp" },
  { caption: "Side by side", src: "/images/gallery-dsc02514.webp" },
];

const giftAccounts = [
  { bank: "Bank BCA", name: "Rey Naldo Napitupulu", number: "0840 9774 21" },
  { bank: "Bank BCA", name: "Herlina Mariana Pardede", number: "2170 2707 49" },
  { bank: "Bank Mandiri", name: "Herlina Mariana Pardede", number: "1170 0110 7561 1" },
];

const churchMapsUrl = "https://www.google.com/maps?sca_esv=8c156a4c6e9e56df&sxsrf=APpeQnuULaJN3caa9JbKV0uX4S2qPha6JQ:1784707978141&gs_lp=Egxnd3Mtd2l6LXNlcnAiA2praSoCCAAyDRAuGK8BGMcBGI4FGCcyBRAAGIAEMg4QLhiABBjHARivARiOBTIOEC4YgAQYxwEYrwEYjgUyBRAAGIAEMgsQABiABBixAxiDATILEC4YgAQYxwEYrwEyBRAAGIAEMgUQABiABDIFEAAYgAQyGhAuGK8BGMcBGI4FGJcFGNwEGN4EGOAE2AEBSJAKUABY3QJwAHgAkAEAmAFYoAH2AaoBATO4AQPIAQD4AQGYAgSgArkJwgINEC4YxwEYrwEYjgUYJ8ICBBAjGCfCAgoQABiABBiKBRhDwgIIEAAYgAQYsQPCAhoQLhjHARivARiOBRiXBRjcBBjeBBjgBNgBAcICEBAuGIAEGIoFGEMYxwEYrwHCAg0QLhiABBiKBRhDGLEDwgIIEC4YgAQYsQPCAgoQLhiABBiKBRhDmAMAugYGCAEQARgUkgcFMy42LTGgB_5SsgcBM7gHkALCBwUwLjEuM8gHF4AIAQ&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=KREX-lYk9mkuMakT-Yxy4KWw&daddr=Blok+Jl.+Pangeran+Tubagus+Angke+No.2+13,+RT.13/RW.7,+Jelambar+Baru,+Kec.+Grogol+petamburan,+Kota+Jakarta+Barat,+Daerah+Khusus+Ibukota+Jakarta+11460";
const receptionMapsUrl = "https://google.com/maps?gs_lcrp=EgZjaHJvbWUqEwgBEC4YrwEYxwEYgAQYmAUYmQUyBggAEEUYOTITCAEQLhivARjHARiABBiYBRiZBTIPCAIQLhgnGK8BGMcBGI4FMhMIAxAuGK8BGMcBGLEDGIAEGI4FMhYIBBAuGK8BGMcBGIAEGI4FGJgFGJkFMgcIBRAAGIAEMgcIBhAAGIAEMgcIBxAAGIAEMg0ICBAuGK8BGMcBGIAE0gEIMzYyNmowajeoAgCwAgA&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=KWFhIrlU8WkuMbg40twJ91gO&daddr=Jl.+Kemang+Raya+No.7,+RT.4/RW.1,+Bangka,+Kec.+Mampang+Prpt.,+Kota+Jakarta+Selatan,+Daerah+Khusus+Ibukota+Jakarta+12730";

const weddingDate = new Date("2026-08-22T10:00:00+07:00");

function Countdown() {
  // Keep the server output and the browser's first render identical. The live
  // clock starts only after hydration has completed in the browser.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const startId = window.setTimeout(() => setNow(Date.now()), 0);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(id);
    };
  }, []);

  const parts = useMemo(() => {
    if (now === null) {
      return [["--", "Hari"], ["--", "Jam"], ["--", "Menit"], ["--", "Detik"]];
    }
    const diff = Math.max(0, weddingDate.getTime() - now);
    return [
      [Math.floor(diff / 86_400_000), "Hari"],
      [Math.floor((diff / 3_600_000) % 24), "Jam"],
      [Math.floor((diff / 60_000) % 60), "Menit"],
      [Math.floor((diff / 1000) % 60), "Detik"],
    ];
  }, [now]);

  return (
    <div className="countdown" aria-label="Hitung mundur hari pernikahan">
      {parts.map(([value, label]) => (
        <div className="countdownItem" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function GalleryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  function goToSlide(index: number) {
    const normalized = (index + galleryItems.length) % galleryItems.length;
    const track = trackRef.current;
    const slide = track?.children[normalized] as HTMLElement | undefined;
    if (track && slide) {
      track.scrollTo({
        left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
    setActiveSlide(normalized);
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => goToSlide(activeSlide + 1), 3500);
    return () => window.clearInterval(timer);
  }, [activeSlide, isVisible, paused]);

  function syncActiveSlide() {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const slides = Array.from(track.children) as HTMLElement[];
    const closest = slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setActiveSlide(closest.index);
  }

  return (
    <div className="galleryCarousel" role="region" aria-roledescription="carousel" aria-label="Galeri Reynaldo dan Herlina">
      <div className="galleryTrack" ref={trackRef} onScroll={syncActiveSlide} onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)}>
        {galleryItems.map(({ caption, src }, index) => (
          <figure className={`gallerySlide${activeSlide === index ? " isActive" : ""}`} key={caption} aria-label={`${index + 1} dari ${galleryItems.length}`}>
            <img src={src} alt={`${caption} — Reynaldo dan Herlina`} loading="lazy" decoding="async" />
            <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="galleryControls">
        <button type="button" className="galleryArrow" onClick={() => goToSlide(activeSlide - 1)} aria-label="Foto sebelumnya">←</button>
        <div className="galleryDots" aria-label="Pilih foto">
          {galleryItems.map((item, index) => <button type="button" className={activeSlide === index ? "isActive" : ""} onClick={() => goToSlide(index)} aria-label={`Buka foto ${index + 1}: ${item.caption}`} aria-current={activeSlide === index ? "true" : undefined} key={item.caption} />)}
        </div>
        <button type="button" className="galleryArrow" onClick={() => goToSlide(activeSlide + 1)} aria-label="Foto berikutnya">→</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishPage, setWishPage] = useState(1);
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [guestSlug, setGuestSlug] = useState("");
  const [musicMuted, setMusicMuted] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState("");
  const invitationRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wishPageCount = Math.max(1, Math.ceil(wishes.length / WISHES_PER_PAGE));
  const visibleWishes = useMemo(() => {
    const start = (wishPage - 1) * WISHES_PER_PAGE;
    return wishes.slice(start, start + WISHES_PER_PAGE);
  }, [wishPage, wishes]);

  useEffect(() => {
    setWishPage((page) => Math.min(page, wishPageCount));
  }, [wishPageCount]);

  useEffect(() => {
    const slug = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] ?? "");
    if (!slug) return;

    const formattedName = slug
      .replace(/-dan-/gi, " & ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    const id = window.setTimeout(() => {
      setGuestSlug(slug);
      setGuestName(formattedName);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    fetch("/api/wishes")
      .then((response) => response.json())
      .then((data: { ok?: boolean; wishes?: Wish[] }) => {
        if (data.ok && Array.isArray(data.wishes)) setWishes(data.wishes);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("invitationLocked", !opened);
    if (opened) window.setTimeout(() => invitationRef.current?.focus(), 450);
    return () => document.body.classList.remove("invitationLocked");
  }, [opened]);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      ".invitation > section, .invitation > footer",
    );

    sections.forEach((section) => section.classList.add("sectionReveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("isVisible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  async function sendWish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setSent(false);
    setSubmitError("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName.trim(),
          slug: guestSlug,
          attendance: String(formData.get("attendance") || ""),
          message: String(formData.get("message") || "").trim(),
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Konfirmasi belum berhasil dikirim.");
      setSent(true);
      form.reset();

      const wishesResponse = await fetch("/api/wishes");
      const wishesResult = (await wishesResponse.json()) as { ok?: boolean; wishes?: Wish[] };
      if (wishesResult.ok && Array.isArray(wishesResult.wishes)) {
        setWishes(wishesResult.wishes);
        setWishPage(1);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Konfirmasi belum berhasil dikirim.");
    } finally {
      setSending(false);
    }
  }

  function openInvitation() {
    setOpened(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    audio.muted = false;
    setMusicMuted(false);
    void audio.play().catch(() => setMusicMuted(true));
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      setMusicMuted(false);
      void audio.play().catch(() => setMusicMuted(true));
      return;
    }
    audio.muted = !audio.muted;
    setMusicMuted(audio.muted);
  }

  async function copyAccount(number: string) {
    try {
      await navigator.clipboard.writeText(number.replace(/\s/g, ""));
      setCopiedAccount(number);
      window.setTimeout(() => setCopiedAccount(""), 1800);
    } catch {
      setCopiedAccount("");
    }
  }

  return (
    <main className={opened ? "site isOpen" : "site"}>
      <audio ref={audioRef} src="/audio/at-your-feet.mp3" preload="none" loop />
      <section className="cover" aria-hidden={opened}>
        <div className="coverGlow" />
        <div className="coverCard">
          <img className="coverLogo" src="/images/wedding-logo-rh.webp" alt="Monogram RH" width="1000" height="1000" decoding="async" />
          <p className="to">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="guest">{guestName}</p>
          <button className="primaryButton" onClick={openInvitation} aria-controls="invitation" aria-expanded={opened}>
            Buka Undangan
            <svg className="openEnvelopeIcon" aria-hidden="true" viewBox="0 0 32 32">
              <path d="M5 13.5 16 5l11 8.5v12H5z" />
              <path d="m5 14 11 8 11-8M5 25.5l8.2-7.2M27 25.5l-8.2-7.2M9 13V7.5h14V13" />
            </svg>
          </button>
          <small>Mohon maaf apabila ada kesalahan penulisan nama atau gelar</small>
        </div>
      </section>

      <div className="invitation" id="invitation" ref={invitationRef} tabIndex={-1} aria-hidden={!opened}>
        <section className="hero" id="home">
          <p className="eyebrow">Two hearts, one promise</p>
          <img className="heroLogo" src="/images/hero-logo-rh.svg" alt="Monogram Reynaldo dan Herlina" loading="lazy" decoding="async" />
          <p className="heroDate">22 · 08 · 2026</p>
          <p className="heroCopy">Sebuah perayaan tentang cinta yang tumbuh,<br />berakar dalam doa, dan mekar selamanya.</p>
          <a className="textLink" href="#event">Simpan tanggalnya <span aria-hidden="true">↓</span></a>
        </section>

        <section className="verse section">
          <p className="kicker">Yosua 24 : 15</p>
          <blockquote>“Tetapi aku dan seisi rumahku, kami akan melayani TUHAN!”</blockquote>
          <div className="floralDivider" aria-hidden="true"><span /><span className="dividerMark">R &amp; H</span><span /></div>
        </section>

        <section className="couple section" id="story">
          <div className="sectionHeading">
            <h2>“Together in Love,<br /><i>Forever in His Covenant.</i>”</h2>
            <p className="coupleSubtitle">Bersama dalam kasih, selamanya dalam perjanjian-Nya.</p>
          </div>
          <div className="coupleGrid">
            <article className="personCard groom">
              <div className="portrait portraitGroom">
                <img src="/images/groom-reynaldo-portrait.webp" alt="Reynaldo Leoricci Mikhael Napitupulu" loading="lazy" decoding="async" />
              </div>
              <p className="role">The Groom</p>
              <h3>Reynaldo Leoricci Mikhael Napitupulu</h3>
              <p>
                Putera dari<br />
                Bpk S. Napitupulu (+) &amp; Ibu BP. Tobing (+) /<br />
                Ibu Ev. Moira L. Elizabeth Sianturi
              </p>
              <a href="https://www.instagram.com/reyleoricci?igsh=c2dmejdhMmdtYXR6&amp;utm_source=qr" target="_blank" rel="noreferrer">@reyleoricci</a>
            </article>
            <div className="ampersand">&amp;<small>with love</small></div>
            <article className="personCard bride">
              <div className="portrait portraitBride">
                <img src="/images/bride-herlina-fix.webp" alt="Herlina Mariana Pardede" loading="lazy" decoding="async" />
              </div>
              <p className="role">The Bride</p>
              <h3>Herlina Mariana Pardede</h3>
              <p>Puteri dari<br />Bpk St. R. Pardede &amp; Ibu D. Panggabean</p>
              <a href="https://www.instagram.com/herlina.maria?igsh=MTd0eXdhcG8zMGs4NA==" target="_blank" rel="noreferrer">@herlina.maria</a>
            </article>
          </div>
        </section>

        <section className="storyBand">
          <div className="storyPhoto" role="img" aria-label="Reynaldo dan Herlina tertawa bersama" />
          <div className="storyCopy">
            <p className="kicker">Our story</p>
            <h2 className="storyTitle">Dipertemukan oleh kasih,<br />dipelihara oleh anugerah,<br />dipersatukan dalam Tuhan.</h2>
            <div className="storyText">
              <p>Kami percaya bahwa pertemuan kami bukanlah sebuah kebetulan. Di setiap musim perjalanan, Tuhan dengan setia menuntun, memelihara, dan mengajarkan kami untuk bertumbuh dalam kasih.</p>
              <p>Melalui sukacita, penantian, dan setiap proses yang kami jalani bersama, kami semakin melihat kebaikan-Nya nyata dalam kisah ini. Kini, dengan hati yang penuh syukur, kami melangkah menuju sebuah perjanjian kudus dan mengundang Bpk/Ibu/Saudara/Sahabat/Orangtua Rohani/Teman Pelayanan/Kolega menjadi bagian dari hari bahagia kami.</p>
            </div>
            <span className="signature">Rey &amp; Herlina</span>
          </div>
        </section>

        <section className="event section" id="event">
          <div className="sectionHeading centered">
            <p className="kicker">Save the date</p>
            <h2>Hari yang Telah<br /><i>Kami Nantikan</i></h2>
            <p>Dengan penuh sukacita, kami mengundang Bpk/Ibu/Saudara/Sahabat/Orangtua Rohani/Teman Pelayanan/Kolega untuk hadir dan memberi doa restu.</p>
          </div>
          <Countdown />
          <div className="eventGrid">
            <article className="eventCard">
              <span className="eventNo">01</span>
              <p className="role">Pemberkatan</p>
              <h3>Sabtu, 22 Agustus 2026</h3>
              <p className="time">10.00–12.00 <small>WIB</small></p>
              <div className="rule" />
              <h4>Gereja JKI Hananeel Cinta</h4>
              <p>Blok Jl. Pangeran Tubagus Angke No.2 13, RT.13/RW.7, Jelambar Baru, Kec. Grogol Petamburan, Kota Jakarta Barat, DKI Jakarta 11460</p>
              <a href={churchMapsUrl} target="_blank" rel="noreferrer">Lihat lokasi ↗</a>
            </article>
            <article className="eventCard reception">
              <span className="eventNo">02</span>
              <p className="role">Resepsi</p>
              <h3>Sabtu, 22 Agustus 2026</h3>
              <p className="time">18.00–22.00 <small>WIB</small></p>
              <div className="rule" />
              <h4>Arion Suites Hotel Kemang</h4>
              <p>Jl. Kemang Raya No.7, RT.4/RW.1, Bangka, Kec. Mampang Prapatan, Kota Jakarta Selatan, DKI Jakarta 12730</p>
              <a href={receptionMapsUrl} target="_blank" rel="noreferrer">Lihat lokasi ↗</a>
            </article>
          </div>
          <a className="calendarButton" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reynaldo%20%26%20Herlina%20Wedding&dates=20260822T030000Z/20260822T150000Z&details=Pemberkatan%2010.00%E2%80%9312.00%20WIB%20di%20Gereja%20JKI%20Hananeel%20Cinta.%20Resepsi%2018.00%E2%80%9322.00%20WIB%20di%20Arion%20Suites%20Hotel%20Kemang.&location=Jakarta" target="_blank" rel="noreferrer">＋ Tambahkan ke Kalender</a>
        </section>

        <section className="gallery section" id="gallery">
          <div className="sectionHeading centered light">
            <p className="kicker">Gallery of us</p>
            <h2>In Every Season,<br /><i>We Choose Each Other</i></h2>
          </div>
          <GalleryCarousel />
        </section>

        <section className="gift section">
          <div className="giftCard">
            <p className="kicker">A token of love</p>
            <h2>Wedding Gift</h2>
            <p>
              Kehadiran dan doa restu Bpk/Ibu/Saudara/Sahabat/Orangtua Rohani/Teman Pelayanan/Kolega adalah hadiah terindah bagi kami.
              <br />
              Bagi yang berkenan berbagi tanda kasih, informasi hadiah digital tersedia di bawah ini.
            </p>
            <div className="giftAccounts" id="giftAccounts">
              {giftAccounts.map((account) => (
                <article className="bankCard" key={`${account.bank}-${account.number}`}>
                  <div className="bankHeader">
                    <span className="bankName">{account.bank}</span>
                  </div>
                  <h3>{account.name}</h3>
                  <div className="accountPanel">
                    <span>Nomor Rekening</span>
                    <strong>{account.number}</strong>
                    <button type="button" onClick={() => void copyAccount(account.number)} aria-label={`Salin nomor rekening ${account.name}`}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
                      {copiedAccount === account.number ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="wishes section" id="wishes">
          <div className="wishesIntro">
            <p className="kicker">Warm wishes</p>
            <h2>Titipkan Doa<br /><i>&amp; Harapan</i></h2>
            <p>Setiap kata baik akan menjadi kenangan yang kami simpan dalam perjalanan baru ini.</p>
            <div className="wishQuote">“May your love keep blooming, through every season.”</div>
          </div>
          <form className="wishForm" onSubmit={sendWish} aria-busy={sending}>
            <label htmlFor="guestName">Nama Tamu</label>
            <input id="guestName" name="name" type="text" required value={guestName} onChange={(event) => setGuestName(event.target.value)} autoComplete="name" maxLength={80} />
            <label htmlFor="attendance">Konfirmasi Kehadiran</label>
            <select id="attendance" required name="attendance" defaultValue=""><option value="" disabled>Pilih jawaban</option><option>Ya, saya hadir di pemberkatan</option><option>Ya, saya hadir di resepsi</option><option>Ya, saya hadir di pemberkatan dan resepsi</option><option>Maaf, belum dapat hadir.</option></select>
            <label htmlFor="message">Ucapan &amp; Doa</label>
            <textarea id="message" required name="message" rows={5} placeholder="Tuliskan doa dan harapan terbaikmu" />
            <button className="primaryButton" type="submit" disabled={sending}>{sending ? "Mengirim..." : "Kirim Konfirmasi & Ucapan"} <span aria-hidden="true">↗</span></button>
            {sent && <p className="success" role="status">Terima kasih. Konfirmasi dan ucapanmu sudah tersimpan ♡</p>}
            {submitError && <p className="formError" role="alert">{submitError}</p>}
          </form>
          {wishes.length > 0 && (
            <div className="wishList" aria-label="Ucapan tamu">
              <p className="kicker">Ucapan Tamu</p>
              <p className="wishCount">Menampilkan {((wishPage - 1) * WISHES_PER_PAGE) + 1}–{Math.min(wishPage * WISHES_PER_PAGE, wishes.length)} dari {wishes.length} ucapan</p>
              {visibleWishes.map((wish) => (
                <article className="wishItem" key={wish.id}>
                  <strong>{wish.name}</strong>
                  <p>{wish.message}</p>
                </article>
              ))}
              {wishPageCount > 1 && (
                <nav className="wishPagination" aria-label="Navigasi halaman ucapan">
                  <button type="button" onClick={() => setWishPage((page) => Math.max(1, page - 1))} disabled={wishPage === 1} aria-label="Halaman ucapan sebelumnya">←</button>
                  <div className="wishPageNumbers">
                    {Array.from({ length: wishPageCount }, (_, index) => index + 1).map((page) => (
                      <button type="button" className={wishPage === page ? "isActive" : ""} onClick={() => setWishPage(page)} aria-label={`Buka halaman ucapan ${page}`} aria-current={wishPage === page ? "page" : undefined} key={page}>{page}</button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setWishPage((page) => Math.min(wishPageCount, page + 1))} disabled={wishPage === wishPageCount} aria-label="Halaman ucapan berikutnya">→</button>
                </nav>
              )}
            </div>
          )}
        </section>

        <footer>
          <p className="kicker">With love</p>
          <h2>Reynaldo <span>&amp;</span> Herlina</h2>
          <p>Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/Sahabat/Orangtua Rohani/Teman Pelayanan/Kolega berkenan hadir dan memberikan doa restu.</p>
          <small>Made with love · 2026</small>
        </footer>
      </div>
      {opened && (
        <button className="musicToggle" type="button" onClick={toggleMusic} aria-label={musicMuted ? "Nyalakan musik" : "Matikan musik"} title={musicMuted ? "Nyalakan musik" : "Matikan musik"}>
          {musicMuted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Zm4.5 5 5 5m0-5-5 5" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Zm4 3.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12" /></svg>
          )}
        </button>
      )}
    </main>
  );
}
