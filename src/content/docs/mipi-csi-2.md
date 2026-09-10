---
title: MIPI CSI-2
description: "Camera Serial Interface 2 — the two-wire-per-lane link used to bring a CMOS sensor into an MCU or ISP."
order: 1
---

**MIPI CSI-2** (Camera Serial Interface, second generation) is the usual way a modern image sensor talks to a processor. Instead of a wide parallel bus of pixel wires, the sensor sends packets over a few differential pairs.

## How it is wired

A CSI-2 link is a **clock lane** plus one or more **data lanes**. Each lane is a low-voltage differential pair (MIPI D-PHY). The STM32N657X0 on the DNL-N6 implements **two data lanes**.

Two lanes are enough for many industrial and machine-vision sensors at VGA through 1080p, depending on bit depth and frame rate. Four-lane sensors exist; they need a larger CSI host than this MCU.

## Why serial instead of parallel

Older MCUs used a parallel DVP/PSSI bus: HSYNC, VSYNC, PCLK, and 8–16 data pins. That is simple, but it burns GPIO, radiates, and struggles as pixel clocks rise. CSI-2 moves the same pixels onto high-speed serial lanes, with packet headers so the receiver can recover frame and line structure.

The N6 still has a 16-bit **PSSI** parallel path. CSI-2 is the one you want for a compact module and a current sensor.

## What sits after the lanes

On STM32N6 the CSI-2 host feeds an on-chip **ISP** (three pipes on the same stream: black level, demosaic, crop, gamma, YUV, and so on) and then the rest of the chip — Neural-ART, the H.264 encoder, or SRAM/PSRAM framebuffers.

The physical connector on a carrier (FPC pitch, pinout, 15-pin Raspberry Pi CSI vs a custom 22-pin) is a board choice. CSI-2 is the protocol on those wires.

## Practical notes

- Lanes are impedance-controlled pairs. Treat them as high-speed digital, not GPIO.
- The sensor and the MCU must agree on lane count, data type (RAW8/10/12, YUV), and virtual channel.
- Cable length is short. CSI-2 is a board-to-board or short-FPC interface, not a camera-over-cable standard like USB3 Vision or GigE Vision.
