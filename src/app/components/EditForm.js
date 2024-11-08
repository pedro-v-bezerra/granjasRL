'use client';
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GranjaContext } from "@/app/context/GranjaContext";

export default function EditForm() {
  const { validarDados, sortedGranjas, idSelectedGranja, updateGranja, setSelectedEdit, deleteGranja } = useContext(GranjaContext);

  const selectedGranja = sortedGranjas.find(granja => granja.id === idSelectedGranja);

  // Verifica se a granja foi selecionada
  if (!selectedGranja) {
    return <div>Carregando...</div>; // ou algum outro indicador de carregamento
  }

  // Inicializa os estados com os valores atuais da granja selecionada
  const [nome, setNome] = useState(selectedGranja.nome || "");
  const [distancia, setDistancia] = useState(selectedGranja.distancia || "");
  const [tempo, setTempo] = useState(selectedGranja.tempo || "");
  const [abertura, setAbertura] = useState(selectedGranja.abertura || "");
  const [fechamento, setFechamento] = useState(selectedGranja.fechamento || "");
  const [telefone, setTelefone] = useState(selectedGranja.telefone || "");
  const [localizacao, setLocalizacao] = useState(selectedGranja.localizacao || "");
  const [error, setError] = useState(""); // Estado para mensagens de erro

  useEffect(() => {
    if (selectedGranja) {
      setNome(selectedGranja.nome);
      setDistancia(selectedGranja.distancia);
      setTempo(selectedGranja.tempo);
      setAbertura(selectedGranja.abertura);
      setFechamento(selectedGranja.fechamento);
      setTelefone(selectedGranja.telefone);
      setLocalizacao(selectedGranja.localizacao);
    }
  }, [selectedGranja]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validarDados(nome, distancia, tempo, abertura, fechamento, telefone, localizacao);

    if (validation !== true) {
      setError(validation);
      return;
    }

    const distanciaTratada = (distancia) => {
      if (distancia && !distancia.includes("km")) {
        return `${distancia} km`;
      }
      return distancia;
    }


    try {
      // Passa o ID da granja e os dados atualizados
      await updateGranja(selectedGranja.id, {
        nome,
        distancia: distanciaTratada(distancia),
        tempo,
        abertura,
        fechamento,
        telefone,
        localizacao,
      });

      setError(""); // Limpa o erro após a submissão
      window.location.href = "/"; // Redireciona após a atualização
    } catch (error) {
      console.error("Erro ao atualizar granja:", error);
    }
  };


  const handleDelete = async () => {
    const confirmDelete = window.confirm("Tem certeza de que deseja deletar esta granja?");

    if (confirmDelete) {
      try {
        // Chama a função deleteGranja passando o id da granja
        await deleteGranja(selectedGranja.id);

        // Redireciona após a exclusão
        window.location.href = "/";
      } catch (error) {
        console.error("Erro ao deletar granja:", error);
      }
    }
  };


  const formatTime = (time) => {
    // Remove caracteres não numéricos
    time = time.replace(/\D/g, "");

    // Garante que a entrada tenha pelo menos 4 dígitos
    if (time.length >= 4) {
      let hours = time.substring(0, 2);
      let minutes = time.substring(2, 4);
      return `${hours}:${minutes}`;
    } else if (time.length >= 2) {
      let hours = time.substring(0, 2);
      return `${hours}:`;
    }
    return time;
  };

  const formatAverageTime = (time) => {
    // Verifica se o tempo já está no formato "Xh e Xmin"
    if (/^\d+h e \d{1,2}min$/.test(time)) {
      return time;
    }

    // Remove caracteres não numéricos
    time = time.replace(/\D/g, "");

    // Se a entrada tiver apenas 1 dígito, assume que são horas e os minutos serão 00
    if (time.length === 1) {
      return `${time}h e 00min`;
    }

    // Garante que a entrada tenha pelo menos 2 dígitos
    if (time.length >= 2) {
      // Divide os minutos e as horas
      let hours = parseInt(time.substring(0, time.length - 2)); // Captura as horas
      let minutes = parseInt(time.substring(time.length - 2)); // Captura os minutos

      // Se a entrada tiver 4 ou mais dígitos, considera horas e minutos
      if (hours > 0) {
        return `${hours}h e ${minutes}min`;
      } else {
        // Caso não tenha horas, retorna apenas os minutos
        return `${minutes}min`;
      }
    }

    // Se não houver tempo suficiente para formatar, retorna a entrada original
    return time;
  };

  const formatPhoneNumber = (phone) => {
    // Remove qualquer caractere não numérico
    phone = phone.replace(/\D/g, "");

    // Aplica a formatação para o padrão (XX) 9 XXXX-XXXX
    if (phone.length <= 2) {
      return `(${phone}`;
    } else if (phone.length <= 3) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2)}`;
    } else if (phone.length <= 7) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 3)} ${phone.substring(3)}`;
    } else if (phone.length <= 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 3)} ${phone.substring(3, 7)}-${phone.substring(7)}`;
    }
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 3)} ${phone.substring(3, 7)}-${phone.substring(7, 11)}`;
  };

  return (
    <div className="px-6 py-8 lg:px-40">
      <div>
        <div className="flex items-center">
          <div onClick={() => setSelectedEdit(false)}>
            <Image src="/back.svg" width={30} height={30} alt="Voltar" className="cursor-pointer mb-2 md:w-12 md:h-12" />
          </div>
        </div>
        <h1 className="font-bold text-[#753233] text-3xl md:text-3xl">Editar Granja</h1>
        <div className="flex gap-x-2 items-center">
          <p className="text-base md:text-2xl">by</p>
          <svg width="110" height="20" viewBox="0 0 55 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.3566 6.62273H18.2349L18.3518 6.06591H21.2706L21.1536 6.62273H20.0318L19.362 9.77273H18.6868L19.3566 6.62273ZM21.6952 6.06591H23.2476C23.5949 6.06591 23.8607 6.13835 24.045 6.28334C24.2293 6.42832 24.3215 6.64044 24.3215 6.9197C24.3215 7.02576 24.3091 7.13362 24.2843 7.24318C24.224 7.51544 24.1053 7.74878 23.9281 7.94318C23.7544 8.13409 23.5347 8.26847 23.2688 8.34621L23.7261 9.77273H23.0349L22.6043 8.41515H21.8706L21.5835 9.77273H20.9083L21.6952 6.06591ZM22.7425 7.85834C22.9906 7.85834 23.1855 7.80881 23.3273 7.70985C23.4691 7.6109 23.563 7.4553 23.6091 7.24318C23.6268 7.16184 23.6357 7.0947 23.6357 7.04167C23.6357 6.88968 23.5861 6.78182 23.4868 6.71818C23.3876 6.65455 23.2387 6.62273 23.0402 6.62273H22.2534L21.9876 7.85834H22.7425ZM26.2082 6.06591H26.8621L27.5585 9.77273H26.894L26.7345 8.91894H25.1608L24.6451 9.77273H23.9327L26.2082 6.06591ZM26.6654 8.36212L26.3996 6.78712L25.4638 8.36212H26.6654ZM28.8755 6.06591H29.5135L30.7044 8.64849L31.252 6.06591H31.9272L31.1403 9.77273H30.5024L29.3115 7.18485L28.7639 9.77273H28.0887L28.8755 6.06591ZM32.8327 9.85228C32.613 9.85228 32.4003 9.83106 32.1947 9.78864C31.9892 9.74971 31.8244 9.69668 31.7003 9.62955L31.8226 9.05152C32.1415 9.22121 32.5014 9.30606 32.9018 9.30606C33.1464 9.30606 33.3377 9.26184 33.476 9.17349C33.6178 9.08514 33.7046 8.96317 33.7365 8.80758C33.7471 8.76515 33.7524 8.72453 33.7524 8.68561C33.7524 8.56894 33.7011 8.47529 33.5983 8.40455C33.499 8.33031 33.313 8.23305 33.04 8.11288C32.792 8.00332 32.6006 7.87605 32.4658 7.73106C32.3347 7.58258 32.2691 7.40938 32.2691 7.21137C32.2691 7.13712 32.2763 7.06999 32.2904 7.00985C32.3329 6.80834 32.4251 6.62984 32.5669 6.47424C32.7122 6.31865 32.893 6.19849 33.1091 6.11364C33.3254 6.02879 33.5628 5.98637 33.8215 5.98637C34.0342 5.98637 34.2203 6.00408 34.3798 6.0394C34.5393 6.07121 34.6899 6.12244 34.8317 6.19318L34.7094 6.75531C34.4329 6.60682 34.137 6.53258 33.8215 6.53258C33.5947 6.53258 33.4105 6.575 33.2686 6.65985C33.1304 6.7412 33.0436 6.85787 33.0081 7.00985C32.9975 7.05227 32.9922 7.0929 32.9922 7.13182C32.9922 7.21317 33.0152 7.28211 33.0613 7.33864C33.1109 7.39517 33.1783 7.4482 33.2633 7.49773C33.352 7.54365 33.4919 7.60909 33.6833 7.69394C33.9563 7.81771 34.1583 7.94668 34.2894 8.08106C34.4241 8.21544 34.4914 8.38334 34.4914 8.58485C34.4914 8.64138 34.4826 8.71743 34.4648 8.81288C34.394 9.14517 34.2239 9.40152 33.9545 9.58182C33.6851 9.76212 33.3112 9.85228 32.8327 9.85228ZM35.5834 6.06591H37.072C37.4087 6.06591 37.6798 6.15256 37.8854 6.32576C38.091 6.49896 38.1938 6.72879 38.1938 7.01515C38.1938 7.11411 38.1849 7.20076 38.1672 7.275C38.0822 7.66743 37.8996 7.9644 37.6196 8.16591C37.3432 8.36743 36.9887 8.46818 36.5563 8.46818H35.7482L35.4718 9.77273H34.7966L35.5834 6.06591ZM36.5935 7.91137C37.1003 7.91137 37.3998 7.69924 37.492 7.275C37.5097 7.18665 37.5186 7.11411 37.5186 7.05758C37.5186 6.89849 37.4654 6.78712 37.3591 6.72349C37.2528 6.65635 37.0897 6.62273 36.87 6.62273H36.1416L35.8652 7.91137H36.5935ZM39.8291 9.85228C39.5102 9.85228 39.2284 9.79214 38.9838 9.67197C38.7428 9.55181 38.555 9.38031 38.4203 9.15758C38.2856 8.93485 38.2183 8.675 38.2183 8.37803C38.2183 8.25076 38.236 8.09878 38.2714 7.92197C38.353 7.54015 38.5071 7.20256 38.7339 6.90909C38.9607 6.61562 39.2408 6.3894 39.5739 6.23031C39.9071 6.06772 40.2669 5.98637 40.6532 5.98637C40.9651 5.98637 41.2415 6.0482 41.4826 6.17197C41.7271 6.29214 41.9167 6.46544 42.0514 6.69167C42.1896 6.9179 42.2588 7.18135 42.2588 7.48182C42.2588 7.6197 42.2428 7.76638 42.2109 7.92197C42.1294 8.30379 41.9752 8.64138 41.7484 8.93485C41.5251 9.22472 41.2486 9.45105 40.919 9.61364C40.5894 9.77273 40.2261 9.85228 39.8291 9.85228ZM39.962 9.24243C40.1995 9.24243 40.4264 9.1894 40.6426 9.08334C40.8623 8.97378 41.0501 8.81999 41.2061 8.62197C41.3656 8.42046 41.4737 8.18712 41.5304 7.92197C41.5623 7.77349 41.5783 7.63741 41.5783 7.51364C41.5783 7.22017 41.4914 6.99575 41.3177 6.84015C41.1441 6.68106 40.88 6.60152 40.5256 6.60152C40.2845 6.60152 40.0542 6.65635 39.8345 6.76591C39.6147 6.87547 39.4269 7.03106 39.2709 7.23258C39.1149 7.43059 39.0086 7.66032 38.9519 7.92197C38.92 8.07396 38.9041 8.21544 38.9041 8.34621C38.9041 8.94365 39.2568 9.24243 39.962 9.24243ZM43.1376 6.06591H44.69C45.0372 6.06591 45.3031 6.13835 45.4874 6.28334C45.6717 6.42832 45.7639 6.64044 45.7639 6.9197C45.7639 7.02576 45.7515 7.13362 45.7267 7.24318C45.6664 7.51544 45.5476 7.74878 45.3705 7.94318C45.1967 8.13409 44.9771 8.26847 44.7112 8.34621L45.1685 9.77273H44.4773L44.0467 8.41515H43.313L43.0259 9.77273H42.3507L43.1376 6.06591ZM44.1849 7.85834C44.433 7.85834 44.6279 7.80881 44.7697 7.70985C44.9115 7.6109 45.0053 7.4553 45.0515 7.24318C45.0691 7.16184 45.0781 7.0947 45.0781 7.04167C45.0781 6.88968 45.0284 6.78182 44.9292 6.71818C44.8299 6.65455 44.681 6.62273 44.4826 6.62273H43.6958L43.43 7.85834H44.1849ZM47.1123 6.62273H45.9905L46.1074 6.06591H49.0262L48.9092 6.62273H47.7874L47.1176 9.77273H46.4424L47.1123 6.62273ZM49.4509 6.06591H51.9655L51.8486 6.62273H50.0091L49.7911 7.64091H51.1574L51.0405 8.19773H49.6742L49.4562 9.21591H51.2957L51.1787 9.77273H48.664L49.4509 6.06591ZM52.7123 9.85228C52.4926 9.85228 52.28 9.83106 52.0743 9.78864C51.8688 9.74971 51.704 9.69668 51.5799 9.62955L51.7022 9.05152C52.0212 9.22121 52.381 9.30606 52.7814 9.30606C53.026 9.30606 53.2174 9.26184 53.3556 9.17349C53.4974 9.08514 53.5842 8.96317 53.6161 8.80758C53.6267 8.76515 53.632 8.72453 53.632 8.68561C53.632 8.56894 53.5807 8.47529 53.4779 8.40455C53.3787 8.33031 53.1926 8.23305 52.9196 8.11288C52.6716 8.00332 52.4802 7.87605 52.3455 7.73106C52.2144 7.58258 52.1488 7.40938 52.1488 7.21137C52.1488 7.13712 52.1559 7.06999 52.17 7.00985C52.2125 6.80834 52.3047 6.62984 52.4465 6.47424C52.5918 6.31865 52.7726 6.19849 52.9888 6.11364C53.205 6.02879 53.4425 5.98637 53.7012 5.98637C53.9138 5.98637 54.0999 6.00408 54.2594 6.0394C54.4189 6.07121 54.5695 6.12244 54.7113 6.19318L54.589 6.75531C54.3125 6.60682 54.0166 6.53258 53.7012 6.53258C53.4744 6.53258 53.2901 6.575 53.1482 6.65985C53.01 6.7412 52.9233 6.85787 52.8877 7.00985C52.8771 7.05227 52.8718 7.0929 52.8718 7.13182C52.8718 7.21317 52.8949 7.28211 52.9409 7.33864C52.9906 7.39517 53.0579 7.4482 53.1429 7.49773C53.2316 7.54365 53.3715 7.60909 53.5629 7.69394C53.8359 7.81771 54.0379 7.94668 54.169 8.08106C54.3037 8.21544 54.371 8.38334 54.371 8.58485C54.371 8.64138 54.3622 8.71743 54.3444 8.81288C54.2736 9.14517 54.1035 9.40152 53.8341 9.58182C53.5647 9.76212 53.1908 9.85228 52.7123 9.85228Z" fill="#753233" />
            <path d="M0 9.925L0.0637973 9.59091C0.648607 9.59091 0.999494 9.48485 1.11646 9.27273L2.4562 1.27046C2.3924 1.05834 2.07342 0.952278 1.49924 0.952278L1.56304 0.618187H5.16759C6.39038 0.618187 7.29949 0.825005 7.89494 1.23864C8.50101 1.65228 8.80405 2.14546 8.80405 2.71819C8.80405 3.36516 8.57544 3.93258 8.11823 4.42046C7.66101 4.90834 7.04962 5.25834 6.28405 5.47046L7.76734 9.25682C7.84177 9.47955 8.17671 9.59091 8.77215 9.59091L8.70835 9.925H8.02253C7.27823 9.925 6.79975 9.88258 6.58709 9.79773C6.38506 9.71288 6.2043 9.47955 6.04481 9.09773L4.68911 5.69319H3.18987L2.5838 9.27273C2.6476 9.48485 2.96658 9.59091 3.54076 9.59091L3.47696 9.925H0ZM3.93949 1.1591L3.26962 5.15228H4.59342C5.49721 5.15228 6.16177 4.94546 6.58709 4.53182C7.0124 4.10758 7.22506 3.4447 7.22506 2.54319C7.22506 2.09773 7.06025 1.75834 6.73063 1.52501C6.41165 1.28107 5.85873 1.1591 5.0719 1.1591H3.93949ZM9.29859 9.925L9.36238 9.59091C9.94719 9.59091 10.2981 9.48485 10.415 9.27273L11.7548 1.27046C11.691 1.05834 11.372 0.952278 10.7978 0.952278L10.8616 0.618187H14.3386L14.2748 0.952278C13.69 0.952278 13.3391 1.05834 13.2221 1.27046L11.8664 9.38409H15.5029C15.7793 9.27803 16.0718 8.94394 16.3801 8.38182H16.6991L16.0611 9.925H9.29859Z" fill="#393738" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-x-4 gap-y-6 mt-12 md:mt-16">
        {error && <div className="text-red-600">{error}</div>}

        <div>
          <label className="text-base md:text-xl">Nome</label>
          <input
            value={nome}
            required={true}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da granja"
            className="bg-[#FAFAFA] w-full py-3 md:py-5 text-base md:text-xl rounded-full px-4"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-x-8 gap-y-6">
          <div className="w-full">
            <label className="text-base md:text-xl">Distância (km)</label>
            <input
              mask="999 km"
              value={distancia}
              onChange={(e) => setDistancia(e.target.value)}
              onBlur={() => {
                if (distancia && !distancia.endsWith(" km")) {
                  setDistancia(distancia + " km");
                }
              }}
              placeholder="Ex: 45 km"
              className="bg-[#FAFAFA] w-full py-3 md:py-5 text-base md:text-xl rounded-full px-4"
            />
          </div>
          <div className="w-full">
            <label className="text-base md:text-xl">Tempo médio de chegada</label>
            <input
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
              onBlur={() => setTempo(formatAverageTime(tempo))}
              placeholder="Ex: 1:45"
              className="bg-[#FAFAFA] w-full py-3 md:py-5 text-base md:text-xl rounded-full px-4"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-x-8 gap-y-6">
          <div className="flex flex-col md:flex-row items-end gap-x-2 gap-y-3 w-full">
            <div className="w-full">
              <label className="text-base md:text-xl">Funcionamento</label>
              <input
                mask="99:99"
                value={abertura}
                onChange={(e) => setAbertura(e.target.value)}
                onBlur={() => setAbertura(formatTime(abertura))}
                placeholder="Horário de abertura"
                className="bg-[#FAFAFA] w-full py-3 md:py-5 text-base md:text-xl rounded-full px-4"
              />
            </div>
            <div className="w-full">
              <input
                mask="99:99"
                value={fechamento}
                onChange={(e) => setFechamento(e.target.value)}
                onBlur={() => setFechamento(formatTime(fechamento))}
                placeholder="Horário de fechamento"
                className="bg-[#FAFAFA] w-full py-3 md:py-5 text-base md:text-xl rounded-full px-4"
              />
            </div>
          </div>
          <div>
            <label className="text-base md:text-xl">Telefone do Granjeiro</label>
            <input
              mask="(99) 9 9999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              onBlur={() => setTelefone(formatPhoneNumber(telefone))}
              placeholder="Ex: (61) 9 9876-5432"
              className="bg-[#FAFAFA] w-full py-3 md:py-5 text-base md:text-xl rounded-full px-4"
            />
          </div>
        </div>
        <div>
          <label className="text-base md:text-xl">Link da Localização</label>
          <input
            value={localizacao}
            required={true}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Cole seu link aqui"
            className="bg-[#FAFAFA] w-full py-3 md:py-5 text-base md:text-xl rounded-full px-4"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-x-20">
          <button
            type="button" // Alterei para "button" para evitar a submissão do form
            onClick={handleDelete}
            className="text-white text-base md:text-xl font-bold flex justify-center gap-x-4 items-center bg-red-500 px-20 md:px-28 py-2 md:py-4 rounded-xl mt-10"
          >
            <p>Deletar Granja</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="md:w-6 md:h-6 bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
            </svg>
          </button>

          <button
            type="submit"
            className="text-white text-base md:text-xl font-bold flex justify-center bg-[#753233] px-20 md:px-28 py-2 md:py-4 rounded-xl mt-10"
          >
            Atualizar
          </button>
        </div>
      </form>
    </div>
  );
}