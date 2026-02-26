export type PageStatus = 'draft' | 'published' | 'archived';

export type ComponentType =
  | 'banner'
  | 'product-card'
  | 'product-grid'
  | 'text-block'
  | 'image-block'
  | 'button'
  | 'coupon'
  | 'countdown'
  | 'divider'
  | 'spacer'
  | 'nav-bar'
  | 'price-table'
  | 'product-list'
  | 'promo-section'
  | 'contact-bar'
  | 'recharge-card'
  | 'flash-deal';

// --- 新增组件 Props 类型提示 ---

export interface PriceTableTier {
  threshold: number;
  discount: number;
  label?: string;
}

export interface ProductListItem {
  name: string;
  spec: string;
  price: number;
  originalPrice?: number;
  image?: string;
}

export type LoadPriority = 'critical' | 'lazy' | 'idle';

export interface ComponentStyle {
  width?: string | number;
  height?: string | number;
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  borderRadius?: string;
  border?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  overflow?: string;
}

export interface DataBinding {
  type: 'product' | 'product-list' | 'custom';
  productIds?: string[];
}

export interface EventConfig {
  trigger: 'click';
  action: 'link' | 'popup' | 'scroll-to';
  url?: string;
  targetId?: string;
  utmParams?: Record<string, string>;
}

export interface ComponentNode {
  id: string;
  type: ComponentType;
  name?: string;
  props: Record<string, unknown>;
  style: ComponentStyle;
  children?: ComponentNode[];
  dataBinding?: DataBinding;
  events?: EventConfig[];
  loadPriority: LoadPriority;
  visible: boolean;
  locked: boolean;
}

export interface PageConfig {
  backgroundColor: string;
  title: string;
  shareTitle?: string;
  shareDescription?: string;
  shareImage?: string;
  analytics: {
    enablePV: boolean;
    enableUV: boolean;
    enableClickTracking: boolean;
  };
}

export interface PageData {
  id: string;
  campaignId: string;
  title: string;
  description?: string;
  config: PageConfig;
  components: ComponentNode[];
  status: PageStatus;
  publishedUrl?: string;
  posterUrl?: string;
  createdAt: string;
  updatedAt: string;
}
