(() => {
  const $ = (id) => document.getElementById(id);
  const languageKey = "paper-roll-calculator-lang";
  const stateKey = "paper-weight-calculator-state-v2";
  const text = {
    zh: {
      eyebrow: "特种纸工具", heading: "纸张重量计算器", subheading: "根据克重与面积计算纸张重量，也可反向换算克重或面积。",
      input_title: "输入参数", input_desc: "选择要计算的项目，并填写另外两项。", mode_legend: "计算项目",
      mode_weight: "重量", mode_gsm: "克重", mode_area: "面积", f_gsm: "克重", f_area: "面积", f_weight: "纸张重量", f_length: "长度", f_width: "宽度",
      btn_calc: "计算", btn_reset: "重置", result_title: "换算结果", result_desc: "数值随输入自动更新。", r_gsm: "克重", r_area: "面积", r_weight: "纸张重量",
      result_note: "纸张重量仅为纸张本身的理论重量，不包含包装或其他材料。", formula_title: "计算公式", formula_desc: "面积可由纸张长度乘以宽度得到。",
      formula_gsm: "克重 (g/m²) = 重量 (g) ÷ 面积 (m²)", formula_weight: "重量 (g) = 克重 (g/m²) × 面积 (m²)", formula_area: "面积 (m²) = (长度 (mm) ÷ 1000) × (宽度 (mm) ÷ 1000)",
      footer: "纸张重量计算器 · 即开即用，无需安装", err_positive: "请输入大于零的有效数值。", language: "English"
    },
    en: {
      eyebrow: "SPECIALTY PAPER TOOLS", heading: "Paper Weight Calculator", subheading: "Calculate paper weight from GSM and area, or work backwards to find GSM or area.",
      input_title: "Input parameters", input_desc: "Choose what to calculate and enter the other required values.", mode_legend: "Calculate", mode_weight: "Weight", mode_gsm: "GSM", mode_area: "Area",
      f_gsm: "Grammage", f_area: "Area", f_weight: "Paper weight", f_length: "Length", f_width: "Width", btn_calc: "Calculate", btn_reset: "Reset", result_title: "Calculated results", result_desc: "Results update as you type.",
      r_gsm: "Grammage", r_area: "Area", r_weight: "Paper weight", result_note: "Theoretical paper weight only; excludes packaging and other materials.", formula_title: "Formula", formula_desc: "Area is the sheet length multiplied by its width.",
      formula_gsm: "GSM (g/m²) = Weight (g) ÷ Area (m²)", formula_weight: "Weight (g) = GSM (g/m²) × Area (m²)", formula_area: "Area (m²) = (Length (mm) ÷ 1000) × (Width (mm) ÷ 1000)",
      footer: "Paper Weight Calculator · Ready to use, no installation required", err_positive: "Enter valid values greater than zero.", language: "中文"
    }
  };
  let lang = localStorage.getItem(languageKey) || "zh";
  const mode = () => document.querySelector('input[name="mode"]:checked').value;
  const fmt = (value, digits = 3) => new Intl.NumberFormat(lang === "zh" ? "zh-CN" : "en", { maximumFractionDigits: digits }).format(value);
  function applyLanguage() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = text[lang][el.dataset.i18n]; });
    $("lang-toggle").textContent = text[lang].language;
    document.title = lang === "zh" ? "纸张重量计算器 | Paper Weight Calculator" : "Paper Weight Calculator";
  }
  function save() {
    localStorage.setItem(stateKey, JSON.stringify({ mode: mode(), gsm: $("gsm").value, length: $("length").value, width: $("width").value, weight: $("weight").value }));
  }
  function calculate() {
    const selected = mode();
    const gsm = Number($("gsm").value), length = Number($("length").value), width = Number($("width").value), weight = Number($("weight").value);
    const dimensionsVisible = selected !== "area";
    $("weight-field").classList.toggle("is-hidden", selected === "weight");
    $("gsm-field").classList.toggle("is-hidden", selected === "gsm");
    $("length-field").classList.toggle("is-hidden", !dimensionsVisible);
    $("width-field").classList.toggle("is-hidden", !dimensionsVisible);
    const area = dimensionsVisible ? (length / 1000) * (width / 1000) : NaN;
    const values = selected === "weight" ? [gsm, length, width] : selected === "gsm" ? [weight, length, width] : [weight, gsm];
    if (!values.every((value) => Number.isFinite(value) && value > 0)) {
      $("form-error").textContent = text[lang].err_positive;
      return;
    }
    $("form-error").textContent = "";
    const result = selected === "weight" ? { gsm, area, weight: gsm * area } : selected === "gsm" ? { gsm: weight / area, area, weight } : { gsm, area: weight / gsm, weight };
    $("result-gsm").textContent = `${fmt(result.gsm)} g/m²`;
    $("result-area").textContent = `${fmt(result.area, 6)} m²`;
    $("result-weight").textContent = `${fmt(result.weight)} g`;
    save();
  }
  try {
    const saved = JSON.parse(localStorage.getItem(stateKey));
    if (saved) {
      ["gsm", "length", "width", "weight"].forEach((id) => { if (saved[id] != null) $(id).value = saved[id]; });
      const radio = document.querySelector(`input[name="mode"][value="${saved.mode}"]`);
      if (radio) radio.checked = true;
    }
  } catch {}
  applyLanguage();
  calculate();
  $("weight-form").addEventListener("submit", (event) => { event.preventDefault(); calculate(); });
  document.querySelectorAll('input[name="mode"]').forEach((input) => input.addEventListener("change", calculate));
  ["gsm", "length", "width", "weight"].forEach((id) => $(id).addEventListener("input", calculate));
  $("lang-toggle").addEventListener("click", () => { lang = lang === "zh" ? "en" : "zh"; localStorage.setItem(languageKey, lang); applyLanguage(); calculate(); });
  $("btn-reset").addEventListener("click", () => {
    localStorage.removeItem(stateKey);
    $("gsm").value = 120; $("length").value = 1000; $("width").value = 1000; $("weight").value = 120;
    document.querySelector('input[name="mode"][value="weight"]').checked = true;
    calculate();
  });
})();
