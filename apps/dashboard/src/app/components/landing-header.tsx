"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, GalleryVerticalEnd, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatAssist } from "./chat-assist";

const navLinks = [
  { name: "Solutions", href: "#showcase" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Contact", href: "/contact" },
];

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, loading } = useAuth();
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(10, 10, 10, 0.8)"]
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"]
  );

  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  );

  return (
    <motion.nav 
      style={{ backgroundColor, backdropFilter: backdropBlur, borderBottom: `1px solid ${borderOpacity}` }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700 group-hover:border-neutral-500 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <GalleryVerticalEnd className="text-neutral-300 h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tighter">
              WORLD <span className="text-neutral-500">AUTOMATE.</span>
            </span>
          </Link>
          
          <button 
            onClick={() => setIsChatOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 group-hover:bg-white animate-pulse" />
            <span className="text-[10px] font-bold text-neutral-500 group-hover:text-white tracking-widest uppercase">Ask AI</span>
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-neutral-500 hover:text-white transition-colors text-xs font-medium tracking-widest uppercase"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4 border-l border-neutral-800 pl-8">
            {!loading && user ? (
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">DASHBOARD</span>
                <Avatar className="h-8 w-8 border border-neutral-800 group-hover:border-neutral-600 transition-all">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-neutral-900 text-neutral-400 text-[10px]">
                    {user.email?.charAt(0).toUpperCase() || <UserIcon size={12} />}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-white text-black hover:bg-neutral-200 rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-all">
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2 bg-black/50 backdrop-blur-xl rounded-xl border border-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 max-w-7xl mx-auto bg-black/90 backdrop-blur-2xl rounded-3xl p-8 border border-slate-900 space-y-6 pointer-events-auto shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-slate-400 hover:text-white py-2 text-sm font-bold uppercase tracking-widest border-b border-slate-900"
              >
                {link.name}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full border-slate-800 text-white hover:bg-white/5 rounded-full font-bold">Login</Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full font-bold">Sign Up</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ChatAssist isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.nav>
  );
}
