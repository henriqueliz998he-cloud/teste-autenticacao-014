const PRIMEIRA_SENHA =
    "1234";


const PALAVRA_CHAVE =
    "henrique";


const etapa1 =
    document.getElementById(
        "etapa1"
    );


const etapa2 =
    document.getElementById(
        "etapa2"
    );


const etapa3 =
    document.getElementById(
        "etapa3"
    );


const areaLiberada =
    document.getElementById(
        "areaLiberada"
    );


const formPrimeiraSenha =
    document.getElementById(
        "formPrimeiraSenha"
    );


const primeiraSenha =
    document.getElementById(
        "primeiraSenha"
    );


const erroPrimeiraSenha =
    document.getElementById(
        "erroPrimeiraSenha"
    );


const botaoBiometria =
    document.getElementById(
        "botaoBiometria"
    );


const statusBiometria =
    document.getElementById(
        "statusBiometria"
    );


const mensagemBiometria =
    document.getElementById(
        "mensagemBiometria"
    );


const iconeBiometria =
    document.getElementById(
        "iconeBiometria"
    );


const botaoMicrofone =
    document.getElementById(
        "botaoMicrofone"
    );


const statusVoz =
    document.getElementById(
        "statusVoz"
    );


const palavraDetectada =
    document.getElementById(
        "palavraDetectada"
    );


const erroMicrofone =
    document.getElementById(
        "erroMicrofone"
    );


let reconhecimento =
    null;


let ouvindo =
    false;


const CHAVE_CREDENCIAL =
    "teste014_credencial_biometrica";


