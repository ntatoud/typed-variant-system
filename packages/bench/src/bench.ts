const BATCH = 10_000;

export function bench(label: string, fn: () => void, iterations = 200): number {
  for (let i = 0; i < BATCH * 5; i++) fn();

  const times: number[] = [];
  for (let iter = 0; iter < iterations; iter++) {
    const t0 = performance.now();
    for (let i = 0; i < BATCH; i++) fn();
    times.push((performance.now() - t0) / BATCH);
  }

  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length * 0.5)]!;
  const p99 = times[Math.floor(times.length * 0.99)]!;
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const opsM = (1 / avg / 1e6) * 1e3;

  process.stdout.write(
    `  ${label.padEnd(12)} avg=${(avg * 1e6).toFixed(1).padStart(6)}ns  p50=${(p50 * 1e6).toFixed(1).padStart(6)}ns  p99=${(p99 * 1e6).toFixed(1).padStart(6)}ns  ${opsM.toFixed(1).padStart(5)} M ops/s\n`,
  );

  return avg;
}

export function compare(
  title: string,
  aFn: () => void,
  bFn: () => void,
  aLabel: string,
  bLabel: string,
) {
  console.log(`\n── ${title} ──`);
  const aAvg = bench(aLabel, aFn);
  const bAvg = bench(bLabel, bFn);
  const ratio = aAvg / bAvg;
  console.log(
    `  → ${bLabel} is ${ratio >= 1 ? ratio.toFixed(2) + "x faster" : (1 / ratio).toFixed(2) + "x slower"} than ${aLabel}`,
  );
}
