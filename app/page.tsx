"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Box, Layers } from "lucide-react";

import { KineticBackground } from "@/components/ui/kinetic-background";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <KineticBackground />

      <main className="container mx-auto px-6 pt-32 pb-20">

        {/* HERO SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-32"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-800 bg-stone-900/50 backdrop-blur-sm mb-8 text-xs font-medium text-stone-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            v1.2.0 Now Available
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-6"
          >
            Master the Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-200 via-stone-400 to-stone-600">
              Prompt Engineering
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-stone-400 max-w-2xl mb-10 leading-relaxed"
          >
            An industrial-grade workspace for crafting, testing, and managing AI prompts.
            Stop guessing and start engineering with precision tools designed for the modern AI workflow.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <MagneticButton strength={0.2}>
              <Link href="/login">
                <Button size="lg" className="rounded-full h-14 px-8 text-base bg-primary hover:bg-orange-700 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] transition-shadow duration-300">
                  <Sparkles className="mr-2 h-5 w-5 fill-current" />
                  Start Building Free
                </Button>
              </Link>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-stone-700 hover:bg-stone-800/50 hover:border-stone-600">
                  View Documentation
                </Button>
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>


        {/* BENTO GRID SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {/* CARD 1: Large Span */}
          <div className="group md:col-span-2 relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/30 backdrop-blur-md p-8 hover:border-stone-700 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-8">
                <div className="h-12 w-12 rounded-xl bg-stone-800 flex items-center justify-center mb-6 text-primary">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-100 mb-3">Modular Blueprint System</h3>
                <p className="text-stone-400 leading-relaxed max-w-md">
                  Break down complex prompts into reusable blueprints. Compose, nest, and version control your logic like code.
                </p>
              </div>
              {/* Mock UI Element */}
              <div className="w-full h-48 rounded-lg bg-stone-950/50 border border-stone-800/50 p-4 flex flex-col gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/20" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                  <div className="h-3 w-3 rounded-full bg-green-500/20" />
                </div>
                <div className="space-y-2 mt-2">
                  <div className="h-2 w-3/4 rounded bg-stone-800" />
                  <div className="h-2 w-1/2 rounded bg-stone-800" />
                  <div className="h-2 w-5/6 rounded bg-stone-800" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Variable Detection */}
          <div className="group relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/30 backdrop-blur-md p-8 hover:border-stone-700 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-xl bg-stone-800 flex items-center justify-center mb-6 text-blue-400">
                <Box className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-stone-100 mb-3">Smart Variables</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Automatically detect variables in your prompts. <code>{"{{user_name}}"}</code> instantly becomes an input field.
              </p>
            </div>
          </div>

          {/* CARD 3: Optimization */}
          <div className="group relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/30 backdrop-blur-md p-8 hover:border-stone-700 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-xl bg-stone-800 flex items-center justify-center mb-6 text-purple-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-stone-100 mb-3">AI Enhancement</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                One-click optimization. Let our advanced models refine your prompt for clarity and performance.
              </p>
            </div>
          </div>

          {/* CARD 4: Analytics (Span 2 on mobile, 1 on desktop but maybe span 2 to fill?) Let's keep it Grid 3 */}
          <div className="group md:col-span-3 relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/30 backdrop-blur-md p-8 hover:border-stone-700 transition-colors flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-stone-100 mb-3">Ready to deploy?</h3>
              <p className="text-stone-400 mb-6">
                Export your prompts as JSON, TypeScript, or Python. Integrate directly into your app with our SDK.
              </p>
              <Button variant="link" className="text-primary p-0 h-auto font-semibold group-hover:underline">
                Read the Integration Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-full md:w-1/3 h-32 md:h-full min-h-[120px] bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-center font-mono text-xs text-stone-500">
              npm install @prompt-enhancer/sdk
            </div>
          </div>

        </motion.div>

      </main>
    </div>
  );
}
