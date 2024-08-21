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
