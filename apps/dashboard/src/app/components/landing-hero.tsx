"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Bot, Search, Workflow, GraduationCap,
  Shield, Globe, Zap, Code2, BarChart3, BrainCircuit,
  Sparkles, CheckCircle2, ChevronRight, GalleryVerticalEnd
} from "lucide-react";
import { LandingHeader } from "./landing-header";
import { motion } from "motion/react";
import FeaturesSectionDemo from "@/components/features-section-demo-1";
import InfiniteMovingCardsDemo from "@/components/infinite-moving-cards-demo";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────── */
/* DATA                                                      */
/* ──────────────────────────────────────────────────────── */
const galleryItems = [
  {
    title: "Enterprise Dashboard",
    desc: "Real-time AI analytics and operations command center.",
    img: "/saas_dashboard_poster_1_1778158563663.png",
    category: "Platform"
  },
  {
    title: "AI Agent Builder",
    desc: "Node-based autonomous agent orchestration.",
    img: "/ai_agent_builder_poster_1778158581171.png",
    category: "Tools"
  },
  {
    title: "Market Intelligence",
    desc: "Deep-web research platform powered by Exa AI.",
    img: "https://9a9acjnyu4udzabn.private.blob.vercel-storage.com/public/Generated%20Image%20June%2008%2C%202026%20-%2012_31PM%20%281%29.png",
    category: "Research"
  },
];

const techStack = [
  "Next.js 16", "Firebase", "Vercel AI SDK", "TypeScript",
  "Exa AI", "OpenAI", "LangChain", "Tailwind CSS",
];

/* ──────────────────────────────────────────────────────── */
/* COMPONENT                                                */
/* ──────────────────────────────────────────────────────── */
export function LandingHero() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-400 overflow-x-hidden selection:bg-neutral-800">
      <LandingHeader />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Deep dark background with subtle silver glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 text-[10px] font-bold tracking-[0.2em] uppercase">
              <Sparkles className="h-3 w-3" /> The Agentic Agency
            </div>

            <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white leading-tight">
              Building the future of <br />
              <span className="bg-gradient-to-r from-neutral-200 via-neutral-500 to-neutral-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                Autonomous Enterprise.
              </span>
            </h1>

            <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
              High-performance AI orchestration for digital agencies.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-sm bg-white text-black hover:bg-neutral-200 rounded-full font-bold transition-all">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-sm border-neutral-800 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full font-bold transition-all">
                  Enterprise Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GALLERY SHOWCASE ──────────────────────── */}
      <section id="showcase" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">Our Solutions</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">High-performance platforms built for the modern agentic enterprise.</p>
          </div>

          <BentoGrid className="max-w-7xl mx-auto">
            {galleryItems.map((item, i) => (
              <BentoGridItem
                key={i}
                title={<span className="text-white text-lg">{item.title}</span>}
                description={<span className="text-neutral-500 text-sm">{item.desc}</span>}
                header={
                  <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 relative group/image">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" className="bg-white text-black hover:bg-neutral-200 rounded-full font-bold">
                        Learn More
                      </Button>
                    </div>
                  </div>
                }
                className={i === 1 || i === 2 ? "md:col-span-2" : "md:col-span-1"}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────── */}
      <section className="py-24 px-6 border-t border-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">Enterprise Infrastructure</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Scalable, secure, and built for the high demands of agency operations.</p>
          </div>
          <FeaturesSectionDemo />
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section className="py-24 px-6 border-y border-neutral-900/50 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">Trusted by Founders</h2>
          </div>
          <InfiniteMovingCardsDemo />
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">Simple Pricing</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Scalable plans for agencies of all sizes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$49", features: ["3 AI Agents", "Basic Analytics", "Community Support"] },
              { name: "Professional", price: "$149", features: ["10 AI Agents", "Advanced Analytics", "Priority Support", "Custom Integrations"], popular: true },
              { name: "Enterprise", price: "Custom", features: ["Unlimited Agents", "Full White-label", "Dedicated Manager", "SLA Guarantee"] },
            ].map((plan) => (
              <div key={plan.name} className={cn(
                "relative p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-full",
                plan.popular ? "bg-neutral-900 border-neutral-700 scale-105 z-10" : "bg-neutral-900/30 border-neutral-800 hover:border-neutral-700"
              )}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white text-xl font-medium">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-neutral-500 text-sm">/mo</span>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-neutral-500" />
                        <span className="text-neutral-400 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className={cn(
                  "mt-8 w-full h-12 rounded-full font-bold transition-all",
                  plan.popular ? "bg-white text-black hover:bg-neutral-200" : "bg-neutral-800 text-white hover:bg-neutral-700"
                )}>
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────── */}
      <section className="py-16 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto space-y-10">
          <p className="text-center text-slate-600 text-xs uppercase tracking-[0.3em] font-bold">
            The Modern AI Stack
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <span key={tech} className="px-6 py-2 bg-white/5 border border-slate-900 rounded-full text-slate-400 text-sm font-medium hover:text-white hover:border-blue-500/30 transition-all cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-neutral-500/5 blur-[120px] rounded-full group-hover:bg-neutral-500/10 transition-all" />
          <div className="relative bg-[#0d0d0d] border border-neutral-900 p-16 md:p-24 rounded-[4rem] text-center space-y-10 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Zap className="h-64 w-64 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-7xl font-medium text-white leading-tight tracking-tight">
              Ready to <br />
              <span className="text-neutral-500 italic">Automate?</span>
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
              Ship your custom AI agents and dashboards in weeks, not months. Join the agency revolution today.
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link href="/signup">
                <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-neutral-200 font-bold rounded-full text-lg shadow-2xl transition-all">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost" className="h-16 px-12 text-white hover:bg-white/5 font-bold rounded-full text-lg transition-all">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-neutral-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6 col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <GalleryVerticalEnd className="text-neutral-300 h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tighter">WORLD AUTOMATE.</span>
            </div>
            <p className="text-neutral-600 max-w-xs text-sm leading-relaxed">
              The premium software and AI agency building autonomous systems for the world's most ambitious companies.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Platform</h4>
            <div className="flex flex-col gap-2 text-neutral-500 text-sm">
              <Link href="#" className="hover:text-white transition-colors">AI Agents</Link>
              <Link href="#" className="hover:text-white transition-colors">Research Hub</Link>
              <Link href="#" className="hover:text-white transition-colors">Workflows</Link>
              <Link href="#" className="hover:text-white transition-colors">Academy</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Company</h4>
            <div className="flex flex-col gap-2 text-neutral-500 text-sm">
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 flex justify-between items-center text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
          <div>© 2026 WORLD AUTOMATE INC.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Twitter</Link>
            <Link href="#" className="hover:text-white">GitHub</Link>
            <Link href="#" className="hover:text-white">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
