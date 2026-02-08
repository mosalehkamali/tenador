export function buildAthleteAiTemplate({ sports, rawContent }) {
    if (!rawContent || rawContent.trim().length < 30) {
      throw new Error("متن ورودی برای استخراج اطلاعات کافی نیست");
    }
  
    const sportList = sports.map((s) => ({
      id: s._id.toString(),
      name: s.name,
    }));
  
    return `
  You are a senior sports journalist and data analyst.
  Your task is to extract athlete information from the provided RAW CONTENT and format it into a valid JSON object.
  
  ===============================
  GLOBAL RULES
  ===============================
  - Output ONLY valid JSON
  - Language: PERSIAN (fa-IR)
  - For missing fields, use null for numbers and empty string "" for strings
  - DO NOT hallucinate honors or data
  
  ===============================
  FIELD RULES
  ===============================
  - name: English Name (e.g. "Cristiano Ronaldo") - Only letters, numbers, spaces, - and _
  - title: Persian Full Name (e.g. "کریستیانو رونالدو")
  - birthDate: ISO Date string (YYYY-MM-DD)
  - height: Number (in cm)
  - weight: Number (in kg)
  - nationality: Persian name of country
  - bio: A professional summary in Persian
  - honors: Array of objects [{ "title": "...", "quantity": number, "description": "..." }]
  - sponsors: Array of strings (brand names)
  - sport: Choose the most relevant ID from the AVAILABLE SPORTS list
  
  ===============================
  AVAILABLE SPORTS
  ===============================
  ${JSON.stringify(sportList, null, 2)}
  
  ===============================
  RAW CONTENT
  ===============================
  ${rawContent}
  
  ===============================
  REQUIRED JSON STRUCTURE
  ===============================
  {
    "name": "",
    "title": "",
    "sport": "ID_FROM_LIST",
    "birthDate": "",
    "height": null,
    "weight": null,
    "nationality": "",
    "bio": "",
    "honors": [],
    "sponsors": []
  }
  `;
  }