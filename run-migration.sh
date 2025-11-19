#!/bin/bash

# Script para ejecutar la migración en Supabase
# Asegúrate de tener las variables de entorno configuradas:
# SUPABASE_URL y SUPABASE_ANON_KEY (o SUPABASE_SERVICE_ROLE_KEY para migraciones)

echo "=========================================="
echo "Aplicando migración de settings a Supabase"
echo "=========================================="

# Verifica que tengas Supabase CLI instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no está instalado"
    echo "Instálalo con: npm install -g supabase"
    exit 1
fi

echo ""
echo "Ejecutando: supabase db push"
echo ""

supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migración completada exitosamente"
else
    echo ""
    echo "❌ Error al ejecutar la migración"
    echo ""
    echo "Alternativa: Ejecuta manualmente en Supabase Dashboard"
    echo "1. Ve a: https://app.supabase.com"
    echo "2. SQL Editor"
    echo "3. Copia el contenido de: supabase/migrations/20251119_create_profiles_and_settings.sql"
    echo "4. Pega y ejecuta"
    exit 1
fi
