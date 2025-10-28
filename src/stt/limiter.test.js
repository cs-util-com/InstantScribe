describe('createLimiter', () => {
  const { createLimiter } = jest.requireActual('./limiter.js');

  test('limits concurrent executions', async () => {
    const limit = createLimiter(2);
    const activeCounts = [];
    let active = 0;

    const tasks = new Array(5).fill(null).map((_, index) =>
      limit(async () => {
        active += 1;
        activeCounts.push(active);
        await new Promise((resolve) => setTimeout(resolve, 5 - index));
        active -= 1;
        return index;
      })
    );

    const results = await Promise.all(tasks);
    expect(results.sort()).toEqual([0, 1, 2, 3, 4]);
    expect(Math.max(...activeCounts)).toBeLessThanOrEqual(2);
  });
});
