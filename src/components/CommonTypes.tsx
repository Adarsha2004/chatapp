export interface ChatMessage {
  text: string;
  role: 'user' | 'assistant';
  audioFile?: {
    name: string;
    url: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  date: string;
}
