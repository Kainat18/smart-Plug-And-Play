import { Zap, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export type DemoMode = "default" | "gaming" | "professional" | "budget";

interface DemoControlBarProps {
  activeMode: DemoMode;
  onModeChange: (mode: DemoMode) => void;
}

const modes = [
  { key: "gaming" as DemoMode, label: "Gaming", icon: "🎮", dot: "bg-gaming" },
  { key: "professional" as DemoMode, label: "Pro", icon: "💼", dot: "bg-professional" },
  { key: "budget" as DemoMode, label: "Budget", icon: "💰", dot: "bg-budget" },
] as const;

const DemoControlBar = ({ activeMode, onModeChange }: DemoControlBarProps) => {
  const handleClick = (mode: DemoMode) => {
    onModeChange(mode);
  window.simulateIntent?.(mode);
  };

  const handleReset = () => {
    onModeChange("default");
    window.resetDemo?.();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-demo/90 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4 py-1.5 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 mr-2">
          <Zap className="w-3 h-3 text-primary animate-glow-pulse" />
          <span className="font-semibold text-primary text-[10px] tracking-[0.25em] uppercase hidden sm:inline">
            Live Demo
          </span>
        </div>

        <div className="flex items-center gap-0.5 bg-secondary/50 rounded-lg p-0.5 border border-border/40">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => handleClick(m.key)}
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300"
            >
              {activeMode === m.key && (
                <motion.div
                  layoutId="demo-active"
                  className="absolute inset-0 bg-primary rounded-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                <span className="hidden sm:inline">{m.icon}</span>
                <span className={activeMode === m.key ? "text-primary-foreground" : "text-demo-foreground"}>
                  {m.label}
                </span>
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-demo-foreground/40 hover:text-primary transition-colors duration-200"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};

export default DemoControlBar;
