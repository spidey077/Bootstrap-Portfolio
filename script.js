window.addEventListener("scroll", function () { let e = document.querySelector(".navbar"); console.log(e), e && (window.scrollY > 50 ? e.classList.add("scrolled") : e.classList.remove("scrolled")) }), document.addEventListener("DOMContentLoaded", function () { let e = document.getElementById("loading-screen"), t = document.getElementById("content"); e.classList.add("hidden"), t.classList.add("show"), setTimeout(() => { e.style.display = "none" }, 3e3) }), document.addEventListener("DOMContentLoaded", function () { let e = document.querySelectorAll(".reveal"); function t() { e.forEach(e => { let t = e.getBoundingClientRect().top, n = window.innerHeight; t < n - 80 ? e.classList.add("active") : e.classList.remove("active") }) } window.addEventListener("scroll", t), t() }); const cursor = document.querySelector(".cursor"); document.addEventListener("mousemove", e => { cursor.style.left = `${e.clientX}px`, cursor.style.top = `${e.clientY}px` }); const hoverElements = document.querySelectorAll(".hover-target"); hoverElements.forEach(e => { e.addEventListener("mouseover", () => { cursor.style.width = "130px", cursor.style.height = "130px", cursor.style.backgroundColor = "rgba(47, 213, 255, 0.69)" }), e.addEventListener("mouseleave", () => { cursor.style.width = "10px", cursor.style.height = "10px", cursor.style.backgroundColor = "transparent" }) }); const letters = document.querySelectorAll(".animated-title span"); let index = 0; function animateLetters() { letters.forEach(e => e.classList.remove("active")), letters[index].classList.add("active"), index = (index + 1) % letters.length, setTimeout(animateLetters, 1e3) } animateLetters(), document.getElementById("lottie-animation1").addEventListener("click", function () { let e = document.getElementById("about"); window.scrollTo({ top: e.offsetTop - 90, behavior: "smooth" }) }), document.getElementById("lottie-animation").addEventListener("click", function () { window.location.href = "#home" }); const chatbotWrapper = document.getElementById("chatbot-wrapper"), chatbot = chatbotWrapper.querySelector("#chatbotContainer"), chatbotBtn = chatbotWrapper.querySelector(".chatbot-button"); function toggleChatbot() { chatbot.classList.toggle("open"), chatbotBtn.classList.toggle("hidden", chatbot.classList.contains("open")) } document.addEventListener("click", (function (e) { !chatbot.classList.contains("open") || chatbot.contains(e.target) || chatbotBtn.contains(e.target) || (chatbot.classList.remove("open"), chatbotBtn.classList.remove("hidden")) })); const faqAnswers = {
  "what services do you offer": "I offer front-end web development, responsive website creation, and portfolio design and FAQ chatbot website integration. I also provide UI design services using tools like Figma, Canva, and Photoshop.",
  "how can i contact you": "You can contact me through the Contact section on my website or email me directly at imdadullahchishti@gmail.com.",
  "do you create websites": "Yes, I specialize in creating responsive and modern websites using HTML, CSS, JavaScript, and frameworks like Bootstrap and Tailwind CSS.",
  "do you create mobile-friendly websites": "Yes, all websites I build are fully responsive and optimized for mobile, tablet, and desktop devices.",
  "what is your name": "I'm Muhammad Imdadullah, a passionate and skilled front-end developer.",
  "who are you": "I'm Muhammad Imdadullah, a CS student and a front-end developer specializing in creating responsive and modern websites.",
  "who is imdadullah": "Muhammad Imdadullah is a dedicated front-end developer and CS student who specializes in creating responsive websites, portfolio designs, and chatbot integrations.",
  "what do you do": "I develop front-end websites, design user interfaces, and integrate chatbots. I also provide UI design services using Figma, Canva, and Photoshop.",
  "do you do freelancing": "Yes, I take freelance projects and am available for hire. You can contact me via email or the contact form on my website.",
  "which technologies do you use": "I work with HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, and GitHub for front-end development.",
  "which skills do you have": "I have skills in front-end development, responsive design, UI/UX design, and chatbot integration.",
  "can i see your portfolio": "Absolutely! You can check out my work at https://imdadullahbootstrap.vercel.app/",
  "can i hire you": "Yes, you can hire me for your next project. Please contact me via the contact form or email me at imdadullahchishti@gmail.com.",
  "do you design user interfaces": "Yes, I use tools like Figma, Photoshop, and Canva to design clean and modern user interfaces before development.",
  "do you offer website maintenance": "Yes, I provide website maintenance services to keep your site updated and secure.",
  "do you offer web design services": "Yes, I offer full front-end web design services including layout, responsiveness, and aesthetics.",
  "can i hire you for my project": "Yes! Please reach out via the contact form or email me at imdadullahchishti@gmail.com so we can discuss your project requirements.",
  "what is your experience": "I have 1 year of experience in front-end development, working on various personal projects including responsive websites, UI design, and web applications.",
  "hi": "Hello! How can I assist you today?",
  "hello": "Hi there! How can I help you?",
  "help": "Sure! What do you need help with?",
  "thanks": "You're welcome! Let me know if you have any other questions.",
  "thank you": "You're welcome! Feel free to ask anything else.",
  "bye": "Goodbye! If you have more questions later, feel free to ask.",
  "goodbye": "Goodbye! Have a great day!",
  "tell me about yourself": "I'm just a chatbot, but thank you for asking! How can I assist you?"
};

