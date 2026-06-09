import { LandingHeader } from "@/app/components/landing-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare, Globe, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-neutral-800 overflow-x-hidden">
      <LandingHeader />

      <main className="max-w-7xl mx-auto px-6 pt-48 pb-24">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight leading-tight">
                Let&apos;s build <br />
                <span className="text-neutral-500 italic">together.</span>
              </h1>
              <p className="text-neutral-500 text-lg max-w-md leading-relaxed">
                Whether you&apos;re looking to automate your agency or scale your AI infrastructure, we&apos;re here to help.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "hello@worldautomate.com" },
                { icon: MessageSquare, label: "Discord", value: "Join our community" },
                { icon: Globe, label: "Location", value: "San Francisco, CA" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 transition-all">
                    <item.icon className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-neutral-500/5 blur-3xl rounded-full" />
            <div className="relative bg-neutral-900/50 border border-neutral-800 p-8 md:p-12 rounded-[3rem] space-y-8 backdrop-blur-xl">
              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-white">Send a message</h2>
                <p className="text-neutral-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Name</label>
                    <Input placeholder="John Doe" className="bg-transparent border-neutral-800 rounded-xl focus:border-neutral-600 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Email</label>
                    <Input placeholder="john@example.com" className="bg-transparent border-neutral-800 rounded-xl focus:border-neutral-600 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Message</label>
                  <textarea
                    placeholder="Tell us about your project..."
                    className="w-full min-h-[150px] bg-transparent border border-neutral-800 rounded-2xl p-4 text-white text-sm focus:border-neutral-600 transition-all outline-none"
                  />
                </div>
                <Button size="lg" className="w-full h-14 bg-white text-black hover:bg-neutral-200 rounded-full font-bold text-base transition-all group">
                  Send Message <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
