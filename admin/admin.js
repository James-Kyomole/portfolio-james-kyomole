(function(){
  "use strict";

  /* =========================================================
     Cet espace admin écrit directement dans le dépôt GitHub
     via l'API "Contents". Vercel republie automatiquement le
     site à chaque commit sur la branche connectée.

     IMPORTANT (sécurité) : GATE_PASS ci-dessous n'est qu'un
     filtre anti-visiteur-occasionnel, PAS une protection réelle
     (ce fichier est public). La vraie protection est votre
     jeton d'accès personnel GitHub (PAT), demandé ensuite, que
     vous seul possédez. Changez GATE_PASS avant de publier.
     ========================================================= */
  var GATE_PASS = "kyomole-admin";
  var GATE_KEY = "jk_admin_gate_ok";
  var LS_KEY = "jk_admin_gh_config";
  var CONTENT_PATH = "data/content.json";

  var state = { owner:"", repo:"", branch:"main", token:"", content:null, sha:null, fileShas:{} };

  /* ---------------- base64 <-> utf8 helpers ---------------- */
  function b64EncodeUnicode(str){
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(_, p1){
      return String.fromCharCode(parseInt(p1, 16));
    }));
  }
  function b64DecodeUnicode(str){
    return decodeURIComponent(atob(str.replace(/\n/g,"")).split("").map(function(c){
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  }

  /* ---------------- GitHub API ---------------- */
  function ghHeaders(){
    return {
      "Authorization": "Bearer " + state.token,
      "Accept": "application/vnd.github+json"
    };
  }
  function ghGetFile(path){
    var url = "https://api.github.com/repos/" + state.owner + "/" + state.repo + "/contents/" + path + "?ref=" + encodeURIComponent(state.branch);
    return fetch(url, { headers: ghHeaders() }).then(function(r){
      if(!r.ok) return r.json().catch(function(){return {};}).then(function(e){ throw new Error((e && e.message) || ("HTTP " + r.status)); });
      return r.json();
    });
  }
  function ghPutFile(path, base64Content, sha, message){
    var url = "https://api.github.com/repos/" + state.owner + "/" + state.repo + "/contents/" + path;
    var body = { message: message, content: base64Content, branch: state.branch };
    if(sha) body.sha = sha;
    return fetch(url, {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, ghHeaders()),
      body: JSON.stringify(body)
    }).then(function(r){
      if(!r.ok) return r.json().catch(function(){return {};}).then(function(e){ throw new Error((e && e.message) || ("HTTP " + r.status)); });
      return r.json();
    });
  }

  /* ---------------- view switching ---------------- */
  function show(id){
    ["viewGate","viewConnect","viewEditor"].forEach(function(v){
      document.getElementById(v).hidden = (v !== id);
    });
  }
  function setTopbarStatus(text){ document.getElementById("topbarStatus").textContent = text || ""; }

  /* ---------------- gate ---------------- */
  document.getElementById("gateForm").addEventListener("submit", function(e){
    e.preventDefault();
    var val = document.getElementById("gatePass").value;
    var err = document.getElementById("gateError");
    if(val === GATE_PASS){
      sessionStorage.setItem(GATE_KEY, "1");
      err.textContent = "";
      goConnect();
    } else {
      err.textContent = "Phrase de passage incorrecte.";
    }
  });

  function goConnect(){
    prefillConnectForm();
    show("viewConnect");
  }

  function prefillConnectForm(){
    try{
      var saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if(saved){
        document.getElementById("cfgOwner").value = saved.owner || "";
        document.getElementById("cfgRepo").value = saved.repo || "";
        document.getElementById("cfgBranch").value = saved.branch || "main";
        document.getElementById("cfgRemember").checked = true;
      }
    }catch(e){}
  }

  /* ---------------- connect & load content ---------------- */
  document.getElementById("connectForm").addEventListener("submit", function(e){
    e.preventDefault();
    var err = document.getElementById("connectError");
    err.textContent = "";
    state.owner = document.getElementById("cfgOwner").value.trim();
    state.repo = document.getElementById("cfgRepo").value.trim();
    state.branch = document.getElementById("cfgBranch").value.trim() || "main";
    state.token = document.getElementById("cfgToken").value.trim();

    if(document.getElementById("cfgRemember").checked){
      localStorage.setItem(LS_KEY, JSON.stringify({ owner: state.owner, repo: state.repo, branch: state.branch }));
    } else {
      localStorage.removeItem(LS_KEY);
    }

    var btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Connexion en cours…";

    ghGetFile(CONTENT_PATH).then(function(res){
      state.sha = res.sha;
      state.content = JSON.parse(b64DecodeUnicode(res.content));
      state.fileShas = {};
      setTopbarStatus(state.owner + "/" + state.repo + " (" + state.branch + ")");
      document.getElementById("editorRepoLabel").textContent = state.owner + "/" + state.repo;
      renderEditor();
      show("viewEditor");
    }).catch(function(ex){
      err.textContent = "Échec de connexion : " + ex.message + " (vérifiez le nom du dépôt, la branche et les droits du jeton).";
    }).finally(function(){
      btn.disabled = false; btn.textContent = "Se connecter et charger le contenu";
    });
  });

  document.getElementById("btnDisconnect").addEventListener("click", function(){
    state.token = "";
    state.content = null;
    state.sha = null;
    show("viewConnect");
    setTopbarStatus("");
  });

  /* ---------------- generic field builders ---------------- */
  function el(tag, cls){ var e = document.createElement(tag); if(cls) e.className = cls; return e; }

  function fieldGroup(labelText, inputEl){
    var wrap = el("div", "admin-field-group");
    var label = el("label"); label.textContent = labelText;
    wrap.appendChild(label); wrap.appendChild(inputEl);
    return wrap;
  }

  function textInput(value, onInput, placeholder){
    var input = el("input"); input.type = "text"; input.value = value || "";
    if(placeholder) input.placeholder = placeholder;
    input.addEventListener("input", function(){ onInput(input.value); });
    return input;
  }

  function textArea(value, onInput, rows){
    var ta = el("textarea"); ta.rows = rows || 3; ta.value = value || "";
    ta.addEventListener("input", function(){ onInput(ta.value); });
    return ta;
  }

  function numberInput(value, onInput){
    var input = el("input"); input.type = "number"; input.min = 0; input.max = 100; input.value = value || 0;
    input.addEventListener("input", function(){ onInput(Number(input.value)); });
    return input;
  }

  function bilingualField(labelText, obj, multilineRows){
    var wrap = el("div", "admin-field-group");
    var label = el("label"); label.textContent = labelText;
    wrap.appendChild(label);
    var grid = el("div", "admin-bilingual");
    ["fr","en"].forEach(function(lang){
      var col = el("div");
      var tag = el("span", "lang-tag"); tag.textContent = lang.toUpperCase();
      col.appendChild(tag);
      var input = multilineRows ? textArea(obj[lang], function(v){ obj[lang] = v; }, multilineRows)
                                 : textInput(obj[lang], function(v){ obj[lang] = v; });
      col.appendChild(input);
      grid.appendChild(col);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function bilingualLinesField(labelText, obj){
    var wrap = el("div", "admin-field-group");
    var label = el("label"); label.textContent = labelText + " (une ligne par élément)";
    wrap.appendChild(label);
    var grid = el("div", "admin-bilingual");
    ["fr","en"].forEach(function(lang){
      var col = el("div");
      var tag = el("span", "lang-tag"); tag.textContent = lang.toUpperCase();
      col.appendChild(tag);
      var ta = textArea((obj[lang]||[]).join("\n"), function(v){
        obj[lang] = v.split("\n").map(function(s){ return s.trim(); }).filter(Boolean);
      }, 4);
      col.appendChild(ta);
      grid.appendChild(col);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function csvField(labelText, holder, key){
    var input = textInput((holder[key]||[]).join(", "), function(v){
      holder[key] = v.split(",").map(function(s){ return s.trim(); }).filter(Boolean);
    });
    return fieldGroup(labelText, input);
  }

  function repeaterItemShell(index, onRemove){
    var item = el("div", "admin-repeater-item");
    var idx = el("span", "admin-item-index"); idx.textContent = "#" + (index + 1);
    var removeBtn = el("button", "admin-remove"); removeBtn.type = "button"; removeBtn.textContent = "Supprimer";
    removeBtn.addEventListener("click", onRemove);
    item.appendChild(idx); item.appendChild(removeBtn);
    return item;
  }

  /* ---------------- panel renderers ---------------- */
  function renderProfile(){
    var c = document.getElementById("formProfile");
    c.innerHTML = "";
    var p = state.content.profile;
    c.appendChild(fieldGroup("Nom complet", textInput(p.name, function(v){ p.name = v; })));
    c.appendChild(bilingualField("Titre professionnel", p.title));
    c.appendChild(bilingualField("Phrase d'accroche (tagline)", p.tagline));
    c.appendChild(bilingualField("Résumé / profil professionnel", p.summary, 6));
    c.appendChild(fieldGroup("Localisation", textInput(p.location, function(v){ p.location = v; })));
    c.appendChild(fieldGroup("Téléphone", textInput(p.phone, function(v){ p.phone = v; })));
    c.appendChild(fieldGroup("Email", textInput(p.email, function(v){ p.email = v; })));
    c.appendChild(bilingualField("Bouton principal (CTA)", p.heroCtaPrimary));
    c.appendChild(bilingualField("Bouton secondaire (CTA)", p.heroCtaSecondary));

    var factsWrap = el("div");
    var factsLabel = el("h3"); factsLabel.textContent = "Points clés (hero)"; factsWrap.appendChild(factsLabel);
    (p.quickFacts||[]).forEach(function(f, i){
      var item = repeaterItemShell(i, function(){ p.quickFacts.splice(i,1); renderProfile(); });
      item.appendChild(fieldGroup("Icône (briefcase / graduation / map / globe)", textInput(f.icon, function(v){ f.icon = v; })));
      item.appendChild(bilingualField("Texte", f));
      factsWrap.appendChild(item);
    });
    var addBtn = el("button", "btn btn-outline btn-sm"); addBtn.type = "button"; addBtn.textContent = "+ Ajouter un point clé";
    addBtn.addEventListener("click", function(){
      p.quickFacts = p.quickFacts || [];
      p.quickFacts.push({ icon:"briefcase", fr:"", en:"" });
      renderProfile();
    });
    factsWrap.appendChild(addBtn);
    c.appendChild(factsWrap);
  }

  function renderSkills(){
    var c = document.getElementById("formSkills");
    c.innerHTML = "";
    (state.content.skills||[]).forEach(function(g, i){
      var item = repeaterItemShell(i, function(){ state.content.skills.splice(i,1); renderSkills(); });
      item.appendChild(bilingualField("Nom du groupe", g.group));
      item.appendChild(csvField("Compétences (séparées par des virgules)", g, "items"));
      c.appendChild(item);
    });
  }

  function renderExperience(){
    var c = document.getElementById("formExperience");
    c.innerHTML = "";
    (state.content.experience||[]).forEach(function(x, i){
      var item = repeaterItemShell(i, function(){ state.content.experience.splice(i,1); renderExperience(); });
      item.appendChild(bilingualField("Intitulé du poste", x.role));
      item.appendChild(fieldGroup("Organisation", textInput(x.org, function(v){ x.org = v; })));
      item.appendChild(bilingualField("Période", x.period));
      item.appendChild(bilingualLinesField("Missions / réalisations", x.bullets));
      c.appendChild(item);
    });
  }

  function renderEducation(){
    var c = document.getElementById("formEducation");
    c.innerHTML = "";
    (state.content.education||[]).forEach(function(x, i){
      var item = repeaterItemShell(i, function(){ state.content.education.splice(i,1); renderEducation(); });
      item.appendChild(bilingualField("Diplôme", x.degree));
      item.appendChild(fieldGroup("Établissement", textInput(x.org, function(v){ x.org = v; })));
      item.appendChild(fieldGroup("Année", textInput(x.year, function(v){ x.year = v; })));
      c.appendChild(item);
    });
  }

  function renderCertifications(){
    var c = document.getElementById("formCertifications");
    c.innerHTML = "";
    (state.content.certifications||[]).forEach(function(x, i){
      var item = repeaterItemShell(i, function(){ state.content.certifications.splice(i,1); renderCertifications(); });
      item.appendChild(bilingualField("Certification", x, 2));
      c.appendChild(item);
    });
  }

  function renderLanguages(){
    var c = document.getElementById("formLanguages");
    c.innerHTML = "";
    (state.content.languages||[]).forEach(function(x, i){
      var item = repeaterItemShell(i, function(){ state.content.languages.splice(i,1); renderLanguages(); });
      item.appendChild(bilingualField("Langue", x.name));
      item.appendChild(bilingualField("Niveau", x.level));
      item.appendChild(fieldGroup("Maîtrise (%)", numberInput(x.pct, function(v){ x.pct = v; })));
      c.appendChild(item);
    });
  }

  function renderProjects(){
    var c = document.getElementById("formProjects");
    c.innerHTML = "";
    (state.content.projects||[]).forEach(function(x, i){
      var item = repeaterItemShell(i, function(){ state.content.projects.splice(i,1); renderProjects(); });
      item.appendChild(fieldGroup("Identifiant technique (id)", textInput(x.id, function(v){ x.id = v; })));
      item.appendChild(bilingualField("Titre du projet", x.title));
      item.appendChild(fieldGroup("Période", textInput(x.period, function(v){ x.period = v; })));
      item.appendChild(csvField("Outils utilisés (séparés par des virgules)", x, "tools"));
      item.appendChild(bilingualField("Description", x.description, 4));
      item.appendChild(bilingualLinesField("Points clés / résultats", x.highlights));
      item.appendChild(fieldGroup("Chemin du fichier téléchargeable", textInput(x.file, function(v){ x.file = v; })));

      var chartWrap = el("div", "admin-field-group");
      var chartLabel = el("label"); chartLabel.textContent = "Données du graphique (JSON avancé)";
      var chartErr = el("p", "admin-error");
      var chartTa = el("textarea"); chartTa.rows = 8; chartTa.style.fontFamily = "monospace"; chartTa.style.fontSize = ".8rem";
      chartTa.value = JSON.stringify(x.chart, null, 2);
      chartTa.addEventListener("input", function(){
        try{ x.chart = JSON.parse(chartTa.value); chartErr.textContent = ""; }
        catch(ex){ chartErr.textContent = "JSON invalide : " + ex.message; }
      });
      chartWrap.appendChild(chartLabel); chartWrap.appendChild(chartTa); chartWrap.appendChild(chartErr);
      item.appendChild(chartWrap);

      c.appendChild(item);
    });
  }

  function renderContact(){
    var c = document.getElementById("formContact");
    c.innerHTML = "";
    var ct = state.content.contact;
    c.appendChild(fieldGroup("URL du formulaire Formspree", textInput(ct.formspreeEndpoint, function(v){ ct.formspreeEndpoint = v; }, "https://formspree.io/f/xxxxxxx")));
    c.appendChild(fieldGroup("Numéro WhatsApp (format international sans +)", textInput(ct.whatsapp, function(v){ ct.whatsapp = v; })));
    c.appendChild(bilingualField("Titre de la section contact", ct.sectionTitle));
    c.appendChild(bilingualField("Sous-titre de la section contact", ct.sectionSubtitle, 2));
  }

  var FILE_TARGETS = [
    { key:"photoHero", label:"Photo de profil (hero)", getPath:function(){ return state.content.profile.photoHero; } },
    { key:"photoAbout", label:"Photo section « À propos »", getPath:function(){ return state.content.profile.photoAbout; } },
    { key:"cvFile", label:"CV téléchargeable (PDF)", getPath:function(){ return state.content.profile.cvFile; } }
  ];

  function renderFiles(){
    var c = document.getElementById("formFiles");
    c.innerHTML = "";
    FILE_TARGETS.forEach(function(target){
      var path = target.getPath();
      var row = el("div", "admin-file-row");
      if(/\.(jpg|jpeg|png|webp)$/i.test(path)){
        var img = el("img"); img.src = "../" + path + "?_=" + Date.now(); row.appendChild(img);
      }
      var meta = el("div", "file-meta");
      var strong = el("strong"); strong.textContent = target.label;
      var span = el("span"); span.textContent = path;
      meta.appendChild(strong); meta.appendChild(span);
      row.appendChild(meta);

      var input = el("input"); input.type = "file";
      row.appendChild(input);

      var btn = el("button", "btn btn-primary btn-sm"); btn.type = "button"; btn.textContent = "Publier";
      var status = el("span", "admin-hint-inline");
      btn.addEventListener("click", function(){
        var file = input.files && input.files[0];
        if(!file){ status.textContent = "Choisissez un fichier d'abord."; return; }
        btn.disabled = true; status.textContent = "Envoi en cours…";
        var reader = new FileReader();
        reader.onload = function(){
          var base64 = reader.result.split(",")[1];
          ghGetFile(path).then(function(res){
            return ghPutFile(path, base64, res.sha, "Mise à jour : " + target.label + " (via espace admin)");
          }).catch(function(){
            // file might not exist yet at that sha, try without sha
            return ghPutFile(path, base64, null, "Ajout : " + target.label + " (via espace admin)");
          }).then(function(){
            status.textContent = "Publié ✓ (le site sera à jour dans ~1 minute)";
          }).catch(function(ex){
            status.textContent = "Erreur : " + ex.message;
          }).finally(function(){ btn.disabled = false; });
        };
        reader.readAsDataURL(file);
      });

      row.appendChild(btn); row.appendChild(status);
      c.appendChild(row);
    });
  }

  function renderEditor(){
    renderProfile();
    renderSkills();
    renderExperience();
    renderEducation();
    renderCertifications();
    renderLanguages();
    renderProjects();
    renderContact();
    renderFiles();
  }

  /* ---------------- add buttons (delegation) ---------------- */
  document.querySelectorAll("[data-add]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var section = btn.getAttribute("data-add");
      var c = state.content;
      switch(section){
        case "skills":
          c.skills.push({ group:{fr:"Nouveau groupe",en:"New group"}, items:[] });
          renderSkills(); break;
        case "experience":
          c.experience.push({ role:{fr:"",en:""}, org:"", period:{fr:"",en:""}, bullets:{fr:[],en:[]} });
          renderExperience(); break;
        case "education":
          c.education.push({ degree:{fr:"",en:""}, org:"", year:"" });
          renderEducation(); break;
        case "certifications":
          c.certifications.push({ fr:"", en:"" });
          renderCertifications(); break;
        case "languages":
          c.languages.push({ name:{fr:"",en:""}, level:{fr:"",en:""}, pct:50 });
          renderLanguages(); break;
        case "projects":
          c.projects.push({
            id:"nouveau-projet", title:{fr:"Nouveau projet",en:"New project"}, period:"",
            tools:[], description:{fr:"",en:""}, highlights:{fr:[],en:[]},
            chart:{ type:"mixed", categories:[], byCategory:[], months:[], monthsEn:[], byMonth:[] },
            file:""
          });
          renderProjects(); break;
      }
    });
  });

  /* ---------------- save ---------------- */
  document.getElementById("btnSave").addEventListener("click", function(){
    var status = document.getElementById("saveStatus");
    status.className = "admin-save-status pending";
    status.textContent = "Enregistrement en cours…";
    var json = JSON.stringify(state.content, null, 2);
    var b64 = b64EncodeUnicode(json);
    ghPutFile(CONTENT_PATH, b64, state.sha, "Mise à jour du contenu du site (espace admin)").then(function(res){
      state.sha = res.content.sha;
      status.className = "admin-save-status ok";
      status.textContent = "Publié avec succès ✓ — le site public sera à jour dans environ 1 minute (redéploiement Vercel automatique).";
    }).catch(function(ex){
      status.className = "admin-save-status err";
      status.textContent = "Erreur lors de l'enregistrement : " + ex.message;
    });
  });

  /* ---------------- init ---------------- */
  if(sessionStorage.getItem(GATE_KEY) === "1"){
    goConnect();
  } else {
    show("viewGate");
  }
})();