function mostrarApenas(
    tela
) {

    etapa1.classList.add(
        "escondido"
    );

    etapa2.classList.add(
        "escondido"
    );

    etapa3.classList.add(
        "escondido"
    );

    areaLiberada.classList.add(
        "escondido"
    );


    tela.classList.remove(
        "escondido"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function normalizarTexto(
    texto
) {

    return texto
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


function converterBase64ParaBytes(
    texto
) {

    const binario =
        atob(texto);


    const bytes =
        new Uint8Array(
            binario.length
        );


    for (
        let i = 0;
        i < binario.length;
        i++
    ) {

        bytes[i] =
            binario.charCodeAt(i);

    }


    return bytes;

}


function converterBytesParaBase64(
    bytes
) {

    let binario =
        "";


    for (
        let i = 0;
        i < bytes.length;
        i++
    ) {

        binario +=
            String.fromCharCode(
                bytes[i]
            );

    }


    return btoa(
        binario
    );

}


function criarDesafio(
    tamanho = 32
) {

    const bytes =
        new Uint8Array(
            tamanho
        );


    crypto.getRandomValues(
        bytes
    );


    return bytes;

}


function criarIdUsuario() {

    const bytes =
        criarDesafio(
            16
        );


    return bytes;

}


function verificarSuporteBiometria() {

    if (
        !window.PublicKeyCredential
    ) {

        return false;

    }


    if (
        !navigator.credentials
    ) {

        return false;

    }


    if (
        typeof navigator.credentials.create !==
        "function"
    ) {

        return false;

    }


    if (
        typeof navigator.credentials.get !==
        "function"
    ) {

        return false;

    }


    return true;

}


async function verificarAutenticador() {

    if (
        !window.PublicKeyCredential
    ) {

        return false;

    }


    if (
        typeof PublicKeyCredential
            .isUserVerifyingPlatformAuthenticatorAvailable ===
        "function"
    ) {

        try {

            return await
                PublicKeyCredential
                    .isUserVerifyingPlatformAuthenticatorAvailable();

        } catch (
            erro
        ) {

            return false;

        }

    }


    return true;

}


function obterCredencialSalva() {

    try {

        const dados =
            localStorage.getItem(
                CHAVE_CREDENCIAL
            );


        if (
            !dados
        ) {

            return null;

        }


        return JSON.parse(
            dados
        );

    } catch (
        erro
    ) {

        return null;

    }

}


function salvarCredencial(
    credencial
) {

    try {

        localStorage.setItem(
            CHAVE_CREDENCIAL,
            JSON.stringify(
                credencial
            )
        );


        return true;

    } catch (
        erro
    ) {

        return false;

    }

}


function prepararEtapaBiometria() {

    statusBiometria.textContent =
        "Verificação biométrica pronta.";


    statusBiometria.className =
        "status";


    mensagemBiometria.classList.add(
        "escondido"
    );


    botaoBiometria.disabled =
        false;


    botaoBiometria.textContent =
        "📱 USAR BIOMETRIA";

}


async function cadastrarBiometria() {

    statusBiometria.textContent =
        "Preparando cadastro da biometria...";


    statusBiometria.className =
        "status ativo";


    mensagemBiometria.classList.add(
        "escondido"
    );


    botaoBiometria.disabled =
        true;


    botaoBiometria.textContent =
        "📱 CADASTRANDO...";


    const suporte =
        verificarSuporteBiometria();


    if (
        !suporte
    ) {

        throw new Error(
            "WebAuthn não está disponível neste navegador."
        );

    }


    const autenticadorDisponivel =
        await verificarAutenticador();


    if (
        !autenticadorDisponivel
    ) {

        throw new Error(
            "Nenhum autenticador biométrico de plataforma foi disponibilizado pelo aparelho."
        );

    }


    const desafio =
        criarDesafio(
            32
        );


    const idUsuario =
        criarIdUsuario();


    const opcoes = {

        publicKey: {

            challenge:
                desafio,

            rp: {

                name:
                    "Teste #014 — Laboratório"

            },

            user: {

                id:
                    idUsuario,

                name:
                    "usuario@teste014.local",

                displayName:
                    "Usuário do Teste #014"

            },

            pubKeyCredParams: [

                {
                    type:
                        "public-key",

                    alg:
                        -7
                },

                {
                    type:
                        "public-key",

                    alg:
                        -257
                }

            ],

            authenticatorSelection: {

                authenticatorAttachment:
                    "platform",

                userVerification:
                    "required",

                residentKey:
                    "preferred"

            },

            timeout:
                60000,

            attestation:
                "none"

        }

    };


    const credencial =
        await navigator.credentials.create(
            opcoes
        );


    if (
        !credencial
    ) {

        throw new Error(
            "O aparelho não retornou uma credencial."
        );

    }


    const idBase64 =
        converterBytesParaBase64(
            new Uint8Array(
                credencial.rawId
            )
        );


    const salvo =
        salvarCredencial({

            id:
                idBase64,

            criadoEm:
                new Date().toISOString()

        });


    if (
        !salvo
    ) {

        throw new Error(
            "Não foi possível guardar a identificação local da credencial."
        );

    }


    return credencial;

}


async function autenticarComBiometria() {

    statusBiometria.textContent =
        "Solicitando sua biometria...";


    statusBiometria.className =
        "status ativo";


    mensagemBiometria.classList.add(
        "escondido"
    );


    botaoBiometria.disabled =
        true;


    botaoBiometria.classList.add(
        "verificando"
    );


    botaoBiometria.textContent =
        "📱 VERIFICANDO...";


    const suporte =
        verificarSuporteBiometria();


    if (
        !suporte
    ) {

        throw new Error(
            "WebAuthn não está disponível neste navegador."
        );

    }


    const autenticadorDisponivel =
        await verificarAutenticador();


    if (
        !autenticadorDisponivel
    ) {

        throw new Error(
            "O aparelho não disponibilizou um autenticador biométrico de plataforma."
        );

    }


    let credencialSalva =
        obterCredencialSalva();


    if (
        !credencialSalva
    ) {

        statusBiometria.textContent =
            "Primeira utilização: cadastrando a biometria...";


        await cadastrarBiometria();


        credencialSalva =
            obterCredencialSalva();

    }


    if (
        !credencialSalva
    ) {

        throw new Error(
            "A credencial biométrica não foi encontrada."
        );

    }


    const desafio =
        criarDesafio(
            32
        );


    const id =
        converterBase64ParaBytes(
            credencialSalva.id
        );


    const opcoes = {

        publicKey: {

            challenge:
                desafio,

            allowCredentials: [

                {

                    type:
                        "public-key",

                    id:
                        id

                }

            ],

            userVerification:
                "required",

            timeout:
                60000

        }

    };


    const resultado =
        await navigator.credentials.get(
            opcoes
        );


    if (
        !resultado
    ) {

        throw new Error(
            "O aparelho não retornou a autenticação."
        );

    }


    return resultado;

}


function mostrarErroBiometria(
    mensagem
) {

    statusBiometria.textContent =
        "Aguardando nova tentativa.";


    statusBiometria.className =
        "status erro";


    mensagemBiometria.textContent =
        "❌ " +
        mensagem;


    mensagemBiometria.className =
        "mensagem erro";


    botaoBiometria.disabled =
        false;


    botaoBiometria.classList.remove(
        "verificando"
    );


    botaoBiometria.textContent =
        "📱 TENTAR NOVAMENTE";

}


async function executarBiometria() {

    try {

        const resultado =
            await autenticarComBiometria();


        if (
            !resultado
        ) {

            throw new Error(
                "A autenticação não foi concluída."
            );

        }


        statusBiometria.textContent =
            "✅ Biometria confirmada!";


        statusBiometria.className =
            "status sucesso";


        iconeBiometria.textContent =
            "✅";


        mensagemBiometria.textContent =
            "Biometria reconhecida pelo dispositivo.";


        mensagemBiometria.className =
            "mensagem";


        mensagemBiometria.style.color =
            "#43e06b";


        botaoBiometria.textContent =
            "✅ BIOMETRIA CONFIRMADA";


        botaoBiometria.classList.remove(
            "verificando"
        );


        setTimeout(
            function () {

                mostrarEtapa3();

            },
            700
        );


    } catch (
        erro
    ) {

        console.error(
            erro
        );


        let mensagem =
            "Não foi possível concluir a autenticação biométrica.";


        if (
            erro &&
            erro.name ===
            "NotAllowedError"
        ) {

            mensagem =
                "A biometria foi cancelada, recusada ou expirou.";

        }


        if (
            erro &&
            erro.name ===
            "InvalidStateError"
        ) {

            mensagem =
                "A credencial biométrica já está registrada ou o estado do autenticador não permite esta operação.";

        }


        if (
            erro &&
            erro.name ===
            "NotSupportedError"
        ) {

            mensagem =
                "O aparelho ou navegador não oferece o recurso biométrico necessário.";

        }


        if (
            erro &&
            erro.name ===
            "SecurityError"
        ) {

            mensagem =
                "O navegador bloqueou o uso do WebAuthn neste contexto.";

        }


        mostrarErroBiometria(
            mensagem
        );

    }

}


function mostrarEtapa2() {

    mostrarApenas(
        etapa2
    );


    iconeBiometria.textContent =
        "🔐";


    prepararEtapaBiometria();

}


function mostrarEtapa3() {

    mostrarApenas(
        etapa3
    );


    prepararReconhecimento();

}


function liberarAcesso() {

    mostrarApenas(
        areaLiberada
    );

}


formPrimeiraSenha.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const valor =
            primeiraSenha.value;


        if (
            valor ===
            PRIMEIRA_SENHA
        ) {

            erroPrimeiraSenha.classList.add(
                "escondido"
            );


            primeiraSenha.value =
                "";


            mostrarEtapa2();

        } else {

            erroPrimeiraSenha.classList.remove(
                "escondido"
            );


            primeiraSenha.value =
                "";


            primeiraSenha.focus();

        }

    }
);


botaoBiometria.addEventListener(
    "click",
    function () {

        executarBiometria();

    }
);


function criarReconhecimento() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (
        !SpeechRecognition
    ) {

        return null;

    }


    const instancia =
        new SpeechRecognition();


    instancia.lang =
        "pt-BR";


    instancia.continuous =
        false;


    instancia.interimResults =
        false;


    instancia.maxAlternatives =
        5;


    return instancia;

}


