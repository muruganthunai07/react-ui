function getPaginationRange(
  current: number,
  total: number
): (number | string)[] {
  const delta = 1;
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total);

  return range;
}

export { getPaginationRange };
