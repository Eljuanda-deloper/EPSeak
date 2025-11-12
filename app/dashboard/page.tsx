'use client';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import Button from '../components/shared/Button';

// Mock data for continue learning
const continueLearning = [
  {
    id: 1,
    title: 'English for Business Meetings',
    description: 'Improve your communication skills in a business context',
    progress: 75,
    image: '🏢',
    completed: '75% Completed',
  },
  {
    id: 2,
    title: 'English for Software Developers',
    description: 'Learn the vocabulary and phrases for the tech industry',
    progress: 60,
    image: '💻',
    completed: '60% Completed',
  },
];

// Mock data for recommended courses
const recommendedCourses = [
  {
    id: 1,
    title: 'Advanced Medical Terminology',
    description: 'Master complex medical terms',
    icon: '🏥',
    category: 'Medical',
  },
  {
    id: 2,
    title: 'Public Speaking Mastery',
    description: 'Build confidence and improve any audience',
    icon: '🎤',
    category: 'Public Speaking',
  },
  {
    id: 3,
    title: 'English for Legal Professionals',
    description: 'Strengthen legal contacts with skills',
    icon: '⚖️',
    category: 'Legal',
  },
  {
    id: 4,
    title: 'Aviation English for Pilots',
    description: 'Essential communication for the skies',
    icon: '✈️',
    category: 'Aviation',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, Jessica!</h1>
        <p className="text-gray-600">Let's continue your learning journey.</p>
      </motion.div>

      {/* Continue Learning Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {continueLearning.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Course Header with Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-azul-petroleo to-azul-celeste flex items-center justify-center text-5xl">
                {course.image}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-600">Progress</span>
                    <span className="text-xs font-medium text-gray-900">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Status and Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{course.completed}</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium">
                    Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.08, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Course Image Placeholder */}
              <div className="h-32 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-4xl">
                {course.icon}
              </div>

              {/* Course Content */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                <p className="text-xs text-gray-500 font-medium">{course.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}