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
    image: 'bg-gradient-to-br from-blue-400 to-blue-600',
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
    image: 'bg-gradient-to-br from-purple-400 to-purple-600',
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
    image: 'bg-gradient-to-br from-green-400 to-green-600',
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
    image: 'bg-gradient-to-br from-orange-400 to-orange-600',
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
    image: 'bg-gradient-to-br from-pink-400 to-pink-600',
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
    image: 'bg-gradient-to-br from-teal-400 to-teal-600',
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
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Track your learning progress and continue where you left off
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Active Courses</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {activeCoursesCount}
              </p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {completedCoursesCount}
              </p>
            </div>
            <Trophy className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Hours</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {mockCourses.reduce(
                  (acc, c) => acc + parseInt(c.duration),
                  0
                )}h
              </p>
            </div>
            <Clock className="w-10 h-10 text-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {mockCourses.map((course) => (
          <motion.div
            key={course.id}
            variants={item}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
          >
            {/* Course Image */}
            <div className={`h-32 ${course.image} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* Course Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">by {course.instructor}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    course.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : course.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {course.status === 'in-progress'
                    ? 'In Progress'
                    : course.status === 'completed'
                      ? 'Completed'
                      : 'Not Started'}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Progress Bar */}
              {course.status !== 'not-started' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-azul-petroleo to-azul-celeste"
                    />
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {formatNumber(course.students)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      course.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-700'
                        : course.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {course.difficulty}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-azul-petroleo text-white hover:bg-azul-petroleo/90 transition-colors font-medium text-sm group/btn">
                {course.status === 'not-started'
                  ? 'Start Course'
                  : course.status === 'completed'
                    ? 'Review'
                    : 'Continue Learning'}
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
