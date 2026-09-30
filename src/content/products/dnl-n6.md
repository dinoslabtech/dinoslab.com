---
title: DNL-N6
shortName: DNL-N6
status: coming_soon
kind: som
summary: "Solder-down STM32N6 SoM for a carrier you design. HexaSPI PSRAM, Octo-SPI NOR, optional FMC RAM, Gigabit Ethernet PHY on the module, 4–36 V in."
chip: STM32N6 · Cortex-M55 · Neural-ART
category: SoM
highlights:
  - { value: "4–36 V", label: "Module input" }
  - { value: "32 MB", label: "HexaSPI PSRAM" }
  - { value: "64 MB", label: "Octo-SPI NOR" }
  - { value: "GbE PHY", label: "MDI to the edge" }
  - { value: "CSI-2", label: "Camera on the carrier" }
  - { value: "STM32N6", label: "M55 + Neural-ART" }
variants:
  - code: DNL-N6-32/64
    title: DNL-N6 32/64
    psramMb: 32
    norMb: 64
    fmc: empty
  - code: DNL-N6-32/64-R
    title: DNL-N6 32/64 with extra FMC RAM
    psramMb: 32
    norMb: 64
    fmc: fitted
relatedProduct: dnl-n6-dk
viewer:
  som: /models/dnl-n6.glb
  kit: /models/dnl-n6-dk.glb
  combined: /models/dnl-n6-on-dk.glb
onModule:
  - STM32N6 (Neural-ART on N6x7 devices)
  - HexaSPI PSRAM and Octo-SPI NOR
  - FMC RAM footprint — empty on DNL-N6-32/64, fitted on DNL-N6-32/64-R
  - Gigabit Ethernet PHY; MDI pairs to the module edge
  - Input bucks to the MCU and memory rails
onCarrier:
  - Magnetics and RJ45 (the PHY stays on the SoM)
  - Camera connector on the CSI-2 pairs from the edge
  - The I/O you actually use
  - Mechanics around the module
frozen:
  - ["MCU family", "STM32N6 series. Neural-ART on N6x7"]
  - ["Working RAM", "HexaSPI PSRAM stuffed on both SKUs"]
  - ["Boot / weights", "Octo-SPI NOR stuffed on both SKUs"]
  - ["Extra RAM", "FMC footprint; fitted on -R, density at freeze"]
  - ["Ethernet", "PHY on the SoM; MDI to the edge"]
  - ["Power", "Bucks on the module (MCU and memory rails)"]
  - ["Camera", "CSI-2 brought to the edge"]
open:
  - ["Exact MCU", "Package, temperature grade, crypto — chosen at hardware freeze"]
  - ["FMC density", "Fitted or empty is the SKU; the part is not frozen"]
  - ["Pinout / mechanics", "To be published with the design release"]
  - ["Module rating", "To be published with the hardware release"]
specGroups:
  - title: Order codes
    rows:
      - ["Family", "DNL-N6"]
      - ["Pattern", "DNL-N6-{PSRAM MB}/{NOR MB}[-R[{FMC MB}]]"]
      - ["DNL-N6-32/64", "32 MB HexaSPI PSRAM, 64 MB Octo-SPI NOR, FMC footprint empty"]
      - ["DNL-N6-32/64-R", "Same stuffing, FMC RAM fitted. Density published at freeze"]
      - ["Later codes", "Other PSRAM / NOR / FMC sizes keep this pattern"]
  - title: Power
    rows:
      - ["3.3 V", "Buck on the module, MCU rail"]
      - ["1.8 V", "Buck on the module, HexaSPI PSRAM and Octo-SPI NOR"]
      - ["Carrier", "Feed the module input; magnetics and the rest of the board live there"]
  - title: Processor
    rows:
      - ["Family", "STM32N6 series (device chosen at hardware freeze)"]
      - ["Core", "Arm Cortex-M55 with Helium and TrustZone"]
      - ["CPU clock", "Up to 800 MHz"]
      - ["NPU", "ST Neural-ART, up to 600 GOPS on N6x7 devices"]
      - ["On-chip SRAM", "4.2 MB"]
      - ["Toolchain", "STM32CubeN6, CubeMX, CubeIDE, ST Edge AI Suite"]
  - title: Memory
    rows:
      - ["HexaSPI PSRAM", "32 MB (256 Mbit), 1.8 V — frames, activations"]
      - ["Octo-SPI NOR", "64 MB (512 Mbit), 1.8 V — FSBL, application, weights"]
      - ["FMC RAM", "Footprint on every PCB. Empty on DNL-N6-32/64; fitted on DNL-N6-32/64-R"]
  - title: Ethernet
    rows:
      - ["MAC", "STM32N6 Gigabit MAC, TSN-capable"]
      - ["Edge", "MDI pairs. Magnetics and RJ45 on the carrier / DevKit"]
  - title: Camera and edge
    rows:
      - ["Camera serial", "MIPI CSI-2, 2 lanes, to the edge"]
      - ["Camera parallel", "16-bit PSSI on the silicon; routing to the edge at freeze"]
      - ["Other I/O", "USB HS, SWD, SDMMC, UART, I2C, SPI, GPIO — pinout with the design release"]
  - title: Software
    rows:
      - ["Boot", "No on-die flash. FSBL in Octo-SPI NOR"]
      - ["Tree", "STM32CubeN6 / CubeMX / CubeIDE / CubeProgrammer"]
      - ["Models", "ST Edge AI Suite for Neural-ART"]
---

The DNL-N6 is a solder- or socket-down SoM. You put it on a carrier with a camera and the connectors you need. It is not a Linux MPU and it is not a finished camera box.

Two BOMs share the same PCB. **DNL-N6-32/64** leaves the FMC RAM unpopulated. **DNL-N6-32/64-R** fits that extra bank. HexaSPI PSRAM and Octo-SPI NOR are on both.

Eval is the [DNL-N6 DevKit](/products/dnl-n6-dk): a carrier that brings the module’s peripherals out, with magnetics and RJ45 on that board. A bare SoM is for a carrier you already have.

## Documentation

Datasheet pinout, mechanical drawing, power budget, and a bring-up guide ship with the first hardware. Until then this page is the intended module: memories, PHY, power, and the two SKUs.
