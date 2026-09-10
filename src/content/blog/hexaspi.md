---
title: HexaSPI
description: "Hexadeca-SPI (x16) — a 16-bit serial memory bus for PSRAM and similar devices, without a parallel DRAM interface."
pubDate: 2026-09-10T12:07:00Z
author: Michele Forese
tags: ["hardware", "n6", "memory"]
order: 2
---

<aside class="note-example">
<p class="eyebrow">Example</p>
<p><a href="/products/dnl-n6">DNL-N6</a> — HexaSPI PSRAM next to Octo-SPI NOR on an STM32N6 XSPI host.</p>
</aside>

**HexaSPI** (Hexadeca-SPI) is a serial memory bus with **16 data lines**. It is the x16 member of the family that also includes Quad-SPI (x4) and Octo-SPI (x8). On ST parts the host is called **XSPI**.

## Width and throughput

| Name | Data lines | Typical use |
| --- | --- | --- |
| Quad-SPI | 4 | NOR flash, modest bandwidth |
| Octo-SPI | 8 | NOR flash, PSRAM |
| HexaSPI | 16 | PSRAM, HyperRAM-class devices |

Clocked in DDR (data on both edges) with a DQS strobe, a 16-bit link at 200 MHz moves up to 800 MB/s. That is the class of bandwidth you want for a framebuffer or an NPU working set, without a 32-bit parallel SDRAM bus.

## Octo and Hexa on the same MCU

A high-end MCU can expose more than one XSPI port. On the STM32N6 series, larger packages provide a **16-bit** port and an **8-bit** port at the same time. Smaller packages drop the 16-bit port; those devices cannot run HexaSPI PSRAM and Octo-SPI NOR together.

The usual split when both ports exist:

- **HexaSPI** → PSRAM (activations, frames)
- **Octo-SPI** → NOR flash (bootloader, application, weights)

AP Memory’s APS256XXN family is a common 256-Mbit HexaSPI PSRAM in a BGA24.

## What the layout must get right

These devices are typically **1.8 V**. That is a separate rail from 3.3 V GPIO.

Trace lengths on the 16 data bits, CLK, and DQS want to be matched. Treat the bus as high-speed memory, not as an SPI EEPROM.

## Names you will see

ST writes **Hexadeca-SPI** or **XSPI 16-bit**. AP Memory datasheets say **OPI/HPI** or **x16**. Same bus: sixteen DQ lines, clock, chip select, and a data strobe.
