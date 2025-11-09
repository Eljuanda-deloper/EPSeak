'use client';

import { motion, useAnimation } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const WhatsAppFloat = () => {
  const whatsappNumber = '573113678555'; // Número real de EPSeak
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Animación de pulso cada 5 segundos
    const interval = setInterval(() => {
      if (!isExpanded) {
        controls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.6, ease: "easeInOut" }
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [controls, isExpanded]);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1
      }}
      className="fixed bottom-8 right-8 z-50"
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={isExpanded ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-azul-petroleo text-white text-sm rounded-lg shadow-lg whitespace-nowrap"
      >
        ¡Hablemos por WhatsApp!
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-azul-petroleo"></div>
      </motion.div>

      {/* Main button */}
      <motion.div
        animate={controls}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <motion.a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#25D366] to-[#20B954] rounded-full shadow-2xl text-white cursor-pointer overflow-hidden group"
          title="Contáctanos por WhatsApp"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-full"
            animate={{
              background: [
                "linear-gradient(45deg, #25D366, #20B954)",
                "linear-gradient(225deg, #25D366, #20B954)",
                "linear-gradient(45deg, #25D366, #20B954)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={isExpanded ? { scale: 1.5, opacity: 0 } : {}}
            transition={{ duration: 0.6, repeat: isExpanded ? Infinity : 0 }}
          />

          {/* Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </motion.div>

          {/* Notification dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-xs text-white font-bold">1</span>
          </motion.div>
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default WhatsAppFloat;