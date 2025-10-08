import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Play, Lock, CheckCircle, Clock, Users, Star, BookOpen } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CourseCard = ({ course }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const isFreeCourse = course.price === 0 || course.price === "0";

  useEffect(() => {
    const verifyCourseAccess = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosSecure.get(
          `/my-enrolled-courses?email=${user.email.toLowerCase()}`
        );
        const enrolled = res.data?.data || [];
        const found = enrolled.find(
          (item) => String(item.courseId) === String(course._id)
        );
        setHasAccess(!!found);
      } catch (err) {
        console.error("Error verifying access:", err);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyCourseAccess();
  }, [user?.email, course._id, axiosSecure]);

  const handleCardClick = () => {
    navigate(`/courses/${course._id}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    
    if (hasAccess || isFreeCourse) {
      navigate(`/player/${course._id}`);
    } else {
      // Redirect to course details page for non-purchased courses
      navigate(`/courses/${course._id}`);
    }
  };

  // ✅ Course Status Configuration
  const getCourseStatus = () => {
    if (loading) {
      return {
        type: "loading",
        badge: {
          color: "bg-gray-500",
          icon: Clock
        },
        button: {
          color: "bg-gray-400 hover:bg-gray-400 text-white",
          icon: Clock
        },
        priceText: "Loading...",
        statusMessage: "Verifying your access..."
      };
    }

    if (hasAccess) {
      return {
        type: "owned",
        badge: {
          text: "Your Course",
          color: "bg-green-600",
          icon: CheckCircle
        },
        button: {
          text: "Continue Learning",
          color: "bg-green-600 hover:bg-green-700 text-white",
          icon: Play
        },
        statusMessage: "Full access - Start learning!"
      };
    }

    if (isFreeCourse) {
      return {
        type: "free",
        badge: {
          text: "FREE",
          color: "bg-blue-600",
          icon: BookOpen
        },
        button: {
          text: "Start Free Course",
          color: "bg-blue-600 hover:bg-blue-700 text-white",
          icon: Play
        },
        statusMessage: "No payment required"
      };
    }

    return {
      type: "locked",
      badge: {
        text: "PREMIUM",
        color: "bg-amber-500",
        icon: Lock
      },
      button: {
        text: "View Course",
        color: "bg-gray-800 hover:bg-gray-900 text-white",
        icon: BookOpen
      },
      priceText: `$${course.price}`,
      statusMessage: "Purchase required to access content"
    };
  };

  const courseStatus = getCourseStatus();
  const BadgeIcon = courseStatus.badge.icon;
  const ButtonIcon = courseStatus.button.icon;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col border border-gray-200 hover:border-gray-300 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Thumbnail Section */}
      <div className="relative">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${courseStatus.badge.color}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          {courseStatus.badge.text}
        </div>

        {/* Level Badge */}
        {course.level && (
          <div className="absolute top-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
            {course.level}
          </div>
        )}

        {/* Category Badge */}
        {course.category && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 px-2.5 py-1 rounded-md text-xs font-medium">
            {course.category}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Course Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-sm text-gray-600 flex-grow line-clamp-3 mb-4 leading-relaxed">
          {course.short_description || "Master new skills with expert-led instruction and hands-on projects."}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {/* Duration */}
          {course.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </div>
          )}

          {/* Rating */}
          {course.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{course.rating}</span>
            </div>
          )}

          {/* Students Count */}
          {course.students_count && (
            <div className="flex items-center gap-1.5 ml-auto">
              <Users className="w-3.5 h-3.5" />
              <span>{course.students_count.toLocaleString()}+</span>
            </div>
          )}
        </div>

        {/* Instructor */}
        {course.instructor_name && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
              {course.instructor_name.split(' ').map(n => n[0]).join('')}
            </div>
            <span>By {course.instructor_name}</span>
          </div>
        )}

        {/* Status Message */}
        <div className="mb-4">
          <p className={`text-xs font-medium ${
            courseStatus.type === 'owned' ? 'text-green-600' :
            courseStatus.type === 'free' ? 'text-blue-600' :
            courseStatus.type === 'locked' ? 'text-amber-600' :
            'text-gray-500'
          }`}>
            {courseStatus.statusMessage}
          </p>
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Price/Access Info */}
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${
              courseStatus.type === 'owned' ? 'text-green-600' :
              courseStatus.type === 'free' ? 'text-blue-600' :
              'text-gray-900'
            }`}>
              {courseStatus.priceText}
            </span>
            {course.original_price && course.original_price > course.price && courseStatus.type === 'locked' && (
              <span className="text-xs text-gray-500 line-through">
                ${course.original_price}
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleButtonClick}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md ${courseStatus.button.color} ${
              loading ? 'cursor-not-allowed opacity-70' : 'hover:scale-105'
            }`}
          >
            <ButtonIcon className="w-4 h-4" />
            {courseStatus.button.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;