import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, Brain, Sparkles } from "lucide-react";

// Extended events database with more variety
const allEvents = [
  {
    id: 1,
    title: "Explore Over Events",
    description:
      "Dance under neon lights with live DJs, unlimited drinks, and a vibrant crowd. Electronic music festival featuring techno, house, and EDM artists from around the world.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    tags: ["Party", "Night Club", "Dance", "Music", "Electronic"],
    date: "2025-09-15",
    time: "10:00 PM",
    location: "Club Neon, Downtown",
    attendees: 284,
    maxAttendees: 500,
    organizer: "Night Events Co.",
    category: "music",
    keywords: [
      "dance",
      "nightlife",
      "electronic",
      "party",
      "club",
      "dj",
      "music",
    ],
  },
  {
    id: 2,
    title: "Summer Beats Festival",
    description:
      "Enjoy an outdoor music festival featuring top artists, food trucks, and all-day vibes. Multi-genre festival with rock, pop, indie, and folk performances.",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
    tags: ["Festival", "Music", "Outdoor", "Food"],
    date: "2025-07-22",
    time: "2:00 PM",
    location: "Central Park, NYC",
    attendees: 1250,
    maxAttendees: 2000,
    organizer: "Summer Vibes LLC",
    category: "music",
    keywords: ["festival", "outdoor", "music", "food", "entertainment", "live"],
  },
  {
    id: 3,
    title: "Luxury Gala Night",
    description:
      "A glamorous evening with fine dining, live performances, and an elegant crowd. Charity fundraiser with auction, wine tasting, and classical music.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    tags: ["Gala", "Luxury", "Dinner", "Charity"],
    date: "2025-10-05",
    time: "7:00 PM",
    location: "Grand Ballroom Hotel",
    attendees: 89,
    maxAttendees: 150,
    organizer: "Elite Events",
    category: "social",
    keywords: ["gala", "charity", "dinner", "luxury", "formal", "networking"],
  },
  {
    id: 4,
    title: "Tech Expo 2025",
    description:
      "Discover the latest in innovation, gadgets, and tech trends from global leaders. AI demonstrations, startup pitches, and networking opportunities.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    tags: ["Technology", "Expo", "Innovation", "AI"],
    date: "2025-11-12",
    time: "9:00 AM",
    location: "Convention Center",
    attendees: 3420,
    maxAttendees: 5000,
    organizer: "Tech Innovators",
    category: "tech",
    keywords: [
      "technology",
      "innovation",
      "startup",
      "ai",
      "gadgets",
      "networking",
    ],
  },
  {
    id: 5,
    title: "Art Gallery Opening",
    description:
      "Contemporary art exhibition featuring local and international artists. Mixed media installations, paintings, and interactive digital art displays.",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    tags: ["Art", "Gallery", "Exhibition", "Culture"],
    date: "2025-08-30",
    time: "6:00 PM",
    location: "Modern Art Museum",
    attendees: 156,
    maxAttendees: 300,
    organizer: "Arts Collective",
    category: "art",
    keywords: ["art", "gallery", "exhibition", "culture", "creative", "visual"],
  },
  {
    id: 6,
    title: "Gaming Championship",
    description:
      "Esports tournament featuring popular games with cash prizes. Professional gaming, streaming, and gaming technology showcase.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    tags: ["Gaming", "Esports", "Competition", "Tech"],
    date: "2025-09-08",
    time: "12:00 PM",
    location: "Gaming Arena",
    attendees: 892,
    maxAttendees: 1200,
    organizer: "Pro Gaming League",
    category: "gaming",
    keywords: ["gaming", "esports", "competition", "technology", "streaming"],
  },
  {
    id: 7,
    title: "Food & Wine Festival",
    description:
      "Culinary experience with renowned chefs, wine tastings, and cooking demonstrations. Local cuisine and international flavors.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    tags: ["Food", "Wine", "Culinary", "Tasting"],
    date: "2025-10-20",
    time: "4:00 PM",
    location: "Waterfront Plaza",
    attendees: 445,
    maxAttendees: 600,
    organizer: "Culinary Masters",
    category: "food",
    keywords: ["food", "wine", "culinary", "chef", "tasting", "restaurant"],
  },
  {
    id: 8,
    title: "Outdoor Adventure Meetup",
    description:
      "Hiking and outdoor activities with experienced guides. Rock climbing, nature photography, and wilderness survival workshops.",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    tags: ["Adventure", "Hiking", "Outdoor", "Sports"],
    date: "2025-08-15",
    time: "8:00 AM",
    location: "Mountain Trail Park",
    attendees: 67,
    maxAttendees: 100,
    organizer: "Adventure Club",
    category: "sports",
    keywords: ["adventure", "hiking", "outdoor", "nature", "sports", "fitness"],
  },
];

