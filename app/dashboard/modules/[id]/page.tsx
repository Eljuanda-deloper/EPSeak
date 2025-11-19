'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Lock, Unlock, Play, Clock, BookOpen, CheckCircle, AlertCircle, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import LessonPlayer from '@/app/components/dashboard/LessonPlayer'

// Mock data - This will be replaced with real data from Supabase
const mockModules = [
  {
    id: '1',
    title: 'Introducción a la Medicina',
    description: 'Aprende terminología médica básica y vocabulario esencial para comunicarte en entornos médicos.',
    area_of_interest: 'Medicina',
    order_index: 1,
    is_unlocked: true,
    completion_percentage: 100,
    prerequisites: [],
    lessons: [
      {
        id: '1-1',
        title: 'Saludos y presentaciones médicas',
        duration_minutes: 15,
        completed: true,
        content: `
          <h3>Saludos y presentaciones médicas</h3>
          <p>En el entorno médico, las presentaciones siguen un protocolo específico. Los profesionales de la salud deben presentarse de manera clara y profesional.</p>

          <h4>Frases comunes:</h4>
          <ul>
            <li>"Hello, I'm Dr. Smith, the attending physician."</li>
            <li>"Good morning, my name is Nurse Johnson."</li>
            <li>"I'm here to take your vital signs."</li>
          </ul>

          <h4>Vocabulario clave:</h4>
          <ul>
            <li><strong>Attending physician:</strong> Médico tratante principal</li>
            <li><strong>Resident:</strong> Médico residente</li>
            <li><strong>Intern:</strong> Médico interno</li>
            <li><strong>Vital signs:</strong> Signos vitales</li>
          </ul>
        `,
        video_url: null
      },
      {
        id: '1-2',
        title: 'Síntomas comunes',
        duration_minutes: 20,
        completed: true,
        content: `
          <h3>Síntomas comunes en inglés médico</h3>
          <p>Los pacientes describen sus síntomas de diferentes maneras. Es crucial entender estas descripciones para un diagnóstico adecuado.</p>

          <h4>Síntomas frecuentes:</h4>
          <ul>
            <li><strong>Fever:</strong> Fiebre</li>
            <li><strong>Cough:</strong> Tos</li>
            <li><strong>Headache:</strong> Dolor de cabeza</li>
            <li><strong>Nausea:</strong> Náuseas</li>
            <li><strong>Shortness of breath:</strong> Dificultad para respirar</li>
          </ul>

          <h4>Expresiones del paciente:</h4>
          <ul>
            <li>"I feel dizzy" - Me siento mareado</li>
            <li>"My stomach hurts" - Me duele el estómago</li>
            <li>"I have a sore throat" - Me duele la garganta</li>
          </ul>
        `,
        video_url: null
      },
      {
        id: '1-3',
        title: 'Partes del cuerpo',
        duration_minutes: 25,
        completed: true,
        content: `
          <h3>Anatomía básica en inglés</h3>
          <p>Conocer las partes del cuerpo es fundamental para la comunicación médica efectiva.</p>

          <h4>Partes principales:</h4>
          <ul>
            <li><strong>Head:</strong> Cabeza</li>
            <li><strong>Neck:</strong> Cuello</li>
            <li><strong>Chest:</strong> Pecho</li>
            <li><strong>Abdomen:</strong> Abdomen</li>
            <li><strong>Arm:</strong> Brazo</li>
            <li><strong>Leg:</strong> Pierna</li>
          </ul>

          <h4>Órganos internos:</h4>
          <ul>
            <li><strong>Heart:</strong> Corazón</li>
            <li><strong>Lungs:</strong> Pulmones</li>
            <li><strong>Liver:</strong> Hígado</li>
            <li><strong>Kidneys:</strong> Riñones</li>
            <li><strong>Stomach:</strong> Estómago</li>
          </ul>
        `,
        video_url: null
      }
    ]
  },
  {
    id: '2',
    title: 'Anatomía y Fisiología',
    description: 'Domina el vocabulario relacionado con el cuerpo humano, sistemas orgánicos y funciones fisiológicas.',
    area_of_interest: 'Medicina',
    order_index: 2,
    is_unlocked: true,
    completion_percentage: 75,
    prerequisites: ['1'],
    lessons: [
      {
        id: '2-1',
        title: 'Sistema cardiovascular',
        duration_minutes: 30,
        completed: true,
        content: `
          <h3>Sistema Cardiovascular</h3>
          <p>El sistema cardiovascular es responsable de transportar sangre, nutrientes y oxígeno por todo el cuerpo.</p>

          <h4>Componentes principales:</h4>
          <ul>
            <li><strong>Heart:</strong> Corazón - Órgano muscular que bombea sangre</li>
            <li><strong>Arteries:</strong> Arterias - Vasos que llevan sangre oxigenada</li>
            <li><strong>Veins:</strong> Venas - Vasos que llevan sangre desoxigenada</li>
            <li><strong>Capillaries:</strong> Capilares - Vasos pequeños de intercambio</li>
          </ul>

          <h4>Funciones:</h4>
          <ul>
            <li>Transporte de oxígeno y nutrientes</li>
            <li>Eliminación de desechos metabólicos</li>
            <li>Regulación de la temperatura corporal</li>
            <li>Mantenimiento del pH sanguíneo</li>
          </ul>
        `,
        video_url: null
      },
      {
        id: '2-2',
        title: 'Sistema respiratorio',
        duration_minutes: 25,
        completed: true,
        content: `
          <h3>Sistema Respiratorio</h3>
          <p>El sistema respiratorio facilita el intercambio de gases entre el organismo y el ambiente.</p>

          <h4>Estructuras principales:</h4>
          <ul>
            <li><strong>Nose:</strong> Nariz</li>
            <li><strong>Trachea:</strong> Tráquea</li>
            <li><strong>Bronchi:</strong> Bronquios</li>
            <li><strong>Lungs:</strong> Pulmones</li>
            <li><strong>Alveoli:</strong> Alvéolos</li>
          </ul>

          <h4>Proceso respiratorio:</h4>
          <ol>
            <li>Inspiración de aire</li>
            <li>Intercambio de gases en los alvéolos</li>
            <li>Transporte de oxígeno por la sangre</li>
            <li>Expiración de dióxido de carbono</li>
          </ol>
        `,
        video_url: null
      },
      {
        id: '2-3',
        title: 'Sistema digestivo',
        duration_minutes: 35,
        completed: false,
        content: `
          <h3>Sistema Digestivo</h3>
          <p>El sistema digestivo descompone los alimentos en nutrientes que el cuerpo puede absorber y utilizar.</p>

          <h4>Órganos del tracto digestivo:</h4>
          <ul>
            <li><strong>Mouth:</strong> Boca</li>
            <li><strong>Esophagus:</strong> Esófago</li>
            <li><strong>Stomach:</strong> Estómago</li>
            <li><strong>Small intestine:</strong> Intestino delgado</li>
            <li><strong>Large intestine:</strong> Intestino grueso</li>
            <li><strong>Rectum:</strong> Recto</li>
          </ul>

          <h4>Órganos accesorios:</h4>
          <ul>
            <li><strong>Liver:</strong> Hígado</li>
            <li><strong>Gallbladder:</strong> Vesícula biliar</li>
            <li><strong>Pancreas:</strong> Páncreas</li>
            <li><strong>Salivary glands:</strong> Glándulas salivales</li>
          </ul>
        `,
        video_url: null
      }
    ]
  },
  {
    id: '3',
    title: 'Diagnóstico y Tratamiento',
    description: 'Aprende términos médicos avanzados para diagnósticos, tratamientos y procedimientos clínicos.',
    area_of_interest: 'Medicina',
    order_index: 3,
    is_unlocked: false,
    completion_percentage: 0,
    prerequisites: ['2'],
    lessons: [
      {
        id: '3-1',
        title: 'Procedimientos diagnósticos',
        duration_minutes: 40,
        completed: false,
        content: '<h3>Procedimientos Diagnósticos</h3><p>Contenido sobre procedimientos diagnósticos...</p>',
        video_url: null
      },
      {
        id: '3-2',
        title: 'Tratamientos y medicamentos',
        duration_minutes: 35,
        completed: false,
        content: '<h3>Tratamientos y Medicamentos</h3><p>Contenido sobre tratamientos...</p>',
        video_url: null
      },
      {
        id: '3-3',
        title: 'Cirugías comunes',
        duration_minutes: 45,
        completed: false,
        content: '<h3>Cirugías Comunes</h3><p>Contenido sobre cirugías...</p>',
        video_url: null
      }
    ]
  }
]

