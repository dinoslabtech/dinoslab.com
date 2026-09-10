---
title: OTP memory
description: "One-time programmable fuses — what they are, why STM32N6 has 8 KB of them, and why you do not use them as EEPROM."
pubDate: 2026-09-10T12:05:00Z
author: Michele Forese
tags: ["hardware", "n6", "memory"]
order: 4
---

**OTP** means **one-time programmable**. The bits are fuses (or antifuses). You write them, typically by a programming pulse from the MCU or a factory tool. You do not erase them. A blown fuse stays blown for the life of the part.

This is not flash and not EEPROM.

## What it is for

OTP holds values that must survive firmware updates, mass erase, and attackers who can rewrite NOR:

- **Boot and security configuration** (which port boots, TrustZone options)
- **Keys and hashes** for secure boot
- **Calibration** or board identity
- On STM32N6, an area reserved for **Ethernet MAC addresses** (ST does not programme it in the factory; it reads as zero until you write it)

STM32N6 exposes this through **BSEC** (boot and security control), with **8 KB** of OTP.

## What it is not for

Do not store logs, frame counters, or anything you might want to change twice. There is no wear levelling and no undo. A wrong write on a security word can brick a boot path.

For mutable data use NOR flash, EEPROM, or SRAM with a battery / supercap (the N6 also has 8 KB **backup SRAM** in VBAT — that *is* erasable, and it dies with the backup supply).

## Programming

On STM32, OTP is written with **STM32CubeProgrammer** or a HAL/BSEC driver, in a controlled sequence. Some words are reserved by ST. Read the reference manual before you pick an address.

Once a bit is one, it stays one. Design the map so that unused fields stay at the unprogrammed state until you need them.
