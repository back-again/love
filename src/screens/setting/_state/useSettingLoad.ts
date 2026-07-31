import { useSettingStore } from './useSettingStore';

export function useSettingLoad(onClose: () => void) {
  const reset = useSettingStore(state => state.reset);

  const handleClose = () => {
    reset();
    onClose();
  };

  return { handleClose };
}
