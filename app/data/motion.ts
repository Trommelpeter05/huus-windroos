/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the switches for smooth scrolling and image parallax (see plugins/gsap.client.ts).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
export const motion = {
  /** GSAP ScrollSmoother on desktop (mouse wheel / trackpad). Touch devices always scroll natively. */
  smoothScroll: true,
  /** Seconds the content needs to catch up with the scroll position – higher = floatier */
  smooth: 1.2,
  /** Parallax on images with `data-parallax` */
  parallax: true,
  /** Image movement in % of its height, in each direction */
  parallaxRange: 10,
  /** Hero image: how far it moves down (% of its height) while the hero scrolls out */
  heroParallax: 25,
}
