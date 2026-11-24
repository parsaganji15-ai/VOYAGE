/* ===================== JAVASCRIPT ENABLED ===================== */

document.documentElement.classList.add("js-enabled");

/* ===================== VOYAGE - MAIN JAVASCRIPT ===================== */

/* ===================== 01. MOBILE NAVIGATION ===================== */

// Select Elements
const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-navigation");
const navLinks = document.querySelectorAll(".nav-link");
const siteHeader = document.querySelector(".site-header");

// Check Elements
if (menuToggle && mainNavigation && siteHeader) {
  const openMenu = () => {
    mainNavigation.classList.add("active");
    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  };

  // Close Mobile Menu
  const closeMenu = () => {
    mainNavigation.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  // Toggle Mobile Menu
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close Menu After Clicking a Navigation Link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close Menu When Clicking Outside
  document.addEventListener("click", (event) => {
    const clickedInsideHeader = siteHeader.contains(event.target);

    if (!clickedInsideHeader) {
      closeMenu();
    }
  });

  // Close Menu With Escape Key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
        menuToggle.focus();
      }
    }
  });

  // Close Menu When Switching To Desktop
  const mobileMediaQuery = window.matchMedia("(min-width: 901px)");

  mobileMediaQuery.addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
}

/* ===================== 02. HERO SECTION ===================== */
const heroSection = document.querySelector(".hero-section");

if (heroSection) {
  // Trigger Hero Entrance Animation
  window.addEventListener("load", () => {
    heroSection.classList.add("is-loaded");
  });
}

/* =====================  03. TRAVEL SEARCH ===================== */
// Select Elements
const travelSearchForm = document.querySelector("#travel-search-form");
const destinationInput = document.querySelector("#search-destination");
const departureInput = document.querySelector("#departure-date");
const returnInput = document.querySelector("#return-date");
const travelersInput = document.querySelector("#travelers-count");
const tripTypeInput = document.querySelector("#trip-type");

// Sample Destinations Data
const searchDestinations = [
  {
    name: "Bali",
    type: "adventure",
  },
  {
    name: "Maldives",
    type: "beach",
  },
  {
    name: "Paris",
    type: "cultural",
  },
  {
    name: "Switzerland",
    type: "nature",
  },
  {
    name: "Dubai",
    type: "adventure",
  },
  {
    name: "Santorini",
    type: "beach",
  },
];

if (
  travelSearchForm &&
  destinationInput &&
  departureInput &&
  returnInput &&
  travelersInput &&
  tripTypeInput
) {
  /* ============ 03.1. DATE MANAGEMENT ============ */

  // Get Local Date
  const getLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Set Minimum Departure Date
  const todayDate = getLocalDate();
  departureInput.min = todayDate;
  returnInput.min = todayDate;

  // Update Return Date Minimum

  departureInput.addEventListener("change", () => {
    const departureDate = departureInput.value;
    returnInput.min = departureDate || todayDate;

    // Clear Invalid Return Date
    if (
      returnInput.value &&
      departureDate &&
      returnInput.value < departureDate
    ) {
      returnInput.value = "";
    }
  });

  /* ============ 03.2. SEARCH RESULT AREA ============ */
  // Create Result Container
  const searchResults = document.createElement("div");
  searchResults.className = "search-results";
  searchResults.setAttribute("role", "status");
  searchResults.setAttribute("aria-live", "polite");
  travelSearchForm.insertAdjacentElement("afterend", searchResults);

  // Display Search Message
  const showSearchMessage = (message, isSuccess = false) => {
    searchResults.textContent = message;
    searchResults.classList.toggle("success", isSuccess);
    searchResults.classList.toggle("error", !isSuccess);
  };

  /* ============ 03.3. FORM SUBMISSION ============ */
  travelSearchForm.addEventListener("submit", (event) => {
    // Prevent Page Reload
    event.preventDefault();

    // Check Native Form Validation
    if (!travelSearchForm.checkValidity()) {
      travelSearchForm.reportValidity();
      return;
    }

    // Get Form Values
    const destination = destinationInput.value.trim();
    const departureDate = departureInput.value;
    const returnDate = returnInput.value;
    const travelers = Number(travelersInput.value);
    const tripType = tripTypeInput.value;

    // Validate Destination
    if (!destination) {
      showSearchMessage("Please enter your destination.");
      destination.focus();

      return;
    }

    // Validate Dates
    if (departureDate < todayDate || returnDate < departureDate) {
      showSearchMessage("Please select valid travel dates.");
      return;
    }

    // Validate Travelers
    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 20) {
      showSearchMessage("Travelers must be between 1 and 20.");
      travelersInput.focus();
      return;
    }

    // Search Matching Destinations
    const matchingDestinations = searchDestinations.filter((item) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(destination.toLowerCase());
      const matchesType = !tripType || item.type === tripType;
      return matchesName && matchesType;
    });

    /* ===================== 03.4. DISPLAY SEARCH RESULTS ===================== */
    if (matchingDestinations.length > 0) {
      const destinationNames = matchingDestinations
        .map((item) => item.name)
        .join(", ");
      showSearchMessage(
        `Great! We found ${matchingDestinations.length} matching destination(s): ${destinationNames}`,
        true,
      );
    } else {
      showSearchMessage(
        "No matching destinations found. Try another destination or trip type.",
      );
    }
  });
}

