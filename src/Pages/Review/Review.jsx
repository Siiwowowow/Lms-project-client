import React from "react";

const Review = () => {
  const cardsData = [
    {
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&auto=format&fit=crop&q=60",
      name: "রিফাত আহমেদ",
      handle: "ক্লাস ৯",
      review:
        "TOTC এর ম্যাথ ভিডিও টিউটোরিয়াল দেখে অ্যালজেব্রা অনেক সহজ হয়ে গেছে। এখন পরীক্ষার জন্য আত্মবিশ্বাসী বোধ করছি।",
    },
    {
      image:
        "https://images.unsplash.com/photo-1611605698335-8b1b1fc3a873?w=200&auto=format&fit=crop&q=60",
      name: "মাহিমা আক্তার",
      handle: "ক্লাস ১০",
      review:
        "এসএসসি প্রস্তুতির জন্য আমি TOTC ব্যবহার করছি। প্র্যাকটিস কুইজ আমাকে সময় ম্যানেজমেন্ট শিখতে সাহায্য করেছে।",
    },
    {
      image:
        "https://images.unsplash.com/photo-1629992101753-8b6b5480a219?w=200&auto=format&fit=crop&q=60",
      name: "সাকিব হোসেন",
      handle: "ক্লাস ১১",
      review:
        "ফিজিক্স এর জটিল টপিক যেমন নিউটনের সূত্র TOTC এর অ্যানিমেশন ভিডিও দেখে একদম ক্লিয়ার হয়েছে।",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "তানিয়া সুলতানা",
      handle: "ক্লাস ১২",
      review:
        "এইচএসসি প্রস্তুতির জন্য লাইভ ক্লাস আর প্র্যাকটিস প্রশ্নপত্র আমার শেখার গতি বাড়িয়ে দিয়েছে।",
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-3 rounded-lg mx-2 shadow hover:shadow-lg transition-all duration-200 
                    w-44 sm:w-56 md:w-64 lg:w-72 shrink-0 bg-base-100 border">
      <div className="flex gap-2">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={card.image}
          alt="User"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-sm sm:text-base">{card.name}</p>
            {/* Verify Icon */}
            <svg
              className="mt-0.5 fill-blue-500"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              />
            </svg>
          </div>
          <span className="text-xs text-base-500">{card.handle}</span>
        </div>
      </div>
      <p className="text-xs sm:text-sm py-3 text-base-800">{card.review}</p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
        .marquee-inner { animation: marqueeScroll 25s linear infinite; }
        .marquee-inner:hover { animation-play-state: paused; }
        .marquee-reverse { animation-direction: reverse; }
      `}</style>

      <div className="text-center max-w-2xl mx-auto my-10 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-base-800 mb-4">
          আমাদের শিক্ষার্থীদের অভিজ্ঞতা
        </h2>
        <p className="text-sm sm:text-base text-base-600">
          ক্লাস ৮ থেকে শুরু করে এসএসসি এবং এইচএসসি পর্যন্ত শিক্ষার্থীরা TOTC এর মাধ্যমে উপকৃত হচ্ছে। 
          তাদের কিছু অভিজ্ঞতা দেখুন।
        </p>
      </div>

      {/* First Row */}
      <div className="marquee-row w-full mx-auto max-w-8xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-10 sm:w-20 z-10 pointer-events-none bg-gradient-to-r from-base-100 to-transparent"></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] pt-6 sm:pt-10 pb-4">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-10 sm:w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-base-100 to-transparent"></div>
      </div>

      {/* Second Row */}
      <div className="marquee-row w-full mx-auto max-w-8xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-10 sm:w-20 z-10 pointer-events-none bg-gradient-to-r from-base-100 to-transparent"></div>
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-6 sm:pt-10 pb-4">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-10 sm:w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-base-100 to-transparent"></div>
      </div>
    </>
  );
};

export default Review;
