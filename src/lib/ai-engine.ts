import aboutData from "../knowledge/about.json";
import educationData from "../knowledge/education.json";
import skillsData from "../knowledge/skills.json";
import projectsData from "../knowledge/projects.json";
import certificationsData from "../knowledge/certifications.json";
import experienceData from "../knowledge/experience.json";
import achievementsData from "../knowledge/achievements.json";
import contactData from "../knowledge/contact.json";
import personalityData from "../knowledge/personality.json";
import futureData from "../knowledge/future.json";

export interface FollowUp {
  keywords: string[];
  answer: string;
}

export interface Intent {
  intent: string;
  category: string;
  sample_questions: string[];
  alternate_phrasings: string[];
  answer: string;
  tags: string[];
  priority: number;
  follow_ups?: FollowUp[];
}

const allIntents: Intent[] = [
  ...(aboutData as Intent[]),
  ...(educationData as Intent[]),
  ...(skillsData as Intent[]),
  ...(projectsData as Intent[]),
  ...(certificationsData as Intent[]),
  ...(experienceData as Intent[]),
  ...(achievementsData as Intent[]),
  ...(contactData as Intent[]),
  ...(personalityData as Intent[]),
  ...(futureData as Intent[])
];

// Synonyms expansion mapping
const synonymMap: Record<string, string[]> = {
  "projects": ["project", "built", "made", "work", "develop", "developed", "developments", "creator", "applications", "apps"],
  "skills": ["skill", "stack", "technologies", "technology", "tools", "languages", "language", "databases", "programming"],
  "about": ["who", "what", "background", "bio", "dhanush", "dhanu", "dhamodharan", "owner", "creator", "developer"],
  "education": ["college", "university", "gpa", "cgpa", "school", "study", "studying", "degree", "academics"],
  "certifications": ["certificate", "certificates", "certified", "credentials", "course", "courses", "exams"],
  "experience": ["internship", "job", "intern", "freelance", "freelancing", "work", "nsic"],
  "achievements": ["milestones", "accomplishments", "won", "records", "awards", "award"],
  "leadership": ["coordinator", "representative", "cr", "leader", "lead", "manage"],
  "contact": ["email", "phone", "whatsapp", "linkedin", "github", "reach", "socials", "hire"]
};

// Help map synonym tokens back to primary concepts
const synonymLookup: Record<string, string> = {};
for (const [primary, words] of Object.entries(synonymMap)) {
  synonymLookup[primary] = primary;
  for (const w of words) {
    synonymLookup[w] = primary;
  }
}

// Simple stop words
const stopWords = new Set([
  "is", "the", "a", "an", "and", "or", "but", "to", "for", "in", "on", "at", 
  "of", "with", "by", "about", "your", "my", "me", "i", "he", "his", "him", 
  "you", "do", "does", "did", "can", "could", "would", "should", "tell", "show", "give",
  "what", "where", "who", "when", "why", "how", "which", "are", "am", "was", "were", 
  "be", "been", "being", "have", "has", "had", "will", "shall", "may", "might", "must",
  "us", "we", "they", "them", "she", "it", "her", "their", "our", "this", "that", 
  "these", "those", "here", "there", "from", "about", "again", "further", "then", "once"
]);

// Normalizes and stems words
function normalizeWord(word: string): string {
  let w = word.toLowerCase().trim();
  w = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  if (w.endsWith("s") && w.length > 3) w = w.slice(0, -1);
  if (w.endsWith("ing") && w.length > 5) w = w.slice(0, -3);
  if (w.endsWith("ed") && w.length > 4) w = w.slice(0, -2);
  return w;
}

// Levenshtein distance for typo tolerance
function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const matrix = Array.from({ length: len1 + 1 }, () => new Array(len2 + 1).fill(0));
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[len1][len2];
}

// Checks if words are similar (accounting for minor spelling errors)
function wordsAreSimilar(w1: string, w2: string): boolean {
  const clean1 = normalizeWord(w1);
  const clean2 = normalizeWord(w2);
  if (!clean1 || !clean2) return false;
  if (clean1 === clean2) return true;
  if (clean1.length < 4 || clean2.length < 4) return false;
  const dist = levenshteinDistance(clean1, clean2);
  const threshold = clean1.length > 6 ? 2 : 1;
  return dist <= threshold;
}

// Extract and normalize unique tokens from a sentence
export function tokenize(text: string): string[] {
  const words = text.split(/\s+/);
  const tokens: string[] = [];
  for (const w of words) {
    const norm = normalizeWord(w);
    if (norm && !stopWords.has(norm)) {
      tokens.push(norm);
    }
  }
  return tokens;
}

export class AIEngine {
  private currentContext: Intent | null = null;
  private cache: Record<string, { answer: string; intent: Intent | null }> = {};

