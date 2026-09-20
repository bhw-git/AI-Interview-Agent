import { AgentExecutionContext, BaseAgent } from '../../nasiko/contracts';
import { llmClient } from '../../llm/client';
import { RESUME_AGENT_SYSTEM_PROMPT } from './prompt';
import {
  CandidateProfile,
  ResumeAgentInput,
  validateResumeAgentInput,
  validateResumeAgentOutput,
} from './schema';

export class ResumeReadingAgent implements BaseAgent<ResumeAgentInput, CandidateProfile> {
  name = 'resume_agent' as const;
  displayName = 'Resume Reading Agent';
  version = '1.0.0';
  responsibility = 'Extracts verified structured candidate profiles from raw resume documents';

  validateInput(input: unknown) {
    return validateResumeAgentInput(input);
  }

  validateOutput(output: unknown) {
    return validateResumeAgentOutput(output);
  }

  async execute(input: ResumeAgentInput, _context: AgentExecutionContext) {
    const userPrompt = `
Process the following resume text and extract the candidate profile into JSON:
File Name: ${input.file_name || 'Uploaded Resume'}

--- RESUME CONTENT ---
${input.resume_text}
--- END RESUME CONTENT ---

Respond with JSON adhering to this exact format:
{
  "candidate": {
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone number or empty string",
    "location": "City, State/Country"
  },
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "university": "University Name",
      "graduation_year": "2023",
      "cgpa": "3.8/4.0 or empty"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Dates",
      "responsibilities": ["Responsibility 1"],
      "technologies": ["Java", "Spring Boot"],
      "domain": "Fintech / E-commerce"
    }
  ],
  "skills": {
    "languages": [],
    "backend": [],
    "frontend": [],
    "databases": [],
    "cloud": [],
    "devops": [],
    "frameworks": [],
    "testing": [],
    "other": []
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Short description",
      "technologies": ["Spring Boot", "MySQL", "Docker"],
      "candidate_contribution": "Architected the backend and security layer",
      "technical_concepts": ["JWT Authentication", "Role-Based Access Control"],
      "potential_interview_topics": ["Spring Security filter chain", "Token validation"]
    }
  ],
  "certifications": [],
  "interview_topics": ["Spring Boot", "Microservices", "SQL optimization"],
  "seniority_estimate": "Junior / Mid / Senior",
  "resume_summary": "2-3 sentence technical summary",
  "ambiguities_flagged": []
}
`;

    const llmResponse = await llmClient.generateStructuredJSON<CandidateProfile>(
      RESUME_AGENT_SYSTEM_PROMPT,
      userPrompt,
      0.1
    );

    // Provide default fallback values if any missing
    const data = llmResponse.data;
    if (!data.candidate) data.candidate = { name: 'Candidate', email: '', phone: '', location: '' };
    if (!data.skills) {
      data.skills = {
        languages: [],
        backend: [],
        frontend: [],
        databases: [],
        cloud: [],
        devops: [],
        frameworks: [],
        testing: [],
        other: [],
      };
    }
    if (!data.projects) data.projects = [];
    if (!data.experience) data.experience = [];
    if (!data.education) data.education = [];
    if (!data.interview_topics) data.interview_topics = [];

    return {
      data,
      llmLatencyMs: llmResponse.latencyMs,
      tokens: llmResponse.estimatedTokens,
    };
  }
}
