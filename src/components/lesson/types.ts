export type BlockType = 'header' | 'paragraph' | 'code' | 'list' | 'info';

export interface ContentBlock {
  id: string;
  type: BlockType;
  title?: string;
  content?: string;
  items?: string[];
}

export interface ContextMenuState {
  x: number;
  y: number;
  blockId: string | null;
}
