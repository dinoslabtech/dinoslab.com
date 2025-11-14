import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  X,
  Code,
  Smartphone,
  Palette,
  Users,
  BookOpen,
  Mail,
} from "lucide-react";
import LanguagePicker from "@/components/LanguagePicker";
import { useTranslatedPath, getLangFromUrl } from "@/i18n/utils";

const services = [
  {
    icon: Code,
    title: "Sviluppo Web",
    description: "Applicazioni web moderne e scalabili",
    href: "#web-dev",
  },
  {
    icon: Smartphone,
    title: "App Mobile",
    description: "Applicazioni native e cross-platform",
    href: "#mobile-dev",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Design intuitivi e accattivanti",
    href: "#design",
  },
];

const company = [
  {
    icon: Users,
    title: "Chi siamo",
    description: "Scopri il nostro team e la nostra missione",
    href: "#about",
  },
  {
    icon: BookOpen,
    title: "Portfolio",
    description: "I nostri progetti di successo",
    href: "#portfolio",
  },
  {
    icon: Mail,
    title: "Contatti",
    description: "Parliamo del tuo progetto",
    href: "#contact",
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--color-background))]/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-foreground))] font-bold text-xl">
            Dino's Lab
          </div>
          <span className="text-xl font-bold">Dinoslab</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href=
                  className={navigationMenuTriggerStyle()}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Servizi</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {services.map((service) => {
                      const Icon = service.icon;
                      return (
                        <li key={service.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={service.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))] focus:bg-[hsl(var(--color-accent))] focus:text-[hsl(var(--color-accent-foreground))]"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                                <div className="text-sm font-medium leading-none">
                                  {service.title}
                                </div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-[hsl(var(--color-muted-foreground))]">
                                {service.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Azienda</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {company.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))] focus:bg-[hsl(var(--color-accent))] focus:text-[hsl(var(--color-accent-foreground))]"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                                <div className="text-sm font-medium leading-none">
                                  {item.title}
                                </div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-[hsl(var(--color-muted-foreground))]">
                                {item.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/blog/"
                  className={navigationMenuTriggerStyle()}
                >
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>
              <LanguagePicker />
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4 ml-4">
            <Button variant="ghost" size="sm">
              Accedi
            </Button>
            <Button size="sm">Inizia gratis</Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] md:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              <a
                href="#"
                className="block text-sm font-medium text-[hsl(var(--color-foreground))]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>

              <div>
                <p className="text-sm font-semibold text-[hsl(var(--color-foreground))] mb-2">
                  Servizi
                </p>
                <ul className="space-y-2 pl-4">
                  {services.map((service) => (
                    <li key={service.title}>
                      <a
                        href={service.href}
                        className="block text-sm text-[hsl(var(--color-muted-foreground))]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {service.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-[hsl(var(--color-foreground))] mb-2">
                  Azienda
                </p>
                <ul className="space-y-2 pl-4">
                  {company.map((item) => (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        className="block text-sm text-[hsl(var(--color-muted-foreground))]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#blog"
                className="block text-sm font-medium text-[hsl(var(--color-foreground))]"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button variant="ghost" className="w-full">
                Accedi
              </Button>
              <Button className="w-full">Inizia gratis</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
