import { type ReactElement, type RefObject } from "react";
import { isRef } from "../core";

export function resolveSvgElement<T extends SVGElement>(
  value?: T | RefObject<T | null> | null | string,
): T | string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (isRef(value)) {
    return value.current as T | null;
  }

  return value as T;
}

export function mergeClassName(
  className: string | undefined,
  childClassName: unknown,
) {
  if (!className) {
    return childClassName as string | undefined;
  }

  return `${(childClassName as string | undefined) || ""} ${className}`.trim();
}

export function mergeChildProps<P extends { className?: string }>(
  child: ReactElement<P>,
  propsToMerge: Partial<P>,
) {
  return {
    ...child.props,
    ...propsToMerge,
    className: mergeClassName(propsToMerge.className, child.props.className),
  };
}
