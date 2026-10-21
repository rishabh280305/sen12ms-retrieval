export type RetrievalEvaluation = {
  recallAt: Record<string, number>;
  meanReciprocalRank: number;
  rankings: { queryIndex: number; rankedCandidateIndices: number[]; similarities: number[]; relevantRank: number }[];
};

function normalized(vector: number[]) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(magnitude) || magnitude === 0) throw new Error("Embeddings must be finite and non-zero.");
  return vector.map(value => value / magnitude);
}

export function cosineSimilarity(left: number[], right: number[]) {
  if (left.length === 0 || left.length !== right.length) throw new Error("Embedding dimensions must match and be non-empty.");
  const a = normalized(left);
  const b = normalized(right);
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

export function evaluatePairedRetrieval(queries: number[][], candidates: number[][], requestedK = [1, 5, 10]): RetrievalEvaluation {
  if (queries.length === 0 || queries.length !== candidates.length) throw new Error("Paired query and candidate sets must have the same non-zero size.");
  const dimension = queries[0].length;
  if (dimension === 0 || [...queries, ...candidates].some(vector => vector.length !== dimension)) throw new Error("All embeddings must share one non-zero dimension.");

  const rankings = queries.map((query, queryIndex) => {
    const scored = candidates.map((candidate, candidateIndex) => ({ candidateIndex, similarity: cosineSimilarity(query, candidate) }))
      .sort((left, right) => right.similarity - left.similarity || left.candidateIndex - right.candidateIndex);
    return {
      queryIndex,
      rankedCandidateIndices: scored.map(item => item.candidateIndex),
      similarities: scored.map(item => item.similarity),
      relevantRank: scored.findIndex(item => item.candidateIndex === queryIndex) + 1,
    };
  });

  const recallAt = Object.fromEntries(requestedK.map(k => {
    const effectiveK = Math.min(k, candidates.length);
    const hits = rankings.filter(item => item.relevantRank <= effectiveK).length;
    return [`R@${k}`, hits / rankings.length];
  }));
  const meanReciprocalRank = rankings.reduce((sum, item) => sum + 1 / item.relevantRank, 0) / rankings.length;
  return { recallAt, meanReciprocalRank, rankings };
}
