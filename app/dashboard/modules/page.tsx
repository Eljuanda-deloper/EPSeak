'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Users, Star, Loader2, Award, TrendingUp, Target } from 'lucide-react';
import Button from '@/app/components/shared/Button';
import { useModules, ModuleWithStats } from '@/app/hooks/useModules';

const areaOptions = ['Todas', 'Medicina', 'Legal', 'Negocios', 'Ingeniería', 'Finanzas', 'Turismo'];
const levelOptions = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];

export default function ModulesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [levelFilter, setLevelFilter] = useState('Todos');

  const { modules, loading, error, filterModules } = useModules();

  const filteredModules = filterModules(
    searchTerm,
    areaFilter === 'Todas' ? '' : areaFilter,
    levelFilter === 'Todos' ? '' : levelFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'available': return 'bg-slate-50 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En progreso';
      case 'available': return 'Disponible';
      default: return 'Disponible';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico': return 'bg-green-50 text-green-700 border-green-200';
      case 'Intermedio': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Avanzado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getAreaIcon = (area: string) => {
    const icons: Record<string, any> = {
      'Medicina': '🏥',
      'Legal': '⚖️',
      'Negocios': '💼',
      'Ingeniería': '⚙️',
      'Finanzas': '💰',
      'Turismo': '✈️'
    };
    return icons[area] || '📚';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-azul-petroleo/20 border-t-azul-petroleo rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-azul-celeste rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando módulos</h3>
          <p className="text-gray-600">Preparando tu experiencia de aprendizaje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Error al cargar módulos</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-azul-petroleo hover:bg-azul-petroleo/90 text-white px-6 py-3"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-azul-petroleo via-azul-celeste to-azul-petroleo/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Módulos Especializados
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Domina el inglés profesional con nuestros cursos especializados.
                Aprende terminología específica para tu campo laboral.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{modules.length}</div>
                <div className="text-white/80">Módulos Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">6</div>
                <div className="text-white/80">Áreas Especializadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">3</div>
                <div className="text-white/80">Niveles de Dificultad</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-4"
          >
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-azul-petroleo focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Area Filter */}
            <div className="w-full lg:w-56">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-azul-petroleo focus:border-transparent shadow-sm bg-white text-gray-900"
              >
                {areaOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'Todas' ? 'Todas las áreas' : `${getAreaIcon(option)} ${option}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="w-full lg:w-56">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-azul-petroleo focus:border-transparent shadow-sm bg-white text-gray-900"
              >
                {levelOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'Todos' ? 'Todos los niveles' : option}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              {filteredModules.length} módulo{filteredModules.length !== 1 ? 's' : ''} encontrado{filteredModules.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredModules.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                {/* Module Header with Gradient */}
                <div className="relative h-48 bg-gradient-to-br from-azul-petroleo via-azul-celeste to-azul-petroleo/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{getAreaIcon(module.area)}</div>
                    <div className="text-sm font-medium opacity-90">{module.area}</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(module.level)}`}>
                      {module.level}
                    </span>
                  </div>
                </div>

                {/* Module Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-azul-petroleo transition-colors line-clamp-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {module.description}
                    </p>
                  </div>

                  {/* Module Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-azul-petroleo/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-azul-petroleo" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{module.total_lessons}</div>
                        <div className="text-xs text-gray-500">Lecciones</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-azul-petroleo/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-azul-petroleo" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{module.duration_hours}h</div>
                        <div className="text-xs text-gray-500">Duración</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-azul-petroleo/10 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-azul-petroleo" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{module.enrolled_students || 0}</div>
                        <div className="text-xs text-gray-500">Inscritos</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">4.{Math.floor(Math.random() * 5) + 5}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-azul-petroleo to-azul-celeste hover:from-azul-petroleo/90 hover:to-azul-celeste/90 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      Inscribirse al Módulo
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No se encontraron módulos
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No hay módulos que coincidan con tus criterios de búsqueda.
              Intenta ajustar los filtros o busca con otros términos.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setAreaFilter('Todas');
                setLevelFilter('Todos');
              }}
              className="bg-azul-petroleo hover:bg-azul-petroleo/90 text-white px-6 py-3"
            >
              Limpiar Filtros
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}