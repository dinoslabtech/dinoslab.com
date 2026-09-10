---
title: DNL-N6
shortName: DNL-N6
status: coming_soon
summary: "Carrier-mounted edge-AI module on ST’s STM32N657X0, with AP Memory HexaSPI PSRAM and Octo-SPI NOR, for cameras and inference at the board edge."
chip: STM32N657X0 · Cortex-M55 · Neural-ART
category: AI module
highlights:
  - { value: "800 MHz", label: "Cortex-M55" }
  - { value: "600 GOPS", label: "Neural-ART NPU" }
  - { value: "4.2 MB", label: "On-chip SRAM" }
  - { value: "32 MB", label: "HexaSPI PSRAM" }
  - { value: "64 MB", label: "Octo-SPI NOR" }
  - { value: "CSI-2", label: "2-lane camera" }
features:
  - title: Edge AI without a Linux MPU
    body: "ST Neural-ART runs at up to 1 GHz, 600 GOPS and 288 MAC/cycle, with stream engines, on-the-fly weight decompression, and real-time crypto on the model path. Workloads that needed an accelerated MPU stay on an MCU."
  - title: Camera pipeline on the module
    body: "MIPI CSI-2 (2-lane) plus a parallel 16-bit PSSI path. On-chip ISP with three pipes on the same stream (bad pixel, black level, exposure, demosaic, crop, downsize, gamma, YUV). Hardware H.264 encoder and JPEG codec."
  - title: Memory like the ST N6 Nucleo reference
    body: "512-Mbit Octo-SPI NOR for FSBL, application, and weights; 256-Mbit AP Memory Hexadeca-SPI PSRAM for framebuffers and activations. The STM32N657X0 is the 264-pin SKU with both 16-bit and 8-bit XSPI ports, so both devices sit on the MCU at once."
  - title: Graphics and display
    body: "NeoChrom 2.5D GPU, Chrom-ART (DMA2D), and LTDC. Framebuffers can live in HexaSPI PSRAM; the 4.2 MB on-chip SRAM is contiguous and large enough for a 1280 × 800 double buffer."
