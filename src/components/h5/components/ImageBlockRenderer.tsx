import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function ImageBlockRenderer({ node }: Props) {
  const { src = '', alt = '' } = node.props as { src?: string; alt?: string };

  return (
    <div
      className="overflow-hidden"
      style={{
        width: node.style.width || '100%',
        height: node.style.height || '180px',
        margin: node.style.margin,
        borderRadius: node.style.borderRadius,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
          Image Placeholder
        </div>
      )}
    </div>
  );
}
