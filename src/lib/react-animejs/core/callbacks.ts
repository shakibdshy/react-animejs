export function createSafeCallback<T extends (...args: any[]) => void>(
  callback: T | undefined,
  name: string,
): T | undefined {
  if (!callback) return undefined;

  return ((...args: any[]) => {
    try {
      callback(...args);
    } catch (error) {
      console.error(`[react-animejs] Error in ${name} callback:`, error);
    }
  }) as T;
}

export function cleanUndefinedValues<T extends Record<string, unknown>>(
  config: T,
): T {
  Object.keys(config).forEach((key) => {
    if (config[key] === undefined) {
      delete config[key];
    }
  });
  return config;
}
