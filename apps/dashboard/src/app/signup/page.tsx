import { GalleryVerticalEnd } from "lucide-react"
import { SignUpForm } from "@/app/components/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-enterprise-dark">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium text-white">
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">World Automate</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-slate-900 lg:block overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay z-10" />
        <img
          src="/saas_dashboard_poster_1_1778158563663.png"
          alt="Dashboard Preview"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.6] grayscale-[0.2]"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">Scale your agency with autonomous AI.</h2>
          <p className="text-slate-300 text-lg leading-relaxed">Join 500+ enterprises using World Automate to orchestrate their workflows and research on autopilot.</p>
        </div>
      </div>
    </div>
  )
}
