import { useState, useEffect } from "react";
import PortfolioHero from "@/components/ui/portfolio-hero";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";
import CanvasParticles from "@/components/ui/canvas-particles";
import AIAssistant from "@/components/ui/ai-assistant";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  Award, 
  BookOpen, 
  Sparkles, 
  ArrowUpRight, 
  ExternalLink,
  Cpu,
  GraduationCap,
  Send,
  MessageCircle,
  Clock,
  Briefcase
} from "lucide-react";

// Inline Custom SVG for GitHub
const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

// Inline Custom SVG for LinkedIn
const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// Inline Custom SVG for Instagram
const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// Stat Card with dynamic count-up animations
interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  trigger: boolean;
}

function StatCard({ label, value, suffix = "", decimals = 0, trigger }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = value;
    const duration = 1200; // ms
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const stepValue = (end - start) / steps;
    
    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(parseFloat(start.toFixed(decimals)));
      }
    }, intervalTime);
    return () => clearInterval(timer);
  }, [value, decimals, trigger]);

  return (
    <div className="p-6 rounded-2xl bg-glass border border-neutral-900 flex flex-col justify-center items-center hover:border-[#BF953F]/40 hover:bg-black/45 transition-all duration-500 group">
      <div className="text-3xl sm:text-4xl font-extrabold font-space-grotesk bg-gold-text mb-2 group-hover:scale-105 transition-transform duration-300">
        {count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-[10px] sm:text-xs font-bold tracking-widest text-neutral-500 uppercase text-center group-hover:text-neutral-400 transition-colors">
        {label}
      </div>
    </div>
  );
}

// Achievements Data
const achievementsAndProjects = [
  { 
    id: 1, 
    title: "Computer Vision Intern", 
    cat: "NSIC (Govt of India)", 
    details: "Built CNN models and object trackers with OpenCV for CCTV camera analytics.",
    img: "/normal photo of leadership and discipline.jpg", 
    fallbackImg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    width: "w-[220px] sm:w-[250px]",
    height: "h-[300px] sm:h-[330px]"
  },
  { 
    id: 2, 
    title: "Crop Yield Satellite AI", 
    cat: "Satellite Data Model", 
    details: "District-level prediction models using historical records, weather parameters, and soil indices.",
    img: "/ASTRAVA Hackathon.jpg", 
    fallbackImg: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80",
    width: "w-[290px] sm:w-[340px]",
    height: "h-[200px] sm:h-[230px]"
  },
  { 
    id: 3, 
    title: "AI Student Tracking CCTV", 
    cat: "Smart CCTV System", 
    details: "Face identification engine that automates attendance logging from raw CCTV streams.",
    img: "/Mini Project - AI Based Students Tracking System.jpg", 
    fallbackImg: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
    width: "w-[230px] sm:w-[260px]",
    height: "h-[290px] sm:h-[320px]"
  },
  { 
    id: 4, 
    title: "Guest Lecture on Networking", 
    cat: "Guest Lecture", 
    details: "Attended guest lecture on networking concepts and real-world architectures.",
    img: "/Guest Lecture on Networking.jpg", 
    fallbackImg: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    width: "w-[280px] sm:w-[330px]",
    height: "h-[210px] sm:h-[240px]"
  },
  { 
    id: 5, 
    title: "CR & Coordinator", 
    cat: "College Coordination", 
    details: "Elected Class Representative and Placement coordinator for placement drives.",
    img: "/first best group photo - Class Representative and Coordinator.jpg", 
    fallbackImg: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80",
    width: "w-[290px] sm:w-[340px]",
    height: "h-[200px] sm:h-[230px]"
  },
  { 
    id: 6, 
    title: "Industrial Visit", 
    cat: "Industrial Visit", 
    details: "Experienced practical workflows and enterprise architectures during an industrial visit.",
    img: "/Industrial Visit.jpg", 
    fallbackImg: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    width: "w-[260px] sm:w-[300px]",
    height: "h-[185px] sm:h-[215px]"
  },
  { 
    id: 7, 
    title: "NEOPAT Portal Awareness", 
    cat: "Awareness Program", 
    details: "Conducted awareness session on VEL TECH's NEOPAT learning portal mechanics and structure.",
    img: "/VEL TECH's NEOPAT Portal Awareness Program.jpg", 
    fallbackImg: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    width: "w-[270px] sm:w-[315px]",
    height: "h-[195px] sm:h-[225px]"
  }
];

