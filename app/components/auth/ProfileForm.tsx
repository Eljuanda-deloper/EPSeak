'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { supabase } from '@/app/utils/supabase'

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  bio: string | null
  updated_at: string | null
}

export default function ProfileForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user])

  const getProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile: Profile = {
          id: user?.id || '',
          username: null,
          full_name: null,
          avatar_url: null,
          website: null,
          bio: null,
          updated_at: new Date().toISOString()
        }
        setProfile(initialProfile)
      }
    } catch (error: any) {
      setError('Error al cargar el perfil')
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) {
      setError('Perfil no disponible')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      // Validaciones frontend
      if (profile.username && profile.username.length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres')
      }

      if (profile.website && !profile.website.match(/^https?:\/\/.+/)) {
        throw new Error('La URL del sitio web debe comenzar con http:// o https://')
      }

      const updates = {
        ...profile,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error

      setSuccess('Perfil actualizado exitosamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando perfil...</span>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center py-8 text-gray-600">No se pudo cargar el perfil</div>
  }

  return (
    <form onSubmit={updateProfile} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-green-600 text-sm font-medium">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={profile.username || ''}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5da6b8] focus:border-transparent transition-all"
            placeholder="your_username"
            minLength={3}
          />
          <p className="text-xs text-gray-500 mt-2">Minimum 3 characters</p>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-gray-900 mb-2">
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5da6b8] focus:border-transparent transition-all"
            placeholder="Your full name"
          />
        </div>

        {/* Website */}
        <div className="sm:col-span-2">
          <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
            Website (Optional)
          </label>
          <input
            id="website"
            type="url"
            value={profile.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5da6b8] focus:border-transparent transition-all"
            placeholder="https://your-website.com"
          />
          <p className="text-xs text-gray-500 mt-2">Must start with http:// or https://</p>
        </div>

        {/* Bio */}
        <div className="sm:col-span-2">
          <label htmlFor="bio" className="block text-sm font-semibold text-gray-900 mb-2">
            Bio (Optional)
          </label>
          <textarea
            id="bio"
            value={profile.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5da6b8] focus:border-transparent transition-all resize-none"
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {(profile.bio || '').length}/500 characters
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {saving ? '⏳ Saving changes...' : '✓ All changes are saved automatically'}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-[#1a4d5c] to-[#5da6b8] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}