export default function ModuleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [module, setModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [accessGranted, setAccessGranted] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)

  useEffect(() => {
    const moduleId = params.id as string
    const foundModule = mockModules.find(m => m.id === moduleId)

    if (foundModule) {
      setModule(foundModule)
      setAccessGranted(foundModule.is_unlocked)
    }
    setLoading(false)
  }, [params.id])

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson)
  }

  const handleLessonComplete = (lessonId: string) => {
    // Update lesson completion status
    setModule((prevModule: any) => ({
      ...prevModule,
      lessons: prevModule.lessons.map((lesson: any) =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      )
    }))
    // Here you would typically call an API to update the backend
  }

  const handleLessonProgress = (lessonId: string, progress: number) => {
    // Update lesson progress in real-time
    console.log(`Lesson ${lessonId} progress: ${progress}%`)
    // Here you would typically call an API to update progress
  }

  const handleNavigateLesson = (lessonId: string) => {
    const lesson = module?.lessons.find((l: any) => l.id === lessonId)
    if (lesson) {
      setSelectedLesson(lesson)
    }
  }

  const getNextLesson = (currentLessonId: string) => {
    const currentIndex = module?.lessons.findIndex((l: any) => l.id === currentLessonId)
    return currentIndex < (module?.lessons.length - 1) ? module.lessons[currentIndex + 1] : null
  }

  const getPreviousLesson = (currentLessonId: string) => {
    const currentIndex = module?.lessons.findIndex((l: any) => l.id === currentLessonId)
    return currentIndex > 0 ? module.lessons[currentIndex - 1] : null
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A4E5A]"></div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-[#7CC4E0] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0A4E5A] mb-2">Módulo no encontrado</h2>
          <p className="text-[#7CC4E0] mb-4">El módulo que buscas no existe.</p>
          <Link
            href="/dashboard/modules"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </Link>
        </div>
      </div>
    )
  }

  if (!accessGranted) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0312D]/20 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-[#E0312D]/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#E0312D]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0A4E5A]">{module.title}</h1>
                <p className="text-[#7CC4E0]">{module.area_of_interest}</p>
              </div>
            </div>

            <div className="bg-[#E0312D]/10 rounded-xl p-4 border border-[#E0312D]/20">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-[#E0312D]" />
                <h3 className="font-semibold text-[#E0312D]">Acceso restringido</h3>
              </div>
              <p className="text-[#E0312D]/80 mb-4">
                Este módulo está bloqueado. Debes completar los módulos previos para desbloquearlo.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-[#E0312D]/70">
                  <strong>Requisitos:</strong> Completa {module.prerequisites.length} módulo{module.prerequisites.length > 1 ? 's' : ''} anterior{module.prerequisites.length > 1 ? 'es' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20">
            <h3 className="text-lg font-semibold text-[#0A4E5A] mb-4">Módulos requeridos</h3>
            <div className="space-y-3">
              {module.prerequisites.map((prereqId: string) => {
                const prereqModule = mockModules.find(m => m.id === prereqId)
                return prereqModule ? (
                  <div key={prereqId} className="flex items-center gap-3 p-3 bg-[#E8ECEF] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-[#0A4E5A]">{prereqModule.title}</p>
                      <p className="text-sm text-[#7CC4E0]">{prereqModule.completion_percentage}% completado</p>
                    </div>
                  </div>
                ) : null
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/dashboard/modules"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a módulos
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard/modules"
              className="p-2 hover:bg-[#E8ECEF] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#0A4E5A]" />
            </Link>
            <div className="w-16 h-16 rounded-xl bg-[#0A4E5A]/10 flex items-center justify-center">
              <Unlock className="w-8 h-8 text-[#7CC4E0]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0A4E5A]">{module.title}</h1>
              <p className="text-[#7CC4E0]">{module.area_of_interest}</p>
            </div>
          </div>

          <p className="text-[#0A4E5A]/80 mb-4">{module.description}</p>

          {/* Progress */}
          <div className="bg-[#E8ECEF] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#0A4E5A]">Progreso del módulo</span>
              <span className="text-sm text-[#7CC4E0]">{module.completion_percentage}%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] rounded-full transition-all duration-500"
                style={{ width: `${module.completion_percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lesson Player */}
        {selectedLesson && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#0A4E5A] flex items-center gap-2">
                <Play className="w-6 h-6" />
                Reproduciendo: {selectedLesson.title}
              </h2>
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 bg-[#E8ECEF] hover:bg-[#7CC4E0]/20 text-[#0A4E5A] rounded-lg transition-colors"
              >
                Cerrar reproductor
              </button>
            </div>
            <LessonPlayer
              lesson={selectedLesson}
              onComplete={handleLessonComplete}
              onProgress={handleLessonProgress}
              nextLesson={getNextLesson(selectedLesson.id)}
              previousLesson={getPreviousLesson(selectedLesson.id)}
              onNavigate={handleNavigateLesson}
            />
          </div>
        )}

        {/* Lessons */}
        <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20">
          <h2 className="text-xl font-semibold text-[#0A4E5A] mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Lecciones del módulo
          </h2>

          <div className="space-y-4">
            {module.lessons.map((lesson: any, index: number) => (
              <div
                key={lesson.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  lesson.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-[#7CC4E0]/30 bg-white hover:border-[#0A4E5A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      lesson.completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-[#0A4E5A]/10 text-[#0A4E5A]'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        lesson.completed ? 'text-green-700' : 'text-[#0A4E5A]'
                      }`}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-[#7CC4E0]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLessonClick(lesson)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      lesson.completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-[#0A4E5A] text-white hover:bg-[#7CC4E0]'
                    }`}
                  >
                    {lesson.completed ? 'Revisar' : 'Comenzar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20 text-center">
            <div className="text-2xl font-bold text-[#0A4E5A] mb-1">{module.lessons.length}</div>
            <div className="text-sm text-[#7CC4E0]">Total de lecciones</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20 text-center">
            <div className="text-2xl font-bold text-[#0A4E5A] mb-1">
              {module.lessons.reduce((acc: number, lesson: any) => acc + lesson.duration, 0)}
            </div>
            <div className="text-sm text-[#7CC4E0]">Minutos totales</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20 text-center">
            <div className="text-2xl font-bold text-[#0A4E5A] mb-1">
              {module.lessons.filter((l: any) => l.completed).length}
            </div>
            <div className="text-sm text-[#7CC4E0]">Lecciones completadas</div>
          </div>
        </div>
      </div>
    </div>
  )
}