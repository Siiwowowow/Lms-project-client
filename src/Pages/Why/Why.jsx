import React from 'react';
import { motion } from 'framer-motion';

import FeatureCard from './FeatureCard';
import CourseCardLimit from './CourseCardLimit';

const Why = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  py-12 px-4 overflow-hidden">
      {/* Main Container - Glassmorphism Card */}
      <motion.div
        className="relative max-w-7xl mx-auto rounded-3xl border border-white/30 bg-base-100 backdrop-blur-sm shadow-xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 opacity-10 rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-pink-400 to-amber-400 opacity-10 rounded-tl-full"></div>

        <div className="p-6 md:p-10 lg:p-12 relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-base-400 mb-5 font-sans tracking-tight">
              কেন আমাদের LMS বেছে নিবেন?
            </h1>
            <p className="text-base-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-sans">
              বাংলাদেশের প্রথম সারির ডিজিটাল লার্নিং প্ল্যাটফর্ম যেখানে আপনি পাবেন বিশ্বস্ত শিক্ষা ও দক্ষতা উন্নয়নের সর্বোত্তম সুযোগ
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: '🎓', title: 'বিশেষজ্ঞ শিক্ষক', desc: 'আমাদের অভিজ্ঞ ও প্রশিক্ষিত শিক্ষকদের কাছ থেকে সরাসরি শিখুন' },
              { icon: '📱', title: 'মোবাইল ফ্রেন্ডলি', desc: 'যেকোনো ডিভাইসে যেকোনো সময় শিখুন, ইন্টারনেট সংযোগ থাকলেই হলো' },
              { icon: '💼', title: 'ক্যারিয়ার সাপোর্ট', desc: 'কোর্স সম্পন্নে জব প্লেসমেন্ট সহায়তা ও ক্যারিয়ার গাইডলাইন' },
              { icon: '⚡', title: 'দ্রুত শিখুন', desc: 'ইন্টারেক্টিভ ভিডিও ও লাইভ ক্লাসের মাধ্যমে দ্রুত শিখুন' },
              { icon: '🛠️', title: 'প্র্যাকটিক্যাল কোর্স', desc: 'প্রজেক্ট ভিত্তিক কোর্স যা বাস্তব জীবনের দক্ষতা উন্নত করে' },
              { icon: '👥', title: 'কমিউনিটি', desc: 'শিক্ষার্থী ও শিক্ষকদের সাথে নেটওয়ার্ক গড়ে তুলুন' },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.desc}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Popular Courses */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-base-400 text-center mb-8 font-sans">
              জনপ্রিয় কোর্সসমূহ
            </h2>
            <div>
             <CourseCardLimit></CourseCardLimit>
            </div>
          </motion.div>

          {/* Stats */}
          {/* <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <StatsCard number="50K+" label="সক্রিয় শিক্ষার্থী" />
            <StatsCard number="200+" label="বিশেষজ্ঞ শিক্ষক" />
            <StatsCard number="500+" label="কোর্স সমূহ" />
            <StatsCard number="95%" label="সাফল্যের হার" />
          </motion.div> */}

          {/* Instructors */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-base-400 text-center mb-8 font-sans">
              আমাদের বিশেষজ্ঞ শিক্ষকবৃন্দ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <InstructorCard></InstructorCard>
            </div>
          </motion.div> */}

          {/* CTA Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            {/* <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              🚀 বিনামূল্যে রেজিস্ট্রেশন করুন
            </motion.button> */}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Why;