/* ===================== 04. POPULAR DESTINATIONS ===================== */

// Select Elements
const destinationCards = document.querySelectorAll(".destination-card");
const destinationFilterButtons = document.querySelectorAll(
  ".destination-filter",
);

// Check Elements
if (destinationCards.length > 0 && destinationFilterButtons.length > 0) {
  /* ============ 04.1. FILTER DESTINATIONS ============ */

  // Filter Function
  const filterDestinations = (selectedCategory) => {
    let visibleCount = 0;

    // Check Every Destination Card

    destinationCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const shouldDisplay =
        selectedCategory === "all" || cardCategory === selectedCategory;

      // Show or Hide Card
      if (shouldDisplay) {
        card.classList.remove("is-hidden");
        visibleCount++;
      } else {
        card.classList.add("is-hidden");
      }
    });

    // Return Number of Visible Cards
    return visibleCount;
  };

  /* ============ 04.2. FILTER BUTTONS ============ */
  destinationFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      // Update Active Button

      destinationFilterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);

        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      // Apply Selected Filter
      filterDestinations(selectedCategory);
    });
  });

  /* ============ 04.3. INITIAL FILTER ============ */
  filterDestinations("all");
}

/* ===================== 05. DESTINATION DETAILS MODAL ===================== */

/* 05.1. DESTINATION DATA */
const destinationDetails = {
  bali: {
    name: "Bali",
    location: "Indonesia",
    image: "../PHOTOS/bali.jpg",
    description:
      "Discover Bali, an island paradise known for its tropical beaches, beautiful temples, lush rice terraces, and unforgettable cultural experiences.",
    bestSeason: "April - October",
    duration: "7 - 10 Days",
    price: "$899",
    attractions: [
      "Ubud",
      "Uluwatu Temple",
      "Nusa Penida",
      "Tegallalang Rice Terraces",
    ],
  },

  maldives: {
    name: "Maldives",
    location: "Maldives",
    image: "../PHOTOS/maldives.jpg",
    description:
      "Experience crystal-clear waters, white sandy beaches, luxury island resorts, and peaceful tropical surroundings in the Maldives.",
    bestSeason: "November - April",
    duration: "5 - 7 Days",
    price: "$1,299",
    attractions: ["Malé", "Maafushi Island", "Banana Reef", "Vaadhoo Island"],
  },

  paris: {
    name: "Paris",
    location: "France",
    image: "../PHOTOS/paris.jpg",
    description:
      "Explore the romantic streets of Paris, admire iconic architecture, visit world-famous museums, and enjoy the city's art, culture, and cuisine.",
    bestSeason: "April - June",
    duration: "4 - 6 Days",
    price: "$1,099",
    attractions: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame",
      "Arc de Triomphe",
    ],
  },

  switzerland: {
    name: "Switzerland",
    location: "Switzerland",
    image: "../PHOTOS/switzerland.jpg",
    description:
      "Discover breathtaking Alpine landscapes, peaceful lakes, charming villages, and unforgettable mountain adventures in Switzerland.",
    bestSeason: "June - September",
    duration: "7 - 10 Days",
    price: "$1,499",
    attractions: ["Interlaken", "Jungfraujoch", "Lake Lucerne", "Zermatt"],
  },

  dubai: {
    name: "Dubai",
    location: "United Arab Emirates",
    image: "../PHOTOS/dubai.jpg",
    description:
      "Experience Dubai's impressive skyline, modern architecture, luxury shopping, desert adventures, and vibrant city life.",
    bestSeason: "November - March",
    duration: "4 - 6 Days",
    price: "$999",
    attractions: [
      "Burj Khalifa",
      "Dubai Mall",
      "Palm Jumeirah",
      "Dubai Marina",
    ],
  },

  santorini: {
    name: "Santorini",
    location: "Greece",
    image: "../PHOTOS/santorini.jpg",
    description:
      "Enjoy the iconic whitewashed villages, blue-domed churches, beautiful sunsets, and stunning views of the Aegean Sea.",
    bestSeason: "May - October",
    duration: "4 - 6 Days",
    price: "$1,199",
    attractions: ["Oia", "Fira", "Red Beach", "Akrotiri"],
  },
};

