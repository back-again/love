import { supabase } from '@/api/supabase';
import { CategoryItem } from '../_model/category.model';

export const categoriesQueryKey = ['categories'] as const;

const DEFAULT_CATEGORY_ITEMS: CategoryItem[] = [
  { id: '1', name: '고민', order_index: 1 },
  { id: '2', name: '썸/연애', order_index: 2 },
  { id: '3', name: '이별/재회', order_index: 3 },
  { id: '4', name: '짝사랑', order_index: 4 },
  { id: '5', name: '결혼/시댁', order_index: 5 },
  { id: '6', name: '기타', order_index: 6 },
];

export async function getCategoriesLib(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, order_index')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORY_ITEMS;
    }

    return data as CategoryItem[];
  } catch (err) {
    console.warn('getCategoriesLib fallback error:', err);
    return DEFAULT_CATEGORY_ITEMS;
  }
}

export const categoriesQueryOptions = {
  queryKey: categoriesQueryKey,
  queryFn: getCategoriesLib,
  staleTime: Infinity,
  gcTime: Infinity,
};
