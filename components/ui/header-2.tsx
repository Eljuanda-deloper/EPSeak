'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import Logo from '@/app/imagenes/logoEspeak.png';
import { useAuth } from '@/app/contexts/AuthContext';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const { user, signOut, loading } = useAuth();

	const links = [
		{
			label: 'Inicio',
			href: '#inicio',
		},
		{
			label: 'Quiénes somos',
			href: '#quienes-somos',
		},
		{
			label: 'Testimonios',
			href: '#testimonios',
		},
		{
			label: 'Contacto',
			href: '#contacto',
		},
	];

	React.useEffect(() => {
		if (open) {
			// Disable scroll
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable scroll
			document.body.style.overflow = '';
		}

		// Cleanup when component unmounts (important for Next.js)
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	const handleLinkClick = (href: string) => {
		const sectionId = href.slice(1);
		const element = document.getElementById(sectionId);
		if (element) {
			const headerOffset = 80;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
		setOpen(false);
	};

	return (
		<motion.header
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-full border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
				{
					'bg-white/95 supports-[backdrop-filter]:bg-white/50 border-gray-100 backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow md:mx-4':
						scrolled && !open,
					'bg-white/90': open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
					{
						'md:px-2': scrolled,
					},
				)}
			>
				<Link href="/" className="flex items-center gap-2">
					<Image
						src={Logo}
						alt="EPSeak logo"
						width={80}
						height={20}
						className="h-4 w-auto md:h-6 lg:h-8"
						priority
					/>
				</Link>
				
			<div className="hidden items-center gap-2 md:flex">
				{links.map((link, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05, duration: 0.3 }}
					>
						<button
							onClick={() => handleLinkClick(link.href)}
							className={buttonVariants({ 
								variant: 'ghost', 
								className: 'text-sm transition-all duration-300 hover:scale-105' 
							})}
						>
							{link.label}
						</button>
					</motion.div>
				))}
				<motion.div 
					className="ml-2 flex items-center gap-2"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2, duration: 0.3 }}
				>
					{loading ? (
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-azul-petroleo"></div>
					) : user ? (
						<>
							<Link href="/dashboard">
								<Button variant="secondary">Dashboard</Button>
							</Link>
							<Link href="/profile">
								<Button variant="secondary">Perfil</Button>
							</Link>
							<Button onClick={() => signOut()}>Cerrar Sesión</Button>
						</>
					) : (
						<>
							<Link href="/auth/login">
								<Button variant="secondary">Iniciar Sesión</Button>
							</Link>
							<Link href="/auth/register">
								<Button>Registrarse</Button>
							</Link>
						</>
					)}
				</motion.div>
			</div>				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden border-azul-petroleo/20 text-azul-petroleo hover:bg-azul-petroleo/5"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			<AnimatePresence mode="wait">
				{open && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="bg-white/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y border-gray-100 md:hidden"
					>
						<motion.div
							className="flex h-full w-full flex-col justify-between gap-y-2 p-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<div className="grid gap-y-2">
								{links.map((link, i) => (
									<motion.button
										key={link.label}
										onClick={() => handleLinkClick(link.href)}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ delay: i * 0.05, duration: 0.2 }}
										className={buttonVariants({
											variant: 'ghost',
											className: 'justify-start text-left transition-all duration-300 hover:translate-x-2',
										})}
									>
										{link.label}
									</motion.button>
								))}
							</div>
							<motion.div 
								className="flex flex-col gap-2 border-t border-gray-100 pt-4"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.2 }}
							>
								{loading ? (
									<div className="flex justify-center py-4">
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-azul-petroleo"></div>
									</div>
								) : user ? (
									<>
										<Link href="/dashboard" onClick={() => setOpen(false)}>
											<Button variant="secondary" className="w-full">
												Dashboard
											</Button>
										</Link>
										<Link href="/profile" onClick={() => setOpen(false)}>
											<Button variant="secondary" className="w-full">
												Perfil
											</Button>
										</Link>
										<Button onClick={() => { signOut(); setOpen(false); }} className="w-full">
											Cerrar Sesión
										</Button>
									</>
								) : (
									<>
										<Link href="/auth/login" onClick={() => setOpen(false)}>
											<Button variant="secondary" className="w-full">
												Iniciar Sesión
											</Button>
										</Link>
										<Link href="/auth/register" onClick={() => setOpen(false)}>
											<Button className="w-full">
												Registrarse
											</Button>
										</Link>
									</>
								)}
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
