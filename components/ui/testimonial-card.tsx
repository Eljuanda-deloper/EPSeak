import { cn } from "@/lib/utils"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        "flex flex-col rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white",
        "p-6 sm:p-8",
        "hover:border-slate-300 hover:shadow-lg",
        "w-[320px] sm:w-[340px]",
        "transition-all duration-300",
        "flex-shrink-0",
        href && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-shrink-0">
          <img 
            src={author.avatar} 
            alt={author.name}
            className="h-14 w-14 rounded-full object-cover border-2 border-slate-200 shadow-md"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E'
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-base font-semibold text-gray-900 leading-none">
            {author.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="text-base text-gray-700 leading-relaxed font-medium">
        "{text}"
      </p>
    </Card>
  )
}