function prepararReconhecimento() {

    statusVoz.textContent =
        "Aguardando...";


    statusVoz.className =
        "status";


    palavraDetectada.textContent =
        "—";


    erroMicrofone.classList.add(
        "escondido"
    );


    botaoMicrofone.disabled =
        false;


    botaoMicrofone.classList.remove(
        "ouvindo"
    );


    botaoMicrofone.textContent =
        "🎤 FALAR PALAVRA-CHAVE";

}


function iniciarReconhecimento() {

    if (
        ouvindo
    ) {

        return;

    }


    erroMicrofone.classList.add(
        "escondido"
    );


    palavraDetectada.textContent =
        "—";


    reconhecimento =
        criarReconhecimento();


    if (
        !reconhecimento
    ) {

        erroMicrofone.textContent =
            "❌ Este navegador não disponibiliza reconhecimento de voz.";


        erroMicrofone.classList.remove(
            "escondido"
        );


        return;

    }


    ouvindo =
        true;


    botaoMicrofone.disabled =
        true;


    botaoMicrofone.classList.add(
        "ouvindo"
    );


    botaoMicrofone.textContent =
        "🎤 OUVINDO...";


    statusVoz.textContent =
        "Fale agora a palavra-chave.";


    statusVoz.className =
        "status ativo";


    reconhecimento.onstart =
        function () {

            statusVoz.textContent =
                "🎤 Microfone ativo. Fale agora.";

        };


    reconhecimento.onresult =
        function (evento) {

            let melhorResultado =
                "";


            if (
                evento.results
            ) {

                for (
                    let i = 0;
                    i < evento.results.length;
                    i++
                ) {

                    if (
                        evento.results[i] &&
                        evento.results[i][0]
                    ) {

                        melhorResultado =
                            evento.results[i][0].transcript;

                        break;

                    }

                }

            }


            const textoOriginal =
                melhorResultado.trim();


            const textoNormalizado =
                normalizarTexto(
                    textoOriginal
                );


            palavraDetectada.textContent =
                '"' +
                textoOriginal +
                '"';


            if (
                textoNormalizado ===
                PALAVRA_CHAVE
            ) {

                statusVoz.textContent =
                    "✅ Palavra-chave correta!";


                statusVoz.className =
                    "status sucesso";


                setTimeout(
                    function () {

                        liberarAcesso();

                    },
                    500
                );

            } else {

                statusVoz.textContent =
                    "❌ Palavra-chave incorreta.";


                statusVoz.className =
                    "status erro";


                erroMicrofone.textContent =
                    "❌ A palavra reconhecida não corresponde à palavra-chave.";


                erroMicrofone.classList.remove(
                    "escondido"
                );

            }

        };


    reconhecimento.onerror =
        function (evento) {

            let mensagem =
                "Não foi possível reconhecer a fala.";


            if (
                evento.error ===
                "not-allowed"
            ) {

                mensagem =
                    "A permissão do microfone foi recusada.";

            }


            if (
                evento.error ===
                "no-speech"
            ) {

                mensagem =
                    "Nenhuma fala foi detectada.";

            }


            if (
                evento.error ===
                "audio-capture"
            ) {

                mensagem =
                    "O microfone não está disponível.";

            }


            erroMicrofone.textContent =
                "❌ " +
                mensagem;


            erroMicrofone.classList.remove(
                "escondido"
            );


            statusVoz.textContent =
                "Aguardando nova tentativa.";


            statusVoz.className =
                "status erro";

        };


    reconhecimento.onend =
        function () {

            ouvindo =
                false;


            botaoMicrofone.disabled =
                false;


            botaoMicrofone.classList.remove(
                "ouvindo"
            );


            botaoMicrofone.textContent =
                "🎤 FALAR PALAVRA-CHAVE";


            if (
                statusVoz.textContent ===
                "🎤 Microfone ativo. Fale agora."
            ) {

                statusVoz.textContent =
                    "Aguardando...";

            }

        };


    try {

        reconhecimento.start();

    } catch (
        erro
    ) {

        ouvindo =
            false;


        botaoMicrofone.disabled =
            false;


        botaoMicrofone.classList.remove(
            "ouvindo"
        );


        botaoMicrofone.textContent =
            "🎤 FALAR PALAVRA-CHAVE";


        erroMicrofone.textContent =
            "❌ Não foi possível iniciar o reconhecimento de voz.";


        erroMicrofone.classList.remove(
            "escondido"
        );

    }

}


botaoMicrofone.addEventListener(
    "click",
    function () {

        iniciarReconhecimento();

    }
);


primeiraSenha.focus();
