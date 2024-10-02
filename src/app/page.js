"use client"; // isso indica que essa página deve ser renderizada no navegador do client

import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {

  const {push} = useRouter();

  const handleLogin = () => {
    push("/bet");
  }

  return (
    <>
      <Head>
        <title>BetCandidate | Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <div className="container px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-lg-5 py-5">
            <div className="col-6">
              <img src="https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/3486/live/b0f4f550-7021-11ef-b282-4535eb84fe4b.jpg.webp" width={700} height={500} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes"/>
            </div>
            <div className="col-6">
                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">BetCandidate</h1>
                <p className="lead">Apostas nas eleições americanas</p>
                <p className="lead">Entre com sua carteira e deixe a sua aposta</p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                    <button onClick={handleLogin} type="button" className="btn btn-primary btn-lg px-4 me-md-2">
                        <img src="/metamask.svg" width={64} className="me-3" alt="Bootstrap Themes"/>
                        Conectar com Metamask
                    </button>
                </div>
            </div>
            <p className="message"></p>
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
