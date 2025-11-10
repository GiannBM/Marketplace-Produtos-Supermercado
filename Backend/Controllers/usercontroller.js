const database = require("../db");
const { exec, spawn} = require('child_process');
const jwt = require('jsonwebtoken')


const SECRET = "4gcRTEpUllFv3AlJ76Af4evdkNtiow";

class UserController {


    async getUsers(req, res) {

        try{
            const data = await database.query("Select * from users;");
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
        

    }


    async getUsersbyid(req, res) {

        
        const number = req.params;

        try{
            const data = await database.query("Select * from users where id_=$1;", [number.id]);
            
            if(data.rows.length==0){

                throw erro;
            }
            else{
                return res.json(data.rows).status(200)
            }

        }catch(erro){

            return res.status(400).send({ message: "Usuario não existe1" });
            
        }
    }

    async postlogin(req, res) {

        const user = req.body

        try{
            const data = await database.query("SELECT * from users where email=$1;", [user.email]);
            
            if(data.rows.length==0){
                throw "Usuario nao existe"
            }
            
            if(data.rows[0].email===user.email){

                if(data.rows[0].senha===user.senha){

                    const token = jwt.sign({id:data.rows[0].id_, email: data.rows[0].email}, SECRET, {expiresIn: 3600})

                    console.log(token)
                    return res.status(200).json({message: "True", token});
                }
                else{
                    throw "Senha errada";
                }
            }
            else{
                throw "Usuario nao existe2";
            }

        }catch(erro){

            return res.status(400).send({ message: erro });
        }
       

    }

    async postcadastro(req, res) {

        const user = req.body

        try{
            
            const data = await database.query("Select * from users where email=$1;", [user.email]);

            if(data.rows.length==0){
    
                const data2 = await database.query("INSERT into users(email,nome,senha) values ($1, $2, $3);", [user.email,user.nome,user.senha]);
                const data3 = await database.query("Select * from users where email=$1;", [user.email]);


                const token = jwt.sign({id:data3.rows[0].id_, email: user.email}, SECRET, {expiresIn: 3600})

                console.log(token)

                return res.status(200).json({message: "True", token});

            }
            else{
                
                throw "Usuario existe";
            }

        }catch(erro){

            return res.status(400).send({ message: erro });
        }

    }

    async putusers(req, res) {

        const user = req.body
        const id = req.params


        try{
            
            const data = await database.query("Select * from users where id_=$1;", [id.id]);

            if(data.rows.length>0){
    
                const data2 = await database.query("UPDATE users SET email=$1, nome=$2, senha=$3 where id_=$4;", [user.email,user.nome,user.senha, id.id]);
                return res.status(200).send({ message: "Atualizado" });

            }
            else{
                
                throw "Usuario não existe3";
            }

        }catch(erro){

            return res.status(400).send({ message: erro });
        }

        

    }

    async deleteuserbyid(req, res) {

        const id = req.params

        try{
            
            const data = await database.query("Select * from users where id_=$1;", [id.id]);

            if(data.rows.length>0){
    
                const data2 = await database.query("DELETE from users where id_=$1;", [id.id]);
                return res.status(200).send({ message: "Deletado" });

            }
            else{
                
                throw "Usuario não existe4";
            }

        }catch(erro){

            return res.status(400).send({ message: erro });
        }

        

    }


    async getProfile(req, res) {

        const id = req.id

        try{
            const data = await database.query("Select id_,nome,email from users where id_=$1;", [id]);
            return res.json(data.rows).status(200)

        }catch(erro){ 

            return res.status(400).send({ message: erro.message });
            
        }
        

    }


    async getScript(req, res) {

        const link = req.body
        let response = ''
        let error =''

        const data = link.statusScanner;

        try{

            const command = spawn('python', ['scrapping.py',  data]);


            command.stdout.on('data', (saida) => {
                response += saida.toString();
            });

            command.stderr.on('data', (erro) => {
                error += erro.toString();
            });

            command.on('close', (status) => {

                if (status == 0) {

                    const var1 = response.trim()
                    const var2 = JSON.parse(var1)
                        
                    return res.status(200).json(var2);

                } else {
                    throw error
                }
            });


        }catch(erro){

            return res.status(500).send( {message: erro.message});

        }


      

        

    }


}

module.exports = new UserController();