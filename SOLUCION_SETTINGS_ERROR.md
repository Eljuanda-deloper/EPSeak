# 🔧 Solución del Error en Settings

## Error Detectado
```
Error al actualizar perfil
Status: 500 (Internal Server Error)
```

## Causa
Las tablas `profiles` y `user_settings` no existen o están mal configuradas en Supabase.

## Solución

### Opción 1: Automática (Recomendado)

#### Si tienes Supabase CLI instalado:
```bash
cd /home/juanda/epseak
npm install -g supabase  # Si no lo tienes
supabase db push
```

#### O ejecuta el script:
```bash
bash run-migration.sh
```

### Opción 2: Manual en Supabase Dashboard

1. **Abre Supabase Dashboard**
   - Ve a https://app.supabase.com
   - Selecciona tu proyecto EPSeak

2. **Accede al SQL Editor**
   - En el menú izquierdo, encuentra "SQL Editor"
   - Haz click en "New Query"

3. **Copia y ejecuta el SQL**
   - Abre el archivo: `supabase/migrations/20251119_create_profiles_and_settings.sql`
   - Copia TODO el contenido
   - Pégalo en el SQL Editor
   - Haz click en "Run" o presiona `Ctrl+Enter`

4. **Verifica el resultado**
   - Deberías ver un mensaje: "Query successful"
   - Aparecerán 2 tablas nuevas:
     - `public.profiles`
     - `public.user_settings`

### Opción 3: Con psql (si tienes acceso directo)

```bash
# Primero obtén las credenciales de Supabase
psql "postgresql://[user]:[password]@[host]:[port]/postgres" \
  -f supabase/migrations/20251119_create_profiles_and_settings.sql
```

## ¿Qué hace la migración?

✅ Crea tabla `profiles` con campos:
  - `id` (UUID, referencia a auth.users)
  - `full_name`
  - `avatar_url`
  - `bio`
  - `phone`
  - `timezone`
  - `language`
  - `created_at` y `updated_at`

✅ Crea tabla `user_settings` con campos:
  - `user_id` (UUID, referencia a auth.users)
  - `notifications` (JSONB)
  - `privacy` (JSONB)
  - `theme` (JSONB)
  - `created_at` y `updated_at`

✅ Configura Row Level Security (RLS) para ambas tablas

✅ Crea índices para mejor rendimiento

## Después de ejecutar la migración

1. **Recarga el navegador**
   ```
   Ctrl+R (o Cmd+R en Mac)
   ```

2. **Intenta guardar el perfil nuevamente**
   - Vuelve a Settings
   - Modifica algún campo
   - Haz click en "Save Changes"

3. **Si aún hay error**, verifica:
   - ¿Se ejecutó la migración sin errores?
   - ¿Estás autenticado en Supabase?
   - ¿Las políticas RLS están correctas?

## Troubleshooting

### Error: "permission denied"
- Asegúrate de haber ejecutado la parte de RLS
- O desactiva RLS temporalmente en Supabase Dashboard:
  - Ve a Authentication → Policies
  - Desactiva RLS en ambas tablas

### Error: "relation does not exist"
- Significa que las tablas no se crearon
- Intenta nuevamente con la migración

### Logs detallados
Los endpoints ahora muestran logs detallados. Revisa:
- Console del navegador (F12)
- Terminal del servidor (npm run dev)

---

¿Necesitas ayuda? Avísame cuando hayas ejecutado la migración y el resultado.
