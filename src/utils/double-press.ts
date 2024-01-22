import { useEffect, useRef } from 'react';

export function useDoublePress(onDoublePress: () => void) {
  let delayTime = 300;
  let lastTime: number = new Date().getTime();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const firstPress = useRef(true);

  const singlePress = (now: number) => {
    firstPress.current = false;
    timer.current = setTimeout(() => {
      firstPress.current = true;
    }, delayTime);
    lastTime = now;
  };

  const doublePress = (now: number) => {
    if (now - lastTime < delayTime) {
      timer.current && clearTimeout(timer.current);
      onDoublePress();
      firstPress.current = true;
    }
  };

  const onPress = () => {
    let now = new Date().getTime();
    firstPress.current ? singlePress(now) : doublePress(now);
  };

  return { onPress };
}
