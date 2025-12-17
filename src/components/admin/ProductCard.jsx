'use client';

import Button from './Button';

export default function ProductCard({ product, onEdit, onDelete, onViewVariants }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gray-400">
            بدون تصویر
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.modelName}</p>
        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium">دسته‌بندی:</span> {product.category?.title || '-'}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">برند:</span> {product.brand?.name || '-'}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">ورزش:</span> {product.sport?.name || '-'}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">قیمت پایه:</span> {(product.basePrice || 0).toLocaleString('fa-IR')} تومان
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            ویرایش
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => onViewVariants(product)}
            className="flex-1"
          >
            واریانت‌ها
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(product)}
            className="flex-1"
          >
            حذف
          </Button>
        </div>
      </div>
    </div>
  );
}