const faqVariants = {
  "what services do you offer": [
    "what services do you provide",
    "which services do you offer",
    "which services do you provide",
    "tell me about your services",
    "what kind of services do you offer",
    "what can you do",
    "what are your services",
    "services you offer"
  ],

  "how can i contact you": [
    "how do i contact you",
    "how to contact you",
    "what is your contact",
    "contact details",
    "how can i reach you",
    "how do i get in touch with you",
    "your email",
    "contact info"
  ],

  "do you create websites": [
    "can you create websites",
    "do you build websites",
    "can you build websites",
    "do you make websites",
    "can you make websites",
    "are you a website developer",
    "website development",
    "build websites"
  ],

  "do you create mobile-friendly websites": [
    "do you make mobile-friendly websites",
    "do you build responsive websites",
    "are your websites mobile-friendly",
    "can you create responsive websites",
    "do you design mobile optimized sites",
    "mobile friendly websites",
    "mobile optimized websites"
  ],

  "what is your name": [
    "who are you",
    "tell me your name",
    "may i know your name",
    "what should i call you",
    "your name"
  ],

  "who is imdadullah": [
    "who is imdadullah",
    "tell me about imdadullah",
    "who are you",
    "what do you do",
    "introduce yourself",
    "about you"
  ],

  "do you do freelancing": [
    "do you do freelancing",
    "are you a freelancer",
    "do you work as freelancer",
    "can i hire you",
    "freelance work",
    "freelancer services",
    "freelancing available"
  ],

  "what do you do": [
    "what do you do",
    "what is your profession",
    "what is your job",
    "what work do you do",
    "tell me about your work",
    "your profession"
  ],

  "which technologies do you use": [
    "what technologies do you use",
    "which tools do you use",
    "what programming languages do you know",
    "what tech stack do you work with",
    "which frameworks do you use",
    "tech skills",
    "programming languages"
  ],

  "which skills do you have": [
    "what skills do you have",
    "tell me your skills",
    "what are your skills",
    "what can you do",
    "what technologies do you know",
    "skills list",
    "your expertise"
  ],

  "can i see your portfolio": [
    "show me your portfolio",
    "can i view your portfolio",
    "where can i see your work",
    "do you have a portfolio",
    "can i check your portfolio",
    "portfolio link"
  ],

  "can i hire you": [
    "can i work with you",
    "are you available for hire",
    "can i hire you for a project",
    "do you take projects",
    "can i get your services",
    "hire you",
    "available for work"
  ],

  "do you design user interfaces": [
    "do you do UI design",
    "can you design user interfaces",
    "are you a UI designer",
    "do you create UI designs",
    "can you design interfaces",
    "user interface design",
    "ui/ux design"
  ],

  "do you offer website maintenance": [
    "do you provide website maintenance",
    "do you maintain websites",
    "can you keep websites updated",
    "do you offer site maintenance",
    "website maintenance services",
    "website updates",
    "site maintenance"
  ],

  "do you offer web design services": [
    "do you provide web design",
    "do you do website design",
    "can you design websites",
    "are web design services available",
    "do you offer front-end design",
    "web design",
    "website design services"
  ],
  "can i hire you for my project": [
    "can i hire you for a project",
    "are you available for projects",
    "can you do my project",
    "can i get you for my project",
    "do you take freelance projects",
    "hire for project",
    "project work"
  ],
  "what is your experience": [
    "how much experience do you have",
    "tell me about your experience",
    "what experience do you have",
    "how long have you been working",
    "what projects have you done",
    "experience in development",
    "your work history"
  ],
  "hi": [
    "hello",
    "hey",
    "hi there",
    "hey there",
    "good morning",
    "good afternoon",
    "good evening"
  ],
  "help": [
    "i need help",
    "can you help me",
    "help me please",
    "need assistance",
    "can you assist me"
  ],
  "thanks": [
    "thank you",
    "thanks a lot",
    "thanks so much",
    "thank you very much",
    "thx",
    "thank you!"
  ],
  "bye": [
    "goodbye",
    "see you",
    "see you later",
    "talk to you later",
    "bye bye",
    "bye",
    "farewell"
  ],
  "how are you": [
    "how do you do",
    "how's it going",
    "how are you doing",
    "how are you today",
    "how r u",
    "how you doing"
  ]
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
  if (faqAnswers[question]) {
    answer = faqAnswers[question];
  } else {
    for (const key in faqVariants) {
      if (key === question || faqVariants[key].some(variant => question.includes(variant))) {
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
