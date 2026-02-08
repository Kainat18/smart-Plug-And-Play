import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-[37px] z-40 glass">
      <div className="container mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-display text-xl font-extrabold tracking-tight flex items-center gap-0.5">
          <span className="text-gradient-primary">Ultra</span>
          <span className="text-foreground">View</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {["Products", "About", "Support"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Cart */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.4)]">
            <ShoppingCart className="w-4 h-4" />
            Cart (0)
          </button>
          <button
            className="md:hidden text-foreground p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {["Products", "About", "Support"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-muted-foreground hover:text-primary hover:bg-secondary/50 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
