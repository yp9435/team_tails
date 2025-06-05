import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock MirageJS for tests
vi.mock('../services/mirage', () => ({
  makeServer: vi.fn(() => ({
    shutdown: vi.fn(),
  })),
}));

// Mock canvas for React Flow tests
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => new Array(4)),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
})) as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock DragEvent for drag and drop tests
global.DragEvent = class DragEvent extends window.DragEvent {
  dataTransfer: any;
  constructor(type: string, eventInitDict?: DragEventInit) {
    super(type, eventInitDict);
    this.dataTransfer = {
      getData: vi.fn(),
      setData: vi.fn(),
      effectAllowed: '',
      dropEffect: 'move',
    };
  }
};
