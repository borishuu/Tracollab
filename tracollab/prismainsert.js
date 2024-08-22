const { PrismaClient } = require('@prisma/client');

// Créer une instance de PrismaClient
const prisma = new PrismaClient();

async function main() {
  try {
    // Insertion d'un nouvel utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'password',
        profilePicture: 'https://example.com/profile.jpg',
        joinDate: new Date()
      },
    });

    // Insertion d'un nouveau genre dans la base de données
    const genre = await prisma.genre.create({
      data: {
        name: 'Hip-Hop',
      },
    });

    // Insertion d'un nouveau son dans la base de données
    const sound = await prisma.sound.create({
      data: {
        title: 'Sound 1',
        audioPath: 'lien_cloud_storage',
        picture: 'https://example.com/sound1.jpg',
        genreId: genre.id, // Trouver comment récupérer l'id du genre Hip-Hop
        description: 'Description 1',
      },
    });

    // Afficher l'utilisateur créé
    console.log('Nouvel utilisateur inséré : ', user);
  } catch (error) {
    console.error('Erreur lors de l\'écriture dans la base de données :', error);
  } finally {
    // Déconnecter Prisma après l'opération
    await prisma.$disconnect();
  }
}

// Appeler la fonction principale
main();
