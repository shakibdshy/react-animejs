import { useState, useCallback, useRef } from 'react';
import { Animate } from '@/lib/react-animejs/components/Animate';

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { width: 36, height: 20, thumb: 16, translateX: 14 },
  md: { width: 48, height: 26, thumb: 20, translateX: 20 },
  lg: { width: 56, height: 30, thumb: 24, translateX: 24 },
};

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
  const rippleKeyRef = useRef(0);

  const handleClick = useCallback(() => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
    rippleKeyRef.current++;
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

  return (
    <label
      className={`inline-flex items-center gap-3 cursor-${disabled ? 'not-allowed' : 'pointer'} ${className}`}
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
        <Animate
          autoplay
          duration={300}
          ease="outCubic"
          backgroundColor={isChecked ? '#ffd11a' : '#3a3a4a'}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: isChecked ? '#ffd11a' : '#3a3a4a',
              boxShadow: isChecked
                ? '0 0 8px rgba(255,209,26,0.3)'
                : 'inset 0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
        </Animate>
        <Animate
          key={rippleKeyRef.current}
          autoplay
          duration={400}
          ease="outCubic"
          scale={[1.5, 0]}
          opacity={[0.4, 0]}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: dims.thumb * 2,
              height: dims.thumb * 2,
              left: (dims.width - dims.thumb * 2) / 2,
              top: (dims.height - dims.thumb * 2) / 2,
              backgroundColor: isChecked ? '#ffd11a' : '#6a6a7a',
              opacity: 0,
            }}
          />
        </Animate>
        <Animate
          autoplay
          duration={300}
          ease="outCubic"
          translateX={isChecked ? dims.translateX : 0}
        >
          <div
            className="absolute rounded-full shadow-md"
            style={{
              width: dims.thumb,
              height: dims.thumb,
              top: (dims.height - dims.thumb) / 2,
              left: (dims.height - dims.thumb) / 2,
              backgroundColor: disabled ? '#888' : '#12121a',
            }}
          />
        </Animate>
      </div>
      {label && <span className="text-sm text-[#e0e0e0] select-none">{label}</span>}
    </label>
  );
}

export default ToggleSwitch;
