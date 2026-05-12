// utils/loadingBarController.ts
import type { LoadingBarRef } from 'react-top-loading-bar';

let loadingBarRef: LoadingBarRef | null = null;

export const setLoadingBar = (ref: LoadingBarRef) => {
  loadingBarRef = ref;
};

export const startLoading = () => {
  loadingBarRef?.continuousStart?.();
};

export const completeLoading = () => {
  loadingBarRef?.complete?.();
};

export const increaseLoading = (value = 10) => {
  loadingBarRef?.staticStart?.(value);
};

export const decreaseLoading = (value = 10) => {
  loadingBarRef?.staticStart?.(-value);
};
