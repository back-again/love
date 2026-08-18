'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesQueryOptions } from '../../_lib/getCategories.lib';
import { useCategoryStore } from '../../_state/useCategoryStore';
import { CategoryChip } from '../../_component/CategoryChip';

export function CategoryHeaderAction() {
  const { data: categoryData = [] } = useQuery(categoriesQueryOptions);

  const selectedCategory = useCategoryStore(state => state.selectedCategory);
  const setSelectedCategory = useCategoryStore(
    state => state.setSelectedCategory,
  );

  const categories = [
    '전체',
    '인기',
    ...categoryData
      .map(c => c.name)
      .filter(c => c !== '🔥 인기' && c !== '인기'),
  ];

  return (
    <>
      {categories.map(category => (
        <CategoryChip
          key={category}
          category={category}
          isSelected={selectedCategory === category}
          onPress={() => setSelectedCategory(category)}
          variant="communityGlass"
        />
      ))}
    </>
  );
}
