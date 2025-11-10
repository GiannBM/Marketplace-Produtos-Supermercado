from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import sys
import json
import time



sentence = sys.argv[1]

model = SentenceTransformer("intfloat/multilingual-e5-base")

#model = SentenceTransformer("modelos/multilingual-e5-base")

#intfloat/multilingual-e5-base

sentenceFormatada = f"passage: {sentence}"

embeddings = model.encode(sentenceFormatada, normalize_embeddings=False)

embedding_tolist = embeddings.tolist()

#print(embedding_tolist)
print(json.dumps(embedding_tolist))
