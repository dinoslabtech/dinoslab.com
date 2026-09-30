---
title: DNL-N6 DevKit
shortName: DNL-N6 DevKit
status: coming_soon
kind: kit
summary: "Carrier for the DNL-N6. All SoM peripherals brought out, magnetics and RJ45 on this board. The PHY stays on the module."
chip: For DNL-N6-32/64 and DNL-N6-32/64-R
category: Evaluation kit
highlights:
  - { value: "Carrier", label: "For the DNL-N6 SoM" }
  - { value: "RJ45", label: "Magnetics on this board" }
  - { value: "MDI", label: "From the SoM PHY" }
  - { value: "4–36 V", label: "Feeds the module" }
relatedProduct: dnl-n6
viewer:
  som: /models/dnl-n6.glb
  kit: /models/dnl-n6-dk.glb
  combined: /models/dnl-n6-on-dk.glb
onModule:
  - The DNL-N6 SoM (PHY, bucks, memories, MCU)
onCarrier:
  - Magnetics and RJ45
  - "Connectors for the SoM edge: CSI-2, USB, SWD, SDMMC, UART, I2C, SPI, GPIO"
  - 4–36 V input to the module
frozen:
  - ["Role", "Eval carrier for the DNL-N6"]
  - ["Ethernet", "Magnetics and RJ45 here; PHY on the SoM"]
  - ["Power", "Feeds 4–36 V to the module"]
open:
  - ["Connectors", "To be published with the design release"]
  - ["Mechanics", "To be published with the design release"]
specGroups:
  - title: Kit
    rows:
      - ["Order name", "DNL-N6 DevKit"]
      - ["Slug", "dnl-n6-dk"]
      - ["Fits", "DNL-N6-32/64 and DNL-N6-32/64-R"]
      - ["Ethernet", "Magnetics and RJ45 on the kit. MDI from the SoM PHY"]
      - ["Power", "4–36 V in, to the module bucks"]
      - ["Status", "Design in progress"]
---

The DevKit is how you try the module. It seats a DNL-N6 and brings the edge out to connectors, with magnetics and an RJ45 for the Gigabit PHY that already lives on the SoM.

Buy a bare SoM when you have a carrier. Register interest on this page for the kit, or on the [DNL-N6](/products/dnl-n6) page for a quantity of modules.
