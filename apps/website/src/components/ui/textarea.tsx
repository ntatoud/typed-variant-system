import * as React from "react";
import { type VariantProps, tvs, sizeShape } from "@/lib/utils";

const textareaVariants = tvs(
  "flex field-sizing-content w-full resize-none rounded-2xl border border-transparent bg-input/50 px-3 transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  sizeShape,
)
  .variants({
    size: {
      sm: "min-h-14 py-2 text-xs",
      default: "min-h-16 py-3 text-sm",
      lg: "min-h-20 py-3.5 text-base",
    },
  })
  .defaults({ size: "default" });

function Textarea({
  className,
  size,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea data-slot="textarea" className={textareaVariants({ size, className })} {...props} />
  );
}

export { Textarea, textareaVariants };
