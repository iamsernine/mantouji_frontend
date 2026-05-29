export const mobileMenuEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const mobileMenuSmooth = {
  duration: 0.6,
  ease: mobileMenuEase,
};

export const mobileMenuItemSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.75,
};

export const mobileMenuItemStagger = 0.09;

export function mobileMenuItemVariants(count: number) {
  return {
    hidden: { opacity: 0, x: 24 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { ...mobileMenuItemSpring, delay: i * mobileMenuItemStagger },
    }),
    exit: (i: number) => ({
      opacity: 0,
      x: 24,
      transition: {
        ...mobileMenuItemSpring,
        delay: (count - 1 - i) * mobileMenuItemStagger,
      },
    }),
  };
}
