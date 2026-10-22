"""Exact cosine Top-K baseline over exported, normalized vectors."""
import argparse, json
import numpy as np
parser=argparse.ArgumentParser();parser.add_argument("embeddings");parser.add_argument("--query",type=int,default=0);parser.add_argument("--top-k",type=int,default=10);args=parser.parse_args();data=np.load(args.embeddings);scores=data["optical"]@data["sar"][args.query];order=np.argsort(-scores)[:args.top_k];print(json.dumps([{"index":int(i),"similarity":float(scores[i])} for i in order],indent=2))
