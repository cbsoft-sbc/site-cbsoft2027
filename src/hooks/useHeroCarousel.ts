import { useEffect, useState } from 'react';

export const HERO_SLIDE_INTERVAL = 8_000;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** State updater that adds the given slide indexes to the requested list. */
const withRequested = (...indexes: number[]) => (previous: number[]) => {
  const missing = indexes.filter((index) => !previous.includes(index));
  return missing.length ? [...previous, ...missing] : previous;
};

/** Keep the previous photo visible while the requested photo loads. */
export function useHeroCarousel(slideCount: number) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(0);
  const [requested, setRequested] = useState<number[]>([0]);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION).matches,
  );
  const [hidden, setHidden] = useState(() => document.hidden);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setHidden(document.hidden);
    const endInteraction = () => setInteracting(false);
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('pointerup', endInteraction);
    window.addEventListener('pointercancel', endInteraction);
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('pointerup', endInteraction);
      window.removeEventListener('pointercancel', endInteraction);
    };
  }, []);

  const rotating = !paused && !hovered && !focused && !interacting && !reducedMotion && !hidden;

  useEffect(() => {
    if (!rotating || failed.length >= slideCount - 1) return;
    const timeout = window.setTimeout(() => {
      for (let offset = 1; offset < slideCount; offset++) {
        const next = (active + offset) % slideCount;
        if (!failed.includes(next)) {
          setActive(next);
          setRequested(withRequested(next));
          break;
        }
      }
    }, HERO_SLIDE_INTERVAL);
    return () => window.clearTimeout(timeout);
  }, [active, failed, rotating, slideCount]);

  useEffect(() => {
    if (!loaded.includes(active)) return;
    setVisible(active);
    // Once the current photo is on screen, fetch its neighbours so the
    // previous/next arrows (and the timer) swap without waiting on the network.
    setRequested(withRequested((active + 1) % slideCount, (active - 1 + slideCount) % slideCount));
  }, [active, loaded, slideCount]);

  function select(index: number) {
    if (failed.includes(index)) return;
    setActive(index);
    setRequested(withRequested(index));
  }

  function move(direction: number) {
    for (let offset = 1; offset < slideCount; offset++) {
      const next = (active + direction * offset + slideCount) % slideCount;
      if (!failed.includes(next)) {
        select(next);
        return;
      }
    }
  }

  function onLoad(index: number) {
    setLoaded((previous) => previous.includes(index) ? previous : [...previous, index]);
  }

  function onError(index: number) {
    setFailed((previous) => previous.includes(index) ? previous : [...previous, index]);
    if (index === active) move(1);
  }

  return {
    active, visible, requested, failed, rotating, paused, reducedMotion,
    select, move, prefetch: (index: number) => setRequested(withRequested(index)), onLoad, onError, setHovered, setFocused, setInteracting, setPaused,
  };
}
