import React from "react";
import CountUp from "react-countup";
import { BookOpen, Users, Award, Video, FileText, CheckCircle } from "lucide-react";

const Counter = () => {
  const stats = [
    { id: 1, title: "Active Students", end: 5000, suffix: "+", icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-500" /> },
    { id: 2, title: "Courses Available", end: 250, suffix: "+", icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-500" /> },
    { id: 3, title: "Certified Instructors", end: 120, suffix: "+", icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-orange-500" /> },
    { id: 4, title: "Lessons Completed", end: 75000, suffix: "+", icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-500" /> },
    { id: 5, title: "Hours of Video Content", end: 1200, suffix: "+", icon: <Video className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-pink-500" /> },
    { id: 6, title: "Certificates Issued", end: 3200, suffix: "+", icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-teal-500" /> },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-12 relative z-10 -mt-30">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl flex flex-col items-center justify-center 
              w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:min-w-[160px] lg:max-w-[160px] 
              h-[140px] sm:h-[160px] lg:h-[180px] 
              hover:shadow-2xl transition-all duration-300 p-3 sm:p-4"
          >
            <div className="mb-2 sm:mb-3">{item.icon}</div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900">
              <CountUp end={item.end} duration={3} suffix={item.suffix} />
            </h3>
            <p className="text-gray-600 mt-1 text-center text-xs sm:text-sm lg:text-base leading-tight">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Counter;