'use client';

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { CategoryChip } from '../../feed/_component/CategoryChip';
import { categoriesQueryOptions } from '../../feed/_lib/getCategories.lib';

export function CategorySelectAction() {
  const { data: categoryData } = useQuery(categoriesQueryOptions);
  const { category, setCategory } = useCreateForm(
    useShallow(state => ({
      category: state.category,
      setCategory: state.setCategory,
    })),
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipScrollContainer}
    >
      {(categoryData || []).map(item => (
        <CategoryChip
          key={item.id}
          category={item.name}
          isSelected={category === item.id}
          onPress={() => setCategory(item.id)}
          variant="pink"
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chipScrollContainer: {
    gap: 8,
    paddingRight: 10,
  },
});
