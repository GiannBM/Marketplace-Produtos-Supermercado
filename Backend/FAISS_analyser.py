import sys
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize
import json
import faiss
import numpy as np
from geopy.distance import geodesic
import time


modelo = SentenceTransformer("intfloat/multilingual-e5-base")

#modelo = SentenceTransformer("modelos/multilingual-e5-base")

data1 = sys.stdin.read()                 
data = json.loads(data1)                # Lendo os dados de entrada para o Script

ids =[]
embeddings = []
distancias = []
distanciasAux = []



resultado_final = {

    "ids": [],                          # Embeddings Finais (LISTA)
}
 
tam = len(data["id"])

dimensoes=768                           # Dimensões do Modelo

i=0

latt = data["latUser"]
longg = data["longiUser"]

coordUser = (latt,longg)



for i in range(0,tam):


    latAtual = data["lat"][i]["latitude"]
    longAtual = data["longi"][i]["longitude"]
    tuplaAtual = (latAtual, longAtual)

    distancia = geodesic(coordUser, tuplaAtual).kilometers

    
    if(distancia<=data["distmax"]):

        distancias.append((data["id"][i]["id_"], distancia))
        ids.append(data["id"][i]["id_"])                            # Joguei todos os id_ dentro do array final "ids"
        embeddings.append(data["embeddings"][i]["embedding"])       # Fiz a mesma coisa para cada produto, mas com o "embedding" desta vez

    

embeddingsArray = np.array(embeddings, dtype='float32')         # Criando um array para fazer a operação

embeddingsQueryFormatado = f"query: {data["query"]}"                                            # Formatando a query para dentro de uma variavel
embeddingsQuery = modelo.encode([embeddingsQueryFormatado], normalize_embeddings=False)         # Fazendo o embedding da query


## Parte do FAISS

index = faiss.IndexFlatL2(dimensoes)                # Aplicando o FAISS e selecionando os 4 mais parecidos, com base na var "embeddingsArray"
index.add(embeddingsArray) 

porcentagem,indices = index.search(embeddingsQuery, k=4)


i=0
for i in range(0, len(indices[0])):

    j = indices[0][i]                          
    distanciasAux.append(distancias[j])


distanciaOrdenada = sorted(distanciasAux, key=lambda x: x[1])       # Ordenando pela distancia

i=0
for i in range(0, len(indices[0])):

    resultado_final["ids"].append(distanciaOrdenada[i][0]) # Pegando os id que estão dentro do array "ids" e fazendo o append


#print(resultado_final)
print(json.dumps(resultado_final, ensure_ascii=False))          # Mandando os resultados para o backend


