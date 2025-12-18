"use client";

import { useState } from "react";

export default function AddProductToCategory({ categoryId }) {
  const [rawContent, setRawContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    setError("");
    setResult(null);

    if (!rawContent || rawContent.trim().length < 50) {
      setError("متن محصول خیلی کوتاهه.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ai/product-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          rawContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطا در پردازش اطلاعات");
      }

      setResult(data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 space-y-5">
      <h2 className="text-xl font-bold text-gray-800">
        تولید خودکار محصول با هوش مصنوعی
      </h2>

      {/* Raw Content */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          متن محصول (از سایت مرجع کپی کن)
        </label>
        <textarea
          value={rawContent}
          onChange={(e) => setRawContent(e.target.value)}
          rows={8}
          placeholder="توضیحات کامل محصول رو اینجا پیست کن..."
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* Action */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-lg bg-black text-white py-3 text-sm font-semibold hover:bg-gray-900 disabled:opacity-60"
      >
        {loading ? "در حال تحلیل و ساخت محصول..." : "ساخت محصول با AI"}
      </button>

      {/* Result Preview */}
      {result && (
        <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            خروجی اولیه (قابل ویرایش در مرحله بعد):
          </p>
          <pre className="text-xs overflow-x-auto bg-white p-3 rounded border">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
