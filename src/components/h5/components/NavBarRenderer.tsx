import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function NavBarRenderer({ node }: Props) {
  const { title = '', backgroundColor = '#1F2937', textColor = '#FFFFFF' } = node.props as {
    title?: string;
    backgroundColor?: string;
    textColor?: string;
  };

  return (
    <div
      className="flex items-center justify-center font-medium"
      style={{
        padding: node.style.padding || '12px 16px',
        backgroundColor,
        color: textColor,
        fontSize: node.style.fontSize || 16,
      }}
    >
      {title}
    </div>
  );
}
