// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Synchronize Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.addEventListener("scroll", function () { let e = document.querySelector(".navbar"); e && (window.scrollY > 50 ? e.classList.add("scrolled") : e.classList.remove("scrolled")) }), document.addEventListener("DOMContentLoaded", function () {
  let loader = document.getElementById("loading-screen"),
    home = document.getElementById("home");

  // Minimum time the loader must stay visible for the "jaw-dropping" animation
  const minWait = 2500;

  setTimeout(() => {
    // Step 1: Trigger the panel slide-out in CSS
    loader.classList.add("hidden");

    // Step 2: Trigger the staggered hero entrance and nav items
    setTimeout(() => {
      home.classList.add("hero-revealed");
      // Staggered entrance for navbar items
      gsap.from(".navbar-brand, .nav-item, .nav-whatsapp-btn", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, 300);

    // Step 3: Cleanup loader from DOM after panels fully finish sliding
    setTimeout(() => {
      loader.style.display = "none";
    }, 1500);
  }, minWait);

  // Reverted Reveal Logic (Manual CSS class toggle)
  const revealElements = document.querySelectorAll(".reveal");
  function checkReveal() {
    revealElements.forEach(el => {
      let top = el.getBoundingClientRect().top;
      let windowHeight = window.innerHeight;
      if (top < windowHeight - 80) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }
  checkReveal();
  window.addEventListener("scroll", checkReveal);
  lenis.on('scroll', checkReveal);
  const letters = document.querySelectorAll(".animated-title span");
  let index = 0;
  function animateLetters() {
    letters.forEach(e => e.classList.remove("active")),
      letters[index].classList.add("active"),
      index = (index + 1) % letters.length,
      setTimeout(animateLetters, 1e3)
  }
  animateLetters();

  document.getElementById("lottie-animation1").addEventListener("click", function () {
    let e = document.getElementById("about");
    window.scrollTo({ top: e.offsetTop - 90, behavior: "smooth" })
  });

  document.getElementById("lottie-animation").addEventListener("click", function () {
    window.location.href = "#home"
  });

  const chatbotWrapper = document.getElementById("chatbot-wrapper");
  const chatbotContainer = chatbotWrapper.querySelector("#chatbotContainer");
  const chatbotBtn = chatbotWrapper.querySelector(".chatbot-button");
  const chatbotCloseBtn = chatbotWrapper.querySelector(".btn-close");

  function toggleChatbot() {
    chatbotContainer.classList.toggle("open");
    chatbotBtn.classList.toggle("hidden", chatbotContainer.classList.contains("open"));
  }

  chatbotBtn.addEventListener("click", toggleChatbot);
  if (chatbotCloseBtn) chatbotCloseBtn.addEventListener("click", toggleChatbot);

  // Send message on button click
  const sendBtn = chatbotWrapper.querySelector(".send-btn");
  if (sendBtn) sendBtn.addEventListener("click", askOpenAI);

  // Send message on Enter key
  const questionInput = chatbotWrapper.querySelector("#question");
  if (questionInput) {
    questionInput.addEventListener("keypress", function (event) {
      if (event.key === 'Enter') {
        askOpenAI();
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (chatbotContainer.classList.contains("open") &&
      !chatbotContainer.contains(e.target) &&
      !chatbotBtn.contains(e.target)) {
      chatbotContainer.classList.remove("open");
      chatbotBtn.classList.remove("hidden");
    }
  });
  const faqAnswers = {
    "bot_identity": "I am a smart chatbot assistant designed to help you navigate this portfolio and learn more about Muhammad Imdadullah's work!",
    "bot_name": "I don't have a human name, but you can call me your Portfolio Assistant!",
    "owner_info": "Muhammad Imdadullah is a passionate CS student and a skilled front-end developer specializing in creating responsive, modern websites and UI designs.",
    "owner_experience": "Imdadullah has 1 year of experience in front-end development, working on various personal and freelance projects including responsive websites and UI applications.",
    "services": "Imdadullah offers front-end web development, responsive website creation, portfolio design, and chatbot integration. He also provides UI design services using Figma, Canva, and Photoshop.",
    "technologies": "He works with HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, and GitHub for front-end development.",
    "portfolio": "You can check out Imdadullah's work at <a href='https://imdadullahbootstrap.vercel.app/' target='_blank'>his portfolio link</a>.",
    "contact": "You can contact Muhammad Imdadullah through the Contact section on this website or email him directly at <a href='mailto:imdadullahchishti@gmail.com'>imdadullahchishti@gmail.com</a>.",
    "freelance": "Yes, Imdadullah takes freelance projects and is available for hire! Feel free to reach out via the contact form or email.",
    "hi": "Hello! How can I assist you today?",
    "hello": "Hi there! How can I help you learn about Imdadullah?",
    "thanks": "You're very welcome! If you have more questions about Imdadullah or his work, just ask!",
    "bye": "Goodbye! Have a great day! Feel free to come back if you have more questions.",
    "help": "I can tell you about Imdadullah's skills, services, experience, and contact details. What would you like to know?"
  };

  const faqVariants = {
    "bot_identity": ["who are you", "what are you", "your identity", "are you human", "who r u"],
    "bot_name": ["what is your name", "ur name", "name", "call you"],
    "owner_info": ["who is imdadullah", "tell me about imdadullah", "muhammad imdadullah", "about owner", "tell me about yourself", "about you", "who is the owner", "describe yourself", "myself"],
    "owner_experience": ["experience", "how much experience", "work history", "long have you been working", "projects"],
    "services": ["what services", "what can you do", "skills", "what do you do", "expertise", "what work"],
    "technologies": ["tech stack", "languages", "what tools", "frameworks", "technologies"],
    "portfolio": ["portfolio", "see your work", "projects", "show me your work", "website links"],
    "contact": ["contact", "email", "reach you", "get in touch"],
    "freelance": ["hire", "freelance", "work with you", "available for hire", "hiring"],
    "hi": ["hi", "hello", "hey", "greetings", "hi there", "hello there"],
    "thanks": ["thanks", "thank you", "thx", "appreciate"],
    "bye": ["bye", "goodbye", "see you", "farewell"],
    "help": ["help", "assistance", "what can i ask", "support"]
  };// Chatbot Logic
  function askOpenAI() {
    const inputField = chatbotWrapper.querySelector("#question");
    const question = inputField.value.trim().toLowerCase();
    const chatMessages = chatbotWrapper.querySelector("#chatMessages");

    if (!question) return;

    // Append User Message
    appendMessage(inputField.value, 'user-message');
    inputField.value = "";

    // Simulate Typing
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message text-muted fst-italic';
    typingIndicator.id = 'typingIndicator';
    typingIndicator.innerHTML = '<i class="fas fa-ellipsis-h"></i> Typing...';
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();

    // Find Answer
    let answer = null;
    const normalizedQuestion = question.replace(/[?.,!]/g, "").trim();

    if (faqAnswers[normalizedQuestion]) {
      answer = faqAnswers[normalizedQuestion];
    } else {
      for (const key in faqVariants) {
        if (faqVariants[key].some(variant => normalizedQuestion.includes(variant))) {
          answer = faqAnswers[key];
          break;
        }
      }
    }

    // Delay response slightly for realism
    setTimeout(() => {
      // Remove typing indicator
      const indicator = document.getElementById('typingIndicator');
      if (indicator) indicator.remove();

      // Append Bot Response
      const responseText = answer || "Sorry, I don't have an answer for that. Please try another question.";
      appendMessage(responseText, 'bot-message');
    }, 600);
  }

  // Update anchor links to use Lenis scrollTo
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      if (target === '#') return;
      lenis.scrollTo(target, {
        offset: -70,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    });
  });

  function appendMessage(text, className) {
    const chatMessages = chatbotWrapper.querySelector("#chatMessages");
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = text; // using innerHTML to allow basic formatting if needed
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    const chatMessages = chatbotWrapper.querySelector("#chatMessages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // New GSAP Custom Cursor Implementation
  (function () {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    document.body.classList.add('use-custom-cursor');

    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    let cursorX = gsap.quickTo(cursor, "left", { duration: 0.4, ease: "power3" });
    let cursorY = gsap.quickTo(cursor, "top", { duration: 0.4, ease: "power3" });
    let dotX = gsap.quickTo(dot, "left", { duration: 0.1, ease: "power3" });
    let dotY = gsap.quickTo(dot, "top", { duration: 0.1, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      cursorX(e.clientX);
      cursorY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    });

    // Hover effect for links and buttons
    const hoverElements = 'a, button, .hover-target, .btn, input, textarea';
    document.querySelectorAll(hoverElements).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add('hovering');
        gsap.to(cursor, {
          scale: 3.5,
          duration: 0.6,
          ease: "expo.out",
          borderColor: "rgba(255, 255, 255, 1)",
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.4)"
        });
        gsap.to(dot, { scale: 0, duration: 0.3, ease: "power2.in" });
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove('hovering');
        gsap.to(cursor, {
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          borderColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)"
        });
        gsap.to(dot, { scale: 1, duration: 0.4, ease: "power2.out" });
      });
    });

    // Handle click pulse
    window.addEventListener("mousedown", (e) => {
      const pulse = document.createElement("div");
      pulse.className = "click-pulse";
      pulse.style.left = e.clientX + "px";
      pulse.style.top = e.clientY + "px";
      document.body.appendChild(pulse);
      pulse.addEventListener("animationend", () => pulse.remove());
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
    });
    document.addEventListener("mouseenter", () => {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
    });
  })();
  const cubes = document.querySelectorAll(".cube");

  cubes.forEach(cube => {
    let size = Math.floor(Math.random() * 11) + 40;

    cube.parentElement.style.width = size + "px";
    cube.parentElement.style.height = size + "px";

    cube.querySelectorAll(".face").forEach(face => {
      face.style.width = size + "px";
      face.style.height = size + "px";
    });

    let half = size / 2;
    cube.querySelector(".front").style.transform = `translateZ(${half}px)`;
    cube.querySelector(".back").style.transform = `rotateY(180deg) translateZ(${half}px)`;
    cube.querySelector(".left").style.transform = `rotateY(-90deg) translateZ(${half}px)`;
    cube.querySelector(".right").style.transform = `rotateY(90deg) translateZ(${half}px)`;
    cube.querySelector(".top").style.transform = `rotateX(90deg) translateZ(${half}px)`;
    cube.querySelector(".bottom").style.transform = `rotateX(-90deg) translateZ(${half}px)`;

    let duration = (Math.random() * 3 + 2).toFixed(2) + "s";
    let delay = (Math.random() * 2).toFixed(2) + "s";
    cube.style.animationDuration = duration;
    cube.style.animationDelay = delay;
  });

  // Hamburger Menu Logic
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".nav-link");

  // Close on click outside
  document.addEventListener("click", function (event) {
    if (navbarCollapse.classList.contains("show") &&
      !navbarCollapse.contains(event.target) &&
      !navbarToggler.contains(event.target)) {
      new bootstrap.Collapse(navbarCollapse).hide();
    }
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
    });
  });
});
