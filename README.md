# 🎰 Pixi Slots — Interactive Slot Machine Prototype (PixiJS 7)

A polished, physics-based slot machine prototype built with **PixiJS v7**, **TypeScript**, and **GSAP**.  
This project is designed as a **non-gambling frontend animation demo** for portfolio, HR showcases, and iGaming-related test tasks.  
It contains **no real-money logic**, **no payouts**, and **no gambling functionality**.

---

## 📋 Overview

Pixi Slots demonstrates:

- Smooth, staggered reel animations  
- Full asset loading pipeline  
- Scene architecture (BootScene → SlotScene)  
- Reusable UI components (buttons, modal)  
- Bet system with adjustable stake  
- Mock win logic (demo-only)  
- Responsive canvas scaling for mobile & desktop  
- Clean OOP structure and 60fps-friendly rendering  

This prototype is fully safe for public use and does **not** violate global gambling-related restrictions.

---

## ✨ Features

### 🎞️ Reel Animation
- 3 reels × 3 visible rows  
- Each reel spins independently with delays  
- GSAP-driven animation for natural reel motion  
- Final results applied at the end  

### 🔊 Sound Effects
- Spin sound with custom start offset (skips silence)  
- Win sound  
- First-spin sound fix for autoplay restrictions  
- Segment-based playback API  

### 💰 Bet System
- Balance display  
- Set bet modal  
- Adjustable stake  
- Win conditions:
  - Three identical symbols → big win  
  - Two identical symbols → small win  
  - No match → no win  

### 📱 Responsive Layout
- Canvas resizes to any screen  
- Perfect fit on mobile devices  
- Internal coordinate system: **900 × 1200**  

### 🧩 Architecture
- `Game` root class  
- `SceneManager`  
- `Scene` abstract class  
- `BootScene`, `SlotScene`  
- `Button` component  
- `BetModal` UI  
- `AssetLoader`  
- `SoundManager`  

### 🖼️ Assets
- 5 symbols  
- Spin + win sounds  
- Completely replaceable graphics  

---

## 🛠️ Tech Stack

- **PixiJS 7**
- **GSAP 3**
- **TypeScript**
- **Vite**
- HTML5 Canvas  

---

## 🎮 How It Works

### Animation Flow
1. Player presses **SPIN**  
2. Bet is deducted  
3. Reels start spinning:
   - Reel 1 starts immediately  
   - Reel 2 starts 120ms later  
   - Reel 3 starts 240ms later  
4. Each reel animates downward  
5. Reel stops one by one  
6. Final symbols appear  
7. Win/loss evaluated  
8. Balance updated  

### Win Logic
- **3 identical (middle row)** → bet × 5  
- **2 identical** → bet × 0.5  
- **Otherwise** → no win  

*(All randomness is illustrative — not gambling.)*

---

## 📁 Folder Structure
pixi-slots/
├── public/
│   └── assets/
│       ├── sfx/
│       │   ├── spin.mp3
│       │   └── win.mp3
│       └── symbols/
│           ├── sym1.png
│           ├── sym2.png
│           ├── sym3.png
│           ├── sym4.png
│           └── sym5.png
├── src/
│   ├── core/
│   │   ├── AssetLoader.ts
│   │   ├── Config.ts
│   │   ├── Game.ts
│   │   ├── Scene.ts
│   │   ├── SceneManager.ts
│   │   └── SoundManager.ts
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   └── SlotScene.ts
│   ├── ui/
│   │   ├── Button.ts
│   │   └── BetModal.ts
│   ├── main.ts
│   └── style.css
├── index.html
├── tsconfig.json
└── package.json

---

## 🚀 Installation & Running

### Install dependencies
```bash
npm install
Start development
npm run dev
Build for production
npm run build
Preview build
npm run preview
⚖️ Legal & Safety Notice

This project is a visual animation demo.
It contains:
	•	No real betting
	•	No RNG certification
	•	No payouts
	•	No money processing
	•	No gambling mechanics

All logic is fictional and exists solely for frontend demonstration.
This prototype is intended for educational and portfolio purposes only and complies with global non-gambling presentation guidelines.

👨‍💻 Author
Yurii
Frontend Developer
@lytvynenkoy
