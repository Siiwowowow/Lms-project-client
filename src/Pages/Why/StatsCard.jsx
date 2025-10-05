import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

const StatsCard = ({ number, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  // Extract numeric value from string like "50K+" or "95%"
  const parseNumber = (str) => {
    if (typeof str === 'number') return str;
    
    const numStr = str
      .replace(/[^0-9.]/g, '') // Remove non-numeric except dot
      .trim();
    
    return numStr ? parseFloat(numStr) : 0;
  };

  const numericValue = parseNumber(number);
  const suffix = number.toString().replace(/[\d.]/g, ''); // e.g., "K+", "%"

  return (
    <motion.div
      ref={ref}
      className="relative bg-gray-200 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Animated background gradient (subtle on hover) */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

      <div className="relative z-10">
        {/* CountUp Number */}
        <motion.div
          className="text-3xl md:text-4xl font-bold text-black mb-2 drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CountUp
            start={isInView ? 0 : numericValue}
            end={numericValue}
            duration={2.5}
            separator=","
            decimals={suffix.includes('%') ? 0 : 0}
            suffix={suffix}
            className="font-sans tabular-nums"
          />
        </motion.div>

        {/* Label */}
        <div className="text-black font-medium text-sm md:text-base py-1.5 px-3 rounded-lg bg-white/10 backdrop-blur-sm">
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;