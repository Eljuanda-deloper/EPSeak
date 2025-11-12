# 🔧 Componentes y Patrones Responsivos Reutilizables

Este documento contiene componentes y patrones que pueden reutilizarse en futuras páginas del dashboard.

---

## 📱 Patrón 1: Card Responsiva

### Uso
```tsx
<ResponsiveCard title="Título" description="Descripción">
  {/* Contenido */}
</ResponsiveCard>
```

### Implementación
```tsx
interface ResponsiveCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ResponsiveCard({
  title,
  description,
  children,
  className = "",
  onClick
}: ResponsiveCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`
        bg-white rounded-lg sm:rounded-xl md:rounded-2xl
        shadow-sm md:shadow-md hover:shadow-lg
        border border-gray-100
        p-3 sm:p-4 md:p-6
        cursor-pointer transition-all
        ${className}
      `}
      onClick={onClick}
    >
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-gray-600 mb-3 md:mb-4">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}
```

---

## 📊 Patrón 2: Stats Grid

### Uso
```tsx
<StatsGrid
  stats={[
    { label: 'Active Courses', value: 5, icon: BookOpen, color: 'blue' },
    { label: 'Completed', value: 12, icon: Trophy, color: 'green' },
    { label: 'Total Hours', value: '120h', icon: Clock, color: 'purple' }
  ]}
/>
```

### Implementación
```tsx
interface Stat {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  const colorMap = {
    blue: { bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', icon: 'text-blue-400', border: 'border-blue-200' },
    green: { bg: 'from-green-50 to-green-100', text: 'text-green-700', icon: 'text-green-400', border: 'border-green-200' },
    purple: { bg: 'from-purple-50 to-purple-100', text: 'text-purple-700', icon: 'text-purple-400', border: 'border-purple-200' },
    orange: { bg: 'from-orange-50 to-orange-100', text: 'text-orange-700', icon: 'text-orange-400', border: 'border-orange-200' }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xs:gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat, idx) => {
        const colors = colorMap[stat.color];
        const Icon = stat.icon;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`
              bg-gradient-to-br ${colors.bg}
              rounded-lg sm:rounded-xl
              xs:p-2 sm:p-3 md:p-4
              border ${colors.border}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium ${colors.text}`}>
                  {stat.label}
                </p>
                <p className="text-lg md:text-xl font-bold mt-1 md:mt-2 text-gray-900">
                  {stat.value}
                </p>
              </div>
              <Icon className={`w-6 md:w-8 h-6 md:h-8 ${colors.icon}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

---

## 🔍 Patrón 3: Filtros Responsivos

### Uso
```tsx
<ResponsiveFilters
  onSearch={(term) => setSearchTerm(term)}
  filters={[
    { label: 'Area', options: ['All', 'Medical', 'Legal'], onSelect: setArea },
    { label: 'Level', options: ['All', 'Beginner', 'Advanced'], onSelect: setLevel }
  ]}
/>
```

### Implementación
```tsx
interface FilterConfig {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
}

export function ResponsiveFilters({
  onSearch,
  filters
}: {
  onSearch: (term: string) => void;
  filters: FilterConfig[];
}) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-3 md:py-4
                  border border-gray-200 rounded-lg md:rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-sm md:text-base
                  placeholder-gray-500
                "
              />
            </div>
          </div>

          {/* Filters */}
          {filters.map((filter, idx) => (
            <div key={idx} className="w-full lg:w-48">
              <select
                onChange={(e) => filter.onSelect(e.target.value)}
                className="
                  w-full px-4 py-3 md:py-4
                  border border-gray-200 rounded-lg md:rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  bg-white text-gray-900 text-sm md:text-base
                "
              >
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 📝 Patrón 4: Form Input Responsivo

### Uso
```tsx
<ResponsiveInput
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText="We'll never share your email"
/>
```

### Implementación
```tsx
interface ResponsiveInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
}

