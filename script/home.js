import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

  gsap.set(".hero .hero-cards .card", { transformOrigin: "center center" });

  var heroLogo = document.querySelector('.hero-logo svg');

  function draw() {
    heroLogo.classList.add('active');
  }

  gsap.to(".hero .hero-cards .card", {
    scale: 1,
    duration: 0.75,
    delay: 0.5,
    stagger: 0.1,
    ease: "power4.out",
    onComplete: () => {
      gsap.set("#hero-card-1", { transformOrigin: "top right" });
      gsap.set("#hero-card-3", { transformOrigin: "top left" });
    },
  });

  const smoothStep = (p) => p * p * (3 - 2 * p);

  if (window.innerWidth > 1000) {
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "65% top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        ["#hero-card-1", "#hero-card-2", "#hero-card-3", "#hero-card-4"].forEach(
          (cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (1 - delay * 0.1)
            );

            const y = gsap.utils.interpolate(
              "0%",
              "400%",
              smoothStep(cardProgress)
            );
            const scale = gsap.utils.interpolate(
              1,
              0.75,
              smoothStep(cardProgress)
            );

            let x = "0%";
            let rotation = 0;
            if (index === 0) {
              x = gsap.utils.interpolate("0%", "200%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
            } else if (index === 1) {
              x = gsap.utils.interpolate("0%", "100%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, -7, smoothStep(cardProgress));
            } else if (index === 2) {
              x = gsap.utils.interpolate("0%", "-100%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, 7, smoothStep(cardProgress));
            } else if (index === 3) {
              x = gsap.utils.interpolate("0%", "-200%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
            }

            gsap.set(cardId, {
              y: y,
              x: x,
              rotation: rotation,
              scale: scale,
            });
          }
        );
      },
    });

    ScrollTrigger.create({
      trigger: ".services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: ".services",
      pinSpacing: true,
    });

    ScrollTrigger.create({
      trigger: ".services",
      start: "top bottom",
      end: `+=${window.innerHeight * 4}`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
        const headerY = gsap.utils.interpolate(
          "300%",
          "0%",
          smoothStep(headerProgress)
        );
        gsap.set(".services-header", {
          y: headerY,
        });

        ["#services-card-1", "#services-card-2", "#services-card-3", "#services-card-4"].forEach((cardId, index) => {
          const delay = index * 0.5;
          const cardProgress = gsap.utils.clamp(
            0,
            1,
            (progress - delay * 0.1) / (0.9 - delay * 0.1)
          );

          const innerCard = document.querySelector(
            `${cardId} .services-flip-card-inner`
          );

          let y;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            y = gsap.utils.interpolate(
              "-100%",
              "50%",
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            y = gsap.utils.interpolate(
              "50%",
              "0%",
              smoothStep(normalizedProgress)
            );
          } else {
            y = "0%";
          }

          let scale;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            scale = gsap.utils.interpolate(
              0.25,
              0.75,
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            scale = gsap.utils.interpolate(
              0.75,
              1,
              smoothStep(normalizedProgress)
            );
          } else {
            scale = 1;
          }

          let opacity;
          if (cardProgress < 0.2) {
            const normalizedProgress = cardProgress / 0.2;
            opacity = smoothStep(normalizedProgress);
          } else {
            opacity = 1;
          }

          let x, rotate, rotationY;

          const positions = ["150%", "50%", "-50%", "-150%"];
          const rotations = [-10, -5, 5, 10];

          if (cardProgress < 0.6) {
            x = positions[index];
            rotate = rotations[index];
            rotationY = 0;
          } else if (cardProgress < 1) {
            const normalizedProgress = (cardProgress - 0.6) / 0.4;
            x = gsap.utils.interpolate(positions[index], "0%", smoothStep(normalizedProgress));
            rotate = gsap.utils.interpolate(rotations[index], 0, smoothStep(normalizedProgress));
            rotationY = smoothStep(normalizedProgress) * 180;
          } else {
            x = "0%";
            rotate = 0;
            rotationY = 180;
          }

          gsap.set(cardId, {
            opacity: opacity,
            y: y,
            x: x,
            rotate: rotate,
            scale: scale,
          });

          gsap.set(innerCard, {
            rotationY: rotationY,
          });
        });
      },
    });

    // Desktop-only smooth scroll
    const servicesButton = document.querySelector('#services-button');
    if (servicesButton) {
      servicesButton.addEventListener("click", (e) => {
        e.preventDefault();
        gsap.to(window, { 
          scrollTo: () => window.innerHeight * 5
        });
      });
    }
  }

  const spotlightImages = document.querySelector(".home-spotlight-images");

  ScrollTrigger.create({
    trigger: ".home-spotlight",
    start: "top top",
    end: () => `+=${spotlightImages.scrollHeight}`,
    pin: true,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      const startY = 5;
      const endY = -70;

      const currentY = startY + (endY - startY) * progress;

      gsap.set(spotlightImages, {
        y: `${currentY}%`,
      });
    },
  });

  setTimeout(draw, 100);
});
