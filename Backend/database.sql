
CREATE DATABASE Mercado;


CREATE TABLE users(
	id_ bigserial primary key,
	email varchar(35) not null,
	nome varchar(30) NOT NULL,
	senha varchar(30) not null
);


CREATE TABLE produtos(
	id_ bigserial primary key,
	iduser INTEGER,
	produto varchar(120) not null,
	quantidade varchar(4) NOT NULL,
	unidade varchar(10) not null,
	valorunitario varchar(10) NOT NULL,
	valortotal varchar(10) NOT NULL,
	datas DATE,
	endereco varchar(300) NOT NULL,
	estabelecimento varchar(300) NOT NULL,
	cnpj varchar(50) NOT NULL,
	embedding double precision,
	latitude varchar(50) NOT NULL,
	longitude varchar(50) NOT NULL,
	idcompra INTEGER

);

CREATE TABLE produtosatualizados(
	id_ bigserial primary key,
	produto varchar(200) not null,
	unidade varchar(50) not null,
	valorunitario varchar(50) NOT NULL,
	datas DATE,
	endereco varchar(300) NOT NULL,
	estabelecimento varchar(300) NOT NULL,
	cnpj varchar(50) NOT NULL,
	embedding double precision,
	latitude varchar(50) NOT NULL,
	longitude varchar(50) NOT NULL

);

CREATE TABLE itens_listacompras (
    id_ SERIAL PRIMARY KEY,
    lista_id INTEGER NOT NULL REFERENCES listas_compras(id_) ON DELETE CASCADE,
    produto VARCHAR(150) NOT NULL,
    quantidade NUMERIC(10,2) NOT NULL,
    unidade VARCHAR(20),
    comprado BOOLEAN DEFAULT FALSE
);

CREATE TABLE listas_compras (
    id_ SERIAL PRIMARY KEY,
	iduser INTEGER NOT NULL REFERENCES users(id_) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    datas date
);


CREATE TABLE compras (
    id_ SERIAL PRIMARY KEY,
	iduser INTEGER NOT NULL REFERENCES users(id_) ON DELETE CASCADE,
    estabelecimento VARCHAR(100) NOT NULL,
    data_compra date,
	valor_total NUMERIC(10,2) NOT NULL,
);