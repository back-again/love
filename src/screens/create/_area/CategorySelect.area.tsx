import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { CategoryChip } from '../../feed/_component/CategoryChip';
import { categoriesQueryOptions } from '../../feed/_lib/getCategories.lib';

const DEFAULT_CATEGORIES = ['고민', '썸/연애', '이별/재회', '짝사랑', '결혼/시댁', '기타'];

export function CategorySelectArea() {
  const { data: categoryData } = useQuery(categoriesQueryOptions);
  const { category, setCategory } = useCreateForm(
    useShallow(state => ({
      category: state.category,
      setCategory: state.setCategory,
    }))
  );

  const categories = useMemo(() => {
    if (categoryData && categoryData.length > 0) {
      return categoryData
        .map(c => c.name)
        .filter(name => name !== '전체' && name !== '인기' && name !== '🔥 인기');
    }
    return DEFAULT_CATEGORIES;
  }, [categoryData]);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category, setCategory]);

  return (
    <View style={styles.createSection}>
      <Text style={styles.createSectionTitle}>
        카테고리를 선택해 주세요
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScrollContainer}
      >
        {categories.map(item => (
          <CategoryChip
            key={item}
            category={item}
            isSelected={category === item}
            onPress={() => setCategory(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    marginBottom: 28,
  },
  createSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  requiredAsterisk: {
    color: '#FF5D7B',
    fontWeight: '800',
  },
  chipScrollContainer: {
    gap: 8,
    paddingRight: 10,
  },
});
