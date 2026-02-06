window.addEventListener("scroll", function () { let e = document.querySelector(".navbar"); console.log(e), e && (window.scrollY > 50 ? e.classList.add("scrolled") : e.classList.remove("scrolled")) }), document.addEventListener("DOMContentLoaded", function () {
  let loader = document.getElementById("loading-screen"),
    home = document.getElementById("home");

  // Minimum time the loader must stay visible for the "jaw-dropping" animation
  const minWait = 2500;

  setTimeout(() => {
    // Step 1: Trigger the panel slide-out in CSS
    loader.classList.add("hidden");

    // Step 2: Trigger the staggered hero entrance slightly after panels start moving
    setTimeout(() => {
      home.classList.add("hero-revealed");
    }, 300);

    // Step 3: Cleanup loader from DOM after panels fully finish sliding
    setTimeout(() => {
      loader.style.display = "none";
    }, 1500);
  }, minWait);

}), document.addEventListener("DOMContentLoaded", function () { let e = document.querySelectorAll(".reveal"); function t() { e.forEach(e => { let t = e.getBoundingClientRect().top, n = window.innerHeight; t < n - 80 ? e.classList.add("active") : e.classList.remove("active") }) } window.addEventListener("scroll", t), t() }); const cursor = document.querySelector(".cursor"); document.addEventListener("mousemove", e => { cursor.style.left = `${e.clientX}px`, cursor.style.top = `${e.clientY}px` }); const hoverElements = document.querySelectorAll(".hover-target"); hoverElements.forEach(e => { e.addEventListener("mouseover", () => { cursor.style.width = "130px", cursor.style.height = "130px", cursor.style.backgroundColor = "rgba(47, 213, 255, 0.69)" }), e.addEventListener("mouseleave", () => { cursor.style.width = "10px", cursor.style.height = "10px", cursor.style.backgroundColor = "transparent" }) }); const letters = document.querySelectorAll(".animated-title span"); let index = 0; function animateLetters() { letters.forEach(e => e.classList.remove("active")), letters[index].classList.add("active"), index = (index + 1) % letters.length, setTimeout(animateLetters, 1e3) } animateLetters(), document.getElementById("lottie-animation1").addEventListener("click", function () { let e = document.getElementById("about"); window.scrollTo({ top: e.offsetTop - 90, behavior: "smooth" }) }), document.getElementById("lottie-animation").addEventListener("click", function () { window.location.href = "#home" }); const chatbotWrapper = document.getElementById("chatbot-wrapper"), chatbot = chatbotWrapper.querySelector("#chatbotContainer"), chatbotBtn = chatbotWrapper.querySelector(".chatbot-button"); function toggleChatbot() { chatbot.classList.toggle("open"), chatbotBtn.classList.toggle("hidden", chatbot.classList.contains("open")) } document.addEventListener("click", (function (e) { !chatbot.classList.contains("open") || chatbot.contains(e.target) || chatbotBtn.contains(e.target) || (chatbot.classList.remove("open"), chatbotBtn.classList.remove("hidden")) })); const faqAnswers = {
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

function handleEnter(event) {
  if (event.key === 'Enter') {
    askOpenAI();
  }
}
(function () {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  document.body.classList.add('use-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);
  document.body.appendChild(dot);


  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  function raf() {
    ringX = lerp(ringX, mouseX, 0.16);
    ringY = lerp(ringY, mouseY, 0.16);
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(raf);
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  }, { passive: true });


  requestAnimationFrame(raf);


  window.addEventListener('mousedown', (e) => {
    const pulse = document.createElement('div');
    pulse.className = 'click-pulse';
    pulse.style.left = e.clientX + 'px';
    pulse.style.top = e.clientY + 'px';
    document.body.appendChild(pulse);
    pulse.addEventListener('animationend', () => pulse.remove());
  });

  const hoverSelectors = ['a', 'button', '[role="button"]', 'input', 'select', 'textarea', '[data-hover]'];
  let hoverCount = 0;
  function onEnter() {
    if (++hoverCount === 1) { document.body.classList.add('cursor--hover'); }
  }
  function onLeave() {
    if (hoverCount > 0 && --hoverCount === 0) { document.body.classList.remove('cursor--hover'); }
  }
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors.join(','))) onEnter();
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors.join(','))) onLeave();
  });
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
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
document.addEventListener("DOMContentLoaded", function () {
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
