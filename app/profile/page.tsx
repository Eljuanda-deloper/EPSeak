export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mi Perfil
          </h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu información personal y preferencias de cuenta
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}