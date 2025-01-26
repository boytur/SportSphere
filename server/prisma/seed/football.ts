import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const matches = [
  { date: "2025-02-01", sportSlug: "FB", homeTeam: "สีแดง หงส์เพลิง", awayTeam: "สีเหลือง กิเลนทองคำ", time: "14:00" },
  { date: "2025-02-01", sportSlug: "FB", homeTeam: "สีเขียว นาคา", awayTeam: "สีชมพู เอราวัณ", time: "15:00" },
  { date: "2025-02-01", sportSlug: "FB", homeTeam: "สีน้ำเงิน สุบรรณนที", awayTeam: "สีแดง หงส์เพลิง", time: "16:00" },
  { date: "2025-02-01", sportSlug: "FB", homeTeam: "สีเหลือง กิเลนทองคำ", awayTeam: "สีชมพู เอราวัณ", time: "17:00" },
  { date: "2025-02-01", sportSlug: "FB", homeTeam: "สีชมพู เอราวัณ", awayTeam: "สีน้ำเงิน สุบรรณนที", time: "18:00" },
  { date: "2025-02-01", sportSlug: "FB", homeTeam: "สีเหลือง กิเลนทองคำ", awayTeam: "สีเขียว นาคา", time: "19:00" },
  { date: "2025-02-02", sportSlug: "FB", homeTeam: "สีน้ำเงิน สุบรรณนที", awayTeam: "สีเหลือง กิเลนทองคำ", time: "10:00" },
  { date: "2025-02-02", sportSlug: "FB", homeTeam: "สีแดง หงส์เพลิง", awayTeam: "สีเขียว นาคา", time: "11:00" },
  { date: "2025-02-02", sportSlug: "FB", homeTeam: "สีชมพู เอราวัณ", awayTeam: "สีแดง หงส์เพลิง", time: "13:00" },
  { date: "2025-02-02", sportSlug: "FB", homeTeam: "สีเขียว นาคา", awayTeam: "สีน้ำเงิน สุบรรณนที", time: "14:00" },
];

async function main() {
  console.log("Seeding football matches...");

  for (const match of matches) {
    try {
      // Resolve the sport ID
      const sport = await prisma.sport.findUnique({
        where: { slug: match.sportSlug },
      });
      if (!sport) {
        throw new Error(`Sport with slug ${match.sportSlug} not found.`);
      }

      // Resolve the home team ID
      const homeTeam = await prisma.team.findUnique({
        where: { name: match.homeTeam },
      });
      if (!homeTeam) {
        throw new Error(`Home team ${match.homeTeam} not found.`);
      }

      // Resolve the away team ID
      const awayTeam = await prisma.team.findUnique({
        where: { name: match.awayTeam },
      });
      if (!awayTeam) {
        throw new Error(`Away team ${match.awayTeam} not found.`);
      }

      // Create the match
      const createdMatch = await prisma.match.create({
        data: {
          type: "duel",
          sportId: sport.id,
          participants: {
            create: [
              { teamId: homeTeam.id, rank: null, points: 0, score: 0 },
              { teamId: awayTeam.id, rank: null, points: 0, score: 0 },
            ],
          },
          createdAt: new Date(match.date),
          updatedAt: new Date(match.date),
          date: match.date + " " + match.time,
        },
      });

      console.log(
        `Created match: ${match.homeTeam} vs ${match.awayTeam} on ${match.date} at ${match.time}`
      );
    } catch (error) {
      console.error(`Error seeding match: ${error}`);
    }
  }

  console.log("Football match seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
