import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '../index';

function ThemeProbe() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme}:{String(isDark)}
    </button>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to dark and applies the document class', async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByRole('button').textContent).toBe('dark:true');
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('restores and persists the selected theme', async () => {
    window.localStorage.setItem('demo-theme', 'light');

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button').textContent).toBe('light:false');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    act(() => {
      screen.getByRole('button').click();
    });

    expect(screen.getByRole('button').textContent).toBe('dark:true');
    expect(window.localStorage.getItem('demo-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
