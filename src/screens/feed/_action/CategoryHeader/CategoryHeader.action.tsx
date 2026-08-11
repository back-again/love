'use client';

import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { categoriesQueryOptions } from '../../_lib/getCategories.lib';
import { useCategoryStore } from '../../_state/useCategoryStore';
import { CategoryChip } from '../../_component/CategoryChip';

export function CategoryHeaderAction() {
  const { data: categoryData } = useSuspenseQuery(categoriesQueryOptions);
  const selectedCategory = useCategoryStore(state => state.selectedCategory);
  const setSelectedCategory = useCategoryStore(state => state.setSelectedCategory);

  const categories = ['전체', ...categoryData.map(c => c.name)];

  return (
    <>
      {categories.map(category => (
        <CategoryChip
          key={category}
          category={category}
          isSelected={selectedCategory === category}
          onPress={() => setSelectedCategory(category)}
        />
      ))}
    </>
  );
}
