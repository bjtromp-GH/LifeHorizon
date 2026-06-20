import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface NumberTickerProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
}

export default React.memo(function NumberTicker({ 
  value, 
  duration = 2, 
  decimals = 0,
  className = "",
  delay = 0,
  prefix = "",
  suffix = ""
}: NumberTickerProps) {
  const [hasTriggered, setHasTriggered] = useState(false);
  
  const springValue = useSpring(0, {
    bounce: 0,
    duration: duration * 1000,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTriggered(true);
      springValue.set(value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, springValue, delay]);

  const displayValue = useTransform(springValue, (current) => {
    return prefix + current.toFixed(decimals) + suffix;
  });

  return (
    <motion.span className={className}>
      {hasTriggered ? displayValue : `${prefix}${(0).toFixed(decimals)}${suffix}`}
    </motion.span>
  );
});