export function ResponsiveInput({
  label,
  type = "text",
  value,
  onChange,
  error = false,
  errorMessage,
  helperText,
  placeholder,
  required = false
}: ResponsiveInputProps) {
  return (
    <div className="w-full">
      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-3 md:px-4 py-2 md:py-3
          border rounded-lg md:rounded-xl
          text-sm md:text-base
          focus:ring-2 focus:border-transparent
          transition-all
          ${error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
          }
        `}
      />

      {error && errorMessage && (
        <p className="text-xs md:text-sm text-red-500 mt-1">{errorMessage}</p>
      )}

      {helperText && !error && (
        <p className="text-xs md:text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
```

---

## 🎯 Patrón 5: Tab Navigation Responsivo

### Uso
```tsx
<ResponsiveTabs
  tabs={[
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### Implementación
```tsx
interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
}

export function ResponsiveTabs({
  tabs,
  activeTab,
  onTabChange
}: {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <div className="border-b border-gray-200 flex gap-4 md:gap-8 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              pb-4 px-2 md:px-4
              text-xs md:text-sm lg:text-base font-medium
              flex items-center gap-1 md:gap-2
              relative transition-colors
              whitespace-nowrap
              ${activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {Icon && <Icon className="w-4 md:w-5 h-4 md:h-5" />}
            {tab.label}

            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

---

## 🔘 Patrón 6: Toggle Switch Responsivo

### Uso
```tsx
<ResponsiveToggle
  label="Enable Notifications"
  description="Receive push notifications"
  checked={enabled}
  onChange={setEnabled}
/>
```

### Implementación
```tsx
export function ResponsiveToggle({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div>
        <h3 className="text-sm md:text-base font-medium text-gray-900">
          {label}
        </h3>
        {description && (
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex
          h-8 w-14
          items-center rounded-full
          transition-colors
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <motion.span
          layout
          className="
            inline-block h-6 w-6
            transform rounded-full
            bg-white transition-transform
          "
          style={{
            x: checked ? 28 : 4
          }}
        />
      </button>
    </div>
  );
}
```

---

## 📱 Patrón 7: Mobile-First Grid

### Uso
```tsx
<ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
  {items.map(item => <Item key={item.id} {...item} />)}
</ResponsiveGrid>
```

### Implementación
```tsx
interface GridColumns {
  mobile: number;
  tablet: number;
  desktop: number;
}

export function ResponsiveGrid({
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  children
}: {
  columns?: GridColumns;
  gap?: number;
  children: React.ReactNode;
}) {
  const gapClass = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }[gap] || 'gap-4';

  const colsClass = `
    grid-cols-${columns.mobile}
    md:grid-cols-${columns.tablet}
    lg:grid-cols-${columns.desktop}
  `;

  return (
    <div className={`grid ${colsClass} ${gapClass}`}>
      {children}
    </div>
  );
}
```

---

## 🧪 Patrón 8: Responsive Typography

### Uso
```tsx
<ResponsiveText as="h1" size="large">
  Welcome back
</ResponsiveText>

<ResponsiveText as="p" size="small">
  Continue your learning journey
</ResponsiveText>
```

### Implementación
```tsx
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'large' | 'xlarge';
type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

const sizeMap = {
  xs: 'text-xs md:text-xs lg:text-xs',
  sm: 'text-xs md:text-sm lg:text-sm',
  base: 'text-sm md:text-base lg:text-base',
  lg: 'text-base md:text-lg lg:text-lg',
  xl: 'text-lg md:text-xl lg:text-xl',
  large: 'text-xl md:text-2xl lg:text-4xl',
  xlarge: 'text-2xl md:text-4xl lg:text-5xl'
};

export function ResponsiveText({
  as: Tag = 'p',
  size = 'base',
  weight = 'normal',
  children,
  className = ''
}: {
  as?: TextTag;
  size?: TextSize;
  weight?: 'light' | 'normal' | 'semibold' | 'bold';
  children: React.ReactNode;
  className?: string;
}) {
  const weightMap = {
    light: 'font-light',
    normal: 'font-normal',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <Tag className={`${sizeMap[size]} ${weightMap[weight]} ${className}`}>
      {children}
    </Tag>
  );
}
```

---

## 🔐 Patrón 9: Responsive Modal

### Uso
```tsx
<ResponsiveModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
  <div className="flex gap-2">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</ResponsiveModal>
```

### Implementación
```tsx
export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white rounded-lg md:rounded-xl
              shadow-xl max-w-md w-full
              p-4 md:p-6
              max-h-[90vh] overflow-y-auto
            "
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 md:w-6 h-5 md:h-6" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 🚀 Patrón 10: Responsive Button

### Uso
```tsx
<ResponsiveButton
  variant="primary"
  size="md"
  icon={<Save />}
>
  Save Changes
</ResponsiveButton>

<ResponsiveButton
  variant="secondary"
  size="sm"
>
  Cancel
</ResponsiveButton>
```

### Implementación
```tsx
interface ResponsiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const variantMap = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-900'
};

const sizeMap = {
  sm: 'px-3 md:px-4 py-2 text-xs md:text-sm min-h-9 md:min-h-10',
  md: 'px-4 md:px-6 py-2 md:py-3 text-sm md:text-base min-h-11 md:min-h-12',
  lg: 'px-6 md:px-8 py-3 md:py-4 text-base md:text-lg min-h-12 md:min-h-14'
};

export function ResponsiveButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  fullWidth = false
}: ResponsiveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg md:rounded-xl
        font-medium
        flex items-center justify-center gap-2
        transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        focus:ring-2 focus:ring-offset-2
        focus:ring-blue-500
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
```

---

## 📦 Exportar Todos los Componentes

Crea un archivo `app/components/mobile/index.ts`:

```tsx
export { ResponsiveCard } from './ResponsiveCard';
export { StatsGrid } from './StatsGrid';
export { ResponsiveFilters } from './ResponsiveFilters';
export { ResponsiveInput } from './ResponsiveInput';
export { ResponsiveTabs } from './ResponsiveTabs';
export { ResponsiveToggle } from './ResponsiveToggle';
export { ResponsiveGrid } from './ResponsiveGrid';
export { ResponsiveText } from './ResponsiveText';
export { ResponsiveModal } from './ResponsiveModal';
export { ResponsiveButton } from './ResponsiveButton';
```

---

## 💡 Uso en Nuevas Páginas

```tsx
import {
  ResponsiveCard,
  StatsGrid,
  ResponsiveFilters,
  ResponsiveButton
} from '@/app/components/mobile';

export default function NewPage() {
  return (
    <div className="space-y-6">
      <StatsGrid stats={[...]} />
      <ResponsiveFilters {...} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <ResponsiveCard key={item.id} {...item}>
            {/* Content */}
          </ResponsiveCard>
        ))}
      </div>
      <ResponsiveButton variant="primary">
        Action
      </ResponsiveButton>
    </div>
  );
}
```

