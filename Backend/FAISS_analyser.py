import sys
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize
import json
import faiss
import numpy as np

modelo = SentenceTransformer("intfloat/multilingual-e5-base")

data1 = sys.stdin.read()
data = json.loads(data1)

ids =[]
embeddings = []

resultado_final = {

    "ids": [],
}

tam = len(data["id"])

dimensoes=768

i=0

for i in range(0,tam):

    ids.append(data["id"][i]["id_"])
    embeddings.append(data["embeddings"][i]["embedding"])

    

embeddingsArray = np.array(embeddings, dtype='float32')

embeddingsQueryFormatado = f"query: {data["query"]}"
embeddingsQuery = modelo.encode([embeddingsQueryFormatado], normalize_embeddings=False)



## Parte do FAISS

index = faiss.IndexFlatL2(dimensoes)
index.add(embeddingsArray)   

porcentagem, indices = index.search(embeddingsQuery, k=4)


#print("Índices mais próximos:", indices)
#print("Distâncias:", porcentagem)

i=0
for i in range(0, len(indices[0])):

    j = indices[0][i]
    resultado_final["ids"].append(ids[j])


#print(resultado_final)
print(json.dumps(resultado_final, ensure_ascii=False))



















"""




import sys
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize
import json
import faiss
import numpy as np

modelo = SentenceTransformer('PORTULAN/serafim-900m-portuguese-pt-sentence-encoder')

data1 = sys.stdin.read()
data = json.loads(data1)

ids =[]
embeddings = []

tam = len(data["id"])

dimensoes=1536

i=0

for i in range(0,tam):

    ids.append(data["id"][i]["id_"])
    embeddings.append(data["embeddings"][i]["embedding"])




    

embeddingsArray = np.array(embeddings, dtype='float32')
embeddingsQuery = modelo.encode(data["query"])

embeddingsQuery = np.array([embeddingsQuery], dtype='float32')


embeddingsArray = normalize(embeddingsArray, norm='l2')  
embeddingsQuery = normalize(embeddingsQuery, norm='l2')


## Parte do FAISS
print(embeddingsQuery)
index = faiss.IndexFlatL2(dimensoes)
index.add(embeddingsArray)   

porcentagem, indices = index.search(embeddingsQuery, k=2)


print("Índices mais próximos:", indices)
print("Distâncias:", porcentagem)

#print(json.dumps(data, ensure_ascii=False))

"""