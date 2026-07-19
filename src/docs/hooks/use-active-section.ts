import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const updateActiveSection = () => {
      // Keep the detection line below the fixed header and the browser's
      // native anchor offset, so an anchored heading is selected—not the
      // section that ends exactly above it.
      const headingLine = 120;
      const currentSection = sectionIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)
        .find((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top <= headingLine && rect.bottom > headingLine;
        });

      setActiveSection(currentSection?.id ?? sectionIds[0] ?? '');
    };

    const updateFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash && sectionIds.includes(hash)) setActiveSection(hash);
      window.requestAnimationFrame(updateActiveSection);
    };

    updateFromHash();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    window.addEventListener('hashchange', updateFromHash);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('hashchange', updateFromHash);
    };
  }, [sectionIds]);

  return activeSection;
}
