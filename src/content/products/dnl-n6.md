---
title: DNL-N6
shortName: DNL-N6
status: coming_soon
kind: som
summary: "Industrial-control and on-site edge-AI module."
chip: STM32N6 · Cortex-M55 · Neural-ART
category: Module
highlights:
  - { value: "STM32N6", label: "MCU" }
  - { value: "5-24V", label: "Input power" }
  - { value: "2x64 MB", label: "PSRAM" }
  - { value: "128 MB", label: "NOR Flash" }
  - { value: "600", label: "GOPS" }
  - { value: "GbE", label: "Gigabit Ethernet" }
variants:
  - code: DNL-N6-P2x64-F128
    title: DNL-N6-P2x64-F128
    psramMb: 128
    norMb: 128
  - code: DNL-N6-P1x64-F128
    title: DNL-N6-P1x64-F128
    psramMb: 64
    norMb: 128
viewer:
  som: /models/dnl-n6.glb
  kit: /models/dnl-n6-dk.glb
  combined: /models/dnl-n6-on-dk.glb
specGroups:
  - title: Power
    rows:
      - ["Input", "5–24 V"]
      - ["3.3 V", "Made on the module, for the MCU"]
      - ["1.8 V", "Made on the module, for the PSRAM and the NOR"]
  - title: Processor
    rows:
      - ["Device", "STM32N6"]
      - ["Core", "Arm Cortex-M55"]
      - ["CPU clock", "Up to 800 MHz"]
      - ["NPU", "Neural-ART, up to 600 GOPS"]
      - ["On-chip SRAM", "4.2 MB"]
      - ["Toolchain", "[STM32CubeN6](https://www.st.com/en/embedded-software/stm32cuben6.html), [CubeMX](https://www.st.com/en/development-tools/stm32cubemx.html), [CubeIDE](https://www.st.com/en/development-tools/stm32cubeide.html), [ST Edge AI Suite](https://www.st.com/content/st_com/en/st-edge-ai-suite.html)"]
  - title: Memory
    rows:
      - ["PSRAM", "Two x16 lands, 64 MB each. Default uses both. DNL-N6-P1x64-F128 uses one."]
      - ["NOR", "128 MB octal, both stock codes. Boot flash."]
---
