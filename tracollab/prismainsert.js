const { PrismaClient } = require('@prisma/client');

// Créer une instance de PrismaClient
const prisma = new PrismaClient();

async function main() {
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

    // // Insertion d'un nouveau genre dans la base de données
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

    // Supprimer des genres
    // await prisma.genre.findFirst().then(async (genre) => {
    //   await prisma.genre.delete({
    //     where: {
    //       id: genre.id,
    //     },
    //   });
    // });

    // Récupérer un son
    const retrievedSound = await prisma.sound.findFirst({
        where: {
            title: "Sound 1"
        },
    }).then((sound) =>
        // Afficher l'URL du son
        console.log("URL: " + sound.audioPath)
    );

    // Afficher l'utilisateur créé
    // console.log('Nouvel utilisateur inséré : ', user);
  } catch (error) {
    console.error('Erreur lors de l\'écriture dans la base de données :', error);
  } finally {
    // Déconnecter Prisma après l'opération
    await prisma.$disconnect();
  }
}

// Appeler la fonction principale
main();
