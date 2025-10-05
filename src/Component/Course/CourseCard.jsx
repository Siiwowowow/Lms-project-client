import { Link } from "react-router";
import { Clock, Star, User, TrendingUp } from "lucide-react";

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course._id}`} className="block group">
      <div className="h-full bg-base-100  rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 flex flex-col">
        {/* Course Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-base-100 ">
          <img
            src={course.thumbnail_url || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            {course.price === 0 ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-base-400  shadow-lg">
                FREE
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-base-100  text-base-400  shadow-lg">
                ${course.price}
              </span>
            )}
          </div>

          {/* Level Badge */}
          {course.level && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-base-100  backdrop-blur-sm text-base-400 ">
                {course.level}
              </span>
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="flex flex-col flex-grow p-5">
          {/* Category & Instructor */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {course.category || "Development"}
            </span>

            {course.instructor_name && (
              <div className="flex items-center gap-1.5 text-xs text-base-400 ">
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{course.instructor_name}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-base-400  mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
            {course.short_description || "Master new skills with this comprehensive course designed for all levels."}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            {/* Duration */}
            {course.duration && (
              <div className="flex items-center gap-1.5 text-xs text-base-400 ">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.duration}</span>
              </div>
            )}

            {/* Rating */}
            {course.rating && (
              <div className="flex items-center gap-1.5 text-xs text-base-400 ">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{course.rating}</span>
              </div>
            )}

            {/* Students Count */}
            {course.students_count && (
              <div className="flex items-center gap-1.5 text-xs text-base-400  ml-auto">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{course.students_count.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {/* Price Display */}
            <div className="flex flex-col">
              <div className="text-xl font-bold text-base-400 ">{course.price === 0 ? "Free" : `$${course.price}`}</div>
              {course.original_price && course.original_price > course.price && (
                <div className="text-xs text-base-400  line-through">${course.original_price}</div>
              )}
            </div>

            {/* Enroll Button */}
            <button className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-gray-100  bg-gray-900 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95">
              {course.price === 0 ? "Enroll Free" : "Enroll Now"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;