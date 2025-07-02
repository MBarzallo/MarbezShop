// src/components/SwiperHero.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import logo from "../assets/logos/logo-solo-blanco.png";
import LogoBlanco from "../assets/logos/logo-blanco.png";
import Camion from "../assets/images/camion.png";
import Chica from "../assets/images/chica.png";
import "swiper/css";
import "swiper/css/pagination";

export default function SwiperHero() {
  return (
    <div className="relative w-screen bg-principal">
      <Swiper
        modules={[Pagination]}
        loop
        pagination={{ clickable: true }}
        className="w-screen h-[calc(100vh-160px)]"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="flex flex-col md:flex-row items-center justify-between sm:justify-center md:justify-center w-full h-full px-4 sm:px-6 md:px-20 py-8 gap-4">
            {/* Texto + Logo */}
            <div className="flex flex-col items-center md:items-start text-white text-center md:text-left gap-4 w-full md:w-1/2">
              <img
                src={logo.src}
                alt="Logo"
                className="w-16 sm:w-20 md:w-28"
              />
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-snug">
                Tu tienda de confianza para compras rápidas y triangulaciones
                seguras. Conectamos productos, velocidad y tecnología para que
                tus pedidos lleguen justo a tiempo. Explora, elige y recibe —
                todo desde un solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row w-full sm:justify-center md:justify-start gap-4 mt-4">
                <a
                  href="/categories"
                  className="bg-[#FFC72C] hover:bg-yellow-400 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 rounded text-base sm:text-lg md:text-xl shadow-md"
                >
                  COMPRAR
                </a>
                <button className="bg-[#FFC72C] hover:bg-yellow-400 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 rounded text-base sm:text-lg md:text-xl shadow-md">
                  TRIANGULAR
                </button>
              </div>
            </div>

            {/* Imagen */}
            <div className="flex justify-center w-full md:w-1/2">
              <img
                src={Camion.src}
                alt="Camión"
                className="w-3/4 sm:w-2/3 md:w-full object-contain max-h-[450px] sm:max-h-[550px] md:max-h-[650px]"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="flex flex-col md:flex-row items-center justify-between w-full h-full px-4 sm:px-6 md:px-20 py-8 gap-8">
            {/* Texto + Logo */}
            <div className="flex flex-col items-center md:items-start text-white text-center md:text-left gap-4 w-full md:w-1/2">
              <img
                src={LogoBlanco.src}
                alt="Logo"
                className="w-24 sm:w-32 md:w-40 mb-4"
              />
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-yellow-400">
                ¿Quiénes somos?
              </h2>
              <p className="text-base sm:text-lg md:text-xl font-light italic leading-relaxed">
                MARBEZ nace como un e-commerce de dropshipping, comenzando con
                productos para mascotas. Nuestra visión es expandirnos a más
                mercados en el futuro con una oferta variada.
              </p>
            </div>

            {/* Imagen */}
            <div className="flex justify-center w-full md:w-1/2">
              <img
                src={Chica.src}
                alt="Chica"
                className="w-3/4 sm:w-2/3 md:w-full object-contain max-h-[400px] sm:max-h-[600px] md:max-h-[800px]"
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}