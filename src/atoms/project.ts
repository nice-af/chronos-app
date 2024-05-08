import { atom } from 'jotai';
import { Project } from '../types/global.types';

// This protected atom is used to store the projects in a way that they can't be modified directly.
const projectsProtectedAtom = atom<Project[]>([]);

export const projectsAtom = atom(get => get(projectsProtectedAtom));

export const upsertProjectAtom = atom(null, (get, set, project: Project) => {
  set(projectsProtectedAtom, projects => [...projects.filter(p => p.id !== project.id), project]);
});
