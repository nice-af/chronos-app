import { Version3Models } from 'jira.js';
import { atom } from 'jotai';
import { AuthModel } from '../services/storage.service';

export const jiraAuthAtom = atom<AuthModel | null>(null);

export const logoutAtom = atom(null, (_get, set) => {
  set(jiraAuthAtom, null);
  set(userInfoAtom, null);
});

export const userInfoAtom = atom<Version3Models.User | null>(null);
