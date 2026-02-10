/**
 * Build a strict, enterprise-grade product creation prompt for ChatGPT
 * Output MUST be a clean JSON object usable directly for Product.create()
 */

export function buildProductTemplate({ category, brands, sports, rawContent }) {
  if (!category) throw new Error("Category is required");
  if (!rawContent || rawContent.trim().length < 50) {
    throw new Error("Raw product content is too short");
  }

  // -----------------------------
  // 1. Category attribute rules
  // -----------------------------
  const attributeInstructions = category.attributes
    .map((attr) => {
      let line = `- ${attr.name}
  label: ${attr.label}
  type: ${attr.type}
  required: ${attr.required ? "YES" : "NO"}`;
      if (attr.prompt) {
        line += `attribute rule: ${attr.prompt}`;
      }
      if (attr.type === "select") {
        line += `allowed values: [${attr.options.join(", ")}]`;
      }

      return line;
    })
    .join("\n\n");

  // -----------------------------
  // 2. Brand & Sport context
  // -----------------------------
  const brandList = brands.map((b) => ({
    id: b._id.toString(),
    name: b.name,
  }));

  const sportList = sports.map((s) => ({
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
${category.prompts?.map(prompt => prompt.field === "name" ? prompt.context.toString() : null)}

modelName:
${category.prompts?.map(prompt => prompt.field === "modelName" ? prompt.context.toString() : null)}

shortDescription:
${category.prompts?.map(prompt => prompt.field === "shortDescription" ? prompt.context.toString() : null)}

longDescription:
${category.prompts?.map(prompt => prompt.field === "longDescription" ? prompt.context.toString() : null)}

suitableFor:
${category.prompts?.map(prompt => prompt.field === "suitableFor" ? prompt.context.toString() : null)}

basePrice:
${category.prompts?.map(prompt => prompt.field === "basePrice" ? prompt.context.toString() : null)}

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
- select → ARRAY of strings (string[])
- For select attributes:
- Output value MUST be an array of strings
- Each value MUST be one of allowed values
- If raw content explicitly lists multiple values for a select attribute
(e.g. "L2L3L4", "L2 / L3 / L4", "Available in L2, L3 and L4"):
- Output ALL detected values as an array
- Preserve original order if possible
- Even single selections MUST be wrapped in an array
- If value is NOT found in content:
  - If required → infer logically
  - If not required → omit the key
  
  Example:
  Raw content:
  "Grip sizes: L2L3L4"
  
Correct attributes output:
"attributes": {
  "grip": ["L2", "L3", "L4"]
  }
  
  
  tag:
  ${category.prompts?.map(prompt => prompt.field === "tag" ? prompt.context.toString() : null)}

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
  - attributes values MUST conform exactly to rules above
  - select attributes MUST always be arrays, never strings
  "attributes": {},
  "tag": [],
  "mainImage": "",
  "gallery": []
}
`;
}