specGroups:
  - title: Processor
    rows:
      - ["Part", "STM32N657X0H3Q"]
      - ["Package", "VFBGA264, 14 × 14 mm, 0.8 mm pitch"]
      - ["I/O count", "165"]
      - ["Core", "Arm Cortex-M55, TrustZone, Helium (MVE), FPU (half / single / double)"]
      - ["CPU clock", "Up to 800 MHz (VOS high, VDDCORE 0.89 V); 600 MHz in VOS low"]
      - ["Performance", "3360 CoreMark, 1280 DMIPS"]
      - ["Caches", "32 KB I-cache, 32 KB D-cache"]
      - ["TCM", "64 KB ITCM + 128 KB DTCM, both with ECC"]
  - title: Neural-ART accelerator
    rows:
      - ["Type", "ST Neural-ART NPU (STM32N6x7)"]
      - ["Clock", "Up to 1 GHz"]
      - ["Throughput", "600 GOPS, 288 MAC/cycle"]
      - ["Datapath", "Dedicated stream engines, on-the-fly weight decompression"]
      - ["Security", "Real-time encryption / decryption of the model path"]
      - ["Toolchain", "ST Edge AI Suite, STM32Cube.AI"]
  - title: On-chip memory
    rows:
      - ["System SRAM", "4.2 MB contiguous"]
      - ["Backup SRAM", "8 KB, retained in VBAT"]
      - ["OTP", "8 KB fuses (BSEC), including Ethernet MAC area"]
      - ["Boot ROM", "128 KB"]
  - title: External memory
    rows:
      - ["PSRAM", "AP Memory APS256XXN, 256 Mbit (32 MB)"]
      - ["PSRAM interface", "Hexadeca-SPI (x16) on XSPI, 1.8 V, up to 200 MHz DDR"]
      - ["PSRAM role", "Framebuffers, activations, working set"]
      - ["NOR flash", "512 Mbit (64 MB) Octo-SPI, 1.8 V, 200 MHz DTR, read-while-write"]
      - ["NOR interface", "XSPI octal, memory-mapped (typical map 0x7000 0000)"]
      - ["NOR role", "FSBL, application, neural-network weights"]
      - ["NOR class", "Same class as NUCLEO-N657X0-Q (MX25UM51245G footprint, BGA24)"]
      - ["PSRAM class", "Same class as ST N6 HexaSPI reference (APS256XXN-OB9 / OBR)"]
  - title: Vision and graphics
    rows:
      - ["Camera serial", "MIPI CSI-2, 2 lanes"]
      - ["Camera parallel", "16-bit PSSI"]
      - ["ISP", "Three pipes on one stream: bad pixel, decimation, black level, exposure, demosaic, contrast, crop, downsize, ROI, gamma, YUV, packer"]
      - ["Video encode", "Hardware H.264 encoder, JPEG codec"]
      - ["Display", "LTDC / TFT-LCD"]
      - ["GPU", "NeoChrom 2.5D"]
      - ["2D", "Chrom-ART (DMA2D)"]
  - title: Connectivity (MCU)
    rows:
      - ["USB", "2× USB 2.0 OTG HS with on-chip HS PHY; 1× UCPD"]
      - ["Ethernet", "1× 10/100/1000 MAC with TSN (IEEE 802.1)"]
      - ["CAN", "3× FDCAN with TTCAN"]
      - ["SD / eMMC", "2× SDMMC (MMC v4.0, SD, CE-ATA)"]
      - ["I2C / I3C", "4× I2C, 2× I3C"]
      - ["SPI / I2S", "6× SPI (4× I2S-capable)"]
      - ["UART", "5× USART, 5× UART, 1× LPUART"]
      - ["Audio", "2× SAI, SPDIF, MDF (6 filters), ADF"]
      - ["External bus", "FMC, up to 32-bit: SRAM, PSRAM, SDRAM, NOR, NAND"]
  - title: Analog, timers, system
    rows:
      - ["ADC", "2× 12-bit, 20 channels each"]
      - ["References", "Internal VREFBUF, digital temperature sensor"]
      - ["Timers", "2 advanced, 10 general-purpose, 3 basic, 5 low-power"]
      - ["DMA", "16-channel GPDMA, 16-channel HPDMA"]
      - ["RNG", "Analog true RNG"]
      - ["Watchdogs", "IWDG, WWDG"]
      - ["RTC", "Secure RTC"]
      - ["Unique ID", "96-bit"]
  - title: Security
    rows:
      - ["Isolation", "Arm TrustZone"]
      - ["Boot", "Secure boot from XSPI NOR, HyperFlash, or eMMC"]
      - ["Crypto", "SAES, CRYPT, PKA, MCE 1.4"]
      - ["Tamper", "Tamper detection"]
  - title: Power and environment (MCU)
    rows:
      - ["VDD", "1.71–3.6 V"]
      - ["VDDCORE", "Internal SMPS; 0.89 V (800 MHz) / 0.81 V (600 MHz)"]
      - ["Memories", "1.8 V Octo-SPI NOR and HexaSPI PSRAM"]
      - ["Ambient (MCU)", "−40 to +125 °C"]
      - ["Module supply", "To be published with the hardware release"]
  - title: Module
    rows:
      - ["Form", "Carrier-mounted SOM — not a Nucleo or Discovery kit"]
      - ["Target use", "Cameras, inspection, and other edge-AI loads that do not need Linux"]
      - ["I/O to carrier", "To be published (power, boot, SWD, USB HS, CSI-2, SDMMC, UART, I2C, SPI, GPIO)"]
      - ["Mechanics / pinout", "To be published with the design release"]
      - ["Status", "Design in progress. This page is not a datasheet."]
---

The DNL-N6 is a solder- or socket-down module built around **STM32N657X0**, ST’s Cortex-M55 MCU with Neural-ART. It is meant to sit on a carrier with a camera, not to replace a Linux MPU.

## Memory map (typical)

The STM32N6 boots from ROM, copies an FSBL from external NOR into SRAM, then runs the application. Weights for Neural-ART usually stay in NOR and are paged; activations and frames sit in PSRAM or the 4.2 MB on-chip SRAM.

| Region | Typical map | Device |
| --- | --- | --- |
| Secure SRAM | `0x3400 0000` | 4.2 MB on-chip |
| Octo-SPI NOR | `0x7000 0000` | 512 Mbit, XSPI octal |
| FSBL | `0x7000 0000` | First stage in NOR |
| Application | `0x7010 0000` | NOR |
| Network weights | `0x7100 0000` | NOR |
| HexaSPI PSRAM | `0x9000 0000` | 256 Mbit, XSPI x16 |

Final addresses on DNL-N6 will be confirmed in the bring-up notes.

## Software

Bring-up targets the ST N6 tree: **STM32CubeN6**, **STM32CubeMX**, **STM32CubeIDE**, **STM32CubeProgrammer**, and **ST Edge AI Suite** for Neural-ART models. The MCU has no on-die flash; the first-stage bootloader lives in the Octo-SPI NOR.

## Documentation

Datasheet-level pinout, mechanical drawing, power budget, and a bring-up guide will ship with the first hardware. Until then this page tracks the intended silicon and memory selection.

References used for the figures above: ST DS14791 (STM32N6x5xx / STM32N6x7xx), NUCLEO-N657X0-Q user manual UM3417, and AP Memory APS256XXN.
