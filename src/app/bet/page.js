"use client"; // isso indica que essa página deve ser renderizada no navegador do client
import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDispute, placeBet } from "@/services/Web3Services";
import Web3 from "web3";


export default function Bet() {

    const { push } = useRouter();

    const [message, setMessage] = useState();

    // dados da dispusta com valores padrão enquanto carrega os dados da blockchain
    const [dispute, setDispute] = useState({
        candidate1: 'Loading...',
        candidate2: 'Loading...',
        image1: 'https://i0.wp.com/www.tecstudio.com.br/wp-content/uploads/2020/06/WhatsApp-Image-2020-05-31-at-11.27.40-1.jpeg?fit=640%2C450&ssl=1',
        image2: 'https://i0.wp.com/www.tecstudio.com.br/wp-content/uploads/2020/06/WhatsApp-Image-2020-05-31-at-11.27.40-1.jpeg?fit=640%2C450&ssl=1',
        total1: 0,
        total2: 0,
        winner: 0,
    });

    //! se não tem no localStorage o endereço da carteira, então enviamos
    //! para a raiz do site
    useEffect(() => {
        if(!localStorage.getItem('wallet')){
            return push('/');
        }
        setMessage('Carregando dados da disputa...');
        getDispute().then(dispute => {
            setDispute(dispute);
            setMessage('');
        }).catch(error => {
            console.error(error);
            setMessage(error.message);
        });

    }, []); //! aqui colocamos um array vazio para indicar que queremos que dipare uma única vez quando a página for renderizada


    const proccessBet = async (candidate) => {
        setMessage('Conectando à metamask. Por favor aguarde...');
        const amount = prompt("Quantia em POL para apostar: ", "1");
        placeBet(candidate, amount).then(() => {
            alert('Aposta recebida com sucesso! Pode demorar até 1 minuto para aparecer no sistema');
            setMessage('');
        }).catch((error) => {
            console.error(error);
            setMessage(error.message);
        });
    }

    return (
        <>
            <Head>
                <title>BetCandidate | Bet</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container px-4 py-5">
                <div className="row align-items-center">
                    <div className="col-12">
                        <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">BetCandidate</h1>
                        <p className="lead">Apostas nas eleições americanas</p>
                        <p className="lead">Aposte em um dos candidatos até o dia da eleição</p>
                    </div>
                </div>

                <div className="row flex-lg-row-reverse align-items-center g-1 py-5">
                    <div className="col"></div>
                    <div className="col">
                        <h3 style={{ width: 250 }} className="my-2 d-block mx-auto">{dispute.candidate1}</h3>
                        <img width={250}
                            src={dispute.image1}
                            className="d-block mx-auto img-fluid rounded" />
                        <button type="button" className="btn btn-primary btn-lg p-3 my-2 d-block mx-auto" onClick={() => proccessBet(1)}>Aposto nesse candidato</button>
                        <span className="badge rounded-pill bg-secondary d-block mx-auto" style={{ width: 250 }}>{ Web3.utils.fromWei(dispute.total1, "ether")} POL apostados</span>
                    </div>
                    <div className="col">
                        <h3 style={{ width: 250 }} className="my-2 d-block mx-auto">{dispute.candidate2}</h3>
                        <img width={250}
                            src={dispute.image2}
                            className="d-block mx-auto img-fluid rounded" />
                        <button type="button" className="btn btn-primary btn-lg p-3 my-2 d-block mx-auto" onClick={() => proccessBet(2)}>Aposto nesse candidato</button>
                        <span className="badge rounded-pill bg-secondary d-block mx-auto" style={{ width: 250 }}>{ Web3.utils.fromWei(dispute.total2, "ether")} POL apostados</span>
                    </div>
                </div>

                <div className="row align-items-center">
                    <p className="message">{message}</p>
                </div>

                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <p className="col-4 mb-0 text-muted">© 2022 BetCandidate, Inc</p>
                    <ul className="nav col-4 justify-content-end">

                        <li className="nav-item"><a href="/" className="nav-link px-2 text-muted">Home</a></li>
                        <li className="nav-item"><a href="/about" className="nav-link px-2 text-muted">Sobre</a></li>

                    </ul>
                </footer>
            </div>
        </>
    );
}
