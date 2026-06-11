import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, ChevronDown, Volume2, VolumeX } from "lucide-react";

// Inline Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// BlurText animation component
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInView(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  const isGradient = className.includes("bg-gold-text");
  const parentClass = className.replace("bg-gold-text", "");

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${parentClass}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          className={isGradient ? "bg-gold-text" : ""}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
            color: isGradient ? undefined : "inherit",
            WebkitTextFillColor: isGradient ? undefined : "inherit",
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export default function PortfolioHero() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Background Music setup
  useEffect(() => {
    const audio = new Audio("/background song.mp3");
    audio.loop = true;
    audio.volume = 0; // Start at 0 for fade-in
    audioRef.current = audio;

    const startAudio = () => {
      // Trigger smooth volume fade-in
      audio.play()
        .then(() => {
          setIsMusicPlaying(true);
          fadeVolume(1.0, 1500); // Fade to 100% volume over 1.5s
        })
        .catch((err) => {
          console.log("Autoplay restricted by browser, waiting for user click.", err);
        });
      // Remove triggers
      window.removeEventListener("click", startAudio);
      window.removeEventListener("scroll", startAudio);
      window.removeEventListener("keydown", startAudio);
    };

    window.addEventListener("click", startAudio);
    window.addEventListener("scroll", startAudio);
    window.addEventListener("keydown", startAudio);

    return () => {
      audio.pause();
      window.removeEventListener("click", startAudio);
      window.removeEventListener("scroll", startAudio);
      window.removeEventListener("keydown", startAudio);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Smooth Volume Fade Logic
  const fadeVolume = (targetVolume: number, durationMs: number) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const difference = targetVolume - startVolume;
    const intervalTime = 50; // Update volume every 50ms
    const totalSteps = durationMs / intervalTime;
    const stepAmount = difference / totalSteps;
    let stepCount = 0;

    fadeIntervalRef.current = setInterval(() => {
      stepCount++;
      const nextVolume = startVolume + stepAmount * stepCount;
      audio.volume = Math.max(0, Math.min(1.0, nextVolume));

      if (stepCount >= totalSteps) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (targetVolume === 0) {
          audio.pause();
        }
      }
    }, intervalTime);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    if (isMusicPlaying) {
      setIsMusicPlaying(false);
      fadeVolume(0, 1200); // Fade to silent over 1.2s, then pause
    } else {
      setIsMusicPlaying(true);
      audio.play()
        .then(() => {
          fadeVolume(1.0, 1200); // Fade to max over 1.2s
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const menuItems = [
    { label: "HOME", href: "#home", highlight: true },
    { label: "ABOUT STORY", href: "#about" },
    { label: "AI PROJECTS", href: "#projects" },
    { label: "3D GALLERY", href: "#gallery" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "CERTIFICATIONS", href: "#certifications" },
    { label: "DIGITAL IDENTITY", href: "#socials" },
    { label: "CONTACT FORM", href: "#contact" },
  ];

  return (
    <div 
      id="home"
      className="min-h-screen text-foreground transition-colors relative flex flex-col justify-between"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 2%)" : "hsl(0 0% 98%)",
        color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
      }}
    >
      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-[2px] transition-all duration-300"
        style={{
          background: isDark 
            ? "linear-gradient(to bottom, rgba(2, 2, 3, 0.95) 0%, rgba(2, 2, 3, 0.6) 60%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(250, 250, 250, 0.95) 0%, rgba(250, 250, 250, 0.6) 60%, transparent 100%)"
        }}
      >
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Menu Button */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-2 transition-colors duration-300 z-50 text-neutral-500 hover:text-black dark:hover:text-[#FCF6BA]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              ) : (
                <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              )}
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 w-[240px] sm:w-[260px] border border-neutral-800/80 shadow-2xl mt-2 ml-1 sm:ml-4 p-4 rounded-xl z-[100] bg-black/90 backdrop-blur-xl"
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-xs font-bold tracking-widest py-2.5 px-3 cursor-pointer transition-all duration-300 rounded-lg hover:bg-white/5 font-space-grotesk"
                    style={{
                      color: item.highlight ? "#FCF6BA" : "hsl(0 0% 70%)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FCF6BA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.highlight ? "#FCF6BA" : "hsl(0 0% 70%)";
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Signature DHANUSH.VEL (Cinzel high-end luxury font) */}
          <div className="text-base sm:text-2xl font-cinzel tracking-wider bg-gold-text select-none font-semibold">
            DHANUSH.VEL
          </div>

          {/* Controls: Audio & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Background Music Toggle */}
            <button
              type="button"
              onClick={toggleMusic}
              className="p-2 sm:px-3.5 sm:py-2 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase rounded-lg border border-neutral-800/80 bg-neutral-950/40 backdrop-blur"
              aria-label="Toggle music"
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#BF953F] animate-pulse" />
                  <span className="bg-gold-text font-semibold hidden sm:inline">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Audio Off</span>
                </>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative w-16 h-8 rounded-full hover:opacity-80 transition-opacity"
              style={{ backgroundColor: isDark ? "hsl(0 0% 12%)" : "hsl(0 0% 90%)" }}
              aria-label="Toggle theme"
            >
              <div
                className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300"
                style={{
                  backgroundColor: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
                  transform: isDark ? "translateX(2rem)" : "translateX(0)",
                }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col justify-center items-center pt-36 pb-20">
        
        {/* Centered Main Name - Always Perfectly Centered */}
        <div className="w-full px-4 select-none text-center">
          <div className="relative inline-block">
            
            {/* First Name */}
            <div>
              <BlurText
                text="DHANUSH"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-bold text-[60px] sm:text-[100px] md:text-[140px] lg:text-[170px] xl:text-[195px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap bg-gold-text font-space-grotesk"
              />
            </div>
            
            {/* Last Name */}
            <div className="mt-1 sm:mt-3">
              <BlurText
                text="DHAMODHARAN"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-bold text-[36px] sm:text-[62px] md:text-[88px] lg:text-[108px] xl:text-[124px] leading-[0.85] tracking-tighter uppercase justify-center whitespace-nowrap bg-gold-text font-space-grotesk"
              />
            </div>

            {/* Profile Picture (Obsidian / Gold Frame) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-[70px] h-[105px] sm:w-[95px] sm:h-[142px] md:w-[115px] md:h-[172px] lg:w-[130px] lg:h-[195px] rounded-full overflow-hidden shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer border border-[#BF953F]/40 bg-neutral-900 animate-pulse-gold">
                <img
                  src="/main profile photo dhanu.webp"
                  alt="Dhanu"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Titles Grid - Proper Distance Below Hero */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 xl:bottom-32 left-1/2 -translate-x-1/2 w-full px-6 text-center max-w-4xl">
          <div className="flex flex-col items-center justify-center space-y-3">
            <BlurText
              text="Designing human experiences in code."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-[14px] sm:text-[18px] md:text-[20px] text-center transition-colors duration-300 text-neutral-400 hover:text-white font-light"
              style={{ fontFamily: "'Antic', sans-serif" }}
            />
            
            {/* Grid of details */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10px] sm:text-xs font-semibold tracking-widest text-[#BF953F] uppercase font-space-grotesk pt-2">
              <span>AI & Data Science Student</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              <span>AI Developer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              <span>Instagram Content Creator</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              <span>Creative Technologist</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300 hover:scale-110"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 md:w-8 md:h-8 text-neutral-500 hover:text-[#FCF6BA] transition-colors duration-300" />
        </a>

      </main>
    </div>
  );
}
