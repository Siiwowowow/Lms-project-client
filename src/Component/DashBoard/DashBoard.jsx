import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: enrolledCourses = [], isPending } = useQuery({
    queryKey: ['enrolledCourses', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-enrolled-courses?email=${user?.email?.toLowerCase()}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  if (isPending) return <p className="text-center text-gray-500 mt-10">Loading your courses...</p>;

  if (!enrolledCourses.length) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <h2 className="text-xl font-semibold">You haven’t enrolled in any paid courses yet.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">🎓 Your Enrolled Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition"
          >
            <img
              src={course.thumbnail_url}
              alt={course.courseTitle}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{course.courseTitle}</h3>
              <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor_name}</p>
              <p className="text-sm text-green-600 font-medium">✅ Paid & Enrolled</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
