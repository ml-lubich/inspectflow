"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ClipboardCheck,
  Camera,
  FileText,
  Calendar,
  Users,
  LayoutTemplate,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: ClipboardCheck,
    title: "Smart Checklists",
    description: "Pre-built templates for every inspection category. Rate items, add notes, and never miss a detail.",
  },
  {
    icon: Camera,
    title: "Photo Documentation",
    description: "Attach photos directly to inspection items. Document deficiencies with visual evidence.",
  },
  {
    icon: FileText,
    title: "PDF Reports",
    description: "Generate professional PDF reports instantly. Branded with your company info and logo.",
  },
  {
    icon: Calendar,
    title: "Scheduling",
    description: "Schedule inspections and track upcoming appointments from your dashboard.",
  },
  {
    icon: Users,
    title: "Client Portal",
    description: "Share reports via unique links. Clients can view their inspection report anytime.",
  },
  {
    icon: LayoutTemplate,
    title: "Custom Templates",
    description: "Create and save custom inspection templates. Tailor checklists to your workflow.",
  },
];

const competitors = [
  { name: "Spectora", price: "$109", features: ["Reports", "Scheduling", "Templates", "Client Portal"] },
  { name: "HomeGauge", price: "$89", features: ["Reports", "Templates", "Photo Upload", "Basic Support"] },
  { name: "Home Inspector Pro", price: "$74", features: ["Reports", "Templates", "Desktop Only", "One-time + fees"] },
];

const testimonials = [
  {
    name: "Mike Reynolds",
    role: "Licensed Inspector, Austin TX",
    quote: "I switched from Spectora and I'm saving over $1,000 a year. InspectFlow has everything I need at a fraction of the price.",
    rating: 5,
  },
  {
    name: "Sarah Kim",
    role: "Home Inspector, Denver CO",
    quote: "The inspection builder is incredibly intuitive. I can complete a full report on-site in under 30 minutes.",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    role: "Independent Inspector, Miami FL",
    quote: "My clients love the shareable report links. Professional reports that make me look like a big operation.",
    rating: 5,
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InspectFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Start Free Trial</Button>
              </Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#testimonials" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <div className="flex gap-2 pt-2">
              <Link href="/login"><Button variant="outline" size="sm" className="w-full">Log In</Button></Link>
              <Link href="/signup"><Button size="sm" className="w-full">Start Free Trial</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp}>
              <Badge className="mb-6 bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-medium">
                Trusted by 500+ independent inspectors
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight tracking-tight">
              Professional Inspection Reports in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Minutes. Not Hours.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The modern, affordable home inspection software built for independent inspectors.
              Everything you need at a price that makes sense.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 h-14 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="text-base px-8 h-14 rounded-xl">
                  View Demo Dashboard
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-blue-100 text-blue-700">Features</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to inspect with confidence
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From on-site checklists to polished client reports — streamline your entire inspection workflow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className="h-full hover:shadow-md transition-shadow border-gray-200 group">
                  <CardContent className="p-6 pt-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                      <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-blue-100 text-blue-700">Pricing</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">
              Stop overpaying for inspection software
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Get every feature you need at a price that respects your bottom line.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {/* InspectFlow - highlighted */}
            <motion.div variants={fadeUp}>
              <Card className="h-full border-2 border-blue-600 relative shadow-xl shadow-blue-500/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">Best Value</Badge>
                </div>
                <CardContent className="p-6 pt-8">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ClipboardCheck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">InspectFlow</h3>
                    <div className="mt-3">
                      <span className="text-4xl font-bold text-gray-900">$19</span>
                      <span className="text-gray-500">/mo</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {["Reports", "Scheduling", "Templates", "Photo Upload", "Client Portal", "PDF Export", "Priority Support"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block mt-6">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {competitors.map((comp) => (
              <motion.div key={comp.name} variants={fadeUp}>
                <Card className="h-full opacity-75">
                  <CardContent className="p-6 pt-6">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <h3 className="font-bold text-gray-600 text-lg">{comp.name}</h3>
                      <div className="mt-3">
                        <span className="text-4xl font-bold text-gray-400">{comp.price}</span>
                        <span className="text-gray-400">/mo</span>
                      </div>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {comp.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 className="w-4 h-4 text-gray-300 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button variant="outline" className="w-full" disabled>Compare</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm">
              Save <span className="font-semibold text-green-600">$660 — $1,080 per year</span> compared to competitors.
              Same features, better price.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-blue-100 text-blue-700">Testimonials</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">
              Loved by inspectors nationwide
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="h-full">
                  <CardContent className="p-6 pt-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Bank-Level Security</p>
                <p className="text-gray-500 text-xs">256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Lightning Fast</p>
                <p className="text-gray-500 text-xs">Reports generated in seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">500+ Inspectors</p>
                <p className="text-gray-500 text-xs">Growing community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white">
              Ready to streamline your inspections?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Join hundreds of inspectors who save time and money with InspectFlow. Start your free 14-day trial today.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-base px-8 h-14 rounded-xl shadow-lg">
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">InspectFlow</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
            <p className="text-sm">&copy; 2026 InspectFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
