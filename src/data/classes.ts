
import { GroupClass } from '../types';

// ============================================================================
// DATOS DE CLASES (classes.ts)
// ============================================================================
// Catálogo de clases grupales disponibles.
// Se utilizan videos de alta calidad (Pexels) para simular contenido Premium.
// ============================================================================

export const CLASS_DATA: GroupClass[] = [
    {
        id: 1,
        name: 'CrossFit WOD',
        description: 'Entrenamiento funcional de alta intensidad que cambia cada día (Workout of the Day). Enfocado en fuerza, resistencia y potencia explosiva.',
        imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/8558238/8558238-sd_640_360_25fps.mp4', // Atmósfera intensa de gimnasio
        difficulty: 'Avanzado',
        category: 'CrossFit',
        coach: 'Diego Valencia',
        capacity: 12,
        duration: 60,
        schedule: [
            { day: 'Lunes', time: '18:00' },
            { day: 'Miércoles', time: '18:00' },
        ],
        price: 15000,
        locationType: 'Gimnasio',
    },
    {
        id: 2,
        name: 'Hatha Yoga Flow',
        description: 'Clase de yoga suave enfocada en posturas básicas, respiración y alineación corporal. Ideal para reducir el estrés y mejorar flexibilidad.',
        imageUrl: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/3192279/3192279-sd_640_360_25fps.mp4', // Flujo de yoga suave
        difficulty: 'Principiante',
        category: 'Yoga',
        coach: 'Laura Morales',
        capacity: 15,
        duration: 60,
        schedule: [
            { day: 'Martes', time: '07:00' },
            { day: 'Jueves', time: '07:00' },
        ],
        locationType: 'Gimnasio',
    },
    {
        id: 3,
        name: 'Pilates Mat',
        description: 'Fortalecimiento del core y mejora de la postura a través de ejercicios en colchoneta. Tonifica tu cuerpo de forma inteligente.',
        imageUrl: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/4497956/4497956-sd_640_360_25fps.mp4', // Ejercicios de Pilates
        difficulty: 'Intermedio',
        category: 'Pilates',
        coach: 'Laura Morales',
        capacity: 18,
        duration: 55,
        schedule: [
            { day: 'Martes', time: '08:00' },
            { day: 'Jueves', time: '08:00' },
        ],
        locationType: 'Gimnasio',
    },
    {
        id: 4,
        name: 'Spinning RPM',
        description: 'Clase de ciclismo indoor de alta energía al ritmo de la música para quemar calorías. ¡Suda y diviértete!',
        imageUrl: 'https://images.pexels.com/photos/39308/runners-silhouettes-athletes-fitness-39308.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/8555431/8555431-sd_640_360_25fps.mp4', // Ciclismo indoor
        difficulty: 'Intermedio',
        category: 'Spinning',
        coach: 'Carlos Rojas',
        capacity: 20,
        duration: 50,
        schedule: [
            { day: 'Lunes', time: '19:00' },
            { day: 'Viernes', time: '19:00' },
        ],
        price: 12000,
        locationType: 'Gimnasio',
    },
    {
        id: 5,
        name: 'Vinyasa Yoga',
        description: 'Yoga dinámico donde las posturas se enlazan con la respiración creando un flujo continuo.',
        imageUrl: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/8964664/8964664-sd_640_360_25fps.mp4', // Yoga avanzado
        difficulty: 'Intermedio',
        category: 'Yoga',
        coach: 'Ana María Osorio',
        capacity: 15,
        duration: 75,
        schedule: [
            { day: 'Miércoles', time: '07:00' },
            { day: 'Viernes', time: '07:00' },
        ],
        locationType: 'Gimnasio',
    },
    {
        id: 6,
        name: 'Entrenamiento Personalizado',
        description: 'Sesión uno a uno para enfocarse en tus metas específicas, con seguimiento detallado.',
        imageUrl: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/4761426/4761426-sd_640_360_25fps.mp4', // Entrenamiento personal
        difficulty: 'Intermedio',
        category: 'Personalizado',
        coach: 'Juan Valdez',
        capacity: 1,
        duration: 60,
        schedule: [
            { day: 'Lunes', time: '10:00' },
        ],
        locationType: 'A Domicilio',
        clientAddress: 'Cra 43A #1-50, Medellín',
    },
];

export const CLASS_CATEGORIES = ['Todas', 'Mis Reservas', 'Yoga', 'Spinning', 'CrossFit', 'Pilates', 'Personalizado'];
