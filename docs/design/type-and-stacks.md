# Type and stacks

Design for Home, Products, and the DNL-N6 page. The words, the order of each stack, the Palette, and Brand green are already accepted. This file sets the site typeface, the type scale, and the display sizes of the Mark, the Wordmark, and the Logo.

The next session builds these pages. It does not reopen these choices.

## Subject

Dino's Lab publishes one Product, the DNL-N6, for an engineer who will design a Carrier. The page is a short hardware sheet: a name, an order code, six figures, what is on the module, what is on the Carrier, and what is still Open. The Wordmark is a drawing. Type does not try to be a second logo.

## Principles

- The Wordmark on Home is the only display object. Set type stays at reading sizes.
- One text face, two weights. Mono is for an order code and nothing else.
- Left aligned, ragged right. The same facts appear on a phone, in one column.
- The six figures are a grid of value then label. They are not cards, stats, or a table.
- Brand green is the drawings and the primary button. It is not a text color.

## Reviewed against the brief

A sans at the same job as Inter would only rename the current page. The Wordmark is already a bold sans drawing, chosen because it is not PT Sans or the other studied faces. A text serif sits beside that drawing as a different voice.

Charter was the first serif, because it was cut for coarse screens. It is not published on Fontsource, and this site loads faces from Fontsource the way it loads Inter. Source Serif 4 does the same job and ships the same way. Use its weight axis only. Do not load its italic, and do not use an optical-size display cut.

These were dropped while reviewing the plan:

- A viewport-scaled Wordmark. Home uses a fixed wide size and a capped phone size.
- The figure-grid behind the Mark. On a wide screen the Mark sits beside the Wordmark and the Tagline. On a phone it sits under the Tagline.
- Boxed figure cells. The figures are open columns.
- A new palette, new sentences, and a Logo dropped into the header.

The canvas gradient and the 3px brand line at the top of the page stay. They are existing ground, outside this pass. The share image stays as it is.

## Color

Use the locked dark roles. Do not add a color. There is no public theme switcher.

| Role | Hex | Use |
| --- | --- | --- |
| Canvas | `#121817` | Page ground |
| Panel | `#1C2422` | Header, flat panels |
| Raised | `#29332F` | The module viewer and the interest form |
| Ink | `#EDF2EF` | Titles, values, body sentences |
| Muted | `#B2BEB8` | The Tagline, status lines, figure labels |
| Brand green | `#2D9282` | Mark, Wordmark, Logo, primary button |
| Accent text | `#8FD9C1` | Links on hover, the email link, the focus ring |
| Divider | `#3B4942` | Hairlines between blocks |

Primary button labels use `#07120E`.

## Type

Text face: Source Serif 4 Variable, from `@fontsource-variable/source-serif-4/wght.css`. The CSS family is `"Source Serif 4 Variable"`. Load the roman weight axis only.

Order codes: JetBrains Mono, the files already loaded, weight 400. Turn ligatures off on those strings.

Remove Inter. Remove `cv11` and `ss01`. Keep kerning. Do not set letter-spacing. Do not use italic. Do not synthesize a bold.

Two weights. Body, UI, labels, and buttons that are not primary use 400. Titles, the six values, and the primary button use 600.

### Scale

Four sizes. Nothing is set smaller than 16px. Nothing in the text face is set larger than 24px.

| Role | Size | Line-height | Weight | Use |
| --- | --- | --- | --- | --- |
| Body | 1.125rem (18px) | 1.55 | 400 | Sentences, the Tagline, lists, the stuffing sentence |
| UI | 1rem (16px) | 1.45 | 400 | Header nav, footer, figure labels, form labels, “This is not an order.”, buttons |
| Title | 1.5rem (24px) | 1.25 | 600 | “DNL-N6”, “Products”, “On the module”, “On the Carrier”, “Open.”, “Notes.”, “Register interest.” |
| Value | 1.25rem (20px) | 1.3 | 600 | The six figures |
| Code | 1rem (16px) | 1.45 | 400 mono | An order code |

Titles and values stay these sizes on a phone and on a wide screen. The wide screen spends its extra room on the Wordmark and on columns.

Prose measure is 36rem, about 70 characters in this face at 18px. The shell stays `max-w-6xl`. The viewer, the figures, and the header use the shell. Sentences use the measure.

Shared controls follow the UI role: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, and fields. Primary buttons are weight 600, min-height 44px, radius 4px, label in `#07120E`. No arrow on a button.

Text links that are an address or a sentence are accent text with an underline. A product name that is a link stays ink and turns accent text on hover and focus. The focus ring stays 2px `--focus-ring`.

## Mark, Wordmark, and Logo

