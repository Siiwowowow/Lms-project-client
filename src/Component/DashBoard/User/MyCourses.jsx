import React from 'react';
import { useQuery } from '@tanstack/react-query';


import { PlayCircle } from 'lucide-react';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const MyCourses = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch all enrolled paid courses for the logged-in user
  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ['enrolledCourses', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-enrolled-courses?email=${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email, // only fetch if logged in
  });

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading your courses...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🎓 My Enrolled Courses</h1>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">You haven’t enrolled in any paid courses yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
              >
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  Instructor: {course.instructor_name || 'N/A'}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                    {course.paymentStatus || 'paid'}
                  </span>

                  <Link
                    to={`/player/${course.courseId}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Start Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
