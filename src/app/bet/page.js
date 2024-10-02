import Head from "next/head";


export default function Home() {

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
                        <h3 style={{ width: 250 }} className="my-2 d-block mx-auto">Donald Trump</h3>
                        <img width={250}
                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Donald_Trump_official_portrait_%28cropped%29.jpg"
                            className="d-block mx-auto img-fluid rounded" />
                        <button type="button" className="btn btn-primary btn-lg p-3 my-2 d-block mx-auto">Aposto nesse candidato</button>
                        <span className="badge rounded-pill bg-secondary d-block mx-auto" style={{ width: 250 }}>0 POL apostados</span>
                    </div>
                    <div className="col">
                        <h3 style={{ width: 250 }} className="my-2 d-block mx-auto">Donald Trump</h3>
                        <img width={250}
                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Donald_Trump_official_portrait_%28cropped%29.jpg"
                            className="d-block mx-auto img-fluid rounded" />
                        <button type="button" className="btn btn-primary btn-lg p-3 my-2 d-block mx-auto">Aposto nesse candidato</button>
                        <span className="badge rounded-pill bg-secondary d-block mx-auto" style={{ width: 250 }}>0 POL apostados</span>
                    </div>
                </div>

                <div className="row align-items-center">
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
