'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export function SignUpCard() {
  const router = useRouter();
  const auth = useAuth();
  const { signUp, resendConfirmationEmail } = auth || {};
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // For 3D card effect - increased rotation range for more pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]); // Increased from 5/-5 to 10/-10
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]); // Increased from -5/5 to -10/10

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    if (!signUp) {
      setError("Error de autenticación");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(email, password);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Mostrar mensaje de éxito
        setSuccess(true);
        setIsLoading(false);
        // No redirigir automáticamente, dejar que confirme email primero
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error durante el registro';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resendConfirmationEmail || !email) {
      setResendMessage("Error: no se puede enviar el correo");
      return;
    }

    setResendLoading(true);
    setResendMessage("");
    
    try {
      const result = await resendConfirmationEmail(email);
      
      if (result?.error) {
        setResendMessage(`Error: ${result.error}`);
      } else {
        setResendMessage("✓ Correo de confirmación reenviado. Por favor revisa tu bandeja de entrada.");
      }
    } catch (err) {
      setResendMessage("Error al reenviar el correo");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--azul-petroleo)] via-[var(--azul-celeste)]/80 to-white relative overflow-hidden flex items-center justify-center" style={{ position: 'relative' }}>
      {/* Background gradient effect - using page color palette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--azul-petroleo)]/20 via-[var(--azul-celeste)]/10 to-transparent" />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[var(--azul-celeste)]/20 blur-[80px]" />
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[var(--azul-petroleo)]/20 blur-[60px]"
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[var(--rojo-brillante)]/20 blur-[60px]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1
        }}
      />

      {/* Animated glow spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-[var(--azul-celeste)]/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-[var(--rojo-brillante)]/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Card glow effect - reduced intensity */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(255,255,255,0.03)",
                  "0 0 15px 5px rgba(255,255,255,0.05)",
                  "0 0 10px 2px rgba(255,255,255,0.03)"
                ],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror"
              }}
            />

              {/* Traveling light beam effect - reduced opacity */}
              <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                {/* Top light beam - enhanced glow */}
                <motion.div
                  className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{
                    left: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{
                    left: {
                      duration: 2.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror"
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }
                  }}
                />

                {/* Right light beam - enhanced glow */}
                <motion.div
                  className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{
                    top: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{
                    top: {
                      duration: 2.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: 0.6
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.6
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.6
                    }
                  }}
                />

                {/* Bottom light beam - enhanced glow */}
                <motion.div
                  className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{
                    right: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{
                    right: {
                      duration: 2.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: 1.2
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.2
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.2
                    }
                  }}
                />

                {/* Left light beam - enhanced glow */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{
                    bottom: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{
                    bottom: {
                      duration: 2.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: 1.8
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.8
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.8
                    }
                  }}
                />

                {/* Subtle corner glow spots - reduced opacity */}
                <motion.div
                  className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                <motion.div
                  className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.5
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2.3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.5
                  }}
                />
              </div>

              {/* Card border glow - reduced opacity */}
              <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

              {/* Glass card background */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
                {/* Subtle card inner patterns */}
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                    backgroundSize: '30px 30px'
                  }}
                />

                {/* Logo and header */}
                <div className="text-center space-y-1 mb-5">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="mx-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden"
                  >
                    {/* Logo placeholder - would be an SVG in practice */}
                    {/* <!-- SVG_LOGO --> */}
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">S</span>

                    {/* Inner lighting effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                  >
                    Crear Cuenta
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/60 text-xs"
                  >
                    Únete a ESPeak y comienza tu aprendizaje
                  </motion.p>
                </div>

                {/* Registration form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-xs"
                    >
                      {error}
                    </motion.div>
                  )}
                  <motion.div className="space-y-3">
                    {/* Full Name input */}
                    <motion.div
                      className={`relative ${focusedInput === "name" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "name" ? 'text-white' : 'text-white/40'
                        }`} />

                        <Input
                          type="text"
                          placeholder="Nombre completo"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onFocus={() => setFocusedInput("name" as any)}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                        />

                        {/* Input highlight effect */}
                        {focusedInput === "name" && (
                          <motion.div
                            layoutId="input-highlight"
                            className="absolute inset-0 bg-white/5 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Email input */}
                    <motion.div
                      className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "email" ? 'text-white' : 'text-white/40'
                        }`} />

                        <Input
                          type="email"
                          placeholder="Correo electrónico"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput("email" as any)}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                        />

                        {/* Input highlight effect */}
                        {focusedInput === "email" && (
                          <motion.div
                            layoutId="input-highlight"
                            className="absolute inset-0 bg-white/5 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Password input */}
                    <motion.div
                      className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "password" ? 'text-white' : 'text-white/40'
                        }`} />

                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedInput("password" as any)}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                        />

                        {/* Toggle password visibility */}
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 cursor-pointer"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                          ) : (
                            <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                          )}
                        </div>

                        {/* Input highlight effect */}
                        {focusedInput === "password" && (
                          <motion.div
                            layoutId="input-highlight"
                            className="absolute inset-0 bg-white/5 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Confirm Password input */}
                    <motion.div
                      className={`relative ${focusedInput === "confirmPassword" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "confirmPassword" ? 'text-white' : 'text-white/40'
                        }`} />

                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirmar contraseña"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedInput("confirmPassword" as any)}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                        />

                        {/* Toggle confirm password visibility */}
                        <div
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                          ) : (
                            <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                          )}
                        </div>

                        {/* Input highlight effect */}
                        {focusedInput === "confirmPassword" && (
                          <motion.div
                            layoutId="input-highlight"
                            className="absolute inset-0 bg-white/5 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Accept Terms */}
                  <div className="flex items-start space-x-2 pt-1">
                    <div className="relative mt-0.5">
                      <input
                        id="accept-terms"
                        name="accept-terms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={() => setAcceptTerms(!acceptTerms)}
                        className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-white checked:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-200"
                      />
                      {acceptTerms && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center text-black pointer-events-none"
                        >
                          {/* <!-- SVG_CHECKMARK --> */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <label htmlFor="accept-terms" className="text-xs text-white/60 leading-relaxed">
                      Acepto los{' '}
                      <Link href="/terms" className="text-white/80 hover:text-white underline transition-colors duration-200">
                        términos y condiciones
                      </Link>
                      {' '}y la{' '}
                      <Link href="/privacy" className="text-white/80 hover:text-white underline transition-colors duration-200">
                        política de privacidad
                      </Link>
                    </label>
                  </div>

                  {/* Sign up button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !acceptTerms}
                    className="w-full relative group/button mt-5"
                  >
                    {/* Button glow effect - reduced intensity */}
                    <div className="absolute inset-0 bg-[var(--rojo-brillante)]/30 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />

                    <div className="relative overflow-hidden bg-[var(--rojo-brillante)] text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center hover:bg-[var(--rojo-brillante)]/90">
                      {/* Button background animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -z-10"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                        style={{
                          opacity: isLoading ? 1 : 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      />

                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1 text-sm font-medium"
                          >
                            Crear Cuenta
                            <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  {/* Minimal Divider */}
                  <div className="relative mt-2 mb-5 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                {/* Sign in link */}
                <motion.p
                  className="text-center text-xs text-white/60 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    href="/auth/login"
                    className="relative inline-block group/login"
                  >
                    <span className="relative z-10 text-white group-hover/login:text-white/70 transition-colors duration-300 font-medium">
                      Inicia sesión
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/login:w-full transition-all duration-300" />
                  </Link>
                </motion.p>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Confirmation Screen - Mostrado cuando success = true */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-br from-[var(--azul-petroleo)]/95 to-[var(--azul-petroleo)]/85 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center z-50"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4"
              >
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white text-center mb-2"
              >
                ¡Cuenta creada exitosamente!
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-center text-sm mb-6"
              >
                Se ha enviado un correo de confirmación a:
              </motion.p>

              {/* Email Display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 mb-6 w-full text-center"
              >
                <p className="text-white font-medium text-sm break-all">{email}</p>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2 text-white/70 text-sm mb-8 text-center"
              >
                <p>Por favor revisa tu correo para confirmar tu cuenta.</p>
                <p className="text-white/60 text-xs">Si no lo ves, verifica tu carpeta de spam.</p>
              </motion.div>

              {/* Resend Message */}
              {resendMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs mb-4 w-full"
                >
                  {resendMessage}
                </motion.div>
              )}

              {/* Resend Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 border border-white/20 rounded-lg text-white text-sm font-medium transition-colors duration-300 mb-4"
              >
                {resendLoading ? "Enviando..." : "Reenviar correo"}
              </motion.button>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-white/60"
              >
                <Link
                  href="/auth/login"
                  className="text-white/80 hover:text-white transition-colors underline"
                >
                  Volver a iniciar sesión
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
