import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(var(--color-background))] to-[hsl(var(--color-muted))] py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <Badge className="gap-2 px-4 py-2">
              <Sparkles className="h-4 w-4" />
              Nuova esperienza digitale
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Trasformiamo le tue{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))] bg-clip-text text-transparent">
              idee digitali
            </span>{" "}
            in realtà
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-[hsl(var(--color-muted-foreground))] sm:text-xl">
            Creiamo soluzioni web moderne e scalabili utilizzando le tecnologie più avanzate. 
            Dal design all'implementazione, ti accompagniamo in ogni fase del progetto.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2">
              Inizia ora
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Scopri i progetti
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "50+", label: "Progetti completati" },
              { value: "98%", label: "Clienti soddisfatti" },
              { value: "24/7", label: "Supporto" },
              { value: "5+", label: "Anni esperienza" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[hsl(var(--color-primary))]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-[hsl(var(--color-muted-foreground))]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-20" aria-hidden="true">
        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))]" />
      </div>
    </section>
  );
}