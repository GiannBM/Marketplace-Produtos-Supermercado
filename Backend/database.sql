
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
	produto varchar(40) not null,
	quantidade varchar(1) NOT NULL,
	unidade varchar(10) not null,
	valorunitario varchar(10) NOT NULL,
	valortotal varchar(10) NOT NULL,
	datas DATE,
	endereco varchar(100) NOT NULL,
	estabelecimento varchar(50) NOT NULL,
	cnpj varchar(15) NOT NULL

);

CREATE TABLE produtosatualizados(
	id_ bigserial primary key,
	produto varchar(200) not null,
	unidade varchar(10) not null,
	valorunitario varchar(10) NOT NULL,
	datas DATE,
	endereco varchar(300) NOT NULL,
	estabelecimento varchar(300) NOT NULL,
	cnpj varchar(15) NOT NULL

);
