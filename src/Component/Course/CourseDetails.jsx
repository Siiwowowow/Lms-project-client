import React, { useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { Play, Clock, Users, Star, Award, CheckCircle, BookOpen } from 'lucide-react';

const CourseDetails = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const {
    _id,
    title,
    short_description,
    instructor_name,
    thumbnail_url,
    price,
    duration,
    level,
    total_lessons,
    youtube_url,
    what_youll_learn,
    requirements,
    category,
    rating,
    students_count,
    certificate_included,
  } = data;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Play },
    { id: 'instructor', label: 'Instructor', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {category}
                </span>
                <span className="bg-white text-amber-400 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {level}
                </span>
                {certificate_included && (
                  <span className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Certificate Included
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <h1 className="text-5xl text-white font-bold leading-tight">{title}</h1>
                <p className="text-xl text-white  leading-relaxed">{short_description}</p>
              </div>

              {/* Instructor & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center   font-bold text-lg shadow-lg">
                    {instructor_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">{instructor_name}</p>
                    <p className=" text-white ">Course Instructor</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-white ">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{students_count?.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="space-y-6">
              <div className="bg-base-100/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <div className="relative group">
                  <img 
                    src={thumbnail_url} 
                    alt={title} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  {youtube_url && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-16 h-16 bg-red-600 hover:bg-red-500   rounded-full flex items-center justify-center text-2xl shadow-2xl transform hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-1" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-4xl text-white font-bold mb-2">
                      {price === 0 ? 'FREE' : `$${price}`}
                    </p>
                    <p className="  text-sm text-white">
                      {price === 0 ? 'Lifetime free access' : 'One-time payment • Lifetime access'}
                    </p>
                  </div>

                <Link>
                  <button
                    onClick={() => navigate(`/payment/${_id}`)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl   font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Enrol Now
                  </button>
                </Link>

                  <div className="space-y-3 text-base-100  text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Duration
                      </span>
                      <span className="font-semibold">{duration}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Lessons
                      </span>
                      <span className="font-semibold">{total_lessons}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Level
                      </span>
                      <span className="font-semibold">{level}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Certificate
                      </span>
                      <span className="font-semibold">{certificate_included ? 'Included' : 'Not Included'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-base-100 border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center gap-3 py-6 font-semibold border-b-2 transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent   hover: '
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-3xl font-bold   mb-6">Course Overview</h2>
                  <p className="leading-relaxed text-lg">{short_description}</p>
                </div>

                {what_youll_learn && (
                  <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-gray-200">
                    <h3 className="text-2xl font-bold   mb-6">What You'll Learn</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {what_youll_learn.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className=" ">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {requirements && (
                  <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-gray-200">
                    <h3 className="text-2xl font-bold   mb-6">Requirements</h3>
                    <ul className="space-y-3">
                      {requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3  ">
                          <div className="w-2 h-2  bg-base-100 rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold  ">Course Curriculum</h2>
                  <div className=" text-sm">
                    {total_lessons} lessons • {duration}
                  </div>
                </div>

                <div className="space-y-3">
                  {Array.from({ length: total_lessons }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-base-100 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold group-hover:bg-blue-600 group-hover:  transition-colors">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold   group-hover:text-blue-600 transition-colors">
                            Lesson {idx + 1}: Introduction to Topic
                          </h4>
                          <p className=" text-sm mt-1">
                            Learn the fundamentals of this important concept
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="  text-sm   px-3 py-1 rounded-full">
                          {Math.floor(Math.random() * 15 + 5)} mins
                        </span>
                        <Play className="w-5 h-5   group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center   font-bold text-2xl shadow-lg">
                    {instructor_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold   mb-4">About the Instructor</h2>
                    <h3 className="text-xl font-semibold   mb-2">{instructor_name}</h3>
                    <p className="leading-relaxed text-lg">
                      {instructor_name} is a professional instructor with extensive expertise in {category}. 
                      With years of industry experience and a passion for teaching, they've helped thousands 
                      of students master new skills and advance their careers.
                    </p>
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold  ">{students_count?.toLocaleString()}+</div>
                        <div className=" text-sm">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold  ">{total_lessons}+</div>
                        <div className=" text-sm">Lessons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-base-900">{rating}</div>
                        <div className=" text-sm">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold   mb-6">Student Reviews</h2>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-base-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500">
                    Be the first to share your experience with this course!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-base-900 mb-4">This Course Includes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3  ">
                  <Play className="w-5 h-5 text-blue-500" />
                  <span>{duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-3  ">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>{total_lessons} lessons</span>
                </div>
                <div className="flex items-center gap-3  ">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span>{certificate_included ? 'Certificate of completion' : 'No certificate'}</span>
                </div>
                <div className="flex items-center gap-3  ">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;