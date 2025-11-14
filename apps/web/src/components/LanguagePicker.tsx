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
  Globe,
} from "lucide-react";
import { languages } from "@/i18n/ui";

export default function LanguagePicker() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [locale, setLocale] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("locale") || "en"
      : "en"
  );

  const handleChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);

    // ✅ Ricarica la pagina con il nuovo prefisso lingua (/it, /en, ecc.)
    const currentPath = window.location.pathname;
    const segments = currentPath.split("/").filter(Boolean);

    // Se il primo segmento è una lingua, lo sostituisco
    const currentLocale = Object.keys(languages).includes(segments[0])
      ? segments[0]
      : null;

    if (currentLocale) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    window.location.href = "/" + segments.join("/");
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <Globe className="h-4 w-4" />
        Languages
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[200px] gap-3 p-4 md:w-[250px] md:grid-cols-1 lg:w-[300px]">
          {Object.entries(languages).map(([language, label]) => {
            return (
              <li key={language}>
                <NavigationMenuLink
                  asChild
                  key={language}
                  onClick={() => handleChange(language)}
                >
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))] focus:bg-[hsl(var(--color-accent))] focus:text-[hsl(var(--color-accent-foreground))]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm font-medium leading-none">
                        {label}
                      </div>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            );
          })}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
