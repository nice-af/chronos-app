import { isTahoeOrGreater } from '../../utils/os-version';
import { SidebarLegacy } from './SidebarLegacy';
import { SidebarTahoe } from './SidebarTahoe';

export let Sidebar: React.ComponentType<any>;

if (isTahoeOrGreater()) {
  Sidebar = SidebarTahoe;
} else {
  Sidebar = SidebarLegacy;
}
