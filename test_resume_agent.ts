import 'dotenv/config';
import { nasikoOrchestrator } from './server/nasiko/orchestrator';
import { registerAllAgents } from './server/agents';

registerAllAgents();

const testResume = `John Doe
john.doe@example.com
+1-555-123-4567
San Francisco, CA

SUMMARY
Senior Full Stack Engineer with 8 years of experience building scalable web applications.

EXPERIENCE
Senior Software Engineer at TechCorp Inc (2020-Present)
- Built microservices using Node.js, TypeScript, PostgreSQL, Redis
- Designed REST APIs and GraphQL endpoints
- Implemented CI/CD pipelines with GitHub Actions, Docker, Kubernetes
- Led team of 5 engineers

Software Engineer at StartupXYZ (2017-2020)
- Developed React/Redux frontend applications
- Built backend services with Python/FastAPI
- Used AWS (EC2, S3, RDS, Lambda)

EDUCATION
BS Computer Science, Stanford University (2017)

SKILLS
Languages: TypeScript, JavaScript, Python, SQL
Frontend: React, Redux, Next.js, Tailwind CSS
Backend: Node.js, Express, FastAPI, PostgreSQL, Redis
Cloud: AWS, Docker, Kubernetes
DevOps: GitHub Actions, Terraform
`;

async function test() {
  console.log('Testing Resume Agent with pre-signed URL Bedrock...\n');
  
  const result = await nasikoOrchestrator.execute<any, any>('resume_agent', {
    resume_text: testResume,
    file_name: 'test_resume.txt'
  });

  console.log('Provider:', result.provider || 'unknown');
  console.log('Latency:', result.latencyMs, 'ms');
  console.log('Tokens:', JSON.stringify(result.tokens));
  console.log('\nCandidate Name:', result.data.candidate?.name);
  console.log('Candidate Email:', result.data.candidate?.email);
  console.log('Candidate Location:', result.data.candidate?.location);
  console.log('Skills:', JSON.stringify(result.data.skills, null, 2));
  console.log('Experience count:', result.data.experience?.length);
  console.log('Education count:', result.data.education?.length);
  console.log('Projects count:', result.data.projects?.length);
  console.log('Seniority:', result.data.seniority_estimate);
  console.log('Summary:', result.data.resume_summary);
}

test().catch(console.error);