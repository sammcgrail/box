import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Powered by Bun and Vite for near-instant builds and hot module replacement.",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description:
      "Containerized with Docker and served via Caddy with automatic HTTPS support.",
  },
  {
    icon: Globe,
    title: "Self-Hosted",
    description:
      "Runs on your own Hetzner server — full control over your infrastructure.",
  },
];

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <Badge variant="secondary" className="mb-2">
          Running on Hetzner
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Ship fast.
          <br />
          <span className="text-muted-foreground">Own your stack.</span>
        </h1>
        <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
          A minimal TypeScript + React + Bun starter, containerized with Docker
          and served through Caddy — ready to deploy to any VPS.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/about" className={cn(buttonVariants({ size: "lg" }))}>
            Learn more <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            View source
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stack section */}
      <section className="border-t bg-muted/40 py-16">
        <div className="container text-center">
          <h2 className="mb-2 text-2xl font-bold">The stack</h2>
          <p className="mb-8 text-muted-foreground">
            Carefully chosen tools that work well together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React 18",
              "TypeScript",
              "Vite",
              "Bun",
              "Tailwind CSS",
              "shadcn/ui",
              "React Router",
              "Docker",
              "Caddy",
              "Hetzner",
            ].map((tech) => (
              <Badge key={tech} variant="outline" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
