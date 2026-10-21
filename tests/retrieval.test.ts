import { describe, expect, it } from "vitest";
import { cosineSimilarity, evaluatePairedRetrieval } from "../src/lib/retrieval";

describe("retrieval evaluation", () => {
  it("computes normalized cosine similarity", () => {
    expect(cosineSimilarity([2, 0], [5, 0])).toBeCloseTo(1, 10);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 10);
  });

  it("ranks paired candidates and calculates Recall@K", () => {
    const result = evaluatePairedRetrieval([[1, 0], [0, 1]], [[0.9, 0.1], [0.1, 0.9]]);
    expect(result.recallAt["R@1"]).toBe(1);
    expect(result.meanReciprocalRank).toBe(1);
    expect(result.rankings[0].rankedCandidateIndices[0]).toBe(0);
  });

  it("rejects inconsistent dimensions", () => {
    expect(() => evaluatePairedRetrieval([[1, 0]], [[1]])).toThrow(/dimension/i);
  });
});
