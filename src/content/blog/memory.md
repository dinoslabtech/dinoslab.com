---
title: SRAM, DRAM, PSRAM, NOR, NAND
description: "The memories you actually put on a board — what each one is good at, and the trade-offs."
pubDate: 2026-09-10T12:04:00Z
author: Michele Forese
tags: ["hardware", "n6", "memory"]
order: 5
---

<aside class="note-example">
<p class="eyebrow">Example</p>
<p><a href="/products/dnl-n6">DNL-N6</a> — on-chip SRAM, HexaSPI PSRAM for frames, Octo-SPI NOR for boot and weights.</p>
</aside>

A board does not have one “RAM” and one “disk”. It mixes several technologies because each one wins a different argument: speed, density, persistence, pin count, price.

<h2 id="sram">SRAM</h2>

Static RAM. Each bit is a latch (typically six transistors). No refresh.

**Pros:** Fast, simple timing, random access, available on-chip in useful sizes. Some MCUs now have several megabytes of contiguous SRAM plus TCM with ECC.

**Cons:** Large per bit, expensive, volatile. You will not put 256 MB of SRAM next to an MCU.

**Use:** CPU code/data, TCM, on-chip buffers.

<h2 id="dram">DRAM</h2>

Dynamic RAM (and the DDR/SDR SDRAM you attach to an FMC or a dedicated controller). Each bit is a capacitor. It must be refreshed.

**Pros:** Density and price. This is why phones and PCs have gigabytes.

**Cons:** A real DRAM bus is wide, fast, and fussy (length match, termination, refresh, initialisation). Overkill — and a pin budget problem — on a small MCU module that already spends balls on HexaSPI and CSI-2.

**Use:** Linux MPUs, not this MCU class.

<h2 id="psram">PSRAM</h2>

Pseudo-SRAM. DRAM cells with a controller that hides refresh, presented to the host as a simple RAM. A typical HexaSPI part is 256 Mbit (32 MB), 1.8 V, from vendors such as AP Memory.

**Pros:** Much denser than SRAM, much easier to attach than DDR. Memory-mapped. Good for framebuffers and NPU activations.

**Cons:** Still volatile. Latency is worse than on-chip SRAM. The serial bus and DQS need a proper layout. Throughput depends on width (x8 vs x16) and clock.

**Use:** The “large RAM” next to an MCU that cannot afford DDR.

<h2 id="nor">NOR</h2>

Non-volatile, random-readable. Execute-in-place and memory-map are normal. A common companion for an STM32N6 is **512 Mbit (64 MB) Octo-SPI NOR**, 1.8 V, 200 MHz DTR, read-while-write, BGA24.

**Pros:** Holds firmware and weights across power loss. The CPU can fetch from it. Fine-grained reads.

**Cons:** Slow and limited writes/erases compared with RAM. Density and price lose to NAND at large sizes. The STM32N6 series has **no on-die flash**; NOR (or eMMC) is mandatory for boot.

**Use:** First-stage bootloader, application, neural-network weights.

<h2 id="nand">NAND</h2>

The dense, cheap, page-oriented flash in SSDs and eMMC.

**Pros:** Gigabits for little money.

**Cons:** You read and write in pages, erase in blocks, need ECC and a translation layer. Not a memory-mapped XIP device in the NOR sense. An MCU may still talk to NAND through a parallel bus or to eMMC through SDMMC — that is bulk storage, not the Octo-SPI boot path.

**Use:** Logs, maps, files. Not the boot image on a small module.

## A typical split on an edge MCU

| Need | Device |
| --- | --- |
| Tight CPU / NPU working set | On-chip SRAM |
| Frames, activations | HexaSPI PSRAM |
| Boot, code, weights | Octo-SPI NOR |
| Gigabytes of files | Carrier eMMC or SD, if you add it |