// Interest mapping for recommendations
const interestToCategories = {
  1: ["music"], // Music
  2: ["sports"], // Sports
  3: ["movies"], // Movies - we'll treat as entertainment/culture
  4: ["tech"], // Tech
  5: ["art"], // Art
  6: ["travel"], // Travel - we'll treat as adventure/outdoor
  7: ["food"], // Food
  8: ["gaming"], // Gaming
};

const interestToKeywords = {
  1: ["music", "dance", "festival", "concert", "dj", "band"],
  2: ["sports", "fitness", "competition", "athletic", "outdoor", "adventure"],
  3: ["movies", "entertainment", "culture", "performance", "show"],
  4: ["technology", "tech", "innovation", "ai", "digital", "startup"],
  5: ["art", "creative", "gallery", "exhibition", "visual", "design"],
  6: ["travel", "adventure", "outdoor", "exploration", "nature"],
  7: ["food", "culinary", "dining", "restaurant", "cooking", "tasting"],
  8: ["gaming", "esports", "competition", "digital", "streaming"],
};

// Simple content-based recommendation system
class EventRecommendationEngine {
  constructor() {
    this.userProfile = null;
  }

  setUserInterests(selectedInterests) {
    this.userProfile = {
      interests: selectedInterests,
      preferredCategories: this.getPreferredCategories(selectedInterests),
      preferredKeywords: this.getPreferredKeywords(selectedInterests),
    };
  }

  getPreferredCategories(interests) {
    const categories = new Set();
    interests.forEach((interest) => {
      const cats = interestToCategories[interest] || [];
      cats.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories);
  }

  getPreferredKeywords(interests) {
    const keywords = new Set();
    interests.forEach((interest) => {
      const words = interestToKeywords[interest] || [];
      words.forEach((word) => keywords.add(word));
    });
    return Array.from(keywords);
  }

  calculateEventScore(event) {
    if (!this.userProfile) return Math.random(); // Fallback to random

    let score = 0;

    // Category matching (30% weight)
    if (this.userProfile.preferredCategories.includes(event.category)) {
      score += 0.3;
    }

    // Keyword matching (50% weight)
    const eventKeywords = event.keywords || [];
    const keywordMatches = eventKeywords.filter((keyword) =>
      this.userProfile.preferredKeywords.includes(keyword)
    ).length;

    if (eventKeywords.length > 0) {
      score += (keywordMatches / eventKeywords.length) * 0.5;
    }

    // Tag matching (20% weight)
    const eventTags = event.tags.map((tag) => tag.toLowerCase());
    const tagMatches = eventTags.filter((tag) =>
      this.userProfile.preferredKeywords.some(
        (keyword) => tag.includes(keyword) || keyword.includes(tag)
      )
    ).length;

    if (eventTags.length > 0) {
      score += (tagMatches / eventTags.length) * 0.2;
    }

    // Add some randomness to avoid same order every time
    score += Math.random() * 0.1;

    return Math.min(score, 1); // Cap at 1
  }

  getRecommendedEvents(limit = 4) {
    if (!this.userProfile) {
      // If no user interests, return random events
      return allEvents.sort(() => Math.random() - 0.5).slice(0, limit);
    }

    // Score all events and return top ones
    const scoredEvents = allEvents.map((event) => ({
      ...event,
      recommendationScore: this.calculateEventScore(event),
    }));

    return scoredEvents
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }
}

const RecommendedEvents = ({ isDarkMode = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendationEngine] = useState(new EventRecommendationEngine());

  // Load user interests and generate recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);

      try {
        // Get user interests (fallback to empty array if none)
        const savedInterests = JSON.parse(
          localStorage.getItem("selectedInterests") || "[]"
        );

        if (savedInterests.length > 0) {
          recommendationEngine.setUserInterests(savedInterests);
        }

        // Get personalized recommendations
        const events = recommendationEngine.getRecommendedEvents(4);
        setRecommendedEvents(events);

        // Simulate AI processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error loading recommendations:", error);
        // Fallback to random events
        setRecommendedEvents(allEvents.slice(0, 4));
      }

      setIsLoading(false);
    };

