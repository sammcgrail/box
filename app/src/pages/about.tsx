import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stack = [
  {
    name: "Bun",
    description:
      "A fast all-in-one JavaScript runtime. Used as the package manager and build runner — significantly faster than npm/yarn.",
  },
  {
    name: "Vite",
    description:
      "Next-generation frontend build tool. Instant dev server startup and optimized production builds using Rollup.",
  },
  {
    name: "React + TypeScript",
    description:
      "UI library with full type safety. Component-based architecture with strict TypeScript for maintainable code.",
  },
  {
    name: "Tailwind CSS + shadcn/ui",
    description:
      "Utility-first CSS framework paired with beautifully designed, accessible components you own and can customize.",
  },
  {
    name: "React Router v6",
    description:
      "Client-side routing with nested routes, loaders, and a clean API. All routes defined in a single place.",
  },
  {
    name: "Docker",
    description:
      "Multi-stage build: Bun compiles the app, Caddy serves the static output. Single container, minimal image size.",
  },
  {
    name: "Caddy",
    description:
      "Modern web server written in Go. Handles HTTPS automatically, SPA fallback routing, and Gzip compression.",
  },
];

export function About() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">About</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          A production-ready starter template for self-hosted web applications.
          Each piece of the stack was chosen for simplicity, performance, and
          developer experience.
        </p>

        <div className="grid gap-4">
          {stack.map(({ name, description }) => (
            <Card key={name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
