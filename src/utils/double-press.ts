import { useRef } from 'react';

export function useDoublePress(onDoublePress: () => void) {
  const delayTime = 300;
  let lastTime: number = new Date().getTime();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const firstPress = useRef(true);

  function singlePress(now: number) {
    firstPress.current = false;
    timer.current = setTimeout(() => {
      firstPress.current = true;
    }, delayTime);
    lastTime = now;
  }

  function doublePress(now: number) {
    if (now - lastTime < delayTime) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      onDoublePress();
      firstPress.current = true;
    }
  }

  function onPress() {
    const now = new Date().getTime();
    if (firstPress.current) {
      singlePress(now);
    } else {
      doublePress(now);
    }
  }

  return { onPress };
}
