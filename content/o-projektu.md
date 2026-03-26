---
title: "O projektu"
description: "Kdo stojí za Nebrecime.cz a proč tento web vznikl."
---
<div class="about-hero">
  <p class="about-subtitle">Nebrecime.cz je studijní platforma pro studenty výtvarných oborů připravující se na maturitu.</p>
</div>

<div class="about-card">
  <h2>Proč to vzniklo?</h2>
  <p>Studijní materiály na maturitu bývají roztroušené po Google Docs, Drive a různých PDF. Cíl tohoto webu je jednoduchý — dát vše na jedno místo, přehledně a rychle dostupné.</p>
  <p>Každé téma v sekci <strong>DVK</strong> (Dějiny výtvarné kultury) a <strong>VMA</strong> (Výtvarná maturitní analýza) obsahuje zápisky, audio výklad a interaktivní kvíz pro procvičení.</p>
</div>

<div class="about-card">
  <h2>Tvůrci</h2>
  <div class="about-team">
    <div class="about-person">
      <span class="about-name">Vladimír Urík</span>
      <span class="about-role">Vývoj webu, správa platformy, úprava VMA (pro rok 2025/2026), tvorba kvízů</span>
    </div>
    <div class="about-person">
      <span class="about-name">Daniel Machalicek</span>
      <span class="about-role">Zápisky DVK &amp; VMA, audio výklady</span>
    </div>
    <div class="about-person">
      <span class="about-name">Libor</span>
      <span class="about-role">Audio výklady DVK</span>
    </div>
    <div class="about-person">
      <span class="about-name">Dejvi &amp; Hora Kubáček</span>
      <span class="about-role">Obsah VMA</span>
    </div>
  </div>
</div>

<div class="about-card">
  <h2>Technologie</h2>
  <p>Web je postavený na <strong>Hugo</strong> (statický generátor stránek), hostovaný přes GitHub Pages. Zdrojový kód je open-source.</p>
  <a href="https://github.com/Vladimir-Urik/nebrecime.cz" target="_blank" class="about-github-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
    GitHub repozitář
  </a>
</div>

<style>
.about-hero {
  margin-bottom: 0;
}
.about-hero h1 {
  margin-bottom: 0.3em;
}
.about-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 0.3em;
}
.about-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  padding: 1.5em 1.8em;
  margin-top: 1.2em;
}
.about-card h2 {
  margin-top: 0;
  margin-bottom: 0.6em;
  font-size: 1.1rem;
}
.about-card p {
  color: var(--text);
  margin-bottom: 0.5em;
}
.about-card p:last-child { margin-bottom: 0; }
.about-team {
  display: grid;
  gap: 0.75em;
  margin-top: 0;
}
.about-person {
  display: flex;
  align-items: baseline;
  gap: 0.7em;
  flex-wrap: wrap;
}
.about-name {
  font-weight: 700;
  font-size: 0.95rem;
}
.about-role {
  font-size: 0.82rem;
  color: var(--text-muted);
}
.about-github-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 1em;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: var(--border-radius-pill);
  color: var(--text) !important;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.45em 1.1em;
  text-decoration: none !important;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.about-github-btn:hover {
  background: linear-gradient(135deg, var(--btn-from), var(--btn-to));
  color: #fff !important;
  border-color: transparent;
}
</style>
