import React from 'react';

const InvestCard = () => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 mt-10">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Invest In Your Career With EduThim Plus
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                    Get access to videos in over 90% of courses, Specializations, and Professional Certificates taught by top instructors from leading universities and companies.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {/* Card 1: Learn Anything - Icon: Book/Library */}
                <div className="bg-blue-50 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full flex items-start justify-end pr-3 pt-3 text-blue-600 group-hover:bg-blue-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                    <div className="mt-4">
                        <div className="w-12 h-12 mb-4">
                            {/* NEW ICON: Open Book (for learning/knowledge) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.5l-6 3v8l6 3m0-14l6-3v8l-6 3m0-8.5v8.5" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.5v-7.5l9-4.5 9 4.5v7.5" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Learn Anything</h3>
                        <p className="text-sm text-gray-600">
                            Explore any interest or trending topic, take prerequisites, and advance your skills.
                        </p>
                    </div>
                </div>

                {/* Card 2: Save Money - Icon: Piggy Bank/Money Bag */}
                <div className="bg-red-50 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full flex items-start justify-end pr-3 pt-3 text-red-600 group-hover:bg-red-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                    <div className="mt-4">
                        <div className="w-12 h-12 mb-4">
                            {/* NEW ICON: Money Bag (for saving/cost-effectiveness) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0v2a2 2 0 002 2h10a2 2 0 002-2v-6m-2-4l-8-4-8 4v7h2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 16h6V8h-6v8z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10v4m-2-2h4" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Save Money</h3>
                        <p className="text-sm text-gray-600">
                            Save on your learning expenses if you plan to take multiple courses this year.
                        </p>
                    </div>
                </div>

                {/* Card 3: Flexible Learning - Icon: Clock/Time */}
                <div className="bg-green-50 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full flex items-start justify-end pr-3 pt-3 text-green-600 group-hover:bg-green-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                    <div className="mt-4">
                        <div className="w-12 h-12 mb-4">
                            {/* NEW ICON: Clock (for time/flexibility/pace) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Flexible Learning</h3>
                        <p className="text-sm text-gray-600">
                            Learn at your own pace, switch courses, or explore new ones as needed.
                        </p>
                    </div>
                </div>

                {/* Card 4: Unlimited Certificates - Icon: Award/Certificate */}
                <div className="bg-pink-50 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-pink-100 rounded-bl-full flex items-start justify-end pr-3 pt-3 text-pink-600 group-hover:bg-pink-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                    <div className="mt-4">
                        <div className="w-12 h-12 mb-4">
                            {/* NEW ICON: Certificate/Award (for completion/recognition) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19V5a2 2 0 012-2h10a2 2 0 012 2v14M5 19h14M5 19c0 1.105.895 2 2 2h10c1.105 0 2-.895 2-2M7 5h10M7 5a2 2 0 00-2 2v10m14-10a2 2 0 012 2v10M9 9h6m-6 4h6m-2 4h2" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Unlimited Certificates</h3>
                        <p className="text-sm text-gray-600">
                            Earn a certificate for every learning program you complete at no extra cost.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestCard;