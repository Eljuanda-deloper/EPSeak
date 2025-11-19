'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, User, Lock, Bell, Palette, Eye, EyeOff, Save, X,
  Check, AlertCircle, Upload, Camera, Moon, Sun, Monitor,
  Type, Layout, Shield, Trash2, Download, RefreshCw,
  Smartphone, MonitorSpeaker, Volume2, VolumeX, LogOut
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/app/utils/supabase/client'

interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  bio: string
  role: string
  timezone: string
  language: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
  fontFamily: 'inter' | 'roboto' | 'opensans' | 'lato'
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyReport: boolean
  courseUpdates: boolean
  promotions: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showProgress: boolean
  showAchievements: boolean
  allowDataCollection: boolean
  marketingEmails: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'privacy' | 'security' | 'account'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    role: 'Student',
    timezone: 'America/Bogota',
    language: 'en'
  })

  // Password state
  const [password, setPassword] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Theme settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'light',
    primaryColor: '#0A4E5A',
    accentColor: '#7CC4E0',
    fontFamily: 'inter',
    fontSize: 'medium',
    compactMode: false
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    courseUpdates: true,
    promotions: false,
    soundEnabled: true,
    vibrationEnabled: true
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    allowDataCollection: true,
    marketingEmails: false
  })

  // Load user data on mount
  useEffect(() => {
    if (user) {
      loadUserProfile()
      loadUserSettings()
    }
  }, [user])

  // Load user profile from Supabase
  const loadUserProfile = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (profileData) {
        setProfile({
          name: profileData.full_name || user!.user_metadata?.full_name || '',
          email: user!.email || '',
          phone: profileData.phone || '',
          avatar: profileData.avatar_url || user!.user_metadata?.avatar_url || '',
          bio: profileData.bio || '',
          role: 'Student',
          timezone: profileData.timezone || 'America/Bogota',
          language: profileData.language || 'en'
        })
      } else {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user!.id,
            full_name: user!.user_metadata?.full_name || '',
            avatar_url: user!.user_metadata?.avatar_url || '',
            timezone: 'America/Bogota',
            language: 'en'
          })

        if (insertError) console.warn('Could not create profile:', insertError)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  // Load user settings from localStorage and Supabase
  const loadUserSettings = () => {
    // Load theme settings from localStorage
    const savedTheme = localStorage.getItem('themeSettings')
    if (savedTheme) {
      try {
        setThemeSettings(JSON.parse(savedTheme))
      } catch (error) {
        console.warn('Could not parse theme settings:', error)
      }
    }

    // Load notification settings from localStorage
    const savedNotifications = localStorage.getItem('notificationSettings')
    if (savedNotifications) {
      try {
        setNotificationSettings(JSON.parse(savedNotifications))
      } catch (error) {
        console.warn('Could not parse notification settings:', error)
      }
    }

    // Load privacy settings from localStorage
    const savedPrivacy = localStorage.getItem('privacySettings')
    if (savedPrivacy) {
      try {
        setPrivacySettings(JSON.parse(savedPrivacy))
      } catch (error) {
        console.warn('Could not parse privacy settings:', error)
      }
    }
  }

  // Handle profile changes
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  // Handle password changes
  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPassword({ ...password, [field]: value })
  }

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, GIF, WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMessage('Image size must be less than 5MB')
      return
    }

    // Validate file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      setErrorMessage('Please select a valid image file (JPG, PNG, GIF, WebP)')
      return
    }

    setUploadingAvatar(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      // Upload via API endpoint instead of direct storage
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const { publicUrl } = await response.json()

      // Update local state
      setProfile({ ...profile, avatar: publicUrl })
      setSuccessMessage('Profile picture updated successfully!')

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Error uploading avatar:', error)

      let errorMessage = 'Failed to upload image. Please try again.'

      if (error.message?.includes('Bucket not found')) {
        errorMessage = 'Storage bucket not configured. Please contact support.'
      } else if (error.message?.includes('not authenticated')) {
        errorMessage = 'You must be logged in to upload images.'
      } else if (error.message?.includes('permission')) {
        errorMessage = 'You do not have permission to upload images.'
      } else if (error.message) {
        errorMessage = `Upload failed: ${error.message}`
      }

      setErrorMessage(errorMessage)
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Save profile
  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      setErrorMessage('Name is required')
      return
    }

    if (!profile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setErrorMessage('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
          timezone: profile.timezone,
          language: profile.language,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      setSuccessMessage('Profile updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setErrorMessage(error.message || 'Failed to save profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (!password.currentPassword) {
      setErrorMessage('Current password is required')
      return
    }

    if (password.newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long')
      return
    }

    if (password.newPassword !== password.confirmPassword) {
      setErrorMessage('New passwords do not match')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/settings/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
          confirmPassword: password.confirmPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to change password')
      }

      setSuccessMessage('Password updated successfully')
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Error changing password:', error)
      setErrorMessage(error.message || 'Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Save theme settings
  const handleSaveTheme = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/settings/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeSettings),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save theme settings')
      }

      setSuccessMessage('Appearance settings saved successfully')
      setTimeout(() => setSuccessMessage(''), 3000)

      // Apply theme changes immediately
      applyThemeSettings(themeSettings)
    } catch (error: any) {
      console.error('Error saving theme:', error)
      setErrorMessage(error.message || 'Failed to save theme settings')
    } finally {
      setIsLoading(false)
    }
  }

  // Apply theme settings to the document
  const applyThemeSettings = (settings: ThemeSettings) => {
    const root = document.documentElement

    // Apply theme mode
    if (settings.mode === 'dark') {
      root.classList.add('dark')
    } else if (settings.mode === 'light') {
      root.classList.remove('dark')
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    // Apply colors
    root.style.setProperty('--primary-color', settings.primaryColor)
    root.style.setProperty('--accent-color', settings.accentColor)

    // Apply font
    root.style.setProperty('--font-family', settings.fontFamily)
    root.style.setProperty('--font-size', settings.fontSize)
  }

  // Save notification settings
  const handleSaveNotifications = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationSettings),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save notifications')
      }

      setSuccessMessage('Notification preferences saved successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Error saving notifications:', error)
      setErrorMessage(error.message || 'Failed to save notifications')
    } finally {
      setIsLoading(false)
    }
  }

  // Save privacy settings
  const handleSavePrivacy = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(privacySettings),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save privacy settings')
      }

      setSuccessMessage('Privacy settings saved successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Error saving privacy:', error)
      setErrorMessage(error.message || 'Failed to save privacy settings')
    } finally {
      setIsLoading(false)
    }
  }

  // Export user data
  const handleExportData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/export-data', {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      // Get the filename from the response header
      const filename = response.headers
        .get('content-disposition')
        ?.split('filename=')[1]
        ?.replace(/"/g, '') || 'epseak-export.json'

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccessMessage('Data exported successfully')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      console.error('Error exporting data:', error)
      setErrorMessage('Failed to export data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
    )

    if (!confirmDelete) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmDelete: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete account')
      }

      setSuccessMessage('Account deletion initiated. You will be logged out shortly.')
      setTimeout(() => {
        // Logout user
        window.location.href = '/auth/login'
      }, 2000)
    } catch (error: any) {
      console.error('Error deleting account:', error)
      setErrorMessage(error.message || 'Failed to delete account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = '/api/auth/logout'
      document.body.appendChild(form)
      form.submit()
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'account', label: 'Account', icon: Settings }
  ] as const

  const fontOptions = [
    { value: 'inter', label: 'Inter', class: 'font-sans' },
    { value: 'roboto', label: 'Roboto', class: 'font-roboto' },
    { value: 'opensans', label: 'Open Sans', class: 'font-opensans' },
    { value: 'lato', label: 'Lato', class: 'font-lato' }
  ]

  const colorPresets = [
    { primary: '#0A4E5A', accent: '#7CC4E0', name: 'Ocean Blue' },
    { primary: '#059669', accent: '#10B981', name: 'Forest Green' },
    { primary: '#DC2626', accent: '#EF4444', name: 'Crimson Red' },
    { primary: '#7C3AED', accent: '#A855F7', name: 'Royal Purple' },
    { primary: '#EA580C', accent: '#F97316', name: 'Orange Sunset' },
    { primary: '#0891B2', accent: '#06B6D4', name: 'Sky Blue' }
  ]

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
    <div className="w-full h-full overflow-auto bg-[#E8ECEF]">
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <Settings className="w-6 md:w-8 h-6 md:h-8 text-[#0A4E5A]" />
            <h1 className="text-2xl md:text-4xl font-bold text-[#0A4E5A]">Settings</h1>
          </div>
          <p className="text-sm md:text-base text-[#7CC4E0]">Customize your profile, preferences, and account settings</p>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-xs md:text-sm font-medium">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-600 hover:text-green-700"
              >
                <X className="w-4 md:w-5 h-4 md:h-5" />
              </button>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-xs md:text-sm font-medium">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage('')}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 md:w-5 h-4 md:h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8 border-b border-gray-200 flex gap-2 md:gap-8 overflow-x-auto pb-2"
        >
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-2 md:px-4 text-sm md:text-base font-medium flex items-center gap-1 md:gap-2 relative transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#0A4E5A]'
                    : 'text-[#7CC4E0] hover:text-[#0A4E5A]'
                }`}
              >
                <Icon className="w-4 md:w-5 h-4 md:h-5" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#0A4E5A] rounded-full"
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
              <h2 className="text-xl md:text-2xl font-bold text-[#0A4E5A] mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Avatar */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-[#0A4E5A] mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-16 md:w-24 h-16 md:h-24 rounded-full object-cover border-4 border-[#7CC4E0]/20"
                        />
                      ) : (
                        <div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-gradient-to-br from-[#0A4E5A] to-[#7CC4E0] flex items-center justify-center border-4 border-[#7CC4E0]/20">
                          <span className="text-xl md:text-3xl font-bold text-white">
                            {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#0A4E5A] text-white text-xs md:text-sm rounded-lg hover:bg-[#7CC4E0] transition-colors disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4" />
                        {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-[#7CC4E0]">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </motion.div>

                {/* Name */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </motion.div>

                {/* Phone */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={e => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </motion.div>

                {/* Timezone */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={e => handleProfileChange('timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Australia/Sydney">Sydney</option>
                    <option value="America/Bogota">Bogota (UTC-5)</option>
                  </select>
                </motion.div>

                {/* Language */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                    Language
                  </label>
                  <select
                    value={profile.language}
                    onChange={e => handleProfileChange('language', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </motion.div>

                {/* Bio */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={e => handleProfileChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-[#7CC4E0] mt-1">{profile.bio.length}/500 characters</p>
                </motion.div>
              </div>

              {/* Save Button */}
              <motion.div variants={itemVariants} className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* Theme Settings */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-2xl font-bold text-[#0A4E5A] mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Appearance
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Theme Mode */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-3">
                      Theme Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map((mode) => {
                        const Icon = mode.icon
                        return (
                          <button
                            key={mode.value}
                            onClick={() => setThemeSettings({ ...themeSettings, mode: mode.value as any })}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              themeSettings.mode === mode.value
                                ? 'border-[#0A4E5A] bg-[#0A4E5A]/10 text-[#0A4E5A]'
                                : 'border-gray-200 hover:border-[#7CC4E0] text-[#7CC4E0]'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-1" />
                            <div className="text-xs font-medium">{mode.label}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-3">
                      Font Family
                    </label>
                    <select
                      value={themeSettings.fontFamily}
                      onChange={e => setThemeSettings({ ...themeSettings, fontFamily: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none"
                    >
                      {fontOptions.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-3">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'small', label: 'Small' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'large', label: 'Large' }
                      ].map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setThemeSettings({ ...themeSettings, fontSize: size.value as any })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            themeSettings.fontSize === size.value
                              ? 'border-[#0A4E5A] bg-[#0A4E5A]/10 text-[#0A4E5A]'
                              : 'border-gray-200 hover:border-[#7CC4E0] text-[#7CC4E0]'
                          }`}
                        >
                          <div className="text-xs font-medium">{size.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout Options */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-3">
                      Layout
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={themeSettings.compactMode}
                          onChange={e => setThemeSettings({ ...themeSettings, compactMode: e.target.checked })}
                          className="rounded border-gray-300 text-[#0A4E5A] focus:ring-[#0A4E5A]"
                        />
                        <span className="text-sm text-[#7CC4E0]">Compact mode</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Color Presets */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#0A4E5A] mb-3">
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => setThemeSettings({
                          ...themeSettings,
                          primaryColor: preset.primary,
                          accentColor: preset.accent
                        })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          themeSettings.primaryColor === preset.primary
                            ? 'border-[#0A4E5A] bg-[#0A4E5A]/10'
                            : 'border-gray-200 hover:border-[#7CC4E0]'
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: preset.accent }}
                          />
                        </div>
                        <div className="text-xs font-medium text-[#0A4E5A]">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveTheme}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Apply Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold text-[#0A4E5A] mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email', icon: '📧' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive real-time notifications in your browser', icon: Smartphone },
                  { key: 'weeklyReport', label: 'Weekly Progress Report', description: 'Get a summary of your learning progress each week', icon: '📊' },
                  { key: 'courseUpdates', label: 'Course Updates', description: 'Notifications when new content is available', icon: '📚' },
                  { key: 'promotions', label: 'Promotions & Offers', description: 'Special offers and promotional content', icon: '🎉' }
                ].map((option) => (
                  <motion.div
                    key={option.key}
                    variants={itemVariants}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        {typeof option.icon === 'string' ? (
                          <span className="text-lg">{option.icon}</span>
                        ) : (
                          <option.icon className="w-5 h-5 text-[#0A4E5A]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-[#0A4E5A]">{option.label}</h3>
                        <p className="text-sm text-[#7CC4E0]">{option.description}</p>
                      </div>
                    </div>
                      <button
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [option.key]: !notificationSettings[option.key as keyof typeof notificationSettings]
                        })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          notificationSettings[option.key as keyof typeof notificationSettings]
                            ? 'bg-[#0A4E5A]'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
                            notificationSettings[option.key as keyof typeof notificationSettings]
                              ? 'translate-x-7'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </motion.div>
                ))}
              </div>

              {/* Sound & Vibration */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-[#0A4E5A] mb-4">Sound & Vibration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {notificationSettings.soundEnabled ? <Volume2 className="w-4 h-4 text-[#0A4E5A]" /> : <VolumeX className="w-4 h-4 text-[#7CC4E0]" />}
                      <span className="text-sm font-medium text-[#0A4E5A]">Sound Effects</span>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        soundEnabled: !notificationSettings.soundEnabled
                      })}
                      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                        notificationSettings.soundEnabled ? 'bg-[#0A4E5A]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.soundEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#0A4E5A]" />
                      <span className="text-sm font-medium text-[#0A4E5A]">Vibration</span>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        vibrationEnabled: !notificationSettings.vibrationEnabled
                      })}
                      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                        notificationSettings.vibrationEnabled ? 'bg-[#0A4E5A]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.vibrationEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <motion.div variants={itemVariants} className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* Privacy Settings */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-2xl font-bold text-[#0A4E5A] mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Visibility
                </h2>

                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-3">
                      Profile Visibility
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
                        { value: 'friends', label: 'Friends Only', description: 'Only friends can see your profile' },
                        { value: 'private', label: 'Private', description: 'Only you can see your profile' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setPrivacySettings({ ...privacySettings, profileVisibility: option.value as any })}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            privacySettings.profileVisibility === option.value
                              ? 'border-[#0A4E5A] bg-[#0A4E5A]/10'
                              : 'border-gray-200 hover:border-[#7CC4E0]'
                          }`}
                        >
                          <div className="font-medium text-[#0A4E5A] mb-1">{option.label}</div>
                          <div className="text-xs text-[#7CC4E0]">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other Privacy Options */}
                  <div className="space-y-4">
                    {[
                      { key: 'showProgress', label: 'Show Learning Progress', description: 'Display your progress on leaderboards and achievements' },
                      { key: 'showAchievements', label: 'Show Achievements', description: 'Display earned badges and certificates' },
                      { key: 'allowDataCollection', label: 'Allow Data Collection', description: 'Help improve our services with anonymous usage data' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive emails about new features and promotions' }
                    ].map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-[#0A4E5A]">{option.label}</h3>
                          <p className="text-sm text-[#7CC4E0]">{option.description}</p>
                        </div>
                        <button
                          onClick={() => setPrivacySettings({
                            ...privacySettings,
                            [option.key]: !privacySettings[option.key as keyof typeof privacySettings]
                          })}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            privacySettings[option.key as keyof typeof privacySettings]
                              ? 'bg-[#0A4E5A]'
                              : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              privacySettings[option.key as keyof typeof privacySettings]
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSavePrivacy}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Save Settings
                  </button>
                </div>
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
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-2xl font-bold text-[#0A4E5A] mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </h2>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password.currentPassword}
                        onChange={e => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                        placeholder="Enter current password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#7CC4E0] hover:text-[#0A4E5A] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password.newPassword}
                      onChange={e => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A4E5A] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={password.confirmPassword}
                      onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4E5A] focus:border-transparent outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </motion.div>

              {/* Security Options */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-2xl font-bold text-[#0A4E5A] mb-6">Security Options</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-[#0A4E5A]">Two-Factor Authentication</h3>
                      <p className="text-sm text-[#7CC4E0]">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 text-[#0A4E5A] font-medium hover:text-[#7CC4E0] transition-colors">
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-[#0A4E5A]">Active Sessions</h3>
                      <p className="text-sm text-[#7CC4E0]">Manage your sessions on other devices</p>
                    </div>
                    <button className="px-4 py-2 text-[#0A4E5A] font-medium hover:text-[#7CC4E0] transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* Account Management */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-2xl font-bold text-[#0A4E5A] mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Management
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-[#0A4E5A]">Export Your Data</h3>
                      <p className="text-sm text-[#7CC4E0]">Download a copy of all your data</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-[#0A4E5A]">Account Status</h3>
                      <p className="text-sm text-[#7CC4E0]">Your account is active and in good standing</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                variants={itemVariants}
                className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6"
              >
                <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h2>
                <p className="text-red-600 mb-6">
                  These actions are irreversible. Please be certain before proceeding.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                    <div>
                      <h3 className="font-medium text-red-600">Delete Account</h3>
                      <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Logout */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold text-[#0A4E5A] mb-4">Sign Out</h2>
                <p className="text-[#7CC4E0] mb-6">
                  Sign out of your account. You can sign back in at any time.
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
             