
Seja muito bem vindo ao aplicativo de comparação de produtos de supermercados (ainda em desenvolvimento)!

Aplicativo este que permite realizar a entrada de dados via QRcode da nota fiscal e depois realizar a busca de um produto desejado!



1. Instale as Depêndencias

   Navegue até o diretório do projeto em que esta localizado o arquivo "package.json", e execute o comando a seguir: 

   'npm install'
   
2. Criando o Banco de Dados

   Certifique-se de ter o PostegreSQL instalado, assim como o pgadmin4 do PostgreSQL.
   Navegue para dentro do diretório /backend e abra o arquivo "database.sql"

   Execute todos os comando de criação de Database e Tabelas, que estão dentro do arquivo, no pgadmin4 do PostgreSQL.


3. Criação da Conexão com o Banco de Dados

   Navegue para dentro do diretório /backend e abra o arquivo "db.js"

   Mude os parâmetros:
      - user
      - password
      - host
      - port


4. Mudança de IP's

   Navegue para dentro da pasta /app

   Para cada página dentro da pasta, existe uma variavel chamada ipaddress, em que deverá conter o IP que irá rodar o Backend, deste modo, mude o IP para o IP da sua máquina.


5. Navegue para o diretório inicial do projeto e execute o comando:

   npx expo start


6. Navegue para dentro do diretório /backend

   node app.js
