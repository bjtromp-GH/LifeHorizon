import { motion, AnimatePresence } from "motion/react";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, User, Heart, Compass } from "lucide-react";
import { UserInputs, LifePhases } from "../types";
import OnboardingPanel from "./OnboardingPanel";
import BioScoreSection from "./BioScoreSection";
import AestheticFidelityCards from "./AestheticFidelityCards";
import LifePhasesBar from "./LifePhasesBar";
import DecadeGrid from "./DecadeGrid";

interface MobileContainerProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  phases: LifePhases;
  apiSource: string;
  onInputChange: (updates: Partial<UserInputs>) => void;
  onRestartOnboarding: () => void;
}

export default function MobileContainer({
  inputs,
  projectedLifeExpectancy,
  phases,
  apiSource,
  onInputChange,
  onRestartOnboarding,
}: MobileContainerProps) {
  // 3 high-level Slides:
  // 0: Persoonlijke Parameters (Onboarding)
  // 1: Vitaliteit & Bio-Score
  // 2: Dashboard (Phases, Stats, Decade Grid)
  const [slideIndex, setSlideIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right">("right");
  
  // Touch coordinates for swipe detection
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Minimum distance in px to qualify as a swipe
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && slideIndex < 2) {
      setSwipeDirection("right");
      setSlideIndex((prev) => prev + 1);
    } else if (isRightSwipe && slideIndex > 0) {
      setSwipeDirection("left");
      setSlideIndex((prev) => prev - 1);
    }

    // Reset touch variables
    touchStart.current = null;
    touchEnd.current = null;
  };

  const goToSlide = (idx: number) => {
    setSwipeDirection(idx > slideIndex ? "right" : "left");
    setSlideIndex(idx);
  };

  // Slides configuration with custom header details and icons
  const slides = [
    {
      id: "slide-onboarding",
      title: "Profiel",
      subtitle: "Calibreer je biologische parameters",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "slide-bioscore",
      title: "Vitaliteit",
      subtitle: "Leefstijl modifiers",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: "slide-grid",
      title: "Matrix",
      subtitle: "Tijd-budget & decennia",
      icon: <Compass className="w-4 h-4" />,
    },
  ];

  // Animation variants for card slide effects
  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const totalRemaining = Math.max(0, projectedLifeExpectancy - inputs.currentAge);
  const totalRoundedRemaining = Math.round(totalRemaining * 10) / 10;

  return (
    <div
      id="mobile-viewport-root"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col h-[100dvh] bg-[#F9F8F6] text-[#2D2D2D] overflow-hidden select-none"
    >
      {/* 1. Mobile Custom Header bar */}
      <header className="px-4 py-3 bg-white border-b border-[#EAEAEA] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#D56B45]" />
          <span className="font-sans font-bold text-sm tracking-tight text-[#2D2D2D]">
            LifeRunway
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            id="btn-mobile-restart-onboarding"
            onClick={onRestartOnboarding}
            title="Start de geanimeerde introductie opnieuw"
            className="p-1 px-2 border border-[#EAEAEA] bg-white text-[10px] font-bold text-[#767676] rounded hover:bg-gray-100 transition-all cursor-pointer flex items-center space-x-1"
          >
            <span>🎈 Intro</span>
          </button>
          <div className="font-mono text-[11px] text-[#D56B45] font-semibold bg-[#D56B45]/10 px-2 py-0.5 rounded-full">
            {totalRoundedRemaining} jr restant
          </div>
        </div>
      </header>

      {/* 2. Top Slides Tab indicators */}
      <nav id="mobile-tabs" className="px-4 py-2 bg-white flex border-b border-[#EAEAEA]/80 shrink-0">
        <div className="grid grid-cols-3 w-full gap-1 bg-gray-100 p-1 rounded-md">
          {slides.map((slide, idx) => {
            const isActive = slideIndex === idx;
            return (
              <button
                key={slide.id}
                type="button"
                id={`btn-mobile-tab-${idx}`}
                onClick={() => goToSlide(idx)}
                className={`flex items-center justify-center space-x-1 py-1.5 rounded text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#D56B45] shadow-xs"
                    : "text-[#767676] hover:bg-white/40"
                }`}
              >
                {slide.icon}
                <span>{slide.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Slides Body frame (Animated horizontally, no vertical scrolling!) */}
      <main className="flex-1 relative overflow-hidden px-4 py-3 flex flex-col justify-between">
        <div className="absolute inset-0 px-4 py-3 flex flex-col overflow-y-auto overflow-x-hidden">
          <AnimatePresence initial={false} custom={swipeDirection} mode="wait">
            <motion.div
              key={slideIndex}
              custom={swipeDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full flex-1 flex flex-col h-full"
            >
              {/* Slide Title */}
              <div className="mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#767676]">
                  Stap {slideIndex + 1} van 3
                </span>
                <h2 className="text-base font-bold text-[#2D2D2D] leading-tight">
                  {slides[slideIndex].title}
                </h2>
                <p className="text-[11px] text-[#767676]">
                  {slides[slideIndex].subtitle}
                </p>
              </div>

              {/* Dynamic Slides render */}
              {slideIndex === 0 && (
                <div className="bg-white p-4 border border-[#EAEAEA] rounded-md space-y-4">
                  <OnboardingPanel inputs={inputs} onChange={onInputChange} />
                </div>
              )}

              {slideIndex === 1 && (
                <div className="bg-white p-4 border border-[#EAEAEA] rounded-md overflow-y-auto max-h-[62dvh] pr-1">
                  <BioScoreSection answers={inputs.bioAnswers} onChange={(u) => onInputChange({ bioAnswers: { ...inputs.bioAnswers, ...u } })} />
                </div>
              )}

              {slideIndex === 2 && (
                <div className="space-y-4 pb-4">
                  {/* High Fidelity Stacked Cards */}
                  <AestheticFidelityCards
                    inputs={inputs}
                    projectedLifeExpectancy={projectedLifeExpectancy}
                    apiSource={apiSource}
                  />

                  {/* Tiny Life phases bar */}
                  <div className="bg-white p-3 border border-[#EAEAEA] rounded-md">
                    <LifePhasesBar
                      inputs={inputs}
                      projectedLifeExpectancy={projectedLifeExpectancy}
                      phases={phases}
                    />
                  </div>

                  {/* Decade Grid resized/formatted for mobile screens */}
                  <div className="scale-[0.98] transform origin-top">
                    <DecadeGrid
                      inputs={inputs}
                      projectedLifeExpectancy={projectedLifeExpectancy}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Swiper Controls and Pagination indicators at bottom */}
      <footer className="bg-white border-t border-[#EAEAEA] py-2 px-4 flex items-center justify-between shrink-0 select-none">
        {/* Left Indicator/Button */}
        <button
          type="button"
          id="btn-mobile-prev"
          disabled={slideIndex === 0}
          onClick={() => {
            if (slideIndex > 0) {
              setSwipeDirection("left");
              setSlideIndex((prev) => prev - 1);
            }
          }}
          className={`p-1.5 rounded-full transition-all duration-300 ${
            slideIndex === 0 ? "opacity-20 cursor-default" : "hover:bg-gray-100 cursor-pointer text-[#D56B45]"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Small Progress Dots */}
        <div className="flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              id={`nav-dot-${idx}`}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                slideIndex === idx ? "bg-[#D56B45] w-4" : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Right Indicator/Button */}
        <button
          type="button"
          id="btn-mobile-next"
          disabled={slideIndex === 2}
          onClick={() => {
            if (slideIndex < 2) {
              setSwipeDirection("right");
              setSlideIndex((prev) => prev + 1);
            }
          }}
          className={`p-1.5 rounded-full transition-all duration-300 ${
            slideIndex === 2 ? "opacity-20 cursor-default" : "hover:bg-gray-100 cursor-pointer text-[#D56B45]"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
