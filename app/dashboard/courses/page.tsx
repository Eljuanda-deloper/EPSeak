'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, Users, Trophy, ChevronRight } from 'lucide-react'

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  image: string
  progress: number
  duration: string
  students: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'in-progress' | 'completed' | 'not-started'
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns including hooks, suspense, and concurrent features.',
    instructor: 'Sarah Chen',
    image: 'bg-gradient-to-br from-blue-600 to-blue-400',
    progress: 65,
    duration: '24 hours',
    students: 2345,
    difficulty: 'Advanced',
    status: 'in-progress',
  },
  {
    id: '2',
    title: 'TypeScript Mastery',
    description: 'Learn TypeScript from basics to advanced type system techniques.',
    instructor: 'John Smith',
    image: 'bg-gradient-to-br from-blue-400 to-blue-600',
    progress: 100,
    duration: '18 hours',
    students: 1876,
    difficulty: 'Intermediate',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Next.js 14 Full Stack',
    description: 'Build full-stack applications with Next.js 14, featuring App Router and API Routes.',
    instructor: 'Emma Wilson',
    image: 'bg-gradient-to-br from-red-600 to-blue-600',
    progress: 45,
    duration: '32 hours',
    students: 3456,
    difficulty: 'Intermediate',
    status: 'in-progress',
  },
  {
    id: '4',
    title: 'Web Performance Optimization',
    description: 'Optimize your web applications for speed, SEO, and user experience.',
    instructor: 'Michael Brown',
    image: 'bg-gradient-to-br from-blue-600 to-red-600',
    progress: 0,
    duration: '20 hours',
    students: 987,
    difficulty: 'Advanced',
    status: 'not-started',
  },
  {
    id: '5',
    title: 'Database Design & SQL',
    description: 'Master relational database design and write efficient SQL queries.',
    instructor: 'Lisa Anderson',
    image: 'bg-gradient-to-br from-blue-400 to-red-600',
    progress: 30,
    duration: '28 hours',
    students: 2134,
    difficulty: 'Intermediate',
    status: 'in-progress',
  },
  {
    id: '6',
    title: 'API Design Best Practices',
    description: 'Design and build robust, scalable APIs following industry best practices.',
    instructor: 'David Lee',
    image: 'bg-gradient-to-br from-red-600 to-blue-400',
    progress: 80,
    duration: '16 hours',
    students: 1654,
    difficulty: 'Intermediate',
    status: 'in-progress',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function CoursesPage() {
  const activeCoursesCount = mockCourses.filter(
    (c) => c.status === 'in-progress'
  ).length
  const completedCoursesCount = mockCourses.filter(
    (c) => c.status === 'completed'
  ).length

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">My Courses</h1>
        <p className="text-sm text-blue-400">
          Track your learning progress and continue where you left off
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
      >
        <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/20 rounded-lg p-3 sm:p-4 border border-blue-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs font-medium">Active Courses</p>
              <p className="text-lg md:text-xl font-bold text-blue-600 mt-1 sm:mt-2">
                {activeCoursesCount}
              </p>
            </div>
            <BookOpen className="w-6 md:w-8 h-6 md:h-8 text-blue-400 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600/10 to-red-600/20 rounded-lg p-3 sm:p-4 border border-red-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-xs font-medium">Completed</p>
              <p className="text-lg md:text-xl font-bold text-red-600 mt-1 sm:mt-2">
                {completedCoursesCount}
              </p>
            </div>
            <Trophy className="w-6 md:w-8 h-6 md:h-8 text-red-600/70 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400/10 to-blue-400/20 rounded-lg p-3 sm:p-4 border border-blue-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-xs font-medium">Total Hours</p>
              <p className="text-lg md:text-xl font-bold text-blue-600 mt-1 sm:mt-2">
                {mockCourses.reduce(
                  (acc, c) => acc + parseInt(c.duration),
                  0
                )}h
              </p>
            </div>
            <Clock className="w-6 md:w-8 h-6 md:h-8 text-blue-400 flex-shrink-0" />
          </div>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4"
      >
        {mockCourses.map((course) => (
          <motion.div
            key={course.id}
            variants={item}
            className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer focus-within:ring-2 focus-within:ring-blue-600"
            tabIndex={0}
            role="article"
            aria-label={`Course: ${course.title} by ${course.instructor}`}
          >
            {/* Course Image */}
            <div className={`h-20 md:h-24 ${course.image} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* Course Content */}
            <div className="p-3 sm:p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-blue-600 mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-blue-400">by {course.instructor}</p>
                </div>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                    course.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : course.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                  aria-label={`Status: ${course.status === 'in-progress' ? 'En progreso' : course.status === 'completed' ? 'Completado' : 'No iniciado'}`}
                >
                  {course.status === 'in-progress'
                    ? 'En progreso'
                    : course.status === 'completed'
                      ? 'Completado'
                      : 'No iniciado'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-blue-400 mb-3 line-clamp-2">
                {course.description}
              </p>

              {/* Progress Bar */}
              {course.status !== 'not-started' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-400">
                      Progreso
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                      aria-valuenow={course.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                      aria-label={`Progress: ${course.progress}%`}
                    />
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-blue-400">{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-600 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-blue-400">
                    {formatNumber(course.students)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      course.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-800'
                        : course.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {course.difficulty}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 min-h-11 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all font-medium text-sm focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 group/btn"
                onTouchStart={() => navigator.vibrate?.(50)}
                aria-label={`${course.status === 'not-started' ? 'Start' : course.status === 'completed' ? 'Review' : 'Continue'} course: ${course.title}`}
              >
                {course.status === 'not-started'
                  ? 'Start Course'
                  : course.status === 'completed'
                    ? 'Review'
                    : 'Continue Learning'}
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform flex-shrink-0" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
