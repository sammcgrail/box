import "@/styles/wordart.css";
import {
  Gamepad2,
  PaintBucket,
  Grid3X3,
  Bomb,
  Brush,
  CheckSquare,
  Blocks,
  Joystick,
  Crosshair,
  Droplets,
  Castle,
  Crown,
  Globe,
  Trophy,
  Atom,
} from "lucide-react";

const apps = [
  {
    name: "Snake",
    desc: "Nokia 3310 classic",
    href: "/snake",
    icon: Joystick,
    color: "#4ade80",
  },
  {
    name: "Tetris",
    desc: "Block stacking",
    href: "/tetris",
    icon: Blocks,
    color: "#60a5fa",
  },
  {
    name: "Brick Breaker",
    desc: "Smash all the bricks",
    href: "/brick/",
    icon: Gamepad2,
    color: "#f472b6",
  },
  {
    name: "Minesweeper",
    desc: "Win95 style",
    href: "/minesweeper",
    icon: Bomb,
    color: "#facc15",
  },
  {
    name: "Paint",
    desc: "MSPaint clone",
    href: "/paint",
    icon: PaintBucket,
    color: "#c084fc",
  },
  {
    name: "MP Paint",
    desc: "Multiplayer canvas",
    href: "/mppaint",
    icon: Brush,
    color: "#fb923c",
  },
  {
    name: "ASCII Life",
    desc: "Conway's Game of Life",
    href: "/ascii",
    icon: Grid3X3,
    color: "#2dd4bf",
  },
  {
    name: "MP Todo",
    desc: "Shared todo list",
    href: "/mptodo",
    icon: CheckSquare,
    color: "#94a3b8",
  },
  {
    name: "Tank Wars",
    desc: "Multiplayer artillery",
    href: "/tank",
    icon: Crosshair,
    color: "#ef4444",
  },
  {
    name: "Sand Game",
    desc: "Falling sand sim",
    href: "/sand/",
    icon: Droplets,
    color: "#f59e0b",
  },
  {
    name: "PixelClash",
    desc: "Particle tower defense",
    href: "/tower/",
    icon: Castle,
    color: "#8b5cf6",
  },
  {
    name: "6D Chess",
    desc: "Multidimensional chess",
    href: "/chess/",
    icon: Crown,
    color: "#e2e8f0",
  },
  {
    name: "Radarling",
    desc: "Weather radar globe",
    href: "/radarling/",
    icon: Globe,
    color: "#38bdf8",
  },
  {
    name: "Pickleball",
    desc: "Score tracker",
    href: "/pickleball/",
    icon: Trophy,
    color: "#7ec845",
  },
  {
    name: "Sparks",
    desc: "3D atomic viewer",
    href: "/sparks/",
    icon: Atom,
    color: "#06b6d4",
  },
];

export function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16 min-h-[calc(100vh-8rem)]">
      <h1 className="sebland-title mb-2">
        SEBLAND
      </h1>
      <p className="text-sm text-muted-foreground mb-12">
        tiny apps, built by robots
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.href}
            className="group relative flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
            style={
              {
                "--glow-color": app.color,
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" style={{
              boxShadow: `0 0 20px -4px ${app.color}22, 0 0 40px -8px ${app.color}11`,
            }} />
            <app.icon
              size={28}
              strokeWidth={1.5}
              className="transition-colors duration-300"
              style={{ color: `${app.color}88` }}
            />
            <div className="text-center">
              <div className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                {app.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {app.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
