import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// SplitText needs final font metrics to split lines correctly
document.fonts.ready.then(() => {
  if (reduceMotion) {
    gsap.set("#preloader", { display: "none" });
    gsap.set("#nav", { opacity: 1 });
    gsap.set("#scroll-path, #flourish-path", { visibility: "visible" });
    return;
  }

  intro();
  scrollPath();
  sectionTitles();
  scrollReveals();
  marquee();
});

/* —— Preloader + hero entrance —— */

function intro() {
  const heroSplit = new SplitText(".hero__line", { type: "chars" });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".preloader__mark", {
    autoAlpha: 0,
    y: 30,
    duration: 0.7,
    ease: "power2.out",
  })
    .to(".preloader__mark", { autoAlpha: 0, y: -30, duration: 0.5, delay: 0.3 })
    .to("#preloader", {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
    })
    .set("#preloader", { display: "none" })
    .from(
      heroSplit.chars,
      {
        yPercent: 110,
        autoAlpha: 0,
        rotate: 4,
        duration: 1.1,
        stagger: 0.035,
        ease: "power4.out",
      },
      "-=0.35"
    )
    .fromTo(
      "#flourish-path",
      { drawSVG: "0%", visibility: "visible" },
      { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" },
      "-=0.7"
    )
    .from(
      ".hero [data-fade]",
      { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.12 },
      "-=0.9"
    )
    .to("#nav", { opacity: 1, duration: 0.8 }, "-=0.6");
}

/* —— Winding SVG path, scrubbed with scroll —— */

function scrollPath() {
  gsap.fromTo(
    "#scroll-path",
    { drawSVG: "0%", visibility: "visible" },
    {
      drawSVG: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: "#main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    }
  );
}

/* —— Section title reveals —— */

function sectionTitles() {
  document.querySelectorAll(".section__title, .contact__title").forEach((title) => {
    const split = new SplitText(title, { type: "lines", mask: "lines" });

    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1,
      stagger: 0.12,
      ease: "power4.out",
      scrollTrigger: {
        trigger: title,
        start: "top 82%",
        once: true,
      },
    });

    gsap.from(title.previousElementSibling, {
      autoAlpha: 0,
      x: -20,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: title,
        start: "top 82%",
        once: true,
      },
    });
  });
}

/* —— Generic scroll reveals —— */

function scrollReveals() {
  // grouped reveals stagger together when they share a viewport entry
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 86%",
    once: true,
    onEnter: (batch) =>
      gsap.from(batch, {
        autoAlpha: 0,
        y: 44,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      }),
  });

  document.querySelectorAll("section:not(.hero) [data-fade]").forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 20,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

/* —— Skills marquee —— */

function marquee() {
  const track = document.getElementById("marquee-track");

  const loop = gsap.to(track, {
    xPercent: -50,
    duration: 22,
    ease: "none",
    repeat: -1,
  });

  // ease the marquee faster while scrolling, then settle back
  ScrollTrigger.create({
    trigger: ".marquee",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 1200, 2.5);
      gsap.to(loop, { timeScale: boost, duration: 0.4, overwrite: true });
    },
  });
}
