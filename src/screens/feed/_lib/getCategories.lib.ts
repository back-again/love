import { supabase } from '@/api/supabase';
import { CategoryItem } from '../_model/category.model';

export const categoriesQueryKey = ['categories'] as const;

export async function getCategoriesLib(): Promise<CategoryItem[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, order_index')
    .order('order_index', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as CategoryItem[];
}

export const categoriesQueryOptions = {
  queryKey: categoriesQueryKey,
  queryFn: getCategoriesLib,
  staleTime: Infinity,
  gcTime: Infinity,
};
