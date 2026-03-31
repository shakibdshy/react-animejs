# React Anime.js Style Guide

## Overview

This style guide establishes consistent coding standards for hooks and components in the react-animejs library.

## 1. Naming Conventions

### Files
- Hooks: `use-{feature}.ts` (kebab-case)
- Components: `{ComponentName}.tsx` (PascalCase)
- Types: `{feature}.ts` (kebab-case, co-located with implementation)
- Tests: `{file}.test.ts` or `{file}.test.tsx`

### Variables and Functions
- camelCase for all variables, functions, and hooks
- PascalCase for React components and type interfaces

### Types and Interfaces

```typescript
// Hook option interfaces
interface UseAnimeOptions { }
interface UseAnimeReturn<T> { }

// Component prop interfaces
interface AnimateProps { }
interface AnimateRef { }

// Ref interfaces
interface AnimeTimelineRef { }
```

## 2. File Structure

### Hooks

```typescript
/**
 * {HookName} - Short description
 *
 * Extended description of what the hook does and its purpose.
 */

import { /* React imports */ } from "react";
import { /* Library imports */ } from "animejs";
import type { /* Type imports */ } from "../types";
import { /* Utils imports */ } from "../core";

// =============================================================================
// Types (if not in separate type file)
// =============================================================================

// =============================================================================
// Helper Functions
// =============================================================================

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * {HookName} - Description
 *
 * @param options - Description of options
 * @returns Description of return value
 *
 * @example
 * ```tsx
 * // Basic example
 * ```
 */
export function useAnime<T extends HTMLElement | SVGElement = HTMLElement>(
  options: UseAnimeOptions = {},
): UseAnimeReturn<T> {
  // ==========================================================================
  // Refs
  // ==========================================================================

  // ==========================================================================
  // Context
  // ==========================================================================

  // ==========================================================================
  // State
  // ==========================================================================

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  // ==========================================================================
  // Memoized Values
  // ==========================================================================

  // ==========================================================================
  // Effects
  // ==========================================================================

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  // ==========================================================================
  // Return
  // ==========================================================================

  return {};
}
```

### Components

```typescript
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useAnime } from "../hooks";
import type { AnimateProps, AnimateRef } from "./types";

export interface AnimateComponentRef {
  controls: PlaybackControls;
  state: AnimationState;
  isReady: boolean;
}

export interface AnimateComponentProps extends Omit<UseAnimeOptions, "targets" | "selector"> {
  children: ReactNode;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
}

export const AnimateComponent = forwardRef<AnimateComponentRef, AnimateComponentProps>(
  function AnimateComponent(
    { children, onControlsReady, onStateChange, ...animationProps },
    ref,
  ) {
    const { ref: animeRef, controls, state } = useAnime(animationProps);

    const refValue = useMemo<AnimateComponentRef>(
      () => ({ controls, state, isReady: true }),
      [controls, state],
    );

    useImperativeHandle(ref, () => refValue, [refValue]);

    useEffect(() => {
      onControlsReady?.(controls);
    }, [controls, onControlsReady]);

    useEffect(() => {
      onStateChange?.(state);
    }, [state, onStateChange]);

    if (!isValidElement(children)) {
      console.warn("[react-animejs] Animate requires a valid React element");
      return children;
    }

    return cloneElement(children, { ref: animeRef } as Partial<unknown>);
  },
);

export default AnimateComponent;
```

## 3. Import Order

1. React core imports (`React`, `useState`, etc.)
2. React supplementary imports (`forwardRef`, `useImperativeHandle`, etc.)
3. Library imports (`animejs`)
4. Type imports (`import type { ... }`)
5. Internal types (`../types/*`)
6. Core utilities (`../core/*`)
7. Other internal modules (`../hooks/*`, `./utils/*`)

```typescript
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { animate, createScope } from "animejs";
import type { JSAnimation } from "animejs";
import type {
  UseAnimeOptions,
  UseAnimeReturn,
  AnimationState,
} from "../types";
import {
  useAnimeScope,
  resolveTarget,
  safeJsonStringify,
} from "../core";
```

## 4. Section Organization (Hooks)

Use section comments to organize code:

```typescript
// ==========================================================================
// Refs
// ==========================================================================

// ==========================================================================
// Context
// ==========================================================================

// ==========================================================================
// State
// ==========================================================================

// ==========================================================================
// Extract Options
// ==========================================================================

// ==========================================================================
// Memoized Values
// ==========================================================================

// ==========================================================================
// Effects
// ==========================================================================

// ==========================================================================
// Computed Values
// ==========================================================================

// ==========================================================================
// Return
// ==========================================================================
```

## 5. Type Definitions

### Option Interfaces