// Technical Skills Data
const skills = [
  { name: "Python Programming", category: "Languages" },
  { name: "Java Programming", category: "Languages" },
  { name: "C Programming", category: "Languages" },
  { name: "OpenCV & Computer Vision", category: "AI Engineering" },
  { name: "CNNs & Image Analysis", category: "AI Engineering" },
  { name: "Amazon SageMaker & ML", category: "AI Engineering" },
  { name: "MySQL & Database Engineering", category: "Databases" },
  { name: "Data Science & Statistics", category: "Data Science" },
  { name: "Digital Content Creation", category: "Creative" },
  { name: "Leadership & Strategy", category: "Professional" },
  { name: "Software Engineer", category: "Interests" },
  { name: "Data Analyst", category: "Interests" }
];

// Testimonials / Quotes Data
const quotes = [
  {
    text: "The best way to predict the future is to design it, line by line, model by model.",
    author: "AI Core Principle"
  },
  {
    text: "True innovators don't adapt to technology; they merge code, creativity, and leadership to shape the digital identity of tomorrow.",
    author: "Dhanush Dhamodharan"
  },
  {
    text: "Artificial Intelligence is not about replacing human experiences; it's about engineering code that amplifies human creativity.",
    author: "Tech Creator Ethics"
  },
  {
    text: "பொறுமை கடலினும் பெரிது / Patience is greater than the ocean.",
    author: "Dhanush Dhamodharan"
  }
];

