const {PrismaClient} = require('@prisma/client');

// Créer une instance de PrismaClient
const prisma = new PrismaClient();

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

    /* Insertion de sons dans la base de données */
    try {
        let jazz0, kpop0, reggae0, jazz1, afrobeat0, rap0, reggae1, pop0, techno0, hiphop0, blues0, rock0, country0,
            blues1, pop1, afrobeat1, house0, electronic0, latin0, metal0, funk0, funk1, rnb0, rnb1, soul0, electronic1,
            techno1, salsa0;
        const instrumentalsFolder = "https://storage.googleapis.com/";

        let jazzId = prisma.genre.findFirst({where: {name: "Jazz"}}).then((genre) => genre.id);

        // Créer des sons
        const sounds = await prisma.sound.createMany({
            data: [
                jazz0 = {
                    title: "INSTRU RAP JAZZ GROOVIN' BEAT  - Fred Killah.mp3",
                    audioPath: instrumentalsFolder + "INSTRU%20RAP%20JAZZ%20GROOVIN'%20BEAT%20%20-%20Fred%20Killah.mp3",
                    picture: "",
                    genreId: jazzId,
                },
                kpop0 = {
                    title: "NEW KPOP TYPE BEAT (PLEASE READ DESCRIPTION).mp3",
                    audioPath: instrumentalsFolder + "NEW%20KPOP%20TYPE%20BEAT%20(PLEASE%20READ%20DESCRIPTION).mp3",
                    picture: "",
                    genreId: kpop.id,
                },
                reggae0 = {
                    title: "REGGAE INSTRUMENTAL - Roots Yard.mp3",
                    audioPath: instrumentalsFolder + "REGGAE%20INSTRUMENTAL%20-%20Roots%20Yard.mp3",
                    picture: "",
                    genreId: reggae.id,
                },
                jazz1 = {
                    title: "[FREE] JAZZ TYPE BEAT SAXOPHONE - 777  LOFI BOOMBAP INSTRUMENTAL 2023.mp3",
                    audioPath: instrumentalsFolder + "%5BFREE%5D%20JAZZ%20TYPE%20BEAT%20SAXOPHONE%20-%20777%20%20LOFI%20BOOMBAP%20INSTRUMENTAL%202023.mp3",
                    picture: "",
                    genreId: jazz.id,
                },
                afrobeat0 = {
                    title: "Afrobeat_Burano.mp3",
                    audioPath: instrumentalsFolder + "Afrobeat_Burano.mp3",
                    picture: "",
                    genreId: afrobeat.id,
                },
                rap0 = {
                    title: "Instru Rap Boom Bap Freestyle Piano - SEDATIF - Prod. By WEEDLACK.mp3",
                    audioPath: instrumentalsFolder + "Instru%20Rap%20Boom%20Bap%20Freestyle%20Piano%20-%20SEDATIF%20-%20Prod.%20By%20WEEDLACK.mp3",
                    picture: "",
                    genreId: rap.id,
                },
                reggae1 = {
                    title: "instrumental reggae - uso libre - beat 2020.mp3",
                    audioPath: instrumentalsFolder + "instrumental%20reggae%20-%20uso%20libre%20-%20beat%202020.mp3",
                    picture: "",
                    genreId: reggae.id,
                },
                pop0 = {
                    title: "Pop Instrumental Libre De Droit 2023  Instru Rock Guitare NO REASON - Prod. By Rise.mp3",
                    audioPath: instrumentalsFolder + "Pop%20Instrumental%20Libre%20De%20Droit%202023%20%20Instru%20Rock%20Guitare%20NO%20REASON%20-%20Prod.%20By%20Rise.mp3",
                    picture: "",
                    genreId: pop.id,
                },
                techno0 = {
                    title: "[Free] Tech House x Techno Type Beat - GROOVE  Club Banger Instrumental 2022  Electronic Rap Beat.mp3",
                    audioPath: instrumentalsFolder + "%5BFree%5D%20Tech%20House%20x%20Techno%20Type%20Beat%20-%20GROOVE%20%20Club%20Banger%20Instrumental%202022%20%20Electronic%20Rap%20Beat.mp3",
                    picture: "",
                    genreId: techno.id,
                },
                hiphop0 = {
                    title: "[FREE] Hip-Hop Instrumental  Beat The Secret Of Babylon 2021.mp3",
                    audioPath: instrumentalsFolder + "%5BFREE%5D%20Hip-Hop%20Instrumental%20%20Beat%20The%20Secret%20Of%20Babylon%202021.mp3",
                    picture: "",
                    genreId: hiphop.id,
                },
                blues0 = {
                    title: "Smooth Dark Blues.mp3",
                    audioPath: instrumentalsFolder + "Smooth%20Dark%20Blues.mp3",
                    picture: "",
                    genreId: blues.id,
                },
                rock0 = {
                    title: "[FREE] Rock Type Beat Fake Love.mp3",
                    audioPath: instrumentalsFolder + "%5BFREE%5D%20Rock%20Type%20Beat%20Fake%20Love.mp3",
                    picture: "",
                    genreId: rock.id,
                },
                country0 = {
                    title: "Fun Love Country Type Beat In The Style Of Russell Dickerson A Million More By BachBeats.mp3",
                    audioPath: instrumentalsFolder + "Fun%20Love%20Country%20Type%20Beat%20In%20The%20Style%20Of%20Russell%20Dickerson%20A%20Million%20More%20By%20BachBeats.mp3",
                    picture: "",
                    genreId: country.id,
                },
                blues1 = {
                    title: "Guitar Blues Type Beat Evening Sexy Slow Blues Instrumental.mp3",
                    audioPath: instrumentalsFolder + "Guitar%20Blues%20Type%20Beat%20Evening%20Sexy%20Slow%20Blues%20Instrumental.mp3",
                    picture: "",
                    genreId: blues.id,
                },
                pop1 = {
                    title: "[FREE FOR PROFIT] Smooth Pop Type Beat - Done.mp3",
                    audioPath: instrumentalsFolder + "%5BFREE%20FOR%20PROFIT%5D%20Smooth%20Pop%20Type%20Beat%20-%20Done.mp3",
                    picture: "",
                    genreId: pop.id,
                },
                afrobeat1 = {
                    title: "Afrobeat Instrumental HEAVEN Oxlade x Fireboy Dml x Skiibi x Davido Typebeat 2022.mp3",
                    audioPath: instrumentalsFolder + "Afrobeat%20Instrumental%20HEAVEN%20Oxlade%20x%20Fireboy%20Dml%20x%20Skiibi%20x%20Davido%20Typebeat%202022.mp3",
                    picture: "",
                    genreId: afrobeat.id,
                },
                house0 = {
                    title: "[FREE] House x Club Type Beat - ATTRACTED  Dance EDM Instrumental.mp3",
                    audioPath: instrumentalsFolder + "%5BFREE%5D%20House%20x%20Club%20Type%20Beat%20-%20ATTRACTED%20%20Dance%20EDM%20Instrumental.mp3",
                    picture: "",
                    genreId: house.id,
                },
                electronic0 = {
                    title: "[FREE] Deep House x Tech House Type Beat - DRIVE  Banger EDM Dance Club Techno Instrumental 2021.mp3",
                    audioPath: instrumentalsFolder + "%5BFREE%5D%20Deep%20House%20x%20Tech%20House%20Type%20Beat%20-%20DRIVE%20%20Banger%20EDM%20Dance%20Club%20Techno%20Instrumental%202021.mp3",
                    picture: "",
                    genreId: electronic.id,
                },
                latin0 = {
                    title: "Latin Beat - LUMINA  Spanish Afro guitar type beat  Dancehall Instrumental 2023.mp3",
                    audioPath: instrumentalsFolder + "Latin%20Beat%20-%20LUMINA%20%20Spanish%20Afro%20guitar%20type%20beat%20%20Dancehall%20Instrumental%202023.mp3",
                    picture: "",
                    genreId: latin.id,
                },
                metal0 = {
                    title: "[FREE] Trap Metal Type Beat Lost (Heavy Dark Rock Guitar Rap Instrumental 2020).mp3",
                    audioPath: instrumentalsFolder + "%5BFREE%5D%20Trap%20Metal%20Type%20Beat%20Lost%20(Heavy%20Dark%20Rock%20Guitar%20Rap%20Instrumental%202020).mp3",
                    picture: "",
                    genreId: metal.id,
                },
                funk0 = {
                    title: "Instru Funk - Type Beat Beverly Hills (Prod. TromatizMusic Ft HRNN).mp3",
                    audioPath: instrumentalsFolder + "Instru%20Funk%20-%20Type%20Beat%20Beverly%20Hills%20(Prod.%20TromatizMusic%20Ft%20HRNN).mp3",
                    picture: "",
                    genreId: funk.id,
                },
                funk1 = {
                    title: "Instru  Miami Funk Type Beat New Funk (Prod.Slimanesb).mp3",
                    audioPath: instrumentalsFolder + "Instru%20%20Miami%20Funk%20Type%20Beat%20New%20Funk%20(Prod.Slimanesb).mp3",
                    picture: "",
                    genreId: funk.id,
                },
                rnb0 = {
                    title: "R&B Guitar Type Beat - VIBE  Smooth R&B Guitar Instrumental 2022.mp3",
                    audioPath: instrumentalsFolder + "R%26B%20Guitar%20Type%20Beat%20-%20VIBE%20%20Smooth%20R%26B%20Guitar%20Instrumental%202022.mp3",
                    picture: "",
                    genreId: rnb.id,
                },
                rnb1 = {
                    title: "R&B Type Beat - Feelings Out.mp3",
                    audioPath: instrumentalsFolder + "R%26B%20Type%20Beat%20-%20Feelings%20Out.mp3",
                    picture: "",
                    genreId: rnb.id,
                },
                soul0 = {
                    title: "(FREE) Acoustic SZA x Jhene Aiko Type Beat Soul.mp3",
                    audioPath: instrumentalsFolder + "(FREE)%20Acoustic%20SZA%20x%20Jhene%20Aiko%20Type%20Beat%20Soul.mp3",
                    picture: "",
                    genreId: soul.id,
                },
                electronic1 = {
                    title: "Electro Latino House 2023 Type Beat Instrumental AZUL  by Shot Records.mp3",
                    audioPath: instrumentalsFolder + "Electro%20Latino%20House%202023%20Type%20Beat%20Instrumental%20AZUL%20%20by%20Shot%20Records.mp3",
                    picture: "",
                    genreId: electronic.id,
                },
                techno1 = {
                    title: "Tujamo, VINNE & Murotani - Techno Party (Bass House  Tech House).mp3",
                    audioPath: instrumentalsFolder + "Tujamo%2C%20VINNE%20%26%20Murotani%20-%20Techno%20Party%20(Bass%20House%20%20Tech%20House).mp3",
                    picture: "",
                    genreId: techno.id,
                },
                salsa0 = {
                    title: "Latin Boom Bap Instrumental x Salsa Hip Hop type beat - Habano  Nigma.mp3",
                    audioPath: instrumentalsFolder + "Latin%20Boom%20Bap%20Instrumental%20x%20Salsa%20Hip%20Hop%20type%20beat%20-%20Habano%20%20Nigma.mp3",
                    picture: "",
                    genreId: salsa.id,
                },
            ]
        });

        // Créer les objets "PostableSound" correspondants
        const postableSounds = await prisma.postableSound.createMany({
            data: [
                {
                    soundId: jazz0.id,
                },
                {
                    soundId: kpop0.id,
                },
                {
                    soundId: reggae0.id,
                },
                {
                    soundId: jazz1.id,
                },
                {
                    soundId: afrobeat0.id,
                },
                {
                    soundId: rap0.id,
                },
                {
                    soundId: reggae1.id,
                },
                {
                    soundId: pop0.id,
                },
                {
                    soundId: techno0.id,
                },
                {
                    soundId: hiphop0.id,
                },
                {
                    soundId: blues0.id,
                },
                {
                    soundId: rock0.id,
                },
                {
                    soundId: country0.id,
                },
                {
                    soundId: blues1.id,
                },
                {
                    soundId: pop1.id,
                },
                {
                    soundId: afrobeat1.id,
                },
                {
                    soundId: house0.id,
                },
                {
                    soundId: electronic0.id,
                },
                {
                    soundId: latin0.id,
                },
                {
                    soundId: metal0.id,
                },
                {
                    soundId: funk0.id,
                },
                {
                    soundId: funk1.id,
                },
                {
                    soundId: rnb0.id,
                },
                {
                    soundId: rnb1.id,
                },
                {
                    soundId: soul0.id,
                },
                {
                    soundId: electronic1.id,
                },
                {
                    soundId: techno1.id,
                },
                {
                    soundId: salsa0.id,
                },
            ]
        });

        // Créer les objets "Instrumental" correspondants
        const instrumentals = await prisma.instrumental.createMany({
            data: [
                {
                    soundId: jazz0.id,
                },
                {
                    soundId: kpop0.id,
                },
                {
                    soundId: reggae0.id,
                },
                {
                    soundId: jazz1.id,
                },
                {
                    soundId: afrobeat0.id,
                },
                {
                    soundId: rap0.id,
                },
                {
                    soundId: reggae1.id,
                },
                {
                    soundId: pop0.id,
                },
                {
                    soundId: techno0.id,
                },
                {
                    soundId: hiphop0.id,
                },
                {
                    soundId: blues0.id,
                },
                {
                    soundId: rock0.id,
                },
                {
                    soundId: country0.id,
                },
                {
                    soundId: blues1.id,
                },
                {
                    soundId: pop1.id,
                },
                {
                    soundId: afrobeat1.id,
                },
                {
                    soundId: house0.id,
                },
                {
                    soundId: electronic0.id,
                },
                {
                    soundId: latin0.id,
                },
                {
                    soundId: metal0.id,
                },
                {
                    soundId: funk0.id,
                },
                {
                    soundId: funk1.id,
                },
                {
                    soundId: rnb0.id,
                },
                {
                    soundId: rnb1.id,
                },
                {
                    soundId: soul0.id,
                },
                {
                    soundId: electronic1.id,
                },
                {
                    soundId: techno1.id,
                },
                {
                    soundId: salsa0.id,
                },
            ]
        });
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans la base de données :', error);
    } finally {
        // Déconnecter Prisma après l'opération
        await prisma.$disconnect();
    }
}

// Appeler la fonction principale
main();
