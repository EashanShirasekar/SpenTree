const Footer = () => {
  return (
    <footer className="relative bg-forest-deep border-t border-border/30">
      {/* Forest silhouette SVG */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full pointer-events-none">
        <svg viewBox="0 0 1440 120" className="w-full h-20 md:h-28" preserveAspectRatio="none">
          <path
            d="M0,120 L0,80 Q60,20 120,60 Q150,30 180,50 Q210,10 240,40 Q280,0 320,30 Q360,10 400,40 Q440,20 480,50 Q520,5 560,35 Q600,15 640,45 Q680,0 720,30 Q760,20 800,50 Q840,10 880,40 Q920,25 960,55 Q1000,15 1040,40 Q1080,5 1120,35 Q1160,20 1200,50 Q1240,10 1280,40 Q1320,25 1360,55 Q1400,30 1440,50 L1440,120 Z"
            fill="hsl(150 40% 11%)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌱</span>
              <span className="font-display text-xl text-foreground tracking-wider">
                Spen<span className="text-primary">tree</span>
              </span>
            </div>
            <p className="text-muted-foreground font-body text-sm max-w-md leading-relaxed">
              Grow wisely. Spend mindfully. Your financial forest awaits — every rupee planted today becomes tomorrow's shade.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm text-foreground font-semibold mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li className="hover:text-foreground transition-colors cursor-pointer">Features</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">How It Works</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Mobile App</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Pricing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm text-foreground font-semibold mb-4 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li className="hover:text-foreground transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Contact</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Twitter</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Discord</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-body">
            © 2026 Spentree. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-body pushkara-speech">
            "The forest never sleeps." 🌿
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
