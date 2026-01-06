-- FITNESSFLOW SCHEMA EXECUTION SCRIPT
-- ============================================================================
-- 1. CONFIGURACIÓN INICIAL
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('user', 'gym', 'entrenador'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE subscription_plan AS ENUM ('gratis', 'básico', 'premium'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE subscription_status AS ENUM ('trial', 'subscribed', 'expired'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE difficulty_level AS ENUM ('Principiante', 'Intermedio', 'Avanzado'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 2. PERFILES Y DETALLES (Core)
-- ============================================================================

-- PROFILES: Tabla base vinculada a auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    plan subscription_plan DEFAULT 'básico',
    subscription_status subscription_status DEFAULT 'trial',
    trial_end_date TIMESTAMP WITH TIME ZONE,
    is_gym_member BOOLEAN DEFAULT FALSE,
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- USER DETAILS: Metas, equipamiento, estadísticas de fitness
CREATE TABLE IF NOT EXISTS public.user_details (
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    goal TEXT, -- 'lose_fat', 'build_muscle'
    level TEXT, -- 'beginner', 'intermediate'
    days_per_week INTEGER,
    equipment TEXT[], -- Array ['Mancuernas', 'Barra']
    current_weight DECIMAL(5, 2),
    height_cm INTEGER,
    gamification_xp INTEGER DEFAULT 0,
    gamification_level INTEGER DEFAULT 1,
    gamification_title TEXT DEFAULT 'Novato',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.user_details ENABLE ROW LEVEL SECURITY;

-- COACH DETAILS: Perfil profesional
CREATE TABLE IF NOT EXISTS public.coach_details (
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    profession TEXT,
    description TEXT,
    phone TEXT,
    address TEXT,
    availability JSONB -- [{day: 'Lunes', hours: ['08:00']}]
);
ALTER TABLE public.coach_details ENABLE ROW LEVEL SECURITY;

-- GYM DETAILS: Perfil de negocio
CREATE TABLE IF NOT EXISTS public.gym_details (
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    gym_name TEXT,
    nit TEXT,
    address TEXT,
    capacity INTEGER,
    schedule JSONB
);
ALTER TABLE public.gym_details ENABLE ROW LEVEL SECURITY;

-- GYM INVENTORY: Inventario de máquinas y equipos
CREATE TABLE IF NOT EXISTS public.gym_inventory (
    id SERIAL PRIMARY KEY,
    gym_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Operativo', -- 'Operativo', 'En Mantenimiento', 'Fuera de Servicio'
    purchase_date DATE,
    last_maintenance DATE,
    image_url TEXT, -- Foto del equipo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.gym_inventory ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. BIBLIOTECAS Y SERVICIOS
-- ============================================================================

-- EXERCISES: Biblioteca global
CREATE TABLE IF NOT EXISTS public.exercises (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    difficulty difficulty_level,
    category TEXT,
    muscle_groups TEXT[],
    equipment TEXT,
    instructions TEXT[],
    duration_min INTEGER,
    calories_per_min INTEGER,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Exercises are viewable by everyone" ON public.exercises;
CREATE POLICY "Exercises are viewable by everyone" ON public.exercises FOR SELECT USING (true);

-- COACH SERVICES: Oferta de entrenadores
CREATE TABLE IF NOT EXISTS public.coach_services (
    id SERIAL PRIMARY KEY,
    coach_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    price DECIMAL(10, 2),
    duration_min INTEGER,
    location_type TEXT,
    availability JSONB,
    active_clients INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.coach_services ENABLE ROW LEVEL SECURITY;

-- GYM CLASSES: Clases grupales
CREATE TABLE IF NOT EXISTS public.gym_classes (
    id SERIAL PRIMARY KEY,
    gym_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    coach_name TEXT,
    schedule JSONB,
    capacity INTEGER,
    price DECIMAL(10, 2),
    location_type TEXT,
    category TEXT,
    difficulty difficulty_level,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.gym_classes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. GESTIÓN Y TRANSACCIONES
-- ============================================================================

-- NOTIFICATIONS: Sistema interno
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- BOOKINGS: Reservas unificadas
CREATE TABLE IF NOT EXISTS public.bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES public.coach_services(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES public.gym_classes(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_booking_target CHECK (
        (service_id IS NOT NULL AND class_id IS NULL) OR 
        (service_id IS NULL AND class_id IS NOT NULL)
    )
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- DAILY CHECKINS: Bio-Feedback diario
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    energy_level INTEGER, -- 1-10
    sleep_quality TEXT, -- 'poor', 'good'
    soreness TEXT, -- 'none', 'high'
    mood TEXT, -- 'motivated', 'tired'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- REVIEWS / FEEDBACK: Calificaciones
CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- ID del Entrenador o Gimnasio calificado
    service_id INTEGER REFERENCES public.coach_services(id), -- Opcional: Review específica de servicio
    class_id INTEGER REFERENCES public.gym_classes(id), -- Opcional: Review específica de clase
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. GAMIFICACIÓN Y PROGRESO (AVANZADO)
-- ============================================================================

-- ACHIEVEMENTS: Definición de logros
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY, -- ej: 'first_workout'
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Emoji o URL
    xp_reward INTEGER DEFAULT 50
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Achievements viewable by everyone" ON public.achievements;
CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);

-- USER_ACHIEVEMENTS: Logros desbloqueados por usuario
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- CHALLENGES: Retos activos
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY, -- ej: 'c1'
    title TEXT NOT NULL,
    description TEXT,
    target INTEGER, -- Meta numérica (ej: 100)
    unit TEXT, -- 'minutos', 'kg'
    reward_xp INTEGER,
    deadline TIMESTAMP WITH TIME ZONE,
    participants_count INTEGER DEFAULT 0
);
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- PROGRESS LOGS: Historial de peso y medidas
CREATE TABLE IF NOT EXISTS public.progress_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    weight_kg DECIMAL(5, 2),
    body_fat_percentage DECIMAL(4, 1),
    notes TEXT
);
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

-- PERSONAL RECORDS: Récords personales por ejercicio
CREATE TABLE IF NOT EXISTS public.personal_records (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL, -- O referencia a ID de ejercicio
    weight_kg DECIMAL(6, 2),
    record_date DATE DEFAULT CURRENT_DATE
);
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. DATOS DE SEMILLA (SEED DATA)
-- ============================================================================

-- EJERCICIOS
INSERT INTO public.exercises (name, description, image_url, video_url, difficulty, category, muscle_groups, equipment, instructions, duration_min, calories_per_min, is_premium)
VALUES 
    ('Press de Banca', 'El ejercicio constructor de masa por excelencia para el pecho.', 'https://images.pexels.com/photos/3837464/pexels-photo-3837464.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://videos.pexels.com/video-files/3209191/3209191-sd_640_360_25fps.mp4', 'Intermedio', 'FUERZA', ARRAY['Pecho', 'Fuerza', 'Barra'], 'Barra, Banco', ARRAY['Acuéstate en el banco plano.', 'Baja la barra al pecho medio.', 'Empuja explosivamente.'], 3, 8, FALSE),
    ('Flexiones (Push-ups)', 'Fundamental para fuerza de empuje y estabilidad del core.', 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://videos.pexels.com/video-files/4753997/4753997-sd_640_360_25fps.mp4', 'Principiante', 'FUERZA', ARRAY['Pecho', 'Tríceps', 'Peso Corporal'], 'Ninguno', ARRAY['Cuerpo recto.', 'Baja el pecho al suelo.', 'Extiende brazos por completo.'], 2, 6, FALSE),
    ('Dominadas (Pull-ups)', 'Construye una espalda ancha y fuerte.', 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://videos.pexels.com/video-files/4944977/4944977-sd_640_360_25fps.mp4', 'Avanzado', 'FUERZA', ARRAY['Espalda', 'Bíceps', 'Calistenia'], 'Barra de Dominadas', ARRAY['Agarre prono.', 'Sube la barbilla sobre la barra.', 'Baja controlado.'], 3, 10, FALSE),
    ('Sentadilla (Squat)', 'El rey de los ejercicios de pierna.', 'https://images.pexels.com/photos/116077/pexels-photo-116077.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://videos.pexels.com/video-files/3209191/3209191-sd_640_360_25fps.mp4', 'Avanzado', 'FUERZA', ARRAY['Piernas', 'Glúteos', 'Fuerza'], 'Barra / Peso Corporal', ARRAY['Pies al ancho de hombros.', 'Baja profundo.', 'Mantén el pecho arriba.'], 5, 12, FALSE),
    ('Burpees', 'Cardio explosivo de cuerpo completo.', 'https://images.pexels.com/photos/6456137/pexels-photo-6456137.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://videos.pexels.com/video-files/4761427/4761427-sd_640_360_25fps.mp4', 'Avanzado', 'CUERPO COMPLETO', ARRAY['Cardio', 'HIIT', 'Quema Grasa'], 'Ninguno', ARRAY['Sentadilla.', 'Plancha.', 'Flexión.', 'Salto.'], 5, 15, TRUE),
    ('Plancha (Plank)', 'Estabilidad total del core.', 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://videos.pexels.com/video-files/4497956/4497956-sd_640_360_25fps.mp4', 'Principiante', 'CORE', ARRAY['Core', 'Abdominales'], 'Ninguno', ARRAY['Codos al suelo.', 'Cuerpo recto como tabla.', 'Aguanta.'], 1, 4, FALSE),
    ('Saludo al Sol', 'Fluidez y movilidad de cuerpo completo.', 'https://images.pexels.com/photos/3191196/pexels-photo-3191196.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://videos.pexels.com/video-files/3191196/3191196-sd_640_360_25fps.mp4', 'Principiante', 'MOVILIDAD', ARRAY['Yoga', 'Flexibilidad'], 'Mat', ARRAY['Inhala arriba.', 'Exhala abajo.', 'Fluye con la respiración.'], 5, 3, FALSE);

-- LOGROS (ACHIEVEMENTS)
INSERT INTO public.achievements (id, name, description, icon, xp_reward)
VALUES
    ('first_workout', 'Rompiendo el Hielo', 'Completa tu primer entrenamiento.', '🎉', 100),
    ('streak_5', 'Imparable', 'Completa 5 días de entrenamiento en una semana.', '🔥', 500),
    ('one_month', 'Constancia de Acero', 'Entrena durante un mes completo.', '🗓️', 1000),
    ('first_pr', 'Superando Límites', 'Rompe tu primer récord personal.', '🚀', 200),
    ('10k_volume', 'Levantador Novato', 'Levanta 10,000 kg en total.', '💪', 300),
    ('50_workouts', 'Maratonista de Hierro', 'Completa 50 entrenamientos.', '🏅', 1500),
    ('100k_volume', 'Titán de Hierro', 'Levanta 100,000 kg en total.', '🌋', 2000),
    ('three_months', 'Consistencia de Élite', 'Entrena de forma consistente por 3 meses.', '💎', 5000);

-- RETOS (CHALLENGES)
INSERT INTO public.challenges (id, title, description, target, unit, reward_xp, deadline, participants_count)
VALUES
    ('c1', 'Guerrero de Fin de Semana', 'Completa 2 entrenamientos este fin de semana', 2, 'sesiones', 500, '2024-06-30', 1240),
    ('c2', 'Rey del Cardio', 'Acumula 120 minutos de cardio', 120, 'minutos', 300, '2024-07-05', 850),
    ('c3', 'Fuerza Bruta', 'Levanta un total de 5000kg (volumen)', 5000, 'kg', 750, '2024-07-10', 560);


-- ============================================================================
-- 7. SECURITY POLICIES (RLS FIXES)
-- ============================================================================

-- USER DETAILS
DROP POLICY IF EXISTS "Users can manage their own details" ON public.user_details;
CREATE POLICY "Users can manage their own details" ON public.user_details USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

-- COACH DETAILS
DROP POLICY IF EXISTS "Coach can manage their own details" ON public.coach_details;
CREATE POLICY "Coach can manage their own details" ON public.coach_details USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
-- Public view for coach details (so users can see them)
DROP POLICY IF EXISTS "Public can view coach details" ON public.coach_details;
CREATE POLICY "Public can view coach details" ON public.coach_details FOR SELECT USING (true);

-- GYM DETAILS
DROP POLICY IF EXISTS "Gym can manage their own details" ON public.gym_details;
CREATE POLICY "Gym can manage their own details" ON public.gym_details USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
-- Public view for gym details
DROP POLICY IF EXISTS "Public can view gym details" ON public.gym_details;
CREATE POLICY "Public can view gym details" ON public.gym_details FOR SELECT USING (true);

-- GYM INVENTORY
DROP POLICY IF EXISTS "Gym can manage inventory" ON public.gym_inventory;
CREATE POLICY "Gym can manage inventory" ON public.gym_inventory USING (auth.uid() = gym_id) WITH CHECK (auth.uid() = gym_id);

-- COACH SERVICES
DROP POLICY IF EXISTS "Coach can manage services" ON public.coach_services;
CREATE POLICY "Coach can manage services" ON public.coach_services USING (auth.uid() = coach_id) WITH CHECK (auth.uid() = coach_id);
DROP POLICY IF EXISTS "Public can view services" ON public.coach_services;
CREATE POLICY "Public can view services" ON public.coach_services FOR SELECT USING (true);

-- GYM CLASSES
DROP POLICY IF EXISTS "Gym can manage classes" ON public.gym_classes;
CREATE POLICY "Gym can manage classes" ON public.gym_classes USING (auth.uid() = gym_id) WITH CHECK (auth.uid() = gym_id);
DROP POLICY IF EXISTS "Public can view classes" ON public.gym_classes;
CREATE POLICY "Public can view classes" ON public.gym_classes FOR SELECT USING (true);

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users view their own notifications" ON public.notifications;
CREATE POLICY "Users view their own notifications" ON public.notifications USING (auth.uid() = user_id);

-- BOOKINGS
DROP POLICY IF EXISTS "Users manage their own bookings" ON public.bookings;
CREATE POLICY "Users manage their own bookings" ON public.bookings USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Providers see bookings for their services (Complex, simplified for now)
-- (Ideally would check if auth.uid() owns the service/class, but requires joins not always allowed in simple policies. Skipping for now as user is asking about dashboard errors).

-- DAILY CHECKINS
DROP POLICY IF EXISTS "Users manage their own checkins" ON public.daily_checkins;
CREATE POLICY "Users manage their own checkins" ON public.daily_checkins USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- REVIEWS
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can post reviews" ON public.reviews;
CREATE POLICY "Users can post reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = author_id);

-- USER ACHIEVEMENTS
DROP POLICY IF EXISTS "Users view their own achievements" ON public.user_achievements;
CREATE POLICY "Users view their own achievements" ON public.user_achievements USING (auth.uid() = user_id);

-- PROGRESS LOGS
DROP POLICY IF EXISTS "Users manage their own progress" ON public.progress_logs;
CREATE POLICY "Users manage their own progress" ON public.progress_logs USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PERSONAL RECORDS
DROP POLICY IF EXISTS "Users manage their own PRs" ON public.personal_records;
CREATE POLICY "Users manage their own PRs" ON public.personal_records USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SOCIAL ACTIVITIES (If table existed, but adding for completeness if created dynamically or elsewhere)
CREATE TABLE IF NOT EXISTS public.social_activities (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT,
    content TEXT,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.social_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read activities" ON public.social_activities;
CREATE POLICY "Public read activities" ON public.social_activities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users create activities" ON public.social_activities;
CREATE POLICY "Users create activities" ON public.social_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- WORKOUT LOGS (If table referenced in userService)
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name TEXT,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their workout logs" ON public.workout_logs;
CREATE POLICY "Users manage their workout logs" ON public.workout_logs USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read comments" ON public.comments;
CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users create comments" ON public.comments;
CREATE POLICY "Users create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 8. MÚSICA FITNESS (NEW)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.music_tracks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT,
    platform TEXT DEFAULT 'YouTube', 
    url TEXT NOT NULL,
    category TEXT NOT NULL, 
    bpm INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view music" ON public.music_tracks;
CREATE POLICY "Public view music" ON public.music_tracks FOR SELECT USING (true);

-- SEED DATA MÚSICA
INSERT INTO public.music_tracks (title, artist, platform, url, category, bpm)
VALUES 
-- Cardio / HIIT
('Houdini', 'Dua Lipa', 'YouTube', 'https://www.youtube.com/watch?v=L0c5RqhlJg4', 'cardio_hiit', 117),
('Espresso', 'Sabrina Carpenter', 'YouTube', 'https://www.youtube.com/watch?v=3n1Jb_t9BBU', 'cardio_hiit', 110),
('Greedy', 'Tate McRae', 'YouTube', 'https://www.youtube.com/watch?v=C2_xH647s4g', 'cardio_hiit', 111),
('Lil Boo Thang', 'Paul Russell', 'YouTube', 'https://www.youtube.com/watch?v=j_H3G03s9Y8', 'cardio_hiit', 114),
('Padam Padam', 'Kylie Minogue', 'YouTube', 'https://www.youtube.com/watch?v=q_0E733w_tU', 'cardio_hiit', 128),
('Miracle', 'Calvin Harris', 'YouTube', 'https://www.youtube.com/watch?v=eG1s18-h-pU', 'cardio_hiit', 143),
('Rush', 'Troye Sivan', 'YouTube', 'https://www.youtube.com/watch?v=G2_h94NnQ0Q', 'cardio_hiit', 126),
('Dance The Night', 'Dua Lipa', 'YouTube', 'https://www.youtube.com/watch?v=Cp-CKX_CNIE', 'cardio_hiit', 110),
('Texas Hold ''Em', 'Beyoncé', 'YouTube', 'https://www.youtube.com/watch?v=yYn-h3_g-6c', 'cardio_hiit', 110),
('Water', 'Tyla', 'YouTube', 'https://www.youtube.com/watch?v=o8jG8fK2k64', 'cardio_hiit', 117),
('I''m Good (Blue)', 'David Guetta', 'YouTube', 'https://www.youtube.com/watch?v=J7jW07kC_9M', 'cardio_hiit', 128),
('Best Workout Music 2025', 'Max Oazo Mix', 'YouTube', 'https://www.youtube.com/watch?v=I6PPdlxvO90', 'cardio_hiit', 130),

-- Fuerza (Hip Hop & Rock)
('Till I Collapse', 'Eminem', 'YouTube', 'https://www.youtube.com/watch?v=ytQ5CYE1VZw', 'fuerza', 171),
('Dreams and Nightmares', 'Meek Mill', 'YouTube', 'https://www.youtube.com/watch?v=ZlP7Y_bS1_Q', 'fuerza', 83),
('Humble.', 'Kendrick Lamar', 'YouTube', 'https://www.youtube.com/watch?v=tvTRZJ-4EyI', 'fuerza', 150),
('First Person Shooter', 'Drake ft. J. Cole', 'YouTube', 'https://www.youtube.com/watch?v=pYg1aV0n4sY', 'fuerza', 82),
('Win', 'Jay Rock', 'YouTube', 'https://www.youtube.com/watch?v=jrLhF3tM3rY', 'fuerza', 149),
('Rich Flex', 'Drake & 21 Savage', 'YouTube', 'https://www.youtube.com/watch?v=I4DjHHVHWAE', 'fuerza', 154),
('Going Bad', 'Meek Mill', 'YouTube', 'https://www.youtube.com/watch?v=3u_F6ZfS7e8', 'fuerza', 86),
('POWER', 'Kanye West', 'YouTube', 'https://www.youtube.com/watch?v=L53gjP-TtGE', 'fuerza', 154),
('Black Skinhead', 'Kanye West', 'YouTube', 'https://www.youtube.com/watch?v=q604eed4ad0', 'fuerza', 130),
('Eye of the Tiger', 'Survivor', 'YouTube', 'https://www.youtube.com/watch?v=btPJPFnesV4', 'fuerza', 109),
('Rock Workout Mix', 'Gym Motivation', 'YouTube', 'https://www.youtube.com/watch?v=1M4j-n0P9oQ', 'fuerza', 130),

-- Run / Ride (Hardstyle & High Tempo)
('Hardstyle Pump Mix', 'Gym Rat Music', 'YouTube', 'https://www.youtube.com/watch?v=rpLRfvXzbMw', 'running_cycling', 160),
('40 Best Running Songs 2024', 'Power Music', 'YouTube', 'https://www.youtube.com/watch?v=fRj6P2uG9gI', 'running_cycling', 170),
('Can''t Stop', 'Red Hot Chili Peppers', 'YouTube', 'https://www.youtube.com/watch?v=BfOdWSiyWoc', 'running_cycling', 134),

-- Yoga / Recovery
('Ultimate Chill: Modern Yoga', 'Relaxing Music', 'YouTube', 'https://www.youtube.com/watch?v=_e_4jU_e8_4', 'yoga_recovery', 60),
('1 HOUR Best Yoga Music', 'YellowBrickCinema', 'YouTube', 'https://www.youtube.com/watch?v=q7bIe5h1-Rk', 'yoga_recovery', 50),
('Weightless', 'Marconi Union', 'YouTube', 'https://www.youtube.com/watch?v=UfcAVejslrU', 'yoga_recovery', 60);

