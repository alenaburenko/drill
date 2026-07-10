import { useState, useEffect } from 'react';
import { getRoute, onRouteChange, setRoute, Route } from './router';

/**
 * React hook that wraps the hash-based router.
 *
 * Returns the current route and a setter.
 * Re-renders the component when the hash changes.
 */
export function useRoute(): [Route, (route: Route) => void] {
  const [route, setRouteState] = useState<Route>(getRoute);

  useEffect(() => {
    const unsub = onRouteChange(setRouteState);
    return unsub;
  }, []);

  return [route, setRoute];
}
