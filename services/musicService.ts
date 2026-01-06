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
        { id: 'ch1', title: 'Houdini', artist: 'Dua Lipa', platform: 'YouTube', url: 'https://www.youtube.com/embed/L0c5RqhlJg4', category: 'cardio_hiit', bpm: 117 },
        { id: 'ch2', title: 'Espresso', artist: 'Sabrina Carpenter', platform: 'YouTube', url: 'https://www.youtube.com/embed/3n1Jb_t9BBU', category: 'cardio_hiit', bpm: 110 },
        { id: 'ch3', title: 'Greedy', artist: 'Tate McRae', platform: 'YouTube', url: 'https://www.youtube.com/embed/C2_xH647s4g', category: 'cardio_hiit', bpm: 111 },
        { id: 'ch4', title: 'Lil Boo Thang', artist: 'Paul Russell', platform: 'YouTube', url: 'https://www.youtube.com/embed/j_H3G03s9Y8', category: 'cardio_hiit', bpm: 114 },
        { id: 'ch5', title: 'Padam Padam', artist: 'Kylie Minogue', platform: 'YouTube', url: 'https://www.youtube.com/embed/q_0E733w_tU', category: 'cardio_hiit', bpm: 128 },
        { id: 'ch6', title: 'Miracle', artist: 'Calvin Harris & Ellie Goulding', platform: 'YouTube', url: 'https://www.youtube.com/embed/eG1s18-h-pU', category: 'cardio_hiit', bpm: 143 },
        { id: 'ch7', title: 'Baby Don\'t Hurt Me', artist: 'David Guetta, Anne-Marie & Coi Leray', platform: 'YouTube', url: 'https://www.youtube.com/embed/TdcqQ7MuP6M', category: 'cardio_hiit', bpm: 124 },
        { id: 'ch8', title: 'Rush', artist: 'Troye Sivan', platform: 'YouTube', url: 'https://www.youtube.com/embed/G2_h94NnQ0Q', category: 'cardio_hiit', bpm: 126 },
        { id: 'ch9', title: 'Dance The Night', artist: 'Dua Lipa', platform: 'YouTube', url: 'https://www.youtube.com/embed/Cp-CKX_CNIE', category: 'cardio_hiit', bpm: 110 },
        { id: 'ch10', title: 'Water', artist: 'Tyla', platform: 'YouTube', url: 'https://www.youtube.com/embed/o8jG8fK2k64', category: 'cardio_hiit', bpm: 117 },
        { id: 'ch11', title: 'I\'m Good (Blue)', artist: 'David Guetta & Bebe Rexha', platform: 'YouTube', url: 'https://www.youtube.com/embed/90RLzVUuXe4', category: 'cardio_hiit', bpm: 128 }
    ],
    fuerza: [
        { id: 'fz1', title: 'Till I Collapse', artist: 'Eminem', platform: 'YouTube', url: 'https://www.youtube.com/embed/ytQ5CYE1VZw', category: 'fuerza', bpm: 171 },
        { id: 'fz2', title: 'Dreams and Nightmares', artist: 'Meek Mill', platform: 'YouTube', url: 'https://www.youtube.com/embed/ZlP7Y_bS1_Q', category: 'fuerza', bpm: 83 },
        { id: 'fz3', title: 'HUMBLE.', artist: 'Kendrick Lamar', platform: 'YouTube', url: 'https://www.youtube.com/embed/tvTRZJ-4EyI', category: 'fuerza', bpm: 150 },
        { id: 'fz4', title: 'POWER', artist: 'Kanye West', platform: 'YouTube', url: 'https://www.youtube.com/embed/L53gjP-TtGE', category: 'fuerza', bpm: 154 },
        { id: 'fz5', title: 'X Gon\' Give It To Ya', artist: 'DMX', platform: 'YouTube', url: 'https://www.youtube.com/embed/fGx6K90TmCI', category: 'fuerza', bpm: 130 },
        { id: 'fz6', title: 'Remember the Name', artist: 'Fort Minor', platform: 'YouTube', url: 'https://www.youtube.com/embed/VDvr08sCPOc', category: 'fuerza', bpm: 135 },
        { id: 'fz7', title: 'Eye of the Tiger', artist: 'Survivor', platform: 'YouTube', url: 'https://www.youtube.com/embed/btPJPFnesV4', category: 'fuerza', bpm: 109 },
        { id: 'fz8', title: 'Thunderstruck', artist: 'AC/DC', platform: 'YouTube', url: 'https://www.youtube.com/embed/v2AC41dglnM', category: 'fuerza', bpm: 134 },
        { id: 'fz9', title: 'Enter Sandman', artist: 'Metallica', platform: 'YouTube', url: 'https://www.youtube.com/embed/CD-E-LDc384', category: 'fuerza', bpm: 123 },
        { id: 'fz10', title: 'Seven Nation Army', artist: 'The White Stripes', platform: 'YouTube', url: 'https://www.youtube.com/embed/0J2QdDbelmY', category: 'fuerza', bpm: 124 },
        { id: 'fz11', title: 'Smells Like Teen Spirit', artist: 'Nirvana', platform: 'YouTube', url: 'https://www.youtube.com/embed/hTWKbfoikeg', category: 'fuerza', bpm: 117 }
    ],
    running_cycling: [],
    yoga_recovery: []
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
