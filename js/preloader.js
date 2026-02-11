// preloader.js
import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.querySelector(".preloader");
    const counter = document.querySelector(".preloader-counter");

    // Only run if preloader exists
    if (!preloader || !counter) return;

    // --- Corner Text Loop Logic ---
    const topLeftWords = ["Responsive", "Design", "Active"];
    const bottomRightWords = ["Frontend development", "Backend development", "UI/UX Design", "Web Applications"];

    const topLeftElement = document.querySelector(".preloader-loop-top-left");
    const bottomRightElement = document.querySelector(".preloader-services-bottom-right");

    // Helper to start looping words with directional slide
    const startWordLoop = (element, words, delay = 0.5, direction = "left") => {
        let index = 0;
        // Function to create a timeline for one word switch
        const switchWord = () => {
            // If preloader is hidden (or about to be), stop animation
            if (preloader.style.display === "none") return;

            const tl = gsap.timeline({
                onComplete: () => {
                    index = (index + 1) % words.length;
                    // Only schedule next wording if still visible
                    if (preloader.style.display !== "none") {
                        gsap.delayedCall(delay, switchWord);
                    }
                }
            });

            // Determine slide offsets based on direction
            // For "left": enter from left (-x), exit to right (+x)
            // For "right": enter from right (+x), exit to left (-x)
            const enterX = direction === "left" ? -20 : 20;
            const exitX = direction === "left" ? 20 : -20;

            // Slide out current word
            tl.to(element, {
                opacity: 0,
                x: exitX,
                ease: "power2.in",
                duration: 0.4
            })
                .set(element, {
                    textContent: words[index],
                    x: enterX
                })
                // Slide in new word
                .to(element, {
                    opacity: 0.7,
                    x: 0,
                    ease: "power2.out",
                    duration: 0.4
                });
        };

        // Start the first switch
        switchWord();
    };

    if (topLeftElement) startWordLoop(topLeftElement, topLeftWords, 0.4, "left");
    if (bottomRightElement) startWordLoop(bottomRightElement, bottomRightWords, 0.8, "right");

    // Fade in the loopers immediately after DOM load
    gsap.to(".preloader-angle-text", { opacity: 0.7, duration: 1, delay: 0.2 });


    // --- Main Preloader Logic ---

    // Initial state: reveal the counter
    gsap.set(".preloader-counter", { y: "100%", opacity: 0 });
    gsap.to(".preloader-counter", {
        y: "0%",
        opacity: 1,
        duration: 1,
        ease: "power4.out"
    });

    // We want the preloader to take approx 3 seconds (3000ms) to reach 100%.
    const loadingObj = { value: 0 };

    const tlProgress = gsap.timeline({
        onComplete: () => {
            // Animation sequence upon completion of 3s
            const tlExit = gsap.timeline();

            // 1. Counter slides out
            tlExit.to(".preloader-counter", {
                duration: 0.8,
                y: "-120%",
                opacity: 0,
                ease: "power4.in",
                delay: 0.2
            })
                // 2. Fade out text elements
                .to([".preloader-text", ".preloader-angle-text"], {
                    duration: 0.5,
                    opacity: 0,
                    ease: "none"
                }, "<")
                // 3. Slide preloader up
                .to(".preloader", {
                    duration: 1.2,
                    height: 0,
                    ease: "power4.inOut",
                    onComplete: () => {
                        preloader.style.display = "none";
                    }
                }, "-=0.4");
        }
    });

    tlProgress.to(loadingObj, {
        value: 100,
        duration: 3, // Increased to 3 seconds
        ease: "power1.inOut",
        onUpdate: () => {
            const val = Math.floor(loadingObj.value);
            counter.textContent = val < 10 ? `0${val}` : val;
        }
    });
});
