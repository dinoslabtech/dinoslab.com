---
status: accepted
---

# Home, Products, and the DNL-N6 page keep one stack and these words

Home, Products, and the DNL-N6 page are the pages this rework changes. The words below are the copy. A later design session may change the site typeface and the display sizes of the Mark, the Wordmark, and the Logo. It may not change these words, redraw those files, or replace the Palette or Brand green.

## Home

Three blocks. On a wide screen the Mark sits beside the Wordmark and the Tagline. On a phone the Mark sits under the Tagline.

1. The Wordmark, then the Tagline “Electronic products.” The Tagline is not repeated in the header or the footer.
2. “DNL-N6”, the line “Not for sale yet.”, and a link to the product page.
3. info@dinoslab.com, linking to Contact. Home does not grow a second form.

The document title is “Dino's Lab · Electronic products”. The shared description, used when a page does not write its own, is “Electronic products from Dino's Lab. The first module is the DNL-N6, an STM32N657 SoM.”

## Products

The heading is “Products”. One row: “DNL-N6”, then “STM32N657 module. Not for sale yet.” The row links to the product page. On a phone the name sits above that line. The page description is that same line.

## DNL-N6

One stack at every width. The viewer sits under the title.

1. “DNL-N6”. “An STM32N657 module for a Carrier you design.” “Not for sale yet.” “Register interest”. The page description is that sentence. The order-code control defaults to `DNL-N6-P2x64-F128`, with “Two x16 PSRAM dice, 64 MB each, and one 128 MB octal NOR.” The other code is `DNL-N6-P1x64-F128`, with “One x16 PSRAM die, 64 MB, and one 128 MB octal NOR.” No pattern line.
2. The module viewer, full width. Until a model exists, the space says the CAD is in progress.
3. Six figures, value then label. Two columns on a phone, three when the screen is wide. STM32N657, Cortex-M55 and Neural-ART. x16 PSRAM, 128 MB or 64 MB, following the selected order code. 128 MB octal NOR. About 5–24 V, from the Carrier. Gigabit PHY, on the module. CSI-2, two data lanes.
4. “On the module”, then “On the Carrier”. Side by side only when there is room. Module: the STM32N657 with 4.2 MB SRAM and no on-chip flash; x16 PSRAM and the octal NOR; the Gigabit PHY; 3.3 V and 1.8 V made from the Carrier’s supply. Carrier: about 5–24 V in; magnetics, the jack, four MDI pairs, two LED nets, center-tap from the module’s 3.3 V; a CSI-2 connector; two USB high-speed ports, one with the USB-C CC pins; SWD, reset, and BOOT0; the rest of the I/O when the interconnect is accepted.
5. “Open.” Interconnect. Outline.
6. “Notes.” Links to the existing N6 posts.
7. “Register interest.” “This is not an order.” The form is name, email, order code, quantity, and a message. The message stays optional. Quantity stays 1–5, 6–20, 21–100, and 100+. The order-code choices are the two codes, default first.

The page does not mention FMC. It has no second specifications dump and no block diagram.

## Sentences outside those pages

HexaSPI opening: “DNL-N6 — x16 PSRAM and a 128 MB octal NOR on an STM32N657. DNL-N6-P2x64-F128 stuffs two 64 MB PSRAM dice. DNL-N6-P1x64-F128 stuffs one.”

Memory opening: “DNL-N6 — 4.2 MB on-chip SRAM, x16 PSRAM for frames, 128 MB octal NOR for boot and weights. The default order code stuffs 128 MB of PSRAM.”

Ethernet opening: “DNL-N6 — Gigabit PHY on the module. The Carrier routes the MDI pairs, the magnetics, and the jack.”

The rest of each note stays, including the HexaSPI explainer. About’s first paragraph becomes “Dino’s Lab designs solder-down modules in Ladispoli. The first board is the DNL-N6, an STM32N6 SoM for a carrier you design.” The Acme paragraph stays.

Header, footer, and the Contact page keep their current words. Contact stays the header button. The Contact form stays name, email, and message.

## Considered Options

- A pattern line under the order codes, and a line that there is no FMC SDRAM. The stuffing sentences already carry the sizes, and the page does not cite FMC.
- Keep the old Home lines about Ladispoli and Acme. The Tagline is the card line. Ladispoli and Acme stay on About.
- A specifications dump and the old block diagram under the figures. Both repeated the same facts, and the diagram still carried the retired numbers.

## Consequences

Every reworked page has to be readable on a phone: one column, the same facts as on a wide screen, a header lockup that fits. Blog layout, Consulting, Docs, thank-you, and the 404 stay. Checks that require a DevKit link or a DevKit form choice change with the pages.
