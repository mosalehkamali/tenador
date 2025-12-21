"use client";

import { useState } from "react";

export default function ProductCreateForm({ initialData }) {
  const [form, setForm] = useState(initialData);

  function updateField(path, value) {
    setForm(prev => ({ ...prev, [path]: value }));
  }

  function handleSubmit() {
    console.log("FINAL PRODUCT:", form);
    // TODO: POST /api/products
  }

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-bold">فرم نهایی ساخت محصول</h3>

      <input
        value={form.name}
        onChange={e => updateField("name", e.target.value)}
        className="w-full border p-3 rounded"
        placeholder="نام محصول"
      />

      <input
        value={form.modelName}
        onChange={e => updateField("modelName", e.target.value)}
        className="w-full border p-3 rounded"
        placeholder="مدل"
      />

      <textarea
        value={form.shortDescription}
        onChange={e => updateField("shortDescription", e.target.value)}
        className="w-full border p-3 rounded"
        rows={3}
      />

      <textarea
        value={form.longDescription}
        onChange={e => updateField("longDescription", e.target.value)}
        className="w-full border p-3 rounded"
        rows={6}
      />

      {/* Attributes */}
      {form.attributes && Object.entries(form.attributes).map(([key, val]) => (
        <input
          key={key}
          value={val}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              attributes: { ...prev.attributes, [key]: e.target.value },
            }))
          }
          className="w-full border p-3 rounded"
          placeholder={key}
        />
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        ساخت محصول
      </button>
    </div>
  );
}
