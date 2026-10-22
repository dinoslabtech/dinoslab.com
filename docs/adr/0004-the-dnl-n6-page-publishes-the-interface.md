---
status: accepted
---

# The DNL-N6 page publishes the interface

The DNL-N6 page gives an engineer enough to choose an order code and design a Carrier. It names the STM32N657, both order codes and their PSRAM and NOR sizes, about 5–24 V in, 3.3 V and 1.8 V made on the module, a limited 3.3 V back to the Carrier, a Gigabit PHY with the magnetics and the jack on the Carrier, MIPI CSI-2 with two data lanes, two USB high-speed ports with USB-C CC pins on one, and SWD, reset, and BOOT0. It does not mention FMC. Memory is called x16 PSRAM. The interconnect and the outline are named as Open, with no candidates and no dimensions.

The full ST order code, memory and PHY and buck part numbers, the ball map, pin names, ampere budgets, and any price stay in the hardware spec.

## Considered Options

- Publish the hardware spec, including part numbers, 50 × 50 mm, and the connector sketches. The outline and the interconnect are still Open, so a Carrier designed to those figures would be wrong if CAD moves them.
- Leave the live figures in place: 4–36 V, 32 MB PSRAM, 64 MB NOR, and optional FMC RAM. They contradict the accepted spec.

## Consequences

On a phone each fact is a label with its value under it, in the same order as on a wide screen. The picture is the module alone.
