(function () {
  // Create and inject styles
  const style = document.createElement("style");
  style.textContent = `
    .chatbot-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #a855f7;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
      border: none;
      z-index: 999999;
      color: white;
    }

    .chatbot-widget-button:hover {
      transform: scale(1.1);
    }

    .chatbot-widget-icon {
      width: 30px;
      height: 30px;
      fill: white;
    }

    .chatbot-widget-container {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      z-index: 999999;
      overflow: hidden;
      display: none;
    }

    .chatbot-widget-container.open {
      display: block;
    }

    .chatbot-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background-color: white;
    }
  `;
  document.head.appendChild(style);

  // Create chat button
  const button = document.createElement("button");
  button.className = "chatbot-widget-button";
  button.innerHTML = `
    <svg class="chatbot-widget-icon" viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  `;

  // Create chat container
  const container = document.createElement("div");
  container.className = "chatbot-widget-container";

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.className = "chatbot-widget-iframe";
  iframe.src = `http://localhost:3000/widget?chatbotId=${window.chatbotId}`;

  container.appendChild(iframe);

  // Add elements to page
  document.body.appendChild(button);
  document.body.appendChild(container);

  // Toggle chat
  button.addEventListener("click", () => {
    container.classList.toggle("open");
  });

  // Add message listener for close events
  window.addEventListener("message", (event) => {
    if (event.data === "close-chat") {
      container.classList.remove("open");
    }
  });
})();
