---
title: SRAM, DRAM, PSRAM, NOR, NAND
description: "The memories you actually put on a board — what each one is good at, and the trade-offs."
pubDate: 2026-09-10T12:04:00Z
author: Michele Forese
tags: ["hardware", "n6", "memory"]
order: 5
---

A module like DNL-N6 does not have one “RAM” and one “disk”. It mixes several technologies because each one wins a different argument: speed, density, persistence, pin count, price.

<h2 id="sram">SRAM</h2>

Static RAM. Each bit is a latch (typically six transistors). No refresh.

**Pros:** Fast, simple timing, random access, available on-chip in useful sizes. The N6 has **4.2 MB** of contiguous SRAM plus TCM with ECC.

**Cons:** Large per bit, expensive, volatile. You will not put 256 MB of SRAM next to an MCU.

**Use:** CPU code/data, TCM, on-chip buffers.

<h2 id="dram">DRAM</h2>

Dynamic RAM (and the DDR/SDR SDRAM you attach to an FMC or a dedicated controller). Each bit is a capacitor. It must be refreshed.

**Pros:** Density and price. This is why phones and PCs have gigabytes.

**Cons:** A real DRAM bus is wide, fast, and fussy (length match, termination, refresh, initialisation). Overkill — and a pin budget problem — on a small MCU module that already spends balls on HexaSPI and CSI-2.

**Use:** Linux MPUs, not this MCU class.

<h2 id="psram">PSRAM</h2>

Pseudo-SRAM. DRAM cells with a controller that hides refresh, presented to the host as a simple RAM. On DNL-N6 it is **AP Memory APS256XXN**, 256 Mbit (**32 MB**), on **HexaSPI**.

**Pros:** Much denser than SRAM, much easier to attach than DDR. Memory-mapped. Good for framebuffers and Neural-ART activations.

**Cons:** Still volatile. Latency is worse than on-chip SRAM. The serial bus and DQS need a proper layout. Throughput depends on width (x8 vs x16) and clock.

**Use:** The “large RAM” next to an MCU that cannot afford DDR.

<h2 id="nor">NOR</h2>

Non-volatile, random-readable. Execute-in-place and memory-map are normal. DNL-N6 uses **512 Mbit (64 MB) Octo-SPI NOR**, 1.8 V, 200 MHz DTR, read-while-write — the same class as the NUCLEO-N657X0-Q (`MX25UM51245G` footprint).

**Pros:** Holds firmware and weights across power loss. The CPU can fetch from it. Fine-grained reads.

**Cons:** Slow and limited writes/erases compared with RAM. Density and price lose to NAND at large sizes. STM32N6 has **no on-die flash**; NOR (or eMMC) is mandatory for boot.

**Use:** FSBL, application, neural-network weights.

<h2 id="nand">NAND</h2>

The dense, cheap, page-oriented flash in SSDs and eMMC.

**Pros:** Gigabits for little money.

**Cons:** You read and write in pages, erase in blocks, need ECC and a translation layer. Not a memory-mapped XIP device in the NOR sense. The N6 *can* talk to NAND through FMC or to eMMC through SDMMC; that is a different storage story than the Octo-SPI NOR boot path.

**Use:** Bulk storage, not the boot image on this module.

## How DNL-N6 splits the job

| Need | Device |
| --- | --- |
| Tight CPU / NPU working set | On-chip SRAM |
| Frames, activations | HexaSPI PSRAM |
| Boot, code, weights | Octo-SPI NOR |
| Gigabytes of logs or maps | Not on the module (carrier eMMC/SD if you add it) |
