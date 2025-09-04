
import { DotLottie } from '@lottiefiles/dotlottie-web';

const canvas = document.querySelector('#dotlottie-canvas-nav-menu');
const dotLottie = new DotLottie({
  autoplay: false,
  loop: false,
  speed: 3,
  layout:"fit-height",
  canvas: document.querySelector('#dotlottie-canvas-nav-menu'),
  src: "https://lottie.host/e3a2b9a5-e7a0-4be1-891f-2bf27e8766c7/NfZdzhssMd.lottie"
});

let isDark = false;      // theme state
let animating = false;   // prevents double clicks while animating

// 1) Wait for load so totalFrames is available and we can set initial frame
dotLottie.addEventListener('load', () => {
  // Make sure we start at the beginning
  dotLottie.setFrame(0);
  canvas.style.cursor = 'pointer';
});

// 2) When animation finishes, toggle theme state and lock the frame
dotLottie.addEventListener('complete', () => {
  animating = false;

  if (!isDark) {
    // we completed the forward playback -> switch to dark
    isDark = true;
    document.documentElement.classList.add('dark'); // or body.classList
    // ensure final frame is exact
    if (typeof dotLottie.totalFrames === 'number') {
      dotLottie.setFrame(Math.max(0, dotLottie.totalFrames - 1));
    }
  } else {
    // we completed reverse playback -> switch to light
    isDark = false;
    document.documentElement.classList.remove('dark');
    dotLottie.setFrame(0);
  }
});

// 3) Click handler: play forward or reverse depending on isDark
canvas.addEventListener('click', () => {
  if (animating) return;
  if (!dotLottie.isLoaded) return; // guard

  animating = true;

  if (!isDark) {
    // Play forward from start to end
    dotLottie.setMode('forward');             // ensures forward playback
    dotLottie.setFrame(0);                    // start exactly at frame 0
    dotLottie.play();
  } else {
    // Play reverse from end to start
    dotLottie.setMode('reverse');             // play in reverse mode
    // ensure we start from the last frame before playing
    const last = (typeof dotLottie.totalFrames === 'number') ? Math.max(0, dotLottie.totalFrames - 1) : undefined;
    if (last !== undefined) dotLottie.setFrame(last);
    dotLottie.play();
  }
});