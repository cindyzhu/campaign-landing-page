'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { ComponentNode, ComponentType, PageData, PageConfig, ComponentStyle } from '@/types/page';

interface EditorState {
  page: PageData | null;
  selectedComponentId: string | null;
  history: PageData[];
  historyIndex: number;
  isDragging: boolean;
  zoom: number;
  isSaving: boolean;

  // Actions
  loadPage: (page: PageData) => void;
  selectComponent: (id: string | null) => void;
  addComponent: (component: ComponentNode, index?: number) => void;
  updateComponent: (id: string, updates: Partial<ComponentNode>) => void;
  updateComponentStyle: (id: string, style: Partial<ComponentStyle>) => void;
  updateComponentProps: (id: string, props: Record<string, unknown>) => void;
  removeComponent: (id: string) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  duplicateComponent: (id: string) => void;
  updatePageConfig: (config: Partial<PageConfig>) => void;
  undo: () => void;
  redo: () => void;
  setDragging: (isDragging: boolean) => void;
  setZoom: (zoom: number) => void;
  setSaving: (saving: boolean) => void;
}

const MAX_HISTORY = 50;

function pushHistory(state: EditorState) {
  if (!state.page) return;
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(JSON.parse(JSON.stringify(state.page)));
  state.historyIndex = state.history.length - 1;
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
    state.historyIndex--;
  }
}

export function createComponentNode(
  type: ComponentType,
  props: Record<string, unknown> = {},
  style: ComponentStyle = {}
): ComponentNode {
  const defaults: Record<ComponentType, { props: Record<string, unknown>; style: ComponentStyle }> = {
    'banner': { props: { images: [], autoplay: true, interval: 3000 }, style: { width: '100%', height: '200px' } },
    'product-card': { props: {}, style: { width: '100%', padding: '12px' } },
    'product-grid': { props: { columns: 2, gap: 12 }, style: { padding: '0 12px' } },
    'text-block': { props: { content: 'New Text', level: 'p' }, style: { padding: '12px 16px', fontSize: 16 } },
    'image-block': { props: { src: '', alt: '' }, style: { width: '100%', height: '180px' } },
    'button': { props: { text: 'Click Me', url: '#' }, style: { padding: '12px 24px', backgroundColor: '#3B82F6', color: '#FFFFFF', textAlign: 'center', borderRadius: '8px', margin: '12px 16px', fontWeight: 'bold' } },
    'coupon': { props: { code: 'SAVE20', discount: '20% OFF', description: 'Limited time offer' }, style: { margin: '12px 16px', padding: '16px', backgroundColor: '#FEF3C7', borderRadius: '12px', textAlign: 'center' } },
    'countdown': { props: { endTime: new Date(Date.now() + 86400000).toISOString(), label: 'Ends In' }, style: { padding: '16px', textAlign: 'center' } },
    'divider': { props: {}, style: { margin: '8px 0', height: '1px', backgroundColor: '#E5E7EB' } },
    'spacer': { props: { height: 24 }, style: {} },
    'nav-bar': { props: { title: 'Page Title', backgroundColor: '#1F2937', textColor: '#FFFFFF' }, style: { padding: '12px 16px' } },
    'price-table': {
      props: {
        title: 'Discount Tiers',
        currency: '$',
        tiers: [
          { threshold: 200, discount: 50, label: 'Spend $200 Save $50' },
          { threshold: 100, discount: 20, label: 'Spend $100 Save $20' },
          { threshold: 50, discount: 5, label: 'Spend $50 Save $5' },
        ],
      },
      style: { padding: '16px', margin: '12px 16px', backgroundColor: '#FEF2F2', borderRadius: '12px' },
    },
    'product-list': {
      props: { title: 'Product List', items: [], showIndex: true },
      style: { padding: '12px 16px', backgroundColor: '#FFFFFF' },
    },
    'promo-section': {
      props: { title: 'Featured', subtitle: '', decorStyle: 'ribbon', accentColor: '#EF4444' },
      style: { padding: '20px 16px 12px', textAlign: 'center' },
    },
    'contact-bar': {
      props: { phone: '1-800-888-8888', address: '', qrCodeUrl: '', wechatId: '' },
      style: { padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', margin: '12px 16px' },
    },
    'recharge-card': {
      props: { payAmount: 200, getAmount: 230, label: 'Top-up Bonus', badgeText: 'Best Value' },
      style: { padding: '20px', margin: '12px 16px', backgroundColor: '#FFF7ED', borderRadius: '12px', textAlign: 'center' },
    },
    'flash-deal': {
      props: { showTimer: true, buttonText: 'Buy', columns: 2 },
      style: { padding: '0 12px' },
    },
  };

  const def = defaults[type] || { props: {}, style: {} };

  return {
    id: nanoid(),
    type,
    name: type,
    props: { ...def.props, ...props },
    style: { ...def.style, ...style },
    loadPriority: 'critical',
    visible: true,
    locked: false,
  };
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    page: null,
    selectedComponentId: null,
    history: [],
    historyIndex: -1,
    isDragging: false,
    zoom: 1,
    isSaving: false,

    loadPage: (page) =>
      set((state) => {
        state.page = page;
        state.history = [JSON.parse(JSON.stringify(page))];
        state.historyIndex = 0;
        state.selectedComponentId = null;
      }),

    selectComponent: (id) =>
      set((state) => {
        state.selectedComponentId = id;
      }),

    addComponent: (component, index) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        if (index !== undefined) {
          state.page.components.splice(index, 0, component);
        } else {
          state.page.components.push(component);
        }
        state.selectedComponentId = component.id;
      }),

    updateComponent: (id, updates) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        const comp = state.page.components.find((c) => c.id === id);
        if (comp) Object.assign(comp, updates);
      }),

    updateComponentStyle: (id, style) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        const comp = state.page.components.find((c) => c.id === id);
        if (comp) Object.assign(comp.style, style);
      }),

    updateComponentProps: (id, props) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        const comp = state.page.components.find((c) => c.id === id);
        if (comp) Object.assign(comp.props, props);
      }),

    removeComponent: (id) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        state.page.components = state.page.components.filter((c) => c.id !== id);
        if (state.selectedComponentId === id) {
          state.selectedComponentId = null;
        }
      }),

    moveComponent: (fromIndex, toIndex) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        const [moved] = state.page.components.splice(fromIndex, 1);
        state.page.components.splice(toIndex, 0, moved);
      }),

    duplicateComponent: (id) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        const idx = state.page.components.findIndex((c) => c.id === id);
        if (idx === -1) return;
        const original = state.page.components[idx];
        const copy: ComponentNode = JSON.parse(JSON.stringify(original));
        copy.id = nanoid();
        copy.name = `${copy.name || copy.type} (copy)`;
        state.page.components.splice(idx + 1, 0, copy);
        state.selectedComponentId = copy.id;
      }),

    updatePageConfig: (config) =>
      set((state) => {
        if (!state.page) return;
        pushHistory(state);
        Object.assign(state.page.config, config);
      }),

    undo: () =>
      set((state) => {
        if (state.historyIndex <= 0) return;
        state.historyIndex--;
        state.page = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedComponentId = null;
      }),

    redo: () =>
      set((state) => {
        if (state.historyIndex >= state.history.length - 1) return;
        state.historyIndex++;
        state.page = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedComponentId = null;
      }),

    setDragging: (isDragging) =>
      set((state) => {
        state.isDragging = isDragging;
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.zoom = Math.max(0.5, Math.min(2, zoom));
      }),

    setSaving: (saving) =>
      set((state) => {
        state.isSaving = saving;
      }),
  }))
);
