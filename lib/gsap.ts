import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function refreshScroll() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

export default gsap;