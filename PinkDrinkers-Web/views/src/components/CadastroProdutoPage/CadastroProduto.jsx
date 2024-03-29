import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import "./CadastroProdutoStyle.css";
import axios from "axios";
import ModalFormEstoque from "../FormEstoqueModal/ModalFormEstoque.jsx";
import CurrencyInput from "react-currency-input-field";

function CadastroProduto() {
  const [id_bebida, setIdBebida] = useState("");
  const [nome_bebida, setNomeBebida] = useState("");
  const [valor_bebida, setValorBebida] = useState("");
  const [imagem_bebida, setImagemBebida] = useState(null);
  const [tipo_bebida, setTipoBebida] = useState("");
  const [bebidasDisponiveis, setBebidasDisponiveis] = useState([]);
  const [nomeBebidasDisponiveis, setNomeBebidasDisponiveis] = useState([]);
  const [exibirModal, setExibirModal] = useState(false);
  const baseUrl = "http://localhost:3001";

  const opcoesCategoria = [
    { value: "Refrigerante", label: "Refrigerante" },
    { value: "Agua", label: "Água" },
    { value: "Suco", label: "Suco" },
    { value: "Energetico", label: "Bebida Energética" },
    { value: "Cha", label: "Chá" },
    { value: "Cafe", label: "Café" },
    { value: "Alcoolica", label: "Bebida Alcoólica" },
  ];

  useEffect(() => {
    const selectBebidasDisponiveis = async () => {
      try {
        const response = await axios.get(baseUrl + "/selectbebida");
        setBebidasDisponiveis(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    selectBebidasDisponiveis();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
  
    if (!nome_bebida) {
      alert("Por favor, preencha o campo Nome Produto!");
      return;
    }
  
    if (!tipo_bebida) {
      alert("Por favor, selecione uma opção de Categoria!");
      return;
    }
  
    if (!valor_bebida) {
      alert("Por favor, preencha o campo Valor!");
      return;
    }
  
    const formData = new FormData();
    formData.append("nome_bebida", nome_bebida);
    formData.append("tipo_bebida", tipo_bebida);
    formData.append("valor_bebida", valor_bebida);
    formData.append("imagem_bebida", imagem_bebida);
  
    try {
      const response = await axios.post(baseUrl + "/newbebida", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Resposta do endpoint:", response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("Erro ao enviar dados para o endpoint:", error.message);
      alert("Erro ao cadastrar produto!");
    }
  };
  

  const insertEstoque = async (e) => {
    e.preventDefault();
    const response = await axios.post(baseUrl + "/newestoque", {
      id_bebida: id_bebida,
    });

    console.log(response.data);
    setIdBebida("");
    setNomeBebidasDisponiveis("");
  };

  const selectBebida = (e) => {
    const selectedBebida = bebidasDisponiveis.find(
      (bebida) => bebida.nome_bebida === e.target.value
    );
    setIdBebida(selectedBebida.id_bebida);
    setNomeBebidasDisponiveis(e.target.value);
  };

  return (
    <div>
      <Header />
      <div className="cadastro-produto-wrap">
        <div className="title-cadastro-voltar" href="/home">
          <a href="/home" className="titulo">
            <span>&#10094; CADASTRAR PRODUTO</span>
          </a>
        </div>
        <form className="container-cadastro-produto">
          <div className="container-form">
            <div className="inputs-field-form">
              <div className="produto-field-form">
                <div className="label-produto">
                  <label htmlFor="produto">Nome Produto</label>
                </div>
                <div className="input-produto">
                  <input
                    type="text"
                    name="produto"
                    placeholder="Informe o Produto:"
                    required
                    onChange={(e) => setNomeBebida(e.target.value)}
                  />
                </div>
              </div>

              <div className="valor-field-form">
                <div className="label-valor">
                  <label htmlFor="valor-label">
                    <span>Valor</span>
                  </label>
                </div>

                <div className="input-valor">
                  <CurrencyInput
                    name="valor"
                    prefix="R$"
                    decimalSeparator=","
                    groupSeparator="."
                    decimalsLimit={2}
                    placeholder="Informe o Preço"
                    required
                    onValueChange={(value) => setValorBebida(value || "")}
                  />
                </div>
              </div>

              <div className="imagem-field-form">
                <div className="label-imagem">
                  <label htmlFor="imagem">Imagem</label>
                </div>
                <div className="input-imagem">
                  <label htmlFor="arquivo">Carregar</label>
                  <input
                    type="file"
                    name="arquivo"
                    id="arquivo"
                    required
                    onChange={(e) => setImagemBebida(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="tipo-bebida-field-form">
                <div className="label-tipoBebida">
                  <label htmlFor="tipo-bebida">Categoria</label>
                </div>
                <div className="input-bebida">
                  <select
                    value={tipo_bebida}
                    required
                    onChange={(e) => setTipoBebida(e.target.value)}
                  >
                    {opcoesCategoria.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="area-button-confirmar">
              <div className="area-btn-form">
                <button
                  type="submit"
                  className="confirmar-button"
                  onClick={(e) => createProduct(e)}
                >
                  CONFIRMAR
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="area-btn-acessar">
          <button
            onClick={() => setExibirModal(true)}
            className="acessar-estoque-button"
          >
            ACESSAR ESTOQUE
          </button>
          <ModalFormEstoque
            isOpen={exibirModal}
            onClose={() => setExibirModal(false)}
            bebidasDisponiveis={bebidasDisponiveis}
            nomeBebidasDisponiveis={nomeBebidasDisponiveis}
            selectBebida={selectBebida}
            insertEstoque={insertEstoque}
          />
        </div>
      </div>
    </div>
  );
}

export default CadastroProduto;
