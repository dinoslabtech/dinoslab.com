import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Layers, Rocket, Code, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Performance Elevate",
    description: "Siti web ultra-veloci ottimizzati per ogni dispositivo con tempi di caricamento fulminei.",
  },
  {
    icon: Shield,
    title: "Sicurezza Garantita",
    description: "Proteggiamo i tuoi dati con le migliori pratiche di sicurezza e certificazioni SSL.",
  },
  {
    icon: Layers,
    title: "Architettura Moderna",
    description: "Stack tecnologico all'avanguardia con monorepo, TypeScript e framework moderni.",
  },
  {
    icon: Rocket,
    title: "Deploy Automatico",
    description: "Pipeline CI/CD integrate per rilasci rapidi e senza interruzioni di servizio.",
  },
  {
    icon: Code,
    title: "Codice Pulito",
    description: "Standard elevati di qualità del codice con testing completo e documentazione.",
  },
  {
    icon: Users,
    title: "Team Dedicato",
    description: "Supporto costante e comunicazione trasparente durante tutto il ciclo di vita del progetto.",
  },
];

export default function Features() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Tutto ciò di cui hai bisogno
          </h2>
          <p className="text-lg text-[hsl(var(--color-muted-foreground))]">
            Offriamo soluzioni complete per portare il tuo business online con tecnologie all'avanguardia
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-[hsl(var(--color-border))] transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Technology Stack */}
        <div className="mt-20 text-center">
          <p className="mb-8 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-muted-foreground))]">
            Tecnologie che utilizziamo
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale">
            {["Astro", "React", "TypeScript", "Tailwind", "Turbo", "pnpm"].map((tech) => (
              <div key={tech} className="text-2xl font-bold text-[hsl(var(--color-foreground))]">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}