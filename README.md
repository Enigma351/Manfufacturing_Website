# Madhur Govind Textiles — The White Fabric Specialist

Official digital storefront and product showcase for **Madhur Govind Textiles**, leading manufacturers and specialists in premium white shirting, suiting, and institutional uniform fabrics based in Mumbai and Bhiwandi, India.

---

## ✨ Features & Highlights

- **Bespoke Product Showcase**: Interactive catalogs for premium Shirting (Dobby, Poplin, Oxford, Linen, Satin, Stretch) and Suiting (Poly-Viscose, Terry Rayon, Cotton, Linen, Stretch) with specification tabs, weave patterns, and yarn counts.
- **Interactive Manufacturing Process Modals**: Step-by-step interactive breakdown of yarn procurement, warping, weaving, chemical finishing, and multi-point quality inspection.
- **Instant Inquiry System**: Direct-to-WhatsApp sample inquiry routing with pre-filled order specifications and custom fabric requirements.
- **Cinematic Visual Experience**:
  - Inertia-based smooth scrolling powered by **Lenis**.
  - Hardware-accelerated typography and section transitions via **GSAP** & **ScrollTrigger**.
  - Dynamic 3D card tilt interactions and micro-animations.
  - Zero-lag WebP image asset pipeline (over 90% asset compression).
- **Production-Ready & Accessible**:
  - Full WCAG 2.1 compliance (accessible modal dialogs, focus trapping, semantic HTML5 structure).
  - Search Engine Optimization (SEO) complete with Open Graph previews, Twitter Cards, `robots.txt`, `sitemap.xml`, and Google `LocalBusiness` JSON-LD structured schema.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Smooth Scroll** | [@studio-freight/lenis](https://github.com/darkroomengineering/lenis) |
| **Motion & FX** | [GSAP 3](https://greensock.com/gsap/) (ScrollTrigger, Custom Easing) |
| **Styling** | Custom Vanilla CSS (Design system with fluid typography and CSS variables) |
| **Icons** | Custom lightweight SVGs |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Enigma351/Manfufacturing_Website.git
   cd Manfufacturing_Website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173`.

---

## 📦 Building for Production

To create an optimized, type-checked production bundle:

```bash
npm run build
```

The output will be generated inside the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```text
Manufacturing_Website/
├── public/
│   ├── images/          # High-resolution compressed WebP product & process assets
│   ├── favicon.svg      # SVG favicon
│   ├── robots.txt       # Search engine crawler directives
│   └── sitemap.xml      # XML Sitemap
├── src/
│   ├── components/      # Reusable UI components (InteractiveModals, etc.)
│   ├── data/            # Centralized site copy, specs, and contact information
│   ├── hooks/           # Custom animation and GSAP interaction hooks
│   ├── styles/          # Vanilla CSS design system, typography, and responsive rules
│   ├── App.tsx          # Main single-page application layout and sections
│   └── main.tsx         # Entry point with Lenis smooth scroll initialization
├── index.html           # HTML template with SEO & LocalBusiness JSON-LD schema
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 🏢 Business Inquiries

**Madhur Govind Textiles**  
- **Office**: Kalbadevi, Mumbai, Maharashtra 400002, India  
- **Mill Facilities**: Bhiwandi & Mumbai Industrial Zones  
- **Direct Contact**: +91 75061 36851  
- **Email**: inquiry@madhurgovindtextiles.com  

---

## 📄 License

Private & Proprietary © Madhur Govind Textiles. All rights reserved.
