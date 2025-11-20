'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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
    image: '/imagenes/Carreras/English%20with%20an%20emphasis%20on%20automation.webp',
    slug: 'automation'
  },
  {
    id: '2',
    title: 'Business English Professional',
    description: 'Master English for international business communication, negotiations, and corporate environments',
    icon: '💼',
    targetRole: 'Business Professional',
    image: '/imagenes/Carreras/Business%20English%20Professional.webp',
    slug: 'business'
  },
  {
    id: '3',
    title: 'Medical English Professional',
    description: 'Develop English proficiency for healthcare professionals, medical terminology, and patient communication',
    icon: '🏥',
    targetRole: 'Healthcare Professional',
    image: '/imagenes/Carreras/Medical%20English%20Professional.webp',
    slug: 'medical'
  },
  {
    id: '4',
    title: 'Legal English Professional',
    description: 'Acquire specialized English for legal professionals, contracts, and international law practice',
    icon: '⚖️',
    targetRole: 'Legal Professional',
    image: '/imagenes/Carreras/Legal%20English%20Professional.webp',
    slug: 'legal'
  },
  {
    id: '5',
    title: 'Tech English Professional',
    description: 'Build English skills for technology professionals, technical documentation, and global tech teams',
    icon: '💻',
    targetRole: 'Technology Professional',
    image: '/imagenes/Carreras/Tech%20English%20Professional.webp',
    slug: 'tech'
  }
];

const Careers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === careers.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? careers.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === careers.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentCareer = careers[currentIndex];

  return (
    <section id="careers" className="py-16 bg-gradient-to-br from-azul-petroleo via-azul-celeste to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Programas de Carrera
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Elige el programa que se adapte a tu profesión y domina el inglés especializado
            para trabajar en cualquier parte del mundo
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-96 md:h-full bg-gradient-to-br from-azul-petroleo to-azul-celeste flex items-center justify-center overflow-hidden">
                {currentCareer.image ? (
                  <div className="relative w-full h-full">
                    <img
                      key={currentCareer.id}
                      src={currentCareer.image}
                      alt={currentCareer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-white mix-blend-overlay">
                    <div className="text-6xl mb-4">{currentCareer.icon}</div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-4xl mb-4">{currentCareer.icon}</div>
                <h3 className="text-3xl font-bold text-azul-petroleo mb-4">
                  {currentCareer.title}
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {currentCareer.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-azul-celeste rounded-full"></div>
                    <span className="text-gray-700">Módulos especializados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-azul-celeste rounded-full"></div>
                    <span className="text-gray-700">Profesores nativos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-azul-celeste rounded-full"></div>
                    <span className="text-gray-700">Certificación internacional</span>
                  </div>
                </div>

                <Button
                  onClick={() => window.location.href = `/careers/${currentCareer.slug}`}
                  className="w-full md:w-auto"
                >
                  <span className="flex items-center gap-2">
                    Explorar Programa
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-azul-petroleo" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-azul-petroleo" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-6">
            {careers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-azul-celeste scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Careers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {careers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group"
              onClick={() => window.location.href = `/careers/${career.slug}`}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {career.icon}
              </div>
              <h4 className="text-base font-semibold text-white mb-2 group-hover:text-azul-celeste transition-colors">
                {career.title.split(' ').slice(0, 2).join(' ')}
              </h4>
              <p className="text-white/70 text-xs leading-relaxed">
                {career.description.substring(0, 70)}...
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Careers;