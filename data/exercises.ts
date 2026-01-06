
import { LibraryExercise, ExerciseDifficulty } from '../types';

// ============================================================================
// DATOS DE EJERCICIOS (exercises.ts)
// ============================================================================
// Biblioteca completa de ejercicios con detalles técnicos, multimedia y categorización.
// ============================================================================

// Colección Global de Ejercicios con Videos de Alta Calidad (Pexels / CDN)
export const EXERCISE_DATA: LibraryExercise[] = [
    // --- PECHO ---
    {
        id: 1,
        name: 'Press de Banca',
        description: 'El ejercicio compuesto por excelencia para construir masa y fuerza en el pecho, tríceps y deltoides frontales. Fundamental para el desarrollo de la parte superior del cuerpo. Asegúrate de mantener los pies firmes y retraer las escápulas.',
        imageUrl: 'https://images.pexels.com/photos/3837464/pexels-photo-3837464.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-heavy-bench-press-25807-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Pecho', 'Fuerza', 'Barra'],
        duration: 3,
        caloriesPerMin: 8,
        isFavorite: true,
        category: 'FUERZA',
        equipment: 'Barra, Banco',
        instructions: ['Acuéstate en el banco con los ojos bajo la barra.', 'Retrae las escápulas y mantén un arco natural en la espalda.', 'Agarra la barra algo más ancho que los hombros.', 'Baja la barra controladamente hasta tocar el pecho medio.', 'Empuja explosivamente hasta extender los brazos.']
    },
    {
        id: 2,
        name: 'Flexiones (Push-ups)',
        description: 'Un movimiento fundamental de calistenia que desarrolla fuerza de empuje, estabilidad del core y resistencia muscular. Versátil y efectivo, se puede realizar en cualquier lugar.',
        imageUrl: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-pushups-in-the-gym-22868-large.mp4',
        difficulty: 'Principiante',
        tags: ['Pecho', 'Tríceps', 'Peso Corporal'],
        duration: 2,
        caloriesPerMin: 6,
        category: 'FUERZA',
        equipment: 'Ninguno',
        instructions: ['Colócate en posición de plancha alta con manos bajo los hombros.', 'Mantén el cuerpo recto desde la cabeza hasta los talones.', 'Baja el pecho hasta casi tocar el suelo, codos a 45 grados.', 'Empuja el suelo para volver a la posición inicial.']
    },
    {
        id: 3,
        name: 'Aperturas con Mancuernas',
        description: 'Ejercicio de aislamiento diseñado para estirar las fibras pectorales bajo carga, promoviendo la hipertrofia y mejorando la movilidad torácica. Excelente complemento para los presses.',
        imageUrl: 'https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-arms-with-dumbbells-in-gym-22869-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Pecho', 'Aislamiento'],
        duration: 3,
        caloriesPerMin: 5,
        category: 'FUERZA',
        equipment: 'Mancuernas, Banco',
        instructions: ['Acuéstate en el banco con mancuernas sobre el pecho.', 'Mantén una ligera flexión en los codos (como abrazando un árbol).', 'Abre los brazos lentamente hacia los lados hasta sentir un estiramiento profundo.', 'Cierra los brazos controladamente usando el pecho.']
    },

    // --- ESPALDA ---
    {
        id: 4,
        name: 'Dominadas (Pull-ups)',
        description: 'El mejor ejercicio de peso corporal para construir una espalda ancha en V. Trabaja intensamente los dorsales, bíceps y antebrazos.',
        imageUrl: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-pull-ups-in-gym-22873-large.mp4',
        difficulty: 'Avanzado',
        tags: ['Espalda', 'Bíceps', 'Calistenia'],
        duration: 3,
        caloriesPerMin: 10,
        category: 'FUERZA',
        equipment: 'Barra de Dominadas',
        instructions: ['Cuélgate de la barra con agarre prono (palmas al frente), manos más anchas que hombros.', 'Inicia el movimiento tirando de los codos hacia abajo y atrás.', 'Sube hasta pasar la barbilla por encima de la barra.', 'Baja controladamente hasta estirar los brazos por completo.']
    },
    {
        id: 5,
        name: 'Remo con Barra',
        description: 'Constructor masivo de densidad y grosor para la espalda. Fortalece la espalda media, dorsales y erectores espinales, crucial para una buena postura.',
        imageUrl: 'https://images.pexels.com/photos/949126/pexels-photo-949126.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-heavy-rows-in-the-gym-44185-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Espalda', 'Fuerza'],
        duration: 4,
        caloriesPerMin: 9,
        category: 'FUERZA',
        equipment: 'Barra',
        instructions: ['De pie, pies al ancho de hombros, agarra la barra.', 'Inclina el torso hacia adelante a 45 grados, espalda recta.', 'Tira la barra hacia la parte baja del abdomen ("bolsillo").', 'Aprieta la espalda en la cima y baja controladamente.']
    },
    {
        id: 6,
        name: 'Face Pulls',
        description: 'Ejercicio correctivo esencial para la salud del hombro y postura. Fortalece el deltoides posterior y el manguito rotador, contrarrestando la postura encorvada.',
        imageUrl: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-gym-22872-large.mp4',
        difficulty: 'Principiante',
        tags: ['Espalda', 'Hombros', 'Postura'],
        duration: 3,
        caloriesPerMin: 5,
        category: 'FUERZA',
        equipment: 'Polea / Bandas',
        instructions: ['Ajusta la polea a la altura de la cara.', 'Agarra la cuerda con pulgares hacia atrás.', 'Jala la cuerda hacia la cara, separando las manos.', 'Rota externamente los hombros al final del movimiento.']
    },

    // --- PIERNAS ---
    {
        id: 7,
        name: 'Sentadilla (Squat)',
        description: 'El rey de todos los ejercicios. Involucra la mayor cantidad de masa muscular, desarrollando fuerza bruta en piernas, glúteos y core. Indispensable para atletas.',
        imageUrl: 'https://images.pexels.com/photos/116077/pexels-photo-116077.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-squats-with-barbell-in-gym-22870-large.mp4',
        difficulty: 'Avanzado',
        tags: ['Piernas', 'Glúteos', 'Fuerza'],
        duration: 5,
        caloriesPerMin: 12,
        isFavorite: true,
        category: 'FUERZA',
        equipment: 'Barra / Peso Corporal',
        instructions: ['Coloca la barra sobre los trapecios (no el cuello).', 'Pies al ancho de hombros, puntas ligeramente afuera.', 'Baja cadera y rodillas simultáneamente, manteniendo el pecho erguido.', 'Rompe el paralelo (cadera bajo rodillas) y sube empujando el suelo.']
    },
    {
        id: 8,
        name: 'Hip Thrust',
        description: 'El ejercicio número uno para desarrollar glúteos fuertes y potentes. Maximiza la extensión de cadera con baja carga en la espalda baja.',
        imageUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder generic
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-glute-bridges-in-gym-44186-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Glúteos', 'Piernas'],
        duration: 4,
        caloriesPerMin: 8,
        category: 'FUERZA',
        equipment: 'Barra, Banco',
        instructions: ['Apoya la espalda alta en un banco.', 'Coloca la barra sobre la cadera (usa almohadilla).', 'Empuja con los talones y eleva la cadera hasta bloquear.', 'Aprieta los glúteos fuertemente arriba por un segundo.']
    },
    {
        id: 9,
        name: 'Peso Muerto Rumano',
        description: 'Variante del peso muerto que enfatiza la cadena posterior: isquiotibiales y glúteos. Clave para la fuerza de cadera y prevención de lesiones.',
        imageUrl: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-preparing-to-lift-heavy-weights-22875-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Isquios', 'Glúteos', 'Cadena Posterior'],
        duration: 4,
        caloriesPerMin: 9,
        category: 'FUERZA',
        equipment: 'Barra / Mancuernas',
        instructions: ['Pies al ancho de cadera, rodillas ligeramente flexionadas pero fijas.', 'Bisagra de cadera: lleva la cadera hacia atrás lejos.', 'Baja el peso pegado a las piernas hasta sentir tensión en isquios.', 'Sube empujando la cadera adelante.']
    },
    {
        id: 10,
        name: 'Zancadas (Lunges)',
        description: 'Excelente ejercicio unilateral para corregir desequilibrios, mejorar la estabilidad y trabajar glúteos y cuádriceps de forma dinámica.',
        imageUrl: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-lunges-in-gym-44187-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Piernas', 'Glúteos', 'Equilibrio'],
        duration: 3,
        caloriesPerMin: 8,
        category: 'FUERZA',
        equipment: 'Mancuernas',
        instructions: ['Da un paso largo hacia adelante.', 'Baja la rodilla trasera hasta casi tocar el suelo.', 'Mantén el torso vertical.', 'Empuja con la pierna delantera para volver.']
    },

    // --- HOMBROS ---
    {
        id: 11,
        name: 'Press Militar',
        description: 'Movimiento de fuerza fundamental para hombros anchos y triceps fuertes. Requiere gran estabilidad del core y movilidad torácica.',
        imageUrl: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-lifting-heavy-dumbbells-at-gym-22871-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Hombros', 'Tríceps', 'Fuerza'],
        duration: 3,
        caloriesPerMin: 8,
        category: 'FUERZA',
        equipment: 'Mancuernas / Barra',
        instructions: ['De pie, agarra la barra a la altura del pecho superior.', 'Contrae glúteos y abdomen.', 'Empuja la barra verticalmente hasta bloquear codos.', 'Baja controladamente a la posición inicial.']
    },
    {
        id: 12,
        name: 'Elevaciones Laterales',
        description: 'Aísla la cabeza lateral del deltoides, responsable de la anchura visual de los hombros ("hombros de coco").',
        imageUrl: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-arms-with-dumbbells-22874-large.mp4',
        difficulty: 'Principiante',
        tags: ['Hombros', 'Aislamiento'],
        duration: 2,
        caloriesPerMin: 5,
        category: 'FUERZA',
        equipment: 'Mancuernas',
        instructions: ['De pie, mancuernas a los lados.', 'Eleva los brazos hacia los lados hasta la altura de hombros.', 'Imagina que viertes agua de una jarra al subir.', 'Controla la bajada, no dejes caer el peso.']
    },

    // --- BRAZOS ---
    {
        id: 13,
        name: 'Curl de Bíceps',
        description: 'El clásico irreemplazable para desarrollar bíceps grandes y fuertes. Simple pero efectivo si se realiza sin inercia.',
        imageUrl: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-arms-with-dumbbells-22874-large.mp4',
        difficulty: 'Principiante',
        tags: ['Bíceps', 'Aislamiento'],
        duration: 2,
        caloriesPerMin: 4,
        category: 'FUERZA',
        equipment: 'Mancuernas',
        instructions: ['De pie, palmas mirando al frente.', 'Mantén codos pegados a las costillas.', 'Flexiona el codo subiendo la pesa al hombro.', 'Aprieta el bíceps arriba y baja lento.']
    },
    {
        id: 14,
        name: 'Fondos de Tríceps',
        description: 'Ejercicio de peso corporal superior para masa en tríceps y pecho inferior. Conocido como la "sentadilla del tren superior".',
        imageUrl: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-dips-exercise-in-gym-44188-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Tríceps', 'Pecho', 'Calistenia'],
        duration: 2,
        caloriesPerMin: 6,
        category: 'FUERZA',
        equipment: 'Paralelas / Banco',
        instructions: ['Soporta tu peso en barras paralelas.', 'Baja controladamente flexionando codos a 90 grados.', 'Mantén el cuerpo vertical para enfatizar tríceps.', 'Empuja fuerte hasta extender brazos.']
    },

    // --- CARDIO / HIIT ---
    {
        id: 15,
        name: 'Burpees',
        description: 'El ejercicio definitivo de acondicionamiento metabólico. Trabaja todo el cuerpo y dispara la frecuencia cardíaca en segundos.',
        imageUrl: 'https://images.pexels.com/photos/6456137/pexels-photo-6456137.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-doing-burpees-in-gym-44189-large.mp4',
        difficulty: 'Avanzado',
        tags: ['Cardio', 'HIIT', 'Quema Grasa'],
        duration: 5,
        caloriesPerMin: 15,
        isPremium: true,
        category: 'CUERPO COMPLETO',
        equipment: 'Ninguno',
        instructions: ['Desde pie, baja a sentadilla y apoya manos.', 'Salta atrás a posición de plancha.', 'Haz una flexión (opcional).', 'Salta adelante y luego salta explosivamente hacia arriba.']
    },
    {
        id: 16,
        name: 'Mountain Climbers',
        description: 'Cardio intenso que fortalece el core dinámico. Excelente para quemar calorías y definir abdominales.',
        imageUrl: 'https://images.pexels.com/photos/4162575/pexels-photo-4162575.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-mountain-climbers-exercise-44190-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Cardio', 'Core'],
        duration: 3,
        caloriesPerMin: 12,
        category: 'CARDIO',
        equipment: 'Ninguno',
        instructions: ['Posición de plancha alta, cuerpo recto.', 'Lleva una rodilla al pecho rápidamente.', 'Alterna piernas como si corrieras en el sitio.', 'Mantén la cadera baja y estable.']
    },
    {
        id: 17,
        name: 'Jumping Jacks',
        description: 'Ejercicio clásico de calistenia para calentar y elevar el ritmo cardíaco. Mejora la coordinación y resistencia.',
        imageUrl: 'https://images.pexels.com/photos/4058359/pexels-photo-4058359.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-jumping-jacks-outdoors-44191-large.mp4',
        difficulty: 'Principiante',
        tags: ['Cardio', 'Calentamiento'],
        duration: 2,
        caloriesPerMin: 8,
        category: 'CARDIO',
        equipment: 'Ninguno',
        instructions: ['De pie, pies juntos, manos a los lados.', 'Salta abriendo piernas y subiendo brazos sobre la cabeza.', 'Salta volviendo a la posición inicial.', 'Repite rítmicamente.']
    },
    {
        id: 18,
        name: 'Bicicleta Estática',
        description: 'Cardio de bajo impacto.',
        imageUrl: 'https://images.pexels.com/photos/3760968/pexels-photo-3760968.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-in-spinning-class-44192-large.mp4',
        difficulty: 'Principiante',
        tags: ['Cardio', 'Piernas'],
        duration: 30,
        caloriesPerMin: 10,
        category: 'CARDIO',
        equipment: 'Bicicleta',
        instructions: ['Ajusta el sillín.', 'Pedalea constante.', 'Mantén la postura.']
    },
    {
        id: 19,
        name: 'Correr en Cinta',
        description: 'Entrenamiento de resistencia clásico.',
        imageUrl: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-treadmill-in-gym-44195-large.mp4',
        difficulty: 'Intermedio',
        tags: ['Cardio', 'Resistencia'],
        duration: 20,
        caloriesPerMin: 12,
        category: 'CARDIO',
        equipment: 'Cinta',
        instructions: ['Empieza caminando.', 'Sube la velocidad.', 'Respira rítmico.']
    },

    // --- CORE ---
    {
        id: 20,
        name: 'Plancha (Plank)',
        description: 'Ejercicio isométrico esencial para la estabilidad del core. Fortalece abdominales profundos y protege la espalda baja.',
        imageUrl: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-plank-position-44193-large.mp4',
        difficulty: 'Principiante',
        tags: ['Core', 'Estabilidad'],
        duration: 1,
        caloriesPerMin: 4,
        category: 'CORE',
        equipment: 'Ninguno',
        instructions: ['Apóyate en antebrazos y puntas de pies.', 'Mantén el cuerpo en línea recta perfecta.', 'Contrae glúteos y abdomen fuertemente.', 'No dejes caer la cadera.']
    },
    {
        id: 21,
        name: 'Crunch Abdominal',
        description: 'Ejercicio clásico para el recto abdominal ("six-pack"). Efectivo si se realiza con control y sin tirar del cuello.',
        imageUrl: 'https://images.pexels.com/photos/4162452/pexels-photo-4162452.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-sit-ups-on-exercise-mat-44194-large.mp4',
        difficulty: 'Principiante',
        tags: ['Abdominales'],
        duration: 2,
        caloriesPerMin: 5,
        category: 'CORE',
        equipment: 'Ninguno',
        instructions: ['Acuéstate boca arriba, rodillas flexionadas.', 'Manos tras la nuca (sin tirar).', 'Eleva los hombros del suelo contrayendo el abdomen.', 'Exhala al subir.']
    },

    // --- YOGA / MOVILIDAD ---
    {
        id: 23,
        name: 'Saludo al Sol',
        description: 'Secuencia clásica de Yoga para despertar el cuerpo, mejorar flexibilidad y circulación. Ideal para empezar el día.',
        imageUrl: 'https://images.pexels.com/photos/3191196/pexels-photo-3191196.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-practicing-yoga-outdoors-39603-large.mp4',
        difficulty: 'Principiante',
        tags: ['Yoga', 'Flexibilidad', 'Movilidad'],
        duration: 5,
        caloriesPerMin: 3,
        category: 'MOVILIDAD',
        equipment: 'Mat',
        instructions: ['Inhala y eleva brazos.', 'Exhala y pliégate adelante.', 'Estira espalda y ve a plancha.', 'Fluye entre perro boca arriba y perro boca abajo.']
    },
    {
        id: 24,
        name: 'Puente de Glúteo',
        description: 'Excelente para activar glúteos inactivos y fortalecer la cadena posterior sin estrés lumbar. Fundamental para quienes pasan mucho tiempo sentados.',
        imageUrl: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=600',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-glute-bridges-in-gym-44186-large.mp4',
        difficulty: 'Principiante',
        tags: ['Glúteos', 'Rehabilitación'],
        duration: 3,
        caloriesPerMin: 4,
        category: 'CORE',
        equipment: 'Ninguno',
        instructions: ['Acuéstate boca arriba, rodillas flexionadas, pies cerca de glúteos.', 'Empuja con talones para elevar la cadera.', 'Forma una línea recta rodillas-hombros.', 'Aprieta glúteos arriba y baja lento.']
    }
];

export const CATEGORIES = [...new Set(EXERCISE_DATA.flatMap(e => e.tags))];
export const DIFFICULTIES: ExerciseDifficulty[] = ['Principiante', 'Intermedio', 'Avanzado'];
