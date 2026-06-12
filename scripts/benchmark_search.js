import { generateDataset } from "./generate_synthetic_data.js";

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

// Normalize and stem words (identical to ai-engine.ts)
function normalizeWord(word) {
  let w = word.toLowerCase().trim();
  w = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  if (w.endsWith("s") && w.length > 3) w = w.slice(0, -1);
  if (w.endsWith("ing") && w.length > 5) w = w.slice(0, -3);
  if (w.endsWith("ed") && w.length > 4) w = w.slice(0, -2);
  return w;
}

function tokenize(text) {
  const words = text.split(/\s+/);
  const tokens = [];
  for (const w of words) {
    const norm = normalizeWord(w);
    if (norm && !stopWords.has(norm)) {
      tokens.push(norm);
    }
  }
  return tokens;
}

// Levenshtein distance for typo tolerance
function levenshteinDistance(s1, s2) {
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

// SearchIndexer class (identical to search-indexer.ts)
class SearchIndexer {
  constructor() {
    this.index = new Map();
    this.qaStore = [];
    this.totalCount = 0;
  }

  bulkAdd(entries) {
    const startId = this.totalCount;
    this.totalCount += entries.length;
    
    for (let i = 0; i < entries.length; i++) {
      const id = startId + i;
      this.qaStore.push({
        id,
        question: entries[i].question,
        answer: entries[i].answer
      });

      const tokens = tokenize(entries[i].question);
      for (let j = 0; j < tokens.length; j++) {
        const t = tokens[j];
        let docIds = this.index.get(t);
        if (!docIds) {
          docIds = [];
          this.index.set(t, docIds);
        }
        docIds.push(id);
      }
    }
  }

  search(query, limit = 5) {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0 || this.totalCount === 0) {
      return [];
    }

    const candidateCounts = new Uint8Array(this.totalCount);
    const seen = new Uint8Array(this.totalCount);
    const candidates = [];

    for (let i = 0; i < queryTokens.length; i++) {
      const token = queryTokens[i];
      let docIds = this.index.get(token);

      // Typo tolerance lookup
      if (!docIds) {
        let bestTerm = "";
        let bestDist = 999;
        for (const term of this.index.keys()) {
          if (Math.abs(term.length - token.length) > 2) continue;
          const dist = levenshteinDistance(token, term);
          if (dist < bestDist && dist <= 2) {
            bestDist = dist;
            bestTerm = term;
          }
        }
        if (bestTerm) {
          docIds = this.index.get(bestTerm);
        }
      }

      if (!docIds) continue;

      for (let j = 0; j < docIds.length; j++) {
        const id = docIds[j];
        candidateCounts[id]++;
        if (seen[id] === 0) {
          seen[id] = 1;
          candidates.push(id);
        }
      }
    }

    if (candidates.length === 0) {
      return [];
    }

    const scoredCandidates = [];
    for (let i = 0; i < candidates.length; i++) {
      const id = candidates[i];
      scoredCandidates.push({ id, overlap: candidateCounts[id] });
    }
    
    scoredCandidates.sort((a, b) => b.overlap - a.overlap);
    const topCandidates = scoredCandidates.slice(0, 100);

    const results = [];
    const querySet = new Set(queryTokens);

    for (let i = 0; i < topCandidates.length; i++) {
      const cand = topCandidates[i];
      const qa = this.qaStore[cand.id];
      const qTokens = tokenize(qa.question);
      
      let intersection = 0;
      for (let j = 0; j < qTokens.length; j++) {
        if (querySet.has(qTokens[j])) {
          intersection++;
        }
      }

      const union = new Set([...queryTokens, ...qTokens]).size;
      const jaccard = union > 0 ? intersection / union : 0;
      const overlapRatio = qTokens.length > 0 ? intersection / qTokens.length : 0;
      
      const finalScore = (jaccard * 0.7) + (overlapRatio * 0.3);

      results.push({
        question: qa.question,
        answer: qa.answer,
        score: finalScore
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}

async function runBenchmark() {
  console.log("==================================================");
  console.log("             DHANU_AI_CORE BENCHMARK             ");
  console.log("==================================================");

  // 1. Generate Synthetic Data
  const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Initial Memory Usage: ${initialMemory.toFixed(2)} MB`);
  
  const genStart = Date.now();
  const dataset = generateDataset();
  const genEnd = Date.now();
  console.log(`Dataset generation took: ${((genEnd - genStart) / 1000).toFixed(2)} seconds`);

  // 2. Index the Dataset
  const indexer = new SearchIndexer();
  console.log(`\nIndexing ${dataset.length.toLocaleString()} entries...`);
  
  const indexStart = Date.now();
  indexer.bulkAdd(dataset);
  const indexEnd = Date.now();
  
  const postIndexMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Indexing took: ${((indexEnd - indexStart) / 1000).toFixed(2)} seconds`);
  console.log(`Memory after indexing: ${postIndexMemory.toFixed(2)} MB (Delta: ${(postIndexMemory - initialMemory).toFixed(2)} MB)`);

  // 3. Test Search Latency on Various Query Types
  const testQueries = [
    "Who is Dhanush?", // Exact match
    "Tell me about Crop Yield Prediction system technologies", // Multi-word semantic match
    "what are your credentialz?", // Typo tolerance
    "explain edusync campus tracking?", // Combination match
    "how to reach his contact info?", // Alternate phrasing
    "Is he available for internship?" // Context/Intent match
  ];

  console.log("\nRunning search benchmark queries:");
  console.log("--------------------------------------------------");

  let totalLatency = 0;
  for (const query of testQueries) {
    const searchStart = process.hrtime.bigint();
    const results = indexer.search(query, 1);
    const searchEnd = process.hrtime.bigint();
    
    const latency = Number(searchEnd - searchStart) / 1000000;
    totalLatency += latency;

    console.log(`Query: "${query}"`);
    if (results.length > 0) {
      console.log(`Match: "${results[0].question}" (Score: ${results[0].score.toFixed(3)})`);
      console.log(`Snippet: "${results[0].answer.substring(0, 100)}..."`);
    } else {
      console.log("Match: None");
    }
    console.log(`Latency: ${latency.toFixed(3)} ms`);
    console.log("--------------------------------------------------");
  }

  const avgLatency = totalLatency / testQueries.length;
  console.log(`Average Search Latency: ${avgLatency.toFixed(3)} ms`);
  console.log(`Performance check: ${avgLatency < 15 ? "PASSED (Sub-15ms)" : "FAILED (Above 15ms)"}`);
  console.log("==================================================");
}

runBenchmark();
