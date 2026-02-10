
import { CoachService } from '../types';

export const COACH_SERVICES: CoachService[] = [
    {
        id: 1,
        name: 'Sesión de Entrenamiento Personalizado',
        description: 'Una sesión de 60 minutos uno a uno, totalmente enfocada en tus objetivos personales. Ideal para corregir técnica y maximizar resultados.',
        imageUrl: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/4761426/4761426-sd_640_360_25fps.mp4', // Trainer spotting/assisting
        coach: 'Juan Valdez',
        duration: 60,
        price: 49900,
        locationType: 'Gimnasio',
        availability: [
            { day: 'Lunes', hours: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
            { day: 'Miércoles', hours: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
            { day: 'Viernes', hours: ['08:00', '09:00', '10:00'] }
        ]
    },
    {
        id: 2,
        name: 'Asesoría Nutricional Fitness',
        description: 'Consulta de 45 minutos para alinear tu alimentación con tus metas de entrenamiento. Incluye pautas y recomendaciones.',
        imageUrl: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/3195968/3195968-sd_640_360_25fps.mp4', // Healthy food preparation
        coach: 'Juan Valdez',
        duration: 45,
        price: 39900,
        locationType: 'Virtual',
        availability: [
            { day: 'Martes', hours: ['11:00', '12:00'] },
            { day: 'Jueves', hours: ['11:00', '12:00'] },
        ]
    },
    {
        id: 3,
        name: 'Entrenamiento a Domicilio',
        description: 'Llevamos el entrenamiento a la comodidad de tu casa. Sesión de 60 minutos adaptada al equipo que tengas disponible.',
        imageUrl: 'https://images.pexels.com/photos/4753997/pexels-photo-4753997.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://videos.pexels.com/video-files/4259062/4259062-sd_640_360_25fps.mp4', // Home workout / living room exercise
        coach: 'Juan Valdez',
        duration: 60,
        price: 69900,
        locationType: 'A Domicilio',
        availability: [
            { day: 'Sábado', hours: ['09:00', '10:00', '11:00'] },
        ]
    },
];
