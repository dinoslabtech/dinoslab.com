---
title: Ethernet TSN
description: "Time-Sensitive Networking — scheduled, bounded-latency Ethernet for industrial links."
pubDate: 2026-09-10T12:03:00Z
author: Michele Forese
tags: ["hardware", "n6", "ethernet"]
order: 6
---

<aside class="note-example">
<p class="eyebrow">Example</p>
<p><a href="/products/dnl-n6">DNL-N6</a> — the STM32N6 series MAC is TSN-capable; bringing it to the carrier is a pin-mux choice.</p>
</aside>

**TSN** (Time-Sensitive Networking) is a set of IEEE 802.1 standards that turn Ethernet into a link with **time** in the contract, not only best-effort delivery. Several industrial MCUs, including the STM32N6 series, integrate a **Gigabit MAC with TSN**.

## What is wrong with ordinary Ethernet

Classic switched Ethernet is excellent at moving bulk data. It does not promise when a given frame will leave the port. A camera packet and a firmware-update packet compete. In a machine, a drive command that arrives 2 ms late is a different product than a web page that arrives 2 ms late.

## What TSN adds

The parts you actually meet on an MCU:

- **Time sync** (802.1AS / gPTP) — a shared clock across the network
- **Scheduled traffic** (802.1Qbv) — gates on the transmitter so a class of frames gets a slot
- **Priority and filtering** (802.1Q) — not new, but required for the schedule to mean anything
- **Pre-emption** (802.1Qbu / 802.3br) — a large frame can be interrupted by a time-critical one

Together they let you say: this 64-byte cyclic frame goes out every 500 µs, and the rest of the traffic fills the gaps.

## What it is not

TSN is not a fieldbus on its own. EtherCAT, PROFINET IRT, and OPC UA PubSub *use* TSN or sit beside it. You still need a stack, a profile, and a switch that speaks the same standards. A “TSN MAC” on the MCU is the hardware hook, not a turnkey PLC network.

## On a board

The MAC is in the silicon. A PHY, magnetics, and an RJ45 (or a connector to a carrier) are board choices. If the product only needs a camera and USB, the TSN MAC can stay unused.

MAC addresses on STM32N6 live in **OTP** until you programme them. They are not printed in the factory.
