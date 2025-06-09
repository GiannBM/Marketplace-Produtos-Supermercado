from bs4 import BeautifulSoup
import requests
import re
import sys
import json


var1 = sys.argv[1]


produto=""
qtde = 0
unidade = ""
VlUni = 0
VlTotal = 0
data=""
endereco = ""
estabelecimento =""
cnpj=""

finaldata ={

    "produtos":[],
}

texto = requests.get(var1).text  # Fazendo o request para a URL

soup = BeautifulSoup(texto, 'lxml')

### Endereço e Cnpj e Estabelecimento
divconteudo = soup.find('div', id = 'conteudo')
divcenter = divconteudo.find('div', class_ = 'txtCenter')

divestabelecimento = divcenter.find('div', id = 'u20').get_text(strip = True)
divcnpjend = divcenter.find_all('div', class_ = 'text')

for div in divcnpjend:

    if(div == divcnpjend[0]):
        cnpj = div.get_text()
        cnpj = cnpj.replace("CNPJ:","").strip()

       # print("|",cnpj, "|")


    else:
        endereco = div.get_text(strip=True)
        endereco = re.sub(r'\s+', ' ', endereco)
       # print(endereco)


estabelecimento = divestabelecimento

### Data e Hora

divinfos = soup.find('div', id = 'infos')

divcolapse = divinfos.find_all('div')

divcolapse1 = divcolapse[0]

litag = divcolapse1.find('li').get_text()

final = re.search(r'(\d{2})/(\d{2})/(\d{4})\s(\d{2}):(\d{2}):(\d{2})', litag)

data+=final.group(3)
data+='-'
data+=final.group(2)
data+='-'
data+=final.group(1)
#data+='T'
#data+=final.group(4)
#data+=':'
#data+=final.group(5)
#data+=':'
#data+=final.group(6)


### Dados Gerais de Compra

jobs = soup.find('table', id = 'tabResult')

achartr = jobs.find_all('tr')


for tr in achartr:

    #print("\n")
    produto = tr.find('span', class_ = 'txtTit').text
    

    qtde = tr.find('span', class_ = 'Rqtd')
    destroy = qtde.find('strong')
    destroy.decompose()
    qtde = qtde.get_text(strip=True)


    unidade = tr.find('span', class_ = 'RUN')
    destroy = unidade.find('strong')
    destroy.decompose()
    unidade = unidade.get_text(strip=True)

    VlUni = tr.find('span', class_ = 'RvlUnit')
    destroy = VlUni.find('strong')
    destroy.decompose()
    VlUni = VlUni.get_text(strip=True)

    VlTotal = tr.find('span', class_ = 'valor')
    VlTotal = VlTotal.get_text(strip=True)

    dadoss = {

        "Produto": produto,
        "Quantidade" : qtde,
        "Unidade" : unidade,
        "ValorUnitario": VlUni,
        "ValorTotal" :VlTotal,
        "Data" :data,
        "Endereco": endereco, 
        "Estabelecimento": estabelecimento,
        "Cnpj" : cnpj
    }

    finaldata["produtos"].append(dadoss)


print(json.dumps(finaldata, ensure_ascii=False))
