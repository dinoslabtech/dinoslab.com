---
title: BGA packages
description: "Ball grid array — why STM32N657X0 is a VFBGA264, and what that means for layout and assembly."
order: 3
---

A **BGA** (ball grid array) is a package whose connections are solder balls under the body, not leads around the edge. The STM32N657X0 on DNL-N6 is a **VFBGA264**: 264 balls, 14 × 14 mm body, **0.8 mm pitch**.

**VF** means very thin profile. The number is the ball count, not a performance grade.

## Why BGA instead of QFP

A 264-pin QFP would be large, and 0.8 mm pitch around four sides is awkward for escape routing. A 14 mm BGA keeps the MCU small, shortens power and memory routes, and is the only practical way to get this I/O count plus the HexaSPI and CSI-2 pins.

## Pitch

Pitch is the centre-to-centre distance between balls.

- **0.8 mm** (this part) is a common MCU pitch. Two-layer escape is tight; four or more layers with vias in pads or dog-bones is the usual approach.
- **0.5 mm and 0.4 mm** exist on smaller N6 packages. Those are finer, harder to assemble, and drop I/O (and the 16-bit XSPI).

## Assembly and inspection

You cannot see the joints. Assembly is SMT with a controlled profile — on DNL-N6 production that is **vapour-phase** reflow at the assembly house. Inspection is **X-ray** for voids and bridging, plus electrical test. Rework is possible but is a BGA job, not a soldering-iron job.

The AP Memory PSRAM and the Octo-SPI NOR on the module are also BGAs (typically BGA24). Same rules, smaller parts.

## Board implications

- Plane under the MCU for return and thermal.
- Decoupling close to the power balls, not “near the chip” in a vague sense.
- Do not fan every signal to a 2.54 mm header and call it a module. The point of the BGA is short, controlled routes to memory, CSI, and the carrier connector.
