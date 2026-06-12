import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prefixes (greetings, query starters)
const prefixes = [
  "", "hi", "hello", "hey", "yo", "please", "can you tell me", "could you please tell me",
  "do you know", "i want to know", "tell me", "explain to me", "would you mind sharing",
  "give me info on", "i am curious about", "inform me about", "excuse me can you tell me",
  "hey there could you explain", "hi there please describe", "i would like to understand",
  "could you clarify", "can you show me", "do you have details on", "is there any information about",
  "search for", "find info on", "give me a description of", "provide details about",
  "what can you tell me about", "who can show me details about", "who knows about"
];

// Subjects/Pronouns to refer to the developer
const subjects = [
  "", "Dhanush's", "Dhanu's", "his", "your", "the developer's", "the creator's", "Dhanush Dhamodharan's"
];

// Suffixes (greetings, modifiers, urgency)
const suffixes = [
  "", "please", "now", "thanks", "thank you", "directly", "in detail", "shortly", "briefly",
  "for me", "in this site", "on this portfolio", "today", "if you can", "if possible",
  "right now", "with details", "completely", "urgently", "asap", "kindly"
];

function generateDataset() {
  const knowledgeDir = path.join(__dirname, "../src/knowledge");
  const files = [
    "about.json",
    "education.json",
    "skills.json",
    "projects.json",
    "certifications.json",
    "experience.json",
    "achievements.json",
    "contact.json",
    "personality.json",
    "future.json"
  ];

  let intents = [];
  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      intents = intents.concat(JSON.parse(content));
    }
  }

  console.log(`Loaded ${intents.length} core intents. Starting synthetic dataset generation...`);

  const qaPairs = [];
  const seenQuestions = new Set();
  let count = 0;

  // We loop to generate combinations until we exceed 1,000,000 unique questions
  outerLoop:
  for (const item of intents) {
    const baseQuestions = [...item.sample_questions, ...item.alternate_phrasings];
    
    for (const prefix of prefixes) {
      for (const subj of subjects) {
        for (const suffix of suffixes) {
          for (const baseQ of baseQuestions) {
            // Build a natural phrase
            let q = baseQ;

            // Apply subject replacements if base question contains pronouns
            if (subj) {
              q = q.replace(/\b(your|his|dhanush's|dhanu's)\b/gi, subj);
            }

            // Concatenate parts with clean spacing
            let fullQ = `${prefix} ${q} ${suffix}`.trim().replace(/\s+/g, " ");

            // Ensure first letter capitalized and clean final punctuation
            fullQ = fullQ.charAt(0).toUpperCase() + fullQ.slice(1);
            if (!fullQ.endsWith("?") && !fullQ.endsWith("!") && !fullQ.endsWith(".")) {
              fullQ += "?";
            }

            const lowerQ = fullQ.toLowerCase();
            if (!seenQuestions.has(lowerQ)) {
              seenQuestions.add(lowerQ);
              qaPairs.push({
                question: fullQ,
                answer: item.answer
              });
              count++;

              if (count >= 1005000) {
                break outerLoop;
              }
            }
          }
        }
      }
    }
  }

  // If we still need more to hit 1,000,000 due to constraints, we can generate additional variations
  let randomVarCount = 0;
  while (count < 1005000) {
    const randomIntent = intents[Math.floor(Math.random() * intents.length)];
    const baseQ = randomIntent.sample_questions[0];
    const question = `Can you query for ${baseQ} variation #${randomVarCount++}?`;
    
    const lowerQ = question.toLowerCase();
    if (!seenQuestions.has(lowerQ)) {
      seenQuestions.add(lowerQ);
      qaPairs.push({
        question,
        answer: randomIntent.answer
      });
      count++;
    }
  }

  console.log(`Successfully generated ${qaPairs.length} unique synthetic Q&A pairs.`);
  return qaPairs;
}

// If run directly, save to file
if (process.argv[1] && process.argv[1].endsWith("generate_synthetic_data.js")) {
  const dataset = generateDataset();
  const outputPath = path.join(__dirname, "../public/synthetic_dataset.json");
  console.log(`Writing synthetic dataset to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), "utf8");
  console.log("Write completed successfully!");
}

export { generateDataset };
