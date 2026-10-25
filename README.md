# 🎰 WebGL Slot Engine

A high-performance, modular slot machine engine built from scratch using **PixiJS** for WebGL rendering and **GSAP** for advanced tweening. 

Designed with professional iGaming architectural patterns, this project features deterministic reel strips, continuous ticker-based physics, and a decoupled mathematical evaluation module that handles dynamic wildcard substitution.

## 🛠️ Tech Stack
* **Graphics & Rendering:** PixiJS (v8)
* **Animation & VFX:** GSAP
* **Architecture:** ES6 Modules, Component-based design
* **Build Tool:** Vite / NPM

## 🏗️ System Architecture

To ensure scalability and clean code, the engine is separated into distinct, single-responsibility modules:

* **State Controller (`main.js`):** Manages the core game loop (`IDLE`, `SPINNING`, `STOPPING`, `EVALUATING`) and delegates tasks to the sub-systems.
* **Physics Engine (`Physics.js`):** Hooks into the continuous PixiJS Ticker, managing modulo-based teleportation thresholds to create infinite spinning loops without memory leaks.
* **Math & Evaluation (`Evaluator.js`):** A pure function module decoupled from the visual layer. It receives a multi-dimensional array of grid data, dynamically resolves Wildcard (ID: 5) logic, and calculates streak multipliers.
* **Reel Factory (`Reel.js`):** Assembles container hierarchies, applies blur filters for motion simulation, and maps deterministic texture arrays (reel strips) to visual sprites.
* **UI Layer (`UI.js`):** Manages dynamic text rendering, drop shadows, and interactive state-based buttons.

## 🚀 Key Features
* **Deterministic Logic:** Results are driven by backend-style reel strip data maps, not raw RNG, mimicking real casino math models.
* **Dynamic Wildcards:** The evaluator actively updates targeting variables mid-loop if a winning streak starts with or encounters a Wild symbol.
* **Hardware Accelerated:** Uses WebGL batching and masking via PixiJS for buttery-smooth 60fps performance on the browser.
* **GSAP Easing:** Transitions continuous ticker momentum into grid-snapping `back.out` mechanical stops.

## 💻 Local Development

To run this project locally on your machine:

1. Clone the repository:
   ```bash
   git clone [https://github.com/YourUsername/your-repo-name.git](https://github.com/YourUsername/your-repo-name.git)

Install dependancies
  ```bash
   npm install


