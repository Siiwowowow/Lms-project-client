import React from 'react';

const InstructorCard = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mx-auto">
                    আমাদের প্রশিক্ষকবৃন্দ
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 text-center mt-2 sm:mt-3 max-w-lg mx-auto px-4">
                    শিক্ষার্থীদের জন্য সেরা দিকনির্দেশনা প্রদানকারী অভিজ্ঞ শিক্ষক ও মেন্টর।
                </p>

                {/* Mobile & Tablet - Vertical Stack */}
                <div className="block lg:hidden mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                    {/* Card 1 */}
                    <div className="relative group w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=800&h=400&auto=format&fit=crop"
                            alt="প্রম্পট ইঞ্জিনিয়ার" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
                            <h1 className="text-xl sm:text-2xl font-semibold">প্রম্পট ইঞ্জিনিয়ার</h1>
                            <p className="text-xs sm:text-sm mt-1">মানব অভিপ্রায় ও মেশিন বোঝাপড়ার মধ্যে সেতুবন্ধন তৈরি।</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative group w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg">
                        <img 
                            className="h-full w-full object-cover object-right"
                            src="https://images.unsplash.com/photo-1714976326351-0ecf0244f0fc?q=80&w=800&h=400&auto=format&fit=crop"
                            alt="ডাটা সায়েন্টিস্ট" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
                            <h1 className="text-xl sm:text-2xl font-semibold">ডাটা সায়েন্টিস্ট</h1>
                            <p className="text-xs sm:text-sm mt-1">ডাটার মাধ্যমে সমস্যার সমাধান ও গবেষণা।</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative group w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1736220690062-79e12ca75262?q=80&w=800&h=400&auto=format&fit=crop"
                            alt="সফটওয়্যার ইঞ্জিনিয়ার" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
                            <h1 className="text-xl sm:text-2xl font-semibold">সফটওয়্যার ইঞ্জিনিয়ার</h1>
                            <p className="text-xs sm:text-sm mt-1">আধুনিক অ্যাপ্লিকেশন ও সিস্টেম উন্নয়নে বিশেষজ্ঞ।</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative group w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1620477403960-4188fdd7cee0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fFRlYWNoZXIlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
                            alt="শিক্ষক (ক্লাস ৯-১০)" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
                            <h1 className="text-xl sm:text-2xl font-semibold">শিক্ষক (ক্লাস ৯-১০)</h1>
                            <p className="text-xs sm:text-sm mt-1">মাধ্যমিক স্তরের জন্য অভিজ্ঞ প্রশিক্ষক।</p>
                        </div>
                    </div>

                    {/* Card 5 */}
                    <div className="relative group w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fFRlYWNoZXIlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
                            alt="শিক্ষক (ক্লাস ১১-১২)" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
                            <h1 className="text-xl sm:text-2xl font-semibold">শিক্ষক (ক্লাস ১১-১২)</h1>
                            <p className="text-xs sm:text-sm mt-1">উচ্চ মাধ্যমিক স্তরের জন্য বিশেষজ্ঞ শিক্ষক।</p>
                        </div>
                    </div>
                </div>

                {/* Desktop - Horizontal Expandable Cards */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6 h-[400px] w-full max-w-6xl mt-8 mx-auto">
                    {/* Card 1 */}
                    <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full rounded-2xl overflow-hidden">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=800&h=400&auto=format&fit=crop"
                            alt="প্রম্পট ইঞ্জিনিয়ার" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 
                            opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-3xl">প্রম্পট ইঞ্জিনিয়ার</h1>
                            <p className="text-sm">মানব অভিপ্রায় ও মেশিন বোঝাপড়ার মধ্যে সেতুবন্ধন তৈরি।</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full rounded-2xl overflow-hidden">
                        <img 
                            className="h-full w-full object-cover object-right"
                            src="https://images.unsplash.com/photo-1714976326351-0ecf0244f0fc?q=80&w=800&h=400&auto=format&fit=crop"
                            alt="ডাটা সায়েন্টিস্ট" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 
                            opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-3xl">ডাটা সায়েন্টিস্ট</h1>
                            <p className="text-sm">ডাটার মাধ্যমে সমস্যার সমাধান ও গবেষণা।</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full rounded-2xl overflow-hidden">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1736220690062-79e12ca75262?q=80&w=800&h=400&auto=format&fit=crop"
                            alt="সফটওয়্যার ইঞ্জিনিয়ার" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 
                            opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-3xl">সফটওয়্যার ইঞ্জিনিয়ার</h1>
                            <p className="text-sm">আধুনিক অ্যাপ্লিকেশন ও সিস্টেম উন্নয়নে বিশেষজ্ঞ।</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full rounded-2xl overflow-hidden">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1620477403960-4188fdd7cee0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fFRlYWNoZXIlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
                            alt="শিক্ষক (ক্লাস ৯-১০)" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 
                            opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-3xl">শিক্ষক (ক্লাস ৯-১০)</h1>
                            <p className="text-sm">মাধ্যমিক স্তরের জন্য অভিজ্ঞ প্রশিক্ষক।</p>
                        </div>
                    </div>

                    {/* Card 5 */}
                    <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full rounded-2xl overflow-hidden">
                        <img 
                            className="h-full w-full object-cover object-center"
                            src="https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fFRlYWNoZXIlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
                            alt="শিক্ষক (ক্লাস ১১-১২)" 
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 
                            opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-3xl">শিক্ষক (ক্লাস ১১-১২)</h1>
                            <p className="text-sm">উচ্চ মাধ্যমিক স্তরের জন্য বিশেষজ্ঞ শিক্ষক।</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstructorCard;