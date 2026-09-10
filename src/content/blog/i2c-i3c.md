---
title: I2C and I3C
description: "Two-wire control buses — I2C as the workhorse, I3C as the MIPI successor with speed and in-band interrupts."
pubDate: 2026-09-10T12:01:00Z
author: Michele Forese
tags: ["hardware", "n6", "i2c"]
order: 8
---

**I2C** (Inter-Integrated Circuit) is the two-wire bus almost every sensor, EEPROM, and PMIC still speaks: **SDA** and **SCL**, open-drain, pull-ups, 7-bit addresses.

**I3C** (Improved Inter Integrated Circuit, a MIPI spec) is the successor. Same two pins in spirit, not the same electricals, and a lot more in the protocol.

The STM32N657X0 has **four I2C** and **two I3C**.

<h2 id="i2c">I2C</h2>

- Standard 100 kHz, Fast 400 kHz, Fast-mode Plus 1 MHz, some parts High-speed 3.4 MHz
- Open-drain: a strong pull-up fights every edge, so speed, capacitance, and pull-up value are a compromise
- Interrupts from devices usually need an extra **INT** GPIO
- Ubiquitous. If the part exists, it probably has an I2C mode

**Pros:** Everywhere, trivial to bit-bang, cheap devices.  
**Cons:** Slow for a camera control channel you poll hard, extra wires for interrupts, address clashes (0x50 is not unique in nature).

<h2 id="i3c">I3C</h2>

- Push-pull on the data line for high speed, with a defined way to mix in I2C devices
- Typical SDR rates in the low tens of Mbit/s — an order of magnitude above Fast-mode I2C
- **In-band interrupt**: a device can win the bus and signal without a dedicated INT pin
- Dynamic addressing, so you are not stuck with two identical sensors at 0x76
- Optional HDR modes for still more throughput

**Pros:** Faster, fewer GPIOs, better multi-drop of similar parts.  
**Cons:** Fewer devices than I2C, more complicated host, voltage and mix rules (legacy I2C on an I3C bus is a checklist, not a default).

## Which one on DNL-N6

Camera modules still often use **I2C** (or CCI, which is I2C-shaped) for register setup, with **CSI-2** for pixels. I3C is there when a sensor or a board management chip speaks it. Do not assume an I2C-only IMU will magically run at I3C rates.

If you only need a temperature sensor and an EEPROM, I2C is the bus. If you are hanging several identical sensors and you are short on pins, look at I3C.
