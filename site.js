/* ============================================================
   Small, simple scroll animations.
   No libraries — just IntersectionObserver, which watches
   elements and tells us when they enter the viewport.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // If the visitor asked for reduced motion, skip straight to
  // "everything visible" and don't bother wiring up animations.
  if (reduceMotion) {
    document.querySelectorAll(".reveal, .divider").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  /* ----------------------------------------------------------
     1. Reveal elements as they scroll into view.
     Elements with class="reveal" fade + rise into place.
     Give a group a stagger by adding data-stagger to the parent —
     each child gets a slightly longer delay than the last.
     ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once, then leave it alone
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => {
      child.classList.add("reveal");
      child.style.setProperty("--reveal-delay", `${i * 90}ms`);
    });
  });

  // Re-select after adding classes above, then observe everything.
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     2. Draw in the section dividers as they arrive.
     ---------------------------------------------------------- */
  const dividerObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".divider").forEach((el) => dividerObserver.observe(el));

  /* ----------------------------------------------------------
     3. Highlight the current section's nav link while scrolling.
     ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" } // "current" = near the middle of the screen
  );
  sections.forEach((section) => spyObserver.observe(section));
});
