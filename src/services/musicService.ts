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
        { id: 'ch1', title: "Houdini", artist: "Dua Lipa", platform: 'YouTube', url: 'https://www.youtube.com/embed/suAR1PYFNYA', category: 'cardio_hiit', bpm: 117 },
        { id: 'ch2', title: "Espresso", artist: "Sabrina Carpenter", platform: 'YouTube', url: 'https://www.youtube.com/embed/eVli-tstM5E', category: 'cardio_hiit', bpm: 110 },
        { id: 'ch3', title: "Greedy", artist: "Tate McRae", platform: 'YouTube', url: 'https://www.youtube.com/embed/To4SWGZkEPk', category: 'cardio_hiit', bpm: 111 },
        { id: 'ch4', title: "Water", artist: "Tyla", platform: 'YouTube', url: 'https://www.youtube.com/embed/XoiOOiuH8iI', category: 'cardio_hiit', bpm: 117 },
        { id: 'ch5', title: "Lil Boo Thang", artist: "Paul Russell", platform: 'YouTube', url: 'https://www.youtube.com/embed/5AgDZcM8In8', category: 'cardio_hiit', bpm: 114 },
        { id: 'ch6', title: "Padam Padam", artist: "Kylie Minogue", platform: 'YouTube', url: 'https://www.youtube.com/embed/p6Cnazi_Fi0', category: 'cardio_hiit', bpm: 128 },
        { id: 'ch7', title: "Miracle", artist: "Calvin Harris & Ellie Goulding", platform: 'YouTube', url: 'https://www.youtube.com/embed/961v0E3b01g', category: 'cardio_hiit', bpm: 143 },
        { id: 'ch8', title: "Rush", artist: "Troye Sivan", platform: 'YouTube', url: 'https://www.youtube.com/embed/b53QJYP-lqY', category: 'cardio_hiit', bpm: 126 },
        { id: 'ch9', title: "Dance The Night", artist: "Dua Lipa", platform: 'YouTube', url: 'https://www.youtube.com/embed/OiC1rgCPmUQ', category: 'cardio_hiit', bpm: 110 },
        { id: 'ch10', title: "TQG", artist: "Karol G & Shakira", platform: 'YouTube', url: 'https://www.youtube.com/embed/jZGpkLElSu8', category: 'cardio_hiit', bpm: 100 },
        { id: 'ch11', title: "MONACO", artist: "Bad Bunny", platform: 'YouTube', url: 'https://www.youtube.com/embed/_PJvpq8uOZM', category: 'cardio_hiit', bpm: 95 },
        { id: 'ch12', title: "Feliz Cumpleaños Ferxxo", artist: "Feid", platform: 'YouTube', url: 'https://www.youtube.com/embed/jRxDUsGmwuc', category: 'cardio_hiit', bpm: 95 },
        { id: 'ch13', title: "Provenza", artist: "Karol G", platform: 'YouTube', url: 'https://www.youtube.com/embed/ca48oMV59LU', category: 'cardio_hiit', bpm: 104 },
        { id: 'ch14', title: "Todo De Ti", artist: "Rauw Alejandro", platform: 'YouTube', url: 'https://www.youtube.com/embed/CFPLIaMpGrY', category: 'cardio_hiit', bpm: 106 },
        { id: 'ch15', title: "Ella Baila Sola", artist: "Peso Pluma & Eslabon Armado", platform: 'YouTube', url: 'https://www.youtube.com/embed/lZiaYpD9ZrI', category: 'cardio_hiit', bpm: 132 },
        { id: 'ch16', title: "Shakira: Bzrp Music Sessions Vol. 53", artist: "Shakira & Bizarrap", platform: 'YouTube', url: 'https://www.youtube.com/embed/CocEMWdc7Ck', category: 'cardio_hiit', bpm: 122 },
        { id: 'ch17', title: "I'm Good (Blue)", artist: "David Guetta & Bebe Rexha", platform: 'YouTube', url: 'https://www.youtube.com/embed/90RLzVUuXe4', category: 'cardio_hiit', bpm: 128 },
        { id: 'ch18', title: "Yes, And?", artist: "Ariana Grande", platform: 'YouTube', url: 'https://www.youtube.com/embed/eB6txyhHFG4', category: 'cardio_hiit', bpm: 124 },
        { id: 'ch19', title: "Levitating", artist: "Dua Lipa", platform: 'YouTube', url: 'https://www.youtube.com/embed/TUVcZfQe-Kw', category: 'cardio_hiit', bpm: 103 },
        { id: 'ch20', title: "Seven", artist: "Jung Kook ft. Latto", platform: 'YouTube', url: 'https://www.youtube.com/embed/QU9c0053UAU', category: 'cardio_hiit', bpm: 124 },
        { id: 'ch21', title: "BREAK MY SOUL", artist: "Beyoncé", platform: 'YouTube', url: 'https://www.youtube.com/embed/yjki-9Pthh0', category: 'cardio_hiit', bpm: 115 },
        { id: 'ch22', title: "Quevedo: Bzrp Music Sessions Vol. 52", artist: "Bizarrap & Quevedo", platform: 'YouTube', url: 'https://www.youtube.com/embed/A_g3lMcWVy0', category: 'cardio_hiit', bpm: 128 },
        { id: 'ch23', title: "Ay Vamos", artist: "J Balvin", platform: 'YouTube', url: 'https://www.youtube.com/embed/TapXs54Ah3E', category: 'cardio_hiit', bpm: 92 },
        { id: 'ch24', title: "Taki Taki", artist: "DJ Snake ft. Selena Gomez, Ozuna, Cardi B", platform: 'YouTube', url: 'https://www.youtube.com/embed/ixkoVwKQaJg', category: 'cardio_hiit', bpm: 95 },
        { id: 'ch25', title: "Envolver", artist: "Anitta", platform: 'YouTube', url: 'https://www.youtube.com/embed/hFCjGiawJi4', category: 'cardio_hiit', bpm: 100 }
    ],
    fuerza: [
        { id: 'fz1', title: "Till I Collapse", artist: "Eminem", platform: 'YouTube', url: 'https://www.youtube.com/embed/Obim8BYGnOE', category: 'fuerza', bpm: 171 },
        { id: 'fz2', title: "Dreams and Nightmares", artist: "Meek Mill", platform: 'YouTube', url: 'https://www.youtube.com/embed/S8gfqs1-NuE', category: 'fuerza', bpm: 83 },
        { id: 'fz3', title: "HUMBLE.", artist: "Kendrick Lamar", platform: 'YouTube', url: 'https://www.youtube.com/embed/tvTRZJ-4EyI', category: 'fuerza', bpm: 150 },
        { id: 'fz4', title: "POWER", artist: "Kanye West", platform: 'YouTube', url: 'https://www.youtube.com/embed/L53gjP-TtGE', category: 'fuerza', bpm: 154 },
        { id: 'fz5', title: "X Gon' Give It To Ya", artist: "DMX", platform: 'YouTube', url: 'https://www.youtube.com/embed/fGx6K90TmCI', category: 'fuerza', bpm: 130 },
        { id: 'fz6', title: "Paint The Town Red", artist: "Doja Cat", platform: 'YouTube', url: 'https://www.youtube.com/embed/m4_9TFeMfJE', category: 'fuerza', bpm: 120 },
        { id: 'fz7', title: "Enter Sandman", artist: "Metallica", platform: 'YouTube', url: 'https://www.youtube.com/embed/CD-E-LDc384', category: 'fuerza', bpm: 123 },
        { id: 'fz8', title: "Lose Yourself", artist: "Eminem", platform: 'YouTube', url: 'https://www.youtube.com/embed/xFYQQPAOz7Y', category: 'fuerza', bpm: 171 },
        { id: 'fz9', title: "SICKO MODE", artist: "Travis Scott", platform: 'YouTube', url: 'https://www.youtube.com/embed/6ONRf7h3Mdk', category: 'fuerza', bpm: 155 },
        { id: 'fz10', title: "God's Plan", artist: "Drake", platform: 'YouTube', url: 'https://www.youtube.com/embed/xpVfcZ0ZcFM', category: 'fuerza', bpm: 77 },
        { id: 'fz11', title: "In Da Club", artist: "50 Cent", platform: 'YouTube', url: 'https://www.youtube.com/embed/5qm8PH4xAss', category: 'fuerza', bpm: 90 },
        { id: 'fz12', title: "Not Like Us", artist: "Kendrick Lamar", platform: 'YouTube', url: 'https://www.youtube.com/embed/H58vbez_m4E', category: 'fuerza', bpm: 101 },
        { id: 'fz13', title: "Like That", artist: "Future, Metro Boomin & Kendrick Lamar", platform: 'YouTube', url: 'https://www.youtube.com/embed/N9bKBAA22Go', category: 'fuerza', bpm: 140 },
        { id: 'fz14', title: "Killing In The Name", artist: "Rage Against The Machine", platform: 'YouTube', url: 'https://www.youtube.com/embed/bWXazVhlyxQ', category: 'fuerza', bpm: 91 },
        { id: 'fz15', title: "Thunderstruck", artist: "AC/DC", platform: 'YouTube', url: 'https://www.youtube.com/embed/v2AC41dglnM', category: 'fuerza', bpm: 133 },
        { id: 'fz16', title: "Believer", artist: "Imagine Dragons", platform: 'YouTube', url: 'https://www.youtube.com/embed/7wtfhZwyrcc', category: 'fuerza', bpm: 125 },
        { id: 'fz17', title: "In The End", artist: "Linkin Park", platform: 'YouTube', url: 'https://www.youtube.com/embed/eVTXPUF4Oz4', category: 'fuerza', bpm: 105 },
        { id: 'fz18', title: "Chop Suey!", artist: "System of a Down", platform: 'YouTube', url: 'https://www.youtube.com/embed/CSvFpBOe8eY', category: 'fuerza', bpm: 127 },
        { id: 'fz19', title: "Industry Baby", artist: "Jack Harlow & Lil Nas X", platform: 'YouTube', url: 'https://www.youtube.com/embed/UTHLKHL_whs', category: 'fuerza', bpm: 149 },
        { id: 'fz20', title: "Turn Down for What", artist: "DJ Snake & Lil Jon", platform: 'YouTube', url: 'https://www.youtube.com/embed/HMUDVMiITOU', category: 'fuerza', bpm: 100 },
        { id: 'fz21', title: "Animal I Have Become", artist: "Three Days Grace", platform: 'YouTube', url: 'https://www.youtube.com/embed/xqds0B_meys', category: 'fuerza', bpm: 137 },
        { id: 'fz22', title: "Wow.", artist: "Post Malone", platform: 'YouTube', url: 'https://www.youtube.com/embed/393C3pr2ioY', category: 'fuerza', bpm: 99 },
        { id: 'fz23', title: "Bodak Yellow", artist: "Cardi B", platform: 'YouTube', url: 'https://www.youtube.com/embed/PEGccV-NOm8', category: 'fuerza', bpm: 125 },
        { id: 'fz24', title: "Bad and Boujee", artist: "Migos ft. Lil Uzi Vert", platform: 'YouTube', url: 'https://www.youtube.com/embed/S-sJp1FfG7Q', category: 'fuerza', bpm: 125 },
        { id: 'fz25', title: "Remember the Name", artist: "Fort Minor", platform: 'YouTube', url: 'https://www.youtube.com/embed/VDvr08sCPOc', category: 'fuerza', bpm: 85 }
    ],
    running_cycling: [
        { id: 'rc1', title: "Don't Let Me Down", artist: "The Chainsmokers ft. Daya", platform: 'YouTube', url: 'https://www.youtube.com/embed/Io0fBr1XBUA', category: 'running_cycling', bpm: 160 },
        { id: 'rc2', title: "Wake Me Up", artist: "Avicii", platform: 'YouTube', url: 'https://www.youtube.com/embed/IcrbM1l_BoI', category: 'running_cycling', bpm: 124 },
        { id: 'rc3', title: "Animals", artist: "Martin Garrix", platform: 'YouTube', url: 'https://www.youtube.com/embed/DuFUtL8zUAk', category: 'running_cycling', bpm: 128 },
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
        { id: 'rc14', title: "Good Feeling", artist: "Flo Rida", platform: 'YouTube', url: 'https://www.youtube.com/embed/3OnnDqH6Wj8', category: 'running_cycling', bpm: 128 },
        { id: 'rc15', title: "Levels", artist: "Avicii", platform: 'YouTube', url: 'https://www.youtube.com/embed/_ovdm2yX4MA', category: 'running_cycling', bpm: 126 },
        { id: 'rc16', title: "Adventure Of A Lifetime", artist: "Coldplay", platform: 'YouTube', url: 'https://www.youtube.com/embed/QtXby3twMmI', category: 'running_cycling', bpm: 109 },
        { id: 'rc17', title: "Radioactive", artist: "Imagine Dragons", platform: 'YouTube', url: 'https://www.youtube.com/embed/ktvTqknDobU', category: 'running_cycling', bpm: 136 },
        { id: 'rc18', title: "Counting Stars", artist: "OneRepublic", platform: 'YouTube', url: 'https://www.youtube.com/embed/hT_nvWreIhg', category: 'running_cycling', bpm: 122 },
        { id: 'rc19', title: "Right Here, Right Now", artist: "Fatboy Slim", platform: 'YouTube', url: 'https://www.youtube.com/embed/ub747pprmJ8', category: 'running_cycling', bpm: 127 },
        { id: 'rc20', title: "Sugar", artist: "Robin Schulz ft. Francesco Yates", platform: 'YouTube', url: 'https://www.youtube.com/embed/bvC_0foemLY', category: 'running_cycling', bpm: 120 },
        { id: 'rc21', title: "Rather Be", artist: "Clean Bandit ft. Jess Glynne", platform: 'YouTube', url: 'https://www.youtube.com/embed/m-M1AtrxztU', category: 'running_cycling', bpm: 115 },
        { id: 'rc22', title: "Physical", artist: "Dua Lipa", platform: 'YouTube', url: 'https://www.youtube.com/embed/9HDEHj2yzew', category: 'running_cycling', bpm: 146 },
        { id: 'rc23', title: "Runaway (U & I)", artist: "Galantis", platform: 'YouTube', url: 'https://www.youtube.com/embed/5XR7naZ_zZA', category: 'running_cycling', bpm: 128 },
        { id: 'rc24', title: "Don't Start Now", artist: "Dua Lipa", platform: 'YouTube', url: 'https://www.youtube.com/embed/oygrmJFKYZY', category: 'running_cycling', bpm: 124 },
        { id: 'rc25', title: "Party Rock Anthem", artist: "LMFAO", platform: 'YouTube', url: 'https://www.youtube.com/embed/KQ6zr6kCPj8', category: 'running_cycling', bpm: 130 }
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
