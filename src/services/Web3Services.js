import Web3 from "web3";
import ABI from "./ABI.json";

// deployed com POL
const CONTRACT_ADDRESS = '0x6abf74FC1a38F6500e9601710D99F584A2f96Ac3';

export const doLogin = async () => {

    const provider = window.ethereum;

    // precisamos saber se o navegador do user possui a metamask instalada
    if (!provider) {
        throw new Error("Metamask não está instalada");
    }

    // instanciamos o web3
    const web3 = new Web3(provider);

    // requisitamos acesso à carteira. Essa linha faz
    // com que o pop-up da metamask apareça no navegador solicitando permissão
    const accounts = await web3.eth.requestAccounts();

    if (!accounts || accounts.length === 0) {
        throw new Error("Acesso à metamask não autorizado");
    }

    // posso armazenar a primeira conta do user agora
    // para sabermos se o usuário está autenticado para navegar entre as páginas
    const userAccount = accounts[0];
    localStorage.setItem('wallet', userAccount);

    // retorno a conta para uso se necessário
    return userAccount;
}

// função que possibilita a interação com o contrato
export const getContract = async () => {
    const provider = window.ethereum;
    if (!provider) {
        throw new Error("Metamask não está instalada");
    }

    const from = localStorage.getItem("wallet");
    const web3 = new Web3(provider);  // instanciar web3 corretamente aqui
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });

    // Retorne o contrato e a instância de web3
    return { contract, web3 };
}


// recupera os dados da dispouta
export const getDispute = async () => {
    const { contract } = await getContract();
    return contract.methods.dispute().call();
}

// realiza a aposta no candidato e envia uma quantia de moeda
export const placeBet = async (candidate, amountInETH) => {
    const { contract, web3 } = await getContract();  

    // Obter preço atual do gas
    const gasPrice = await web3.eth.getGasPrice();

    // Estimar o limite de gas
    const gasEstimate = await contract.methods.bet(candidate).estimateGas({
        value: web3.utils.toWei(amountInETH, "ether"),
    });

    return contract.methods.bet(candidate).send({
        value: web3.utils.toWei(amountInETH, "ether"),
        gas: gasEstimate,
        gasPrice: gasPrice
    });
};



