'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { categoriesQueryOptions } from '../../_lib/getCategories.lib';
import { useFeedStore } from '../../_state/useFeedStore';
import { CategoryChip } from '../../_component/CategoryChip';

export function CategoryHeaderAction() {
  const { data: categoryData = [] } = useQuery(categoriesQueryOptions);

  const { selectedCategoryId, setSelectedCategoryId } = useFeedStore(
    useShallow(state => ({
      selectedCategoryId: state.selectedCategoryId,
      setSelectedCategoryId: state.setSelectedCategoryId,
    })),
  );

  const categories: { id: string | null; name: string }[] = [
    { id: null, name: '전체' },
    { id: 'hot', name: '인기' },
    ...categoryData.map(c => ({ id: c.id, name: c.name })),
  ];

  return (
    <>
      {categories.map(cat => (
        <CategoryChip
          key={cat.id ?? 'all'}
          category={cat.name}
          isSelected={selectedCategoryId === cat.id}
          onPress={() => setSelectedCategoryId(cat.id)}
          variant="communityGlass"
        />
      ))}
    </>
  );
}
