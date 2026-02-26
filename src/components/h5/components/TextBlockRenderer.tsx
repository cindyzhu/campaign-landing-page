import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function TextBlockRenderer({ node }: Props) {
  const { content = '', level = 'p' } = node.props as { content?: string; level?: string };

  const style: React.CSSProperties = {
    padding: node.style.padding,
    margin: node.style.margin,
    fontSize: node.style.fontSize,
    fontWeight: node.style.fontWeight as React.CSSProperties['fontWeight'],
    color: node.style.color,
    backgroundColor: node.style.backgroundColor,
    textAlign: node.style.textAlign,
    borderRadius: node.style.borderRadius,
  };

  switch (level) {
    case 'h1':
      return <h1 style={style}>{content}</h1>;
    case 'h2':
      return <h2 style={style}>{content}</h2>;
    case 'h3':
      return <h3 style={style}>{content}</h3>;
    default:
      return <p style={style}>{content}</p>;
  }
}
