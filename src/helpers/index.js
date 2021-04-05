export const formatDuration = (d) => {
  if (!d && d !== 0) return '0m';

  const h = Math.floor(d / 60);
  const m = d % 60;
  const memo = [];
  if (h) memo.push(`${h}h`);
  if (m || !h) memo.push(`${m}m`);
  return memo.join(' ');
};

export const formatDurationRange = (d1, d2) => {
  if (d1 === d2) {
    return formatDuration(d1);
  }

  const h1 = Math.floor(d1 / 60);
  const h2 = Math.floor(d2 / 60);
  const m1 = d1 % 60;
  const m2 = d2 % 60;

  if (m1 && m2 && !h1 && !h2) {
    return `${m1} - ${m2}m`;
  }
  if (h1 && h2 && !m1 && !m2) {
    return `${h1} - ${h2}h`;
  }
  return `${formatDuration(d1)} - ${formatDuration(d2)}`;
};
