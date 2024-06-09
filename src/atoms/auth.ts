import { atom, useAtomValue } from 'jotai';
import { Alert } from 'react-native';
import { JiraAccountTokens, JiraAccountTokensAtom, JiraClientsAtom, LoginModel, UUID } from '../types/accounts.types';
import { store } from './store';

export const primaryUUIDAtom = atom<UUID>('' as UUID);
export const loginsAtom = atom<LoginModel[]>([]);
export const jiraAccountTokensAtom = atom<JiraAccountTokensAtom>({});
export const jiraClientsAtom = atom<JiraClientsAtom>({});

export const useLoginByUUID = (uuid: UUID) => {
  return useAtomValue(loginsAtom).find(login => login.uuid === uuid);
};

export function getLoginByUUID(uuid: UUID) {
  const foundlogin = store.get(loginsAtom).find(login => login.uuid === uuid);
  if (!foundlogin) {
    Alert.alert(
      'An unexpected error has occurred',
      "We couldn't find the login for a account. Please try to log in again."
    );
    throw new Error(`No login found for UUID ${uuid}`);
  }
  return foundlogin;
}

export function addLoginToStore(login: LoginModel) {
  const logins = store.get(loginsAtom);
  let newLogins = [...logins.filter(l => l.uuid !== login.uuid), login];
  if (!newLogins.find(l => l.isPrimary)) {
    // No primary account, so we make this account primary
    newLogins = newLogins.map(l => ({ ...l, isPrimary: l.uuid === login.uuid }));
  }
  store.set(loginsAtom, newLogins);
}

export function getJiraAccountTokensByUUID(uuid: UUID) {
  const jiraAccountTokens = store.get(jiraAccountTokensAtom);
  if (!jiraAccountTokens[uuid]) {
    Alert.alert(
      'An unexpected error has occurred',
      "We couldn't find the tokens for a account. Please try to log in again."
    );
    throw new Error(`No Jira account tokens for account ${uuid}`);
  }
  return jiraAccountTokens[uuid];
}

export function addJiraAccountTokensToStore(uuid: UUID, tokens: JiraAccountTokens) {
  const newJiraAccountTokens = store.get(jiraAccountTokensAtom);
  newJiraAccountTokens[uuid] = tokens;
  store.set(jiraAccountTokensAtom, { ...newJiraAccountTokens });
}

export function getJiraClientByUUID(uuid: UUID) {
  const jiraClients = store.get(jiraClientsAtom);
  if (!jiraClients[uuid]) {
    Alert.alert(
      'An unexpected error has occurred',
      "We couldn't find the Jira client for a account. Please try to log in again."
    );
    throw new Error(`No Jira client for account ${uuid}`);
  }
  return jiraClients[uuid];
}

export function addJiraClientToStore(uuid: UUID, jiraClient: any) {
  const newJiraClients = store.get(jiraClientsAtom);
  newJiraClients[uuid] = jiraClient;
  store.set(jiraClientsAtom, { ...newJiraClients });
}
