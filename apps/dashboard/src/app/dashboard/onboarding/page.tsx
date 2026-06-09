"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  BrainCircuit, 
  Database, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: "welcome",
    title: "Welcome to Agentic-OS",
    description: "Let's set up your enterprise AI automation agency.",
    icon: Rocket,
    color: "text-blue-400",
  },
  {
    id: "solution",
    title: "Select Your First Solution",
    description: "Which industry are you automating first?",
    icon: BrainCircuit,
    color: "text-cyan-400",
  },
  {
    id: "infrastructure",
    title: "Deploy Infrastructure",
    description: "Setting up your global microservices mesh.",
    icon: Database,
    color: "text-purple-400",
  },
  {
    id: "security",
    title: "Secure Your Agency",
    description: "Activating SOC2-ready security protocols.",
    icon: ShieldCheck,
    color: "text-indigo-400",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const Icon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-enterprise-dark flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-blue-600" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass p-12 rounded-[2.5rem] border-none space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Icon size={120} />
            </div>

            <div className="space-y-4 relative z-10">
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${steps[currentStep].color}`}>
                <Icon size={32} />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                {steps[currentStep].title}
              </h1>
              <p className="text-xl text-slate-400">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="grid gap-4 relative z-10 pt-4">
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {["FinTech", "HealthTech", "LegalTech", "Supply Chain"].map((tech) => (
                    <button key={tech} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-blue-600/20 hover:border-blue-600/50 transition-all text-left font-medium">
                      {tech}
                    </button>
                  ))}
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center gap-4 text-blue-400">
                    <Zap size={20} />
                    <span>Auto-scaling enabled in 14 regions</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-slate-300">
                    <Sparkles size={20} />
                    <span>Edge caching initialized</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-8 relative z-10">
              <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 text-sm font-medium">
                Skip for now
              </Link>
              <Button 
                onClick={nextStep}
                size="lg" 
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl gap-2 shadow-xl shadow-blue-600/20"
              >
                {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
                <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Step {currentStep + 1} of {steps.length} — World Automate Agency Setup
          </p>
        </div>
      </div>
    </div>
  );
}