  // Find matching answer for query
  public getResponse(query: string): { answer: string; intent: Intent | null; suggestions: string[] } {
    const cleanQuery = query.toLowerCase().trim();
    if (this.cache[cleanQuery]) {
      const cached = this.cache[cleanQuery];
      this.currentContext = cached.intent;
      return {
        answer: cached.answer,
        intent: cached.intent,
        suggestions: this.getSuggestions(cached.intent)
      };
    }

    const queryTokens = tokenize(query);
    
    // 1. Expand query using synonyms
    const expandedTokens = new Set<string>();
    for (const t of queryTokens) {
      expandedTokens.add(t);
      const mappedConcept = synonymLookup[t];
      if (mappedConcept) {
        expandedTokens.add(mappedConcept);
        const siblings = synonymMap[mappedConcept] || [];
        for (const sib of siblings) {
          expandedTokens.add(sib);
        }
      }
    }
    const tokenList = Array.from(expandedTokens);

    // 2. Contextual follow-up check
    if (this.currentContext && this.currentContext.follow_ups) {
      // Look for a matching follow-up keyword
      let bestFollowUp: FollowUp | null = null;
      let maxMatchCount = 0;
      
      for (const fu of this.currentContext.follow_ups) {
        let matchCount = 0;
        for (const kw of fu.keywords) {
          const kwNorm = normalizeWord(kw);
          // Check exact or fuzzy matches
          if (tokenList.some(t => t === kwNorm || wordsAreSimilar(t, kwNorm))) {
            matchCount++;
          }
        }
        if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount;
          bestFollowUp = fu;
        }
      }

      if (bestFollowUp && maxMatchCount > 0) {
        const responseText = bestFollowUp.answer;
        // Keep the same intent context
        const result = {
          answer: responseText,
          intent: this.currentContext,
          suggestions: this.getSuggestions(this.currentContext)
        };
        this.cache[cleanQuery] = { answer: responseText, intent: this.currentContext };
        return result;
      }
    }

    // 3. Regular Intent Matching
    let bestIntent: Intent | null = null;
    let highestScore = 0;

    for (const item of allIntents) {
      let intentScore = 0;

      // Tag overlap scoring (high weight)
      for (const tag of item.tags) {
        const tagNorm = normalizeWord(tag);
        if (tokenList.some(t => t === tagNorm || wordsAreSimilar(t, tagNorm))) {
          intentScore += 2.0;
        }
      }

      // Sample questions & phrasings similarity scoring
      const questionsToCheck = [...item.sample_questions, ...item.alternate_phrasings];
      let bestPhraseScore = 0;

      for (const phrase of questionsToCheck) {
        const phraseTokens = tokenize(phrase);
        if (phraseTokens.length === 0) continue;

        // Calculate overlap
        let overlapCount = 0;
        for (const pt of phraseTokens) {
          if (tokenList.some(t => t === pt || wordsAreSimilar(t, pt))) {
            overlapCount++;
          }
        }

        // Jaccard similarity index
        const unionSize = new Set([...tokenList, ...phraseTokens]).size;
        const jaccard = unionSize > 0 ? overlapCount / unionSize : 0;
        const overlapRatio = overlapCount / phraseTokens.length;

        // Combine metrics
        const phraseScore = (jaccard * 0.6) + (overlapRatio * 0.4);
        if (phraseScore > bestPhraseScore) {
          bestPhraseScore = phraseScore;
        }
      }

      intentScore += bestPhraseScore * 4.0;
      
      // Multiply by priority weight
      intentScore *= (item.priority || 1.0);

      if (intentScore > highestScore) {
        highestScore = intentScore;
        bestIntent = item;
      }
    }

    // Minimum match threshold
    const matchThreshold = 0.5;
    let finalAnswer = "";
    let finalIntent: Intent | null = null;

    if (bestIntent && highestScore >= matchThreshold) {
      finalAnswer = bestIntent.answer;
      finalIntent = bestIntent;
      this.currentContext = bestIntent;
    } else {
      // Fallback response representing Dhanush honestly
      finalAnswer = "I want to make sure I give you the most accurate details about Dhanush. I don't have information on that specific query, but you can check out his projects, skills, or achievements using the suggested buttons below, or contact him directly at dhanushsinger872@gmail.com!";
      finalIntent = null;
    }

    this.cache[cleanQuery] = { answer: finalAnswer, intent: finalIntent };
    
    return {
      answer: finalAnswer,
      intent: finalIntent,
      suggestions: this.getSuggestions(finalIntent)
    };
  }

  // Generates dynamic follow-up options
  public getSuggestions(intent: Intent | null): string[] {
    if (!intent) {
      return [
        "Who is Dhanush?",
        "Show his top projects",
        "His achievements?",
        "What are his skills?"
      ];
    }

    const cat = intent.category;

    if (cat === "Projects" || cat === "Crop Yield Prediction" || cat === "AI Student Tracking" || cat === "EduSync AI" || cat === "VelOne ERP AI") {
      return [
        "Explain Crop Yield Prediction",
        "Explain AI Student Tracking",
        "Explain EduSync AI",
        "What technologies does he use?"
      ];
    }

    if (cat === "Skills" || cat === "AI & Data Science" || cat === "Machine Learning" || cat === "Computer Vision" || cat === "Python" || cat === "Java" || cat === "SQL") {
      return [
        "Why AI & Data Science?",
        "What certifications does he have?",
        "Can he build AI applications?",
        "Show his top projects"
      ];
    }

    if (cat === "Certifications") {
      return [
        "What are his top projects?",
        "Tell me about his internship",
        "Is he available for internships?",
        "How can I contact him?"
      ];
    }

    if (cat === "Contact" || cat === "Internship" || cat === "Freelancing") {
      return [
        "Is he available for internships?",
        "How can I contact him?",
        "Show his top projects",
        "Who is Dhanush?"
      ];
    }

    if (cat === "Personality" || cat === "Fun Questions" || cat === "Rapid Fire Questions") {
      return [
        "Let's play rapid fire",
        "What is his background?",
        "What are his skills?",
        "Why AI & Data Science?"
      ];
    }

    // Default suggestions
    return [
      "Who is Dhanush?",
      "Show his top projects",
      "His achievements?",
      "What are his skills?"
    ];
  }
}
