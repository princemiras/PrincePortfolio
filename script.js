/* ===== EDIT THIS PART WITH YOUR OWN INFO ===== */
const CONFIG = {
  name: "Prince Miras",
  email: "mirasprince123@gmail.com",
  resumeFile: "assets/Prince_Miras_Resume.pdf", // your resume PDF inside the assets folder
  availability: "Part-time Administrative Virtual Assistant, Philippines time (PHT)",
  roles: ["administrative VA.", "data entry helper.", "detail-minded IS student."]
};
const TASKS = ["Sort and reply to emails", "Update the schedule and calendar", "Encode records in a spreadsheet", "Check inventory and sales sheets", "Send the end-of-day summary"];
const SKILLS = {
  Admin: [["Data entry and encoding", 75], ["File and digital organization", 75], ["Spreadsheet updates and digital logs", 70], ["Record confidentiality", 80]],
  Office: [["Google Workspace (Docs, Sheets, Drive)", 70], ["Microsoft Word", 75], ["Microsoft Excel", 65], ["Adobe Creative Suite (installation and setup)", 50]],
  Tech: [["Software installation and setup", 70], ["PC hardware maintenance", 70], ["Printer and scanner setup", 70], ["Basic web design (HTML, CSS, JS)", 65]],
  Soft: [["Independent problem solving", 70], ["Attention to detail", 75], ["Fast learner", 80], ["Time management", 75]]
};
const PROJECTS = [
  { title: "R.A. Motor Parts Sales & Inventory System", cat: "Business",
    imgs: ["assets/motor-1.png", "assets/motor-2.png", "assets/motor-3.png", "assets/motor-4.png"],
    desc: "A point-of-sale and inventory system for a motor parts store, made for my capstone research project.",
    features: ["Dashboard with sales totals, monthly revenue and low-stock alerts", "Product list with brand, model and part number search", "Inventory status: in stock, low stock, out of stock", "Stock in, stock history, stock check, reports, profit and void approvals"],
    tech: ["POS", "Inventory", "Reports", "Dashboard"] },
  { title: "Harry Rice Mill Management System", cat: "Business",
    imgs: ["assets/ricemill-1.png", "assets/ricemill-2.png", "assets/ricemill-3.png", "assets/ricemill-4.png", "assets/ricemill-5.png"],
    desc: "A system for a rice mill to handle customers, palay receiving, drying and daily collections.",
    features: ["Palay receiving with transaction numbers and status tracking", "Today's Bulad (drying) with expected drying fees", "Dashboard cards for the palay pipeline and today's revenue", "Sack inventory, unpaid transactions, reports and audit logs"],
    tech: ["Records", "Dashboard", "Workflow", "Audit logs"] },
  { title: "BRMPCAS: Banca Records & Permit Compliance System", cat: "Government",
    imgs: ["assets/banca-1.png", "assets/banca-2.png", "assets/banca-3.png"],
    desc: "A web system for a Municipal Agriculture Office to register fishing boats (bancas), issue permits and monitor compliance.",
    features: ["Banca records and boat owner registry with search and filters", "Registration applications and permit management", "Inspection and compliance tracking with analytics", "Dashboard of key metrics, reports and notifications"],
    tech: ["React.js", "Records", "Permits", "Analytics"] }
];

/* ===== SCRIPT ===== */
const $ = s => document.querySelector(s);
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); };

$("#logoName").textContent = CONFIG.name; $("#footName").textContent = CONFIG.name;
$("#emailText").textContent = CONFIG.email; $("#avail").textContent = CONFIG.availability;
$("#year").textContent = "© " + new Date().getFullYear();

// Theme
const root = document.documentElement;
const saved = (() => { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();
root.dataset.theme = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
$("#themeBtn").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
};

// Mobile menu
const menu = $("#menu"), burger = $("#burger");
burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
menu.querySelectorAll("a").forEach(a => a.onclick = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); });

// Typing effect
(() => {
  const el = $("#typed"); let r = 0, c = 0, del = false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = CONFIG.roles[0]; return; }
  (function tick() {
    const w = CONFIG.roles[r];
    el.textContent = w.slice(0, c += del ? -1 : 1);
    let d = del ? 40 : 90;
    if (!del && c === w.length) { del = true; d = 1500; }
    else if (del && c === 0) { del = false; r = (r + 1) % CONFIG.roles.length; d = 400; }
    setTimeout(tick, d);
  })();
})();

