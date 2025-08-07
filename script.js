/* This is for activating all scrollTriggers scrolling */
gsap.registerPlugin(ScrollTrigger);
/* This is for activating all scrollTriggers scrolling */

/* This is for video scroll animations */
const video = document.querySelector(".video-background");
let src = video.currentSrc || video.src;
console.log(video, src);

/* Make sure the video is 'activated' on iOS */
function once(el, event, fn, opts) {
    let onceFn = function (e) {
        el.removeEventListener(event, onceFn);
        fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
}

once(document.documentElement, "touchstart", function (e) {
    video.play();
    video.pause();
});

let tl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
        trigger: "#container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

once(video, "loadedmetadata", () => {
    tl.fromTo(
        video,
        {
            currentTime: 0
        },
        {
            currentTime: video.duration || 1
        }
    );
});

/* When first coded, the Blobbing was important to ensure the browser wasn't dropping previously played segments, but it doesn't seem to be a problem now. Possibly based on memory availability? */
setTimeout(function () {
    if (window["fetch"]) {
        fetch(src)
            .then((response) => response.blob())
            .then((response) => {
                var blobURL = URL.createObjectURL(response);

                var t = video.currentTime;
                once(document.documentElement, "touchstart", function (e) {
                    video.play();
                    video.pause();
                });

                video.setAttribute("src", blobURL);
                video.currentTime = t + 0.01;
            });
    }
}, 1000);
/* This is for video scroll animations */

ScrollTrigger.create({
    trigger: "#container", // your actual scrollable section
    start: "top 80%",      // tweak if needed
    end: "bottom top",
    toggleClass: { targets: "body", className: "video-visible" },
    once: false,
});

/* This is for horizontal scrolling */
const races = document.querySelector(".races");
let sectionsHorizontal = gsap.utils.toArray(".races .horizontalSlide");

function getScrollAmount() {
    let racesWidth = races.scrollWidth;
    return -(racesWidth - window.innerWidth);
}

const tween = gsap.to(races, {
    x: getScrollAmount,
    duration: 3,
    ease: "none",
});

ScrollTrigger.create({
    trigger: ".gradient",
    start: "top top",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    pinSpacing: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
    markers: true,
    snap: 1 / (sectionsHorizontal.length - 1),
})
/* This is for horizontal scrolling */

/* This is for animating each horizontal scroll */
let horizontalSlide = document.querySelectorAll(".horizontalSlide");

horizontalSlide.forEach(Slide => {
    let text = Slide.querySelectorAll(".anim");

    gsap.from(text, {
        y: -130,
        opacity: 0,
        duration: 2,
        ease: "elastic",
        stagger: 0.1,
        scrollTrigger: {
            trigger: Slide,
            containerAnimation: tween,
            start: "left center",
            yoyo: true,
        }
    });
})
/* This is for animating each horizontal scroll */

/* This is for the background switching animation based on selected text */
const config = {
    gap: 0.08,
    speed: 0.3,
    arcRadius: 500,
};

const spotlightItems = [
    { name: "Example 1", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/photo-4387976_1280.jpg?v=1753946803"},
    { name: "Example 2", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/landscape-923769_1280.jpg?v=1753946804"},
    { name: "Example 3", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/lion-66898_1280.jpg?v=1753946804"},
    { name: "Example 4", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/jellyfish-4925772_1280.jpg?v=1753946804"},
    { name: "Example 5", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/nature-5168551_1280.jpg?v=1753946803"},
    { name: "Example 6", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/glass-sphere-1746506_1280.jpg?v=1753946803"},
    { name: "Example 7", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/south-america-74073_1280.jpg?v=1753946803"},
    { name: "Example 8", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/fantasy-3502188_1280.jpg?v=1753946803"},
    { name: "Example 9", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/candle-7581472_1280.jpg?v=1753946803"},
    { name: "Example 10", img: "https://cdn.shopify.com/s/files/1/0707/0387/4148/files/difference-7370144_1280.png?v=1753946803"},
];

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const titlesContainer = document.querySelector(".spotlight-titles");
const imagesContainer = document.querySelector(".spotlight-images");
const spotlightHeader = document.querySelector(".spotlight-header");
const titlesContainerElement = document.querySelector(
    ".spotlight-titles-container");
const introTextElements = document.querySelectorAll(".spotlight-intro-text");
const imageElements = [];

spotlightItems.forEach((item, index) => {
    const titleElement = document.createElement("h1");
    titleElement.textContent = item.name;
    titleElement.className = "big-text";
    if (index === 0) titleElement.style.opacity = "1";
    titlesContainer.appendChild(titleElement);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "spotlight-img";
    const imgElement = document.createElement("img");
    imgElement.src = item.img;
    imgElement.alt = "";
    imgWrapper.appendChild(imgElement);
    imagesContainer.appendChild(imgWrapper);
    imageElements.push(imgWrapper);
});

const titleElements = titlesContainer.querySelectorAll(".big-text");
let currentActiveIndex = 0;

const containerWidth = window.innerWidth * 0.3;
const containerHeight = window.innerHeight;
const arcStartX = containerWidth - 220;
const arcStartY = -200;
const arcEndY = containerHeight + 200;
const arcControlPointX = arcStartX + config.arcRadius;
const arcControlPointY = containerHeight / 2;

function getBezierPosition(t) {
    const x =
        (1 - t) * (1 - t) * arcStartX +
        2 * (1 - t) * t * arcControlPointX +
        t * t * arcStartX;
    const y =
        (1 - t) * (1 - t) * arcStartY +
        2 * (1 - t) * t * arcControlPointY +
        t * t * arcEndY;
    return { x, y };
}

function getImgProgressState(index, overallProgress) {
    const startTime = index * config.gap;
    const endTime = startTime + config.speed;

    if (overallProgress < startTime) return -1;
    if (overallProgress > endTime) return 2;

    return (overallProgress - startTime) / config.speed;
}

imageElements.forEach((img) => gsap.set(img, {opacity: 0 }));

ScrollTrigger.create({
    trigger: ".spotlight",
    start: "top top",
    end: () => `+=${window.innerHeight * 10}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    markers: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
        const progress = self.progress;

        // Image initially expands to the gallery.
        if (progress <= 0.2) {
            const animationProgress = progress / 0.2;
            const moveDistance = window.innerWidth * 0.6;
            gsap.set(introTextElements[0], {
                x: -animationProgress * moveDistance,
            });
            gsap.set(introTextElements[1], {
                x: animationProgress * moveDistance,
            });
            gsap.set(introTextElements[0], { opacity: 1});
            gsap.set(introTextElements[1], { opacity: 1});

            gsap.set(".spotlight-bg-img", {
                transform: `scale(${animationProgress})`,
            });
            gsap.set(".spotlight-bg-img img", {
                transform: `scale(${1.5 - animationProgress * 0.5})`,
            });

            imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
            spotlightHeader.style.opacity = "0";
            gsap.set(titlesContainerElement, {
                "--before-opacity": "0",
                "--after-opacity": "0",
            });
        }

        // The "Discover" and two straight white lines generated.
        else if (progress > 0.2 && progress < 0.25) {
            gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
            gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

            gsap.set(introTextElements[0], { opacity: 0 });
            gsap.set(introTextElements[1], { opacity: 0 });

            imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
            spotlightHeader.style.opacity = "1";
            gsap.set(titlesContainerElement, {
                "--before-opacity": "1",
                "--after-opacity": "1",
            });
        }

        // Gallery Image Switching
        else if (progress >= 0.25 && progress <= 0.95) {
            gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
            gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

            gsap.set(introTextElements[0], { opacity: 0 } );
            gsap.set(introTextElements[1], { opacity: 0 } );

            spotlightHeader.style.opacity = "1";
            gsap.set(titlesContainerElement, {
                "--before-opacity": "1",
                "--after-opacity": "1",
            });

            const switchProgress = (progress - 0.25) / 0.7;
            const viewportHeight = window.innerHeight;
            const titlesContainerHeight = titlesContainer.scrollHeight;
            const startPosition = viewportHeight;
            const targetPosition = -titlesContainerHeight;
            const totalDistance = startPosition - targetPosition;
            const currentY = startPosition - switchProgress * totalDistance;

            gsap.set(".spotlight-titles", {
                transform: `translateY(${currentY}px)`,
            });

            imageElements.forEach((img, index) => {
                const imageProgress = getImgProgressState(index, switchProgress);

                if (imageProgress < 0 || imageProgress > 1) {
                    gsap.set(img, { opacity: 0 });
                }
                else {
                    const pos = getBezierPosition(imageProgress);
                    gsap.set(img, {
                        x: pos.x - 100,
                        y: pos.y - 75,
                        opacity: 1,
                    });
                }
            });

            const viewportMiddle = viewportHeight / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;

            titleElements.forEach((title, index) => {
                const titleRect = title.getBoundingClientRect();
                const titleCenter = titleRect.top + titleRect.height / 2;
                const distanceFromCenter = Math.abs(titleCenter -
                    viewportMiddle);

                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentActiveIndex) {
                if (titleElements[currentActiveIndex]) {
                    titleElements[currentActiveIndex].style.opacity = "0.25";
                }
                titleElements[closestIndex].style.opacity = "1";
                document.querySelector(".spotlight-bg-img img").src =
                    spotlightItems[closestIndex].img;
                currentActiveIndex = closestIndex;
            }
        }

        else if (progress > 0.95) {
            spotlightHeader.style.opacity = "0";
            gsap.set(titlesContainerElement, {
                "--before-opacity": "0",
                "--after-opacity": "0",
            });
        }
    },
});

/* This is for the curtain reveal animation */
gsap.registerPlugin(Observer);

let sections = document.querySelectorAll(".curtainReveal"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    splitHeadings = headings.map(heading => new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text" })),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function gotoSection(index, direction) {
    // index = wrap(index); // make sure it's valid
    if (index >= sections.length || index < 0) {
        preventScroll.disable();
        observerSection.disable();
        animating = false;
        // Now scroll an extra 1 pixel to get the frick out of lock mode.
        // If at the bottom panel we add one pixel (down) or subtract one pixel (up)
        preventScroll.scrollY(preventScroll.scrollY() +
            (index === sections.length ? 1 : -1));
        return;
    }
    animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
            defaults: { duration: 1.25, ease: "power1.inOut" },
            onComplete: () => animating = false
        });
    if ((currentIndex >= 0) && (currentIndex <= sections.length -1)) {
        // The first time this function runs, current is -1
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
            .set(sections[currentIndex], { autoAlpha: 0 });
    }
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
    }, {
        yPercent: 0
    }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(splitHeadings[index].chars, {
            autoAlpha: 0,
            yPercent: 150 * dFactor
        }, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
                each: 0.02,
                from: "random"
            }
        }, 0.2);

    currentIndex = index;
    console.log(currentIndex);
}

let observerSection = Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true,
    onPress: self => {
        ScrollTrigger.isTouch && self.event.preventDefault();
    }
});
observerSection.disable();

let preventScroll = ScrollTrigger.observe({
    preventDefault: true,
    type: "wheel,scroll",
    allowClicks: true,
    onEnable: self => self.savedScroll = self.scrollY(), // save the scroll position.
    onChangeY: self => self.scrollY(self.savedScroll) // refuse to Scroll
});
preventScroll.disable();

// Pin the swip section and initiate the observer
ScrollTrigger.create({
    trigger: ".swipe-section",
    pin: true,
    anticipatePin: true,
    start: "top top",
    end: "+=50%",
    onEnter: (self) => {
        if (preventScroll.isEnabled === false) {
            self.scroll(self.start);
            currentIndex = -1;
            preventScroll.enable();
            observerSection.enable();
            gotoSection(0, 1);
        }
    },
    onEnterBack: (self) => {
        if (preventScroll.isEnabled === false) {
            self.scroll(self.start);
            currentIndex = sections.length;
            preventScroll.enable();
            observerSection.enable();
            gotoSection(sections.length-1, -1);
        }
    }
});

// gotoSection(0, 1);
/* This is for the curtain reveal animation */
