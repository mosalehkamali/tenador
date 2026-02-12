export function buildSerieTemplate({ brand, rawContent }) {
    if (!rawContent || rawContent.trim().length < 20) {
      throw new Error("محتوای خام برای پردازش کافی نیست.");
    }
  
    return `
  You are an expert E-commerce Catalog Architect specializing in sporting goods and fashion.
  Your mission is to transform disorganized raw text into a structured JSON for a product "Serie" (Collection) belonging to the brand "${brand.name}".
  
  ===============================
  CORE RULES (NON-NEGOTIABLE)
  ===============================
  1. **JSON ONLY**: Return a pure JSON object. No intro, no outro.
  2. **NAME VALIDATION**: The "name" field MUST be 100% English. Use only letters, numbers, and hyphens. (Example: "Air-Max-2024").
  3. **LANGUAGE SPLIT**: 
     - "title" and "description" MUST be in Persian (fa-IR).
     - "name" MUST be in English.
  4. **BRAND INTEGRITY**: You MUST use the provided Brand ID: "${brand._id}". Do not change it.
  
  ===============================
  DATA EXTRACTION SPECIFICATIONS
  ===============================
  - **name**: ${brand.prompts?.map(prompt => prompt.field === "name" ? prompt.context.toString() : null)}
  - **title**: ${brand.prompts?.map(prompt => prompt.field === "title" ? prompt.context.toString() : null)}
  - **description**: ${brand.prompts?.map(prompt => prompt.field === "description" ? prompt.context.toString() : null)}
  - **colors**: 
      - Search the text for color mentions (e.g., "قرمز زرشکی", "Black/Volt").
      - Convert them to the most accurate HEX codes.
      - If no colors are found, use "#000000" for primary and "#FFFFFF" for secondary as fallbacks.
  
  ===============================
  CONTEXT & METADATA
  ===============================
  - Parent Brand Name: ${brand.name}
  - Database Brand ID: ${brand._id}
  - Input Text: 
  """
  ${rawContent}
  """
  
  ===============================
  EXPECTED OUTPUT FORMAT
  ===============================
  {
    "name": "English-Serie-Name",
    "title": "عنوان فارسی سری",
    "description": "توضیحات جامع و تخصصی به زبان فارسی درباره ویژگی‌ها و کاربرد این سری محصولات...",
    "brand": "${brand._id}",
    "colors": {
      "primary": "#HEX",
      "secondary": "#HEX"
    },
    "logo": "",
    "icon": "",
    "image": ""
  }
  `;
  }