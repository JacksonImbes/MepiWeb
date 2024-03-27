import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CadastroOper.css";

export default function CadastroOper() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senha2, setSenha2] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        setTimeout(function () {
            setMsg("");
        }, 1500);
    }, [msg])

    const handleInputChange = (e, type) => {
        switch (type) {
            case "nome":
                setError("");
                setNome(e.target.value);
                if (e.target.value === "") {
                    setError("Nome obrigatório!");
                }
                break;

            case "email":
                setError("");
                setEmail(e.target.value);
                if (e.target.value === "") {
                    setError("Email obrigatório!");
                }
                break;

            case "senha":
                setError("");
                setSenha(e.target.value);
                if (e.target.value === "") {
                    setError("Senha obrigatório!");
                }
                break;

            case "senha2":
                setError("");
                setSenha2(e.target.value);
                if (e.target.value === "") {
                    setError("Confirme sua senha!");
                }
                else if (e.target.value !== senha) {
                    setError("As senhas não conferem!")
                }
                break;
            default:
        }
    };

    function handleSubmit() {
        if (nome !== "" && email !== "" && senha !== "" && senha2 !== "") {
            const Data = {
                nome: nome,
                email: email,
                senha: senha2,
                userType: "oper"
            }

            axios.post("http://localhost/MepiWeb/src/Model/CadastroOper.php", Data)
                .then((response) => {
                    setMsg(response.data.result);
                    setError("");
                })
                .catch((error) => {
                    setMsg("");
                    setError("Ocorreu um erro ao cadastrar o operador.");
                    console.log(error);
                });

            setNome("");
            setEmail("");
            setSenha("");
            setSenha2("");
        }
        else {
            setError("É obrigatório responder todos os campos!");
        }
    }

    function CheckPassword() {
        if (senha.length < 8) {
            setError("A senha deve conter no mínimo 8 dígitos!")
        }
    }

    return (

        <div className="form">

            <h4> Cadastrar operador! </h4>
            <p>

                {
                    msg !== "" ?
                        <span className="success">{msg}</span> :
                        <span className="error">{error}</span>
                }
            </p>

            <label htmlFor="nome">Nome: </label>
            <input
                type="text"
                name="nome"
                value={nome}
                onChange={(e) => handleInputChange(e, "nome")}
            />

            <label htmlFor="email">Email: </label>
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => handleInputChange(e, "email")}
            />

            <label htmlFor="senha">Senha: </label>
            <input
                type="password"
                name="senha"
                value={senha}
                onChange={(e) => handleInputChange(e, "senha")}
            />

            <label htmlFor="senha2">Confirmar senha</label>
            <input
                type="password"
                name="senha2"
                value={senha2}
                onChange={(e) => handleInputChange(e, "senha2")}
                onBlur={CheckPassword}
            />

            <label></label>
            <input
                type="submit"
                defaultValue="cadastrar"
                className="button"
                onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            />

        </div>

    )

}
