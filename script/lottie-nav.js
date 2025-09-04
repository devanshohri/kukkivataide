import { DotLottie } from '@lottiefiles/dotlottie-web';

const canvas = document.querySelector('#dotlottie-canvas-nav');

const dotLottie = new DotLottie({
  autoplay: false,
  loop: false,
  speed: 3,
  layout: "fit-height",
  canvas: canvas,
  src: "https://lottie.host/ee60fb5f-c78d-41b7-a800-75ddff3ca0af/stFDF4aGIQ.lottie"
});

let isDark = false;      // Current theme state
let animating = false;   // Prevent double clicks while animating

// === 1. Load event ===
dotLottie.addEventListener('load', () => {
  canvas.style.cursor = 'pointer';

  // Check localStorage for saved theme
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    isDark = true;
    dotLottie.setFrame(dotLottie.totalFrames - 1); // start at end
  } else {
    document.documentElement.classList.remove('dark');
    isDark = false;
    dotLottie.setFrame(0); // start at beginning
  }
});

// === 2. Complete event ===
dotLottie.addEventListener('complete', () => {
  animating = false;

  if (!isDark) {
    // Forward playback finished -> dark mode
    isDark = true;
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');

    if (typeof dotLottie.totalFrames === 'number') {
      dotLottie.setFrame(dotLottie.totalFrames - 1); // lock last frame
    }
  } else {
    // Reverse playback finished -> light mode
    isDark = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');

    dotLottie.setFrame(0); // lock first frame
  }
});

// === 3. Click handler ===
canvas.addEventListener('click', () => {
  if (animating) return;
  if (!dotLottie.isLoaded) return;

  animating = true;

  if (!isDark) {
    // Play forward from start -> dark mode
    dotLottie.setMode('forward');
    dotLottie.setFrame(0);
    dotLottie.play();
  } else {
    // Play reverse from end -> light mode
    dotLottie.setMode('reverse');
    const last = (typeof dotLottie.totalFrames === 'number') ? Math.max(0, dotLottie.totalFrames - 1) : 0;
    dotLottie.setFrame(last);
    dotLottie.play();
  }
});
