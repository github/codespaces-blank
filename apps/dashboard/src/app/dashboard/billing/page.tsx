import { CreditCard, Receipt, CalendarDays, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Billing</h1>
          <p className="text-neutral-400">Manage your plan, invoices, and spending in one place.</p>
        </div>
        <Button className="border border-white/10 text-white gap-2 hover:bg-white/5">
          <Receipt className="h-4 w-4" /> Download Invoice
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Current plan", value: "Enterprise", icon: Wallet },
          { title: "Next invoice", value: "$1,250.00", icon: Receipt },
          { title: "Usage", value: "84% of quota", icon: CalendarDays },
          { title: "Status", value: "Paid", icon: CreditCard },
        ].map((item) => (
          <Card key={item.title} className="border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-slate-400" />
                <div className="text-xl font-semibold text-white">{item.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-neutral-900 border-neutral-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Recent invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "April 2026", amount: "$1,250.00", status: "Paid" },
              { name: "March 2026", amount: "$1,080.00", status: "Paid" },
              { name: "February 2026", amount: "$1,430.00", status: "Paid" },
            ].map((invoice) => (
              <div key={invoice.name} className="flex flex-col gap-3 rounded-3xl bg-black/40 border border-neutral-800 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{invoice.name}</p>
                  <p className="text-sm text-slate-500">Subscription invoice</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">{invoice.amount}</span>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{invoice.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Payment method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-black/40 border border-neutral-800 p-5">
              <p className="text-sm text-slate-400">Visa ending in 4242</p>
              <p className="mt-2 text-white font-semibold">Expires 06 / 2028</p>
            </div>
            <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5">
              Update payment method
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
