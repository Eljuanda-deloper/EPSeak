'use client'

import { redirect } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import ProfileForm from '@/app/components/auth/ProfileForm'
import Link from 'next/link'
import { ArrowLeft, Mail, Shield, LogOut, Trophy, Target, Clock, BookOpen, TrendingUp, Award, Star, CheckCircle, Flame } from 'lucide-react'
import { useState } from 'react'
import { useStudentStats } from '@/app/hooks/useStudentStats'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { stats: learningStats, loading: statsLoading } = useStudentStats()

  if (!user) {
    redirect('/auth/login')
  }

  const handleLogout = async () => {
    await signOut()
    redirect('/auth/login')
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-[#E8ECEF] sticky top-0 z-20 h-12">
        <div className="flex items-center justify-between px-6 h-full">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#0A4E5A] hover:text-[#7CC4E0]">
            <ArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </Link>
          <h1 className="text-sm font-semibold text-[#0A4E5A]">Mi Perfil</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <div className="min-h-screen bg-[#E8ECEF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Learning Statistics Section */}
          <div className="bg-white rounded-2xl border border-[#7CC4E0]/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] px-6 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-7 h-7" />
                Estadísticas de Carrera EPSeak
              </h2>
              <p className="text-white/80 mt-1">Tu progreso en el aprendizaje del inglés profesional</p>
            </div>

            {/* Stats Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#0A4E5A]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-6 h-6 text-[#0A4E5A]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A4E5A]">{learningStats?.completedModules || 0}</div>
                  <div className="text-sm text-[#7CC4E0]">Módulos completados</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#7CC4E0]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-[#7CC4E0]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A4E5A]">{learningStats?.completedLessons || 0}</div>
                  <div className="text-sm text-[#7CC4E0]">Lecciones completadas</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A4E5A]">{learningStats?.totalHours || 0}h</div>
                  <div className="text-sm text-[#7CC4E0]">Horas estudiadas</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Flame className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A4E5A]">{learningStats?.currentStreak || 0}</div>
                  <div className="text-sm text-[#7CC4E0]">Días de racha</div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="bg-[#E8ECEF] rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#0A4E5A]">Progreso general de carrera</span>
                  <span className="text-sm text-[#7CC4E0]">{learningStats ? Math.round((learningStats.completedModules / learningStats.totalModules) * 100) : 0}%</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] rounded-full transition-all duration-1000"
                    style={{ width: `${learningStats ? (learningStats.completedModules / learningStats.totalModules) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#7CC4E0] mt-2">
                  <span>{learningStats ? `${learningStats.completedModules} de ${learningStats.totalModules} módulos` : 'Cargando...'}</span>
                  <span>{learningStats ? `Miembro desde ${new Date(learningStats.joinDate).toLocaleDateString('es-ES')}` : 'Cargando...'}</span>
                </div>
              </div>

              {/* Areas Progress */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0A4E5A] mb-4">Progreso por áreas</h3>
                <div className="space-y-3">
                  {learningStats?.areas?.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#E8ECEF] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0A4E5A]/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-[#0A4E5A]">{area.name[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-[#0A4E5A]">{area.name}</div>
                          <div className="text-sm text-[#7CC4E0]">{area.completed} de {area.total} módulos</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#0A4E5A]">{area.progress}%</div>
                        <div className="w-20 h-2 bg-white rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] rounded-full"
                            style={{ width: `${area.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-[#0A4E5A] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Logros recientes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {learningStats?.achievements?.map((achievement, index) => {
                    const Icon = achievement.icon
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-[#E8ECEF] rounded-lg">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-[#0A4E5A]">{achievement.title}</div>
                          <div className="text-sm text-[#7CC4E0]">{achievement.description}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl border border-[#7CC4E0]/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] px-6 py-8 sm:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{user?.email?.split('@')[0] || 'Estudiante'}</h2>
                  <p className="text-white/80 flex items-center gap-2">
                    <Mail size={16} />
                    {user?.email}
                  </p>
                </div>
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="text-6xl text-white/20">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8ECEF]">
              <div className="p-6">
                <p className="text-xs text-[#7CC4E0] mb-1">ID de Usuario</p>
                <p className="text-sm font-mono text-[#0A4E5A] break-all">{user?.id.slice(0, 8)}...</p>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#7CC4E0] mb-1">Cuenta Creada</p>
                <p className="text-sm text-[#0A4E5A]">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                </p>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#7CC4E0] mb-1">Estado</p>
                <p className="text-sm">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Activo
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <div className="bg-white rounded-2xl border border-[#7CC4E0]/20 overflow-hidden">
            <div className="bg-[#E8ECEF] px-6 py-4 sm:px-8 border-b border-[#7CC4E0]/20">
              <h3 className="text-lg font-bold text-[#0A4E5A]">Información del Perfil</h3>
              <p className="text-sm text-[#7CC4E0] mt-1">Edita tu información personal</p>
            </div>
            <div className="p-6 sm:p-8">
              <ProfileForm />
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl border border-[#7CC4E0]/20 overflow-hidden">
            <div className="bg-[#E8ECEF] px-6 py-4 sm:px-8 border-b border-[#7CC4E0]/20 flex items-center gap-3">
              <Shield size={20} className="text-[#0A4E5A]" />
              <div>
                <h3 className="text-lg font-bold text-[#0A4E5A]">Seguridad</h3>
                <p className="text-sm text-[#7CC4E0]">Gestiona el acceso a tu cuenta</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#7CC4E0]/30 rounded-lg hover:bg-[#E8ECEF] transition-colors">
                <div>
                  <p className="font-medium text-[#0A4E5A]">Contraseña</p>
                  <p className="text-sm text-[#7CC4E0]">Última actualización: Nunca</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-[#7CC4E0] hover:bg-[#7CC4E0]/20 rounded-lg transition-colors">
                  Cambiar
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-[#7CC4E0]/30 rounded-lg hover:bg-[#E8ECEF] transition-colors">
                <div>
                  <p className="font-medium text-[#0A4E5A]">Sesiones Activas</p>
                  <p className="text-sm text-[#7CC4E0]">1 sesión activa</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-[#7CC4E0] hover:bg-[#E8ECEF] rounded-lg transition-colors">
                  Ver
                </button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-2xl border border-[#7CC4E0]/20 overflow-hidden border-l-4 border-[#E0312D]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0A4E5A]">Cerrar Sesión</h3>
                  <p className="text-sm text-[#7CC4E0] mt-1">Se cerrará la sesión en todos los dispositivos</p>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-6 py-2 bg-[#E0312D] hover:bg-[#E0312D]/80 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
                <h4 className="text-xl font-bold text-[#0A4E5A] mb-2">¿Cerrar Sesión?</h4>
                <p className="text-[#7CC4E0] mb-6">Se cerrará tu sesión actual. Necesitarás iniciar sesión nuevamente para acceder a tu cuenta.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 text-[#0A4E5A] bg-[#E8ECEF] hover:bg-[#7CC4E0]/20 font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 bg-[#E0312D] hover:bg-[#E0312D]/80 text-white font-medium rounded-lg transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}