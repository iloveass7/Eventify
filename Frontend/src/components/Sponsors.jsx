import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import {
    Music,
    Camera,
    Ticket,
    PartyPopper,
    Mic2,
} from "lucide-react";

const Sponsors = () => {
    return (
        <section className="px-4 md:px-20 lg:px-23 pt-10">
            <h2 className="text-[3.2rem] font-bold mb-8 text-center">
                <span className="text-gray-900">Our Event </span>
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
                        <div className="mx-1 sm:mx-2 h-90 bg-white shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition transform flex flex-col items-center justify-center text-center">
                            <div className="flex justify-center mb-4">
                                <Music size={68} className="text-purple-800" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">SoundWave Productions</h3>
                            <p className="text-gray-600 text-lg">
                                Leaders in concert audio, lighting, and stage setup.
                            </p>
                        </div>
                    </SwiperSlide>

                    {/* Sponsor 2 */}
                    <SwiperSlide>
                        <div className="mx-1 sm:mx-2 h-90 bg-white shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition transform flex flex-col items-center justify-center text-center">
                            <div className="flex justify-center mb-4">
                                <Camera size={68} className="text-purple-800" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">FlashPoint Media</h3>
                            <p className="text-gray-600 text-lg">
                                Professional photography and event videography services.
                            </p>
                        </div>
                    </SwiperSlide>

                    {/* Sponsor 3 */}
                    <SwiperSlide>
                        <div className="mx-1 sm:mx-2 h-90 bg-white shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition transform flex flex-col items-center justify-center text-center">
                            <div className="flex justify-center mb-4">
                                <Ticket size={68} className="text-purple-800" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Eventix</h3>
                            <p className="text-gray-600 text-lg">
                                Seamless ticketing solutions for concerts and festivals.
                            </p>
                        </div>
                    </SwiperSlide>

                    {/* Sponsor 4 */}
                    <SwiperSlide>
                        <div className="mx-1 sm:mx-2 h-90 bg-white shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition transform flex flex-col items-center justify-center text-center">
                            <div className="flex justify-center mb-4">
                                <PartyPopper size={68} className="text-purple-800" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Celebrate Co.</h3>
                            <p className="text-gray-600 text-lg">
                                Experts in event decoration and theme design.
                            </p>
                        </div>
                    </SwiperSlide>

                    {/* Sponsor 5 */}
                    <SwiperSlide>
                        <div className="mx-1 sm:mx-2 h-90 bg-white shadow-md rounded-lg p-6 
              hover:shadow-xl hover:-translate-y-2 transition transform flex flex-col items-center justify-center text-center">
                            <div className="flex justify-center mb-4">
                                <Mic2 size={68} className="text-purple-800" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">StarStage</h3>
                            <p className="text-gray-600 text-lg">
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
