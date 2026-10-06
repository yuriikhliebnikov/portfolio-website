export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }


  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key is not configured on the server' });
  }

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const CV_TEXT = `
Yurii Khliebnikov
Phone: 07867242110
Email: iwizk128@gmail.com
Location: Brighton, UK | Eligibility: Graduate Visa (Full UK Right to Work)

Professional Summary
Computer Science undergraduate (expected First-Class Honours) driven by a genuine interest in how complex systems work. I enjoy building tools from scratch, whether that means developing network protocols, writing custom language interpreters, or training machine learning pipelines in Python and Java. My approach to problem-solving is highly adaptable and resilient—traits deeply shaped by my journey as a Ukrainian refugee, for which I received my school’s award for overcoming adversity. Having balanced rigorous technical coursework with fast-paced hospitality roles, I am looking for a graduate software engineering or data science position where I can contribute to a team, tackle hard problems, and continue growing as a developer.

Skills
Languages: Python, Java, SQL, JavaScript, HTML/CSS
Libraries: Scikit-Learn, PyTorch, Pandas, NLTK
Tools: Git, GitHub, Docker, DBeaver, VS Code, IntelliJ, REST APIs, ANTLR
Core Concepts: Object-Oriented Programming (OOP), Data Structures & Algorithms, Systems Architecture, Computer Vision, TCP/IP Networking, CPU Scheduling, Relational Databases

Education
Sept 2024 – June 2027
BSc Computer Science (Expected First-Class Honours), University of Sussex, Brighton, UK
Relevant Modules: Data Structures & Algorithms, Software Engineering, Databases, Operating Systems, Computer Networks, Program Analysis, Human-Computer Interaction, Introduction to Computer Security.

Graduated June 2024
A-Levels, Royal Grammar School Worcester, Worcester, UK
Subjects: Mathematics, Computer Science, Russian, Further Mathematics (AS).

Technical Projects
Machine Learning Systems (NLP & Computer Vision), Python, Scikit-Learn
- Developed a Natural Language Processing (NLP) pipeline to perform sentiment analysis.
- Built a Computer Vision system capable of performing face alignment by successfully detecting facial landmarks.

Network Protocol Implementations, Java, TCP/IP
- Implemented the Trivial File Transfer Protocol (TFTP) from scratch.
- Engineered a custom, simplified version of TFTP on top of TCP.

Language Interpreter, Java, ANTLR
- Designed and built an interpreter for a simple custom programming language using ANTLR.

CPU Scheduling Simulator, Java, System Architecture
- Developed a discrete event simulator to evaluate various CPU scheduling algorithms.

Cluedo Game Application, Java, Object-Oriented Design
- Collaborated within an Agile team to build a digital version of the Cluedo board game.

Experience
April 2024 – June 2026
Food Runner / Service Support, Catering & Hospitality Support, Brighton, UK

Awards & Interests
Awards: Royal Grammar School Worcester Award for Overcoming Adversity (2024).
Interests: Passionate about kitesurfing, basketball, tennis, and golf.
`;

  const parts = [{
    text: `You are a helpful assistant for my portfolio website. 
    Answer the visitor's question based on my resume text below. 
    Keep it concise, friendly, and professional. Do not make up facts outside of this resume.
    
    My Resume Text:
    ${CV_TEXT}
    
    Visitor's message: ${message}`
  }];

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: parts }]
      })
    });

    const data = await response.json();
    const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
    
    res.status(200).json({ reply: botMessage });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Oops, something went wrong connecting to the AI." });
  }
}