    loadRecommendations();
  }, [recommendationEngine]);

  // Auto-slide functionality
  useEffect(() => {
    if (recommendedEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === recommendedEvents.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [recommendedEvents.length]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getAttendancePercentage = (attendees, maxAttendees) => {
    return (attendees / maxAttendees) * 100;
  };

  const refreshRecommendations = () => {
    setIsLoading(true);
    // Generate new recommendations with some randomness
    setTimeout(() => {
      const events = recommendationEngine.getRecommendedEvents(4);
      setRecommendedEvents(events);
      setCurrentSlide(0);
      setIsLoading(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <section
        className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-20 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="text-center mb-10">
          <h2 className="text-[3.2rem] font-bold mb-4">
            <span
              className={`transition-colors duration-500 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              AI-Powered
            </span>
            <span className="text-purple-600"> Recommendations</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Brain className="w-5 h-5 animate-pulse" />
            <span className="text-lg">Analyzing your interests...</span>
          </div>
        </div>

        <div
          className={`relative h-[600px] overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center transition-colors duration-500 ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-700"
              : "bg-gradient-to-br from-purple-50 to-white"
          }`}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Curating personalized events for you...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`px-4 sm:px-8 md:px-25 lg:px-27 pb-20 transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="text-center mb-10">
        <h2 className="text-[3.2rem] font-bold mb-4">
          <span
            className={`transition-colors duration-500 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Recommended
          </span>
          <span className="text-purple-600">Events</span>
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-purple-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Powered by AI</span>
          </div>
          <button
            onClick={refreshRecommendations}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Vertical Slider Container */}
      <div
        className={`relative h-[600px] overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-700"
            : "bg-gradient-to-br from-purple-50 to-white"
        }`}
      >
        {/* Slides Container */}
        <div
          className="h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${currentSlide * 100}%)` }}
        >
          {recommendedEvents.map((event, index) => (
            <div
              key={event.id}
              className={`h-full flex flex-col md:flex-row relative overflow-hidden transition-colors duration-500 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Image with Overlay */}
              <div className="relative w-full md:w-2/5 h-48 md:h-full">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* AI Recommendation Badge */}
                {event.recommendationScore > 0.6 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    High Match
                  </div>
                )}

                {/* Organizer Info */}
                <div className="absolute bottom-4 right-4 text-white text-sm">
                  <span className="opacity-90">by {event.organizer}</span>
                </div>
              </div>

              {/* Content */}
              <div
                className={`p-8 flex flex-col justify-between w-full md:w-3/5 transition-colors duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-800 to-gray-700"
                    : "bg-gradient-to-br from-white to-purple-50"
                }`}
              >
                <div>
                  {/* Header */}
                  <div className="mb-4">
                    <h3
                      className={`text-3xl font-bold leading-tight transition-colors duration-500 ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {event.title}
                    </h3>
                  </div>

                  <p
                    className={`text-lg mb-6 leading-relaxed transition-colors duration-500 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {event.description}
                  </p>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Date & Time */}
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg shadow-sm transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <div
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Date
                        </div>
                        <div
                          className={`font-semibold transition-colors duration-500 ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {formatDate(event.date)}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg shadow-sm transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <div
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Time
                        </div>
                        <div
                          className={`font-semibold transition-colors duration-500 ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {event.time}
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg shadow-sm sm:col-span-2 transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <div
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Location
                        </div>
                        <div
                          className={`font-semibold transition-colors duration-500 ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendees Section */}
                  <div
                    className={`p-4 rounded-lg shadow-sm mb-6 transition-colors duration-500 ${
                      isDarkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span
                          className={`text-sm transition-colors duration-500 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Attendees
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold transition-colors duration-500 ${
                          isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {event.attendees.toLocaleString()} /{" "}
                        {event.maxAttendees.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className={`w-full rounded-full h-2 transition-colors duration-500 ${
                        isDarkMode ? "bg-gray-600" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${getAttendancePercentage(
                            event.attendees,
                            event.maxAttendees
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                          isDarkMode
                            ? "bg-purple-800 text-purple-200 hover:bg-purple-700"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 text-lg font-medium flex-1 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Join Now!
                  </button>
                  <button
                    className={`px-6 py-3 rounded-full border-2 border-purple-600 font-medium transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-800 text-purple-400 hover:bg-purple-600 hover:text-white"
                        : "bg-white text-purple-600 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {recommendedEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-purple-600 scale-125 shadow-lg"
                  : isDarkMode
                  ? "bg-purple-400 hover:bg-purple-300"
                  : "bg-purple-200 hover:bg-purple-300"
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedEvents;
