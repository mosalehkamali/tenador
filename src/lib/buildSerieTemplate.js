export function buildSerieTemplate({ brandId, brandName, rawContent }) {
    if (!rawContent || rawContent.trim().length < 20) {
      throw new Error("محتوای خام برای پردازش کافی نیست.");
    }
  
    return `
  You are an expert E-commerce Catalog Architect specializing in sporting goods and fashion.
  Your mission is to transform disorganized raw text into a structured JSON for a product "Serie" (Collection) belonging to the brand "${brandName}".
  
  ===============================
  CORE RULES (NON-NEGOTIABLE)
  ===============================
  1. **JSON ONLY**: Return a pure JSON object. No intro, no outro.
  2. **NAME VALIDATION**: The "name" field MUST be 100% English. Use only letters, numbers, and hyphens. (Example: "Air-Max-2024").
  3. **LANGUAGE SPLIT**: 
     - "title" and "description" MUST be in Persian (fa-IR).
     - "name" MUST be in English.
  4. **BRAND INTEGRITY**: You MUST use the provided Brand ID: "${brandId}". Do not change it.
  
  ===============================
  DATA EXTRACTION SPECIFICATIONS
  ===============================
  - **name**: Identify the exact technical name of the model/series. Remove any Persian characters. Format it as a URL-friendly string if possible.
  - **title**: Create a compelling Persian title. (e.g., "ایر مکس").
  - **description**: Write a high-conversion marketing description (at least 3-4 sentences). Focus on:
      - The core technology (e.g., cushioning, material).
      - The target use case (e.g., professional running, lifestyle).
      - The unique selling point (USP) of this specific serie.
  - **colors**: 
      - Search the text for color mentions (e.g., "قرمز زرشکی", "Black/Volt").
      - Convert them to the most accurate HEX codes.
      - If no colors are found, use "#000000" for primary and "#FFFFFF" for secondary as fallbacks.
  
  ===============================
  CONTEXT & METADATA
  ===============================
  - Parent Brand Name: ${brandName}
  - Database Brand ID: ${brandId}
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
    "brand": "${brandId}",
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