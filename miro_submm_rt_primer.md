
---
layout: prompt
title: Reading MIRO: Continuum, Rotational Lines, and Why a Comet Needs Non-LTE
author: Jiheng Hu
date: 2026-08-01 08:00:00
tag:
- MIRO
- Comet
description: --
cover: assets/images/covers/canvas_storm.webp
importance: 11
banner: assets/images/covers/canvas_storm.webp
width: 4
aside: true
---

# Reading MIRO: Continuum, Rotational Lines, and Why a Comet Needs Non-LTE

*A background primer for anyone building a submillimeter radiative transfer or spectroscopy pipeline*

---

## 1. Why MIRO is an unusual instrument

Most planetary remote sensing instruments do one thing well. The Microwave Instrument for the Rosetta Orbiter (MIRO) does two things that sit at opposite ends of the radiative transfer problem, using the same 30 cm telescope:

- **Broadband continuum radiometry**, which senses *thermal emission from a solid surface and its subsurface*, and
- **High-resolution heterodyne spectroscopy**, which senses *rotational line emission from a tenuous, expanding, non-equilibrium gas*.

One is an optically thick, near-LTE, conduction-dominated problem. The other is optically thin-to-moderate, strongly non-LTE, and governed by velocity gradients. Getting both from one dataset is what makes MIRO such a good teaching instrument — and such a demanding one to model.

### Instrument at a glance

| Property | Millimeter | Submillimeter |
|---|---|---|
| Wavelength / band | 1.3 mm, 186.7–189.7 GHz | 0.5 mm, 547.6–579.2 GHz |
| Primary diameter | 30 cm | 30 cm |
| Beamwidth (FWHM) | 24 arcmin | 8 arcmin |
| Footprint at 10 km | ~75 m | ~25 m |
| Continuum bandwidth | 0.5 GHz | 1.0 GHz |
| Spectrometer (CTS) | — | 4096 channels × 44 kHz, 180 MHz total |
| DSB receiver noise | ~2000 K | ~4000 K |
| Continuum sensitivity (1 s) | 1 K rms relative, 3 K absolute | same |

Two design details matter enormously for modeling and are easy to overlook:

1. **The receivers are double-sideband (DSB).** Signal from both the upper and lower sideband lands in the same IF. Any forward model that predicts a single-sideband brightness must be folded through the sideband ratio before comparison with data.
2. **The chirp transform spectrometer uses local-oscillator frequency switching.** Two ~5 s sub-integrations at different LO settings are differenced to produce one 4096-channel spectrum. This removes standing waves and baseline drift, but it also means the "spectrum" you fit is a *difference* — the continuum level is deliberately subtracted out. That is why the continuum channels are the thing that carries the surface brightness, and the CTS carries the line.

Exactly 100 continuum samples are taken during each CTS scan, and the LO state of each sample is recoverable on the ground. This is the hook that lets you tie line and continuum measurements to the same geometry.

---

## 2. The continuum: thermal emission from a subsurface, not a surface

At 1.3 mm and 0.5 mm the nucleus is not a blackbody at the skin temperature. The measured brightness temperature is a weighted integral over the *electrical* penetration depth:

$$
T_B = \varepsilon \int_0^\infty T(z)\, e^{-z/\delta_e}\, \frac{dz}{\delta_e} \quad \text{(schematically)}
$$

where the electrical skin depth for a low-loss dielectric is