// Task board
const list = $("#tasks");
TASKS.forEach(t => { const li = document.createElement("li"); li.textContent = t; li.tabIndex = 0; li.setAttribute("role", "checkbox"); li.setAttribute("aria-checked", "false"); list.append(li); });
const updateBar = () => {
  const n = list.querySelectorAll(".done").length;
  $("#barFill").style.width = (n / TASKS.length * 100) + "%";
  $("#barText").textContent = n === TASKS.length ? "All done. Ready for your tasks!" : `${n} of ${TASKS.length} done`;
};
const flip = li => { li.classList.toggle("done"); li.setAttribute("aria-checked", li.classList.contains("done")); updateBar(); };
list.onclick = e => e.target.closest("li") && flip(e.target.closest("li"));
list.onkeydown = e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); e.target.closest("li") && flip(e.target); } };

// Skills tabs
const tabs = $("#skillTabs"), sl = $("#skillList");
function showSkills(cat) {
  tabs.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.textContent === cat));
  sl.innerHTML = SKILLS[cat].map(([n, v]) => `<li><div class="row"><span>${n}</span><span class="lvl">${v}%</span></div><div class="meter"><i data-w="${v}"></i></div></li>`).join("");
  requestAnimationFrame(() => requestAnimationFrame(() => sl.querySelectorAll("i").forEach(i => i.style.width = i.dataset.w + "%")));
}
Object.keys(SKILLS).forEach(k => { const b = document.createElement("button"); b.textContent = k; b.onclick = () => showSkills(k); tabs.append(b); });
showSkills(Object.keys(SKILLS)[0]);

// Projects + filter + modal
const pic = (src, p) => `<figure class="pic" data-label="${p.title}"><img src="${src}" alt="Screenshot of ${p.title}" loading="lazy" onerror="this.remove()"></figure>`;
const grid = $("#projectGrid"), filters = $("#filters"), modal = $("#modal");
function renderProjects(cat) {
  filters.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.textContent === cat));
  grid.innerHTML = "";
  PROJECTS.forEach((p, i) => {
    if (cat !== "All" && p.cat !== cat) return;
    const d = document.createElement("article"); d.className = "card";
    d.innerHTML = `${pic(p.imgs[0], p)}<h3>${p.title}</h3><p>${p.desc}</p><div class="tags">${p.tech.map(t => `<span>${t}</span>`).join("")}</div><button class="btn" data-i="${i}">View details</button>`;
    grid.append(d);
  });
}
["All", ...new Set(PROJECTS.map(p => p.cat))].forEach(c => { const b = document.createElement("button"); b.textContent = c; b.onclick = () => renderProjects(c); filters.append(b); });
renderProjects("All");
// Slideshow inside the project modal
let sIdx = 0, sTotal = 0, sTimer = null;
const slides = $("#mPics"), dots = $("#sDots");
const slideTo = n => {
  sIdx = (n + sTotal) % sTotal;
  slides.style.transform = `translateX(-${sIdx * 100}%)`;
  dots.querySelectorAll("button").forEach((d, i) => d.classList.toggle("on", i === sIdx));
  $("#sCount").textContent = `${sIdx + 1} / ${sTotal}`;
};
const stopSlider = () => { clearInterval(sTimer); sTimer = null; };
const startAuto = () => { stopSlider(); if (sTotal > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) sTimer = setInterval(() => slideTo(sIdx + 1), 4000); };
const userMove = n => { slideTo(n); stopSlider(); };
function initSlider(n) {
  sTotal = n; slides.style.transition = "none"; slideTo(0); setTimeout(() => slides.style.transition = "", 30);
  dots.innerHTML = Array.from({ length: n }, (_, i) => `<button aria-label="Go to screenshot ${i + 1}"></button>`).join("");
  dots.querySelectorAll("button").forEach((d, i) => d.onclick = () => userMove(i)); slideTo(0);
  document.querySelectorAll(".sbtn, #sCount").forEach(e => e.style.display = n > 1 ? "" : "none");
  startAuto();
}
$("#sPrev").onclick = () => userMove(sIdx - 1);
$("#sNext").onclick = () => userMove(sIdx + 1);
$("#slider").addEventListener("mouseenter", stopSlider);
slides.addEventListener("click", e => e.target.tagName === "IMG" && window.open(e.target.src, "_blank"));
let tx = null;
$("#slider").addEventListener("touchstart", e => { tx = e.touches[0].clientX; stopSlider(); }, { passive: true });
$("#slider").addEventListener("touchend", e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) userMove(sIdx + (dx < 0 ? 1 : -1)); tx = null; });
document.addEventListener("keydown", e => { if (!modal.classList.contains("open")) return; if (e.key === "ArrowRight") userMove(sIdx + 1); if (e.key === "ArrowLeft") userMove(sIdx - 1); });
let lastFocus;
grid.onclick = e => {
  const b = e.target.closest("button[data-i]"); if (!b) return;
  const p = PROJECTS[b.dataset.i]; lastFocus = b;
  $("#mPics").innerHTML = p.imgs.map(i => pic(i, p)).join(""); $("#mTitle").textContent = p.title; $("#mDesc").textContent = p.desc;
  $("#mFeat").innerHTML = p.features.map(f => `<li>${f}</li>`).join("");
  $("#mTech").innerHTML = p.tech.map(t => `<span>${t}</span>`).join("");
  initSlider(p.imgs.length); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); $("#mClose").focus();
};
const closeModal = () => { stopSlider(); modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); lastFocus && lastFocus.focus(); };
$("#mClose").onclick = closeModal;
modal.onclick = e => e.target === modal && closeModal();
document.addEventListener("keydown", e => e.key === "Escape" && modal.classList.contains("open") && closeModal());

