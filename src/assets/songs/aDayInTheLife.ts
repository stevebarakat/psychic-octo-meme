export const aDayInTheLife = {
  title: "A Day In The Life",
  slug: "a-day-in-the-life",
  artist: "The Beatles",
  year: "1967",
  studio: "Abby Road",
  location: "London, England",
  bpm: 79,
  start: 0.5,
  end: 267,
  tracks: [
    {
      id: crypto.randomUUID(),
      name: "Bass/Drums",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/bass-drums.mp3",
    },
    {
      id: crypto.randomUUID(),
      name: "Instruments",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/instruments.mp3",
    },
    {
      id: crypto.randomUUID(),
      name: "Orchestra",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/orchestra.mp3",
    },
    {
      id: crypto.randomUUID(),
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/vox.mp3",
    },
  ],
};
