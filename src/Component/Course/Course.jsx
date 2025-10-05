import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';
import img from '../../assets/Coursebanner1.png';  

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch courses using Axios
        axios.get('http://localhost:3000/courses')
            .then(response => {
                console.log(response.data);
                setCourses(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
                setLoading(false);
            });
    }, []);

    // Show loading message
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading courses...</p>
                </div>
            </div>
        );
    }

    // Show error message
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-6 bg-base-100 rounded-lg">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h3>
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn-grad mt-4"
                        style={{padding: '10px 30px', margin: '0 auto'}}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 ">
            {/* Compact Banner Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black opacity-10"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        {/* Text Content - Smaller */}
                        <div className="lg:w-1/2 text-center lg:text-left mb-6 lg:mb-0">
                            <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-2">
                                Unlock Your
                                <span className="block text-yellow-300">Potential</span>
                            </h1>
                            <p className="text-sm lg:text-base mb-4 text-blue-100 leading-relaxed">
                                Discover courses that will shape your future and boost your career
                            </p>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-center lg:justify-start space-x-3 text-xs">
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                        <span>Expert-Led Courses</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                        <span>Flexible Learning</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                <button className="btn-grad text-sm py-3 px-6">
                                    🚀 Start Learning
                                </button>
                                <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 text-sm">
                                    📚 Browse Courses
                                </button>
                            </div>
                        </div>

                        {/* Image/Illustration */}
                        <div className="lg:w-1/2 flex justify-center">
                            <div className="relative">
                                <img 
                                    src={img} 
                                    alt="Students learning together" 
                                    className="rounded-lg shadow-lg max-w-full h-40 lg:h-48 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-8 text-gray-50 dark:text-gray-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Courses Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-black mb-2">
                        Featured <span className="text-indigo-600">Courses</span>
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-black max-w-2xl mx-auto">
                        Handpicked courses to help you master new skills and advance your career.
                    </p>
                </div>

                {/* Courses Grid - Uniform Card Sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {courses.map(course => (
                        <div key={course._id} className="flex">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {courses.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2">📚</div>
                        <h3 className="text-lg font-bold text-gray-600 mb-1">No Courses Available</h3>
                        <p className="text-gray-500 text-sm">Check back later for new courses!</p>
                    </div>
                )}
            </div>

            {/* Add your gradient button styles */}
            <style jsx>{`
                .btn-grad {
                    background-image: linear-gradient(to right, #16222A 0%, #3A6073 51%, #16222A 100%);
                    margin: 5px;
                    padding: 12px 30px;
                    text-align: center;
                    text-transform: uppercase;
                    transition: 0.5s;
                    background-size: 200% auto;
                    color: white;
                    box-shadow: 0 0 10px #eee;
                    border-radius: 8px;
                    display: block;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                }

                .btn-grad:hover {
                    background-position: right center;
                    color: #fff;
                    text-decoration: none;
                    box-shadow: 0 0 15px #ccc;
                }
            `}</style>
        </div>
    );
};

export default Course;