// Copy email
$("#copyBtn").onclick = async () => {
  try { await navigator.clipboard.writeText(CONFIG.email); toast("Email copied"); }
  catch (e) { toast("Copy failed. Select the email and copy it."); }
};

// Resume download (a normal link to the PDF in the assets folder)
const rb = $("#resumeBtn");
rb.href = CONFIG.resumeFile;
rb.download = CONFIG.name.replace(/\s+/g, "_") + "_Resume.pdf";
rb.onclick = () => toast("Downloading resume...");

// Contact form: sends the message to CONFIG.email through FormSubmit (works once the site is hosted online)
$("#form").onsubmit = async e => {
  e.preventDefault();
  const n = $("#fName").value.trim(), em = $("#fEmail").value.trim(), m = $("#fMsg").value.trim(), err = $("#err"), btn = $("#sendBtn");
  err.classList.remove("ok");
  if (!n || !m) return err.textContent = "Please fill in your name and message.";
  if (!/^\S+@\S+\.\S+$/.test(em)) return err.textContent = "Enter a valid email, like name@company.com.";
  if ($("#honey").value) return;
  err.textContent = ""; btn.disabled = true; btn.textContent = "Sending...";
  try {
    const res = await fetch("https://formsubmit.co/ajax/" + CONFIG.email, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: n, email: em, message: m, _subject: "New portfolio message from " + n, _template: "table", _captcha: "false" })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === "false" || data.success === false) throw new Error("send failed");
    e.target.reset(); err.classList.add("ok"); err.textContent = "Message sent. Thank you! I'll reply to " + em + " soon."; toast("Message sent");
  } catch (x) {
    err.textContent = "Could not send directly, so your email app will open instead.";
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Hello from " + n)}&body=${encodeURIComponent(m + "\n\nFrom: " + n + " (" + em + ")")}`;
  }
  btn.disabled = false; btn.textContent = "Send message";
};

// Back to top + active nav link
const topBtn = $("#toTop");
topBtn.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
addEventListener("scroll", () => topBtn.classList.toggle("show", scrollY > 500), { passive: true });
const links = [...menu.querySelectorAll("a")];
const nio = new IntersectionObserver(es => es.forEach(en => en.isIntersecting && links.forEach(a => a.classList.toggle("active", a.hash === "#" + en.target.id))), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => nio.observe(s));

// Count-up stats
const cio = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return; cio.unobserve(en.target);
  const el = en.target, end = +el.dataset.count; let n = 0;
  const id = setInterval(() => { n += Math.max(1, Math.round(end / 30)); if (n >= end) { n = end; clearInterval(id); } el.textContent = n; }, 35);
}));
document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));
