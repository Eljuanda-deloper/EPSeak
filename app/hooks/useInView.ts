'use client';

import { useEffect, useState } from 'react';
import { useInView as useFramerInView } from 'framer-motion';

export const useInView = (ref: any, options = { once: true, amount: 0.3 }) => {
  const isInView = useFramerInView(ref, options);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return { isInView: hasAnimated ? false : isInView, hasAnimated };
};