// Certifications Data
const certifications = [
  { title: "Azure AI Fundamentals: Machine Learning", provider: "Infosys Springboard", date: "2026" },
  { title: "Oracle Cloud Infrastructure AI Foundations", provider: "Infosys Springboard", date: "2026" },
  { title: "Amazon SageMaker System Specialist", provider: "Udemy", date: "2026" },
  { title: "Introduction to Machine Learning Core", provider: "Infosys Springboard", date: "2026" },
  { title: "Databases and SQL for Data Science", provider: "IBM (Coursera)", date: "2025" },
  { title: "Data Science & Analytics Foundations", provider: "HP LIFE", date: "2025" },
  { title: "Enhancing Soft Skills and Personality", provider: "NPTEL-Swayam", date: "2025" }
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [triggerStats, setTriggerStats] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  
  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [currentLoaderImageIndex, setCurrentLoaderImageIndex] = useState(0);
  const [midImageIndex, setMidImageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [hologramSweep, setHologramSweep] = useState(false);

  // Cinematic background slideshow for loader
  const loaderImages = [
    "/main profile photo dhanu.webp",
    "/normal photo of leadership and discipline.jpg",
    "/ASTRAVA Hackathon.jpg",
    "/Mini Project - AI Based Students Tracking System.jpg",
    "/Guest Lecture on Networking.jpg",
    "/first best group photo - Class Representative and Coordinator.jpg",
    "/Industrial Visit.jpg",
    "/VEL TECH's NEOPAT Portal Awareness Program.jpg"
  ];

  // Layer 1 sliding: cycles every 1.3s
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setCurrentLoaderImageIndex((prev) => (prev + 1) % loaderImages.length);
    }, 1300);
    return () => clearInterval(timer);
  }, [loading]);

  // Layer 2 sliding: cycles every 0.8s randomly
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setMidImageIndex((prev) => {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * loaderImages.length);
        }
        return next;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [loading]);

  // Hologram sweep: triggers sweep effect every 3.0s
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setHologramSweep(true);
      setTimeout(() => setHologramSweep(false), 800);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  // Loading Screen Animation
  useEffect(() => {
    const duration = 4000;
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);
    
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setIsExiting(true);
          setTimeout(() => setLoading(false), 1200);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Trigger stats countup on scroll
  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      const statsSection = document.getElementById("stats");
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          setTriggerStats(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // Quote Carousel loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Precomposes WhatsApp message for quick connect
  const handleWhatsAppClick = (_e?: React.MouseEvent) => {
    const text = encodeURIComponent("Hello Dhanush, I came across your portfolio and would love to connect with you.");
    window.open(`https://wa.me/919994726807?text=${text}`, "_blank");
  };

  // Precomposes email send
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:dhanushsinger872@gmail.com?subject=Portfolio Inquiry from ${contactName}&body=Name: ${contactName}%0D%0AEmail: ${contactEmail}%0D%0AMessage: ${contactMessage}`;
    window.location.href = mailto;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col justify-center items-center bg-[#020203] text-white overflow-hidden">
        {/* Layer 1: Highly Blurred Large Background Photos */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          {loaderImages.map((imgSrc, idx) => (
            <div
              key={`blur-${imgSrc}`}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: currentLoaderImageIndex === idx && !isExiting ? 0.07 : 0,
              }}
            >
              <img
                src={imgSrc}
                alt="Background ambient"
                className="w-full h-full object-cover filter blur-[20px] scale-[1.3] animate-zoom-slow"
              />
            </div>
          ))}
        </div>

        {/* Layer 2: Center-Fit Holographic Memory Stream (aspect ratio maintained, no crops) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex items-center justify-center">
          {loaderImages.map((imgSrc, idx) => (
            <div
              key={`mid-${imgSrc}`}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-[700ms] ease-in-out"
              style={{
                opacity: midImageIndex === idx && !isExiting ? 0.14 : 0,
              }}
            >
              <img
                src={imgSrc}
                alt="Memory Projection"
                className="max-w-[65vw] max-h-[65vh] object-contain animate-zoom-slow rounded-xl border border-white/5 shadow-2xl"
              />
            </div>
          ))}
        </div>

        {/* Layer 3: Floating small thumbnails in corners (correct aspects, drifting slowly) */}
        <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
          {/* Thumbnail 1: Top-Left (Landscape) */}
          <div 
            className="absolute p-1 rounded-xl bg-black/55 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-[1200ms] ease-in-out animate-float-drift-1"
            style={{
              top: "12%",
              left: "10%",
              width: "160px",
              height: "110px",
              opacity: isExiting ? 0 : 0.22,
            }}
          >
            <img src="/Guest Lecture on Networking.jpg" alt="Float 1" className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* Thumbnail 2: Top-Right (Landscape) */}
          <div 
            className="absolute p-1 rounded-xl bg-black/55 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-[1200ms] ease-in-out animate-float-drift-2"
            style={{
              top: "15%",
              right: "10%",
              width: "160px",
              height: "110px",
              opacity: isExiting ? 0 : 0.22,
            }}
          >
            <img src="/Industrial Visit.jpg" alt="Float 2" className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* Thumbnail 3: Bottom-Left (Portrait) */}
          <div 
            className="absolute p-1 rounded-xl bg-black/55 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-[1200ms] ease-in-out animate-float-drift-3"
            style={{
              bottom: "16%",
              left: "12%",
              width: "105px",
              height: "155px",
              opacity: isExiting ? 0 : 0.22,
            }}
          >
            <img src="/normal photo of leadership and discipline.jpg" alt="Float 3" className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* Thumbnail 4: Bottom-Right (Landscape) */}
          <div 
            className="absolute p-1 rounded-xl bg-black/55 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-[1200ms] ease-in-out animate-float-drift-1"
            style={{
              bottom: "18%",
              right: "12%",
              width: "170px",
              height: "115px",
              opacity: isExiting ? 0 : 0.22,
            }}
          >
            <img src="/VEL TECH's NEOPAT Portal Awareness Program.jpg" alt="Float 4" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>

        {/* Layer 4: Floating golden nodes / network particles */}
        <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#FCF6BA] opacity-35 animate-pulse"
              style={{
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
                boxShadow: "0 0 8px rgba(252, 246, 186, 0.6)",
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 3)}s`,
                opacity: isExiting ? 0 : 0.35,
                transition: "opacity 1000ms ease-out"
              }}
            />
          ))}
        </div>

        {/* Scan lines, Vignette, and Film Grain overlays */}
        <div className="absolute inset-0 bg-scanlines opacity-[0.06] pointer-events-none z-20" />
        <div className="absolute inset-0 bg-noise pointer-events-none z-20" />

        {/* Cinematic light sweep */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCF6BA]/5 to-transparent pointer-events-none z-20 transition-transform duration-1000 ease-in-out"
          style={{
            transform: hologramSweep ? "translateX(100%)" : "translateX(-100%)",
          }}
        />

        {/* Black exit cover overlay (fades in on exit to provide seamless transition) */}
        <div 
          className="absolute inset-0 bg-[#020203] pointer-events-none z-25 transition-opacity duration-[1100ms] ease-in-out"
          style={{
            opacity: isExiting ? 1 : 0,
          }}
        />

        {/* Layer 5: Foreground Loading Content Panel */}
        <div 
          className="relative z-30 flex flex-col items-center justify-center transition-all duration-[900ms] ease-in-out"
          style={{
            opacity: isExiting ? 0 : 1,
            transform: isExiting ? "scale(0.97)" : "scale(1)",
          }}
        >
          {/* Animated pulsating Gold Signature */}
          <div 
            className={`text-4xl font-cinzel tracking-widest bg-gold-text mb-6 font-semibold select-none transition-all duration-1000 ${
              isExiting ? "filter blur-[4px] scale-105" : "animate-pulse-gold"
            }`}
          >
            DHANUSH.VEL
          </div>
          
          {/* Holographic Console Terminal text */}
          <div className="text-[10px] font-mono tracking-widest text-neutral-400 mb-8 uppercase text-center max-w-xs space-y-1">
            <p className="animate-pulse">Loading Synapse AI Core...</p>
            <p className="text-neutral-600 text-[8px]">Compiled in Space Grotesk</p>
          </div>

          {/* Premium Gold Loading Bar */}
          <div className="w-64 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative border border-white/5 shadow-[0_0_12px_rgba(252,246,186,0.3)]">
            <div 
              className="h-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] transition-all duration-300 shadow-[0_0_8px_rgba(252,246,186,0.5)] relative overflow-hidden"
              style={{ width: `${loadingProgress}%` }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-shimmer-fast" />
            </div>
          </div>
          
          <div className="text-[10px] font-mono tracking-widest text-[#FCF6BA] mt-3 font-bold">
            {Math.floor(loadingProgress)}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#020203] text-neutral-100 font-sans min-h-screen selection:bg-[#FCF6BA] selection:text-black relative">
      
      {/* 3D Particle Canvas Background */}
      <CanvasParticles />

      {/* Floating Holographic AI Chatbot */}
      <AIAssistant />

      {/* Hero Section */}
      <PortfolioHero />

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-900/40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* brand story */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center space-x-3 text-[#BF953F]">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Brand Story</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white font-space-grotesk leading-none">
              Coding the Future of <span className="bg-gold-text">AI Innovation</span>.
            </h2>
            
            <p className="text-neutral-400 leading-relaxed text-sm sm:text-base font-light">
              I am a Bachelor of Technology student specializing in **Artificial Intelligence and Data Science**. My ambition is centered on engineering intelligent, futuristic software systems that bridge the gap between machine learning and daily human experiences. 
            </p>
            <p className="text-neutral-400 leading-relaxed text-sm sm:text-base font-light">
              Beyond engineering, I express my technical insights through creative digital creation as an **Instagram Tech Content Creator**, constructing digital assets that inspire a growing tech audience of modern builders.
            </p>

            {/* Academic Card */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-black/60 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-[#BF953F]/20 text-[#BF953F]">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm font-space-grotesk tracking-wide">Vel Tech High Tech College</h4>
                  <p className="text-xs text-neutral-500 font-medium">B.Tech AI & Data Science | 2024 - 2028</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs pt-3 border-t border-neutral-900">
                <span className="text-neutral-400 font-medium">Undergraduate Performance:</span>
                <span className="bg-gold-text font-bold px-2 py-0.5 rounded text-[11px]">8.91 CGPA</span>
              </div>
            </div>
          </div>

          {/* Technology stack & Leadership grid */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center space-x-3 text-[#BF953F]">
              <Cpu size={16} />
              <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Aesthetic Tech Stacks</span>
            </div>
            <h3 className="text-xl font-bold text-white font-space-grotesk">Core Focus Areas</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-[#BF953F]/30 hover:bg-neutral-950/70 transition-all duration-300 group flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-neutral-300 text-sm group-hover:text-white transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">{skill.category}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 group-hover:bg-[#BF953F] transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Stats Dashboard section */}
      <section id="stats" className="py-16 bg-neutral-950/25 border-t border-b border-neutral-900/40 relative z-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="College CGPA" value={8.91} decimals={2} trigger={triggerStats} />
          <StatCard label="Instagram Tech Reach" value={2.5} decimals={1} suffix=" Lakh+" trigger={triggerStats} />
          <StatCard label="Advanced AI Projects" value={3} trigger={triggerStats} />
          <StatCard label="Professional Credentials" value={7} trigger={triggerStats} />
        </div>
      </section>

      {/* 3D Scroll Gallery Section */}
      <section id="gallery" className="py-24 relative z-10 overflow-hidden">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto mb-16 px-6">
          <div className="inline-flex items-center space-x-3 text-[#BF953F]">
            <Award size={16} />
            <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Achievements Wall</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white font-space-grotesk">
            Cinematic Highlights
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            Rotate the scroll gallery by scrolling vertically. Displaying achievements, internships, and photos with higher authorities.
          </p>
          <div className="animate-bounce inline-block text-xs font-bold bg-gold-text tracking-widest pt-2">
            ↓ SCROLL TO ROTATE TERM
          </div>
        </div>

        {/* Gallery */}
        <RadialScrollGallery
          className="!min-h-[700px] w-full"
          baseRadius={420}
          mobileRadius={260}
          visiblePercentage={50}
          scrollDuration={2200}
        >
          {(hoveredIndex) =>
            achievementsAndProjects.map((project, index) => {
              const isActive = hoveredIndex === index;
              return (
                <div 
                  key={project.id} 
                  className={`group relative overflow-hidden rounded-2xl bg-black border shadow-2xl transition-all duration-500 ease-out select-none ${project.width} ${project.height} ${isActive ? 'border-[#BF953F]/65 scale-105' : 'border-neutral-900 scale-100'}`}
                  style={{
                    boxShadow: isActive ? "0 10px 30px rgba(191, 149, 63, 0.15)" : "none"
                  }}
                >
                  {/* Photo with zoom and blur transitions */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={project.img}
                      alt={project.title}
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                        isActive ? 'scale-110 blur-0' : 'scale-100 blur-[2px] grayscale-[20%]'
                      }`}
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.src = project.fallbackImg;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-90" />
                  </div>

                  {/* Information Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5 z-20">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 bg-black/80 text-[#FCF6BA] border border-[#BF953F]/15 backdrop-blur-md rounded-md uppercase tracking-wider font-space-grotesk">
                        {project.cat}
                      </Badge>
                      <div className={`w-8 h-8 rounded-full bg-[#BF953F] text-black flex items-center justify-center transition-all duration-500 ${isActive ? 'opacity-100 rotate-0 scale-100 shadow-[0_0_10px_rgba(191,149,63,0.5)]' : 'opacity-0 -rotate-45 scale-75'}`}>
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </div>
                    </div>

                    <div className={`transition-all duration-500 transform ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                      <h3 className="text-lg font-bold leading-tight text-white mb-1.5 font-space-grotesk tracking-wide">{project.title}</h3>
                      <p className={`text-[11px] text-neutral-400 leading-relaxed font-light overflow-hidden transition-all duration-500 ${isActive ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        {project.details}
                      </p>
                      <div className={`h-0.5 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] mt-3.5 transition-all duration-500 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                    </div>
                  </div>
                </div>
              );
            })
          }
        </RadialScrollGallery>
      </section>

      {/* Dedicated Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-900/40 relative z-10">
        <div className="space-y-4 max-w-xl mb-16">
          <div className="flex items-center space-x-3 text-[#BF953F]">
            <Cpu size={16} />
            <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Enterprise Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white font-space-grotesk">
            AI Engineering Projects
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            A showcase of advanced software architectures, deep learning models, and ERP systems developed for practical production use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project 1 */}
          <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/25 hover:bg-black/35 transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#BF953F]/10 to-transparent blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-[#FCF6BA] font-bold uppercase bg-[#BF953F]/5 border border-[#BF953F]/10 px-2.5 py-1 rounded">
                  Machine Learning
                </span>
                <span className="text-xs text-neutral-500 font-semibold font-space-grotesk">March 2026</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-space-grotesk group-hover:text-[#FCF6BA] transition-colors leading-tight">
                Crop Yield Prediction Using Satellite Data
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                Developed a machine learning model to predict crop yield at district/taluk level using satellite imagery, weather, soil parameters, and historical yield data.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-900 mt-6">
              {["Python", "Satellite Imagery", "ML Regressors", "Soil Indices"].map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project 2 */}
          <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/25 hover:bg-black/35 transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#BF953F]/10 to-transparent blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-[#FCF6BA] font-bold uppercase bg-[#BF953F]/5 border border-[#BF953F]/10 px-2.5 py-1 rounded">
                  Computer Vision
                </span>
                <span className="text-xs text-neutral-500 font-semibold font-space-grotesk">Dec 2025</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-space-grotesk group-hover:text-[#FCF6BA] transition-colors leading-tight">
                AI-Based Student Tracking CCTV System
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                Real-time monitoring and tracking of students in classrooms using AI and CCTV. Automated attendance marking system based on facial recognition pipelines.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-900 mt-6">
              {["OpenCV", "Deep Learning", "Facial Recognition", "CNN Models"].map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project 3 */}
          <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/25 hover:bg-black/35 transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#BF953F]/10 to-transparent blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-[#FCF6BA] font-bold uppercase bg-[#BF953F]/5 border border-[#BF953F]/10 px-2.5 py-1 rounded">
                  Campus Platform
                </span>
                <span className="text-xs text-neutral-500 font-semibold font-space-grotesk">April 2026</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-space-grotesk group-hover:text-[#FCF6BA] transition-colors leading-tight">
                EduSync AI Attendance & Campus Management
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                An AI-driven digital campus platform designed for smart attendance tracking, secure student data management, and academic administration.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-900 mt-6">
              {["Fullstack AI", "Database Systems", "Academic Registers", "Cloud Services"].map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project 4 */}
          <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/25 hover:bg-black/35 transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#BF953F]/10 to-transparent blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-[#FCF6BA] font-bold uppercase bg-[#BF953F]/5 border border-[#BF953F]/10 px-2.5 py-1 rounded">
                  Enterprise ERP AI
                </span>
                <span className="text-xs text-neutral-500 font-semibold font-space-grotesk">May 2026</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-space-grotesk group-hover:text-[#FCF6BA] transition-colors leading-tight">
                Vel One ERP AI – Billing & Inventory Platform
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                AI-powered enterprise platform for wholesale billing, real-time inventory management, customer ledger tracking, and automated WhatsApp invoicing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-900 mt-6">
              {["ERP Systems", "Ledger Analytics", "WhatsApp Invoicing", "Inventory Control"].map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inspirational Quotes Carousel */}
      <section className="py-20 bg-neutral-950/15 border-t border-b border-neutral-900/40 relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center text-[#BF953F]">
            <Clock size={20} className="animate-spin-slow" />
          </div>
          
          <div className="min-h-[100px] flex items-center justify-center">
            <p className="text-lg sm:text-2xl font-light italic text-neutral-200 leading-relaxed">
              "{quotes[activeQuoteIndex].text}"
            </p>
          </div>
          
          <h4 className="text-xs font-bold tracking-widest text-[#BF953F] uppercase font-space-grotesk">
            — {quotes[activeQuoteIndex].author}
          </h4>
          
          <div className="flex justify-center space-x-2 pt-2">
            {quotes.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveQuoteIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeQuoteIndex === i ? 'w-4 bg-[#BF953F]' : 'bg-neutral-800'}`}
                aria-label={`Go to slide ${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline Section */}
      <section id="experience" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="space-y-4 max-w-xl mb-16">
          <div className="flex items-center space-x-3 text-[#BF953F]">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Career Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white font-space-grotesk">
            Personal Identity
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            A comprehensive mapping of my current academic credentials, digital creativity, and professional trajectory.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl">
          {/* Milestone 1 */}
          <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 flex gap-6 hover:border-[#BF953F]/20 transition-all duration-300 group">
            <div className="text-xs font-bold font-space-grotesk bg-gold-text pt-1 select-none shrink-0">
              PRESENT
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-space-grotesk">Future Technology Entrepreneur</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Innovation & Strategy</p>
              <p className="text-neutral-400 text-xs sm:text-sm font-light">
                Developing products with AI automation, stakeholder management, and scalable logic to solve complex enterprise problems.
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 flex gap-6 hover:border-[#BF953F]/20 transition-all duration-300 group">
            <div className="text-xs font-bold font-space-grotesk bg-gold-text pt-1 select-none shrink-0">
              PRESENT
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-space-grotesk">Instagram Content Creator</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Digital Presence & Community</p>
              <p className="text-neutral-400 text-xs sm:text-sm font-light">
                Providing technical concepts and educational guides under the handle <strong className="text-white">@thisisdhanu</strong> to an audience of tech enthusiasts.
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 flex gap-6 hover:border-[#BF953F]/20 transition-all duration-300 group">
            <div className="text-xs font-bold font-space-grotesk bg-gold-text pt-1 select-none shrink-0">
              MID 2025
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-space-grotesk">Computer Vision Intern</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">NSIC Ltd (Govt of India)</p>
              <p className="text-neutral-400 text-xs sm:text-sm font-light">
                Researched deep learning pipelines, CNN models, and facial tracking filters using Python programming languages and OpenCV libraries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-900/40 relative z-10">
        <div className="space-y-4 max-w-xl mb-16">
          <div className="flex items-center space-x-3 text-[#BF953F]">
            <BookOpen size={16} />
            <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Qualifications</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white font-space-grotesk">
            Verified Credentials
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            Continuous enrichment in Artificial Intelligence, Machine Learning pipelines, and Cloud databases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div 
              key={index} 
              className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/25 hover:bg-black/30 transition-all duration-500 flex flex-col justify-between h-44 group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold text-[#FCF6BA] border-[#BF953F]/20 bg-[#BF953F]/5 font-space-grotesk">
                    Verified ID
                  </Badge>
                  <span className="text-xs text-neutral-500 font-semibold">{cert.date}</span>
                </div>
                <h3 className="text-[15px] font-bold text-white mt-4 group-hover:text-[#FCF6BA] transition-colors leading-snug font-space-grotesk">
                  {cert.title}
                </h3>
              </div>
              <div className="text-xs text-neutral-400 font-medium flex items-center justify-between border-t border-neutral-900 pt-3 mt-4">
                <span>{cert.provider}</span>
                <ExternalLink size={12} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Identity & Social Presence Section */}
      <section id="socials" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-900/40 relative z-10">
        <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-3 text-[#BF953F]">
            <Sparkles size={16} />
            <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Creator Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white font-space-grotesk animate-pulse-gold">
            Digital Identity
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            Connect with me directly across corporate channels or social networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/thisisdhanu/"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/40 hover:bg-[#BF953F]/5 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 group"
          >
            <div className="p-3 rounded-full bg-neutral-900 text-[#BF953F] group-hover:scale-110 transition-transform">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xs font-space-grotesk tracking-widest uppercase text-white">Instagram</h4>
            <p className="text-[10px] text-neutral-500 font-medium">@thisisdhanu</p>
          </a>

          {/* LinkedIn Button */}
          <a
            href="https://www.linkedin.com/in/dhanush-dhamodharan-arumugam-vel-24606132b/"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/40 hover:bg-[#BF953F]/5 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 group"
          >
            <div className="p-3 rounded-full bg-neutral-900 text-[#BF953F] group-hover:scale-110 transition-transform">
              <LinkedinIcon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xs font-space-grotesk tracking-widest uppercase text-white">LinkedIn</h4>
            <p className="text-[10px] text-neutral-500 font-medium">Dhanush Dhamodharan</p>
          </a>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/40 hover:bg-[#BF953F]/5 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 group"
          >
            <div className="p-3 rounded-full bg-neutral-900 text-[#BF953F] group-hover:scale-110 transition-transform">
              <MessageCircle size={24} />
            </div>
            <h4 className="font-bold text-xs font-space-grotesk tracking-widest uppercase text-white">WhatsApp</h4>
            <p className="text-[10px] text-neutral-500">Quick Connect API</p>
          </button>

          {/* Direct Call Button */}
          <a
            href="tel:+919994726807"
            className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/40 hover:bg-[#BF953F]/5 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 group"
          >
            <div className="p-3 rounded-full bg-neutral-900 text-[#BF953F] group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <h4 className="font-bold text-xs font-space-grotesk tracking-widest uppercase text-white">Direct Call</h4>
            <p className="text-[10px] text-neutral-500">+91 9994726807</p>
          </a>

          {/* Email Button */}
          <a
            href="mailto:dhanushsinger872@gmail.com"
            className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-[#BF953F]/40 hover:bg-[#BF953F]/5 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 group"
          >
            <div className="p-3 rounded-full bg-neutral-900 text-[#BF953F] group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h4 className="font-bold text-xs font-space-grotesk tracking-widest uppercase text-white">Email Inbox</h4>
            <p className="text-[10px] text-neutral-500">dhanushsinger872</p>
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-900/40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Quick Connect & Text */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center space-x-3 text-[#BF953F]">
              <Sparkles size={16} />
              <span className="text-xs font-bold tracking-widest uppercase font-space-grotesk bg-gold-text">Consultation</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white font-space-grotesk">
              Start a Conversation.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
              If you want to collaborate on AI tracking CCTV cameras, crop model systems, placement drive coordination, or creator sponsorship deals, send a message.
            </p>
            
            <div className="space-y-4">
              <button 
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-between p-5 rounded-2xl border border-emerald-900/40 bg-emerald-950/5 hover:border-emerald-500/40 hover:bg-emerald-950/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-900/20 text-[#25D366]">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Encrypted Chat</span>
                    <p className="text-sm font-bold text-white mt-0.5">WhatsApp Quick Connect</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              <a 
                href="tel:+919994726807"
                className="w-full flex items-center justify-between p-5 rounded-2xl border border-[#BF953F]/20 bg-[#BF953F]/5 hover:border-[#BF953F]/40 hover:bg-[#BF953F]/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-[#BF953F]/20 text-[#BF953F]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Direct Call line</span>
                    <p className="text-sm font-bold text-white mt-0.5">+91 9994726807</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Message console */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-950/40 backdrop-blur-md space-y-6">
              <h3 className="text-lg font-bold text-white font-space-grotesk tracking-wide border-b border-neutral-900 pb-3">
                Send Digital Message
              </h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4 font-space-grotesk">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#BF953F]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#BF953F]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Message Details</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe collaboration opportunities..."
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#BF953F]/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 text-black flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)",
                    boxShadow: "0 4px 15px rgba(191, 149, 63, 0.2)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "brightness(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "none";
                  }}
                >
                  <span>Launch Message</span>
                  <Send size={14} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-neutral-900/40 relative z-10 bg-black/40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-500">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="text-lg font-cinzel tracking-widest bg-gold-text select-none font-semibold">
              DHANUSH.VEL
            </div>
            <p className="text-xs text-neutral-600 font-medium tracking-wide">
              Designed to inspire. Built for the future.
            </p>
          </div>

          <div className="flex gap-6 text-xs font-bold font-space-grotesk tracking-widest uppercase">
            <a 
              href="https://github.com/Dhanush-D136" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-white transition-colors animate-pulse-gold"
            >
              <GithubIcon className="w-4 h-4 text-[#BF953F]" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://linkedin.com/in/dhanush-dhamodharan-07755b31b" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-white transition-colors animate-pulse-gold"
            >
              <LinkedinIcon className="w-4 h-4 text-[#BF953F]" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://www.instagram.com/thisisdhanu/" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-[#FCF6BA] transition-colors animate-pulse-gold"
            >
              <InstagramIcon className="w-4 h-4 text-[#BF953F]" />
              <span>Instagram</span>
            </a>
          </div>

          <p className="text-xs font-light">
            © {new Date().getFullYear()} Dhanush Dhamodharan. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}
