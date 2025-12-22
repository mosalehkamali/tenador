/**
 * Build a strict, enterprise-grade product creation prompt for ChatGPT
 * Output MUST be a clean JSON object usable directly for Product.create()
 */

export function buildProductTemplate({
  category,
  brands,
  sports,
  rawContent,
}) {
  if (!category) throw new Error("Category is required");
  if (!rawContent || rawContent.trim().length < 50) {
    throw new Error("Raw product content is too short");
  }

  // -----------------------------
  // 1. Category attribute rules
  // -----------------------------
  const attributeInstructions = category.attributes.map(attr => {
    let line = `- ${attr.name}
  label: ${attr.label}
  type: ${attr.type}
  required: ${attr.required ? "YES" : "NO"}`;

    if (attr.type === "select") {
      line += `
  allowed values: [${attr.options.join(", ")}]`;
    }

    return line;
  }).join("\n\n");

  // -----------------------------
  // 2. Brand & Sport context
  // -----------------------------
  const brandList = brands.map(b => ({
    id: b._id.toString(),
    name: b.name,
  }));

  const sportList = sports.map(s => ({
    id: s._id.toString(),
    name: s.name,
  }));

  // -----------------------------
  // 3. Final Prompt
  // -----------------------------
  return `
You are a senior Persian e-commerce product manager AI.

Your task is to READ the raw product content
and GENERATE a complete Product JSON object.

===============================
GLOBAL RULES (ABSOLUTE)
===============================
- Output ONLY valid JSON
- NO explanations
- NO comments
- NO extra fields
- Language: PERSIAN (fa-IR)
- Think carefully before choosing brand and sport
- Do NOT hallucinate information

===============================
JSON SAFETY RULES (CRITICAL)
===============================
- Output MUST be valid JSON
- All strings MUST have balanced double quotes
- No trailing commas
- Validate JSON structure before final output
- If any syntax error exists, fix it before returning
- Treat output as production data, not a draft

===============================
FIELD RULES (VERY IMPORTANT)
===============================

name:
- MUST strictly follow this exact pattern:
  "{Persian product type} {Persian brand name} {Exact model name from raw content}"
- Persian product type MUST be inferred from category and content (e.g. راکت تنیس)
- Persian brand name MUST be the Persian transliteration of the brand
  (e.g. Wilson → ویلسون, Nike → نایکی)
- Model name MUST be copied EXACTLY from raw content in English
- Do NOT translate, shorten, reorder, or modify the model name
- This rule overrides any other naming rule
Example:
Raw content: "Wilson Tour Slam Lite Adult Recreational Tennis Racket"
Correct name output:
"راکت تنیس ویلسون Tour Slam Lite"

modelName:
- Technical or commercial model serie identifier
- Can be English or mixed (e.g. "Air Zoom Pegasus 40")

shortDescription:
- Persian
- 1–2 concise sentences
- Marketing-friendly
- No emojis

longDescription:
- Persian
- Detailed, structured
- Explain usage, benefits, materials if possible
- SEO-friendly but natural

suitableFor:
- Persian
- Who this product is for (e.g. "مناسب بازیکنان حرفه‌ای تنیس")

basePrice:
- Number ONLY
- If price is missing, estimate realistically based on product type
- DO NOT write strings like "نامشخص"

score:
- DO NOT include this field at all

brand:
- Choose ONE brandId ONLY from provided list
- Match by semantic meaning, NOT guessing

sport:
- Choose ONE sportId ONLY from provided list
- Based on actual product usage

category:
- MUST be exactly: "${category._id}"

attributes:
- Keys MUST exactly match category attribute names
- Respect type strictly:
  - string → string
  - number → number
  - select → one of allowed values
- If value is NOT found in content:
  - If required → infer logically
  - If not required → omit the key

tag:
- Persian keywords
- Array of short strings
- Useful for search

mainImage:
- Direct image URL if available
- If not available, return empty string ""

gallery:
- Array of image URLs
- Can be empty []

===============================
CATEGORY DEFINITION
===============================
Category: ${category.title}
Category ID: ${category._id}

Category Attributes:
${attributeInstructions}

===============================
AVAILABLE BRANDS
===============================
${JSON.stringify(brandList, null, 2)}

===============================
AVAILABLE SPORTS
===============================
${JSON.stringify(sportList, null, 2)}

===============================
RAW PRODUCT CONTENT
===============================
${rawContent}

===============================
REQUIRED OUTPUT JSON STRUCTURE
===============================
{
  "name": "",
  "modelName": "",
  "shortDescription": "",
  "longDescription": "",
  "suitableFor": "",
  "basePrice": 0,
  "brand": "",
  "sport": "",
  "category": "${category._id}",
  "attributes": {},
  "tag": [],
  "mainImage": "",
  "gallery": []
}
`;
}
