import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/landing/utils/cn';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  children: React.ReactNode;
}

export const Btn = memo(function Btn({
  variant = 'primary',
  href,
  children,
  className,
  ...props
}: BtnProps) {
  const base =
    'inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[15px] font-semibold font-sans cursor-pointer border-none transition-transform duration-200 hover:scale-105 active:scale-95 no-underline';
  const variants = {
    primary: 'bg-landing-accent text-landing-bg',
    secondary: 'bg-landing-surface text-landing-fg border border-landing-border',
    outline: 'bg-transparent text-landing-fg border border-landing-border',
  };

  const classes = cn(base, variants[variant], className);

  if (href) {
    const isRoute = href.startsWith('/');
    return isRoute ? (
      <Link to={href} className={classes}>
        {children}
      </Link>
    ) : (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
});
