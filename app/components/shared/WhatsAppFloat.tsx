'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';

const WhatsAppFloat = () => {
  const whatsappNumber = '573113678555'; // Número real de EPSeak
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 1.8
      }}
      className="fixed bottom-8 right-8 z-50"
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={isHovered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 5 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-xl whitespace-nowrap"
      >
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-400" />
          <span>Contactar por WhatsApp</span>
        </div>
        <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </motion.div>

      {/* Main Button */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-green-500/20 blur-lg"
          animate={isHovered ? {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Button */}
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola EPSeak, me gustaría obtener más información sobre sus programas de inglés para propósitos específicos. ¿Podrían asesorarme?')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 text-white overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="EPSeak - Contacto directo por WhatsApp"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full"
            animate={isHovered ? {
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 1]
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Icon */}
          <motion.div
            className="relative z-10"
            animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <MessageCircle className="w-7 h-7 drop-shadow-sm" />
          </motion.div>

          {/* Notification badge */}
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0.4)",
                "0 0 0 6px rgba(239, 68, 68, 0)",
                "0 0 0 0 rgba(239, 68, 68, 0)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-xs text-white font-bold">1</span>
          </motion.div>

          {/* Ripple effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={isHovered ? { scale: 1.2, opacity: [0, 0.5, 0] } : {}}
            transition={{ duration: 0.6 }}
          />
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default WhatsAppFloat;