import { supabase } from '@/api/supabase';
import { CategoryItem } from '../_model/category.model';

export const categoriesQueryKey = ['categories'] as const;

export async function getCategoriesLib(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, order_index')
      .order('order_index', { ascending: true });

    if (error || !data) {
      console.warn('getCategoriesLib error:', error?.message);
      return [];
    }

    return data as CategoryItem[];
  } catch (err) {
    console.warn('getCategoriesLib error:', err);
    return [];
  }
}

export const categoriesQueryOptions = {
  queryKey: categoriesQueryKey,
  queryFn: getCategoriesLib,
  staleTime: Infinity,
  gcTime: Infinity,
};
