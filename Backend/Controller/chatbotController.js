import natural from "natural";
import { catchAsyncError } from "../Middleware/catchAsyncError.js";

// --- NLP Setup ---
const tokenizer = new natural.WordTokenizer();
// FIX: Properly import JaroWinklerDistance
const { PorterStemmer, JaroWinklerDistance } = natural;
const stemmer = PorterStemmer;

// Your intent patterns remain the same
const intentPatterns = {
  greeting: {
    keywords: ["hello", "hi", "hey", "greetings"],
    responses: [{ text: "Hello! How can I help you with an event today?" }],
  },
  login: {
    keywords: ["how to login", "sign in my account", "access account"],
    responses: [
      {
        text: "To access your account and register for events, you'll need to log in.",
        link: "/login",
        linkText: "Go to Login Page",
      },
    ],
  },
  viewEvents: {
    keywords: ["see all events", "upcoming events", "what's happening"],
    responses: [
      {
        text: "You can view all upcoming events on the main events page.",
        link: "/events",
        linkText: "View All Events",
      },
    ],
  },
  myEvents: {
    keywords: [
      "where are my events",
      "show my registered events",
      "my tickets",
    ],
    responses: [
      {
        text: "You can see all the events you've registered for on your personal dashboard.",
        link: "/dashboard",
        linkText: "Go to My Dashboard",
      },
    ],
  },
  register: {
    keywords: ["how do I register", "join an event", "sign up for a workshop"],
    responses: [
      {
        text: "To register as a user, you need to click on 'Register' button.",
        link: "/register",
        linkText: "Go to Register Page",
      },
    ],
  },
  cancelRegistration: {
    keywords: [
      "how to cancel registration",
      "unregister from event",
      "I can't go to event",
    ],
    responses: [
      {
        text: "To cancel your registration, go to the event's details page and click 'Cancel Registration'. You can also manage your events from your dashboard.",
        link: "/user",
        linkText: "Go to Dashboard",
      },
    ],
  },
  certificate: {
    keywords: ["get my certificate", "download participation proof"],
    responses: [
      {
        text: "After an event you've attended is over, you can download a certificate of participation from the event's page or your dashboard.",
        link: "/user",
        linkText: "Go to Dashboard and Generate Certificate",
      },
    ],
  },
  createEvent: {
    keywords: ["how to create new event", "organize an event"],
    responses: [
      {
        text: "If you are an Admin, you can create a new event from your admin dashboard.",
        link: "/admin/dashboard",
        linkText: "Admin Dashboard",
      },
    ],
  },
  goodbye: {
    keywords: ["bye", "thanks", "thank you", "ok", "cool"],
    responses: [
      { text: "You're welcome! Feel free to ask if you need anything else." },
    ],
  },
};

// --- UPGRADED NLP Functions ---
function tokenizeAndStem(text) {
  return stemmer.tokenizeAndStem(text.toLowerCase());
}

function calculateSimilarity(userTokens, keywords) {
  const userText = userTokens.join(" ");
  let maxSimilarity = 0;

  for (const keyword of keywords) {
    const keywordTokens = tokenizeAndStem(keyword);
    const keywordText = keywordTokens.join(" ");

    // This function will now work correctly
    const similarity = JaroWinklerDistance(userText, keywordText);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }
  return maxSimilarity;
}

function detectIntent(message) {
  const userTokens = tokenizeAndStem(message);
  let bestIntent = null;
  let bestScore = 0;

  for (const intent in intentPatterns) {
    const { keywords } = intentPatterns[intent];
    const score = calculateSimilarity(userTokens, keywords);

    if (score > bestScore && score > 0.75) {
      bestScore = score;
      bestIntent = intent;
    }
  }
  return bestIntent;
}

function generateResponse(intent) {
  if (intent && intentPatterns[intent]) {
    const responses = intentPatterns[intent].responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  return {
    text: "I'm sorry, I didn't fully understand that. You can ask me things like 'How do I see my events?' or 'How can I get a certificate?'.",
    link: null,
    linkText: null,
  };
}

export const handleChatMessage = catchAsyncError(async (req, res, next) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const intent = detectIntent(message);
  const response = generateResponse(intent);

  res.json({
    response: response.text,
    link: response.link,
    linkText: response.linkText,
  });
});