$$
\delta_e \simeq \frac{\lambda}{2\pi \sqrt{\varepsilon'}\,\tan\delta}.
$$

For porous cometary material with $\varepsilon' \sim 1.2$–$2$ and loss tangent $\tan\delta \sim 10^{-3}$–$10^{-2}$, $\delta_e$ lands somewhere between a few centimeters and a meter. The **two wavelengths therefore sample different depths**, and the pair $(T_B^{\rm mm}, T_B^{\rm submm})$ is a two-point sounding of the subsurface thermal gradient. That is the entire physical basis for MIRO's nucleus thermophysics: not "what is the surface temperature," but "what is $\partial T/\partial z$ in the top few skin depths, and what thermal inertia reproduces it."

Three effects that will bite a forward model:

- **Emissivity and roughness.** $\varepsilon < 1$ at these wavelengths, and it is angle-dependent. Sub-beam roughness on a bilobed, shadowed nucleus makes the effective emission angle distribution non-trivial.
- **Beam filling.** At 10 km the submm footprint is ~25 m, but the mm footprint is ~75 m; near the limb or on a small lobe the two beams are filled differently. Comparing them without a shape-model-based filling correction is the single most common error.
- **The sidelobe floor** (−30 dB) is not negligible when the beam is half on the nucleus and half on cold sky.

For a coma modeler, the continuum matters even if you only care about gas: **the nucleus is the background source against which absorption lines are seen.** Your line radiative transfer needs $T_B^{\rm cont}$ as a boundary condition whenever the line of sight terminates on the nucleus.

---

## 3. Rotational energy levels: why 500–580 GHz

A molecule with a permanent dipole moment $\mu$ has rotational levels that, for a linear rigid rotor, sit at

$$
E_J = h B\, J(J+1), \qquad \nu_{J \to J-1} = 2BJ,
$$

with selection rule $\Delta J = \pm 1$. Spontaneous emission scales brutally with frequency:

$$
A_{ul} = \frac{64\pi^4 \nu^3}{3hc^3}\, \frac{|\mu_{ul}|^2}{2J_u+1}.
$$

That $\nu^3$ is why submillimeter is the natural band for cometary volatiles: the transitions are strong, and the level energies ($E_u/k \sim$ 10–100 K) match the actual kinetic temperatures of a coma. Rotational constants set where the lines fall — CO has $B \approx 57.6$ GHz, so the $J{=}5{\to}4$ line lands at 576.268 GHz, comfortably inside MIRO's band.

Water is not a linear rotor. It is a **strongly asymmetric top**, labeled $J_{K_a K_c}$, and its level ladder is irregular. Its ground-state ortho transition $1_{10} \to 1_{01}$ at 556.936 GHz is the workhorse line: the upper level is only ~61 K above ground, so it is populated throughout the coma, and the line is enormously optically thick near the nucleus.

The MIRO submm band was chosen to hold, in a handful of narrow tunings:

| Species | Transition | Frequency (GHz) |
|---|---|---|
| H₂¹⁶O | $1_{10}\!-\!1_{01}$ | 556.936 |
| H₂¹⁸O | $1_{10}\!-\!1_{01}$ | 547.676 |
| H₂¹⁷O | $1_{10}\!-\!1_{01}$ | 552.021 |
| CH₃OH | series near | 553.1 |
| NH₃ | $J_K = 1_0\!-\!0_0$ | 572.498 |
| CO | $J = 5\!-\!4$ | 576.268 |

The isotopologues are the point of the band design. H₂¹⁶O saturates; H₂¹⁸O, ~500× rarer, stays optically thin and gives you the column density that the main line cannot. Any inversion that fits only the main line is fitting an opacity, not an abundance.

With 44 kHz channels at 557 GHz you get $\Delta v \approx 24$ m/s per channel — resolving a coma outflow of ~0.5–0.9 km/s across tens of channels. The line *shape* is data, not a nuisance: its Doppler shift gives the projected expansion velocity, its width gives the velocity distribution plus thermal broadening, and its asymmetry gives you day–night outgassing contrast.

---

## 4. Why the coma is non-LTE, and what LVG buys you

The level populations are LTE only if collisions dominate over radiative decay. Compare the critical density,

$$
n_{\rm crit} = \frac{A_{ul}}{\gamma_{ul}},
$$

with $A_{ul} \sim 3\times10^{-3}\ \mathrm{s^{-1}}$ for the 557 GHz water line and neutral collision rates $\gamma \sim 10^{-10}\ \mathrm{cm^3\,s^{-1}}$: $n_{\rm crit}$ is of order $10^{7}$ cm⁻³. A coma reaches that density only within a few tens of kilometers of the nucleus. **Everything outside that is non-LTE**, and MIRO's beam at typical Rosetta distances covers a lot of "outside."

The excitation budget you actually need:

- **Neutral–neutral collisions** (H₂O–H₂O), dominant in the collisional inner coma.
- **Electron collisions.** Because the electron–dipole cross sections are large, electrons dominate rotational excitation over a surprisingly wide intermediate region (roughly $10^2$–$10^3$ km), where neutral densities have already dropped. Getting the electron density and temperature profile wrong is a first-order error on the line, not a refinement.
- **Solar infrared pumping** through vibrational bands, which cascades back into rotational levels and sets the fluorescence-equilibrium populations in the outer coma.
- **Radiation from the nucleus itself**, which is a real pumping term close in.

### The LVG / Sobolev shortcut

Solving the full non-local problem — every cell's radiation field depends on every other cell — is expensive. In a radially expanding coma with roughly constant outflow speed, the velocity field does the work for you. Two points separated by more than a thermal linewidth in velocity space are radiatively decoupled, so photon escape becomes a **local** quantity:

$$
\beta(\tau) = \frac{1 - e^{-\tau}}{\tau},
$$

with the Sobolev optical depth built from the local velocity gradient. For a coma with $v \approx$ const, the gradient is dominated by the *angular* expansion term, so the Sobolev length is of order the cometocentric distance $r$ itself.

Practically, this turns a global integral equation into a **per-cell fixed-point iteration**: guess populations → compute $\tau$ and $\beta$ → update populations via statistical equilibrium → repeat. That is what makes a multi-cell spatial grid tractable, and it is why LVG is the standard first move for a coma pipeline before committing to full accelerated lambda iteration.

**Where LVG breaks:** exactly where the line is most optically thick — the inner few hundred km along a line of sight through the nucleus-facing coma, where the velocity gradient is small and the acceleration region is still developing. Know that boundary, and validate against a non-LVG solution there.

---

## 5. Putting it together: what a MIRO forward model has to produce

To compare with an actual MIRO spectrum you must deliver an **antenna temperature**, not an intensity. The chain is:

1. **Geometry.** Ray-trace the beam through your spatial grid; determine whether each ray terminates on the nucleus or on cold sky.
2. **Excitation.** Solve statistical equilibrium per cell with collisional (neutral + electron), radiative, and IR-pumping terms, using LVG escape probabilities.
3. **Formal solution.** Integrate the transfer equation along each ray, with $T_B^{\rm cont}$ from the thermophysical model as the nucleus boundary condition. Off-limb rays see the line in **emission**; on-nucleus rays see it in **absorption** against the warm continuum. Both appear in the same dataset and they constrain different things.
4. **Beam convolution.** Weight the ray bundle by the actual antenna pattern — 8 arcmin main lobe plus the −30 dB sidelobe floor.
5. **Instrument folding.** Apply the DSB sideband ratio, convolve to the 44 kHz channel response, apply any CTS smoothing window (1, 5, 7, or 9 channels), and — critically — apply the **LO frequency-switching difference** the same way the pipeline did.

Skip step 5 and your residuals will be dominated by instrument effects that look deceptively like physics.

---

## 6. Recommended reading order

For someone entering this problem, I would read in this sequence:

1. **Gulkis et al. (2007), *Space Science Reviews*** — the MIRO instrument paper. Read the beam pattern and calibration sections carefully; they define what your forward model must reproduce.
2. **A standard non-LTE escape-probability treatment** (Sobolev formalism; the LVG literature from ISM astrochemistry transfers almost directly).
3. **Cometary coma excitation with electrons** — the electron-density prescription is the single most-debated free parameter in this business.
4. **Thermophysical modeling of cometary nuclei** — for the continuum side, the thermal-inertia-to-brightness-temperature mapping.
5. **The LAMDA / molecular collisional rate databases** — and note carefully which collision partners and temperature ranges are actually tabulated. The missing rate coefficients are a real, not hypothetical, limitation on how well you can constrain the inner coma.

---

## Closing thought

MIRO is a good instrument to build a pipeline against precisely because it refuses to let you cheat. The continuum forces you to take the solid body seriously as a radiative boundary. The isotopologues force you to take opacity seriously. The 44 kHz channels force you to take kinematics seriously. And the density structure of a coma guarantees that no single excitation regime covers the whole line of sight — you will need collisions, electrons, and IR pumping, all three, before the residuals come down.

Build the geometry and instrument-folding layers first. The physics is easier to debug once the plumbing is honest.
