// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

struct Dispute {
    string candidate1;
    string candidate2;
    string image1;
    string image2;
    // total de apostas de cada candidato recebeu
    uint256 total1;
    uint256 total2;
    // identificador do candidato vencedor
    uint256 winner;
}

struct Bet {
    // quanto foi apostado
    uint256 amount;
    // candidat escolhido
    uint256 candidate;
    // quando foi realizada
    uint256 timestamp;
    // prêmio já requisitado, quando for o caso. Por padrão é inicializado com `0`,
    // o que indica que o prêmio ainda não foi reclamado (retirado)
    uint256 claimed;
}

contract BetCandidate {
    Dispute public dispute;

    // preciso de uma coleção para armazenar as apostas,
    // para isso teremos um dicionário que armazenará
    // o endereço da carteira => e a aposta.
    // preciso adicionar o modificador `public`
    // para saber `quem` votou em `quem`
    mapping(address => Bet) public allBets;

    // endereço da carteira do dono do contrato
    // a pessoa que fez o deploy do contrato
    address owner;

    // taxa de comissão da casa
    // aqui vamos trabalhar com uma escala de 4 zeros
    // ou seja: 
    // 10000 => 100%
    // 1000  => 10%
    uint256 fee = 10;

    // prêmio líquido a ser distribuído entre os 
    // apostadores que acertaram o candidato vencedor
    // `public` para todo poder ver
    uint public netPrize;

    // é executada uma única vez
    // quando o contrato em deployado
    constructor() {
        // armazenamos o enderedo da carteira
        owner = msg.sender;

        // inicializamos no construtor os dados da disputa
        dispute = Dispute({
            candidate1: "Donald Trump",
            candidate2: "Kamala Harris",
            // utilizar encurtador de url para economia na blockchain
            image1: "https://abrir.link/CoxUI",
            image2: "https://abrir.link/rPPvJ",
            // totais em ether ou a moeda da rede que cada candidato possui
            total1: 0,
            total2: 0,
            // `0` significa que é possível realizar apostas
            winner: 0
        });
    }

    // função que será chamada pelo frontend e que recebe um valor,
    // ou seja, essa função espera o pagamento de algo, nesse caso a aposta
    // por isso o `external` e o `payable`
    function bet(uint256 candidate) external payable {
        // precisamos validar a existência do candidato
        require(candidate == 1 || candidate == 2, "Invalid candidate");

        // o valor da aposta tem que ser maior que zero
        require(msg.value > 0, "Invalid bet");

        // preciso validar se as apostas ainda estão liberadas
        // avalidando se o dispute.winner é igual a `0`
        require(dispute.winner == 0, "Dispute is closed");

        // agora montamos os dados da aposta
        Bet memory newBet;
        newBet.amount = msg.value;
        newBet.candidate = candidate;

        // para obtermos o `timestamp`, utilizamos o objeto global `block`
        // que é o bloco atual que está sendo salvo na blockchain
        newBet.timestamp = block.timestamp;

        // agora precisamos salvar essa aposta
        //! Note que toda vez que um usuário realizar novamente uma aposta,
        //! essa linha `allBets[msg.sender] = newBet` irá sobrescrever a aposta anterior que ele
        //! possa ter realizado
        allBets[msg.sender] = newBet;

        // preciso incrementar os totais agora de acordo com o candidate
        if (candidate == 1) {
            dispute.total1 += msg.value;
        } else {
            dispute.total2 += msg.value;
        }
    }

    // função que define o vencedor da aposta, o que indica que 
    // as apostas estão encerradas.
    // ainda que seja `external`, apenas o `owner` do contrato
    // poderá chamar essa função
    function finish(uint winner) external  {
        // quem está chamando a função é `owner`?
        require(owner == msg.sender, "Invalid user");
        // o vencedor é um cadidato válido?
        require(winner == 1 || winner == 2, "Account is not owner");
        // já foi definido o `winner`?
        require(dispute.winner == 0, "Dispute is closed");

        // agora definimos quem venceu
        dispute.winner = winner;

        // precisamos descobrir o prêmio bruto
        uint grossPrize = dispute.total1 + dispute.total2;

        // precisamos determinar a comissão da casa
        // 1e4 = 1 * 10^4 (10 na quarta potência) = 10.000
        uint commision = (grossPrize * fee) / 1e4;

        // preciso calcular o prêmio líquido
        netPrize = grossPrize - commision;

        // agora transfiro a commissão para o dono da casa de apostas
        // ou seja, o `owner`.
        // quanto o prêmio dos apostadores, cada um sacará via metamask normalmente na plataforma.
        // fazemos isso para não ter que fazer um loop entre os apostadores e correr o
        // risco de alguma transferência falhar
        payable(owner).transfer(commision);
    }

    // função que permite ao apostador sacar o prêmio
    function claim() external  {
        // tentamos pegar a aposta do user que está executando esse método
        Bet memory userBet = allBets[msg.sender];

        // preciso validar se: 
        // 1º as apostas já estão encerradas,
        // 2º se o `winner` é o candidato que o user apostou
        // 3º se o user ainda não sacou seu prêmio
        require(dispute.winner > 0 && dispute.winner == userBet.candidate && userBet.claimed == 0, "Invalid claim");

        // agora precisamos descobrir a quantia apostada no candidato vencedor
        // para que possamos calcular o percentual desse user em cima do total
        // de apostas no candidato vencedor, ou seja, se o user apostou metade 
        // do total de apostas no candidato vencedor, esse user tem que ficar
        // com metade do total do prêmio das apostas
        uint winnerAmount = dispute.winner == 1 ? dispute.total1 : dispute.total2;

        // agora calculo a proporção que o user teve no total de apostas no candidato vencedor
        uint ratio = (userBet.amount * 1e4) / winnerAmount;
        uint individualPrize = netPrize * ratio / 1e4;

        // agora preciso definir que o user já sacou
        //! Atenção: Não posso usar o `userBet` pois ele é uma cópia memory
        allBets[msg.sender].claimed = individualPrize;

        // agora preciso tranferir o valor para o user
        payable(msg.sender).transfer(individualPrize);
    }
}