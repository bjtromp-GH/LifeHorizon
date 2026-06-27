import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

interface AgeScrollPickerProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  onSelect?: () => void;
}

export default function AgeScrollPicker({ value, min, max, onChange, onSelect }: AgeScrollPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const ITEM_HEIGHT = 44;

  useEffect(() => {
    // Initial scroll position
    if (isExpanded && scrollRef.current) {
      const index = value - min;
      scrollRef.current.scrollTop = index * ITEM_HEIGHT;
    }
  }, [isExpanded]);

  // Update scroll position if value changes externally, but only if not currently scrolling
  useEffect(() => {
    if (isExpanded && scrollRef.current && !isScrolling) {
      const index = value - min;
      scrollRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth'
      });
    }
  }, [value, min, isScrolling, isExpanded]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
    const newValue = min + index;
    
    if (newValue !== value && newValue >= min && newValue <= max) {
      onChange(newValue);
      
      // Haptic feedback if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(10);
        } catch (e) {
          // Ignore
        }
      }
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  const handleOptionClick = (opt: number) => {
    onChange(opt);
    setIsExpanded(false);
    if (onSelect) onSelect();
  };

  return (
    <div className="w-full">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-[#D56B45]/40 bg-[#FAF3F0] shadow-3xs cursor-pointer hover:bg-[#F5E8E2] transition-colors"
        >
          <div className="w-6" /> {/* Spacer to keep center aligned */}
          <div className="flex items-center space-x-1.5">
            <span className="font-mono font-black text-[#D56B45] text-xl">{value}</span>
            <ChevronDown className="w-4 h-4 text-[#D56B45]/60" />
          </div>
          <div className="w-6 h-6 flex items-center justify-center bg-[#D56B45] text-white rounded-full shadow-sm">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
        </button>
      ) : (
        <div className="relative h-[132px] w-full overflow-hidden bg-white rounded-xl border border-[#D56B45]/50 ring-2 ring-[#D56B45]/20 shadow-inner select-none touch-pan-y">
          {/* Top overlay/button to close */}
          <button 
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 z-20 p-1 bg-white/80 rounded-full text-[#767676] hover:bg-gray-100 cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Center highlight overlay */}
          <div className="absolute top-1/2 left-0 w-full h-[44px] -translate-y-1/2 bg-[#D56B45]/10 border-y border-[#D56B45]/30 pointer-events-none z-10"></div>
          
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto snap-y snap-mandatory flex flex-col items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Padding top to center the first item */}
            <div style={{ height: ITEM_HEIGHT }} className="shrink-0" />
            
            {options.map((opt) => {
              const isSelected = opt === value;
              return (
                <div 
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  className={`h-[44px] shrink-0 flex items-center justify-center snap-center w-full transition-all duration-150 cursor-pointer ${
                    isSelected ? 'text-[#D56B45] font-black text-2xl scale-110' : 'text-[#767676] font-medium text-lg hover:text-[#2D2D2D]'
                  }`}
                >
                  {opt}
                </div>
              );
            })}

            {/* Padding bottom to center the last item */}
            <div style={{ height: ITEM_HEIGHT }} className="shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}
