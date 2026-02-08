import { Mail, Phone, Clock, ArrowUpRight } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="bg-footer text-footer-foreground pt-20 pb-10 relative overflow-hidden border-t border-border/20">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[200px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-extrabold mb-4 tracking-tight">
              <span className="text-gradient-primary">Ultra</span>
              <span className="text-foreground">View</span>
            </h3>
            <p className="text-footer-foreground/60 text-sm leading-relaxed max-w-sm mb-6">
              Premium monitor displays engineered for professionals, gamers, and creatives.
              Experience the difference that true quality makes.
            </p>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-[11px] font-medium text-primary tracking-wider uppercase">
                Available Worldwide
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground/70 mb-5 text-xs tracking-[0.15em] uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {["Products", "About Us", "Support", "Warranty"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-footer-foreground/50 hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground/70 mb-5 text-xs tracking-[0.15em] uppercase">
              Contact
            </h4>
            <ul className="space-y-3.5 text-sm text-footer-foreground/50">
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-primary/8 border border-primary/10 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-primary/60" />
                </div>
                support@ultraview.com
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-primary/8 border border-primary/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-primary/60" />
                </div>
                1-800-ULTRA-VIEW
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-primary/8 border border-primary/10 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-primary/60" />
                </div>
                Mon – Fri, 9am – 6pm EST
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-footer-foreground/30">
          <span>© {new Date().getFullYear()} UltraView. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
