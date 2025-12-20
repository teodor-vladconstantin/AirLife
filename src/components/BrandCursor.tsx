// Custom cursor with smooth trailing effect for brand green dot
import { useEffect } from "react";

export default function BrandCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.style.position = "fixed";
    cursor.style.zIndex = "9999";
    cursor.style.width = "18px";
    cursor.style.height = "18px";
    cursor.style.borderRadius = "50%";
    cursor.style.background = "#22c55e";
    cursor.style.pointerEvents = "none";
    cursor.style.transition = "background 0.2s";
    cursor.style.boxShadow = "0 2px 8px 0 #22c55e44";
    cursor.style.mixBlendMode = "multiply";
    cursor.style.left = "0px";
    cursor.style.top = "0px";
    cursor.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener("mousemove", move);

    let running = true;
    function animate() {
      dotX += (mouseX - dotX) * 0.18; // trailing effect
      dotY += (mouseY - dotY) * 0.18;
      cursor.style.left = dotX + "px";
      cursor.style.top = dotY + "px";
      if (running) requestAnimationFrame(animate);
    }
    animate();

    return () => {
      running = false;
      document.removeEventListener("mousemove", move);
      document.body.removeChild(cursor);
    };
  }, []);
  return null;
}
