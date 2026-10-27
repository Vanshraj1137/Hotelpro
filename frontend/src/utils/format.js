export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const nightsBetween = (a, b) => {
  if (!a || !b) return 0;
  const n = Math.ceil((new Date(b) - new Date(a)) / 86400000);
  return n > 0 ? n : 0;
};
