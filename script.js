(() => {
  const $ = (id) => document.getElementById(id);
  const stateKey = "paper-roll-calculator-state-v2";
  const langKey = "paper-roll-calculator-lang";
  const inputs = ["core-id", "thickness", "width", "gsm", "length", "od"];
  const n = (id) => Number.parseFloat($(id).value);
  const fmt = (value, digits = 1) => new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

  const i18n = {
    en: {
      title: "Paper Roll Calculator",
      eyebrow: "SPECIALTY PAPER TOOLS",
      heading: "Paper Roll Calculator",
      subheading: "Calculate roll diameter, length, weight and theoretical winding layers.",
      input_title: "Roll parameters",
      input_desc: "Enter the paper and core specifications.",
      mode_legend: "Calculation mode",
      mode_length: "Known length → calculate OD",
      mode_od: "Known OD → calculate length",
      f_core_id: "Core ID",
      f_thickness: "Paper thickness",
      f_width: "Roll width",
      f_gsm: "GSM",
      f_length: "Roll length",
      f_od: "Roll OD",
      btn_calc: "Calculate",
      btn_reset: "Reset",
      result_title: "Calculated results",
      result_desc: "Theoretical values based on your inputs.",
      r_od: "Roll OD",
      r_length: "Roll length",
      r_weight: "Paper weight",
      r_layers: "Theoretical layers",
      result_note: "Weight excludes the paper core and packaging. Actual production values can vary with winding tension and paper compression.",
      visual_title: "Roll cross-section",
      visual_desc: "Schematic view only; dimensions update with your current calculation.",
      legend_paper: "Paper Roll",
      legend_core: "Paper Core",
      fig_cross: "Cross section",
      fig_side: "Side view",
      compare_title: "OD reference",
      compare_desc: "Estimated length and paper weight at common outer diameters.",
      th_od: "Roll OD",
      th_length: "Estimated length",
      th_weight: "Estimated paper weight",
      svg_roll_od: "ROLL OD",
      svg_roll_width: "ROLL WIDTH",
      svg_kraft_paper: "PAPER CORE",
      svg_core_id: "CORE ID",
      svg_od_half: "OD/2",
      svg_id_half: "ID/2",
      spec_core_id: "Core ID",
      spec_roll_od: "Roll OD",
      spec_thickness: "Thickness",
      spec_roll_width: "Roll width",
      spec_roll_length: "Roll length",
      spec_gsm: "GSM",
      err_positive: "Please enter positive values for all roll parameters.",
      err_length: "Please enter a positive roll length.",
      err_od: "Roll OD must be larger than the core ID.",
      lang_label: "中文",
      footer_copy: "\u00a9 2026 Paper Roll Calculator",
      footer_linkedin: "LinkedIn",
      footer_email: "Email",
    },
    zh: {
      title: "纸卷计算器",
      eyebrow: "特种纸工具",
      heading: "纸卷计算器",
      subheading: "计算纸卷外径、长度、重量及理论卷绕层数。",
      input_title: "纸卷参数",
      input_desc: "输入纸张和纸芯规格。",
      mode_legend: "计算模式",
      mode_length: "已知长度 → 计算外径",
      mode_od: "已知外径 → 计算长度",
      f_core_id: "纸芯内径",
      f_thickness: "纸张厚度",
      f_width: "纸卷宽度",
      f_gsm: "克重",
      f_length: "纸卷长度",
      f_od: "纸卷外径",
      btn_calc: "计算",
      btn_reset: "重置",
      result_title: "计算结果",
      result_desc: "基于输入参数的理论值。",
      r_od: "纸卷外径",
      r_length: "纸卷长度",
      r_weight: "纸张重量",
      r_layers: "理论层数",
      result_note: "重量不含纸芯和包装。实际生产值会因卷绕张力和纸张压缩而有所不同。",
      visual_title: "纸卷截面",
      visual_desc: "仅为示意图；尺寸随当前计算结果更新。",
      legend_paper: "牛皮纸",
      legend_core: "白纸芯",
      fig_cross: "截面图",
      fig_side: "侧视图",
      compare_title: "外径参考",
      compare_desc: "常见外径对应的估算长度和纸张重量。",
      th_od: "纸卷外径",
      th_length: "估算长度",
      th_weight: "估算纸张重量",
      svg_roll_od: "纸卷外径",
      svg_roll_width: "纸卷宽度",
      svg_kraft_paper: "纸卷纸芯",
      svg_core_id: "纸芯内径",
      svg_od_half: "外径/2",
      svg_id_half: "内径/2",
      spec_core_id: "纸芯内径",
      spec_roll_od: "纸卷外径",
      spec_thickness: "厚度",
      spec_roll_width: "纸卷宽度",
      spec_roll_length: "纸卷长度",
      spec_gsm: "克重",
      err_positive: "请输入所有纸卷参数的正值。",
      err_length: "请输入正的纸卷长度。",
      err_od: "纸卷外径必须大于纸芯内径。",
      lang_label: "EN",
      footer_copy: "\u00a9 2026 \u7eb8\u5377\u8ba1\u7b97\u5668",
      footer_linkedin: "LinkedIn",
      footer_email: "\u90ae\u7bb1",
    },
  };

  let lang = localStorage.getItem(langKey) || "en";
  const t = (key) => (i18n[lang] || i18n.en)[key] || key;

  function applyI18n() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    $("lang-toggle").textContent = t("lang_label");
  }

  function calcOD(lengthM, coreId, thicknessUm) { return Math.sqrt(coreId ** 2 + (4 * lengthM * (thicknessUm / 1000) * 1000) / Math.PI); }
  function calcLength(od, coreId, thicknessUm) { return (Math.PI * (od ** 2 - coreId ** 2)) / (4 * (thicknessUm / 1000) * 1000); }
  function calcWeight(lengthM, widthMm, gsm) { return lengthM * (widthMm / 1000) * gsm / 1000; }
  function calcLayers(od, coreId, thicknessUm) { return Math.floor((od - coreId) / 2 / (thicknessUm / 1000)); }
  function mode() { return document.querySelector('input[name="mode"]:checked').value; }

  function dimensionsSvg(od, coreId, width, length) {
    const max = Math.max(od, width, 1);
    const rollR = Math.max(78, Math.min(118, (od / max) * 112));
    const coreR = Math.max(12, rollR * coreId / od);
    const bodyW = Math.max(135, Math.min(240, (width / max) * 220));
    const cx = 164, cy = 137, x2 = cx + bodyW;
    const paperLines = Array.from({ length: 7 }, (_, i) => `<ellipse cx="${cx + bodyW * .48}" cy="${cy}" rx="${rollR - 7 - i * 4}" ry="${rollR - 10 - i * 4}" fill="none" stroke="#a66f3a" stroke-opacity="${.25 - i * .02}" stroke-width="1"/>`).join("");
    return `<svg viewBox="0 0 420 300" role="img" aria-label="Side view of paper roll with dimensions">
      <defs><linearGradient id="kraft-side" x1="0" x2="1"><stop stop-color="#8d572b"/><stop offset=".18" stop-color="#d6a466"/><stop offset=".56" stop-color="#be8041"/><stop offset="1" stop-color="#8a5228"/></linearGradient><linearGradient id="core-side" x1="0" x2="1"><stop stop-color="#fdfcf9"/><stop offset=".48" stop-color="#e4e3dd"/><stop offset="1" stop-color="#fbfaf7"/></linearGradient><marker id="arrow-side" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#48515c"/></marker><marker id="arrow-red" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#b23434"/></marker></defs>
      <rect x="${cx}" y="${cy-rollR}" width="${bodyW}" height="${rollR*2}" rx="4" fill="url(#kraft-side)"/>
      ${paperLines}
      <ellipse cx="${x2}" cy="${cy}" rx="${rollR*.22}" ry="${rollR}" fill="#9a6434" opacity=".78"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rollR*.23}" ry="${rollR}" fill="#d8ac73" stroke="#805127" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${coreR*.25}" ry="${coreR}" fill="url(#core-side)" stroke="#655345" stroke-width="1.5"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${Math.max(4,coreR*.12)}" ry="${Math.max(11,coreR*.48)}" fill="#3d342d"/>
      <rect x="${cx-3}" y="${cy-6}" width="${bodyW+6}" height="12" rx="3" fill="#e9ecee" stroke="#73808b" stroke-width="1.5"/>
      <g fill="none" stroke="#48515c" stroke-width="1.2" marker-start="url(#arrow-side)" marker-end="url(#arrow-side)"><path d="M86 ${cy-rollR} V${cy+rollR}"/></g>
      <g fill="none" stroke="#b23434" stroke-width="1.1" marker-start="url(#arrow-red)" marker-end="url(#arrow-red)"><path d="M${cx+4} ${cy-rollR-15} H${x2-4}"/></g>
      <g stroke="#48515c" stroke-width="1" stroke-dasharray="3 3"><path d="M92 ${cy-rollR} H${cx-8}"/><path d="M92 ${cy+rollR} H${cx-8}"/></g>
      <g fill="#1f2933" font-family="system-ui, sans-serif" font-size="11" font-weight="700"><text x="17" y="${cy-5}">${t("svg_roll_od")}</text><text x="17" y="${cy+11}">${fmt(od)} mm</text><text x="${(cx+x2)/2}" y="${cy-rollR-23}" text-anchor="middle" fill="#b23434">${t("svg_roll_width")} · ${fmt(width)} mm</text><text x="${(cx+x2)/2}" y="${cy+3}" text-anchor="middle" font-size="8" fill="#3a454e">${t("svg_kraft_paper")}</text><text x="${(cx+x2)/2}" y="286" text-anchor="middle"> </text><text x="${cx+12}" y="${cy-coreR-15}">${t("svg_core_id")} · ${fmt(coreId)} mm</text></g>
    </svg>`;
  }
  function crossSectionSvg(od, coreId) {
    const cx=210, cy=150, R=103, r=Math.max(18,R*coreId/od), rings=Array.from({length:13},(_,i)=>`<circle cx="${cx}" cy="${cy}" r="${R-7-i*5.8}" fill="none" stroke="#f1cb98" stroke-opacity="${.65-i*.035}" stroke-width=".8"/>`).join("");
    return `<svg viewBox="0 0 420 300" role="img" aria-label="Kraft paper roll cross section with outside and core diameter dimensions"><defs><radialGradient id="kraft-cross"><stop stop-color="#e7c189"/><stop offset=".7" stop-color="#b77c40"/><stop offset="1" stop-color="#875024"/></radialGradient><marker id="arrow-cross" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#4b5563"/></marker><marker id="arrow-cross-red" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#b23434"/></marker></defs><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#kraft-cross)" stroke="#75461f" stroke-width="2"/>${rings}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffdf8" stroke="#9aa4ae" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${Math.max(6,r*.44)}" fill="#59636d"/><g fill="none" stroke="#4b5563" stroke-width="1.2" marker-start="url(#arrow-cross)" marker-end="url(#arrow-cross)"><path d="M66 47 V253"/><path d="M${cx} ${cy-r} V${cy+r}"/></g><g fill="none" stroke="#b23434" stroke-width="1.2" stroke-dasharray="6 5" marker-end="url(#arrow-cross-red)"><path d="M${cx} ${cy} H${cx+R-4}"/><path d="M${cx} ${cy+10} H${cx+r-2}"/></g><g stroke="#4b5563" stroke-width="1" stroke-dasharray="3 3"><path d="M73 47 H${cx-12}"/><path d="M73 253 H${cx-12}"/></g><g fill="#1f2933" font-family="system-ui, sans-serif" font-size="11" font-weight="700"><text x="${cx}" y="28" text-anchor="middle">${t("svg_roll_od")} · ${fmt(od)} mm</text><text x="13" y="143">${t("svg_roll_od")}</text><text x="13" y="159">${fmt(od)} mm</text><text x="${cx+R+10}" y="143">${t("svg_core_id")}</text><text x="${cx+R+10}" y="159">${fmt(coreId)} mm</text><text x="${cx+45}" y="143" fill="#b23434">${t("svg_od_half")}</text><text x="${cx+17}" y="${cy+26}" fill="#b23434">${t("svg_id_half")}</text></g></svg>`;
  }
  function renderVisuals(od, coreId, width, length) { $("cross-section").innerHTML=crossSectionSvg(od,coreId); $("side-view").innerHTML=dimensionsSvg(od,coreId,width,length); }
  function renderSpecs(od, coreId, thickness, width, length, gsm) {
    const specs = [[t("spec_core_id"), `${fmt(coreId)} mm`], [t("spec_roll_od"), `${fmt(od)} mm`], [t("spec_thickness"), `${fmt(thickness)} μm`], [t("spec_roll_width"), `${fmt(width)} mm`], [t("spec_roll_length"), `${fmt(length)} m`], [t("spec_gsm"), `${fmt(gsm)} g/m²`]];
    $("spec-summary").innerHTML = specs.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  }
  function renderTable(coreId, thickness, width, gsm) { $("comparison-body").innerHTML=[600,650,700,750,800].map(od=>{ const length=calcLength(od,coreId,thickness); const weight=calcWeight(length,width,gsm); return `<tr><td>${od} mm</td><td>${fmt(length,0)} m</td><td>${fmt(weight,1)} kg</td></tr>`; }).join(""); }
  function save() { const data={mode:mode()}; inputs.forEach(id=>data[id]=$(id).value); localStorage.setItem(stateKey,JSON.stringify(data)); }
  function calculate() {
    const coreId=n("core-id"), thickness=n("thickness"), width=n("width"), gsm=n("gsm"); let length=n("length"), od=n("od");
    const valid=[coreId,thickness,width,gsm].every(v=>Number.isFinite(v)&&v>0);
    if (!valid) { $("form-error").textContent=t("err_positive"); return; }
    if(mode()==="length") { if(!(length>0)) { $("form-error").textContent=t("err_length"); return; } od=calcOD(length,coreId,thickness); $("od").value=od.toFixed(1); }
    else { if(!(od>coreId)) { $("form-error").textContent=t("err_od"); return; } length=calcLength(od,coreId,thickness); $("length").value=length.toFixed(1); }
    $("form-error").textContent=""; $("result-od").textContent=`${fmt(od)} mm`; $("result-length").textContent=`${fmt(length)} m`; $("result-weight").textContent=`${fmt(calcWeight(length,width,gsm),2)} kg`; $("result-layers").textContent=calcLayers(od,coreId,thickness).toLocaleString(); renderVisuals(od,coreId,width,length); renderSpecs(od,coreId,thickness,width,length,gsm); renderTable(coreId,thickness,width,gsm); save();
  }
  function updateMode() { const byLength=mode()==="length"; $("length-field").classList.toggle("is-hidden",!byLength); $("od-field").classList.toggle("is-hidden",byLength); calculate(); }
  function restore() { try { const saved=JSON.parse(localStorage.getItem(stateKey)); if(!saved)return; inputs.forEach(id=>{if(saved[id]!=null)$(id).value=saved[id];}); const radio=document.querySelector(`input[name="mode"][value="${saved.mode}"]`); if(radio)radio.checked=true; } catch {} }

  applyI18n();
  restore();
  updateMode();

  $("lang-toggle").addEventListener("click", () => {
    lang = lang === "en" ? "zh" : "en";
    localStorage.setItem(langKey, lang);
    applyI18n();
    updateMode();
  });

  $("calculator-form").addEventListener("submit",e=>{e.preventDefault();calculate();});
  document.querySelectorAll('input[name="mode"]').forEach(x=>x.addEventListener("change",updateMode));
  inputs.forEach(id=>$(id).addEventListener("input",()=>{clearTimeout($(id)._timer);$(id)._timer=setTimeout(calculate,250);}));
  $("btn-reset").addEventListener("click",()=>{localStorage.removeItem(stateKey);inputs.forEach(id=>{clearTimeout($(id)._timer);});$("calculator-form").reset();$("core-id").value=76;$("thickness").value=45;$("width").value=425;$("gsm").value=30;$("length").value=10000;$("od").value=760.7;$("form-error").textContent="";updateMode();});
})();
