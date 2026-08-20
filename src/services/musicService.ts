import { supabase } from '../lib/supabaseClient';

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
        { id: 'ch1', title: "I'm Good (Blue)", artist: "David Guetta & Bebe Rexha", platform: 'YouTube', url: 'https://www.youtube.com/embed/90RLzVUuXe4', category: 'cardio_hiit', bpm: 128 },
        { id: 'ch2', title: "Piece Of Your Heart", artist: "Meduza ft. Goodboys", platform: 'YouTube', url: 'https://www.youtube.com/embed/KWjV25q34Hw', category: 'cardio_hiit', bpm: 124 },
        { id: 'ch3', title: "Losing It", artist: "Fisher", platform: 'YouTube', url: 'https://www.youtube.com/embed/o3WdLtpWM_c', category: 'cardio_hiit', bpm: 126 },
        { id: 'ch4', title: "Where You Are", artist: "John Summit & Hayla", platform: 'YouTube', url: 'https://www.youtube.com/embed/5BqjhUmldDc', category: 'cardio_hiit', bpm: 125 },
        { id: 'ch5', title: "Do It To It", artist: "ACRAZE ft. Cherish", platform: 'YouTube', url: 'https://www.youtube.com/embed/6wwuEXlIniU', category: 'cardio_hiit', bpm: 128 },
        { id: 'ch6', title: "The Business", artist: "Tiësto", platform: 'YouTube', url: 'https://www.youtube.com/embed/nCg3ufihKyU', category: 'cardio_hiit', bpm: 120 },
        { id: 'ch7', title: "How Deep Is Your Love", artist: "Calvin Harris & Disciples", platform: 'YouTube', url: 'https://www.youtube.com/embed/EgqUJOudrcM', category: 'cardio_hiit', bpm: 121 },
        { id: 'ch8', title: "Higher Love", artist: "Kygo & Whitney Houston", platform: 'YouTube', url: 'https://www.youtube.com/embed/JR49dyo-y0E', category: 'cardio_hiit', bpm: 103 },
        { id: 'ch9', title: "Words", artist: "Alesso ft. Zara Larsson", platform: 'YouTube', url: 'https://www.youtube.com/embed/zIJEOEZdLzE', category: 'cardio_hiit', bpm: 128 },
        { id: 'ch10', title: "Moth To A Flame", artist: "Swedish House Mafia & The Weeknd", platform: 'YouTube', url: 'https://www.youtube.com/embed/u9n7Cw-4_HQ', category: 'cardio_hiit', bpm: 100 },
        { id: 'ch11', title: "Miracle Maker", artist: "Dom Dolla ft. Clementine Douglas", platform: 'YouTube', url: 'https://www.youtube.com/embed/U6Xz8foh7XQ', category: 'cardio_hiit', bpm: 124 },
        { id: 'ch12', title: "Stay", artist: "Zedd & Alessia Cara", platform: 'YouTube', url: 'https://www.youtube.com/embed/h--P8HzYZ74', category: 'cardio_hiit', bpm: 102 },
        { id: 'ch13', title: "On My Mind", artist: "Diplo & SIDEPIECE", platform: 'YouTube', url: 'https://www.youtube.com/embed/TAKR_6vNJR8', category: 'cardio_hiit', bpm: 126 },
        { id: 'ch14', title: "Cold Heart", artist: "Elton John & Dua Lipa (PNAU Remix)", platform: 'YouTube', url: 'https://www.youtube.com/embed/qod03PVTLqk', category: 'cardio_hiit', bpm: 116 },
        { id: 'ch15', title: "Todo De Ti", artist: "Rauw Alejandro", platform: 'YouTube', url: 'https://www.youtube.com/embed/CFPLIaMpGrY', category: 'cardio_hiit', bpm: 92 },
        { id: 'ch16', title: "Party", artist: "Bad Bunny ft. Rauw Alejandro", platform: 'YouTube', url: 'https://www.youtube.com/embed/G9XrXnfJPsk', category: 'cardio_hiit', bpm: 92 },
        { id: 'ch17', title: "Provenza", artist: "Karol G", platform: 'YouTube', url: 'https://www.youtube.com/embed/ca48oMV59LU', category: 'cardio_hiit', bpm: 95 },
        { id: 'ch18', title: "Luna", artist: "Feid", platform: 'YouTube', url: 'https://www.youtube.com/embed/x2oUajHp8pg', category: 'cardio_hiit', bpm: 94 },
        { id: 'ch19', title: "Baby Don't Hurt Me", artist: "David Guetta, Anne-Marie & Coi Leray", platform: 'YouTube', url: 'https://www.youtube.com/embed/k3DBmAlUh1A', category: 'cardio_hiit', bpm: 127 },
        { id: 'ch20', title: "Feels", artist: "Calvin Harris ft. Pharrell Williams, Katy Perry, Big Sean", platform: 'YouTube', url: 'https://www.youtube.com/embed/ozv4q2ov3Mk', category: 'cardio_hiit', bpm: 100 },
        { id: 'ch21', title: "Happier", artist: "Marshmello ft. Bastille", platform: 'YouTube', url: 'https://www.youtube.com/embed/m7Bc3pLyij0', category: 'cardio_hiit', bpm: 100 },
        { id: 'ch22', title: "No Money", artist: "Galantis", platform: 'YouTube', url: 'https://www.youtube.com/embed/xUVz4nRmxn4', category: 'cardio_hiit', bpm: 100 },
        { id: 'ch23', title: "Body", artist: "Loud Luxury ft. Brando", platform: 'YouTube', url: 'https://www.youtube.com/embed/IetIg7y5k3A', category: 'cardio_hiit', bpm: 120 },
        { id: 'ch24', title: "Ride It", artist: "Regard", platform: 'YouTube', url: 'https://www.youtube.com/embed/ucVUEmjKsko', category: 'cardio_hiit', bpm: 97 },
        { id: 'ch25', title: "In The Name Of Love", artist: "Martin Garrix & Bebe Rexha", platform: 'YouTube', url: 'https://www.youtube.com/embed/RnBT9uUYb1w', category: 'cardio_hiit', bpm: 100 }
    ],
    fuerza: [
        { id: 'fz1', title: "X Rated", artist: "Excision & Space Laces", platform: 'YouTube', url: 'https://www.youtube.com/embed/SuNVWDVz7zM', category: 'fuerza', bpm: 150 },
        { id: 'fz2', title: "Nuclear", artist: "Zomboy", platform: 'YouTube', url: 'https://www.youtube.com/embed/GGKPiTFmzrw', category: 'fuerza', bpm: 140 },
        { id: 'fz3', title: "Internet Friends", artist: "Knife Party", platform: 'YouTube', url: 'https://www.youtube.com/embed/luJJBeCFeM0', category: 'fuerza', bpm: 128 },
        { id: 'fz4', title: "Blind Faith", artist: "Chase & Status ft. Liam Bailey", platform: 'YouTube', url: 'https://www.youtube.com/embed/zYpDJw7fThU', category: 'fuerza', bpm: 175 },
        { id: 'fz5', title: "Disconnected", artist: "Pegboard Nerds", platform: 'YouTube', url: 'https://www.youtube.com/embed/MwSkC85TDgY', category: 'fuerza', bpm: 150 },
        { id: 'fz6', title: "I Can't Stop", artist: "Flux Pavilion", platform: 'YouTube', url: 'https://www.youtube.com/embed/3Q9rewnLFYw', category: 'fuerza', bpm: 140 },
        { id: 'fz7', title: "Bangarang", artist: "Skrillex ft. Sirah", platform: 'YouTube', url: 'https://www.youtube.com/embed/YJVmu6yttiw', category: 'fuerza', bpm: 110 },
        { id: 'fz8', title: "Scary Monsters and Nice Sprites", artist: "Skrillex", platform: 'YouTube', url: 'https://www.youtube.com/embed/WSeNSzJ2-Jw', category: 'fuerza', bpm: 140 },
        { id: 'fz9', title: "Drown", artist: "Bring Me The Horizon", platform: 'YouTube', url: 'https://www.youtube.com/embed/TkV5709EG5M', category: 'fuerza', bpm: 150 },
        { id: 'fz10', title: "Tsunami", artist: "DVBBS & Borgeous", platform: 'YouTube', url: 'https://www.youtube.com/embed/0EWbonj7f18', category: 'fuerza', bpm: 128 },
        { id: 'fz11', title: "Spaceman", artist: "Hardwell", platform: 'YouTube', url: 'https://www.youtube.com/embed/lETmskoqh30', category: 'fuerza', bpm: 128 },
        { id: 'fz12', title: "Never Say Goodbye", artist: "Hardwell & Dyro", platform: 'YouTube', url: 'https://www.youtube.com/embed/Co3w_ZxcO1U', category: 'fuerza', bpm: 128 },
        { id: 'fz13', title: "Bigfoot", artist: "W&W", platform: 'YouTube', url: 'https://www.youtube.com/embed/9ytt1ELA82U', category: 'fuerza', bpm: 150 },
        { id: 'fz14', title: "Mammoth", artist: "Dimitri Vegas & Like Mike, W&W", platform: 'YouTube', url: 'https://www.youtube.com/embed/_o-XIryB2gg', category: 'fuerza', bpm: 128 },
        { id: 'fz15', title: "Secrets", artist: "Tiësto & KSHMR ft. Vassy", platform: 'YouTube', url: 'https://www.youtube.com/embed/Dr1nN__-2Po', category: 'fuerza', bpm: 128 },
        { id: 'fz16', title: "Turn Down for What", artist: "DJ Snake & Lil Jon", platform: 'YouTube', url: 'https://www.youtube.com/embed/HMUDVMiITOU', category: 'fuerza', bpm: 100 },
        { id: 'fz17', title: "Delirious (Boneless)", artist: "Steve Aoki, Chris Lake & Tujamo", platform: 'YouTube', url: 'https://www.youtube.com/embed/gl2p4G3CUrI', category: 'fuerza', bpm: 128 },
        { id: 'fz18', title: "Freaks", artist: "Timmy Trumpet & Savage", platform: 'YouTube', url: 'https://www.youtube.com/embed/r1dquH_KOQc', category: 'fuerza', bpm: 150 },
        { id: 'fz19', title: "Bonfire", artist: "Knife Party", platform: 'YouTube', url: 'https://www.youtube.com/embed/e-IWRmpefzE', category: 'fuerza', bpm: 145 },
        { id: 'fz20', title: "Spectre", artist: "Alan Walker", platform: 'YouTube', url: 'https://www.youtube.com/embed/wJnBTPUQS5A', category: 'fuerza', bpm: 128 },
        { id: 'fz21', title: "Love Is Gone", artist: "SLANDER", platform: 'YouTube', url: 'https://www.youtube.com/embed/HiXx5JFRxb4', category: 'fuerza', bpm: 150 },
        { id: 'fz22', title: "Gold (Stupid Love)", artist: "Illenium & Excision", platform: 'YouTube', url: 'https://www.youtube.com/embed/FcuMd_N7mmA', category: 'fuerza', bpm: 150 },
        { id: 'fz23', title: "Hypnocurrency", artist: "REZZ & deadmau5", platform: 'YouTube', url: 'https://www.youtube.com/embed/RT2No1vusjg', category: 'fuerza', bpm: 128 },
        { id: 'fz24', title: "Terror Squad", artist: "Zomboy", platform: 'YouTube', url: 'https://www.youtube.com/embed/p6eER7elUPs', category: 'fuerza', bpm: 150 },
        { id: 'fz25', title: "The Paradox", artist: "Excision", platform: 'YouTube', url: 'https://www.youtube.com/embed/HbNIKR2pctU', category: 'fuerza', bpm: 140 }
    ],
    running_cycling: [
        { id: 'rc1', title: "Don't Let Me Down", artist: "The Chainsmokers ft. Daya", platform: 'YouTube', url: 'https://www.youtube.com/embed/Io0fBr1XBUA', category: 'running_cycling', bpm: 160 },
        { id: 'rc2', title: "Wake Me Up", artist: "Avicii", platform: 'YouTube', url: 'https://www.youtube.com/embed/IcrbM1l_BoI', category: 'running_cycling', bpm: 124 },
        { id: 'rc3', title: "Animals", artist: "Martin Garrix", platform: 'YouTube', url: 'https://www.youtube.com/embed/gCYcHz2k5x0', category: 'running_cycling', bpm: 128 },
        { id: 'rc4', title: "Don't You Worry Child", artist: "Swedish House Mafia", platform: 'YouTube', url: 'https://www.youtube.com/embed/1y6smkh6c-0', category: 'running_cycling', bpm: 129 },
        { id: 'rc5', title: "Firestone", artist: "Kygo ft. Conrad Sewell", platform: 'YouTube', url: 'https://www.youtube.com/embed/9Sc-ir2UwGU', category: 'running_cycling', bpm: 120 },
        { id: 'rc6', title: "Clarity", artist: "Zedd ft. Foxes", platform: 'YouTube', url: 'https://www.youtube.com/embed/IxxstCcJlsc', category: 'running_cycling', bpm: 128 },
        { id: 'rc7', title: "Blinding Lights", artist: "The Weeknd", platform: 'YouTube', url: 'https://www.youtube.com/embed/4NRXx6U8ABQ', category: 'running_cycling', bpm: 171 },
        { id: 'rc8', title: "Harder, Better, Faster, Stronger", artist: "Daft Punk", platform: 'YouTube', url: 'https://www.youtube.com/embed/gAjR4_CbPpQ', category: 'running_cycling', bpm: 123 },
        { id: 'rc9', title: "Summer", artist: "Calvin Harris", platform: 'YouTube', url: 'https://www.youtube.com/embed/ebXbLfLACGM', category: 'running_cycling', bpm: 126 },
        { id: 'rc10', title: "Faded", artist: "Alan Walker", platform: 'YouTube', url: 'https://www.youtube.com/embed/60ItHLz5WEA', category: 'running_cycling', bpm: 90 },
        { id: 'rc11', title: "Alone", artist: "Marshmello", platform: 'YouTube', url: 'https://www.youtube.com/embed/ALZHF5UqnU4', category: 'running_cycling', bpm: 140 },
        { id: 'rc12', title: "Titanium", artist: "David Guetta ft. Sia", platform: 'YouTube', url: 'https://www.youtube.com/embed/JRfuAukYTKg', category: 'running_cycling', bpm: 126 },
        { id: 'rc13', title: "Red Lights", artist: "Tiësto", platform: 'YouTube', url: 'https://www.youtube.com/embed/CFF0mV24WCY', category: 'running_cycling', bpm: 128 },
        { id: 'rc14', title: "Levels", artist: "Avicii", platform: 'YouTube', url: 'https://www.youtube.com/embed/_ovdm2yX4MA', category: 'running_cycling', bpm: 126 },
        { id: 'rc15', title: "Sugar", artist: "Robin Schulz ft. Francesco Yates", platform: 'YouTube', url: 'https://www.youtube.com/embed/bvC_0foemLY', category: 'running_cycling', bpm: 120 },
        { id: 'rc16', title: "Rather Be", artist: "Clean Bandit ft. Jess Glynne", platform: 'YouTube', url: 'https://www.youtube.com/embed/m-M1AtrxztU', category: 'running_cycling', bpm: 115 },
        { id: 'rc17', title: "Physical", artist: "Dua Lipa", platform: 'YouTube', url: 'https://www.youtube.com/embed/9HDEHj2yzew', category: 'running_cycling', bpm: 146 },
        { id: 'rc18', title: "Runaway (U & I)", artist: "Galantis", platform: 'YouTube', url: 'https://www.youtube.com/embed/5XR7naZ_zZA', category: 'running_cycling', bpm: 128 },
        { id: 'rc19', title: "Don't Start Now", artist: "Dua Lipa", platform: 'YouTube', url: 'https://www.youtube.com/embed/oygrmJFKYZY', category: 'running_cycling', bpm: 124 },
        { id: 'rc20', title: "Ocean Drive", artist: "Duke Dumont", platform: 'YouTube', url: 'https://www.youtube.com/embed/KDxJlW6cxRk', category: 'running_cycling', bpm: 120 },
        { id: 'rc21', title: "Whole Heart", artist: "Gryffin ft. Bipolar Sunshine", platform: 'YouTube', url: 'https://www.youtube.com/embed/PWhMoGt0cs8', category: 'running_cycling', bpm: 100 },
        { id: 'rc22', title: "Say My Name", artist: "ODESZA ft. Zyra", platform: 'YouTube', url: 'https://www.youtube.com/embed/HdzI-191xhU', category: 'running_cycling', bpm: 142 },
        { id: 'rc23', title: "Never Be Like You", artist: "Flume ft. Kai", platform: 'YouTube', url: 'https://www.youtube.com/embed/Ly7uj0JwgKg', category: 'running_cycling', bpm: 100 },
        { id: 'rc24', title: "Good Things Fall Apart", artist: "Illenium ft. Jon Bellion", platform: 'YouTube', url: 'https://www.youtube.com/embed/XpmeVNxZ-Ks', category: 'running_cycling', bpm: 150 },
        { id: 'rc25', title: "Language", artist: "Porter Robinson", platform: 'YouTube', url: 'https://www.youtube.com/embed/Vsy1URDYK88', category: 'running_cycling', bpm: 128 }
    ],
    yoga_recovery: [
        { id: 'yr1', title: "Come Away With Me", artist: "Norah Jones", platform: 'YouTube', url: 'https://www.youtube.com/embed/lbjZPFBD6JU', category: 'yoga_recovery', bpm: 75 },
        { id: 'yr2', title: "Skinny Love", artist: "Bon Iver", platform: 'YouTube', url: 'https://www.youtube.com/embed/ssdgFoHLwnk', category: 'yoga_recovery', bpm: 78 },
        { id: 'yr3', title: "Better Together", artist: "Jack Johnson", platform: 'YouTube', url: 'https://www.youtube.com/embed/seZMOTGCDag', category: 'yoga_recovery', bpm: 85 },
        { id: 'yr4', title: "Keep Your Head Up", artist: "Ben Howard", platform: 'YouTube', url: 'https://www.youtube.com/embed/ADP65wbBUpc', category: 'yoga_recovery', bpm: 90 },
        { id: 'yr5', title: "Heartbeats", artist: "José González", platform: 'YouTube', url: 'https://www.youtube.com/embed/HxJhYpTIrl8', category: 'yoga_recovery', bpm: 80 },
        { id: 'yr6', title: "Flightless Bird, American Mouth", artist: "Iron & Wine", platform: 'YouTube', url: 'https://www.youtube.com/embed/xwZNGaMrwcE', category: 'yoga_recovery', bpm: 70 },
        { id: 'yr7', title: "Bloom", artist: "The Paper Kites", platform: 'YouTube', url: 'https://www.youtube.com/embed/8inJtTG_DuU', category: 'yoga_recovery', bpm: 82 },
        { id: 'yr8', title: "White Winter Hymnal", artist: "Fleet Foxes", platform: 'YouTube', url: 'https://www.youtube.com/embed/DrQRS40OKNE', category: 'yoga_recovery', bpm: 85 },
        { id: 'yr9', title: "The Blower's Daughter", artist: "Damien Rice", platform: 'YouTube', url: 'https://www.youtube.com/embed/5YXVMCHG-Nk', category: 'yoga_recovery', bpm: 65 },
        { id: 'yr10', title: "Nuvole Bianche", artist: "Ludovico Einaudi", platform: 'YouTube', url: 'https://www.youtube.com/embed/4VR-6AS0-l4', category: 'yoga_recovery', bpm: 60 },
        { id: 'yr11', title: "On The Nature of Daylight", artist: "Max Richter", platform: 'YouTube', url: 'https://www.youtube.com/embed/rVN1B-tUpgs', category: 'yoga_recovery', bpm: 55 },
        { id: 'yr12', title: "Hoppípolla", artist: "Sigur Rós", platform: 'YouTube', url: 'https://www.youtube.com/embed/JAYb8ZyjzD0', category: 'yoga_recovery', bpm: 78 },
        { id: 'yr13', title: "Near Light", artist: "Ólafur Arnalds", platform: 'YouTube', url: 'https://www.youtube.com/embed/0kYc55bXJFI', category: 'yoga_recovery', bpm: 60 },
        { id: 'yr14', title: "River Flows In You", artist: "Yiruma", platform: 'YouTube', url: 'https://www.youtube.com/embed/7maJOI3QMu0', category: 'yoga_recovery', bpm: 70 },
        { id: 'yr15', title: "Only Time", artist: "Enya", platform: 'YouTube', url: 'https://www.youtube.com/embed/7wfYIMyS_dI', category: 'yoga_recovery', bpm: 80 },
        { id: 'yr16', title: "Says", artist: "Nils Frahm", platform: 'YouTube', url: 'https://www.youtube.com/embed/dIwwjy4slI8', category: 'yoga_recovery', bpm: 65 },
        { id: 'yr17', title: "An Ending (Ascent)", artist: "Brian Eno", platform: 'YouTube', url: 'https://www.youtube.com/embed/OlaTeXX3uH8', category: 'yoga_recovery', bpm: 50 },
        { id: 'yr18', title: "Riverside", artist: "Agnes Obel", platform: 'YouTube', url: 'https://www.youtube.com/embed/vjncyiuwwXQ', category: 'yoga_recovery', bpm: 75 },
        { id: 'yr19', title: "Apocalypse", artist: "Cigarettes After Sex", platform: 'YouTube', url: 'https://www.youtube.com/embed/sElE_BfQ67s', category: 'yoga_recovery', bpm: 68 },
        { id: 'yr20', title: "Ocean Eyes", artist: "Billie Eilish", platform: 'YouTube', url: 'https://www.youtube.com/embed/viimfQi_pUw', category: 'yoga_recovery', bpm: 76 },
        { id: 'yr21', title: "The Night We Met", artist: "Lord Huron", platform: 'YouTube', url: 'https://www.youtube.com/embed/KtlgYxa6BMU', category: 'yoga_recovery', bpm: 78 },
        { id: 'yr22', title: "Anchor", artist: "Novo Amor", platform: 'YouTube', url: 'https://www.youtube.com/embed/OmKAn8rNbKg', category: 'yoga_recovery', bpm: 72 },
        { id: 'yr23', title: "Open", artist: "Rhye", platform: 'YouTube', url: 'https://www.youtube.com/embed/sng_CdAAw8M', category: 'yoga_recovery', bpm: 80 },
        { id: 'yr24', title: "Weightless", artist: "Marconi Union", platform: 'YouTube', url: 'https://www.youtube.com/embed/UfcAVejslrU', category: 'yoga_recovery', bpm: 60 },
        { id: 'yr25', title: "Holocene", artist: "Bon Iver", platform: 'YouTube', url: 'https://www.youtube.com/embed/TWcyIpul8OE', category: 'yoga_recovery', bpm: 78 }
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
