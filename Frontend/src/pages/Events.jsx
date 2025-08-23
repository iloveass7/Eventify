import React, { useState, useMemo } from 'react';
import EventDetails from './EventDetails';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Clock, Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Events = () => {
    // Mock data for events
    const mockEvents = [
        {
            id: 1,
            title: "Tech Innovation Summit 2025",
            description: "Join us for the biggest tech event of the year featuring AI, blockchain, and web development workshops.",
            date: "2025-09-15",
            time: "09:00",
            location: "Main Auditorium",
            category: "Technology",
            organizer: "Computer Science Club",
            attendees: 150,
            maxAttendees: 200,
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
            featured: true,
            status: "upcoming"
        },
        {
            id: 2,
            title: "Creative Writing Workshop",
            description: "Enhance your writing skills with renowned authors and learn the art of storytelling.",
            date: "2025-09-12",
            time: "14:00",
            location: "Library Hall",
            category: "Arts",
            organizer: "Literature Society",
            attendees: 45,
            maxAttendees: 60,
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop",
            featured: false,
            status: "upcoming"
        },
        {
            id: 3,
            title: "Startup Pitch Competition",
            description: "Present your innovative business ideas and compete for seed funding and mentorship opportunities.",
            date: "2025-09-20",
            time: "10:00",
            location: "Business Building",
            category: "Business",
            organizer: "Entrepreneurship Club",
            attendees: 89,
            maxAttendees: 100,
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
            featured: true,
            status: "upcoming"
        },
        {
            id: 4,
            title: "Environmental Awareness Campaign",
            description: "Learn about sustainable practices and participate in campus-wide green initiatives.",
            date: "2025-09-08",
            time: "11:00",
            location: "Central Park",
            category: "Environment",
            organizer: "Green Earth Club",
            attendees: 200,
            maxAttendees: 300,
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
            featured: false,
            status: "upcoming"
        },
        {
            id: 5,
            title: "Cultural Dance Festival",
            description: "Celebrate diversity through traditional and contemporary dance performances from around the world.",
            date: "2025-09-25",
            time: "18:00",
            location: "Grand Theater",
            category: "Cultural",
            organizer: "International Club",
            attendees: 320,
            maxAttendees: 400,
            image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=250&fit=crop",
            featured: true,
            status: "upcoming"
        },
        {
            id: 6,
            title: "Mental Health Awareness Seminar",
            description: "Important discussion about student mental health with expert psychologists and counselors.",
            date: "2025-09-18",
            time: "15:30",
            location: "Medical Center",
            category: "Health",
            organizer: "Psychology Club",
            attendees: 75,
            maxAttendees: 120,
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
            featured: false,
            status: "upcoming"
        },
        {
            id: 7,
            title: "Robotics Competition",
            description: "Build and program robots to compete in various challenges and win exciting prizes.",
            date: "2025-09-30",
            time: "09:30",
            location: "Engineering Lab",
            category: "Technology",
            organizer: "Robotics Society",
            attendees: 60,
            maxAttendees: 80,
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
            featured: false,
            status: "upcoming"
        },
        {
            id: 8,
            title: "Photography Exhibition",
            description: "Showcase of stunning photography work by students and professional photographers.",
            date: "2025-10-05",
            time: "12:00",
            location: "Art Gallery",
            category: "Arts",
            organizer: "Photography Club",
            attendees: 95,
            maxAttendees: 150,
            image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop",
            featured: false,
            status: "upcoming"
        }
    ];

    const categories = ["All", "Technology", "Arts", "Business", "Environment", "Cultural", "Health"];

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("date");
    const eventsPerPage = 6;

    // Filter and search logic
    const filteredEvents = useMemo(() => {
        let filtered = mockEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Sort events
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return new Date(a.date) - new Date(b.date);
                case "popularity":
                    return b.attendees - a.attendees;
                case "alphabetical":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [searchTerm, selectedCategory, sortBy]);

    // Pagination logic
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            Technology: "bg-blue-100 text-blue-800",
            Arts: "bg-purple-100 text-purple-800",
            Business: "bg-green-100 text-green-800",
            Environment: "bg-emerald-100 text-emerald-800",
            Cultural: "bg-orange-100 text-orange-800",
            Health: "bg-red-100 text-red-800"
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-8xl mx-21 px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-purple-900">
                                University Events
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 md:mt-6 text-gray-600 leading-relaxed">
                                Explore a wide variety of engaging campus activities designed to enrich your college experience.
                                From clubs and sports teams to cultural events and volunteer opportunities, there's something for everyone.
                                Join these activities to meet new people, develop new skills, and make the most of your time on campus.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-21 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Search Bar */}
                <div className="bg-white rounded-lg mb-6 lg:mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search events, organizers, or keywords..."
                            className="h-12 sm:h-14 lg:h-16 w-full pl-10 pr-4 py-3 border border-purple-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-900 text-sm sm:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Sidebar - Filters */}
                    <div className="lg:w-80 xl:w-85 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-lg border border-purple-300 p-4 sm:p-6 sticky top-4">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden mb-4"
                            >
                                <Filter className="w-5 h-5" />
                                <span className="text-sm sm:text-base">Filters & Sort</span>
                            </button>

                            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4 sm:space-y-6`}>
                                <div>
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 mb-3 sm:mb-4">
                                        Filter & Sort
                                    </h3>
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm sm:text-base lg:text-lg font-semibold text-purple-900 mb-3">
                                        Category
                                    </label>
                                    <div className="space-y-2 sm:space-y-3">
                                        {categories.map(category => (
                                            <label key={category} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={category}
                                                    checked={selectedCategory === category}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-4 h-4 text-purple-900 border-gray-300 focus:ring-purple-500"
                                                />
                                                <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">{category}</span>
                                                <span className="ml-auto text-sm sm:text-base lg:text-lg text-gray-500">
                                                    {category === "All"
                                                        ? mockEvents.length
                                                        : mockEvents.filter(e => e.category === category).length
                                                    }
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm sm:text-base lg:text-lg font-semibold text-purple-900 mb-3">
                                        Sort By
                                    </label>
                                    <div className="space-y-2 sm:space-y-3">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sort"
                                                value="date"
                                                checked={sortBy === "date"}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                            />
                                            <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">Date</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sort"
                                                value="popularity"
                                                checked={sortBy === "popularity"}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                            />
                                            <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">Popularity</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sort"
                                                value="alphabetical"
                                                checked={sortBy === "alphabetical"}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                            />
                                            <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-900">Alphabetical</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Clear Filters */}
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSortBy("date");
                                        setSearchTerm("");
                                    }}
                                    className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-600 border border-purple-200 rounded-lg hover:bg-purple-200 hover:text-purple-500 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Events */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} Found
                                </h2>
                                {(searchTerm || selectedCategory !== "All") && (
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        {searchTerm && `Search: "${searchTerm}"`}
                                        {searchTerm && selectedCategory !== "All" && " • "}
                                        {selectedCategory !== "All" && `Category: ${selectedCategory}`}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Events Grid */}
                        {currentEvents.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                                <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                    {currentEvents.map(event => (
                                        <div key={event.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                                            {/* Event Image - Fixed Height */}
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                                                />
                                                {event.featured && (
                                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            Featured
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                                        {event.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Event Content - Flexible Height */}
                                            <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                                {/* Title - Fixed Height */}
                                                <div className="h-12 sm:h-14 mb-2 sm:mb-3">
                                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                                                        {event.title}
                                                    </h3>
                                                </div>

                                                {/* Description - Fixed Height */}
                                                <div className="h-16 sm:h-20 mb-3 sm:mb-4">
                                                    <p className="text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed">
                                                        {event.description}
                                                    </p>
                                                </div>

                                                {/* Event Details - Fixed Height */}
                                                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 flex-shrink-0">
                                                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                                                        <span className="truncate">{formatDate(event.date)}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                                                        <span className="truncate">{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                                                        <span className="truncate">{event.attendees}/{event.maxAttendees} registered</span>
                                                    </div>
                                                </div>

                                                {/* Registration Progress - Fixed Height */}
                                                <div className="mb-4 sm:mb-6 flex-shrink-0">
                                                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                                                        <span>Registration Progress</span>
                                                        <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-purple-700 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Action Button - Fixed Position at Bottom */}
                                                <div className="mt-auto">
                                                    <Link
                                                        to={`/events/${event.id}`}
                                                        className="w-full bg-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base lg:text-lg rounded-lg hover:bg-purple-900 transition-colors font-medium text-center block"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span className="hidden xs:inline">Previous</span>
                                        </button>

                                        <div className="flex gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-2 sm:px-3 py-2 rounded-lg text-sm sm:text-base ${currentPage === page
                                                            ? 'bg-purple-800 text-white'
                                                            : 'border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            <span className="hidden xs:inline">Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;