type ReturnValue<T extends any[]> = {
  run(...args: T): any;
  cancel(): void;
};

export function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  wait = 500,
  immediate = false
): ReturnValue<T> {
  let timer: any = null;
  let timestamp: number;
  let params: T;

  function later() {
    // 现在和上一次时间戳比较
    const diff: number = new Date().getTime() - timestamp;
    // 如果当前间隔时间少于设定时间且大于0就重新设置定时器
    if (diff >= 0 && diff < wait) {
      timer = setTimeout(later, wait - diff);
    } else {
      // 否则的话就是时间到了执行回调函数
      timer = null;
      if (!immediate) {
        fn(...params);
      }
    }
  }

  function run(...args: T) {
    params = args;
    // 获得时间戳
    timestamp = new Date().getTime();

    //如果定时器不存在且立即执行函数
    const callNow: boolean = immediate && !timer;

    if (!timer) timer = setTimeout(later, wait);

    if (callNow) {
      fn(...params);
    }
  }

  function cancel() {
    if (timer) {
      clearTimeout(timer);
    }
  }

  return {
    run,
    cancel,
  };
}
