import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-surface-300 bg-background/90 py-10 px-4 sm:px-8 mt-16 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-electric-blue to-violet flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-white">OneAtlas.dev</span>
          </div>
          <p className="max-w-md text-gray-400 leading-relaxed text-[11px]">
            AI Model Discovery & Intelligence Platform for engineering teams, researchers, and enterprises. Explore architectures, compare context windows, and evaluate benchmark metrics.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 text-xs">
          <div>
            <div className="font-semibold text-gray-200 mb-2">Explore</div>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link href="/models" className="hover:text-electric-blue transition-colors">All Models</Link></li>
              <li><Link href="/compare" className="hover:text-electric-blue transition-colors">Model Comparison</Link></li>
              <li><Link href="/rankings" className="hover:text-electric-blue transition-colors">Leaderboards</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-gray-200 mb-2">Ecosystem</div>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link href="/companies" className="hover:text-electric-blue transition-colors">AI Labs & Creators</Link></li>
              <li><Link href="/providers" className="hover:text-electric-blue transition-colors">Inference Gateways</Link></li>
              <li><Link href="/about" className="hover:text-electric-blue transition-colors">Methodology & About</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-surface-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
        <div>
          © {new Date().getFullYear()} OneAtlas.dev – Production MVP Assignment. Built with Next.js, Prisma & PostgreSQL.
        </div>
        <div className="flex items-center gap-1">
          <span>Curated for modern AI engineering</span>
        </div>
      </div>
    </footer>
  );
};
