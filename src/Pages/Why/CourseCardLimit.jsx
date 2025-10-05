'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router';

const CourseCardLimit = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['coursesLimit'],
    queryFn: async () => {
      const res = await axiosSecure.get('/coursesLimit');
      return res.data;
    },
  });

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading courses...</p>;

  if (isError)
    return <p className="text-center text-red-500 py-10">Failed to load course data.</p>;

  const { courses } = data || {};

  return (
    <div> 
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses?.map((course) => (
        <div
          key={course._id}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group border border-gray-100 flex flex-col"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#0BA6DF] transition-colors duration-300">
              {course.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.short_description || 'No description available.'}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[#0BA6DF] font-semibold">
                ৳ {course.price || 'Free'}
              </span>
              <button className="text-sm bg-[#0BA6DF] text-white px-3 py-1.5 rounded-lg hover:bg-[#0884b5] transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
      
    </div>
   <Link to={'/courses'}> 
   <button className='btn flex mx-auto justify-center items-center' >All Courses</button>
   </Link>
    </div>
  );
};

export default CourseCardLimit;
