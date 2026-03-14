import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">App</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === href
                  ? "text-foreground font-medium"
                  : "text-foreground/60"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
