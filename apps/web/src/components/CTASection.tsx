import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function CTASection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Qui andrà la logica per gestire la submission
    setEmail("");
  };

  return (
    <section className="py-20 sm:py-32 bg-[hsl(var(--color-muted))]">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl border-none bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-foreground))] shadow-2xl">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Mail className="h-8 w-8" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Inizia il tuo progetto oggi
              </h2>
              
              {/* Description */}
              <p className="mb-8 text-lg opacity-90">
                Ricevi una consulenza gratuita e scopri come possiamo aiutarti a raggiungere i tuoi obiettivi digitali
              </p>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                <Input
                  type="email"
                  placeholder="La tua email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/50"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-white text-[hsl(var(--color-primary))] hover:bg-white/90 font-semibold"
                >
                  Inizia ora
                </Button>
              </form>

              {/* Trust Badge */}
              <p className="mt-6 text-sm opacity-75">
                ✓ Nessuna carta di credito richiesta · ✓ Consulenza gratuita · ✓ Risposta in 24h
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-muted-foreground))]">
            Hanno scelto di lavorare con noi
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50">
            {["Company A", "Company B", "Company C", "Company D"].map((company) => (
              <div key={company} className="text-xl font-bold text-[hsl(var(--color-foreground))]">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}