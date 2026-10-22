---
title: DNL-N6
shortName: DNL-N6
status: coming_soon
kind: som
summary: "Industrial-control and on-site edge-AI module."
chip: STM32N657X0H3Q · Cortex-M55 · Neural-ART
category: Module
highlights:
  - { value: "N657X0", label: "STM32N657X0H3Q" }
  - { value: "5–24 V", label: "Input" }
  - { value: "2×64 MB", label: "PSRAM, default" }
  - { value: "128 MB", label: "Octal NOR" }
  - { value: "GbE PHY", label: "MDI to the carrier" }
  - { value: "Camera", label: "On the carrier" }
variants:
  - code: DNL-N6-P2x64-F128
    title: DNL-N6-P2x64-F128
    psramMb: 128
    norMb: 128
  - code: DNL-N6-P1x64-F128
    title: DNL-N6-P1x64-F128
    psramMb: 64
    norMb: 128
specGroups:
  - title: Power
    rows:
      - ["Input", "About 5–24 V"]
      - ["3.3 V", "Made on the module, for the MCU"]
      - ["1.8 V", "Made on the module, for the PSRAM and the NOR"]
  - title: Processor
    rows:
      - ["Device", "STM32N657X0H3Q"]
      - ["Core", "Arm Cortex-M55"]
      - ["CPU clock", "Up to 800 MHz"]
      - ["NPU", "Neural-ART, up to 600 GOPS"]
      - ["On-chip SRAM", "4.2 MB"]
      - ["Toolchain", "STM32CubeN6, CubeMX, CubeIDE, ST Edge AI Suite"]
  - title: Memory
    rows:
      - ["PSRAM", "Two x16 lands. Default stuffs both, 64 MB each. DNL-N6-P1x64-F128 stuffs one."]
      - ["NOR", "128 MB octal, both stock codes. Boot flash."]
---
