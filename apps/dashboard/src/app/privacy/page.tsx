import { LandingHeader } from "@/app/components/landing-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-400 selection:bg-neutral-800">
      <LandingHeader />
      <main className="max-w-3xl mx-auto px-6 pt-48 pb-24 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Privacy Policy</h1>
          <p className="text-neutral-500">Last updated: May 7, 2026</p>
        </div>

        <div className="space-y-8 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-white">1. Introduction</h2>
            <p>
              World Automate Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium text-white">2. Information Collection</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and payment information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium text-white">3. Data Security</h2>
            <p>
              We implement enterprise-grade security measures to protect your data, including encryption at rest and in transit. Our infrastructure is designed to meet SOC2 and HIPAA compliance standards.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
