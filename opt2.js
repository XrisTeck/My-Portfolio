window.onload = function() {
  // Initialize Swipers for each category with autoplay and proper spacing
  const devSwiper = new Swiper('#dev', {
    loopFillGroupWithBlank: false,
    loop: true, // Loop through the slides
    rewind: true,
    loopedSlides: 7,
    slidesPerGroup: 1, 
    spaceBetween: 1, // Space between slides
    slidesPerView: 3, // Show 3 slides at a time for larger screens
   // Loop 7slides
    autoplay: {
      delay: 4000, // Delay between auto-slides (4 seconds)
      disableOnInteraction: false, // Allow autoplay to continue after user interaction
    },
    breakpoints: {
      0: {
        slidesPerView: 1, // On mobile, show 1 slide
      },
      768: {
        slidesPerView: 2, // On tablets, show 2 slides
      },
      1020: {
        slidesPerView: 6.5, // On desktop, show 3 slides
      },
    },

  });

  const graphicsSwiper = new Swiper('#graphics', {
    loopFillGroupWithBlank: false,
    rewind: true,
    loopedSlides: 16,
    loop: true, // Enable loop for infinite scrolling
    spaceBetween: 1, // Space between slides
    rewind: true,
    slidesPerView: 3, // Show 3 slides at a time
    autoplay: {
      delay: 3500, // 3.5-second autoplay delay
      disableOnInteraction: false, // Allow autoplay after interactions
    },
    breakpoints: {
      0: {
        slidesPerView: 3, // 1 slide on small screens
      },
      768: {
        slidesPerView: 4, // 2 slides on medium screens (tablet)
      },
      1020: {
        slidesPerView: 8.5, // 3 slides on large screens (desktop)
      },
    },
  });

  const videoSwiper = new Swiper('#videography', {
    loopFillGroupWithBlank: false,
    rewind: true,
    loopedSlides: 6,
    loop: true, // Loop through the slides continuously
    spaceBetween: 1, // Space between each slide
    rewind: true,
    slidesPerView: 3, // Show 3 slides at a time on large screens
    autoplay: {
      delay: 3600, // 3.6-second delay for autoplay
      disableOnInteraction: false, // Continue autoplay after user interactions
    },
    breakpoints: {
      0: {
        slidesPerView: 3, // Show 1 slide on small screens
      },
      768: {
        slidesPerView: 4, // Show 2 slides on medium screens
      },
      1020: {
        slidesPerView: 5.5, // Show 3 slides on large screens
      },
    },
  });

  // Handle scroll events for dynamic background position change and skills progress bar animation
  window.addEventListener('scroll', () => {
    // Get all section elements for the parallax effect
    const sections = document.querySelectorAll('.section');

    // Loop through each section
    sections.forEach((section) => {
      const sectionTop = section.offsetTop; // Get the top offset of the section
      const sectionHeight = section.offsetHeight; // Get the height of the section
      const scrollPosition = window.scrollY; // Get the current scroll position

      // Check if the current scroll position is within the section's bounds
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Calculate and set the background position to create a parallax effect
        const backgroundPosition = `center ${scrollPosition - sectionTop}px`;
        section.style.backgroundPosition = backgroundPosition;
      }
    });

    // Skills section progress bars
    const skillsSection = document.querySelector('.skills'); // Get the skills section
    const progressBars = document.querySelectorAll('.progress-bar'); // Get all progress bars in the skills section

    // Get the bottom of the viewport (window's scrollY + viewport height)
    const scrollPosition = window.scrollY + window.innerHeight;
    const skillsSectionTop = skillsSection.offsetTop; // Get the top offset of the skills section

    // Check if the user has scrolled past the skills section
    if (scrollPosition > skillsSectionTop) {
      // Loop through each progress bar and set its width based on the data-width attribute
      progressBars.forEach((progressBar) => {
        const width = progressBar.getAttribute('data-width'); // Get the target width from the data-width attribute
        progressBar.style.width = `${width}%`; // Set the width of the progress bar
      });
    }
  });

  // Toggle the visibility of navigation lists when clicking on nav icons (for mobile/compact menus)
  const navIcons = document.querySelectorAll('.nav-icon'); // Select all navigation icons
  const navLists = document.querySelectorAll('.nav-list'); // Select all navigation lists

  // Loop through each navigation icon
  navIcons.forEach((navIcon, index) => {
    // Add a click event listener for each navigation icon
    navIcon.addEventListener('click', () => {
      // Toggle the 'show' class on the corresponding navigation list (based on index)
      navLists[index].classList.toggle('show');
    });
  });
};
