'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Settings, User, Lock, Bell, LogOut, Save, X, Eye, EyeOff, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  bio: string
  role: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+57 311 367 8555',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Especialista en inglés para propósitos específicos',
    role: 'Student'
  })

  const [password, setPassword] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    courseUpdates: true,
    promotions: false
  })

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPassword({ ...password, [field]: value })
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Perfil actualizado exitosamente')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error guardando perfil:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (password.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsLoading(true)
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Contraseña actualizada exitosamente')
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Preferencias de notificaciones actualizado')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error guardando notificaciones:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = '/api/auth/logout'
      document.body.appendChild(form)
      form.submit()
    }
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Lock },
    { id: 'notifications', label: 'Notificaciones', icon: Bell }
  ] as const

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <Settings className="w-6 md:w-8 h-6 md:h-8 text-blue-600" />
            <h1 className="text-2xl md:text-4xl font-bold text-blue-600">Configuración</h1>
          </div>
          <p className="text-sm md:text-base text-blue-400">Administra tu perfil, seguridad y preferencias</p>
        </motion.div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
        >
          <p className="text-green-700 text-xs md:text-sm font-medium">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-700"
          >
            <X className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 md:mb-8 border-b border-gray-200 flex gap-4 md:gap-8 overflow-x-auto"
      >
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 md:px-4 text-sm md:text-base font-medium flex items-center gap-1 md:gap-2 relative transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-blue-400 hover:text-blue-600'
              }`}
            >
              <Icon className="w-4 md:w-5 h-4 md:h-5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={activeTab}
      >
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6">Información Personal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Avatar */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-xs md:text-sm font-medium text-blue-600 mb-3">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-3 md:gap-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-16 md:w-24 h-16 md:h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                  <button className="px-3 md:px-4 py-2 bg-blue-600 text-white text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Cambiar Foto
                  </button>
                </div>
              </motion.div>

              {/* Name */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => handleProfileChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => handleProfileChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => handleProfileChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </motion.div>

              {/* Role */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Rol
                </label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </motion.div>

              {/* Bio */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Biografía
                </label>
                <textarea
                  value={profile.bio}
                  onChange={e => handleProfileChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </motion.div>
            </div>

            {/* Save Button */}
            <motion.div variants={itemVariants} className="mt-8 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-100"
              >
                <Save className="w-5 h-5" />
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Change Password */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Cambiar Contraseña</h2>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={password.currentPassword}
                    onChange={e => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password.newPassword}
                      onChange={e => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={password.confirmPassword}
                    onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-100"
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </div>
            </motion.div>

            {/* Security Options */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Opciones de Seguridad</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-blue-600">Autenticación de Dos Factores</h3>
                    <p className="text-sm text-blue-400">Añade una capa extra de seguridad</p>
                  </div>
                  <button className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700">
                    Activar
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-blue-600">Sesiones Activas</h3>
                    <p className="text-sm text-blue-400">Gestiona tus sesiones en otros dispositivos</p>
                  </div>
                  <button className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700">
                    Ver
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Logout */}
            <motion.div
              variants={itemVariants}
              className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-8"
            >
              <h2 className="text-2xl font-bold text-red-600 mb-4">Cerrar Sesión</h2>
              <p className="text-red-600 mb-6">
                Se cerrará tu sesión en todos los dispositivos. Esta acción no se puede deshacer.
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Preferencias de Notificaciones</h2>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Notificaciones por Email', description: 'Recibe actualizaciones importantes por correo' },
                { key: 'pushNotifications', label: 'Notificaciones Push', description: 'Recibe notificaciones en tiempo real' },
                { key: 'weeklyReport', label: 'Reporte Semanal', description: 'Resumen semanal de tu progreso' },
                { key: 'courseUpdates', label: 'Actualizaciones de Cursos', description: 'Notificaciones cuando hay nuevo contenido' },
                { key: 'promotions', label: 'Promociones y Ofertas', description: 'Ofertas especiales y descuentos' }
              ].map((option) => (
                <motion.div
                  key={option.key}
                  variants={itemVariants}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-blue-600">{option.label}</h3>
                    <p className="text-sm text-blue-400">{option.description}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({
                      ...notifications,
                      [option.key]: !notifications[option.key as keyof typeof notifications]
                    })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      notifications[option.key as keyof typeof notifications]
                        ? 'bg-blue-600'
                        : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        notifications[option.key as keyof typeof notifications]
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Save Button */}
            <motion.div variants={itemVariants} className="mt-8 flex justify-end">
              <button
                onClick={handleSaveNotifications}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-100"
              >
                <Save className="w-5 h-5" />
                {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
      </div>
    </div>
  )
}
