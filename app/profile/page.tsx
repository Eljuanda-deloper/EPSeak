'use client'

import { redirect } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import ProfileForm from '@/app/components/auth/ProfileForm'
import Link from 'next/link'
import { ArrowLeft, Mail, Shield, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-12">
        <div className="flex items-center justify-between px-6 h-full">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-sm font-semibold text-gray-900">My Profile</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a4d5c] to-[#5da6b8] px-6 py-8 sm:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{user?.email?.split('@')[0] || 'Usuario'}</h2>
                  <p className="text-blue-100 flex items-center gap-2">
                    <Mail size={16} />
                    {user?.email}
                  </p>
                </div>
                <div className="text-6xl text-blue-100 opacity-20">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              <div className="p-6">
                <p className="text-xs text-gray-600 mb-1">User ID</p>
                <p className="text-sm font-mono text-gray-900 break-all">{user?.id.slice(0, 8)}...</p>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-600 mb-1">Account Created</p>
                <p className="text-sm text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US') : 'N/A'}
                </p>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className="text-sm">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 sm:px-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
              <p className="text-sm text-gray-600 mt-1">Edit your personal information</p>
            </div>
            <div className="p-6 sm:p-8">
              <ProfileForm />
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 sm:px-8 border-b border-gray-200 flex items-center gap-3">
              <Shield size={20} className="text-gray-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Security</h3>
                <p className="text-sm text-gray-600">Manage your account access</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">Last update: Never</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-[#5da6b8] hover:bg-blue-50 rounded-lg transition-colors">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Active Sessions</p>
                  <p className="text-sm text-gray-600">1 active session</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-red-500">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sign Out</h3>
                  <p className="text-sm text-gray-600 mt-1">You will be signed out from all devices</p>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Sign Out?</h4>
                <p className="text-gray-600 mb-6">You will be signed out of your current session. You'll need to sign in again to access your account.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Sign Out
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