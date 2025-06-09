from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import sys
import json


sentence = sys.argv[1]


model = SentenceTransformer("intfloat/multilingual-e5-base")

#PORTULAN/serafim-900m-portuguese-pt-sentence-encoder
#intfloat/multilingual-e5-base
sentenceFormatada = f"passage: {sentence}"

embeddings = model.encode(sentenceFormatada, normalize_embeddings=False)

embedding_tolist = embeddings.tolist()

#print(embedding_tolist)
print(json.dumps(embedding_tolist))





### Utilizado no SERAFIM
#embeddings = model.encode(sentence)

#embedding_tolist = embeddings.tolist()

#print(json.dumps(embedding_tolist))