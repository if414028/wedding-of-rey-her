"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Wish = { id: string; timestamp: string; name: string; message: string };

const weddingDate = new Date("2026-08-22T10:00:00+07:00");

function Flower({ className = "" }: { className?: string }) {
  return (
    <span className={`flower ${className}`} aria-hidden="true">
      <img src="/images/floral-sprig.png" alt="" />
    </span>
  );
}

function Countdown() {
  // Keep the server output and the browser's first render identical. The live
  // clock starts only after hydration has completed in the browser.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
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

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [guestSlug, setGuestSlug] = useState("");

  useEffect(() => {
    const slug = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] ?? "");
    if (!slug) return;

    setGuestSlug(slug);

    const formattedName = slug
      .replace(/-dan-/gi, " & ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

    setGuestName(formattedName);
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
          name: guestName,
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
      if (wishesResult.ok && Array.isArray(wishesResult.wishes)) setWishes(wishesResult.wishes);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Konfirmasi belum berhasil dikirim.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={opened ? "site isOpen" : "site"}>
      <section className="cover" aria-hidden={opened}>
        <div className="coverGlow" />
        <Flower className="coverFlower one" />
        <Flower className="coverFlower two" />
        <div className="coverCard">
          <img className="coverLogo" src="/images/wedding-logo-rh.png" alt="Monogram RH" />
          <p className="to">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="guest">{guestName}</p>
          <button className="primaryButton" onClick={() => setOpened(true)}>
            Buka Undangan <span>↗</span>
          </button>
          <small>Mohon maaf apabila ada kesalahan penulisan nama atau gelar</small>
        </div>
      </section>

      <div className="invitation" aria-hidden={!opened}>
        <section className="hero" id="home">
          <div className="heroBloom bloomLeft"><Flower /><Flower /><Flower /></div>
          <div className="heroBloom bloomRight"><Flower /><Flower /><Flower /></div>
          <p className="eyebrow">Two hearts, one promise</p>
          <img className="heroLogo" src="/images/hero-logo-rh.png" alt="Reynaldo dan Herlina" />
          <p className="heroDate">22 · 08 · 2026</p>
          <p className="heroCopy">Sebuah perayaan tentang cinta yang tumbuh,<br />berakar dalam doa, dan mekar selamanya.</p>
          <a className="textLink" href="#event">Simpan tanggalnya <span>↓</span></a>
        </section>

        <section className="verse section">
          <p className="kicker">Colossians 3:14</p>
          <blockquote>“Di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.”</blockquote>
          <div className="floralDivider"><span /><Flower /><span /></div>
        </section>

        <section className="couple section" id="story">
          <div className="sectionHeading">
            <p className="kicker">Meet the couple</p>
            <h2>Tumbuh Bersama,<br /><i>Mekar Selamanya</i></h2>
          </div>
          <div className="coupleGrid">
            <article className="personCard groom">
              <div className="portrait portraitGroom">
                <img src="/images/groom-reynaldo.jpg" alt="Reynaldo Leoricci Mikhael Napitupulu" />
              </div>
              <p className="role">The Groom</p>
              <h3>Reynaldo Leoricci Mikhael Napitupulu</h3>
              <p>Putra terkasih dari<br />Alm. Bapak Selyan Napitupulu &amp; Ibu Moira Lynn Elizabeth Sianturi</p>
              <a href="#wishes">@reynaldorici</a>
            </article>
            <div className="ampersand">&amp;<small>with love</small></div>
            <article className="personCard bride">
              <div className="portrait portraitBride">
                <img src="/images/bride-herlina.jpg" alt="Herlina Mariana Pardede" />
              </div>
              <p className="role">The Bride</p>
              <h3>Herlina Mariana Pardede</h3>
              <p>Putri terkasih dari<br />Bapak Rusman Pardede &amp; Ibu Dumawati Panggabean</p>
              <a href="#wishes">@herlinapardede</a>
            </article>
          </div>
        </section>

        <section className="storyBand">
          <div className="storyPhoto" role="img" aria-label="Reynaldo dan Herlina tertawa bersama" />
          <div className="storyCopy">
            <p className="kicker">Our story</p>
            <h2>Dari sebuah pertemuan,<br />menjadi satu tujuan.</h2>
            <p>Kami percaya setiap musim membawa kami lebih dekat—belajar, bertumbuh, dan menemukan rumah dalam satu sama lain. Kini, dengan hati penuh syukur, kami mengundang Anda menjadi bagian dari awal perjalanan baru kami.</p>
            <span className="signature">Rici &amp; Herlina</span>
          </div>
        </section>

        <section className="event section" id="event">
          <div className="sectionHeading centered">
            <p className="kicker">Save the date</p>
            <h2>Hari yang Telah<br /><i>Kami Nantikan</i></h2>
            <p>Dengan penuh sukacita, kami mengundang Anda untuk hadir dan memberi doa restu.</p>
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
              <a href="https://www.google.com/maps/search/?api=1&query=Gereja%20JKI%20Hananeel%20Cinta%20Jelambar%20Baru%20Jakarta%20Barat" target="_blank" rel="noreferrer">Lihat lokasi ↗</a>
            </article>
            <article className="eventCard reception">
              <span className="eventNo">02</span>
              <p className="role">Resepsi</p>
              <h3>Sabtu, 22 Agustus 2026</h3>
              <p className="time">18.00–22.00 <small>WIB</small></p>
              <div className="rule" />
              <h4>Arion Suites Hotel Kemang</h4>
              <p>Jl. Kemang Raya No.7, RT.4/RW.1, Bangka, Kec. Mampang Prapatan, Kota Jakarta Selatan, DKI Jakarta 12730</p>
              <a href="https://www.google.com/maps/search/?api=1&query=Arion%20Suites%20Hotel%20Kemang%20Jakarta" target="_blank" rel="noreferrer">Lihat lokasi ↗</a>
            </article>
          </div>
          <a className="calendarButton" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reynaldo%20%26%20Herlina%20Wedding&dates=20260822T030000Z/20260822T150000Z&details=Pemberkatan%2010.00%E2%80%9312.00%20WIB%20di%20Gereja%20JKI%20Hananeel%20Cinta.%20Resepsi%2018.00%E2%80%9322.00%20WIB%20di%20Arion%20Suites%20Hotel%20Kemang.&location=Jakarta" target="_blank" rel="noreferrer">＋ Tambahkan ke Kalender</a>
        </section>

        <section className="gallery section" id="gallery">
          <div className="sectionHeading centered light">
            <p className="kicker">Gallery of us</p>
            <h2>In Every Season,<br /><i>We Choose Each Other</i></h2>
          </div>
          <div className="galleryGrid">
            {["A quiet beginning", "Growing together", "Our forever", "In every season", "Hand in hand"].map((caption, index) => (
              <figure className={`galleryItem gallery${index + 1}`} key={caption}>
                <div className="photoPlaceholder"><span>{index % 2 ? "H" : "R"}</span><Flower /></div>
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="galleryNote">Area galeri siap diganti dengan foto prewedding pilihanmu.</p>
        </section>

        <section className="gift section">
          <div className="giftCard">
            <Flower /><p className="kicker">Wedding gift</p>
            <h2>Tanda Kasih</h2>
            <p>Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami. Bagi yang berkenan mengirimkan tanda kasih, informasi dapat ditambahkan di bagian ini.</p>
            <button className="outlineButton" type="button">Lihat Informasi Hadiah</button>
          </div>
        </section>

        <section className="wishes section" id="wishes">
          <div className="wishesIntro">
            <p className="kicker">Warm wishes</p>
            <h2>Titipkan Doa<br /><i>&amp; Harapan</i></h2>
            <p>Setiap kata baik akan menjadi kenangan yang kami simpan dalam perjalanan baru ini.</p>
            <div className="wishQuote">“May your love keep blooming, through every season.”</div>
          </div>
          <form className="wishForm" onSubmit={sendWish}>
            <div className="guestIdentity">
              <span>Nama Tamu</span>
              <strong>{guestName}</strong>
              <input type="hidden" name="name" value={guestName} />
            </div>
            <label>Konfirmasi Kehadiran<select required name="attendance" defaultValue=""><option value="" disabled>Pilih jawaban</option><option>Ya, saya hadir di pemberkatan</option><option>Ya, saya hadir di resepsi</option><option>Ya, saya hadir di pemberkatan dan resepsi</option><option>Maaf, belum dapat hadir.</option></select></label>
            <label>Ucapan &amp; Doa<textarea required name="message" rows={5} placeholder="Tuliskan doa dan harapan terbaikmu" /></label>
            <button className="primaryButton" type="submit" disabled={sending}>{sending ? "Mengirim..." : "Kirim Konfirmasi & Ucapan"} <span>↗</span></button>
            {sent && <p className="success" role="status">Terima kasih. Konfirmasi dan ucapanmu sudah tersimpan ♡</p>}
            {submitError && <p className="formError" role="alert">{submitError}</p>}
          </form>
          {wishes.length > 0 && (
            <div className="wishList" aria-label="Ucapan tamu">
              <p className="kicker">Ucapan Tamu</p>
              {wishes.map((wish) => (
                <article className="wishItem" key={wish.id}>
                  <strong>{wish.name}</strong>
                  <p>{wish.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer>
          <Flower /><p className="kicker">With love</p>
          <h2>Reynaldo <span>&amp;</span> Herlina</h2>
          <p>Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
          <small>Made with love · 2026</small>
        </footer>
      </div>
    </main>
  );
}
