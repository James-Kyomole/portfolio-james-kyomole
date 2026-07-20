(function(){
  "use strict";

  var STATE = {
    lang: localStorage.getItem("jk_lang") || "fr",
    data: null,
    charts: []
  };

  var ICONS = {
    email: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z" opacity="0"/><path d="M22 6l-10 7L2 6"/><path d="M2 6h20v12H2z"/></svg>',
    whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.46 0 9.9-4.45 9.9-9.91C22 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.58.83 2 .9 2.14.07.14.11.3.02.49-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.28.28-.12.55.16.27.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.23 1.38.27.14.43.11.58-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.27.14.44.2.5.31.06.13.06.71-.18 1.39z"/></svg>',
    linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.5h4.5V23H.24V8.5zM8.5 8.5h4.31v1.98h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.5v-6.99c0-1.67-.03-3.81-2.32-3.81-2.33 0-2.69 1.82-2.69 3.7V23H8.5V8.5z"/></svg>',
    location: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>',
    briefcase: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    graduation: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>',
    map: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3V6z"/></svg>',
    globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>',
    file: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>'
  };

  var I18N = {
    "nav.home": {fr:"Accueil", en:"Home"},
    "nav.about": {fr:"Profil", en:"About"},
    "nav.skills": {fr:"Compétences", en:"Skills"},
    "nav.experience": {fr:"Expériences", en:"Experience"},
    "nav.projects": {fr:"Projets", en:"Projects"},
    "nav.contact": {fr:"Contact", en:"Contact"},
    "hero.eyebrow": {fr:"Bonjour, je suis", en:"Hi, I'm"},
    "about.kicker": {fr:"Profil", en:"Profile"},
    "about.title": {fr:"À propos de moi", en:"About me"},
    "about.educationTitle": {fr:"Formation académique", en:"Education"},
    "about.certificationsTitle": {fr:"Certifications", en:"Certifications"},
    "about.languagesTitle": {fr:"Langues", en:"Languages"},
    "skills.kicker": {fr:"Expertise", en:"Expertise"},
    "skills.title": {fr:"Domaines de compétences", en:"Areas of expertise"},
    "experience.kicker": {fr:"Parcours", en:"Background"},
    "experience.title": {fr:"Expériences professionnelles", en:"Professional experience"},
    "projects.kicker": {fr:"Réalisations", en:"Work"},
    "projects.title": {fr:"Projets", en:"Projects"},
    "projects.subtitle": {fr:"Deux études de cas en analyse de données et suivi budgétaire sous Excel, de la collecte brute au tableau de bord décisionnel.", en:"Two case studies in data analysis and budget tracking with Excel, from raw collection to decision-ready dashboards."},
    "projects.categoryBreakdown": {fr:"Répartition par catégorie", en:"Breakdown by category"},
    "projects.monthlyTrend": {fr:"Évolution mensuelle", en:"Monthly trend"},
    "projects.budgetVsActual": {fr:"Budget prévu vs réel", en:"Budget vs actual"},
    "projects.download": {fr:"Télécharger le fichier Excel", en:"Download the Excel file"},
    "contact.kicker": {fr:"Contact", en:"Contact"},
    "contact.form.name": {fr:"Nom complet", en:"Full name"},
    "contact.form.email": {fr:"Adresse email", en:"Email address"},
    "contact.form.subject": {fr:"Sujet", en:"Subject"},
    "contact.form.message": {fr:"Message", en:"Message"},
    "contact.form.note": {fr:"Ce formulaire vous envoie directement un email — vous pouvez aussi me joindre via les liens ci-contre.", en:"This form sends me an email directly — you can also reach me via the links to the side."},
    "contact.form.submit": {fr:"Envoyer le message", en:"Send message"},
    "contact.form.sending": {fr:"Envoi en cours…", en:"Sending…"},
    "contact.form.success": {fr:"Message envoyé avec succès. Merci, je reviens vers vous rapidement !", en:"Message sent successfully. Thanks, I'll get back to you soon!"},
    "contact.form.fallback": {fr:"Le service d'envoi n'est pas encore configuré : votre messagerie va s'ouvrir pour envoyer le message directement par email.", en:"The mail service isn't configured yet: your email client will open to send the message directly."},
    "contact.links.email": {fr:"Email", en:"Email"},
    "contact.links.whatsapp": {fr:"WhatsApp", en:"WhatsApp"},
    "contact.links.location": {fr:"Localisation", en:"Location"},
    "footer.rights": {fr:"Tous droits réservés.", en:"All rights reserved."},
    "footer.admin": {fr:"Espace administrateur", en:"Admin area"}
  };

  function t(key){
    var e = I18N[key];
    return e ? e[STATE.lang] : key;
  }
  function tf(field){
    if(!field) return "";
    if(typeof field === "string") return field;
    return field[STATE.lang] || field.fr || "";
  }

  function applyStaticI18n(){
    document.documentElement.lang = STATE.lang;
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.getElementById("langToggle").textContent = STATE.lang.toUpperCase();
  }

  function renderHero(profile){
    document.getElementById("heroName").textContent = profile.name;
    document.getElementById("heroTitle").textContent = tf(profile.title);
    document.getElementById("heroTagline").textContent = tf(profile.tagline);
    document.getElementById("heroPhoto").src = profile.photoHero;
    document.getElementById("aboutPhoto").src = profile.photoAbout;

    var primary = document.getElementById("heroCtaPrimary");
    primary.textContent = tf(profile.heroCtaPrimary);

    var secondary = document.getElementById("heroCtaSecondary");
    secondary.textContent = tf(profile.heroCtaSecondary);
    secondary.href = profile.cvFile;

    var factsIcons = ["briefcase","graduation","map","globe"];
    var facts = document.getElementById("heroFacts");
    facts.innerHTML = "";
    (profile.quickFacts || []).forEach(function(f, i){
      var li = document.createElement("li");
      li.textContent = tf(f);
      facts.appendChild(li);
    });
  }

  function renderAbout(profile){
    document.getElementById("aboutSummary").textContent = tf(profile.summary);
  }

  function renderEducation(list){
    var ul = document.getElementById("educationList");
    ul.innerHTML = "";
    (list || []).forEach(function(item){
      var li = document.createElement("li");
      li.innerHTML = '<span class="li-main">' + tf(item.degree) + '</span>' + item.org + ' · ' + item.year;
      ul.appendChild(li);
    });
  }

  function renderCertifications(list){
    var ul = document.getElementById("certificationsList");
    ul.innerHTML = "";
    (list || []).forEach(function(item){
      var li = document.createElement("li");
      li.textContent = tf(item);
      ul.appendChild(li);
    });
  }

  function renderLanguages(list){
    var wrap = document.getElementById("languagesList");
    wrap.innerHTML = "";
    (list || []).forEach(function(item){
      var row = document.createElement("div");
      row.className = "lang-row";
      row.innerHTML =
        '<span class="lang-name">' + tf(item.name) + '</span>' +
        '<span class="lang-bar"><span style="width:' + item.pct + '%"></span></span>' +
        '<span class="lang-level">' + tf(item.level) + '</span>';
      wrap.appendChild(row);
    });
  }

  function renderSkills(groups){
    var grid = document.getElementById("skillsGrid");
    grid.innerHTML = "";
    (groups || []).forEach(function(g){
      var card = document.createElement("div");
      card.className = "skill-card";
      var tags = (g.items || []).map(function(i){ return "<span>" + i + "</span>"; }).join("");
      card.innerHTML = "<h3>" + tf(g.group) + "</h3><div class='skill-tags'>" + tags + "</div>";
      grid.appendChild(card);
    });
  }

  function renderExperience(list){
    var tl = document.getElementById("timeline");
    tl.innerHTML = "";
    (list || []).forEach(function(exp){
      var item = document.createElement("div");
      item.className = "timeline-item";
      var bullets = (exp.bullets ? exp.bullets[STATE.lang] || exp.bullets.fr : []) || [];
      var lis = bullets.map(function(b){ return "<li>" + b + "</li>"; }).join("");
      item.innerHTML =
        "<h3>" + tf(exp.role) + "</h3>" +
        "<div class='timeline-org'>" + exp.org + "</div>" +
        "<div class='timeline-period'>" + tf(exp.period) + "</div>" +
        "<ul>" + lis + "</ul>";
      tl.appendChild(item);
    });
  }

  function destroyCharts(){
    STATE.charts.forEach(function(c){ try{ c.destroy(); }catch(e){} });
    STATE.charts = [];
  }

  function fmtNum(n){
    return new Intl.NumberFormat(STATE.lang === "fr" ? "fr-FR" : "en-US").format(n);
  }

  function renderProjects(list){
    var wrap = document.getElementById("projectsList");
    wrap.innerHTML = "";
    destroyCharts();

    (list || []).forEach(function(proj, idx){
      var card = document.createElement("div");
      card.className = "project-card";

      var highlights = (proj.highlights ? proj.highlights[STATE.lang] || proj.highlights.fr : []) || [];
      var hiLis = highlights.map(function(h){ return "<li>" + h + "</li>"; }).join("");
      var toolsHtml = (proj.tools || []).map(function(tool){ return "<span>" + tool + "</span>"; }).join("");

      var info = document.createElement("div");
      info.className = "project-info";
      info.innerHTML =
        "<span class='project-period'>" + proj.period + "</span>" +
        "<h3>" + tf(proj.title) + "</h3>" +
        "<p>" + tf(proj.description) + "</p>" +
        "<div class='project-tools'>" + toolsHtml + "</div>" +
        "<ul class='project-highlights'>" + hiLis + "</ul>" +
        "<div class='project-links'><a class='btn btn-outline btn-sm' href='" + proj.file + "' download>" + t("projects.download") + "</a></div>";

      var chartWrap = document.createElement("div");
      chartWrap.className = "project-chart-wrap";
      var canvasIdCat = "chart-cat-" + idx;
      var canvasIdTrend = "chart-trend-" + idx;
      chartWrap.innerHTML =
        "<p style='font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft);margin-bottom:8px;'>" +
        (proj.chart.type === "budget" ? t("projects.budgetVsActual") : t("projects.categoryBreakdown")) + "</p>" +
        "<canvas id='" + canvasIdCat + "' height='150'></canvas>" +
        "<p style='font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft);margin:18px 0 8px;'>" + t("projects.monthlyTrend") + "</p>" +
        "<canvas id='" + canvasIdTrend + "' height='140'></canvas>";

      card.appendChild(info);
      card.appendChild(chartWrap);
      wrap.appendChild(card);

      buildCharts(proj, canvasIdCat, canvasIdTrend);
    });
  }

  function chartColors(){
    return ["#1666ba", "#12b0a0", "#e8912b", "#7c5cff", "#e05a7a", "#2ea9e0"];
  }

  function buildCharts(proj, catId, trendId){
    if(typeof Chart === "undefined") return;
    var ctxCat = document.getElementById(catId);
    var ctxTrend = document.getElementById(trendId);
    var colors = chartColors();

    if(proj.chart.type === "mixed"){
      STATE.charts.push(new Chart(ctxCat, {
        type: "doughnut",
        data: {
          labels: proj.chart.categories,
          datasets: [{ data: proj.chart.byCategory, backgroundColor: colors, borderWidth: 2, borderColor: "#fff" }]
        },
        options: {
          plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } } },
          cutout: "62%"
        }
      }));
      var months = STATE.lang === "fr" ? proj.chart.months : proj.chart.monthsEn;
      STATE.charts.push(new Chart(ctxTrend, {
        type: "bar",
        data: {
          labels: months,
          datasets: [{ label: STATE.lang === "fr" ? "Dépenses (FCFA)" : "Spending (FCFA)", data: proj.chart.byMonth, backgroundColor: "#1666ba", borderRadius: 6, maxBarThickness: 46 }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { callback: function(v){ return fmtNum(v); } } } }
        }
      }));
    } else if(proj.chart.type === "budget"){
      var cats = STATE.lang === "fr" ? proj.chart.categories : proj.chart.categoriesEn;
      STATE.charts.push(new Chart(ctxCat, {
        type: "bar",
        data: {
          labels: cats,
          datasets: [
            { label: STATE.lang === "fr" ? "Budget" : "Budget", data: proj.chart.budget, backgroundColor: "#c7d2e8", borderRadius: 6 },
            { label: STATE.lang === "fr" ? "Réel" : "Actual", data: proj.chart.actual, backgroundColor: "#12b0a0", borderRadius: 6 }
          ]
        },
        options: {
          plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: { y: { ticks: { callback: function(v){ return fmtNum(v); } } } }
        }
      }));
      var monthsB = STATE.lang === "fr" ? proj.chart.months : proj.chart.monthsEn;
      STATE.charts.push(new Chart(ctxTrend, {
        type: "line",
        data: {
          labels: monthsB,
          datasets: [{
            label: STATE.lang === "fr" ? "Dépenses (FCFA)" : "Spending (FCFA)",
            data: proj.chart.monthlyTotals, borderColor: "#1666ba", backgroundColor: "rgba(22,102,186,.12)",
            fill: true, tension: .35, pointRadius: 3
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { callback: function(v){ return fmtNum(v); } } } }
        }
      }));
    }
  }

  function renderContact(contact){
    document.getElementById("contactTitle").textContent = tf(contact.sectionTitle);
    document.getElementById("contactSubtitle").textContent = tf(contact.sectionSubtitle);
    document.getElementById("contactSubmit").textContent = t("contact.form.submit");

    var profile = STATE.data.profile;
    var wa = "https://wa.me/" + contact.whatsapp;
    var links = [
      { icon: ICONS.email, label: t("contact.links.email"), value: profile.email, href: "mailto:" + profile.email },
      { icon: ICONS.whatsapp, label: t("contact.links.whatsapp"), value: profile.phone, href: wa },
      { icon: ICONS.location, label: t("contact.links.location"), value: profile.location, href: null }
    ];
    var wrap = document.getElementById("contactLinks");
    wrap.innerHTML = "";
    links.forEach(function(l){
      var el = document.createElement(l.href ? "a" : "div");
      el.className = "contact-link";
      if(l.href){ el.href = l.href; el.target = "_blank"; el.rel = "noopener"; }
      el.innerHTML = "<span class='icon'>" + l.icon + "</span><span>" + l.label + "<br><strong style='color:var(--navy-950)'>" + l.value + "</strong></span>";
      wrap.appendChild(el);
    });
  }

  function renderAll(){
    var d = STATE.data;
    applyStaticI18n();
    renderHero(d.profile);
    renderAbout(d.profile);
    renderEducation(d.education);
    renderCertifications(d.certifications);
    renderLanguages(d.languages);
    renderSkills(d.skills);
    renderExperience(d.experience);
    renderProjects(d.projects);
    renderContact(d.contact);
  }

  function setupNav(){
    var header = document.getElementById("siteHeader");
    window.addEventListener("scroll", function(){
      header.classList.toggle("scrolled", window.scrollY > 30);
    });
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    toggle.addEventListener("click", function(){
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ nav.classList.remove("open"); });
    });
  }

  function setupLangToggle(){
    document.getElementById("langToggle").addEventListener("click", function(){
      STATE.lang = STATE.lang === "fr" ? "en" : "fr";
      localStorage.setItem("jk_lang", STATE.lang);
      renderAll();
    });
  }

  function setupContactForm(){
    var form = document.getElementById("contactForm");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var btn = document.getElementById("contactSubmit");
      var endpoint = STATE.data.contact.formspreeEndpoint || "";
      var name = document.getElementById("cf-name").value;
      var email = document.getElementById("cf-email").value;
      var subject = document.getElementById("cf-subject").value;
      var message = document.getElementById("cf-message").value;

      var statusEl = form.querySelector(".form-status");
      if(!statusEl){
        statusEl = document.createElement("p");
        statusEl.className = "form-status";
        form.appendChild(statusEl);
      }

      function mailtoFallback(){
        var body = message + "\n\n(" + name + " — " + email + ")";
        var mailto = "mailto:" + STATE.data.profile.email +
          "?subject=" + encodeURIComponent(subject || "Contact via portfolio") +
          "&body=" + encodeURIComponent(body);
        statusEl.className = "form-status ok";
        statusEl.textContent = t("contact.form.fallback");
        window.location.href = mailto;
        btn.disabled = false;
        btn.textContent = t("contact.form.submit");
      }

      if(!endpoint || endpoint.indexOf("VOTRE_ID") !== -1){
        mailtoFallback();
        return;
      }

      btn.disabled = true;
      btn.textContent = t("contact.form.sending");
      statusEl.className = "form-status";
      statusEl.textContent = "";

      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function(res){
        if(res.ok){
          statusEl.className = "form-status ok";
          statusEl.textContent = t("contact.form.success");
          form.reset();
        } else {
          mailtoFallback();
        }
        btn.disabled = false;
        btn.textContent = t("contact.form.submit");
      }).catch(function(){
        mailtoFallback();
      });
    });
  }

  function init(){
    document.getElementById("footerYear").textContent = new Date().getFullYear();
    setupNav();
    setupLangToggle();
    setupContactForm();

    fetch("data/content.json?_=" + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(data){
        STATE.data = data;
        renderAll();
      })
      .catch(function(err){
        console.error("Impossible de charger le contenu:", err);
      })
      .finally(function(){
        var loader = document.getElementById("loader");
        if(loader) loader.classList.add("done");
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
