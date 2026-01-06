
import React, { useState, useEffect } from 'react';

const testimonials = [
    {
        id: 1,
        name: "Sofía Martínez",
        role: "Usuario Premium",
        image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "Gracias a FitnessFlow y su AI Coach, he logrado reducir mi % de grasa corporal en 3 meses. ¡Las rutinas son increíbles y totalmente adaptadas a mi tiempo!",
        rating: 5
    },
    {
        id: 2,
        name: "Carlos Rodríguez",
        role: "Entrenador Personal",
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "La herramienta de gestión de clientes me ahorra horas de trabajo administrativo. Ahora puedo enfocarme 100% en mis atletas y sus resultados.",
        rating: 5
    },
    {
        id: 3,
        name: "Laura Gómez",
        role: "Gerente Gym Vitality",
        image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "Nuestra retención de miembros aumentó un 40% desde que implementamos la automatización de marketing. Es la mejor inversión que hemos hecho.",
        rating: 5
    },
    {
        id: 4,
        name: "Andrés Felipe",
        role: "Usuario Básico",
        image: "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "Empecé con el plan gratuito y la biblioteca de ejercicios es súper completa. La comunidad es muy motivadora.",
        rating: 4
    },
    {
        id: 5,
        name: "Mariana López",
        role: "Usuario Gratis",
        image: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "Empecé con la prueba Premium gratuita. Tener acceso al AI Coach y a todas las clases desde el primer día me convenció de pagar la suscripción.",
        rating: 5
    },
    {
        id: 6,
        name: "Pedro Sánchez",
        role: "Entrenador Gratis",
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "Poder probar las herramientas de automatización Premium gratis por 15 días fue clave. Vi el retorno de inversión antes de gastar un peso.",
        rating: 4
    },
    {
        id: 7,
        name: "Gym FitLife",
        role: "Gimnasio Básico",
        image: "https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "Empezamos con el plan gratis y migramos al básico. La gestión de miembros es muy intuitiva y nos ha ordenado mucho.",
        rating: 5
    },
    {
        id: 8,
        name: "Carolina R.",
        role: "Usuario Premium",
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        content: "El AI Coach es otro nivel. Realmente siento que tengo un entrenador personal 24/7 disponible para resolver mis dudas.",
        rating: 5
    }
];

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export const TestimonialsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-sm mb-4">
                        Comunidad FitnessFlow
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                        Voces que inspiran
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Descubre cómo FitnessFlow está transformando vidas y negocios en todo el país.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Carousel Container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 mx-auto max-w-3xl transform transition-transform hover:scale-[1.01]">
                                        <div className="flex-shrink-0">
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-brand-primary to-blue-500">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-grow text-center md:text-left">
                                            <div className="flex justify-center md:justify-start gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} filled={i < testimonial.rating} />
                                                ))}
                                            </div>
                                            <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 italic mb-6">
                                                "{testimonial.content}"
                                            </p>
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{testimonial.name}</h4>
                                                <p className="text-brand-primary font-medium">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center mt-8 gap-2 flex-wrap">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                    ? 'bg-brand-primary w-8'
                                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-brand-primary/50'
                                    }`}
                                aria-label={`Ir al testimonio ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows (Optional for Desktop) */}
                    <button
                        onClick={() => setActiveIndex((curr) => (curr === 0 ? testimonials.length - 1 : curr - 1))}
                        className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-white hover:text-brand-primary transition-colors hidden md:block"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setActiveIndex((curr) => (curr + 1) % testimonials.length)}
                        className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-white hover:text-brand-primary transition-colors hidden md:block"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};
