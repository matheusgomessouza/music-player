import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.track.deleteMany({});

  // Create sample tracks
  const sampleTracks = [
    {
      title: 'Summer Vibes',
      artist: 'The Band',
      filename: 'summer-vibes.mp3',
      mimeType: 'audio/mpeg',
      size: BigInt(5242880), // 5MB
      duration: 240, // 4 minutes
      genre: 'Pop',
    },
    {
      title: 'Night Drive',
      artist: 'Synthwave Master',
      filename: 'night-drive.mp3',
      mimeType: 'audio/mpeg',
      size: BigInt(4194304), // 4MB
      duration: 300, // 5 minutes
      genre: 'Synthwave',
    },
    {
      title: 'Coffee Break',
      artist: 'Lo-fi Beats',
      filename: 'coffee-break.mp3',
      mimeType: 'audio/mpeg',
      size: BigInt(3145728), // 3MB
      duration: 180, // 3 minutes
      genre: 'Lo-fi',
    },
  ];

  for (const track of sampleTracks) {
    const created = await prisma.track.create({
      data: {
        ...track,
        key: `tracks/${track.filename}`,
      },
    });

    console.log(`Created track: ${created.title} by ${created.artist}`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
