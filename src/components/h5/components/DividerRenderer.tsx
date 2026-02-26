import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function DividerRenderer({ node }: Props) {
  return (
    <hr
      style={{
        margin: node.style.margin || '8px 0',
        height: node.style.height || '1px',
        backgroundColor: node.style.backgroundColor || '#E5E7EB',
        border: 'none',
      }}
    />
  );
}
