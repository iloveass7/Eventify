import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Music, Camera, Ticket, PartyPopper, Mic2 } from "lucide-react";

const Sponsors = ({ isDarkMode }) => {
  return (
    <section
      className={`px-4 md:px-20 lg:px-23 py-10 transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <h2 className="text-[3.2rem] font-bold mb-8 text-center">
        <span
          className={`transition-colors duration-500 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Our Event{" "}
        </span>
        <span className="text-purple-600">Sponsors &amp; Partners</span>
      </h2>

      <div className="px-1 sm:px-2 pb-4 mb-4">
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          loop
          modules={[Autoplay]}
        >
          {/* Sponsor 1 */}
          <SwiperSlide>
            <div
              className={`mx-1 sm:mx-2 h-90 shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition-all duration-500 transform flex flex-col items-center justify-center text-center ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750 shadow-gray-900/50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-center mb-4">
                <Music
                  size={68}
                  className={`transition-colors duration-500 ${
                    isDarkMode ? "text-purple-400" : "text-purple-800"
                  }`}
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                SoundWave Productions
              </h3>
              <p
                className={`text-lg transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Leaders in concert audio, lighting, and stage setup.
              </p>
            </div>
          </SwiperSlide>

          {/* Sponsor 2 */}
          <SwiperSlide>
            <div
              className={`mx-1 sm:mx-2 h-90 shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition-all duration-500 transform flex flex-col items-center justify-center text-center ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750 shadow-gray-900/50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-center mb-4">
                <Camera
                  size={68}
                  className={`transition-colors duration-500 ${
                    isDarkMode ? "text-purple-400" : "text-purple-800"
                  }`}
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                FlashPoint Media
              </h3>
              <p
                className={`text-lg transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Professional photography and event videography services.
              </p>
            </div>
          </SwiperSlide>

          {/* Sponsor 3 */}
          <SwiperSlide>
            <div
              className={`mx-1 sm:mx-2 h-90 shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition-all duration-500 transform flex flex-col items-center justify-center text-center ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750 shadow-gray-900/50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-center mb-4">
                <Ticket
                  size={68}
                  className={`transition-colors duration-500 ${
                    isDarkMode ? "text-purple-400" : "text-purple-800"
                  }`}
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Eventix
              </h3>
              <p
                className={`text-lg transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Seamless ticketing solutions for concerts and festivals.
              </p>
            </div>
          </SwiperSlide>

          {/* Sponsor 4 */}
          <SwiperSlide>
            <div
              className={`mx-1 sm:mx-2 h-90 shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition-all duration-500 transform flex flex-col items-center justify-center text-center ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750 shadow-gray-900/50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-center mb-4">
                <PartyPopper
                  size={68}
                  className={`transition-colors duration-500 ${
                    isDarkMode ? "text-purple-400" : "text-purple-800"
                  }`}
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Celebrate Co.
              </h3>
              <p
                className={`text-lg transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Experts in event decoration and theme design.
              </p>
            </div>
          </SwiperSlide>

          {/* Sponsor 5 */}
          <SwiperSlide>
            <div
              className={`mx-1 sm:mx-2 h-90 shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition-all duration-500 transform flex flex-col items-center justify-center text-center ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750 shadow-gray-900/50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-center mb-4">
                <Mic2
                  size={68}
                  className={`transition-colors duration-500 ${
                    isDarkMode ? "text-purple-400" : "text-purple-800"
                  }`}
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                StarStage
              </h3>
              <p
                className={`text-lg transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Premium stage and live performance management partner.
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Sponsors;
