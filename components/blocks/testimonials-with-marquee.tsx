import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8",
      className
    )}>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          animation: marquee 40s linear infinite;
          width: fit-content;
        }
        
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center sm:gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <h2 className="max-w-[720px] text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:leading-tight text-gray-900">
            {title}
          </h2>
          <p className="max-w-[600px] text-base sm:text-lg font-medium text-gray-600">
            {description}
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden">
          {/* Marquee Wrapper */}
          <div className="overflow-x-hidden">
            <div className="marquee-track">
              {/* Original testimonials */}
              {testimonials.map((testimonial, i) => (
                <div key={`original-${i}`}>
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
              
              {/* Duplicated testimonials for seamless loop */}
              {testimonials.map((testimonial, i) => (
                <div key={`duplicate-${i}`}>
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays for fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent" />
        </div>
      </div>
    </section>
  )
}
