from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

app = FastAPI(title="ScreenSist - AI CV Screening Assistant")

app.mount("/static", StaticFiles(directory="static"), name="static")


class CVAnalysisRequest(BaseModel):
    cv_text: str = Field(..., min_length=10)
    job_requirements: str = Field(..., min_length=10)

class CVAnalysisResponse(BaseModel):
    evidence_found: list[str]
    requirements_not_found: list[str]
    relevant_skills: list[str]
    relevant_experience: list[str]
    clarification_questions: list[str]


@app.get("/")
def read_root():
    return FileResponse("static/index.html")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/analyze-cv")
def analyze_cv(request: CVAnalysisRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """
ROLE:
You are a professional HR recruiter.

TASK:
Review the information in a candidate's CV and compare it with the provided job requirements. Identify which requirements are supported by evidence in the CV and which requirements are not found.

CONTEXT:
The CV is being reviewed to help HR quickly identify relevant evidence related to the job requirements. The purpose is to extract and organize information from the CV, not to make a hiring decision.

CONSTRAINTS:
- Use only information explicitly written in the CV and job requirements.
- Do not invent or assume any skills, experience, qualifications, achievements, certifications, companies, dates, or numerical results.
- Do not decide whether the candidate should be hired or rejected.
- Do not rank the candidate or give a hiring score.
- If a job requirement is not supported by information in the CV, state that the requirement was not found in the CV. Do not say that the candidate does not have the skill.
- Distinguish mandatory requirements from optional or preferred qualifications. Skills or experience described as "nilai tambah", "preferred", "optional", or similar must not be included in requirements_not_found.
- Only include skills and actual experience that are directly relevant to the provided job requirements. Do not treat profile titles, education, or unrelated tools as relevant skills or experience.
- Clarification questions should only be used for requirements or information that are missing or unclear.
- Respond in the same language used in the CV and job requirements.

OUTPUT FORMAT:
Return only valid JSON. Do not use markdown, code blocks, tables, or any text outside the JSON.

Use exactly these five fields:

{
  "evidence_found": [],
  "requirements_not_found": [],
  "relevant_skills": [],
  "relevant_experience": [],
  "clarification_questions": []
}

All five fields must contain lists of strings.
"""
                },
                {
                    "role": "user",
                    "content": f"""
CV:
{request.cv_text}

Job Requirements:
{request.job_requirements}
"""
                }
            ],
            model="openai/gpt-oss-120b"
        )

        ai_content = chat_completion.choices[0].message.content
        parsed_result = json.loads(ai_content)

        return CVAnalysisResponse(**parsed_result)
    
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="AI returned an invalid JSON response."
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze the CV. Please try again."
        )