/* 05.2. SELECT MODAL ELEMENTS */
const destinationModal = document.querySelector("#destination-modal");
const destinationModalImage = document.querySelector(
  ".destination-modal-image",
);
const destinationModalLocation = document.querySelector(
  ".destination-modal-location",
);
const destinationModalTitle = document.querySelector(
  ".destination-modal-title",
);
const destinationModalDescription = document.querySelector(
  ".destination-modal-description",
);
const modalBestSeason = document.querySelector(".modal-best-season");
const modalDuration = document.querySelector(".modal-duration");
const modalPrice = document.querySelector(".modal-price");
const modalAttractionsList = document.querySelector(".modal-attractions-list");
const destinationModalClose = document.querySelector(
  ".destination-modal-close",
);
const destinationModalOverlay = document.querySelector(
  ".destination-modal-overlay",
);

/* 05.3. OPEN DESTINATION MODAL */
if (
  destinationModal &&
  destinationModalImage &&
  destinationModalLocation &&
  destinationModalTitle &&
  destinationModalDescription &&
  modalBestSeason &&
  modalDuration &&
  modalPrice &&
  modalAttractionsList &&
  destinationModalClose &&
  destinationModalOverlay
) {
  let lastFocusedElement = null;

  const openDestinationModal = (destinationId, triggerButton) => {
    const destination = destinationDetails[destinationId];

    // Check whether destination data exists
    if (!destination) {
      console.error("Destination not found:", destinationId);
      return;
    }

    // Save the element that opened the modal
    lastFocusedElement = triggerButton;

    // Update destination information
    const destinationCard = document.querySelector(
      `.destination-card[data-destination="${destinationId}"]`,
    );

    const cardImage = destinationCard?.querySelector(".destination-image");

    if (cardImage) {
      destinationModalImage.src = cardImage.currentSrc || cardImage.src;
    }
    destinationModalImage.alt = destination.name;
    destinationModalLocation.textContent = destination.location;
    destinationModalTitle.textContent = destination.name;
    destinationModalDescription.textContent = destination.description;
    modalBestSeason.textContent = destination.bestSeason;
    modalDuration.textContent = destination.duration;
    modalPrice.textContent = destination.price;

    // Remove previous attractions
    modalAttractionsList.replaceChildren();

    // Add new attractions
    destination.attractions.forEach((attraction) => {
      const listItem = document.createElement("li");
      listItem.textContent = attraction;
      modalAttractionsList.appendChild(listItem);
    });

    // Display modal
    destinationModal.classList.add("active");
    destinationModal.setAttribute("aria-hidden", "false");

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    // Move keyboard focus into the modal
    destinationModalClose.focus();
  };

  /* 05.4. CLOSE DESTINATION MODAL */
  const closeDestinationModal = () => {
    if (!destinationModal.classList.contains("active")) {
      return;
    }

    destinationModal.classList.remove("active");
    destinationModal.setAttribute("aria-hidden", "true");

    // Restore background scrolling
    document.body.style.overflow = "";

    // Return focus to the button that opened the modal
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  /* 05.5. DESTINATION DETAILS BUTTONS */
  const destinationDetailsButtons = document.querySelectorAll(
    ".destination-details-btn",
  );

  destinationDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const destinationId = button.dataset.destination;
      openDestinationModal(destinationId, button);
    });
  });

  /* 05.6. CLOSE BUTTON AND OVERLAY */
  destinationModalClose.addEventListener("click", closeDestinationModal);
  destinationModalOverlay.addEventListener("click", closeDestinationModal);

  /* 05.7. CLOSE WITH ESCAPE KEY */
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      destinationModal.classList.contains("active")
    ) {
      closeDestinationModal();
    }
  });
}

/* ===================== 06. TRAVEL PLANNER MODAL ===================== */

/* 06.1. SELECT MODAL ELEMENTS */
const travelPlannerModal = document.querySelector("#travel-planner-modal");
const travelPlannerForm = document.querySelector("#travel-planner-form");
const travelPlannerClose = document.querySelector(".travel-planner-close");
const travelPlannerOverlay = document.querySelector(".travel-planner-overlay");
const plannerDeparture = document.querySelector("#planner-departure");
const plannerReturn = document.querySelector("#planner-return");
const plannerFormMessage = document.querySelector("#planner-form-message");

