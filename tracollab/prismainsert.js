const {PrismaClient} = require('@prisma/client');

// Créer une instance de PrismaClient
const prisma = new PrismaClient();

// URLs des dossiers de stockage
const storageFolder = "https://storage.googleapis.com/tracollab-storage/",
    instrumentalsFolder = storageFolder + "instrumentals/",
    imagesFolder = storageFolder + "images/";

// Fonction pour générer le chemin d'accès à un son
function generateAudioPath(title) {
    return instrumentalsFolder + encodeURIComponent(title);
}

// Populer la base de données, pour avoir une base afin d'implémenter le frontend/backend
async function main() {
    /* Exemples de requêtes Prisma
    try {
        // Insertion d'un nouvel utilisateur dans la base de données
        // const user = await prisma.user.create({
        //   data: {
        //     email: 'john.doe@example.com',
        //     name: 'John Doe',
        //     password: 'password',
        //     profilePicture: 'https://example.com/profile.jpg',
        //     joinDate: new Date()
        //   },
        // });

        // Insertion d'un nouveau genre dans la base de données
        // const genre = await prisma.genre.create({
        //   data: {
        //     name: 'Hip-Hop',
        //   },
        // });
        //
        // // Insertion d'un nouveau son dans la base de données
        // const sound = await prisma.sound.create({
        //   data: {
        //     title: 'Sound 1',
        //     audioPath: 'lien_cloud_storage',
        //     picture: 'https://example.com/sound1.jpg',
        //     genreId: genre.id,
        //   },
        // });

        // Supprimer des genres de la base de données
        // await prisma.genre.findFirst().then(async (genre) => {
        //   await prisma.genre.delete({
        //     where: {
        //       id: genre.id,
        //     },
        //   });
        // });

        // Récupérer un son de la base de données
        // const retrievedSound = await prisma.sound.findFirst({
        //     where: {
        //         title: "Sound 1"
        //     },
        // }).then((sound) =>
        //     // Afficher l'URL du son
        //     console.log("URL: " + sound.audioPath)
        // );
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans la base de données :', error);
    } finally {
        // Déconnecter Prisma après l'opération
        await prisma.$disconnect();
    }
     */

    /* Insertion de genres dans la base de données
    try {
        let hiphop, rap, jazz, rock, classical, blues, reggae, pop, country, electronic, soul, rnb, funk, metal, salsa,
            disco, house, techno, latin, kpop, afrobeat;

        const genres = await prisma.genre.createMany({
            data: [
                hiphop = {name: 'Hip-Hop'},
                rap = {name: 'Rap'},
                jazz = {name: 'Jazz'},
                rock = {name: 'Rock'},
                classical = {name: 'Classical'},
                blues = {name: 'Blues'},
                reggae = {name: 'Reggae'},
                pop = {name: 'Pop'},
                country = {name: 'Country'},
                electronic = {name: 'Electronic'},
                soul = {name: 'Soul'},
                rnb = {name: 'R&B'},
                funk = {name: 'Funk'},
                metal = {name: 'Metal'},
                salsa = {name: 'Salsa'},
                disco = {name: 'Disco'},
                house = {name: 'House'},
                techno = {name: 'Techno'},
                latin = {name: 'Latin'},
                kpop = {name: 'K-Pop'},
                afrobeat = {name: 'Afrobeat'},
            ],
        });
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans la base de données :', error);
    } finally {
        // Déconnecter Prisma après l'opération
        await prisma.$disconnect();
    } */

    /* Insertion de sons dans la base de données
    try {
        // Variables pour stocker les genres, pour pouvoir récupérer leurs IDs et les associer aux sons
        let jazz = await prisma.genre.findFirst({where: {name: "Jazz"}}),
            kpop = await prisma.genre.findFirst({where: {name: "K-Pop"}}),
            reggae = await prisma.genre.findFirst({where: {name: "Reggae"}}),
            pop = await prisma.genre.findFirst({where: {name: "Pop"}}),
            techno = await prisma.genre.findFirst({where: {name: "Techno"}}),
            hiphop = await prisma.genre.findFirst({where: {name: "Hip-Hop"}}),
            blues = await prisma.genre.findFirst({where: {name: "Blues"}}),
            rock = await prisma.genre.findFirst({where: {name: "Rock"}}),
            country = await prisma.genre.findFirst({where: {name: "Country"}}),
            afrobeat = await prisma.genre.findFirst({where: {name: "Afrobeat"}}),
            rap = await prisma.genre.findFirst({where: {name: "Rap"}}),
            electronic = await prisma.genre.findFirst({where: {name: "Electronic"}}),
            latin = await prisma.genre.findFirst({where: {name: "Latin"}}),
            metal = await prisma.genre.findFirst({where: {name: "Metal"}}),
            funk = await prisma.genre.findFirst({where: {name: "Funk"}}),
            rnb = await prisma.genre.findFirst({where: {name: "R&B"}}),
            soul = await prisma.genre.findFirst({where: {name: "Soul"}}),
            salsa = await prisma.genre.findFirst({where: {name: "Salsa"}}),
            house = await prisma.genre.findFirst({where: {name: "House"}});

        // Données des sons à insérer
        const soundsData = [
            {
                title: "INSTRU RAP JAZZ GROOVIN' BEAT  - Fred Killah.mp3",
                picture: imagesFolder + "JazzCover.jpg",
                genreId: jazz.id,
            },
            {
                title: "NEW KPOP TYPE BEAT (PLEASE READ DESCRIPTION).mp3",
                picture: imagesFolder + "KPopCover.jpg",
                genreId: kpop.id,
            },
            {
                title: "REGGAE INSTRUMENTAL - Roots Yard.mp3",
                picture: imagesFolder + "ReggaeCover.jpg",
                genreId: reggae.id,
            },
            {
                title: "[FREE] JAZZ TYPE BEAT SAXOPHONE - 777  LOFI BOOMBAP INSTRUMENTAL 2023.mp3",
                picture: imagesFolder + "JazzCover2.jpg",
                genreId: jazz.id,
            },
            {
                title: "Afrobeat_Burano.mp3",
                picture: imagesFolder + "AfrobeatCover.jpg",
                genreId: afrobeat.id,
            },
            {
                title: "Instru Rap Boom Bap Freestyle Piano - SEDATIF - Prod. By WEEDLACK.mp3",
                picture: imagesFolder + "RapCover.jpg",
                genreId: rap.id,
            },
            {
                title: "instrumental reggae - uso libre - beat 2020.mp3",
                picture: imagesFolder + "ReggaeCover.jpg",
                genreId: reggae.id,
            },
            {
                title: "Pop Instrumental Libre De Droit 2023  Instru Rock Guitare NO REASON - Prod. By Rise.mp3",
                picture: "",
                genreId: pop.id,
            },
            {
                title: "[Free] Tech House x Techno Type Beat - GROOVE  Club Banger Instrumental 2022  Electronic Rap Beat.mp3",
                picture: imagesFolder + "TechnoCover.jpg",
                genreId: techno.id,
            },
            {
                title: "[FREE] Hip-Hop Instrumental  Beat The Secret Of Babylon 2021.mp3",
                picture: imagesFolder + "HipHopCover.jpg",
                genreId: hiphop.id,
            },
            {
                title: "Smooth Dark Blues.mp3",
                picture: imagesFolder + "BluesCover.png",
                genreId: blues.id,
            },
            {
                title: "[FREE] Rock Type Beat Fake Love.mp3",
                picture: imagesFolder + "RockCover.jpg",
                genreId: rock.id,
            },
            {
                title: "Fun Love Country Type Beat In The Style Of Russell Dickerson A Million More By BachBeats.mp3",
                picture: imagesFolder + "CountryCover.jpg",
                genreId: country.id,
            },
            {
                title: "Guitar Blues Type Beat Evening Sexy Slow Blues Instrumental.mp3",
                picture: imagesFolder + "BluesCover.png",
                genreId: blues.id,
            },
            {
                title: "[FREE FOR PROFIT] Smooth Pop Type Beat - Done.mp3",
                picture: "",
                genreId: pop.id,
            },
            {
                title: "Afrobeat Instrumental HEAVEN Oxlade x Fireboy Dml x Skiibi x Davido Typebeat 2022.mp3",
                picture: imagesFolder + "AfrobeatCover2.jpg",
                genreId: afrobeat.id,
            },
            {
                title: "[FREE] House x Club Type Beat - ATTRACTED  Dance EDM Instrumental.mp3",
                picture: imagesFolder + "HouseCover.jpg",
                genreId: house.id,
            },
            {
                title: "[FREE] Deep House x Tech House Type Beat - DRIVE  Banger EDM Dance Club Techno Instrumental 2021.mp3",
                picture: imagesFolder + "ElectroCover.jpeg",
                genreId: electronic.id,
            },
            {
                title: "Latin Beat - LUMINA  Spanish Afro guitar type beat  Dancehall Instrumental 2023.mp3",
                picture: imagesFolder + "LatinCover.jpg",
                genreId: latin.id,
            },
            {
                title: "[FREE] Trap Metal Type Beat Lost (Heavy Dark Rock Guitar Rap Instrumental 2020).mp3",
                picture: imagesFolder + "MetalCover.jpg",
                genreId: metal.id,
            },
            {
                title: "Instru Funk - Type Beat Beverly Hills (Prod. TromatizMusic Ft HRNN).mp3",
                picture: imagesFolder + "FunkCover.jpg",
                genreId: funk.id,
            },
            {
                title: "Instru  Miami Funk Type Beat New Funk (Prod.Slimanesb).mp3",
                picture: imagesFolder + "FunkCover.jpg",
                genreId: funk.id,
            },
            {
                title: "R&B Guitar Type Beat - VIBE  Smooth R&B Guitar Instrumental 2022.mp3",
                picture: imagesFolder + "RNBCover.jpg",
                genreId: rnb.id,
            },
            {
                title: "R&B Type Beat - Feelings Out.mp3",
                picture: imagesFolder + "RNBCover.jpg",
                genreId: rnb.id,
            },
            {
                title: "(FREE) Acoustic SZA x Jhene Aiko Type Beat Soul.mp3",
                picture: imagesFolder + "SoulCover.jpg",
                genreId: soul.id,
            },
            {
                title: "Electro Latino House 2023 Type Beat Instrumental AZUL  by Shot Records.mp3",
                picture: imagesFolder + "ElectroCover2.jpg",
                genreId: electronic.id,
            },
            {
                title: "Tujamo, VINNE & Murotani - Techno Party (Bass House  Tech House).mp3",
                picture: imagesFolder + "TechnoCover2.jpg",
                genreId: techno.id,
            },
            {
                title: "Latin Boom Bap Instrumental x Salsa Hip Hop type beat - Habano  Nigma.mp3",
                picture: imagesFolder + "SalsaCover.jpg",
                genreId: salsa.id,
            },
        ];

        // Créer les objets "Sound" correspondants
        await prisma.sound.createMany({
            data: soundsData.map((sound) => ({
                ...sound,
                audioPath: generateAudioPath(sound.title),
            })),
        });

        // Récupérer les sons créés pour pouvoir les associer aux objets "Instrumental" (pour Voice pareil) par leur ID
        const createdSounds = await prisma.sound.findMany({
            where: {
                title: {in: soundsData.map((sound) => sound.title)},
            },
        });

        // Créer les objets "Instrumental" correspondants
        await prisma.instrumental.createMany({
            data: createdSounds.map((createdSound) => ({
                soundId: createdSound.id,
            })),
        });
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans la base de données :', error);
    } finally {
        // Déconnecter Prisma après l'opération
        await prisma.$disconnect();
    } */

    /* Insertion de posts dans la base de données
    try {
        // Récupérer les Sounds existants
        const instrumentals = await prisma.instrumental.findMany();

        // Créer des posts et les lier aux instrumentals
        const postsData = [
            {
                description: "Check out this amazing instrumental!",
                date: new Date(),
                userId: "66c5f01a973d083e14093aa9",
                soundId: instrumentals[0].soundId,
            },
            {
                description: "Loving this beat!",
                date: new Date(),
                userId: "66cdc46093d0319685c99fd2",
                soundId: instrumentals[1].soundId,
            },
            {
                description: "This one is fire!",
                date: new Date(),
                userId: "66cdc46093d0319685c99fd2",
                soundId: instrumentals[2].soundId,
            },
            {
                description: "Wow!",
                date: new Date(),
                userId: "66c5f01a973d083e14093aa9",
                soundId: instrumentals[3].soundId,
            },
            {
                description: "Incredible sound!",
                date: new Date(),
                userId: "66c5f01a973d083e14093aa9",
                soundId: instrumentals[4].soundId,
            },
            {
                description: "Enjoy!",
                date: new Date(),
                userId: "66c5f01a973d083e14093aa9",
                soundId: instrumentals[5].soundId,
            },
        ];

        // Insérer les posts dans la base de données
        await prisma.post.createMany({
            data: postsData,
        });

        console.log('Posts created successfully');
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans la base de données :', error);
    } finally {
        // Déconnecter Prisma après l'opération
        await prisma.$disconnect();
    } */
}

// Appeler la fonction principale
main();
