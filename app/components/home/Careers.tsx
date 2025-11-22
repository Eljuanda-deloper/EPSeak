'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, memo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../shared/Button';
import Image from 'next/image';

interface Career {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetRole: string;
  image: string;
  slug: string;
}

const careers: Career[] = [
  {
    id: '1',
    title: 'English with an emphasis on automation',
    description: 'Master English in automation contexts with sequential modules',
    icon: '🤖',
    targetRole: 'Automation Professional',
    image: '/imagenes/Carreras/English with an emphasis on automation.webp',
    slug: 'automation'
  },
  {
    id: '2',
    title: 'Business English Professional',
    description: 'Master English for international business communication, negotiations, and corporate environments',
    icon: '💼',
    targetRole: 'Business Professional',
    image: '/imagenes/Carreras/Business English Professional.webp',
    slug: 'business'
  },
  {
    id: '3',
    title: 'Medical English Professional',
    description: 'Develop English proficiency for healthcare professionals, medical terminology, and patient communication',
    icon: '🏥',
    targetRole: 'Healthcare Professional',
    image: '/imagenes/Carreras/Medical English Professional.webp',
    slug: 'medical'
  },
  {
    id: '4',
    title: 'Legal English Professional',
    description: 'Acquire specialized English for legal professionals, contracts, and international law practice',
    icon: '⚖️',
    targetRole: 'Legal Professional',
    image: '/imagenes/Carreras/Legal English Professional.webp',
    slug: 'legal'
  },
  {
    id: '5',
    title: 'Tech English Professional',
    description: 'Master English for technology professionals, software development, and tech industry communication',
    icon: '💻',
    targetRole: 'Tech Professional',
    image: '/imagenes/Carreras/Tech English Professional.webp',
    slug: 'tech'
  },

];

// Memoized image component to prevent re-renders
const CareerImage = memo(({
  src,
  alt,
  careerId,
  onError,
  isPriority
}: {
  src: string;
  alt: string;
  careerId: string;
  onError: (id: string) => void;
  isPriority: boolean;
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError(careerId);
  };

  if (hasError) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      onError={handleError}
      priority={isPriority}
      loading={isPriority ? "eager" : "lazy"}
      unoptimized={src.includes('Tech English Professional')}
    />
  );
}, (prevProps, nextProps) => {
  // Only re-render if src or careerId changes
  return prevProps.src === nextProps.src && prevProps.careerId === nextProps.careerId;
});

CareerImage.displayName = 'CareerImage';

const Careers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const intervalRef = useRef<number | null>(null);
  const autoplayResetRef = useRef<number | null>(null);

  const handleImageError = (careerId: string) => {
    setImageErrors(prev => new Set(prev).add(careerId));
  };

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Calculate max index based on cards per view
  const maxIndex = Math.max(0, careers.length - cardsPerView);

  // Autoplay logic
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) {
      if (intervalRef.current !== null) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }

    const delay = 5000;
    intervalRef.current = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        // Loop back to start when reaching the end
        return (prevIndex + 1) % (maxIndex + 1);
      });
      intervalRef.current = null;
    }, delay);

    return () => {
      if (intervalRef.current !== null) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, currentIndex, maxIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setIsAutoPlaying(false);
    resetAutoplayTimer();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    setIsAutoPlaying(false);
    resetAutoplayTimer();
  };

  const resetAutoplayTimer = () => {
    if (autoplayResetRef.current !== null) {
      clearTimeout(autoplayResetRef.current);
      autoplayResetRef.current = null;
    }
    autoplayResetRef.current = window.setTimeout(() => {
      setIsAutoPlaying(true);
      autoplayResetRef.current = null;
    }, 10000);
  };

  // Calculate progress percentage
  const progressPercentage = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0;

  return (
    <section id="careers" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-azul-petroleo via-azul-celeste to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="text-white text-xs sm:text-sm font-medium">Programas Especializados</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-6 px-2">
            Carreras Profesionales
          </h2>
          <p className="text-sm sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Elige el programa que se adapte a tu profesión y domina el inglés especializado
            para trabajar en cualquier parte del mundo
          </p>
        </motion.div>

        {/* Modern Carousel */}
        <div className="relative px-0 sm:px-8 md:px-12">
          {/* Cards Container */}
          <div className="overflow-hidden py-4 -my-4">
            <motion.div
              className="flex gap-4 sm:gap-4 md:gap-6"
              animate={{
                x: `-${currentIndex * (100 / cardsPerView)}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {careers.map((career, index) => (
                <motion.div
                  key={career.id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * (cardsPerView === 1 ? 0 : cardsPerView === 2 ? 16 : 24) / cardsPerView}px)`
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-white/10">
                    {/* Image Section */}
                    <div className="relative h-48 sm:h-48 md:h-56 overflow-hidden bg-gradient-to-br from-azul-petroleo to-azul-celeste">
                      <div
                        className="absolute inset-0 cursor-pointer"
                        style={{
                          backgroundImage: career.image && !imageErrors.has(career.id) ? `url("${career.image}")` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          transition: 'transform 0.7s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onClick={() => window.location.href = `/careers/${career.slug}`}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>

                      {/* Icon Badge */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-14 sm:h-14 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 pointer-events-none z-10">
                        {career.icon}
                      </div>

                      {/* Target Role Badge */}
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full pointer-events-none z-10 max-w-[85%]">
                        <span className="text-[10px] sm:text-xs font-bold text-azul-petroleo truncate block">{career.targetRole}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-azul-petroleo mb-2 sm:mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
                        {career.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-3 flex-grow">
                        {career.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2 mb-5 sm:mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-azul-celeste rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 text-xs">Módulos especializados</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-azul-celeste rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 text-xs">Profesores nativos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-azul-celeste rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 text-xs">Certificación internacional</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={() => window.location.href = `/careers/${career.slug}`}
                        className="w-full group/btn text-sm sm:text-base py-2.5"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Explorar programa
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows - Optimized for mobile */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-20 border border-gray-100 ${currentIndex === 0
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer'
              }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-azul-petroleo" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-20 border border-gray-100 ${currentIndex >= maxIndex
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer'
              }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-azul-petroleo" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 sm:mt-12 max-w-xs sm:max-w-md mx-auto px-4 sm:px-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-white/80 text-xs sm:text-sm font-medium w-8 text-right">
              {currentIndex + 1} / {maxIndex + 1}
            </span>
            <div className="flex-grow h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-white/80 text-xs sm:text-sm font-medium whitespace-nowrap">
              {careers.length} programas
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Careers;