/* 06.2. CHECK REQUIRED ELEMENTS */
if (
  travelPlannerModal &&
  travelPlannerForm &&
  travelPlannerClose &&
  travelPlannerOverlay &&
  plannerDeparture &&
  plannerReturn &&
  plannerFormMessage
) {
  let lastPlannerTrigger = null;

  /* 06.3. DATE MANAGEMENT */
  const getPlannerToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayDate = getPlannerToday();

  plannerDeparture.min = todayDate;
  plannerReturn.min = todayDate;

  plannerDeparture.addEventListener("change", () => {
    const departureDate = plannerDeparture.value;
    plannerReturn.min = departureDate || todayDate;

    if (
      plannerReturn.value &&
      departureDate &&
      plannerReturn.value < departureDate
    ) {
      plannerReturn.value = "";
    }
  });

  /* 06.4. OPEN TRAVEL PLANNER */
  const openTravelPlanner = (triggerButton) => {
    lastPlannerTrigger = triggerButton;

    travelPlannerModal.classList.add("active");
    travelPlannerModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    plannerFormMessage.textContent = "";
    travelPlannerClose.focus();
  };

  /* 06.5. CLOSE TRAVEL PLANNER */
  const closeTravelPlanner = () => {
    if (!travelPlannerModal.classList.contains("active")) {
      return;
    }
    travelPlannerModal.classList.remove("active");
    travelPlannerModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
    if (lastPlannerTrigger) {
      lastPlannerTrigger.focus();
    }
  };

  /* 06.6. OPEN BUTTONS */
  const plannerOpenButtons = document.querySelectorAll(
    ".plan-trip-btn, .hero-secondary-btn, .modal-plan-trip-btn",
  );
  plannerOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Close Destination Details Modal if it is open
      const destinationModal = document.querySelector("#destination-modal");

      if (destinationModal?.classList.contains("active")) {
        const destinationCloseButton = document.querySelector(
          ".destination-modal-close",
        );
        destinationCloseButton?.click();
      }
      openTravelPlanner(button);
    });
  });

  /* 06.7. CLOSE BUTTON AND OVERLAY */
  travelPlannerClose.addEventListener("click", closeTravelPlanner);
  travelPlannerOverlay.addEventListener("click", closeTravelPlanner);

  /* 06.8. CLOSE WITH ESCAPE KEY */
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      travelPlannerModal.classList.contains("active")
    ) {
      closeTravelPlanner();
    }
  });

  /* 06.9. FORM SUBMISSION */
  travelPlannerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!travelPlannerForm.checkValidity()) {
      travelPlannerForm.reportValidity();
      return;
    }

    const departureDate = plannerDeparture.value;
    const returnDate = plannerReturn.value;

    if (departureDate < todayDate || returnDate < departureDate) {
      plannerFormMessage.textContent = "Please select valid travel dates.";
      return;
    }

    const adults = Number(document.querySelector("#planner-adults").value);

    const children = Number(document.querySelector("#planner-children").value);

    if (
      !Number.isInteger(adults) ||
      !Number.isInteger(children) ||
      adults < 1 ||
      children < 0
    ) {
      plannerFormMessage.textContent = "Please enter valid traveler numbers.";
      return;
    }

    plannerFormMessage.textContent =
      "Your travel request has been prepared successfully!";

    plannerFormMessage.classList.add("success");
  });
}

/* ===================== 09. NEWSLETTER FORM ===================== */
const newsletterForm = document.getElementById("newsletter-form");
const newsletterEmail = document.getElementById("newsletter-email");
const newsletterMessage = document.getElementById("newsletter-message");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = newsletterEmail.value.trim();

    // EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      newsletterMessage.textContent = "Please enter a valid email address.";
      newsletterMessage.style.color = "#ffb4b4";
      return;
    }

    // GET SAVED EMAILS
    let subscribers =
      JSON.parse(localStorage.getItem("voyageSubscribers")) || [];

    // CHECK DUPLICATE EMAIL
    const alreadySubscribed = subscribers.some(
      (subscriber) => subscriber.toLowerCase() === email.toLowerCase(),
    );
    if (alreadySubscribed) {
      newsletterMessage.textContent = "This email is already subscribed!";
      newsletterMessage.style.color = "#ffd28a";
      return;
    }

    // SAVE EMAIL
    subscribers.push(email);
    localStorage.setItem("voyageSubscribers", JSON.stringify(subscribers));

    // SUCCESS MESSAGE
    newsletterMessage.textContent = "Thank you for subscribing to VOYAGE!";
    newsletterMessage.style.color = "#b8f2c8";

    // CLEAR INPUT
    newsletterForm.reset();
  });
}

/* ===================== 10. FAQ ACCORDION ===================== */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    // CLOSE ALL FAQ ITEMS
    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active");

      const faqQuestion = faqItem.querySelector(".faq-question");

      faqQuestion.setAttribute("aria-expanded", "false");
    });
    // OPEN SELECTED ITEM
    if (!isActive) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
    }
  });
});