The Wordmark file is 2077.1 by 375.1, about 5.54 times as wide as it is tall. Set the height and let the width follow. The Mark file is a square. The drawn animal is about 86.5% of that square. The animal stays at least 37px, so a Mark box is at least 44px.

The Logo is the square file, Mark above Wordmark. Header, footer, and Home use the Mark and the Wordmark as two files. They do not use the Logo. The share image already places the Logo at 420px in `resources/og.html`. Leave that file and `public/og.png` alone.

Header composition stays: Mark, then Wordmark, then the nav or the menu, then Contact. The bar is `--header-bg` with a divider under it.

| Place | Mark box | Wordmark | Logo |
| --- | --- | --- | --- |
| Header, under 640px | 44px | height 24px, about 133px wide | not placed |
| Header, from 640px | 52px | height 28px, about 155px wide | not placed |
| Footer | 44px | height 24px | not placed |
| Home, under 640px | 96px, under the Tagline, left aligned | width of the column, capped at 20rem | not placed |
| Home, from 640px | 120px, beside the Wordmark and the Tagline | height 72px, about 399px wide | not placed |
| Share image | — | — | 420px, unchanged |

Header and footer gap between Mark and Wordmark is 0.75rem. Header bar height is 4rem under 640px and 4.5rem from 640px.

At 320px the header is 16px of padding, a 44px Mark, 12px, a 133px Wordmark, and a 44px menu. That fits, with room between the Wordmark and the menu. Do not shrink the Wordmark under 24px or the Mark under 44px to make the bar shorter.

Footer lockup matches the phone header. The Tagline is not under it.

Home, from 640px: the text block and the Mark are one row, vertically centered, gap 2.5rem. The row fits at 640px because the shell padding in force is 1rem: the content width is about 608px, and 399 + 40 + 120 is 559. Under 640px the Wordmark, the Tagline, and the Mark stack, in that order. The phone Wordmark is `min(100%, 20rem)` wide, so its height is about 52px on a 320px screen and about 58px once the column reaches 20rem.

The header link keeps the screen-reader name “Dino's Lab” and empty image alts. The footer Wordmark keeps the site name as its alt. The Home Mark keeps its current alt.

## Home

Document title: “Dino's Lab · Electronic products”. Shared description, when a page does not write its own: “Electronic products from Dino's Lab. The first module is the DNL-N6, an STM32N657 SoM.”

Three blocks. Left aligned. Hairline between blocks. Gap inside a block is smaller than the gap between blocks: 0.75rem from the Wordmark to the Tagline, 0.5rem from the product name to its status line. Block padding is 3rem on a phone and 4rem from 640px.

```
under 640px                         from 640px

[ Wordmark, max 20rem ]             [ Wordmark, 72px tall ]    [ Mark 120 ]
Electronic products.                Electronic products.
[ Mark 96 ]
─────────────────────────────────
DNL-N6                              DNL-N6
Not for sale yet.                   Not for sale yet.
─────────────────────────────────
info@dinoslab.com                   info@dinoslab.com
```

The Tagline is body size, muted. It appears only here.

“DNL-N6” is the title role. “Not for sale yet.” is body, muted. The two lines are one link to `/products/dnl-n6`. The name is the link text. There is no second link and no new label.

`info@dinoslab.com` is body size, accent text, underlined, and it links to `/contact`.

## Products

Heading “Products”, title role. Description: “STM32N657 module. Not for sale yet.”

One row, one link to `/products/dnl-n6`. Hairline under the row.

```
under 640px                         from 640px

DNL-N6                              DNL-N6    STM32N657 module. Not for sale yet.
STM32N657 module. Not for sale yet.
```

On a phone the name is above the line, gap 0.25rem. From 640px they sit on one row, baseline aligned, gap 1.5rem. The name does not shrink. The line wraps in the remaining width.

## DNL-N6

One stack at every width. The page description is “An STM32N657 module for a Carrier you design.”

```
under 640px                         from 640px

DNL-N6                              DNL-N6
An STM32N657 module for a           An STM32N657 module for a
Carrier you design.                 Carrier you design.
Not for sale yet.                   Not for sale yet.
[ Register interest ]               [ Register interest ]
( ) DNL-N6-P2x64-F128               ( ) DNL-N6-P2x64-F128
( ) DNL-N6-P1x64-F128               ( ) DNL-N6-P1x64-F128
Two x16 PSRAM dice, 64 MB each,     Two x16 PSRAM dice, 64 MB each,
and one 128 MB octal NOR.           and one 128 MB octal NOR.

[ viewer, full width ]              [ viewer, full width ]

STM32N657          128 MB           STM32N657       128 MB        128 MB
Cortex-M55 and     x16 PSRAM        Cortex-M55 and  x16 PSRAM     octal NOR
Neural-ART

128 MB             About 5–24 V     About 5–24 V    Gigabit PHY   CSI-2
octal NOR          from the Carrier from the Carrier on the module two data lanes

Gigabit PHY        CSI-2
on the module      two data lanes

On the module                       On the module     |  On the Carrier
…                                   …                    …

Open.                               Open.
Interconnect                        Interconnect
Outline                             Outline

Notes.                              Notes.
…                                   …

Register interest.                  Register interest.
This is not an order.               This is not an order.
[ form ]                            [ form ]
```

