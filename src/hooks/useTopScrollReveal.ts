import { useLayoutEffect, useState } from 'react';

const UP_KEYS = new Set(['ArrowUp', 'PageUp', 'Home']);
const DOWN_KEYS = new Set(['ArrowDown', 'PageDown', 'End']);
const SCROLL_INPUT_WINDOW = 750;

function isInsideMenu(target: EventTarget | null) {
  return target instanceof Element && target.closest('.header-mega-menu, .site-header__mobile-menu');
}

/** Show the organizer only when the user scrolls up at the top of this visit. */
export function useTopScrollReveal(locationKey: string): boolean {
  const [visibleOn, setVisibleOn] = useState<string | null>(null);

  useLayoutEffect(() => {
    setVisibleOn(null);
    let lastUpInput = -Infinity;
    let touchY: number | undefined;
    const atTop = () => window.scrollY <= 0;

    const onScrollInput = (up: boolean) => {
      lastUpInput = up ? performance.now() : -Infinity;
      if (!up) {
        setVisibleOn(null);
      } else if (atTop()) {
        setVisibleOn(locationKey);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0 || isInsideMenu(event.target)) return;
      onScrollInput(event.deltaY < 0);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches.length === 1 && !isInsideMenu(event.target) ? event.touches[0].clientY : undefined;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchY === undefined || event.touches.length !== 1) return;
      const nextY = event.touches[0].clientY;
      if (nextY !== touchY) onScrollInput(nextY > touchY);
      touchY = nextY;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isInsideMenu(event.target)) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === ' ' && target instanceof Element && target.closest('button, summary')) return;

      if (UP_KEYS.has(event.key) || (event.key === ' ' && event.shiftKey)) {
        onScrollInput(true);
      } else if (DOWN_KEYS.has(event.key) || event.key === ' ') {
        onScrollInput(false);
      }
    };

    const onScroll = () => {
      if (!atTop()) {
        setVisibleOn(null);
      } else if (performance.now() - lastUpInput <= SCROLL_INPUT_WINDOW) {
        setVisibleOn(locationKey);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [locationKey]);

  return visibleOn === locationKey;
}
