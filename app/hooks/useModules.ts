'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/utils/supabase';
import { Database } from '@/app/utils/supabase';

type Module = Database['public']['Tables']['modules']['Row'];
type ModuleStats = Database['public']['Views']['module_stats']['Row'];

export interface ModuleWithStats extends Module {
  enrolled_students?: number;
  avg_progress?: number;
  completed_students?: number;
}

export function useModules() {
  const [modules, setModules] = useState<ModuleWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch modules with stats
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          module_stats!inner(
            enrolled_students,
            avg_progress,
            completed_students
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching modules:', error);
        setError('Error al cargar los módulos');
        return;
      }

      // Transform data to include stats
      const modulesWithStats: ModuleWithStats[] = data?.map(module => ({
        ...module,
        enrolled_students: module.module_stats?.enrolled_students || 0,
        avg_progress: module.module_stats?.avg_progress || 0,
        completed_students: module.module_stats?.completed_students || 0,
      })) || [];

      setModules(modulesWithStats);
    } catch (err) {
      console.error('Exception fetching modules:', err);
      setError('Error inesperado al cargar los módulos');
    } finally {
      setLoading(false);
    }
  };

  const filterModules = (searchTerm: string, areaFilter: string, levelFilter: string) => {
    return modules.filter(module => {
      const matchesSearch = !searchTerm ||
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea = !areaFilter || module.area === areaFilter;
      const matchesLevel = !levelFilter || module.level === levelFilter;

      return matchesSearch && matchesArea && matchesLevel;
    });
  };

  return {
    modules,
    loading,
    error,
    refetch: fetchModules,
    filterModules,
  };
}

export function useModule(moduleId: string) {
  const [module, setModule] = useState<ModuleWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          module_stats!inner(
            enrolled_students,
            avg_progress,
            completed_students
          )
        `)
        .eq('id', moduleId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching module:', error);
        setError('Error al cargar el módulo');
        return;
      }

      const moduleWithStats: ModuleWithStats = {
        ...data,
        enrolled_students: data.module_stats?.enrolled_students || 0,
        avg_progress: data.module_stats?.avg_progress || 0,
        completed_students: data.module_stats?.completed_students || 0,
      };

      setModule(moduleWithStats);
    } catch (err) {
      console.error('Exception fetching module:', err);
      setError('Error inesperado al cargar el módulo');
    } finally {
      setLoading(false);
    }
  };

  return {
    module,
    loading,
    error,
    refetch: fetchModule,
  };
}