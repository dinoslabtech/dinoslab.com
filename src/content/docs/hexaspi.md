---
title: HexaSPI
description: "Hexadeca-SPI (x16) — the 16-bit serial memory bus used for AP Memory PSRAM on STM32N6."
order: 2
---

**HexaSPI** (Hexadeca-SPI) is a serial memory bus with **16 data lines**. It is the x16 member of the family that also includes Quad-SPI (x4) and Octo-SPI (x8). On STM32N6 the host is called **XSPI**.

## Width and throughput

| Name | Data lines | Typical use |
| --- | --- | --- |
| Quad-SPI | 4 | NOR flash, modest bandwidth |
| Octo-SPI | 8 | NOR flash, PSRAM |
| HexaSPI | 16 | PSRAM, HyperRAM-class devices |

Clocked in DDR (data on both edges) with a DQS strobe, a 16-bit link at 200 MHz moves up to 800 MB/s. That is the class of bandwidth you want for a framebuffer or Neural-ART working set, without a 32-bit parallel SDRAM bus.

## Why the N6 uses both Octo and Hexa

The **STM32N657X0** is the 264-pin SKU. It exposes **one 16-bit XSPI port and one 8-bit XSPI port** at the same time. Smaller N6 packages drop the 16-bit port; those parts cannot run HexaSPI and Octo-SPI NOR together.

On DNL-N6:

- **HexaSPI** → AP Memory APS256XXN PSRAM (activations, frames)
- **Octo-SPI** → 512-Mbit NOR (FSBL, application, weights)

That pairing is the same idea as ST’s N6 Nucleo / Discovery memory set.

## What the layout must get right

HexaSPI is a 1.8 V device class here. The NOR on the same board is also 1.8 V. That is a separate rail from 3.3 V GPIO.

Trace lengths on the 16 data bits, CLK, and DQS want to be matched. The footprint is typically a small BGA (AP Memory APS256XXN-OB9-BG is BGA24). Treat it as a high-speed memory, not as an SPI EEPROM.

## Names you will see

ST writes **Hexadeca-SPI** or **XSPI 16-bit**. AP Memory datasheets say **OPI/HPI** or **x16**. Same bus: sixteen DQ lines, clock, chip select, and a data strobe.
