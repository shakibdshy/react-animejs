import { useRef } from 'react';
import { depsChanged } from '../core/utilities';

/**
 * Converts a caller-provided dependency list into a stable scalar for an
 * effect dependency array. React requires the dependency array's length to be
 * stable, while the library's public `deps` option intentionally accepts a
 * dynamically sized list.
 */
export function useDependencySignal(dependencies: readonly unknown[] = []): number {
  const previousDependenciesRef = useRef<readonly unknown[] | undefined>(undefined);
  const signalRef = useRef(0);

  if (depsChanged(previousDependenciesRef.current, dependencies)) {
    previousDependenciesRef.current = dependencies;
    signalRef.current += 1;
  }

  return signalRef.current;
}
