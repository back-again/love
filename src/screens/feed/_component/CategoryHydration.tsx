import React, { ReactNode, useState, useEffect } from 'react';
import { HydrationBoundary, QueryClient, dehydrate, DehydratedState } from '@tanstack/react-query';
import { categoriesQueryOptions } from '../_lib/getCategories.lib';
import { CategoryHeaderFallback } from './CategoryHeaderFallback';

interface CategoryHydrationProps {
  children: ReactNode;
}

export function CategoryHydration({ children }: CategoryHydrationProps) {
  const [dehydratedState, setDehydratedState] = useState<DehydratedState | null>(null);

  useEffect(() => {
    let isMounted = true;
    const queryClient = new QueryClient();

    queryClient.prefetchQuery(categoriesQueryOptions).then(() => {
      if (isMounted) {
        setDehydratedState(dehydrate(queryClient));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!dehydratedState) {
    return <CategoryHeaderFallback />;
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      {children}
    </HydrationBoundary>
  );
}
