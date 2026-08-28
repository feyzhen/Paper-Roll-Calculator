**[中文文档](README.zh-CN.md)**

# Paper Roll Calculator

A lightweight web tool for calculating specialty paper roll diameter, length, weight and theoretical winding layers.

---

## Features

- **Bidirectional calculation** — calculate OD from known length, or length from known OD
- **Flexible parameters** — customizable core ID, paper thickness, roll width and GSM
- **Real-time results** — instant calculation as you type, no submit needed
- **Cross-section diagrams** — auto-generated cross-section and side view with dimension labels
- **OD reference table** — estimated length and weight at common outer diameters
- **Bilingual UI** — one-click English / Chinese toggle, preference saved automatically
- **State persistence** — all inputs and language preference saved in `localStorage`
- **Responsive layout** — works on desktop, tablet and mobile screens

## Usage

Open `index.html` directly in a browser — no installation or build step required.

```bash
# Or start any static file server
python -m http.server 8080
# Visit http://localhost:8080
```

## Calculation Modes

| Mode | Description |
|------|-------------|
| Known length → calculate OD | Enter roll length to calculate the wound outer diameter |
| Known OD → calculate length | Enter target outer diameter to calculate the corresponding roll length |

## Input Parameters

| Parameter | Unit | Default | Description |
|-----------|------|---------|-------------|
| Core ID | mm | 76 | Inner diameter of the paper core |
| Paper thickness | μm | 45 | Thickness of a single paper layer |
| Roll width | mm | 425 | Axial width of the roll |
| GSM | g/m² | 30 | Grams per square meter |
| Roll length | m | 10000 | Total unwound paper length |
| Roll OD | mm | 760.7 | Outer diameter after winding |

## Formulas

**OD (from length):**

$$OD = \sqrt{ID^2 + \frac{4 \times L \times t \times 1000}{\pi}}$$

**Length (from OD):**

$$L = \frac{\pi \times (OD^2 - ID^2)}{4 \times t \times 1000}$$

**Paper weight:**

$$W = L \times \frac{width}{1000} \times \frac{GSM}{1000} \quad (kg)$$

**Theoretical winding layers:**

$$Layers = \lfloor \frac{OD - ID}{2 \times t} \rfloor$$

> Where: ID = Core inner diameter (mm), OD = Roll outer diameter (mm), L = Length (m), t = Paper thickness (μm), GSM = Grammage (g/m²)

## Project Structure

```
Paper roll calculator/
├── index.html   # Page structure & i18n markup
├── style.css    # Styles & responsive layout
├── script.js    # Calculation logic, SVG rendering & translation system
└── README.md    # Project documentation
```

## Technical Notes

- **Pure front-end** — no framework dependencies, vanilla HTML / CSS / JavaScript
- **i18n approach** — `data-i18n` attributes + translation dictionary, extensible to more languages
- **Dynamic SVG** — cross-section and side view diagrams generated in real time, labels follow language toggle
- **State management** — form data and language preference persisted in `localStorage`, auto-restored on reload

## Disclaimer

- Calculated values are **theoretical**, based on an ideal winding model
- Weight **excludes** the paper core and packaging materials
- Actual production values may vary due to winding tension and paper compression

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

You are free to share and adapt this work, provided you give appropriate attribution and do not use it for commercial purposes. Derivative works must be licensed under the same terms.
