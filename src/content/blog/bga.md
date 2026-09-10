---
title: BGA packages
description: "Ball grid array — what the balls under the chip are for, pitch, and what that means for layout and assembly."
pubDate: 2026-09-10T12:06:00Z
author: Michele Forese
tags: ["hardware", "n6", "packaging"]
order: 3
---

<aside class="note-example">
<p class="eyebrow">Example</p>
<p><a href="/products/dnl-n6">DNL-N6</a> — MCU and serial memories are BGAs; the STM32N6 package is chosen with the hardware freeze.</p>
</aside>

A **BGA** (ball grid array) is a package whose connections are solder balls under the body, not leads around the edge. The number in a name such as VFBGA264 is the ball count, not a performance grade. **VF** means a very thin profile.

## Why BGA instead of QFP

A high pin-count QFP is large, and fine pitch around four sides is awkward for escape routing. A BGA keeps the MCU small, shortens power and memory routes, and is the practical way to get CSI-2, HexaSPI, and a dense I/O set out of one die.

The STM32N6 series ships in several BGA sizes (from about 6 × 6 mm at 0.4 mm pitch up to 14 × 14 mm at 0.8 mm). Finer pitch and smaller bodies drop I/O — and, on that family, the 16-bit XSPI port.

## Pitch

Pitch is the centre-to-centre distance between balls.

- **0.8 mm** is a common MCU pitch. Two-layer escape is tight; four or more layers with vias in pads or dog-bones is the usual approach.
- **0.5 mm and 0.4 mm** are finer, harder to assemble, and used when board area is the constraint.

## Assembly and inspection

You cannot see the joints. Assembly is SMT with a controlled profile; production houses often use **vapour-phase** reflow for this class of part. Inspection is **X-ray** for voids and bridging, plus electrical test. Rework is a BGA job, not a soldering-iron job.

Serial memories on the same board (HexaSPI PSRAM, Octo-SPI NOR) are typically small BGA24 devices. Same rules, smaller parts.

## Board implications

- Plane under the MCU for return and thermal.
- Decoupling close to the power balls, not “near the chip” in a vague sense.
- Do not fan every signal to a 2.54 mm header and call it a module. The point of the BGA is short, controlled routes to memory, camera, and the carrier connector.
