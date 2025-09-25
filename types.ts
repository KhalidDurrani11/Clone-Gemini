export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface TextPart {
  text: string;
}

export type MessagePart = ImagePart | TextPart;

export interface Message {
  id: string;
  role: Role;
  parts: MessagePart[];
  timestamp: number;
}

export interface UploadedImage {
    mimeType: string;
    data: string;
    previewUrl: string;
}
