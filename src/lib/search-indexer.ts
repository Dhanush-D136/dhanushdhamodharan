import { tokenize } from "./ai-engine";

export interface QAEntry {
  id: number;
  question: string;
  answer: string;
}

// Levenshtein distance calculation for typo tolerance
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

export class SearchIndexer {
  private index: Map<string, number[]> = new Map();
  private qaStore: QAEntry[] = [];
  private totalCount: number = 0;

  // Adds a single QA entry to the index
  public addEntry(question: string, answer: string): number {
    const id = this.totalCount++;
    const entry: QAEntry = { id, question, answer };
    this.qaStore.push(entry);

    const tokens = tokenize(question);
    for (const t of tokens) {
      let docIds = this.index.get(t);
      if (!docIds) {
        docIds = [];
        this.index.set(t, docIds);
      }
      docIds.push(id);
    }
    return id;
  }

  // Bulk add entries for high performance indexing
  public bulkAdd(entries: { question: string; answer: string }[]): void {
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

  // Searches the indexed dataset using a 2-pass retrieval + re-ranking model with typo tolerance
  public search(query: string, limit: number = 5): { question: string; answer: string; score: number }[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0 || this.totalCount === 0) {
      return [];
    }

    // 1st Pass: Quick Candidate Filtering using Typed Arrays
    const candidateCounts = new Uint8Array(this.totalCount);
    const seen = new Uint8Array(this.totalCount);
    const candidates: number[] = [];

    for (let i = 0; i < queryTokens.length; i++) {
      const token = queryTokens[i];
      let docIds = this.index.get(token);

      // Typo tolerance lookup: find closest match in vocabulary
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

    // Sort candidates by overlap count first to get top 100
    const scoredCandidates = candidates.map(id => ({
      id,
      overlap: candidateCounts[id]
    }));
    
    scoredCandidates.sort((a, b) => b.overlap - a.overlap);
    const topCandidates = scoredCandidates.slice(0, 100);

    // 2nd Pass: Detailed Re-ranking (Jaccard similarity + Token Overlap Ratio)
    const results: { question: string; answer: string; score: number }[] = [];
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

  public getStats(): { totalIndexed: number; uniqueTerms: number } {
    return {
      totalIndexed: this.totalCount,
      uniqueTerms: this.index.size
    };
  }
}
