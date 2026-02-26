import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function SpacerRenderer({ node }: Props) {
  const { height = 24 } = node.props as { height?: number };
  return <div style={{ height: `${height}px` }} />;
}
