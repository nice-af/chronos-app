import axios from 'axios';
import { Buffer } from 'buffer';
import { Project as JiraProject } from 'jira.js/out/version3/models';
import ms from 'ms';
import { jiraAccountTokensAtom, projectsAtom, store } from '../atoms';
import { UUID } from '../types/accounts.types';
import { Project } from '../types/global.types';
import { getAccountIdFromUUID } from './account.service';

export function createNewLocalProject(project: JiraProject, uuid: UUID): Project {
  return {
    id: project.id,
    key: project.key,
    _avatarUrl: project.avatarUrls?.['48x48'] ?? '',
    avatar: null,
    name: project.name,
    uuid,
    updatedAt: Date.now(),
  };
}

export function getProjectByIssueKey(issueKey: string, uuid: UUID): Project | undefined {
  const projectId = issueKey.split('-')[0];
  return store.get(projectsAtom)?.[uuid]?.[projectId];
}

export function deleteFromProjectAtom(projectsToDelete: Project[]) {
  const loadedProjects = { ...store.get(projectsAtom) };
  projectsToDelete.forEach(project => {
    if (loadedProjects[project.uuid]) {
      delete loadedProjects[project.uuid]![project.key];
    }
  });
  store.set(projectsAtom, loadedProjects);
}

/**
 * Adds a specific project to the projects atom.
 * This should not be used directly, but rather through other functions that handle things like
 * loading the avatar of the project based on the timestamp.
 */
export function upsertToProjectsAtom(project: Project) {
  const loadedProjects = { ...store.get(projectsAtom) };
  if (!loadedProjects[project.uuid]) {
    loadedProjects[project.uuid] = {};
  }
  loadedProjects[project.uuid]![project.key] = project;
  store.set(projectsAtom, loadedProjects);
}

export async function upsertProjectByJiraProject(project: JiraProject, uuid: UUID) {
  // We can update the projects often, we just don't want to have too many updates in a short time
  const DETAILS_UPDATE_THRESHOLD = ms('1min');
  const AVATAR_UPDATE_THRESHOLD = ms('5min');
  const currentProject = store.get(projectsAtom)?.[uuid]?.[project.key];
  if (currentProject && currentProject.updatedAt > Date.now() - DETAILS_UPDATE_THRESHOLD) {
    return;
  }

  const newProject = {
    id: project.id,
    key: project.key,
    _avatarUrl: project.avatarUrls?.['48x48'] ?? null,
    avatar: currentProject?.avatar ?? null,
    name: project.name,
    uuid,
    updatedAt: Date.now(),
  };

  // Update avatar if it's older than the threshold
  if (newProject.avatar === null || newProject.updatedAt > Date.now() - AVATAR_UPDATE_THRESHOLD) {
    newProject.avatar = await loadAvatarForProject(newProject._avatarUrl, uuid);
  }

  upsertToProjectsAtom(newProject);
}

export async function loadAvatarForProject(_avatarUrl: string | null, uuid: UUID): Promise<string | null> {
  if (!_avatarUrl) {
    return null;
  }
  const tokens = store.get(jiraAccountTokensAtom)?.[getAccountIdFromUUID(uuid)];
  if (!tokens) {
    // No tokens for this account found. Maybe it isn't initialized yet
    return null;
  }
  const avatarUrl = _avatarUrl + '?format=png';
  const imageRes = await axios.get(avatarUrl, {
    responseType: 'arraybuffer',
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const base64 = Buffer.from(imageRes.data, 'binary').toString('base64');
  return `data:image/png;charset=utf-8;base64,${base64}`;
}
