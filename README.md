# RefineAI

RefineAI is an AI-powered writing assistant that transforms messy, informal text into clear, professional communication.


### What It Does

- Improves grammar and clarity  
- Enhances tone and professionalism  
- Keeps the original meaning intact  
- Delivers a single, refined output  
- Supports professional or friendly tone and same-length or shortened output
- Includes general refinement, professional message, and academic writing presets
- Saves up to 20 successful refinements in this browser, with individual and clear-all deletion
- Lets users clear the input and download refined text

### Run Locally

Requirements: Java 17 or later, Node.js, and a Groq API key.

Start the backend in PowerShell:

```powershell
cd backend
$env:GROQ_API_KEY = "your-groq-api-key"
.\mvnw.cmd spring-boot:run
```

Keep that terminal open. In a separate terminal, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`). The frontend uses `http://localhost:8080` for the backend by default. Set `VITE_API_URL` in the frontend environment if the backend uses a different base URL. Do not commit API keys.

### Refinement API

The frontend sends refinement requests to `POST /api/groq/response` as JSON:

```json
{
  "prompt": "The text to refine",
  "preset": "GENERAL",
  "tone": "PROFESSIONAL",
  "length": "SAME_LENGTH"
}
```

The API key is configured on the backend using `GROQ_API_KEY`.
