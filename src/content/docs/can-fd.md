---
title: CAN FD and TTCAN
description: "Flexible Data-rate CAN and time-triggered CAN — the two modes on STM32N6’s FDCAN controllers."
order: 7
---

ST names the controller **FDCAN**. That is **CAN FD** (Flexible Data-rate), ISO 11898-1:2015. **TTCAN** is a time-triggered protocol that can run on the same controller. The N6 has **three** of these, with TTCAN capability.

(You will also see “FSCAN” in passing — on this silicon the block is FDCAN.)

## Classic CAN, first

CAN is a differential pair (CANH/CANL), a dominant/recessive bus, and arbitration by ID so the highest-priority frame wins without a master. Classic CAN is 8 data bytes and, in practice, up to 1 Mbit/s.

That is still the right bus for a lot of vehicles and machines. It is not enough when a node wants to ship a 32-byte payload or a firmware chunk without splitting it into many frames.

<h2 id="can-fd">CAN FD</h2>

CAN FD keeps the arbitration idea, then **switches to a faster bit rate in the data phase** and allows **up to 64 data bytes**.

- Arbitration phase: still slow enough for the whole bus to agree (often 500 kbit/s or 1 Mbit/s)
- Data phase: 2, 4, 5… Mbit/s depending on the transceiver and the wiring

All nodes that must see FD frames need FD transceivers and FD controllers. A classic-only node will error on an FD frame. Mixed networks are designed on purpose, not by accident.

<h2 id="ttcan">TTCAN</h2>

**TTCAN** (ISO 11898-4) adds a **time schedule**. Nodes share a cycle time. Windows are reserved for specific messages, so you get bounded latency and less fighting on the bus.

It is closer to a timetable than to “whoever talks first”. Useful for chassis and industrial axes; heavier to configure than event-driven CAN FD.

## On the module

Three FDCAN instances do not mean three connectors. They mean three controllers in the MCU. How many reach a carrier connector, and whether they are isolated, is a module/carrier decision. Use a CAN FD transceiver (not a 1 Mbit-only classic part) if you want the data-phase speed.
