import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const menu = document.querySelector(".nav");
const menuHeader = document.querySelector(".nav-menu-header");
const menuOverlay = document.querySelector(".nav-menu-overlay");
const menuItems = document.querySelectorAll(".nav-menu-flex li");
const menuFooter = document.querySelector(".nav-menu-footer");
const menuLogo = document.querySelector(".nav-menu-logo img");
const hamburgerMenu = document.querySelector(".nav-menu-hamburger-icon");

let isOpen = false;
let lastScrollY = window.scrollY;
let isMenuVisible = true;
let isAnimating = false;
let splitTexts = [];

function initMenu() {
  gsap.set(menuOverlay, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      const split = new SplitText(link, {
        type: "words",
        mask: "words",
      });
      splitTexts.push(split);

      gsap.set(split.words, {
        yPercent: 120,
      });
    }
  });

  gsap.set(menuItems, { opacity: 1 });
  gsap.set(menuFooter, { opacity: 1, y: 20 });
}

function toggleMenu() {
  if (isAnimating) return;
  isOpen ? closeMenu() : openMenu();
}

function openMenu() {
  isOpen = true;
  isAnimating = true;
  if (hamburgerMenu) hamburgerMenu.classList.add("open");
  if (menuLogo) menuLogo.classList.add("rotated");

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    },
  });

  tl.to(menuOverlay, {
    duration: 0.5,
    scaleY: 1,
    ease: "power3.out",
  });

  const allWords = splitTexts.flatMap((split) => split.words);

  tl.to(
    allWords,
    {
      duration: 0.75,
      yPercent: 0,
      stagger: 0.05,
      ease: "power4.out",
    },
    "-=0.3"
  );

  tl.to(
    menuFooter,
    {
      duration: 0.3,
      y: 0,
      ease: "power2.out",
    },
    "-=1"
  );
}

function closeMenu() {
  isOpen = false;
  isAnimating = true;
  if (hamburgerMenu) hamburgerMenu.classList.remove("open");
  if (menuLogo) menuLogo.classList.remove("rotated");

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    },
  });

  const allWords = splitTexts.flatMap((split) => split.words);

  tl.to(menuFooter, {
    duration: 0.3,
    y: 20,
    ease: "power2.in",
  });

  tl.to(
    allWords,
    {
      duration: 0.25,
      yPercent: 120,
      stagger: -0.025,
      ease: "power2.in",
    },
    "-=0.25"
  );

  tl.to(
    menuOverlay,
    {
      duration: 0.5,
      scaleY: 0,
      ease: "power3.inOut",
    },
    "-=0.2"
  );
}

function handleScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    if (isOpen) closeMenu();
    if (isMenuVisible) {
      menu.classList.add("hidden");
      isMenuVisible = false;
    }
  } else if (currentScrollY < lastScrollY) {
    if (!isMenuVisible) {
      menu.classList.remove("hidden");
      isMenuVisible = true;
    }
  }

  lastScrollY = currentScrollY;
}

function init() {
  initMenu();

  if (menuHeader) {
    menuHeader.addEventListener("click", toggleMenu);
  }

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      link.addEventListener("click", () => {
        if (isOpen) closeMenu();
      });
    }
  });

  window.addEventListener("scroll", handleScroll);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
