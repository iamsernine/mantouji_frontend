/** Stable Unsplash URLs — auto=format avoids broken loads. */
export function unsplash(
  photoId: string,
  width = 800,
  height = 600
): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;
}

export const images = {
  hero: {
    main: unsplash("photo-1548013146-7249fbbdfed0", 1600, 1000),
    /** Artisane marocaine — hero background (public/images/women.png) */
    woman: "/images/women.png",
    mosaic: [
      unsplash("photo-1606313564200-e75d5e304d0e", 600, 800),
      unsplash("photo-1474979266404-7eaacbcd87c5", 600, 800),
      unsplash("photo-1587049352846-4a222e784d38", 600, 800),
    ],
    story: unsplash("photo-1596040033229-a9821ebd058d", 900, 600),
    terroir: unsplash("photo-1509316785289-025f5e846b8e", 900, 600),
  },
  products: {
    p1: [
      unsplash("photo-1606313564200-e75d5e304d0e", 900, 700),
      unsplash("photo-1587049352846-4a222e784d38", 900, 700),
    ],
    p2: [unsplash("photo-1474979266404-7eaacbcd87c5", 900, 700)],
    p3: [unsplash("photo-1587049352846-4a222e784d38", 900, 700)],
    p4: [unsplash("photo-1586201375767-83865001e31c", 900, 700)],
    p5: [unsplash("photo-1506368249639-73a05d6f6488", 900, 700)],
    p6: [unsplash("photo-1490750967868-88aa4486c946", 900, 700)],
    p7: [unsplash("photo-1474979266404-7eaacbcd87c5", 900, 700)],
    p8: [unsplash("photo-1509316785289-025f5e846b8e", 900, 700)],
    p9: [unsplash("photo-1586201375767-83865001e31c", 900, 700)],
    p10: [unsplash("photo-1490750967868-88aa4486c946", 900, 700)],
  },
  categories: {
    c1: unsplash("photo-1606313564200-e75d5e304d0e", 500, 500),
    c2: unsplash("photo-1474979266404-7eaacbcd87c5", 500, 500),
    c3: unsplash("photo-1587049352846-4a222e784d38", 500, 500),
    c4: unsplash("photo-1586201375767-83865001e31c", 500, 500),
    c5: unsplash("photo-1506368249639-73a05d6f6488", 500, 500),
    c6: unsplash("photo-1490750967868-88aa4486c946", 500, 500),
  },
  cooperatives: {
    coop1: unsplash("photo-1606313564200-e75d5e304d0e", 900, 700),
    coop2: unsplash("photo-1596040033229-a9821ebd058d", 900, 700),
    coop3: unsplash("photo-1587049352846-4a222e784d38", 900, 700),
    coop4: unsplash("photo-1506368249639-73a05d6f6488", 900, 700),
    coop5: unsplash("photo-1490750967868-88aa4486c946", 900, 700),
    coop6: unsplash("photo-1474979266404-7eaacbcd87c5", 900, 700),
  },
  regions: {
    r1: unsplash("photo-1509316785289-025f5e846b8e", 600, 750),
    r2: unsplash("photo-1596040033229-a9821ebd058d", 600, 750),
    r3: unsplash("photo-1606313564200-e75d5e304d0e", 600, 750),
    r4: unsplash("photo-1474979266404-7eaacbcd87c5", 600, 750),
    r5: unsplash("photo-1490750967868-88aa4486c946", 600, 750),
  },
} as const;

export function productMedia(
  productId: string,
  alt: string,
  index = 0
): { url: string; alt: string } {
  const urls = images.products[productId as keyof typeof images.products];
  const url = urls?.[index] ?? urls?.[0] ?? images.hero.main;
  return { url, alt };
}

export function coopCover(coopId: string): string {
  return (
    images.cooperatives[coopId as keyof typeof images.cooperatives] ??
    images.hero.story
  );
}

export function categoryImage(catId: string): string {
  return (
    images.categories[catId as keyof typeof images.categories] ??
    images.categories.c1
  );
}
