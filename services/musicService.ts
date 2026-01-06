import { supabase } from '../src/lib/supabaseClient';

export interface MusicTrack {
    id: string | number;
    title: string;
    artist: string;
    platform: 'YouTube' | 'SoundCloud';
    url: string;
    category: 'cardio_hiit' | 'fuerza' | 'running_cycling' | 'yoga_recovery';
    bpm: number;
}

export type MusicCatalog = Record<MusicTrack['category'], MusicTrack[]>;

const DEFAULT_CATALOG: MusicCatalog = {
    cardio_hiit: [
        { id: 'c1', title: 'Best Workout Music 2025', artist: 'Max Oazo Mix', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=I6PPdlxvO90', category: 'cardio_hiit', bpm: 130 },
        { id: 'c2', title: 'Gym Workout Best Songs', artist: 'EDM Mix 2025', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=rpLRfvXzbMw', category: 'cardio_hiit', bpm: 128 },
        { id: 'c3', title: '35 Top Hits Workout Remix', artist: 'Workout Music Source', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=5bC-1-3L4X4', category: 'cardio_hiit', bpm: 140 },
        { id: 'c4', title: '1 Hour of Pop Workout Songs', artist: 'Pop Hits Mix', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=rC5S9eF-d9o', category: 'cardio_hiit', bpm: 135 },
        { id: 'c5', title: 'Blinding Lights', artist: 'The Weeknd', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ', category: 'cardio_hiit', bpm: 171 },
        { id: 'c6', title: 'Motivation Mix 2025', artist: 'Fitness Station', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=613eVDWmL6w', category: 'cardio_hiit', bpm: 128 }
    ],
    fuerza: [
        { id: 'f1', title: 'Strength Training Hits', artist: 'Workout Music Source', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=lK5z-K42f0A', category: 'fuerza', bpm: 124 },
        { id: 'f2', title: 'Gym Motivation Top Songs', artist: 'Fearless Motivation', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=5W7oQ_oW_4Q', category: 'fuerza', bpm: 110 },
        { id: 'f3', title: 'Fitness & Gym Motivation', artist: 'Mix 2025', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=j2n_1K9rVbY', category: 'fuerza', bpm: 120 },
        { id: 'f4', title: 'Hard Hitting Gym Music', artist: 'Barbell Nation', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=gX-hUoJ3c5w', category: 'fuerza', bpm: 130 },
        { id: 'f5', title: 'Eye of the Tiger', artist: 'Survivor', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=btPJPFnesV4', category: 'fuerza', bpm: 109 },
        { id: 'f6', title: 'Till I Collapse', artist: 'Eminem', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=Obim8BYGnOE', category: 'fuerza', bpm: 171 }
    ],
    running_cycling: [
        { id: 'r1', title: '40 Best Running Songs 2024', artist: 'Power Music', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=fRj6P2uG9gI', category: 'running_cycling', bpm: 170 },
        { id: 'r2', title: 'Running High Tempo Mix', artist: 'Workout Music Source', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=g7Q2R8nJt-U', category: 'running_cycling', bpm: 160 },
        { id: 'r3', title: "Can't Stop", artist: 'Red Hot Chili Peppers', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=BfOdWSiyWoc', category: 'running_cycling', bpm: 134 },
        { id: 'r4', title: 'Marathon Training Mix', artist: 'Runner\'s World', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=rC5S9eF-d9o', category: 'running_cycling', bpm: 150 }
    ],
    yoga_recovery: [
        { id: 'y1', title: 'Ultimate Chill: Modern Yoga', artist: 'Relaxing Music', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=_e_4jU_e8_4', category: 'yoga_recovery', bpm: 60 },
        { id: 'y2', title: '1 HOUR Best Yoga Music', artist: 'YellowBrickCinema', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=q7bIe5h1-Rk', category: 'yoga_recovery', bpm: 50 },
        { id: 'y3', title: 'Peaceful Yoga Music', artist: 'Buddha\'s Lounge', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=kGjW9l5Xh9o', category: 'yoga_recovery', bpm: 45 },
        { id: 'y4', title: 'Weightless', artist: 'Marconi Union', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=UfcAVejslrU', category: 'yoga_recovery', bpm: 60 },
        { id: 'y5', title: 'Deep Relaxation Mix', artist: 'Soundings of the Planet', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=e_b4N3t97iI', category: 'yoga_recovery', bpm: 55 }
    ]
};

export const musicService = {
    async getCatalog(): Promise<MusicCatalog> {
        try {
            // Intentar cargar de Supabase
            const { data, error } = await supabase
                .from('music_tracks')
                .select('*');

            if (error || !data || data.length === 0) {
                console.warn('Usando catálogo local de música (Supabase vacío o error)');
                return DEFAULT_CATALOG;
            }

            // Agrupar por categoría
            const catalog: MusicCatalog = {
                cardio_hiit: [],
                fuerza: [],
                running_cycling: [],
                yoga_recovery: []
            };

            data.forEach((track: any) => {
                if (catalog[track.category as keyof MusicCatalog]) {
                    catalog[track.category as keyof MusicCatalog].push(track);
                }
            });

            // Merge con local si alguna categoría queda vacía? 
            // O simplemente retornar lo de la DB. Retornamos DB + Local?
            // Por simplicidad, retornamos Data de DB. Si está vacía, retornamos DEFAULT.

            // Asegurar que todas las categorías tengan arrays
            return {
                cardio_hiit: catalog.cardio_hiit.length ? catalog.cardio_hiit : DEFAULT_CATALOG.cardio_hiit,
                fuerza: catalog.fuerza.length ? catalog.fuerza : DEFAULT_CATALOG.fuerza,
                running_cycling: catalog.running_cycling.length ? catalog.running_cycling : DEFAULT_CATALOG.running_cycling,
                yoga_recovery: catalog.yoga_recovery.length ? catalog.yoga_recovery : DEFAULT_CATALOG.yoga_recovery
            };

        } catch (e) {
            console.error('Error fetching music:', e);
            return DEFAULT_CATALOG;
        }
    }
};
