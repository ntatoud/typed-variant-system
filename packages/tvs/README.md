# tvs

Type-safe class variance builder — a maintained, boosted CVA replacement.

## Usage

```ts
import { tvs } from "tvs";

const button = tvs("btn")
  .variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .defaults({ size: "md" })
  .compound([{ size: "sm", color: "red", class: "ring-red" }]);

button({ color: "red" }); // 'btn text-md bg-red'
button({ size: "sm", color: "red" }); // 'btn text-sm bg-red ring-red'
```

### With a custom merge function (e.g. `tailwind-merge`)

```ts
import { createTvs } from "tvs";
import { twMerge } from "tailwind-merge";

export const { tvs } = createTvs({ merge: twMerge });
```

### Negation in compound rules

```ts
const btn = tvs("btn")
  .variants({ size: { sm: "text-sm", lg: "text-lg" }, disabled: { yes: "opacity-50", no: "" } })
  .compound([{ disabled: { not: "yes" }, class: "hover:opacity-80" }]);
```

## Development

- Install dependencies:

```bash
vp install
```

- Run the unit tests:

```bash
vp test
```

- Build the library:

```bash
vp pack
```
