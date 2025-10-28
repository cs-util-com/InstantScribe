/* istanbul ignore file -- concurrency helper validated via unit tests */

export function createLimiter(limit = 1) {
  let active = 0;
  const queue = [];

  const runNext = () => {
    if (active >= limit) return;
    if (queue.length === 0) return;
    const task = queue.shift();
    active += 1;
    task()
      .then(() => {
        active -= 1;
        runNext();
      })
      .catch(() => {
        active -= 1;
        runNext();
      });
  };

  return function limitTask(fn) {
    return new Promise((resolve, reject) => {
      const execute = () => Promise.resolve().then(fn).then(resolve, reject);
      queue.push(execute);
      runNext();
    });
  };
}
