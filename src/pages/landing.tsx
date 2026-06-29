import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Code2, 
  Globe, 
  MessageSquare 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/shared/Logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  const features = [
    { 
      icon: LayoutGrid, 
      title: 'Kanban Boards', 
      desc: 'Seamless drag & drop cards. Set priorities, track subtasks, leave comments, and attach design documents all in one place.' 
    },
    { 
      icon: CalendarIcon, 
      title: 'Adaptive Calendars', 
      desc: 'Visualize deadlines across monthly, weekly, and daily views. Never miss another release deadline.' 
    },
    { 
      icon: BarChart3, 
      title: 'Advanced Analytics', 
      desc: 'Deep analytical graphs for project progress, team workload, and velocity. Powered by interactive chart models.' 
    },
    { 
      icon: Users, 
      title: 'Team Workspaces', 
      desc: 'Organize various project hubs, manage team roles, and keep workspace items clean and separated.' 
    },
    { 
      icon: Zap, 
      title: 'Instant Workflows', 
      desc: 'Command Center (⌘K) matching Linear speed. Quick navigation, prompt project additions, and rapid task manipulation.' 
    },
    { 
      icon: Shield, 
      title: 'Enterprise Security', 
      desc: 'Secure data storage with Supabase database integrations, Row-Level-Security (RLS), and custom client validation.' 
    },
  ];

  const testimonials = [
    {
      quote: "FlowSync feels like the future of team management. It combines the clean flexibility of Notion with the lightning speed of Linear.",
      author: "Alex Rivera",
      role: "Product Lead at FlowSync",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80"
    },
    {
      quote: "The interface is gorgeous, especially the Dark Mode. It has elevated our project planning efficiency by at least 40%.",
      author: "Sarah Chen",
      role: "Design Lead at Acme Corp",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&h=128&q=80"
    },
    {
      quote: "Drag and drop, command palette, beautiful graphs—it just has everything we need to build our startup in 2026.",
      author: "Marcus Vance",
      role: "CTO at Nexus Labs",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80"
    }
  ];

  const faqs = [
    {
      q: "Apakah FlowSync mendukung sinkronisasi real-time?",
      a: "Ya. FlowSync dibangun di atas integrasi real-time Supabase, yang memungkinkan seluruh perubahan pada tugas, komentar, dan aktivitas langsung ter-update di seluruh perangkat tim Anda."
    },
    {
      q: "Dapatkah saya menggunakannya secara gratis?",
      a: "Ya, kami menawarkan tier gratis untuk tim kecil hingga 5 anggota dengan fitur utama seperti Kanban dan Kalender lengkap."
    },
    {
      q: "Bagaimana cara kerja integrasi Supabase?",
      a: "FlowSync terintegrasi secara modular. Anda cukup memasukkan kredensial Supabase URL dan Anon Key di variabel lingkungan (.env) Anda untuk langsung mensinkronkan autentikasi dan database."
    },
    {
      q: "Apakah terdapat pilihan Dark Mode?",
      a: "Ya, FlowSync mendukung Dark Mode premium sebagai tampilan bawaan (default) dan dapat diganti ke Light Mode kapan saja melalui header."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5 relative z-20">
        <div className="flex items-center gap-2.5">
          <Logo size="md" />
          <span className="text-xl font-extrabold tracking-tight text-white">
            FlowSync
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Button 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/register')}
            variant="primary" 
            size="sm"
          >
            {isAuthenticated ? 'Go to App' : 'Get Started'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Project Management untuk Startup Era Baru
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto">
            Sinkronkan Alur Kerja Tim Anda dengan Kecepatan Linear.
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto font-medium">
            Gabungan sempurna antara fleksibilitas papan kerja Notion dan kecepatan performa Linear. Didesain secara premium untuk startup berkinerja tinggi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/register')}
              size="lg"
            >
              Start for Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <a 
              href="#features"
              className="text-sm font-semibold text-slate-400 hover:text-white px-5 py-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
            >
              Learn Features
            </a>
          </div>
        </motion.div>

        {/* Dashboard Preview Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 rounded-2xl border border-white/10 bg-slate-900/50 p-2 shadow-2xl relative"
        >
          {/* Glass window top dots */}
          <div className="absolute top-4 left-5 flex gap-1.5 z-20">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 relative border border-white/5">
            {/* Custom mock UI to wow user */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex">
              {/* Mock Sidebar */}
              <div className="w-1/5 border-r border-white/5 p-4 flex flex-col gap-6 text-left">
                <div className="h-6 w-24 bg-white/10 rounded-md" />
                <div className="space-y-2">
                  <div className="h-8 w-full bg-white/5 rounded-lg flex items-center px-2.5 gap-2">
                    <div className="h-4 w-4 bg-primary rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                  </div>
                  <div className="h-8 w-full bg-transparent rounded-lg flex items-center px-2.5 gap-2">
                    <div className="h-4 w-4 bg-white/5 rounded" />
                    <div className="h-3 w-14 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
              {/* Mock Dashboard */}
              <div className="flex-1 p-6 text-left flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-white/15 rounded" />
                  <div className="h-8 w-24 bg-primary/20 border border-primary/30 rounded-lg" />
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
                    <div className="h-3 w-12 bg-white/10 rounded" />
                    <div className="h-6 w-20 bg-white/20 rounded" />
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
                    <div className="h-3 w-14 bg-white/10 rounded" />
                    <div className="h-6 w-16 bg-white/20 rounded" />
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
                    <div className="h-3 w-16 bg-white/10 rounded" />
                    <div className="h-6 w-24 bg-white/20 rounded" />
                  </div>
                </div>
                {/* Board columns */}
                <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
                  <div className="border border-dashed border-white/5 rounded-xl p-3 space-y-2">
                    <div className="h-3 w-12 bg-white/10 rounded mb-4" />
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2 shadow-md">
                      <div className="h-4 w-full bg-white/15 rounded" />
                      <div className="h-3 w-16 bg-primary/20 rounded" />
                    </div>
                  </div>
                  <div className="border border-dashed border-white/5 rounded-xl p-3 space-y-2">
                    <div className="h-3 w-16 bg-white/10 rounded mb-4" />
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2 shadow-md">
                      <div className="h-4 w-full bg-white/15 rounded" />
                      <div className="h-3 w-12 bg-emerald-500/20 rounded" />
                    </div>
                  </div>
                  <div className="border border-dashed border-white/5 rounded-xl p-3 space-y-2">
                    <div className="h-3 w-8 bg-white/10 rounded mb-4" />
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2 shadow-md">
                      <div className="h-4 w-full bg-white/15 rounded" />
                      <div className="h-3 w-14 bg-amber-500/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glowing overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Fitur Canggih untuk Kebutuhan Produktivitas
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Seluruh tools manajemen proyek yang dirancang secara minimalis untuk kenyamanan kolaborasi tim Anda.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-6 rounded-xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/60 transition-all duration-300 group hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-white">Dipercaya oleh Kreator & Developer</h2>
          <p className="text-slate-400">Kata mereka yang menggunakan FlowSync untuk peluncuran startup.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-white/5 bg-slate-900/20 flex flex-col justify-between">
              <p className="text-slate-300 italic text-sm leading-relaxed mb-6">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={test.avatar} alt={test.author} className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-white">{test.author}</h4>
                  <p className="text-[10px] text-slate-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-white">Skema Harga Sederhana</h2>
          <p className="text-slate-400">Mulai gratis, tingkatkan kapan saja seiring pertumbuhan tim Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
              <p className="text-slate-400 text-xs mb-6">Cocok untuk developer solo & tim mini.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white">IDR 0</span>
                <span className="text-slate-500 text-xs">/ forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Hingga 5 Anggota Tim', '3 Proyek Aktif', 'Papan Kanban Standar', 'Kalender Bulanan', 'Offline Mock Fallback'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={() => navigate('/auth/register')} variant="outline" className="w-full">
              Get Started
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-2xl border border-indigo-500/25 bg-slate-900/50 flex flex-col justify-between relative">
            <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              POPULER
            </span>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Builder</h3>
              <p className="text-slate-400 text-xs mb-6">Untuk startup & tim berkecepatan tinggi.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white">IDR 149k</span>
                <span className="text-slate-500 text-xs">/ user / bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Anggota Tim Tanpa Batas',
                  'Proyek Tanpa Batas',
                  'Fungsionalitas DnD Premium',
                  'Kalender Mingguan & Harian',
                  'Grafik Analitik Lanjut (Recharts)',
                  'Integrasi Database Real-time',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={() => navigate('/auth/register')} variant="primary" className="w-full">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-extrabold text-center text-white mb-12">Pertanyaan Umum (FAQ)</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-white/5 rounded-xl bg-slate-900/20 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-semibold text-sm sm:text-base text-white flex items-center justify-between hover:bg-slate-900/40 cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 text-xl font-bold leading-none">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/80 py-12 text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-white font-bold text-sm">FlowSync Inc.</span>
          </div>

          <p className="text-xs text-center md:text-left">
            © {new Date().getFullYear()} FlowSync. All rights reserved. Premium Startup SaaS Application.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors"><Globe className="h-4 w-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Code2 className="h-4 w-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><MessageSquare className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
