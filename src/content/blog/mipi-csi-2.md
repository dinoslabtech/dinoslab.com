---
title: MIPI CSI-2
description: "Camera Serial Interface 2 — the two-wire-per-lane link used to bring a CMOS sensor into an MCU or ISP."
pubDate: 2026-09-10T12:08:00Z
author: Michele Forese
tags: ["hardware", "n6", "camera"]
order: 1
---

<aside class="note-example">
<p class="eyebrow">Example</p>
<p><a href="/products/dnl-n6">DNL-N6</a> — edge-AI module with a 2-lane CSI-2 camera input on the STM32N6 series.</p>
</aside>

**MIPI CSI-2** (Camera Serial Interface, second generation) is the usual way a modern image sensor talks to a processor. Instead of a wide parallel bus of pixel wires, the sensor sends packets over a few differential pairs.

## How it is wired

A CSI-2 link is a **clock lane** plus one or more **data lanes**. Each lane is a low-voltage differential pair (MIPI D-PHY). Hosts implement one, two, or four data lanes. Two lanes are enough for many industrial and machine-vision sensors at VGA through 1080p, depending on bit depth and frame rate. Four-lane sensors need a CSI host that actually has four lanes.

## Why serial instead of parallel

Older MCUs used a parallel DVP/PSSI bus: HSYNC, VSYNC, PCLK, and 8–16 data pins. That is simple, but it burns GPIO, radiates, and struggles as pixel clocks rise. CSI-2 moves the same pixels onto high-speed serial lanes, with packet headers so the receiver can recover frame and line structure.

Many parts still keep a parallel camera port as well. CSI-2 is the one you want for a compact board and a current sensor.

## What sits after the lanes

On a capable MCU the CSI-2 host feeds an on-chip **ISP** (black level, demosaic, crop, gamma, YUV, and so on) and then the rest of the chip — an NPU, a video encoder, or SRAM/PSRAM framebuffers. The STM32N6 series is one example: two CSI-2 data lanes, an ISP with three pipes on the same stream, then Neural-ART or the H.264 encoder.

The physical connector on a carrier (FPC pitch, pinout, 15-pin Raspberry Pi CSI vs a custom 22-pin) is a board choice. CSI-2 is the protocol on those wires.

## Practical notes

- Lanes are impedance-controlled pairs. Treat them as high-speed digital, not GPIO.
- The sensor and the host must agree on lane count, data type (RAW8/10/12, YUV), and virtual channel.
- Cable length is short. CSI-2 is a board-to-board or short-FPC interface, not a camera-over-cable standard like USB3 Vision or GigE Vision.
