export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'peaceful' | 'excited' | 'tired';

export interface EmotionStyle {
  color: string;
  bgColor: string;
  name: string;
  music: {
    title: string;
    artist: string;
  };
}

export const emotionMap: Record<Emotion, EmotionStyle> = {
  neutral: {
    color: 'hsla(0, 0%, 100%, 0.8)',
    bgColor: 'hsla(0, 0%, 7%, 1)',
    name: '평온함',
    music: { title: 'Weightless', artist: 'Marconi Union' },
  },
  happy: {
    color: 'hsla(45, 100%, 70%, 0.8)',
    bgColor: 'hsla(45, 100%, 10%, 1)',
    name: '행복',
    music: { title: 'Happy', artist: 'Pharrell Williams' },
  },
  sad: {
    color: 'hsla(210, 100%, 70%, 0.8)',
    bgColor: 'hsla(210, 100%, 10%, 1)',
    name: '슬픔',
    music: { title: 'Someone Like You', artist: 'Adele' },
  },
  angry: {
    color: 'hsla(0, 100%, 70%, 0.8)',
    bgColor: 'hsla(0, 100%, 10%, 1)',
    name: '분노',
    music: { title: 'In the End', artist: 'Linkin Park' },
  },
  peaceful: {
    color: 'hsla(150, 100%, 70%, 0.8)',
    bgColor: 'hsla(150, 100%, 10%, 1)',
    name: '평화',
    music: { title: 'River Flows in You', artist: 'Yiruma' },
  },
  excited: {
    color: 'hsla(280, 100%, 70%, 0.8)',
    bgColor: 'hsla(280, 100%, 10%, 1)',
    name: '신남',
    music: { title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake' },
  },
  tired: {
    color: 'hsla(20, 20%, 60%, 0.8)',
    bgColor: 'hsla(20, 10%, 15%, 1)',
    name: '피곤',
    music: { title: 'Coffee', artist: 'Beabadoobee' },
  },
};

const keywords: Record<string, Emotion> = {
  '좋아': 'happy',
  '기뻐': 'happy',
  '행복': 'happy',
  '최고': 'happy',
  '웃음': 'happy',
  '슬퍼': 'sad',
  '울어': 'sad',
  '우울': 'sad',
  '힘들어': 'sad',
  '속상': 'sad',
  '화나': 'angry',
  '짜증': 'angry',
  '열받': 'angry',
  '분해': 'angry',
  '편안': 'peaceful',
  '조용': 'peaceful',
  '포근': 'peaceful',
  '안정': 'peaceful',
  '기대': 'excited',
  '설레': 'excited',
  '즐거': 'excited',
  '대박': 'excited',
  '졸려': 'tired',
  '피곤': 'tired',
  '지쳐': 'tired',
  '나른': 'tired',
};

export function analyzeSentiment(text: string): Emotion {
  if (!text.trim()) return 'neutral';

  const scores: Record<Emotion, number> = {
    neutral: 0,
    happy: 0,
    sad: 0,
    angry: 0,
    peaceful: 0,
    excited: 0,
    tired: 0,
  };

  let maxScore = 0;
  let detectedEmotion: Emotion = 'neutral';

  for (const [keyword, emotion] of Object.entries(keywords)) {
    if (text.includes(keyword)) {
      scores[emotion]++;
      if (scores[emotion] > maxScore) {
        maxScore = scores[emotion];
        detectedEmotion = emotion;
      }
    }
  }

  return detectedEmotion;
}
