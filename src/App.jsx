import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";

import logo from "./assets/logo.png";
import pic1 from "./assets/pic1.jpg";
import pic2 from "./assets/pic2.jpg";
import pic3 from "./assets/pic3.jpg";
import pic4 from "./assets/pic4.jpg";
import pic5 from "./assets/care.jpg";

import rajesh from "./assets/rajesh.png";
import rkyadav from "./assets/rkyadav.png";
import ajay from "./assets/ajay.png";
import avib from "./assets/avib.png";
import mayankk from "./assets/mayankk.png";
import monica from "./assets/monica.png";

// ─── GitHub image repo config ──────────────────────────────────────────────
const GITHUB_USER = "sshospitalhosting";
const GITHUB_REPO = "images";
const GITHUB_BRANCH = "main"; // change to "master" if needed
const GITHUB_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|svg|bmp)$/i;
// ─── Notification ticker config ───────────────────────────────────────────
const TICKER_RAW_URL =
  "https://raw.githubusercontent.com/sshospitalhosting/notifications/main/file.txt";

// ─── NotificationTicker component ─────────────────────────────────────────
function NotificationTicker() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(TICKER_RAW_URL + "?cache=" + Date.now())
      .then((r) => r.text())
      .then((txt) => setMessage(txt.trim()))
      .catch(() => {});
  }, []);

  if (!message) return null;

  const display = `⭐ ${message} ⭐`;

  return (
    <div style={{
      background: "#FFD700",
      overflow: "hidden",
      whiteSpace: "nowrap",
      borderBottom: "1.5px solid #e6b800",
      height: 36,
      display: "flex",
      alignItems: "center",
    }}>
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .ticker-text {
          display: inline-block;
          animation: ticker-scroll 22s linear infinite;
          font-weight: 700;
          font-size: 14px;
          color: #1a1a1a;
          letter-spacing: 0.01em;
          padding-right: 80px;
        }
        .ticker-text:hover {
          animation-play-state: paused;
        }
      `}</style>
      <span className="ticker-text">{display}</span>
    </div>
  );
}
// ─── Contact ────────────────────────────────────────────────────────────────
const CONTACT = {
  address: "313, Kapurthala Road, Near Tata Motors, Basti Bawa Khel, Jalandhar – 144021",
  phones: ["0181-2211836", "8437343300", "9357903300"],
  whatsapp: "918437343300",
  email: "shreesatgurhospital@gmail.com",
  mapsEmbed:
    "https://www.google.com/maps?q=Shree%20Satguru%20Hospital%20Jalandhar&output=embed",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
function formatPhoneForTel(p) {
  const cleaned = String(p).replace(/[^0-9+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+91${cleaned}`;
}
function openWhatsApp(message) {
  window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

// ─── Tiny components ─────────────────────────────────────────────────────────
function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span>; }
function Pill({ href, children, onClick }) {
  if (href) return <a className="pill" href={href} onClick={onClick}>{children}</a>;
  return <button className="pill" type="button" onClick={onClick}>{children}</button>;
}
function Button({ variant, children, ...props }) {
  return <button className={["btn", variant || ""].join(" ").trim()} {...props}>{children}</button>;
}
function Card({ children, className = "" }) { return <div className={`card ${className}`.trim()}>{children}</div>; }
function SectionHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-sub">{subtitle}</p> : null}
    </>
  );
}
function DoctorCard({ photo, name, qual, note }) {
  return (
    <Card>
      <div className="card-pad">
        <div className="doctor">
          <div className="avatar" aria-hidden="true">
            {photo ? <img src={photo} alt="" /> : null}
          </div>
          <div className="doc-meta">
            <strong>{name}</strong>
            <span>{qual}</span>
            {note ? <small>{note}</small> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
function ServiceCard({ title, badge, items, tone = "tick" }) {
  const toneCls = tone === "pink" ? "tick pink" : tone === "purple" ? "tick purple" : "tick";
  return (
    <Card>
      <div className="card-pad">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, letterSpacing: "-0.2px" }}>{title}</h3>
          {badge ? <span className="badge">{badge}</span> : null}
        </div>
        <ul className="list">
          {items.map((t) => (
            <li key={t}>
              <span className={toneCls} aria-hidden="true">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ─── GitHub Carousel ──────────────────────────────────────────────────────────
function GitHubCarousel() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(null); // null or index
  const intervalRef = useRef(null);
  const trackRef = useRef(null);

  // Fetch image list from GitHub API (no auth needed for public repos)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(GITHUB_API, { signal: controller.signal });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const files = await res.json();
        const imgs = files
          .filter((f) => f.type === "file" && IMAGE_EXTS.test(f.name))
          .map((f) => ({
            name: f.name,
            url: `${RAW_BASE}/${encodeURIComponent(f.name)}`,
            label: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          }));
        if (imgs.length === 0) throw new Error("No images found in repository root.");
        setImages(imgs);
        setStatus("ready");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setStatus("error");
        }
      }
    })();
    return () => controller.abort();
  }, []);

  // Auto-advance
  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);
  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (status !== "ready" || images.length < 2) return;
    intervalRef.current = setInterval(goNext, 3500);
    return () => clearInterval(intervalRef.current);
  }, [status, images.length, goNext]);

  const pause = () => clearInterval(intervalRef.current);
  const resume = () => {
    if (images.length < 2) return;
    intervalRef.current = setInterval(goNext, 3500);
  };

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") setLightbox((l) => (l + 1) % images.length);
      if (e.key === "ArrowLeft") setLightbox((l) => (l - 1 + images.length) % images.length);
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  // ── Loading state
  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error state
  if (status === "error") {
    return (
      <div style={{ textAlign: "center", padding: "32px", background: "#fef2f2", borderRadius: 12, color: "#dc2626" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
        <p style={{ margin: 0, fontWeight: 600 }}>Could not load images from GitHub.</p>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#ef4444" }}>
          Make sure the repo <strong>{GITHUB_USER}/{GITHUB_REPO}</strong> is public and contains image files in the root.
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>
          If your images are in a subfolder, update <code>GITHUB_API</code> in the source to include the folder path.
        </p>
      </div>
    );
  }

  // ── Ready
  const visibleCount = Math.min(images.length, 5);

  return (
    <>
      {/* ── Main spotlight carousel */}
      <div
        style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#0f172a", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* Slides */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" /* 16:9 */ }}>
          {images.map((img, idx) => (
            <div
              key={img.url}
              onClick={() => setLightbox(idx)}
              style={{
                position: "absolute", inset: 0,
                opacity: idx === current ? 1 : 0,
                transition: "opacity 0.6s ease",
                cursor: "zoom-in",
              }}
            >
              <img
                src={img.url}
                // alt={img.label}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Label */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
                padding: "40px 20px 18px",
                color: "#fff",
              }}>
                {/* <span style={{ fontSize: 15, fontWeight: 500, textTransform: "capitalize" }}>{img.label}</span> */}
                <span style={{ float: "right", fontSize: 13, opacity: 0.75 }}>{idx + 1} / {images.length}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
                border: "none", borderRadius: "50%", width: 40, height: 40,
                color: "#fff", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >‹</button>
            <button
              onClick={goNext}
              aria-label="Next image"
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
                border: "none", borderRadius: "50%", width: 40, height: 40,
                color: "#fff", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >›</button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to image ${idx + 1}`}
                style={{
                  width: idx === current ? 20 : 8, height: 8,
                  borderRadius: 4, border: "none", padding: 0,
                  background: idx === current ? "#fff" : "rgba(255,255,255,0.45)",
                  cursor: "pointer", transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail strip */}
      <div
        ref={trackRef}
        style={{
          display: "flex", gap: 10, marginTop: 14,
          overflowX: "auto", paddingBottom: 6,
          scrollbarWidth: "thin",
        }}
      >
        {images.map((img, idx) => (
          <div
            key={img.url}
            onClick={() => { setCurrent(idx); pause(); resume(); }}
            style={{
              flex: "0 0 90px", height: 64, borderRadius: 8, overflow: "hidden",
              cursor: "pointer", border: idx === current ? "2.5px solid #3b82f6" : "2.5px solid transparent",
              opacity: idx === current ? 1 : 0.65,
              transition: "all 0.25s",
            }}
          >
            <img
              src={img.url}
              alt={img.label}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* ── Auto-scroll marquee strip */}
      {/* <div style={{ marginTop: 20, overflow: "hidden", borderRadius: 10 }}>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-110px * ${images.length})); }
          }
          .gh-marquee { display: flex; gap: 10px; width: max-content; animation: marquee ${images.length * 2.8}s linear infinite; }
          .gh-marquee:hover { animation-play-state: paused; }
        `}</style>
        <div className="gh-marquee">
          {[...images, ...images].map((img, idx) => (
            <div
              key={idx}
              onClick={() => setLightbox(idx % images.length)}
              style={{ flex: "0 0 100px", height: 70, borderRadius: 8, overflow: "hidden", cursor: "zoom-in" }}
            >
              <img src={img.url} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
      </div> */}

      {/* ── Count badge */}
      {/* <p style={{ margin: "12px 0 0", fontSize: 13, color: "#64748b", textAlign: "right" }}>
        🖼️ {images.length} photos loaded from{" "}
        <a href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>
          GitHub
        </a>
      </p> */}

      {/* ── Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            style={{ position: "absolute", top: 18, right: 20, background: "none", border: "none", color: "#fff", fontSize: 30, cursor: "pointer" }}
          >✕</button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l - 1 + images.length) % images.length); }}
            style={{ position: "absolute", left: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "#fff", fontSize: 22, cursor: "pointer" }}
          >‹</button>

          <img
            src={images[lightbox].url}
            alt={images[lightbox].label}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "88vh", borderRadius: 10, objectFit: "contain", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
          />

          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l + 1) % images.length); }}
            style={{ position: "absolute", right: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "#fff", fontSize: 22, cursor: "pointer" }}
          >›</button>

          <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.75)", fontSize: 14, textTransform: "capitalize" }}>
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const year = new Date().getFullYear();

  const doctors = useMemo(() => [
    { name: "Late Sh. Dr. R K Yadav", qual: "Founder", note: "Legacy of compassionate care", photo: rkyadav },
    { name: "Dr. Ajay Yadav", qual: "MD (Chest Medicine)", note: "Pulmonology / Chest", photo: ajay },
    { name: "Dr. Rajesh Yadav", qual: "BDS (Dental)", note: "Dental OPD", photo: rajesh },
    { name: "Dr. Monica Yadav", qual: "BDS (Dental)", note: "Dental OPD", photo: monica },
    { name: "Dr. Avi Badhan", qual: "MS (Orthopedics)", note: "Orthopedics", photo: avib },
    { name: "Dr. Mayank Khullar", qual: "MD (Paediatrics)", note: "Paediatrics", photo: mayankk },
  ], []);

  const services = useMemo(() => [
    {
      title: "OPD & IPD Care", badge: "Core Services", tone: "tick",
      items: ["OPD Consultation", "IPD Facilities", "Emergency Care", "Diagnostic Services", "Pharmacy", "Preventive Health Checkups"],
    },
    {
      title: "E‑Prescription", badge: "Paperless", tone: "purple",
      items: ["Digital Prescriptions", "WhatsApp Delivery", "Eco‑Friendly Records"],
    },
    {
      title: "Online Consultation", badge: "Remote", tone: "pink",
      items: ["Video Consultation", "Audio Consultation", "Follow‑up Care"],
    },
    {
      title: "Procedures", badge: "Convenient", tone: "tick",
      items: ["Bronchoscopy", "Torpey", "Thoko", "Thoracoscopy", "Lung Function Test", "Spirometry", "FOT", "Pleural", "Tapping", "FNAC", "Chest Tube Insertion"],
    },
  ], []);

  const timings = useMemo(() => [
    { day: "Monday – Saturday", time: "9:00 AM – 4:00 PM" },
    { day: "Evening", time: "Appointment Only" },
    { day: "Sunday", time: "12:00 PM – 2:00 PM (Appointment Only)" },
  ], []);

  return (
    <div>
      <style>{`.hero::before{ background-image: url(${pic1}); }`}</style>

      {/* NAV */}
      <header className="nav">
        <div className="container">
          <div className="nav-inner">
            <div className="brand" role="banner">
              <img src={logo} alt="Shree Satguru Hospital logo" />
              <div className="brand-title">
                <strong>Shree Satguru Hospital</strong>
                <span>Quality Healthcare with Compassion</span>
              </div>
            </div>
            <nav className="nav-links" aria-label="Primary">
              <Pill onClick={() => scrollToId("doctors")}>Doctors</Pill>
              <Pill onClick={() => scrollToId("services")}>Services</Pill>
              <Pill onClick={() => scrollToId("timings")}>OPD</Pill>
              <Pill onClick={() => scrollToId("gallery")}>Gallery</Pill>
              <Pill onClick={() => scrollToId("contact")}>Contact</Pill>
              <a className="pill cta" href={`tel:${CONTACT.phones[1]}`}>Call Now</a>
            </nav>
          </div>
        </div>
      </header>
{/* NOTIFICATION TICKER */}
      <NotificationTicker />
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div>
              <span className="badge">Trusted legacy • Nearly 50 years of care</span>
              <h1>Your Health, Our Passion</h1>
              <p>
                Shree Satguru Hospital carries forward a tradition of ethical, patient‑centred healthcare —
                combining clinical excellence with empathy and respect.
              </p>
              <div className="btn-row">
                <Button variant="primary" onClick={() => openWhatsApp("Hi, I want to book an appointment.")}>
                  💬 WhatsApp Appointment
                </Button>
                <Button onClick={() => scrollToId("appointment")}>📅 Book Online</Button>
                <Button variant="danger" onClick={() => scrollToId("contact")}>📍 Find Us</Button>
              </div>
            </div>

            <div className="hero-card">
              <div className="kv">
                <div className="row"><Icon>📍</Icon><div><b>Address</b><div>{CONTACT.address}</div></div></div>
                <div className="row"><Icon>📞</Icon><div><b>Phone</b><div>{CONTACT.phones.join(" • ")}</div></div></div>
                <div className="row"><Icon>✉️</Icon><div><b>Email</b><div>{CONTACT.email}</div></div></div>
                <div className="row">
                  <Icon>🕊️</Icon>
                  <div>
                    <b>हम आपके स्वास्थ्य की सम्पूर्ण देखभाल के लिए प्रतिबद्ध हैं।</b>
                    <div style={{ color: "rgba(15,23,42,0.70)", marginTop: 6 }}>
                      Compassionate, affordable care — delivered with integrity.
                    </div>
                  </div>
                </div>
              </div>
              <div className="small" style={{ marginTop: 12 }}>
                Note: Use the "Book Online" form below to send your appointment request.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="section" id="doctors">
        <div className="container">
          <SectionHeader
            title="Our Doctors"
            subtitle="A focused team, backed by a long-standing commitment to ethical practice and patient-first treatment."
          />
          <div className="grid cols-3">
            {doctors.map((d) => <DoctorCard key={d.name} {...d} />)}
          </div>
        </div>
      </section>

      {/* ABOUT + TIMINGS */}
      <section className="section" id="timings">
        <div className="container">
          <div className="split">
            <Card>
              <div className="card-pad">
                <SectionHeader
                  title="Welcome to Shree Satguru Hospital"
                  subtitle="Founded by Late Dr. R.K. Yadav, our legacy began with a diagnostic laboratory and grew into a hospital built on service and sincerity."
                />
                <p className="section-sub" style={{ marginTop: 0 }}>
                  Today, Dr. Rajesh Yadav and Dr. Ajay Yadav continue the same mission — quality medical care with empathy,
                  integrity, and respect. We aim to keep healthcare accessible while maintaining high clinical standards.
                </p>
                <div className="badge">Patient‑centred • Affordable • Ethical</div>
              </div>
            </Card>
            <Card>
              <div className="card-pad">
                <SectionHeader title="OPD Timings" subtitle="Timings may vary depending on doctor availability." />
                <div className="timing">
                  {timings.map((t) => (
                    <div className="row" key={t.day}><b>{t.day}</b><span>{t.time}</span></div>
                  ))}
                </div>
                <div className="small" style={{ marginTop: 12 }}>For evening & Sunday slots, please book an appointment.</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* GALLERY — powered by GitHub */}
      <section className="section" id="gallery">
        <div className="container">
          <SectionHeader
            title="Facilities & Moments"
            subtitle="Live gallery — automatically updated from our GitHub image repository."
          />

          {/* Static feature grid */}
          <div className="gallery" style={{ marginBottom: 40 }}>
            <div className="imgbox big">
              <img src={pic1} alt="Hospital building" />
              <div className="label">Hospital Building</div>
            </div>
            <div className="stack">
              {[
                [pic3, "Community Outreach"],
                [pic4, "Patient Awareness"],
                [pic5, "Care with Compassion"],
                [pic2, "Modern Infrastructure"],
              ].map(([src, lbl]) => (
                <div key={lbl} className="imgbox" style={{ height: 162 }}>
                  <img src={src} alt={lbl} />
                  <div className="label">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub-powered carousel */}
          {/* <h3 style={{ fontSize: 18, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📸</span> Photo Gallery
          </h3> */}
          <GitHubCarousel />
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <SectionHeader
            title="Services"
            subtitle="Everything you need — from OPD/IPD to diagnostics and modern digital workflows."
          />
          <div className="grid cols-3">
            {services.map((s) => <ServiceCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      {/* CONTACT + MAP + FORMS */}
      <section className="section" id="contact">
        <div className="container">
          <SectionHeader
            title="Contact & Location"
            subtitle="Reach us by phone, WhatsApp, or email — and use the map below for directions."
          />
          <div className="split">
            <Card>
              <div className="card-pad">
                <div className="kv" style={{ gap: 12 }}>
                  <div className="row"><Icon>📍</Icon><div><b>Address</b><div>{CONTACT.address}</div></div></div>
                  <div className="row">
                    <Icon>📞</Icon>
                    <div>
                      <b>Phone</b>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                        {CONTACT.phones.map((p) => (
                          <a key={p} className="badge" href={`tel:${formatPhoneForTel(p)}`}>{p}</a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <Icon>💬</Icon>
                    <div><b>WhatsApp</b>
                      <div style={{ marginTop: 6 }}>
                        <a className="badge" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">{CONTACT.whatsapp}</a>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <Icon>✉️</Icon>
                    <div><b>Email</b>
                      <div style={{ marginTop: 6 }}>
                        <a className="badge" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <Button variant="primary" onClick={() => openWhatsApp("Hi, I need help regarding OPD/appointment.")}>
                    💬 Chat on WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
            <div className="map-wrap" aria-label="Google map">
              <iframe title="Shree Satguru Hospital Map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={CONTACT.mapsEmbed} />
            </div>
          </div>

          <div className="section" id="appointment" style={{ paddingBottom: 0 }}>
            <div className="split">
              <Card>
                <div className="card-pad" style={{ padding: 0, overflow: "hidden" }}>
                  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeXa4mWylGa_YdppJlITwYoys_Y99JiYD4cwlFM_hN72Y_NxQ/viewform?embedded=true" width="100%" height="1198" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
                </div>
              </Card>
              <Card>
                <div className="card-pad" style={{ padding: 0, overflow: "hidden" }}>
                  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSemFMdqoLMDKI1dN-Rr-Bg7DBBc5kW4MTcmcumn5XRPC8ECYg/viewform?embedded=true" width="100%" height="927" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div>
              <b>Shree Satguru Hospital</b>
              <div className="small">© {year} • All rights reserved</div>
            </div>
            <div className="small">
              For emergencies, please call:{" "}
              <a className="badge" href={`tel:${formatPhoneForTel(CONTACT.phones[1])}`}>{CONTACT.phones[1]}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating actions */}
      <div className="float-actions" aria-label="Quick actions">
        <a className="fab green" href={`tel:${formatPhoneForTel(CONTACT.phones[1])}`} title="Call">📞</a>
        <button className="fab" type="button" title="WhatsApp" onClick={() => openWhatsApp("Hi, I want to book an appointment.")}>💬</button>
        <button className="fab pink" type="button" title="Book" onClick={() => scrollToId("appointment")}>📅</button>
      </div>
    </div>
  );
}