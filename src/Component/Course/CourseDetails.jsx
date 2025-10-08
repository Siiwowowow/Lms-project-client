import React, { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  CheckCircle, 
  BookOpen, 
  ShoppingCart,
  UserCheck,
  Lock,
  ArrowRight,
  Loader,
  CreditCard,
  Shield
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const CourseDetails = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const userEmail = useAuth(); // Replace with actual user email from context/auth

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

  // Check access status (enrolled OR paid)
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        
        // Check both enrollment and payment collections
        const [enrollmentResponse, paymentsResponse] = await Promise.all([
          fetch(`/my-enrolled-courses?email=${userEmail}`),
          fetch(`/payments/${userEmail}`)
        ]);

        const enrollmentResult = await enrollmentResponse.json();
        const payments = await paymentsResponse.json();

        let access = false;

        // Check enrollment collection
        if (enrollmentResult.success) {
          const enrolledCourse = enrollmentResult.data.find(
            enrollment => enrollment.courseId === _id && enrollment.paymentStatus === 'paid'
          );
          if (enrolledCourse) access = true;
        }

        // Check payment collection if not found in enrollments
        if (!access && payments && Array.isArray(payments)) {
          const paidCourse = payments.find(
            payment => 
              (payment.courseId === _id || payment.courseId?.$oid === _id) && 
              (payment.status === 'succeeded' || payment.paymentStatus === 'paid')
          );
          if (paidCourse) access = true;
        }

        setHasAccess(access);
      } catch (error) {
        console.error('Error checking access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [_id, userEmail]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Play },
    { id: 'instructor', label: 'Instructor', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  // Payment handlers
  const handleStripePayment = () => {
    navigate(`/payment/${_id}?gateway=stripe`);
  };

  const handleSSLCommerzPayment = () => {
    navigate(`/payment/${_id}?gateway=sslcommerz`);
  };

  const handleClosePaymentOptions = () => {
    setShowPaymentOptions(false);
  };

  // Determine button state and content
  const getButtonConfig = () => {
    if (loading) {
      return {
        text: 'Checking Access...',
        icon: Loader,
        disabled: true,
        variant: 'loading',
        onClick: () => {}
      };
    }

    if (hasAccess) {
      return {
        text: 'Go to Course',
        icon: Play,
        disabled: false,
        variant: 'success',
        onClick: () => navigate(`/player/${_id}`)
      };
    }

    if (price === 0 || price === '0' || price === 0.00) {
      return {
        text: 'Enroll for Free',
        icon: UserCheck,
        disabled: false,
        variant: 'free',
        onClick: () => navigate(`/player/${_id}`)
      };
    }

    return {
      text: 'Enroll Now',
      icon: ShoppingCart,
      disabled: false,
      variant: 'premium',
      onClick: () => setShowPaymentOptions(true)
    };
  };

  const buttonConfig = getButtonConfig();
  const ButtonIcon = buttonConfig.icon;

  const getButtonStyles = (variant) => {
    const baseStyles = "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform shadow-lg hover:shadow-xl flex items-center justify-center gap-3";
    
    switch (variant) {
      case 'loading':
        return `${baseStyles} bg-gray-400 text-white cursor-not-allowed opacity-70`;
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white hover:scale-105`;
      case 'free':
        return `${baseStyles} bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white hover:scale-105`;
      case 'premium':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white hover:scale-105`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Payment Options Modal */}
      {showPaymentOptions && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Choose Payment Method</h3>
              <button
                onClick={handleClosePaymentOptions}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleStripePayment}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Pay with Stripe</div>
                    <div className="text-sm text-gray-600">Credit/Debit Cards, Apple Pay, Google Pay</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                onClick={handleSSLCommerzPayment}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Pay with SSL Commerz</div>
                    <div className="text-sm text-gray-600">Local Banks, Mobile Banking, Cards</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                All payments are secure and encrypted
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800">
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
                {hasAccess && (
                  <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Purchased
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <h1 className="text-5xl text-white font-bold leading-tight">{title}</h1>
                <p className="text-xl text-white leading-relaxed">{short_description}</p>
              </div>

              {/* Instructor & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg shadow-lg text-white">
                    {instructor_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">{instructor_name}</p>
                    <p className="text-white">Course Instructor</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-white">
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
                      <button className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-2xl shadow-2xl transform hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-1 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-4xl text-white font-bold mb-2">
                      {price === 0 || price === '0' || price === 0.00 ? 'FREE' : `$${price}`}
                    </p>
                    <p className="text-sm text-white">
                      {price === 0 || price === '0' || price === 0.00 ? 'Lifetime free access' : 'One-time payment • Lifetime access'}
                    </p>
                    {hasAccess && (
                      <p className="text-green-300 text-sm font-semibold mt-2">
                        ✓ You own this course
                      </p>
                    )}
                  </div>

                  {/* Dynamic Button */}
                  <button
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                    className={getButtonStyles(buttonConfig.variant)}
                  >
                    {buttonConfig.variant === 'loading' ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <ButtonIcon className="w-5 h-5" />
                    )}
                    {buttonConfig.text}
                    {buttonConfig.variant === 'success' && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <div className="space-y-3 text-white text-sm">
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
                    <div className="flex justify-between items-center py-2">
                      <span className="flex items-center gap-2">
                        {hasAccess ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-amber-400" />
                        )}
                        Access
                      </span>
                      <span className="font-semibold">
                        {hasAccess ? 'Full Access' : (price === 0 || price === '0' || price === 0.00 ? 'Free Access' : 'Purchase Required')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
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
                      : 'border-transparent text-gray-600 hover:text-gray-900'
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Overview</h2>
                  <p className="leading-relaxed text-lg text-gray-700">{short_description}</p>
                </div>

                {what_youll_learn && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {what_youll_learn.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {requirements && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h3>
                    <ul className="space-y-3">
                      {requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Other tabs remain the same */}
            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">Course Curriculum</h2>
                  <div className="text-gray-600 text-sm">
                    {total_lessons} lessons • {duration}
                  </div>
                </div>

                <div className="space-y-3">
                  {Array.from({ length: total_lessons }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-xl p-6 shadow-sm border transition-all duration-300 cursor-pointer group ${
                        hasAccess 
                          ? 'bg-white border-gray-200 hover:shadow-md hover:border-blue-300' 
                          : 'bg-gray-50 border-gray-100 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-colors ${
                          hasAccess 
                            ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className={`font-semibold transition-colors ${
                            hasAccess 
                              ? 'text-gray-900 group-hover:text-blue-600' 
                              : 'text-gray-400'
                          }`}>
                            Lesson {idx + 1}: Introduction to Topic
                          </h4>
                          <p className={`text-sm mt-1 ${
                            hasAccess ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            Learn the fundamentals of this important concept
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          hasAccess 
                            ? 'text-gray-600 bg-gray-100' 
                            : 'text-gray-400 bg-gray-200'
                        }`}>
                          {Math.floor(Math.random() * 15 + 5)} mins
                        </span>
                        {hasAccess ? (
                          <Play className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor and Reviews tabs remain unchanged */}
            {activeTab === 'instructor' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {instructor_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">About the Instructor</h2>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{instructor_name}</h3>
                    <p className="leading-relaxed text-lg text-gray-700">
                      {instructor_name} is a professional instructor with extensive expertise in {category}. 
                      With years of industry experience and a passion for teaching, they've helped thousands 
                      of students master new skills and advance their careers.
                    </p>
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{students_count?.toLocaleString()}+</div>
                        <div className="text-gray-600 text-sm">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{total_lessons}+</div>
                        <div className="text-gray-600 text-sm">Lessons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{rating}</div>
                        <div className="text-gray-600 text-sm">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500">
                    Be the first to share your experience with this course!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">This Course Includes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Play className="w-5 h-5 text-blue-500" />
                  <span>{duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>{total_lessons} lessons</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span>{certificate_included ? 'Certificate of completion' : 'No certificate'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  {hasAccess ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-amber-500" />
                  )}
                  <span>{hasAccess ? 'Full course access' : 'Access after enrollment'}</span>
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