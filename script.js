"use strict";

///////////////////////////////////////
//VARIABLES
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

///////////////////////////////////////
// Modal window

// Function to open modal window
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// Function to close modal window
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Add event listeners to open modal buttons
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

// Add event listeners to close modal elements
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Close modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/////////////////////////////////////
// Scroll to Section 1
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

////////////////////////////
// Navbar scrolling

// Smooth scroll for navigation links
document.querySelector(".nav__links").addEventListener("click", function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//////////////////////////////
// Tabbed component
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  //Guard clause to avoid errors
  if (!clicked) return;

  // Remove active classes from tabs and contents
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );

  // Activate clicked tab and its corresponding content
  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//////////////////////////////
// Navbar fade animation

// Handle navigation links hover animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const clicked = e.target;
    const siblings = clicked.closest(".nav").querySelectorAll(".nav__link");
    const logo = clicked.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== clicked) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Add hover animation event listeners
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

////////////////////////////////
// Sticky Navbar with Intersection Observer API

const navHeight = nav.getBoundingClientRect().height;

// Function to make navbar sticky
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else nav.classList.remove("sticky");
};
// Observe header for sticky navbar
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////
// Revedal Sections on scroll

// Function to reveal sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
// Observe all sections for reveal effect
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////////////////////////////////
// Lazy loading images

const imgTargets = document.querySelectorAll("img[data-src]");
// Function to load images lazily
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // Remove blur filter only when image is loaded
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
// Observe images for lazy loading
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgTargets.forEach((img) => imgObserver.observe(img));

//////////////////////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const slider = document.querySelector(".slider");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  let curSlide = 0;
  const maxSlides = slides.length - 1;

  //////////////Functions
  // Activate dot
  const activeDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide = '${slide}']`)
      .classList.add("dots__dot--active");
  };

  // Function to move to a specific slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    activeDot(slide);
    curSlide = +slide;
  };

  // Create navigation dots for the slider
  const dotContainer = document.querySelector(".dots");
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide = ${i}></button>`
      );
    });
  };

  // Initialize slider
  const init = function () {
    createDots();
    goToSlide(0); //0%, 100%, 200%, 300%.....initial state
  };
  init();

  ////////////Slides
  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlides) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide); //-100%, 0%, 100%, 200%......update slide position
  };

  //Prev Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlides;
    } else {
      curSlide--;
    }
    goToSlide(curSlide); //0%, 100%, 200%, 300%,......update slide position
  };

  ////////Event Listeners
  // Click events for slider arrows
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // Keyboard events for slider navigation
  document.addEventListener("keydown", function (e) {
    e.key === "ArrowLeft" && prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  // Click events for navigation dots
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
slider();
