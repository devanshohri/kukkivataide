import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class AboutCard {
  constructor() {
    this.card = document.querySelector(".flip-card-inner");
    this.cardFront = document.querySelector(".flip-card-front");
    this.cardBack = document.querySelector(".flip-card-back");
    this.rotationFactor = 200;
    this.zRotationFactor = 15;
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;

    this.currentMouseX = 0;

    window.addEventListener("mousemove", e => {
      this.currentMouseX = e.clientX;
    });

    this.mm = gsap.matchMedia();

    // MAIN ROTATION + Y INTRO
    gsap.timeline({
      scrollTrigger: {
        trigger: this.card,
        start: "top 50%",
        once: true,
      }
    }).fromTo(
      this.card,
      {
        rotationZ: 0,
        rotationY: -90,
        y: "-8em",
      },
      {
        rotationZ: 6,
        rotationY: 0,
        y: "0em",
        duration: 1,
        ease: "power4.out",
        onComplete: () => {
          this.initAnimation();
        },
      }
    );

    // SEPARATE OPACITY ANIMATION
    gsap.timeline({
      scrollTrigger: {
        trigger: this.card,
        start: "top 50%",
        once: true,
      }
    }).fromTo(
      [this.card, this.cardFront, this.cardBack],
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power4.out", stagger: 0.1 }
    );
  }

  initAnimation() {
    this.mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.ticker.add(this.mouseMovement);
      return () => {
        gsap.ticker.remove(this.mouseMovement);
      };
    });

    this.mm.add("(hover: none) and (pointer: coarse) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(this.card, {
        rotationY: 0,
        rotationZ: 0,
        duration: 1,
        ease: "power2.out",
      });
    });
  }

  mouseMovement = () => { 
    const mouseX = this.currentMouseX; 
    const normalizedX = (mouseX - this.centerX) / this.centerX; 
    const rotationY = normalizedX * this.rotationFactor; 
    const absRotation = Math.abs(rotationY); 
    const rotationProgress = Math.min(absRotation / 180, 1); 
    const rotationZ = 6 - rotationProgress * 12;

    gsap.to(this.card, {
        rotationY: rotationY,
        rotationZ: rotationZ,
        duration: 0.5,
        ease: "power2.out",
    });
    }

    onMouseEnter() {
  this.isHovering = true;
}

onMouseLeave() {
  this.isHovering = false;

  gsap.to(this.card, {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 6,
    duration: 1.5,
    ease: "elastic.out(1,0.75)",
  });
}
}

window.addEventListener("DOMContentLoaded", () => {
  new AboutCard();
});
