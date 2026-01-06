// Audio playback utility for queue announcements
// Uses offline audio files from /public/sounds

const BASE_URL = '/sounds';

const playAudioSequence = async (files: string[]): Promise<void> => {
  for (const file of files) {
    await new Promise<void>((resolve) => {
      const audio = new Audio(`${BASE_URL}/${file}`);

      audio.onended = () => resolve();

      audio.onerror = (e) => {
        console.error(`Failed to play ${file}`, e);
        // Resolve anyway to continue sequence even if one file fails
        resolve();
      };

      // Handle user interaction requirements or load errors
      audio.play().catch((e) => {
        console.error(`Play error for ${file}`, e);
        resolve();
      });
    });
  }
};

const getNumberAudioFiles = (n: number): string[] => {
  if (n === 0) return []; // 0 not available usually, or silent

  if (n <= 9) return [`${n}.mp3`];

  if (n === 10) return ['10.mp3'];
  if (n === 11) return ['11.mp3'];

  if (n < 20) {
    // 12-19: dua belas, tiga belas...
    return [`${n - 10}.mp3`, 'belas.mp3'];
  }

  if (n < 100) {
    const puluhan = Math.floor(n / 10);
    const satuan = n % 10;
    const files = [`${puluhan}.mp3`, 'puluh.mp3'];
    if (satuan > 0) {
      files.push(`${satuan}.mp3`);
    }
    return files;
  }

  if (n === 100) return ['100.mp3'];

  if (n < 1000) {
    const ratusan = Math.floor(n / 100);
    const sisa = n % 100;
    const files = [];

    if (ratusan === 1) {
      files.push('100.mp3');
    } else {
      files.push(`${ratusan}.mp3`, 'ratus.mp3');
    }

    if (sisa > 0) {
      files.push(...getNumberAudioFiles(sisa));
    }

    return files;
  }

  return [];
};


export const announceQueue = async (queueNumber: string, loket: number): Promise<void> => {
  // Parsing Queue Number
  const prefix = queueNumber.charAt(0).toUpperCase(); // 'A' or 'B'
  const numPart = parseInt(queueNumber.slice(1), 10);

  const playlist: string[] = [];

  // Dingdong
  playlist.push('dingdong.wav');

  // "Nomor Antrian"
  playlist.push('nomor antrian.mp3');

  // "A" or "B"
  if (prefix === 'A') {
    playlist.push('A.mp3');
  } else {
    playlist.push('b.mp3');
  }

  // Number
  playlist.push(...getNumberAudioFiles(numPart));

  // "Silahkan menuju loket"
  playlist.push('SILAHKAN.mp3');

  // Loket Number
  playlist.push(...getNumberAudioFiles(loket));

  await playAudioSequence(playlist);
};

export type ServiceType = 'A' | 'B';

export const announceQueueEmpty = async (serviceType?: ServiceType): Promise<void> => {
  const playlist: string[] = [];

  // Dingdong
  playlist.push('dingdong.wav');

  playlist.push('antrian.mp3');

  if (serviceType === 'A') {
    playlist.push('layanan pendaftarankunjungan.mp3');
  } else if (serviceType === 'B') {
    playlist.push('layanan informasi dan pengaduan.mp3');
  }

  playlist.push('sudah habis.mp3');

  await playAudioSequence(playlist);
};
