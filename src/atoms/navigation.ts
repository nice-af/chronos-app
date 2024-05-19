import { atom } from 'jotai';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';

/**
 * Format is 'YYYY-MM-DD'
 */
export const selectedDateAtom = atom(formatDateToYYYYMMDD(new Date()));

/**
 * The currently active overlay.
 * This is an array because during transitions there can be multiple overlays active.
 */
export const currentOverlayAtom = atom<Overlay[] | null>(null);
