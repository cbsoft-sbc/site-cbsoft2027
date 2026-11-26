/** "27 set – 1 out 2027" (pt) or "Sep 27 – Oct 1, 2027" (en). */
export function formatShortDateRange(start: string, end: string, lang: string) {
  const from = new Date(start);
  const to = new Date(end);
  if (lang !== 'pt') {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
    }).formatRange(from, to).replace(/\u2009/g, ' ');
  }
  const month = (date: Date) => new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' })
    .format(date)
    .replace('.', '');
  const day = (date: Date) => date.getUTCDate();
  const head = from.getUTCMonth() === to.getUTCMonth() ? `${day(from)}` : `${day(from)} ${month(from)}`;
  return `${head} – ${day(to)} ${month(to)} ${to.getUTCFullYear()}`;
}
