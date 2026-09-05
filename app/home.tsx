"use client";

import { useState, type KeyboardEvent } from "react";

type Focus = "work" | "teams" | "fulcrum";
type Project = { name: string; description: string; detail: string; image: string; icon?: string; url: string; source: string; tone: string; platforms: string; crossPlatform: boolean; plugin?: boolean };

const links = {
  github: "https://github.com/jondkinney",
  linkedin: "https://www.linkedin.com/in/jonkinney/",
  headway: "https://www.headway.io/free-consultation",
  fulcrum: "https://usefulcrum.ai/",
  meetup: "https://luma.com/eoxdjbog",
};
const speakingLink = links.linkedin;
const speakerBio = "Jon Kinney is a developer and Partner & CTO at Headway, based in Green Bay, Wisconsin. He has been building with Ruby on Rails since 2005 and creates open-source desktop tools with Rust, including Vernier, Tensaku, HyprCorrect, and Mousehop. He contributes to Omarchy, is a contributor and committer to Omasnap, and organizes the Green Bay Omarchy meetup. At Headway, he helps teams build software and is working on Fulcrum, a shared workspace for planning and collaborating with AI agents.";
const projects: Project[] = [
  { name: "Vernier", description: "A little more precision. A lot less guessing.", detail: "Measure what’s on screen with snapping guides, pinned dimensions, and capture handoff.", image: "vernier.png", url: "https://usevernier.com/", source: "https://github.com/jondkinney/vernier", tone: "blue", platforms: "Linux · macOS", crossPlatform: true, plugin: true },
  { name: "Tensaku", description: "Mark it up. Move it around. Make it clear.", detail: "Screenshot annotation with movable layers and scrolling captures. Built on Matthias Gabriel’s Satty.", image: "tensaku.png", icon: "tensaku-icon.png", url: "https://tensaku.dev/", source: "https://github.com/jondkinney/tensaku", tone: "rose", platforms: "Linux · Wayland", crossPlatform: false },
  { name: "HyprCorrect", description: "The right words, without breaking your flow.", detail: "Keyboard-driven spelling correction across your desktop, including the terminal. Written in Rust.", image: "hyprcorrect.png", icon: "hyprcorrect-icon.svg", url: "https://hyprcorrect.com/", source: "https://github.com/jondkinney/hyprcorrect", tone: "sage portrait-preview", platforms: "Linux · macOS", crossPlatform: true, plugin: true },
  { name: "Mousehop", description: "One keyboard. One mouse. Your whole desk.", detail: "Share input and your clipboard across machines. Built on Ferdinand Schober’s lan-mouse.", image: "mousehop.png", icon: "mousehop-icon.png", url: "https://mousehop.com/", source: "https://github.com/jondkinney/mousehop", tone: "sand portrait-preview", platforms: "Linux · macOS · Windows", crossPlatform: true },
];
const plugins = [
  { name: "Hyprpin", glyph: "⌖", description: "Keep the right window in sight, across workspaces.", url: "https://github.com/jondkinney/hyprpin" },
  { name: "Bazecor Lens", glyph: "⌘", description: "Your keyboard’s active layer, right where you need it.", url: "https://github.com/jondkinney/omarchy-bazecor-lens" },
  { name: "Omasnip", glyph: "{ }", description: "Code snapshots, Vim editing, and an Omasnap handoff.", url: "https://github.com/jondkinney/omasnip" },
  { name: "Oma2fa", glyph: "•••", description: "A private, quick way to find verification codes.", url: "https://github.com/jondkinney/oma2fa" },
  { name: "Omapop", glyph: "Aa", description: "Quick actions for selected text, with PopClip-compatible extensions.", url: "https://github.com/jondkinney/omapop" },
];
const features = [
  { label: "Plan & pitch", title: "Make a plan you can stand behind.", text: "Scope the work, build an estimate, and turn it into a clear proposal. Give clients—and the internal teams you need buy-in from—a shared picture of what comes next." },
  { label: "Sync the team", title: "Good context belongs to the whole team.", text: "Share and sync skills files so everyone’s agents work from the same conventions. Keep decisions and project context alongside the work, on a shared board." },
  { label: "Build & deliver", title: "Keep the plan connected to the work.", text: "Move from approved scope into a collaborative development flow. Give people and their agents the context to build together, while keeping the team aligned as the work evolves." },
];
const arrangements = {
  work: { label: "The builder", summary: "Open source leads. Fulcrum connects the dots.", eyebrow: "INDEPENDENT BUILDER. COLLABORATIVE BY NATURE.", headline: <>Good software.<br /><span>Better ways<br />to build it.</span></>, description: "I’m Jon. I build open-source tools, lead the technical work at Headway, and help teams find their flow.", primary: "Explore my work", target: "#work", secondary: "What I’m building next", secondaryTarget: "#fulcrum", sections: ["work", "fulcrum", "about", "community", "notes"] },
  teams: { label: "The CTO", summary: "Leadership leads. The projects show the craft.", eyebrow: "TECHNICAL LEADERSHIP. HANDS-ON BY DEFAULT.", headline: <>Build the team.<br /><span>Raise the bar.<br />Ship good work.</span></>, description: "I’m Jon, Partner & CTO at Headway. I help developers and product teams turn hard problems into software they’re proud to ship.", primary: "Build with Headway", target: links.headway, secondary: "See what I make", secondaryTarget: "#work", sections: ["about", "fulcrum", "work", "community", "notes"] },
  fulcrum: { label: "Fulcrum", summary: "Fulcrum leads. Your experience gives it a foundation.", eyebrow: "BETTER TOOLS FOR BUILDING TOGETHER.", headline: <>Great teams.<br /><span>Shared context.<br />Real flow.</span></>, description: "I’m Jon. We’re building Fulcrum to connect the whole development process, from the first estimate to the work your team ships.", primary: "Explore Fulcrum", target: "#fulcrum", secondary: "Meet the builder", secondaryTarget: "#about", sections: ["fulcrum", "work", "about", "community", "notes"] },
};
function Arrow({ down = false }: { down?: boolean }) { return <span aria-hidden="true">{down ? "↓" : "↗"}</span>; }
function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="eyebrow">{children}</p>; }

