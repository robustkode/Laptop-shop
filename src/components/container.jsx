import { cn } from "@/lib/utils";

export default function Container({
  as: Component = "section",
  className,
  children,
  ...restProps
}) {
  return (
    <Component
      className={cn("mx-auto max-w-[1000px] px-6", className)}
      {...restProps}
    >
      {children}
    </Component>
  );
}
