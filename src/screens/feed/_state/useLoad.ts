import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useLoad() {
  const [viewportHeight, setViewportHeight] = useState(
    Dimensions.get('window').height,
  );

  useEffect(() => {
    const onChange = ({ window }: { window: any }) => {
      setViewportHeight(window.height);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const feedPageHeight = Math.max(540, viewportHeight);

  return {
    viewportHeight,
    feedPageHeight,
  };
}
