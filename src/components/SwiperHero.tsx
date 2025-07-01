// src/components/SwiperHero.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import logo from "../assets/logos/logo-solo-blanco.png";
import Camion from "../assets/images/camion.png";
import Chica from "../assets/images/chica.png";
import "swiper/css";
import "swiper/css/pagination";

export default function SwiperHero() {
  return (
    <div className="w-full bg-principal h-full">
      <Swiper
        modules={[Pagination]}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full h-full "
      >
        <SwiperSlide>
          <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-12 h-full">
            {/* Texto + Logo */}
            <div className="flex flex-col items-center justify-center text-white text-center gap-6 w-full md:w-1/2 ml-20">
              <img src={logo.src} alt="Logo" className="w-28" />
              <p className="text-3xl  font-light leading-relaxed text-start">
                Tu tienda de confianza para compras rápidas y triangulaciones
                seguras. <br />
                Conectamos productos, velocidad y tecnología para que tus
                pedidos lleguen justo a tiempo. <br />
                Explora, elige y recibe — todo desde un solo lugar.
              </p>
              <div className="flex w-full mt-20 flex-wrap justify-between">
                <button className="bg-[#FFC72C] hover:bg-yellow-400 text-white font-bold px-15 py-3 rounded text-3xl shadow-md">
                  COMPRAR
                </button>
                <button className="bg-[#FFC72C] hover:bg-yellow-400 text-white font-bold px-15 py-3 rounded text-3xl shadow-md">
                  TRIANGULAR
                </button>
              </div>
            </div>

            {/* Imagen */}
            <div className="flex justify-center w-full md:w-1/2">
              <img
                src={Camion.src}
                alt="Camión"
                className="object-contain max-h-[650px]"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20  gap-12 h-full ">
            {/* Texto + Logo */}
            <div className="flex flex-col items-center justify-center text-white gap-6 w-full  max-w-4xl text-center md:text-left ">
              <div className="flex flex-col items-center md:items-start gap-2">
                <img src={logo.src} alt="Logo" className="w-28" />
                
              </div>
              <h2 className="text-yellow-400 font-bold text-5xl">
                  Quienes somos
                </h2>
              <p className="text-3xl font-light leading-relaxed italic text-center">
                MARBEZ nace como un e-commerce basado en el sistema de
                dropshipping, iniciando con la venta de productos para mascotas.
                Nuestra visión es expandirnos a diversos mercados en el futuro,
                ofreciendo una variedad de productos para diferentes
                necesidades.
              </p>
            </div>

            {/* Imagen */}
            <div className="flex flex-col justify-end w-full md:w-1/2 h-full ">
              <img
                src={Chica.src}
                alt="Chica"
                className="object-contain max-h-[800px]"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Puedes añadir más SwiperSlide si deseas */}
      </Swiper>
    </div>
  );
}
