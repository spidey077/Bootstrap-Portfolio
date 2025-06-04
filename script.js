const chatbotWrapper = document.getElementById("chatbot-wrapper");
    const chatbot = chatbotWrapper.querySelector("#chatbotContainer");
    const chatbotBtn = chatbotWrapper.querySelector(".chatbot-button");

    // Toggle chatbot visibility
    function toggleChatbot() {
      if (chatbot.style.display === "block") {
        chatbot.style.display = "none";
      } else {
        chatbot.style.display = "block";
      }
    }

    // Close chatbot when clicking outside of it
  document.addEventListener("click", function (event) {
  // Close chatbot if open and clicked outside chatbot or button
  if (
    chatbot.classList.contains("open") &&
    !chatbot.contains(event.target) &&
    !chatbotBtn.contains(event.target)
  ) {
    chatbot.classList.remove("open");
  }
});

    async function askOpenAI() {
      const question = chatbotWrapper.querySelector("#question").value;
      const responseDiv = chatbotWrapper.querySelector("#response");
      responseDiv.innerHTML = "Thinking...";
      responseDiv.style.display = "block";

      const faqAnswers = {
        "what services do you offer": "I offer front-end web development, responsive website creation, and portfolio design and FAQ chatbot website integration. I also provide UI design services using tools like Figma, Canva, and Photoshop.",
        "how can i contact you": "You can contact me through the Contact section on my website or email me directly at imdadullahchishti@gmail.com.",
        "do you create websites": "Yes, I specialize in creating responsive and modern websites using HTML, CSS, JavaScript, and frameworks like Bootstrap and Tailwind CSS.",
        "do you create mobile-friendly websites": "Yes, all websites I build are fully responsive and optimized for mobile, tablet, and desktop devices.",
        "what is your name": "I'm Muhammad Imdadullah, a passionate and skilled front-end developer.",
        "who are you": "I'm Muhammad Imdadullah, a CS student and a front-end developer specializing in creating responsive and modern websites.",
        "which technologies do you use": "I work with HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, and GitHub for front-end development.",
        "which skills do you have": "I work with HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, and GitHub for front-end development.",
        "can i see your portfolio": "Absolutely! You can check out my work at https://imdadullahbootstrap.vercel.app/",
        "can i hire you": "Yes, you can hire me for your next project. Please contact me via the contact form or email me at imdadullahchishti@gmail.com.",
        "do you design user interfaces": "Yes, I use tools like Figma, Photoshop, and Canva to design clean and modern UIs before development.",
        "do you offer website maintenance": "Yes, I provide website maintenance services to ensure your site remains up-to-date and secure.",
        "do you offer web design services": "Yes, I offer complete front-end web design services including layout, responsiveness, and aesthetics.",
        "can i hire you for my project": "Yes! Please reach out via the contact form or email me at imdadullahchishti@gmail.com, so we can discuss your project requirements.",
        "what is your experience": "I have an experience of 1 year in front-end development, having worked on various personal projects that include responsive websites, UI design, and web applications.",
        "hi": "Hello! How can I assist you today?",
        "hello": "Hi there! How can I help you?",
        "help": "Sure! What do you need help with?",
        "thanks": "You're welcome! Let me know if you have any other questions.",
        "thank you": "You're welcome! Feel free to ask anything else.",
        "bye": "Goodbye! If you have more questions later, feel free to ask.",
        "goodbye": "Goodbye! Have a great day!",
        "how are you": "I'm just a chatbot, but thank you for asking! How can I assist you?"
      };

      const match = Object.keys(faqAnswers).find(q => question.toLowerCase().includes(q));
      if (match) {
        responseDiv.innerHTML = "<strong>Answer:</strong><br>" + faqAnswers[match];
        return;
      }

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant specialized in answering questions about Muhammad Imdadullah and his services."
              },
              {
                role: "user",
                content: question
              }
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        });

        const data = await res.json();
        if (data.choices && data.choices.length > 0) {
          responseDiv.innerHTML = data.choices[0].message.content;
        } else {
          responseDiv.innerHTML = "Sorry, I couldn't get an answer right now.";
        }
      } catch (error) {
        responseDiv.innerHTML = "Error: " + error.message;
      }
    }
     function toggleChatbot() {
    chatbot.classList.toggle("open");
  }
