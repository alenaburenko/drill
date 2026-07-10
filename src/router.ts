/**
 * Pure hash-based router for the Drill practice platform.
 *
 * Routes:
 *   #/dashboard       → { tab: 'dashboard', taskId: null }
 *   #/catalog         → { tab: 'catalog', taskId: null }
 *   #/upload          → { tab: 'upload', taskId: null }
 *   #/backup          → { tab: 'backup', taskId: null }
 *   #/task/:taskId    → { tab: 'catalog', taskId: '<id>' }
 *   (empty / unknown) → { tab: 'dashboard', taskId: null }
 */

export interface Route {
  tab: 'dashboard' | 'catalog' | 'upload' | 'backup';
  taskId: string | null;
}

function parseHash(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  if (!h) return { tab: 'dashboard', taskId: null };

  const parts = h.split('/');

  // #/task/:taskId
  if (parts[0] === 'task' && parts[1]) {
    return { tab: 'catalog', taskId: parts[1] };
  }

  // #/dashboard, #/catalog, #/upload, #/backup
  if (['dashboard', 'catalog', 'upload', 'backup'].includes(parts[0])) {
    return { tab: parts[0] as Route['tab'], taskId: null };
  }

  return { tab: 'dashboard', taskId: null };
}

function formatRoute(route: Route): string {
  if (route.taskId) {
    return `#/task/${encodeURIComponent(route.taskId)}`;
  }
  return `#/${route.tab}`;
}

/** Get current route from window.location.hash */
export function getRoute(): Route {
  return parseHash(window.location.hash);
}

/** Navigate to a route by updating the hash */
export function setRoute(route: Route): void {
  window.location.hash = formatRoute(route);
}

/** Subscribe to hash changes. Returns an unsubscribe function. */
export function onRouteChange(handler: (route: Route) => void): () => void {
  const onHashChange = () => handler(getRoute());
  window.addEventListener('hashchange', onHashChange);
  return () => window.removeEventListener('hashchange', onHashChange);
}
