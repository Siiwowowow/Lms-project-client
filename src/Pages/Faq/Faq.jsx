import React from 'react';

const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "আমি কিভাবে এই প্ল্যাটফর্ম ব্যবহার করব?",
      answer: "রেজিস্ট্রেশন করুন, আপনার পছন্দের কোর্স সিলেক্ট করুন এবং যেকোনো ডিভাইস থেকে শিখুন। আপনার ড্যাশবোর্ডে সব কোর্স, প্রোগ্রেস এবং সার্টিফিকেট এক জায়গায় পাবেন।"
    },
    {
      question: "কোর্সগুলো কি বাংলায় উপলব্ধ?",
      answer: "হ্যাঁ! আমাদের সকল কোর্স বাংলা ভাষায় উপলব্ধ। আপনি চাইলে ইংরেজি সাবটাইটেলও চালু করতে পারবেন।"
    },
    {
      question: "কোর্স সম্পন্নে কি সার্টিফিকেট পাবো?",
      answer: "অবশ্যই! প্রতিটি কোর্স সফলভাবে সম্পন্ন করলে আপনি আন্তর্জাতিক মানের ডিজিটাল সার্টিফিকেট পাবেন, যা আপনার LinkedIn বা রেজিউমে যোগ করা যাবে।"
    },
    {
      question: "আমি কি মোবাইল দিয়ে কোর্স করতে পারব?",
      answer: "হ্যাঁ, আমাদের প্ল্যাটফর্ম সম্পূর্ণ মোবাইল ফ্রেন্ডলি। অ্যান্ড্রয়েড ও iOS উভয় ডিভাইসে অ্যাপ ডাউনলোড করে যেকোনো সময় শিখুন।"
    },
    {
      question: "পেমেন্ট মেথড কী কী?",
      answer: "বিকাশ, নগদ, রকেট, ভিসা/মাস্টারকার্ড এবং ব্যাংক ট্রান্সফার — সব ধরনের পেমেন্ট মেথড সাপোর্ট করা হয়।"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Poppins:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        
        .bangla-font {
          font-family: 'Noto Sans Bengali', 'Poppins', sans-serif;
        }
      `}</style>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 px-4 py-12 md:px-0">
        <img
          className="max-w-sm mt-8 w-full rounded-xl h-auto shadow-lg"
          src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
          alt="শিক্ষার্থীরা অনলাইন ক্লাস করছে"
        />
        
        <div className="bangla-font w-full">
          <p className="text-[#0BA6DF] text-sm font-medium">প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)</p>
          <h1 className="text-2xl md:text-3xl font-bold text-base-800 mt-1">
            উত্তর খুঁজছেন?
          </h1>
          <p className="text-sm text-base-600 mt-2 pb-4">
            আপনার শিক্ষা যাত্রায় সহায়তা করতে আমরা সবসময় প্রস্তুত। নিচের প্রশ্নগুলো দেখুন।
          </p>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div 
                  className="flex items-center justify-between p-4 border border-gray-100 bg-base-100 cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="text-base font-semibold text-base-800 border-gray-100">
                    {faq.question}
                  </h3>
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 18 18" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                  >
                    <path 
                      d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" 
                      stroke="#1D293D" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>
                
                <div 
                  className={`px-4 overflow-hidden transition-all duration-500 border border-gray-100 ease-in-out ${
                    openIndex === index 
                      ? 'max-h-96 opacity-100 pb-4' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-base-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;