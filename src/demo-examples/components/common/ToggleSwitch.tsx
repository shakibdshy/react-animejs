import { useCallback, useState } from 'react';
import { Anime } from '@/lib/react-animejs/components/Anime';

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Geometry per size. `travel` is how far the thumb moves along the track and is
 * derived from the inset so the knob hugs both edges symmetrically.
 */
const sizeMap = {
  sm: { width: 38, height: 22, thumb: 16 },
  md: { width: 50, height: 28, thumb: 22 },
  lg: { width: 62, height: 34, thumb: 28 },
};

const travelOf = (dims: { width: number; height: number; thumb: number }) =>
  dims.width - dims.height;

export function ToggleSwitch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  size = 'md',
  label,
  disabled = false,
  className = '',
}: ToggleSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;
  const dims = sizeMap[size];
  const travel = travelOf(dims);

  // Bumping this key remounts the ripple <Anime>, which reliably replays the
  // animation on every toggle. (A useRef counter never triggers a re-render,
  // so the previous ripple seldom fired.)
  const [rippleId, setRippleId] = useState(0);

  const handleClick = useCallback(() => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
    setRippleId((n) => n + 1);
  }, [disabled, isChecked, isControlled, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const knobInset = (dims.height - dims.thumb) / 2;
  const rippleSize = dims.thumb * 1.8;
  // Ripple emanates from the thumb's current center.
  const rippleLeft = isChecked
    ? dims.width - knobInset - dims.thumb / 2 - rippleSize / 2
    : knobInset + dims.thumb / 2 - rippleSize / 2;

  return (
    <label
      className={`inline-flex items-center gap-3 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
      aria-disabled={disabled}
    >
      <div
        role="switch"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="relative inline-flex items-center"
        style={{ width: dims.width, height: dims.height }}
      >
        {/* Track */}
        <Anime
          autoplay
          duration={280}
          ease="outQuad"
          backgroundColor={
            isChecked ? 'var(--landing-accent)' : 'var(--landing-surface)'
          }
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: isChecked
                ? 'var(--landing-accent)'
                : 'var(--landing-surface)',
              border: '1px solid var(--landing-border)',
              boxShadow: isChecked
                ? '0 0 12px color-mix(in oklch, var(--landing-accent) 45%, transparent)'
                : 'inset 0 1px 2px rgba(0,0,0,0.25)',
            }}
          />
        </Anime>

        {/* Ripple — fires from the thumb on every toggle */}
        {!disabled && (
          <Anime
            key={rippleId}
            autoplay
            duration={420}
            ease="outQuad"
            scale={[0.4, 1.6]}
            opacity={[0.5, 0]}
          >
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: rippleSize,
                height: rippleSize,
                left: rippleLeft,
                top: (dims.height - rippleSize) / 2,
                backgroundColor: isChecked
                  ? 'var(--landing-accent)'
                  : 'var(--landing-muted)',
                opacity: 0,
              }}
            />
          </Anime>
        )}

        {/* Thumb / knob — slides with a springy settle + subtle squash */}
        <Anime
          autoplay
          duration={360}
          ease="outBack"
          translateX={isChecked ? travel : 0}
          scaleX={[1, 1.12, 1]}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: dims.thumb,
              height: dims.thumb,
              top: knobInset,
              left: knobInset,
              backgroundColor: disabled
                ? 'var(--landing-muted)'
                : 'var(--landing-bg)',
              boxShadow:
                '0 1px 3px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.05)',
            }}
          />
        </Anime>
      </div>
      {label && (
        <span className="text-sm text-landing-fg select-none">{label}</span>
      )}
    </label>
  );
}

export default ToggleSwitch;