```typescript
export interface UseAnimeOptions {
  // Group related properties with comments
  deps?: unknown[];
  enabled?: boolean;

  // Callbacks
  onBegin?: () => void;
  onComplete?: () => void;

  // Playback settings
  delay?: number;
  duration?: number;
  loop?: boolean;
}
```

### Return Interfaces

```typescript
export interface UseAnimeReturn<T extends HTMLElement | SVGElement = HTMLElement> {
  ref: RefObject<T | null>;
  controls: PlaybackControls;
  state: AnimationState;
  animation: RefObject<JSAnimation | null>;
  isReady: boolean;
}
```

## 6. State Management

### Refs vs State

- **useRef**: Animation instances, DOM elements, mutable values that don't need re-renders
- **useState**: Values that need to trigger re-renders (progress, playing state)

```typescript
// Ref - mutable, doesn't trigger re-render
const animationRef = useRef<JSAnimation | null>(null);

// State - triggers re-render
const [isReady, setIsReady] = useState(false);
const [progress, setProgress] = useState(0);
```

### Callback Stability

Use refs to store latest callback versions:

```typescript
const callbackRefs = useRef({ onComplete, onUpdate });
callbackRefs.current = { onComplete, onUpdate };
```

## 7. JSDoc Comments

### Hook Description

```typescript
/**
 * useAnime - Main animation hook for React
 *
 * Provides a declarative way to create animations in React components.
 * Handles lifecycle, cleanup, and state management automatically.
 */
```

### Function/Member JSDoc

```typescript
/**
 * Hook-specific description
 *
 * @param options - Description of options parameter
 * @returns Description of return value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, controls } = useAnime({ duration: 1000 });
 *   return <div ref={ref}>Animated</div>;
 * }
 * ```
 */
```

## 8. Error Handling

### Console Warnings

Use descriptive warnings with library prefix:

```typescript
console.warn("[react-animejs] Animate requires a valid React element");
```

### Error Boundaries

For hooks, handle errors gracefully:

```typescript
useEffect(() => {
  try {
    // animation logic
  } catch (error) {
    console.error("[react-animejs] Animation error:", error);
  }
}, [dependencies]);
```

## 9. Performance Considerations

### Memoization

```typescript
// Expensive computations
const configJson = useMemo(() => safeJsonStringify(config), [config]);

// Stable function references
const handleComplete = useCallback(() => {
  onComplete?.();
}, [onComplete]);
```

### Dependency Arrays

- Always include all used values
- Use `deps` option pattern for externally-managed dependencies

## 10. Component Patterns

### Forward Ref Pattern

Components that need ref forwarding:

```typescript
export const ComponentName = forwardRef<RefType, PropsType>(
  function ComponentName({ prop1, prop2 }, ref) {
    // implementation
  },
);
```

### Render Props

For flexible composition:

```typescript
interface ComponentProps {
  children?: ReactNode | ((api: ComponentRef) => ReactNode);
  onReady?: (api: ComponentRef) => void;
}
```

## 11. Testing Patterns

### Hook Tests

```typescript
describe("useAnime", () => {
  it("should create animation on mount", () => {
    const { result } = renderHook(() => useAnime({ duration: 1000 }));
    expect(result.current.isReady).toBe(true);
  });
});
```

### Component Tests

```typescript
describe("Animate", () => {
  it("should render children", () => {
    render(<Animate><div>Test</div></Animate>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

## 12. Export Patterns

### Index Files

```typescript
// Named exports for individual items
export { useAnime } from "./use-anime";
export { useAnimeTimeline } from "./use-anime-timeline";

// Default export for main item
export { Animate as default } from "./Animate";
```

## 13. Constants

Group related constants:

```typescript
export const DEFAULT_DURATION = 1000;
export const DEFAULT_EASE = "easeOutQuad";

export const DEFAULT_PLAYBACK_SETTINGS = {
  duration: DEFAULT_DURATION,
  ease: DEFAULT_EASE,
  autoplay: false,
} as const;
```

## 14. Prop Types

### Boolean Props

Always provide defaults:

```typescript
interface Props {
  enabled?: boolean;  // default: true
  loading?: boolean;  // default: false
  visible?: boolean;  // default: true
}
```

### Optional vs Required

Mark optional explicitly:

```typescript
interface Props {
  requiredProp: string;      // required
  optionalProp?: string;    // optional
  defaultProp: string = "value"; // has default
}
```

## 15. Code Review Checklist

- [ ] Naming conventions followed
- [ ] Import order correct
- [ ] Section comments present (for hooks > 100 lines)
- [ ] JSDoc comments complete for public APIs
- [ ] useRef vs useState used appropriately
- [ ] Memoization for expensive computations
- [ ] Callback refs for latest values
- [ ] Error handling in place
- [ ] No type assertions (`as`) without explanation
- [ ] Tests cover main functionality