export default function HomePage({ focus, reviewing }: { focus: Focus; reviewing: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [benchIndex, setBenchIndex] = useState(0);
  const [feature, setFeature] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const direction = arrangements[focus];
  const bench = projects[benchIndex];
  const visibleProjects = projects.filter(p => filter !== "cross" || p.crossPlatform);

  async function copyBio() {
    try { await navigator.clipboard.writeText(speakerBio); setCopyStatus("Speaker bio copied."); }
    catch { setCopyStatus("Copy unavailable. You can download the bio below."); }
  }
  function onFeatureKey(event: KeyboardEvent<HTMLButtonElement>) {
    let next = feature;
    if (event.key === "ArrowRight") next = (feature + 1) % features.length;
    else if (event.key === "ArrowLeft") next = (feature + features.length - 1) % features.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = features.length - 1;
    else return;
    event.preventDefault(); setFeature(next);
    document.getElementById(`feature-tab-${next}`)?.focus();
  }

  function Work() {
    return <section className="work-section wrap" id="work" aria-labelledby="work-title">
      <div className="section-heading"><div><SectionLabel>THE CRAFT / SELECTED OPEN SOURCE</SectionLabel><h2 id="work-title">Small tools.<br /><span>A better everyday.</span></h2></div><p>Mostly Linux. Sometimes everywhere.<br />Always an itch worth scratching.</p></div>
      <div className="work-toolbar"><div className="filters" role="group" aria-label="Filter projects"><button type="button" onClick={() => setFilter("all")} aria-pressed={filter === "all"}>All projects <span>04</span></button><button type="button" onClick={() => setFilter("cross")} aria-pressed={filter === "cross"}>Cross-platform <span>03</span></button></div><a className="text-link" href={links.github}>Everything on GitHub <Arrow /></a></div>
      <div className="project-grid" aria-live="polite">{visibleProjects.map(p => <article className="project-card" key={p.name}>
        <a className={`project-image ${p.tone}`} href={p.url} aria-label={`Explore ${p.name}`}><span className="image-caption">{p.name.toLowerCase()} / in action</span><img src={`/images/${p.image}`} alt={`${p.name} ${p.name === "Vernier" ? "screen measurement demonstration" : "application screenshot"}`} loading="lazy" /><span className="image-corner" aria-hidden="true">↗</span></a>
        <div className="project-info"><div className="project-meta"><span>RUST</span><span>{p.platforms}</span>{p.plugin && <span className="plugin-label">OMARCHY PLUGIN</span>}</div><h3><a href={p.url}>{p.icon && <img src={`/images/${p.icon}`} width="23" height="23" alt="" />} {p.name}</a><a href={p.source} className="source-link" aria-label={`${p.name} source code`}>Source <Arrow /></a></h3><p className="project-tagline">{p.description}</p><p>{p.detail}</p></div>
      </article>)}</div>
      <div className="plugins-heading"><div><SectionLabel>MAKING OMARCHY MY OWN. SHARING THE GOOD PARTS.</SectionLabel><h3>A few additions to the desktop.</h3></div><span className="small-meta">PLUGINS & CONTRIBUTIONS</span></div>
      <div className="plugin-grid">{plugins.map(p => <a className="plugin-item" key={p.name} href={p.url}><span className="plugin-glyph" aria-hidden="true">{p.glyph}</span><div><h4>{p.name}</h4><p>{p.description}</p></div><Arrow /></a>)}</div>
      <div className="contribution-grid"><a href="https://github.com/basecamp/omarchy" className="contribution"><span className="contribution-label">OMARCHY / CORE CONTRIBUTOR</span><h4>A desktop worth contributing to. <Arrow /></h4><p>Contributing fixes and improvements to Omarchy itself, alongside the tools I build around it.</p></a><a href="https://github.com/tobi/omasnap" className="contribution"><span className="contribution-label">OMASNAP / CONTRIBUTOR & COMMITTER</span><h4>Making a good tool better, together. <Arrow /></h4><p>A contributor and committer to Tobi Lütke’s Omasnap screenshot editor.</p></a></div>
    </section>;
  }

  function Fulcrum() {
    return <section className="fulcrum-section wrap" id="fulcrum" aria-labelledby="fulcrum-title"><div className="fulcrum-panel">
      <div className="fulcrum-top"><a href={links.fulcrum} className="fulcrum-wordmark"><img src="/images/fulcrum-symbol.svg" width="34" height="28" alt="" />fulcrum</a><span className="fulcrum-status"><i /> BUILDING AT HEADWAY</span></div>
      <div className="fulcrum-heading"><div><SectionLabel>THE NEXT CHAPTER / BUILDING TOGETHER</SectionLabel><h2 id="fulcrum-title">Find your team’s<br /><span>development flow.</span></h2></div><p>All those little improvements add up. Now we’re bringing that same care to the way whole teams build software.</p></div>
      <p className="fulcrum-intro">Fulcrum connects estimates, pitches, shared skills, and project context in one workspace for teams building with AI agents.</p>
      <div className="fulcrum-product"><div className="fulcrum-story"><div className="feature-tabs" role="tablist" aria-label="Explore Fulcrum’s workflow">{features.map((f, i) => <button type="button" role="tab" id={`feature-tab-${i}`} aria-controls={`feature-panel-${i}`} aria-selected={feature === i} tabIndex={feature === i ? 0 : -1} onClick={() => setFeature(i)} onKeyDown={onFeatureKey} key={f.label}><span>0{i + 1}</span>{f.label}</button>)}</div>{features.map((f, i) => <div className="feature-content" role="tabpanel" id={`feature-panel-${i}`} aria-labelledby={`feature-tab-${i}`} hidden={feature !== i} tabIndex={0} key={f.title}><h3>{f.title}</h3><p>{f.text}</p></div>)}<div className="fulcrum-audience"><span>MADE FOR</span><p>Agencies & in-house product teams</p></div></div><figure className="fulcrum-screen"><div className="product-screen-label"><span className="status-dot" /> A PLAN THE WHOLE TEAM CAN SEE</div><img src="/images/fulcrum.png" alt="Fulcrum’s project staffing view showing a shared week-by-week delivery plan" width="1621" height="945" loading="lazy" /><figcaption>Inside Fulcrum / project planning</figcaption></figure></div>
      <div className="fulcrum-bottom"><div><strong>From “what will it take?” to “it’s shipped.”</strong><p>A shared way to plan, align, and build.</p></div><a className="button fulcrum-button" href={`${links.fulcrum}#early-access`}>Get early access to Fulcrum <Arrow /></a></div>
    </div></section>;
  }

  function About() {
    return <section className="about-section wrap" id="about" aria-labelledby="about-title"><div className="about-photo"><img src="/images/jon-kinney.jpeg" alt="Jon Kinney, Partner and CTO at Headway" width="800" height="800" loading="lazy" /><div className="photo-caption"><span className="status-dot" /> GREEN BAY, WISCONSIN <span>44.51° N</span></div></div><div className="about-copy"><SectionLabel>THE PERSON / STILL WRITING CODE</SectionLabel><h2 id="about-title">A developer’s CTO.</h2><p>I’ve been building with Ruby on Rails since 2005. These days, my work spans web applications, native Rust tools, and the people and processes that make good software possible.</p><p>As Partner & CTO at <a href="https://www.headway.io/">Headway</a>, I help teams find the right technical approach and carry it through to a working product. I care about the details in the code and the clarity around it.</p><p>Open source is where I put that care into practice. Build something useful. Share what I learn. Make the next person’s work a little easier.</p><div className="about-links"><a className="button outlined" href={links.headway}><img src="/images/headway-symbol.svg" width="23" height="23" alt="" />Build with me at Headway <Arrow /></a><a className="text-link" href={links.linkedin}>LinkedIn <Arrow /></a></div></div></section>;
  }

  function Community() {
    return <section className="community-section wrap" id="speaking" aria-labelledby="speaking-title"><div className="section-heading"><div><SectionLabel>OFF THE KEYBOARD / ON THE SAME PAGE</SectionLabel><h2 id="speaking-title">Good ideas get better<br /><span>in good company.</span></h2></div><p>Conferences, meetups, and conversations<br />about the craft of making software.</p></div><div className="community-grid"><div className="speaking-card"><span className="card-label">SPEAKING & CONVERSATIONS</span><h3>Let’s give developers<br />something to take home.</h3><p>I’m available for conference talks, meetups, and conversations with teams. A few things I’d love to talk about:</p><ul className="topic-list"><li><span>01</span>Team workflows for agentic development</li><li><span>02</span>Building useful native tools with Rust</li><li><span>03</span>Rails, maintainability & technical leadership</li></ul><div className="speaking-actions"><a className="text-link bright" href={speakingLink}>Invite me to speak <Arrow /></a><button className="copy-bio" type="button" onClick={copyBio}>Copy speaker bio <span aria-hidden="true">⧉</span></button></div><div className="bio-tools"><a href="/jon-kinney-speaker-bio.txt" download>Download bio ↓</a><span role="status">{copyStatus}</span></div></div><div className="meetup-card"><div className="meetup-mark" aria-hidden="true"><span>GB<span className="mark-dot">.</span></span><div>OMARCHY<br />MEETUP</div><i>WI / USA</i></div><div className="meetup-content"><span className="card-label"><span className="status-dot" /> COMMUNITY · OPEN TO EVERYONE</span><h3>Omarchy, in Green Bay.</h3><p>I organize our local Omarchy meetup. Come trade ideas, compare setups, and meet the people behind the keyboards. Your laptop is welcome.</p><a className="text-link bright" href={links.meetup}>Find the meetup on Luma <Arrow /></a><a className="calendar-link" href="https://omarchy.org/meetups/">Part of the global Omarchy meetup calendar ↗</a></div></div></div></section>;
  }

  function Notes() {
    const notes = [
      { type: "CONVERSATION", title: "Design Systems for AI and Agentic Development", date: "APR 17, 2026", meta: "Even-Keeled · 35 min", href: "https://www.headway.io/even-keeled/design-systems-for-ai-and-agentic-development" },
      { type: "CONVERSATION", title: "How Our Dev Team Actually Ships with AI in Early 2026", date: "FEB 19, 2026", meta: "Even-Keeled · 50 min", href: "https://www.headway.io/even-keeled/how-our-dev-team-actually-ships-with-ai-in-early-2026" },
      { type: "WRITING", title: "Taming schema.rb Chaos", date: "FEB 06, 2025", meta: "Headway · 6 min read", href: "https://www.headway.io/blog/taming-schema-rb-chaos-a-rails-developers-guide-to-deterministic-schema-generation" },
    ];
    return <section className="notes-section wrap" id="notes" aria-labelledby="notes-title"><div className="section-heading"><div><SectionLabel>THINKING OUT LOUD / WRITING & CONVERSATIONS</SectionLabel><h2 id="notes-title">Notes from the work.</h2></div><a className="text-link" href="https://www.headway.io/podcast/even-keeled">The Even-Keeled podcast <Arrow /></a></div><div className="note-list">{notes.map(n => <a className="note" href={n.href} key={n.title}><div className="note-date"><span>{n.type}</span><time>{n.date}</time></div><div><h3>{n.title}</h3><p>{n.meta}</p></div><Arrow /></a>)}</div></section>;
  }

  const sections: Record<string, React.ReactNode> = { work: Work(), fulcrum: Fulcrum(), about: About(), community: Community(), notes: Notes() };
  return <div className={reviewing ? "review-mode" : undefined}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header wrap ${menuOpen ? "menu-open" : ""}`}><a href="/" className="wordmark" aria-label="Jon Kinney home"><span className="monogram" aria-hidden="true"><span className="monogram-stem" /><span className="monogram-arms" /></span><span>Jon Kinney</span></a><nav id="site-navigation" aria-label="Main navigation"><a href="#work" onClick={() => setMenuOpen(false)}>Open source</a><a href="#fulcrum" onClick={() => setMenuOpen(false)}>Fulcrum</a><a href="#speaking" onClick={() => setMenuOpen(false)}>Speaking</a><a href="#notes" onClick={() => setMenuOpen(false)}>Notes</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a></nav><a className="header-contact" href="#contact">Let’s talk <Arrow /></a><button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button></header>
    <main id="main"><section className={`hero wrap hero-${focus}`} aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow"><span className="status-dot" />{direction.eyebrow}</p><h1 id="hero-title">{direction.headline}</h1><p className="hero-description">{direction.description}</p><div className="hero-actions"><a className="button primary" href={direction.target}>{direction.primary}<Arrow down={direction.target.startsWith("#")} /></a><a className="text-link" href={direction.secondaryTarget}>{direction.secondary}<Arrow down /></a></div><div className="hero-person"><img src="/images/jon-kinney.jpeg" width="42" height="42" alt="Jon Kinney" /><div><span>Partner & CTO at Headway</span><p>Green Bay, Wisconsin</p></div></div></div>
      {focus === "work" ? <div className="workbench"><div className="workbench-top"><span className="eyebrow">FROM MY WORKBENCH</span><div className="bench-controls"><button type="button" onClick={() => setBenchIndex((benchIndex + 3) % 4)} aria-label="Show previous project">←</button><span className="bench-counter" aria-live="polite">0{benchIndex + 1} / 04</span><button type="button" onClick={() => setBenchIndex((benchIndex + 1) % 4)} aria-label="Show next project">→</button></div></div><a className={`bench-window bench-${bench.name.toLowerCase()}`} href={bench.url} aria-label={`Explore ${bench.name}`}><div className="window-label"><span className="window-dots"><i /><i /><i /></span><span>{bench.name.toLowerCase()} / made for the details</span><Arrow /></div><div className="bench-preview"><img src={`/images/${bench.image}`} alt={`${bench.name} ${bench.name === "Vernier" ? "measurement demonstration" : "application preview"}`} /></div></a><div className="bench-note"><span className="tiny-cross">+</span><span>Made for the details.<br /><b>Built to get out of your way.</b></span><span className="bench-tag">RUST + LINUX</span></div><div className="bench-axis" aria-hidden="true"><span>0</span><span>100</span><span>200</span><span>300</span><span>400</span></div></div> : focus === "teams" ? <div className="leadership-hero"><SectionLabel>JON KINNEY / PARTNER & CTO</SectionLabel><img src="/images/jon-kinney.jpeg" alt="Jon Kinney" width="800" height="800" /><div className="leadership-caption"><span>Hands on the code.<br /><b>Eyes on the bigger picture.</b></span><img src="/images/headway-symbol.svg" width="35" height="35" alt="Headway" /></div></div> : <div className="product-hero"><div className="product-hero-brand"><img src="/images/fulcrum-symbol.svg" width="31" height="25" alt="" /><span>fulcrum</span><span className="small-meta">A HEADWAY VENTURE</span></div><img className="product-hero-screen" src="/images/fulcrum.png" alt="Fulcrum project planning dashboard" width="1621" height="945" /><p>Plan the work. Share the context.<br /><b>Build something good, together.</b></p><div className="hero-workflow"><span>PLAN</span><Arrow /><span>ALIGN</span><Arrow /><span>BUILD</span></div></div>}
    </section><div className="current-strip wrap"><span className="eyebrow">ON THE DESK NOW</span><a href="#fulcrum"><img src="/images/fulcrum-symbol.svg" width="23" height="23" alt="" /><b>Fulcrum</b><span>A shared workspace for teams building with AI.</span><span className="strip-arrow">Meet Fulcrum ↘</span></a></div>{direction.sections.map(s => <div key={s}>{sections[s]}</div>)}
    <section className="contact-section wrap" id="contact" aria-labelledby="contact-title"><div><SectionLabel>GOOD WORK STARTS WITH A CONVERSATION.</SectionLabel><h2 id="contact-title">Have something<br /><span>worth building?</span></h2><p>A product, a team, or a room full of curious developers.<br />I’d like to hear about it.</p></div><div className="contact-options"><a href={links.headway}><span><b>Build with me & Headway</b><small>Web, mobile, product strategy & development</small></span><Arrow /></a><a href={speakingLink}><span><b>Invite me to speak</b><small>Conferences, meetups & team conversations</small></span><Arrow /></a><a href={`${links.fulcrum}#early-access`}><span><b>Find your flow with Fulcrum</b><small>Explore early access for your team</small></span><Arrow /></a></div></section></main>
    <footer className="wrap footer"><a className="footer-name" href="/">Jon Kinney <span>© 2026</span></a><span className="footer-location">Built with care in Green Bay, Wisconsin.</span><div><a href={links.github}>GitHub <Arrow /></a><a href={links.linkedin}>LinkedIn <Arrow /></a><a href="#main">Back to top ↑</a></div></footer>
    {reviewing && <aside className="review-bar" aria-label="Compare homepage arrangements"><div className="review-caption"><span>HOMEPAGE FOCUS</span><p>{direction.summary}</p></div><div className="review-options">{(Object.keys(arrangements) as Focus[]).map((key, index) => <a href={`/?focus=${key}&review=1`} key={key} aria-current={focus === key ? "page" : undefined}><span>0{index + 1}</span>{arrangements[key].label}</a>)}</div><a className="close-review" href={`/?focus=${focus}`} aria-label="Hide comparison controls">×</a></aside>}
  </div>;
}
