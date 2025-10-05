import React from 'react';
import { Play, BookOpen, Award, TrendingUp, Users } from 'lucide-react';
import img1 from '../../assets/img1.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 relative overflow-hidden z-0">
      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#ffffff"
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Left Content - Text Section */}
          <div className="space-y-4 sm:space-y-6 animate-fadeIn text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              <span className="text-orange-400">Studying</span> Online is now <br />
              much easier
            </h1>

            <p className="text-white text-sm sm:text-base lg:text-lg max-w-md mx-auto lg:mx-0 opacity-90 leading-relaxed">
              TOTC is an engaging platform designed to teach you through interactive
              experiences, personalized learning paths, and real-time feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
              <button className="bg-white text-cyan-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-xl transition-all hover:scale-105 whitespace-nowrap w-full sm:w-auto">
                Join for free
              </button>

              <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer w-full sm:w-auto justify-center sm:justify-start">
                <div className="bg-white p-2.5 sm:p-3 rounded-full shadow-md transition-all group-hover:scale-105 group-hover:rotate-6">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 fill-current" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base group-hover:text-gray-100 transition duration-300">
                  Watch how it works
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Image + Floating Cards */}
          <div className="relative w-full flex justify-center lg:justify-end mt-4 sm:mt-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[500px]">
              {/* Student Image */}
              <img
                src={img1}
                alt="Student studying online"
                className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300 max-h-[300px] sm:max-h-none"
              />

              {/* Floating Cards - Hidden on mobile, visible on sm and above */}
              <div className="hidden sm:block">
                {/* 1. Stats Card */}
                <div className="absolute top-4 left-2 sm:top-8 sm:left-8 bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-cyan-100 animate-float">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-cyan-100 p-2 sm:p-3 rounded-xl">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-gray-800">250k+</p>
                      <p className="text-xs sm:text-sm text-gray-500">Students Assisted</p>
                    </div>
                  </div>
                </div>

                {/* 2. Congratulations Card */}
                <div className="absolute top-28 right-2 sm:top-40 sm:-right-10 bg-white rounded-2xl shadow-xl p-3 sm:p-4 w-48 sm:w-64 animate-float" style={{animationDelay: '1s'}}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-xs sm:text-sm">Congratulations!</p>
                      <p className="text-xs text-gray-500">Your admission is confirmed 🎓</p>
                    </div>
                  </div>
                </div>

                {/* 3. Class Card */}
                <div className="absolute bottom-16 right-2 sm:right-10 bg-white rounded-2xl shadow-xl p-3 sm:p-4 w-56 sm:w-72 animate-float" style={{animationDelay: '2s'}}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      UX
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-xs sm:text-sm">User Experience Class</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">Today at 12:00 PM</p>
                      <button className="mt-2 bg-gradient-to-r from-pink-400 to-orange-400 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:shadow-md transition-all hover:scale-105">
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Book Progress Card */}
                <div className="absolute bottom-2 left-10 sm:left-20 bg-orange-500 rounded-2xl shadow-xl p-3 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center animate-float" style={{animationDelay: '1.5s'}}>
                  <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* 5. Trending Card */}
                <div className="absolute top-1/3 left-2 sm:left-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl shadow-xl p-2 sm:p-2.5 animate-float" style={{animationDelay: '0.5s'}}>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;