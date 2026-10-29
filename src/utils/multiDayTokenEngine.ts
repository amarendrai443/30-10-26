import { MultiDayTokenItem } from '../types/serviceBooking';

/**
 * Generates a multi-day token schedule for doctor home visits.
 * Each token becomes valid right after midnight (12:00 AM) of that date
 * and carries a strict 1-day validity (until 11:59:59 PM of that calendar date).
 */
export const generateMultiDayTokens = (
  startDateStr: string,
  durationDays: number = 1
): MultiDayTokenItem[] => {
  const days = Math.max(1, Math.min(durationDays, 30));
  const baseDate = new Date(startDateStr);
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const schedule: MultiDayTokenItem[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const tokenId = `NHT-DHV-D${i + 1}-${randomSuffix}-${hex}`;

    const validFrom = `${dateStr}T00:00:00.000Z`;
    const validUntil = `${dateStr}T23:59:59.999Z`;

    let status: MultiDayTokenItem['status'] = 'scheduled';
    if (dateStr === todayStr) {
      status = 'active';
    } else if (dateStr < todayStr) {
      status = 'expired';
    } else {
      status = 'scheduled';
    }

    schedule.push({
      dayNumber: i + 1,
      date: dateStr,
      tokenId,
      validFrom,
      validUntil,
      status,
    });
  }

  return schedule;
};

/**
 * Re-evaluates token statuses against the current date/time (right after midnight rollover).
 */
export const refreshMultiDayTokenSchedule = (
  schedule: MultiDayTokenItem[]
): MultiDayTokenItem[] => {
  const todayStr = new Date().toISOString().split('T')[0];

  return schedule.map((item) => {
    if (item.status === 'redeemed') return item;
    if (item.date === todayStr) {
      return { ...item, status: 'active' };
    }
    if (item.date < todayStr) {
      return { ...item, status: 'expired' };
    }
    return { ...item, status: 'scheduled' };
  });
};

/**
 * Returns today's active token for doctor home visit authorization.
 */
export const getTodayActiveMultiDayToken = (
  schedule: MultiDayTokenItem[]
): MultiDayTokenItem | null => {
  const updated = refreshMultiDayTokenSchedule(schedule);
  return updated.find((t) => t.status === 'active') || null;
};
