import Container from "@/components/container";
import { cn } from "@/lib/utils";

export default function PageHero({ header, description, className }) {
  return (
    <section className="bg-primary-var text-primary-foreground">
      <Container className={cn("sm:py-12 py-8 flex gap-6 flex-col", className)}>
        <h1 className="font-oswald text-3xl sm:text-5xl">{header}</h1>
        <p>{description}</p>
      </Container>
    </section>
  );
}