The title block is within the measure.

“An STM32N657 module for a Carrier you design.” is body, ink. “Not for sale yet.” is body, muted.

“Register interest” is the primary button and points at the form on this page.

The order-code control is two radios. Each code is JetBrains Mono at 16px. The first is selected: `DNL-N6-P2x64-F128`, with “Two x16 PSRAM dice, 64 MB each, and one 128 MB octal NOR.” The other is `DNL-N6-P1x64-F128`, with “One x16 PSRAM die, 64 MB, and one 128 MB octal NOR.” Show the sentence for the selected code, in the body role, under the radios. Changing the radio changes that sentence and the PSRAM figure. There is no pattern line.

The viewer is full shell width, the raised surface, min-height 16rem under 640px and 22rem from 640px. It shows the module alone. Until a model exists, the space says “CAD in progress.” in the UI role, muted. Reset stays when a model is present. No second model and no tabs.

The six figures are value, then label. Order:

1. STM32N657 — Cortex-M55 and Neural-ART
2. 128 MB, or 64 MB when the second order code is selected — x16 PSRAM
3. 128 MB — octal NOR
4. About 5–24 V — from the Carrier
5. Gigabit PHY — on the module
6. CSI-2 — two data lanes

Values are the value role, ink. Labels are the UI role, muted, 0.25rem under the value. Two columns under 640px, three from 640px, reading left to right in the order above. Column gap 2rem, row gap 1.5rem. One hairline above the group. Values may wrap. They are left aligned.

“On the module”, then “On the Carrier”. Stacked under 640px, side by side from 640px, gap 2.5rem. A hairline between them only when stacked. Each item is a plain list, disc markers in the muted color, body ink:

On the module:

- the STM32N657 with 4.2 MB SRAM and no on-chip flash
- x16 PSRAM and the octal NOR
- the Gigabit PHY
- 3.3 V and 1.8 V made from the Carrier’s supply

On the Carrier:

- about 5–24 V in
- magnetics, the jack, four MDI pairs, two LED nets, center-tap from the module’s 3.3 V
- a CSI-2 connector
- two USB high-speed ports, one with the USB-C CC pins
- SWD, reset, and BOOT0
- the rest of the I/O when the interconnect is accepted

“Open.” is the title role. Then two body lines: Interconnect. Outline. No candidates and no dimensions.

“Notes.” is the title role. Then a list of links to the existing posts tagged `n6`, using each post’s title. Not the systemctl post.

“Register interest.” is the title role. “This is not an order.” is the UI role, muted. The form is the raised surface. Fields, in order: name, email, order code, quantity, message. The message is optional. Quantity stays 1–5, 6–20, 21–100, and 100+. The order-code choices are the two codes, default first. The submit button says “Register interest”.

The page does not mention FMC. It has no second specifications dump and no block diagram.

## What stays put

Header, footer, and Contact keep their current words. Contact stays the header button. The Contact form stays name, email, and message. Footer columns stay “Site” and “Contact”, the nav links, the copyright, and the location. Set those footer headings and the copyright line in the UI role, muted, in the text face. The words are already sentence case.

Do not rearrange Blog, About, Consulting, Docs, thank-you, or the 404. The text face still applies, because there is one site face. Leave their templates, the blog Example aside, and `ContactLinks` as they are.

About’s first paragraph becomes “Dino’s Lab designs solder-down modules in Ladispoli. The first board is the DNL-N6, an STM32N6 SoM for a carrier you design.” The Acme paragraph stays.

Three note openings change, and the rest of each note stays:

- HexaSPI: “DNL-N6 — x16 PSRAM and a 128 MB octal NOR on an STM32N657. DNL-N6-P2x64-F128 stuffs two 64 MB PSRAM dice. DNL-N6-P1x64-F128 stuffs one.”
- Memory: “DNL-N6 — 4.2 MB on-chip SRAM, x16 PSRAM for frames, 128 MB octal NOR for boot and weights. The default order code stuffs 128 MB of PSRAM.”
- Ethernet: “DNL-N6 — Gigabit PHY on the module. The Carrier routes the MDI pairs, the magnetics, and the jack.”

## Motion

No page-load animation. Hover, focus, and the viewer are the motion. Respect reduced motion on the viewer.
