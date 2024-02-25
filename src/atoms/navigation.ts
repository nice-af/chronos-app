import { atom } from 'jotai';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';

/**
 * Format is 'YYYY-MM-DD'
 */
export const selectedDateAtom = atom(formatDateToYYYYMMDD(new Date()));
export const currentOverlayAtom = atom<Overlay | null>(null);
