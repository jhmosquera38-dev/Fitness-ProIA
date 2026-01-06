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
        {
            id: 'local-1',
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            platform: 'YouTube',
            url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
            category: 'cardio_hiit',
            bpm: 171
        },
        {
            id: 'local-5',
            title: 'Titanium',
            artist: 'David Guetta',
            platform: 'YouTube',
            url: 'https://www.youtube.com/watch?v=JRfuAukYTKg',
            category: 'cardio_hiit',
            bpm: 126
        }
    ],
    fuerza: [
        {
            id: 'local-2',
            title: 'Eye of the Tiger',
            artist: 'Survivor',
            platform: 'YouTube',
            url: 'https://www.youtube.com/watch?v=btPJPFnesV4',
            category: 'fuerza',
            bpm: 109
        },
        {
            id: 'local-6',
            title: 'Till I Collapse',
            artist: 'Eminem',
            platform: 'YouTube',
            url: 'https://www.youtube.com/watch?v=Obim8BYGnOE',
            category: 'fuerza',
            bpm: 171
        }
    ],
    running_cycling: [
        {
            id: 'local-3',
            title: "Can't Stop",
            artist: 'Red Hot Chili Peppers',
            platform: 'YouTube',
            url: 'https://www.youtube.com/watch?v=BfOdWSiyWoc',
            category: 'running_cycling',
            bpm: 134
        }
    ],
    yoga_recovery: [
        {
            id: 'local-4',
            title: 'Weightless',
            artist: 'Marconi Union',
            platform: 'YouTube',
            url: 'https://www.youtube.com/watch?v=UfcAVejslrU',
            category: 'yoga_recovery',
            bpm: 60
        }
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
