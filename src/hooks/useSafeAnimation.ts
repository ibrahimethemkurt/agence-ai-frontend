import { useReducedMotion } from 'framer-motion';

export const useSafeAnimation = <T extends object>(animation: T): T | object => {
  const shouldReduce = useReducedMotion();
  return shouldReduce ? {} : animation;
};
