import { Version3Models } from 'jira.js';
import { atom } from 'jotai';
import { AuthModel } from '../services/storage.service';
import { worklogsLocalAtom, worklogsRemoteAtom } from './worklog';

export const jiraAuthAtom = atom<AuthModel | null>(null);

export const logoutAtom = atom(null, (_get, set) => {
  set(jiraAuthAtom, null);
  set(userInfoAtom, null);
  set(worklogsLocalAtom, []);
  set(worklogsRemoteAtom, []);
});

export const userInfoAtom = atom<Version3Models.User | null>(null);
