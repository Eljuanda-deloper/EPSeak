'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Target, Users, Star, ChevronRight, Calendar, Trophy, Zap } from 'lucide-react';
import Button from '../components/shared/Button';

// Mock data for dashboard stats
const stats = [
  {
    title: 'Módulos Activos',
    value: '3',
    change: '+2 este mes',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: 'up',
  },
  {
    title: 'Horas de Estudio',
    value: '24',
    change: '+8 esta semana',
    icon: Clock,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    trend: 'up',
  },
  {
    title: 'Logros Obtenidos',
    value: '7',
    change: '+3 esta semana',
    icon: Trophy,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    trend: 'up',
  },
  {
    title: 'Progreso General',
    value: '68%',
    change: '+12% esta semana',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    trend: 'up',
  },
];

// Mock data for recent modules
const recentModules = [
  {
    id: 1,
    title: 'Inglés Médico Básico',
    progress: 85,
    lastAccessed: 'Hace 2 horas',
    status: 'in_progress',
    area: 'Medicina',
    nextLesson: 'Sistema Respiratorio',
  },
  {
    id: 2,
    title: 'Términos Legales',
    progress: 100,
    lastAccessed: 'Ayer',
    status: 'completed',
    area: 'Legal',
    nextLesson: null,
  },
  {
    id: 3,
    title: 'Inglés de Negocios',
    progress: 45,
    lastAccessed: 'Hace 3 días',
    status: 'in_progress',
    area: 'Negocios',
    nextLesson: 'Reuniones Corporativas',
  },
];

// Achievement highlights
const achievements = [
  {
    title: 'Primer Módulo Completado',
    description: 'Completaste tu primer curso especializado',
    icon: Award,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    earned: true,
  },
  {
    title: 'Estudiante Dedicado',
    description: '5 días consecutivos de estudio',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    earned: true,
  },
  {
    title: 'Especialista Médico',
    description: 'Completa el módulo de inglés médico',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    earned: false,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-azul-petroleo via-azul-celeste to-azul-petroleo/80 rounded-3xl p-8 md:p-12 text-white"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ¡Bienvenido de vuelta! 👋
              </h1>
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                Tu progreso en EPSeak continúa. Hoy es un gran día para aprender algo nuevo.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  🔥 5 días de racha
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  🎯 Próxima meta: 75% completado
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex-shrink-0"
          >
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Target className="w-16 h-16 text-white" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Módulos Activos</h2>
              <p className="text-gray-600 mt-1">Continúa donde lo dejaste</p>
            </div>
            <Button variant="secondary" className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
              <span className="flex items-center gap-2">
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </span>
            </Button>
          </div>

          <div className="space-y-6">
            {recentModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:bg-gray-50/50 hover:border-azul-petroleo/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-xl flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{module.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">{module.area}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{module.lastAccessed}</span>
                    </div>
                    {module.nextLesson && (
                      <p className="text-sm text-azul-petroleo font-medium mt-1">
                        Siguiente: {module.nextLesson}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right min-w-[100px]">
                    <div className="text-lg font-bold text-gray-900">{module.progress}%</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          module.status === 'completed' ? 'bg-green-500' : 'bg-azul-petroleo'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    className={`${
                      module.status === 'completed'
                        ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                        : 'bg-azul-petroleo hover:bg-azul-petroleo/90 text-white'
                    } px-6 py-2`}
                  >
                    <span className="flex items-center gap-2">
                      {module.status === 'completed' ? 'Repasar' : 'Continuar'}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Logros</h2>
              <p className="text-sm text-gray-600">Tus hitos recientes</p>
            </div>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  achievement.earned
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 ${achievement.bgColor} rounded-lg flex items-center justify-center">
                    <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Button variant="secondary" className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700">
              Ver todos los logros
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Explorar Módulos',
            description: 'Descubre nuevos cursos especializados',
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            action: 'Explorar',
          },
          {
            title: 'Mis Certificados',
            description: 'Revisa tus logros y certificados',
            icon: Award,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            action: 'Ver Certificados',
          },
          {
            title: 'Comunidad EPSeak',
            description: 'Conecta con otros estudiantes',
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            action: 'Unirme',
          },
          {
            title: 'Estadísticas',
            description: 'Analiza tu progreso detallado',
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            action: 'Ver Estadísticas',
          },
        ].map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`w-14 h-14 ${action.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className={`w-7 h-7 ${action.color}`} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">{action.title}</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{action.description}</p>
            <Button
              className={`w-full bg-gradient-to-r from-azul-petroleo to-azul-celeste hover:from-azul-petroleo/90 hover:to-azul-celeste/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {action.action}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}