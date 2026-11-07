/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle GSAP setup: smooth scrolling (ScrollSmoother), image parallax, scroll-triggered fade-in reveals,
* hero intro, scroll hint loop and smooth anchor scrolling (taken over from the KK landing page).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { motion } from '~/data/motion'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let smoother: ScrollSmoother | null = null

  // Subtle smooth scrolling for mouse/trackpad only – touch devices keep their native momentum scrolling
  function smoothScroll() {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (!motion.smoothScroll || touch || !document.getElementById('smooth-content')) return
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: motion.smooth,
      smoothTouch: false,
      effects: false,
    })
  }

  // `[data-parallax]` images move slower than the page inside their clipping wrapper (`.parallax`);
  // `data-parallax="hero"` lets the hero image sink while it scrolls out.
  function parallax() {
    if (!motion.parallax) return
    const range = motion.parallaxRange
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      if (el.dataset.parallax === 'hero') {
        gsap.to(el, {
          yPercent: motion.heroParallax,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top top', end: 'bottom top', scrub: true },
        })
        return
      }
      gsap.set(el, { scale: 1 + (range * 2 + 2) / 100 })
      gsap.fromTo(
        el,
        { yPercent: -range },
        {
          yPercent: range,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
  }

  function heroIntro() {
    const bars = gsap.utils.toArray<HTMLElement>('[data-hero-bar]')
    const texts = gsap.utils.toArray<HTMLElement>('[data-hero-text]')
    const sub = document.querySelector('[data-hero-sub]')
    if (!bars.length) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
    tl.fromTo(bars, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.8, stagger: 0.12 })
      .fromTo(texts, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.45')
    if (sub) tl.fromTo(sub, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3')

    const arrows = gsap.utils.toArray<SVGPathElement>('[data-scroll-arrow]')
    if (arrows.length) {
      gsap.fromTo(
        arrows,
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 6, duration: 1.1, ease: 'sine.inOut', stagger: 0.25, repeat: -1, repeatDelay: 0.3 },
      )
    }
  }

  function reveals() {
    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]')
    gsap.set(els, { autoAlpha: 0, y: 40 })
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      interval: 0.05,
      onEnter: (batch) => {
        // Elements already passed (e.g. after an anchor jump) appear at once, only visible ones animate
        const vh = window.innerHeight
        const inView = batch.filter((el) => el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < vh)
        const passed = batch.filter((el) => !inView.includes(el))
        if (passed.length) gsap.set(passed, { autoAlpha: 1, y: 0, overwrite: true })
        if (inView.length) {
          gsap.to(inView, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: { each: 0.1, amount: Math.min(0.4, 0.1 * (inView.length - 1)) },
            overwrite: true,
          })
        }
      },
    })
  }

  // Smooth scrolling for in-page anchors ("#apartment" and "/#apartment" on the start page)
  function smoothAnchors() {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]')
      if (!link || link.classList.contains('skip-link')) return
      const url = new URL(link.href, location.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return

      const id = decodeURIComponent(url.hash.slice(1))
      const target = id === 'top' ? document.body : document.getElementById(id)
      if (!target) return
      e.preventDefault()

      const header = document.querySelector<HTMLElement>('.header__frame')?.offsetHeight ?? 0
      const top = smoother ? smoother.offset(target, 'top top') : target.getBoundingClientRect().top + window.scrollY
      const y = id === 'top' ? 0 : Math.max(0, top - header)
      const distance = Math.abs(y - window.scrollY)
      const done = () => {
        history.pushState(null, '', url.hash)
        if (id !== 'top') {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
          target.focus({ preventScroll: true })
        }
      }

      if (reduced) {
        window.scrollTo(0, y)
        done()
        return
      }
      gsap.to(window, {
        scrollTo: { y, autoKill: true },
        duration: gsap.utils.clamp(0.7, 1.6, distance / 2500),
        ease: 'power2.inOut',
        overwrite: true,
        onComplete: done,
      })
    })
  }

  function showAll() {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '1'
    })
  }

  nuxtApp.hook('app:mounted', () => {
    document.documentElement.classList.add('gsap-ready')
    smoothAnchors()
    if (reduced) {
      showAll()
      return
    }
    smoothScroll()
    heroIntro()
    reveals()
    parallax()
    ScrollTrigger.refresh()
    window.addEventListener('load', () => ScrollTrigger.refresh())
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  })

  return { provide: { gsap, smoother: () => smoother } }
})
