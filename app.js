// ── MIRROR AI Campus Assistant — app.js ──

let lastTopic = null;

// Load reminders from localStorage (persists across page refreshes)
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// Student profile data
const studentProfile = {
  name: "Otieno Jonathan Daniels",
  regNo: "24ZAD109298",
  course: "Diploma in Computer Science"
};

// ── Fill the input field from sidebar quick links ──
function fillInput(text) {
  document.getElementById("userInput").value = text;
  document.getElementById("userInput").focus();
}

// ── Handle chip button clicks ──
function sendChip(el) {
  // Strip the emoji prefix before the first space
  const text = el.textContent.replace(/^[^\s]+\s/, "").trim();
  document.getElementById("userInput").value = text;
  sendMessage();
}

// ── Main send function ──
function sendMessage() {
  const input   = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();

  if (!message) return;

  // Remove quick-action chips once user sends their first message
  const chips = chatBox.querySelector(".chips");
  if (chips) chips.remove();

  // Render user bubble
  appendMessage("user", message);
  input.value = "";

  // Show typing indicator
  document.getElementById("typingRow").style.display = "flex";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulate MIRROR "thinking" then respond
  setTimeout(() => {
    document.getElementById("typingRow").style.display = "none";
    appendMessage("bot", getResponse(message));
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 900);
}

// ── Append a message bubble to the chat box ──
function appendMessage(role, text) {
  const chatBox = document.getElementById("chatBox");

  const wrap = document.createElement("div");
  wrap.className = `message ${role === "bot" ? "bot-message-wrap" : "user-message-wrap"}`;

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = role === "bot" ? "🪞" : "🎓";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ── Intent matching & response engine ──
function getResponse(msg) {
  const m = msg.toLowerCase();

  /* GREETING */
  if (m.includes("hi") || m.includes("hello") || m.includes("hey")) {
    lastTopic = "greeting";
    return "Hello! 😊 Great to see you. What can I help you with today?";
  }

  /* SET A REMINDER */
  if (m.includes("remind me")) {
    lastTopic = "reminder";
    const reminderText = msg.replace(/remind me/i, "").trim();

    if (reminderText.length > 0) {
      reminders.push(reminderText);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      return `⏰ Done! I've saved your reminder:\n"${reminderText}"\n\nYou can view all reminders on the Dashboard.`;
    }
    return "⏰ What would you like me to remind you about?";
  }

  /* VIEW REMINDERS */
  if (m.includes("my reminders") || m.includes("show reminders") || m.includes("reminders")) {
    if (reminders.length === 0) {
      return "📭 You don't have any reminders yet. Try saying \"Remind me to...\"";
    }
    return "📌 Your Reminders:\n" + reminders.map((r, i) => `${i + 1}. ${r}`).join("\n");
  }

  /* ASSIGNMENTS */
  if (m.includes("assignment")) {
    lastTopic = "assignment";
    return "📚 You have an assignment due this Friday at 11:59 PM.\n\nMake sure to start early! Need me to set a reminder?";
  }

  /* SCHEDULE / CLASSES */
  if (m.includes("class") || m.includes("schedule")) {
    lastTopic = "schedule";
    return "🕘 Today's Schedule:\n• 10:00 AM — Data Structures (LH-B)\n• 2:00 PM — Web Development (LH-A)\n\nAny classes you'd like more details about?";
  }

  /* STUDENT PROFILE */
  if (m.includes("profile") || m.includes("my details") || m.includes("my profile")) {
    return `👤 Your Profile\n\nName: ${studentProfile.name}\nReg No: ${studentProfile.regNo}\nCourse: ${studentProfile.course}\nStatus: Active Student`;
  }

  /* FALLBACK */
  const fallback = [
    "Hmm, I'm not quite sure about that 🤔 Could you rephrase?",
    "I'm still learning new things! Try asking about your schedule, assignments, or reminders.",
    "That's interesting! Could you give me a bit more context? 😊"
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

// ── Allow Enter key to send messages ──
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

// ── MIRROR AI Campus Assistant — dashboard.js ──

document.addEventListener("DOMContentLoaded", () => {

  // ── Set today's date in the header badge ──
  const dateBadge = document.getElementById("dateBadge");
  const today = new Date();
  dateBadge.textContent = today.toLocaleDateString("en-KE", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  // ── Load reminders from localStorage ──
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

  // Update reminder count stat
  const reminderCount = document.getElementById("reminderCount");
  reminderCount.textContent = reminders.length;

  // Populate the reminders card
  const container = document.getElementById("remindersContainer");

  if (reminders.length > 0) {
    container.innerHTML = ""; // Clear the "empty" placeholder

    reminders.forEach((r) => {
      const item = document.createElement("div");
      item.className = "reminder-item";
      item.innerHTML = `<div class="reminder-dot"></div><span>${r}</span>`;
      container.appendChild(item);
    });
  }
  // If no reminders, the default empty-state HTML in dashboard.html stays visible

});
//Login panel//
 let currentRole = 'student';

  // Demo credentials
  const credentials = {
    student: { username: '24ZAD109298', password: 'student123', redirect: 'index.html' },
    admin:   { username: 'admin',       password: 'admin123',   redirect: 'admin.html' },
  };

  function setRole(role, btn) {
    currentRole = role;

    // Update active tab
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Update label
    document.getElementById('usernameLabel').textContent =
      role === 'admin' ? 'Username' : 'Registration Number';

    document.getElementById('usernameInput').placeholder =
      role === 'admin' ? 'e.g. admin' : 'e.g. 24ZAD109298';

    // Clear inputs & error
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMsg').style.display = 'none';
  }

  function handleLogin() {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    const creds = credentials[currentRole];

    if (username === creds.username && password === creds.password) {
      // Save session info
      localStorage.setItem('mirrorUser', JSON.stringify({
        role: currentRole,
        username,
        name: currentRole === 'admin' ? 'Administrator' : 'Otieno Jonathan Daniels',
      }));
      errorMsg.style.display = 'none';
      window.location.href = creds.redirect;
    } else {
      errorMsg.style.display = 'block';
      document.getElementById('passwordInput').value = '';
    }
  }

  // Allow Enter key
  document.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleLogin();
  });
