import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/app/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-enterprise-dark p-6 md:p-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
        <Link href="/" className="flex items-center gap-2 self-center font-medium text-white group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">World Automate</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
