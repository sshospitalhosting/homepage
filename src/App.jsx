import React, { useMemo, useState } from "react";

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

const CONTACT = {
  address: "313, Kapurthala Road, Near Tata Motors, Basti Bawa Khel, Jalandhar – 144021",
  phones: ["0181-2211836", "8437343300", "9357903300"],
  whatsapp: "918437343300",
  email: "shreesatgurhospital@gmail.com",
  mapsEmbed:
    "https://www.google.com/maps?q=Shree%20Satguru%20Hospital%20Jalandhar&output=embed",
};

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatPhoneForTel(p) {
  const cleaned = String(p).replace(/[^0-9+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+91${cleaned}`;
}

function openWhatsApp(message) {
  const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function Pill({ href, children, onClick }) {
  if (href) {
    return (
      <a className="pill" href={href} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button className="pill" type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Button({ variant, children, ...props }) {
  const cls = ["btn", variant ? variant : ""].join(" ").trim();
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

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

export default function App() {
  const year = new Date().getFullYear();

  const doctors = useMemo(
    () => [
      { name: "Dr. Rajesh Yadav", qual: "BDS (Dental)", note: "Dental OPD", photo: rajesh },
      { name: "Late Sh. Dr. R K Yadav", qual: "Founder", note: "Legacy of compassionate care", photo: rkyadav },
      { name: "Dr. Ajay Yadav", qual: "MD (Chest Medicine)", note: "Pulmonology / Chest", photo: ajay },
      { name: "Dr. Avi Badhan", qual: "MS (Orthopedics)", note: "Orthopedics", photo: avib },
      { name: "Dr. Mayank Khullar", qual: "MD (Paediatrics)", note: "Paediatrics", photo: mayankk },
    ],
    []
  );

  const services = useMemo(
    () => [
      {
        title: "OPD & IPD Care",
        badge: "Core Services",
        tone: "tick",
        items: [
          "OPD Consultation",
          "IPD Facilities",
          "Emergency Care",
          "Diagnostic Services",
          "Pharmacy",
          "Preventive Health Checkups",
        ],
      },
      {
        title: "E‑Prescription",
        badge: "Paperless",
        tone: "purple",
        items: ["Digital Prescriptions", "WhatsApp Delivery", "Eco‑friendly records"],
      },
      {
        title: "Online Consultation",
        badge: "Remote",
        tone: "pink",
        items: ["Video Consultation", "Audio Consultation", "Follow‑up Care"],
      },
    ],
    []
  );

  const timings = useMemo(
    () => [
      { day: "Monday – Saturday", time: "9:00 AM – 4:00 PM" },
      { day: "Evening", time: "Appointment Only" },
      { day: "Sunday", time: "12:00 PM – 2:00 PM (Appointment Only)" },
    ],
    []
  );

  return (
    <div>
      <style>{`
        .hero::before{ background-image: url(${pic1}); }
      `}</style>

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

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div>
              <span className="badge">Trusted legacy • Nearly 50 years of care</span>
              <h1>Your Health, Our Passion</h1>
              <p>
                Shree Satguru Hospital carries forward a tradition of ethical, patient‑centred healthcare — combining
                clinical excellence with empathy and respect.
              </p>

              <div className="btn-row">
                <Button
                  className="btn primary"
                  variant="primary"
                  type="button"
                  onClick={() => openWhatsApp("Hi, I want to book an appointment.")}
                >
                  💬 WhatsApp Appointment
                </Button>
                <Button className="btn" type="button" onClick={() => scrollToId("appointment")}>
                  📅 Book Online
                </Button>
                <Button className="btn danger" variant="danger" type="button" onClick={() => scrollToId("contact")}>
                  📍 Find Us
                </Button>
              </div>
            </div>

            <div className="hero-card">
              <div className="kv">
                <div className="row">
                  <Icon>📍</Icon>
                  <div>
                    <b>Address</b>
                    <div>{CONTACT.address}</div>
                  </div>
                </div>
                <div className="row">
                  <Icon>📞</Icon>
                  <div>
                    <b>Phone</b>
                    <div>{CONTACT.phones.join(" • ")}</div>
                  </div>
                </div>
                <div className="row">
                  <Icon>✉️</Icon>
                  <div>
                    <b>Email</b>
                    <div>{CONTACT.email}</div>
                  </div>
                </div>
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
            {doctors.map((d) => (
              <DoctorCard key={d.name} photo={d.photo} name={d.name} qual={d.qual} note={d.note} />
            ))}
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
                <SectionHeader
                  title="OPD Timings"
                  subtitle="Timings may vary depending on doctor availability."
                />
                <div className="timing">
                  {timings.map((t) => (
                    <div className="row" key={t.day}>
                      <b>{t.day}</b>
                      <span>{t.time}</span>
                    </div>
                  ))}
                </div>
                <div className="small" style={{ marginTop: 12 }}>
                  For evening & Sunday slots, please book an appointment.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" id="gallery">
        <div className="container">
          <SectionHeader
            title="Facilities & Moments"
            subtitle="A glimpse of our hospital facilities, community outreach, and patient care."
          />
          <div className="gallery">
            <div className="imgbox big">
              <img src={pic2} alt="Hospital building" />
              <div className="label">Hospital Building</div>
            </div>

            <div className="stack">
              <div className="imgbox" style={{ height: 162 }}>
                <img src={pic3} alt="Medical association event" />
                <div className="label">Community Outreach</div>
              </div>
              <div className="imgbox" style={{ height: 162 }}>
                <img src={pic4} alt="Patient awareness session" />
                <div className="label">Patient Awareness</div>
              </div>
              <div className="imgbox" style={{ height: 162 }}>
                <img src={pic5} alt="Hospital brand" />
                <div className="label">Care with Compassion</div>
              </div>
              <div className="imgbox" style={{ height: 162 }}>
                <img src={pic1} alt="Facilities view" />
                <div className="label">Modern Infrastructure</div>
              </div>
            </div>
          </div>
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
            {services.map((s) => (
              <ServiceCard key={s.title} title={s.title} badge={s.badge} items={s.items} tone={s.tone} />
            ))}
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
            <div className="row">
              <Icon>📍</Icon>
              <div>
                <b>Address</b>
                <div>{CONTACT.address}</div>
              </div>
            </div>
            <div className="row">
              <Icon>📞</Icon>
              <div>
                <b>Phone</b>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {CONTACT.phones.map((p) => (
                <a key={p} className="badge" href={`tel:${formatPhoneForTel(p)}`}>
                  {p}
                </a>
              ))}
                </div>
              </div>
            </div>
            <div className="row">
              <Icon>💬</Icon>
              <div>
                <b>WhatsApp</b>
                <div style={{ marginTop: 6 }}>
              <a className="badge" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
                {CONTACT.whatsapp}
              </a>
                </div>
              </div>
            </div>
            <div className="row">
              <Icon>✉️</Icon>
              <div>
                <b>Email</b>
                <div style={{ marginTop: 6 }}>
              <a className="badge" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
                </div>
              </div>
            </div>
              </div>

              <div style={{ marginTop: 14 }}>
            <Button type="button" className="btn primary" variant="primary" onClick={() => openWhatsApp("Hi, I need help regarding OPD/appointment.")}>
              💬 Chat on WhatsApp
            </Button>
              </div>
            </div>
          </Card>

          <div className="map-wrap" aria-label="Google map">
            <iframe
              title="Shree Satguru Hospital Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={CONTACT.mapsEmbed}
            />
          </div>
            </div>

            <div className="section" id="appointment" style={{ paddingBottom: 0 }}>
          <div className="split">
            <Card>
              <div className="card-pad" style={{ padding: 0, overflow: "hidden" }}>
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeXa4mWylGa_YdppJlITwYoys_Y99JiYD4cwlFM_hN72Y_NxQ/viewform?embedded=true" width="100%" height="1198" frameBorder="0" marginHeight="0" marginWidth="0">
              Loading…
            </iframe>
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
              <a className="badge" href={`tel:${formatPhoneForTel(CONTACT.phones[1])}`}>
                {CONTACT.phones[1]}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating actions */}
      <div className="float-actions" aria-label="Quick actions">
        <a className="fab green" href={`tel:${formatPhoneForTel(CONTACT.phones[1])}`} title="Call">
          📞
        </a>
        <button className="fab" type="button" title="WhatsApp" onClick={() => openWhatsApp("Hi, I want to book an appointment.")}>
          💬
        </button>
        <button className="fab pink" type="button" title="Book" onClick={() => scrollToId("appointment")}>
          📅
        </button>
      </div>
    </div>
  );
}
