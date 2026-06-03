const btnAdicionar = document.getElementById('btn-adicionar');
const modalGasto = document.getElementById('modal-gasto');
const modalTitulo = document.getElementById('modal-titulo');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnSalvarGasto = document.getElementById('btn-salvar-gasto');
const btnExcluirGasto = document.getElementById('btn-excluir-gasto');

const inputNome = document.getElementById('transacao-nome');
const inputValor = document.getElementById('transacao-valor');
const inputBanco = document.getElementById('transacao-banco');
const inputCategoria = document.getElementById('transacao-categoria');
const wrapperCategoria = document.getElementById('wrapper-categoria');
const btnTipoDespesa = document.getElementById('tipo-despesa');
const btnTipoReceita = document.getElementById('tipo-receita');

const listaTransacoes = document.getElementById('lista-transacoes');
const listaHistoricoCompleto = document.getElementById('lista-historico-completo');
const corpoTabelaCategorias = document.getElementById('corpo-tabela-categorias');
const listaBancos = document.getElementById('lista-bancos');
const canvasGrafico = document.getElementById('graficoCategorias');
const filtroMesCategoria = document.getElementById('filtro-mes-categoria');

// Elementos da Aba de Cartão de Crédito
const navCartao = document.getElementById('nav-cartao');
const viewCard = document.getElementById('app-card-view');
const filtroMesCartao = document.getElementById('filtro-mes-cartao');
const btnNovoCartao = document.getElementById('btn-novo-cartao');
const modalCartao = document.getElementById('modal-cartao');

// BOTÕES DO MODAL CARTÃO
const btnCancelarCartaoOriginal = document.getElementById('btn-fechar-modal-cartao'); 
const btnSalvarCartaoPrincipal = document.getElementById('btn-salvar-cartao'); 
const btnExcluirCartao = document.getElementById('btn-excluir-cartao'); 

const totalFaturaMesEl = document.getElementById('total-fatura-mes');
const listaComprasCartao = document.getElementById('lista-compras-cartao');
let idEdicaoCartaoAtual = null; 

const inputCartaoNome = document.getElementById('cartao-nome');
const inputCartaoValorTotal = document.getElementById('cartao-valor-total');
const inputCartaoParcelas = document.getElementById('cartao-parcelas');
const inputCartaoCategoria = document.getElementById('cartao-categoria');
const inputCartaoProximoMes = document.getElementById('cartao-proximo-mes');

const listaDetalhadaGastos = document.getElementById('lista-detalhada-gastos');
const listaDetalhadaReceitas = document.getElementById('lista-detalhada-receitas');

const saldoTotalEl = document.getElementById('saldo-total');
const totalEntradaEl = document.getElementById('total-entrada');
const totalSaidaEl = document.getElementById('total-saida');

const navHome = document.getElementById('nav-home');
const navCategorias = document.getElementById('nav-categorias'); 
const navHistorico = document.getElementById('nav-historico');
const btnVerTodas = document.getElementById('btn-ver-todas');

const viewMain = document.getElementById('app-main-view');
const viewCategories = document.getElementById('app-categories-view');
const viewHistory = document.getElementById('app-history-view');

// --- CONTROLE DE ESTADO ---
let transacoes = JSON.parse(localStorage.getItem('financas_neo_noir')) || [];
let dadosCartao = JSON.parse(localStorage.getItem('cartao_neo_noir')) || []; 

function salvarDados() {
    localStorage.setItem('financas_neo_noir', JSON.stringify(transacoes));
    localStorage.setItem('cartao_neo_noir', JSON.stringify(dadosCartao));
}

let idEdicaoAtual = null; 
let tipoSelecionado = 'despesa';

const coresCategorias = {
    "Fatura": "#FF3333",
    "Roupas": "#E50914",
    "Beleza": "#B3070F",
    "Alimentação": "#80050B",
    "Assinaturas": "#4D0306",
    "Lazer": "#81122a",
    "Outros": "#260103"
};

const listaMesesSequencia = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"];

// --- MUDANÇA DE TELAS ---
function trocarTela(telaAtiva, botaoAtivo) {
    if(viewMain) viewMain.style.display = 'none';
    if(viewCategories) viewCategories.style.display = 'none';
    if(viewHistory) viewHistory.style.display = 'none';
    if(viewCard) viewCard.style.display = 'none';
    
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('ativo'));

    if(telaAtiva) telaAtiva.style.display = 'block';
    if(botaoAtivo) botaoAtivo.classList.add('ativo');

    atualizarInterface();
}

if(navHome) navHome.addEventListener('click', () => trocarTela(viewMain, navHome));
if(navCategorias) navCategorias.addEventListener('click', () => trocarTela(viewCategories, navCategorias));
if(navHistorico) navHistorico.addEventListener('click', () => trocarTela(viewHistory, navHistorico));
if(navCartao) navCartao.addEventListener('click', () => trocarTela(viewCard, navCartao));
if(btnVerTodas) btnVerTodas.addEventListener('click', (e) => { e.preventDefault(); trocarTela(viewHistory, navHistorico); });

if(filtroMesCategoria) filtroMesCategoria.addEventListener('change', () => {
    if(filtroMesCartao) filtroMesCartao.value = filtroMesCategoria.value;
    atualizarInterface();
});

if(filtroMesCartao) filtroMesCartao.addEventListener('change', () => {
    if(filtroMesCategoria) filtroMesCategoria.value = filtroMesCartao.value;
    atualizarInterface();
});

// --- MODAIS ---
if(btnAdicionar) btnAdicionar.addEventListener('click', () => {
    idEdicaoAtual = null;
    modalTitulo.textContent = "Nova Movimentação";
    if(btnExcluirGasto) btnExcluirGasto.style.display = "none";
    if(btnSalvarGasto) btnSalvarGasto.textContent = "Salvar";
    wrapperCategoria.style.display = "flex"; 
    
    tipoSelecionado = 'despesa';
    if(btnTipoDespesa) btnTipoDespesa.classList.add('ativo');
    if(btnTipoReceita) btnTipoReceita.classList.remove('ativo');
    
    modalGasto.classList.add('visivel');
});
if(btnFecharModal) btnFecharModal.addEventListener('click', fecharEResetarModal);

if(btnNovoCartao) btnNovoCartao.addEventListener('click', () => {
    idEdicaoCartaoAtual = null; 
    if(btnExcluirCartao) btnExcluirCartao.style.display = "none"; 
    if(btnSalvarCartaoPrincipal) btnSalvarCartaoPrincipal.textContent = "Adicionar à fatura"; 
    modalCartao.classList.add('visivel');
});

function fecharEResetarModalCartao() {
    modalCartao.classList.remove('visivel');
    inputCartaoNome.value = ''; 
    inputCartaoValorTotal.value = '';
    inputCartaoParcelas.value = '1';
    inputCartaoProximoMes.checked = false;
    idEdicaoCartaoAtual = null; 
    if(btnExcluirCartao) btnExcluirCartao.style.display = "none"; 
}

if(btnCancelarCartaoOriginal) btnCancelarCartaoOriginal.addEventListener('click', fecharEResetarModalCartao);

if(btnTipoDespesa) btnTipoDespesa.addEventListener('click', () => {
    tipoSelecionado = 'despesa';
    btnTipoDespesa.classList.add('ativo');
    btnTipoReceita.classList.remove('ativo');
    wrapperCategoria.style.display = 'flex'; 
});
if(btnTipoReceita) btnTipoReceita.addEventListener('click', () => {
    tipoSelecionado = 'receita';
    btnTipoReceita.classList.add('ativo');
    btnTipoDespesa.classList.remove('ativo');
    wrapperCategoria.style.display = 'none'; 
});

// FUNÇÃO PARA AUXILIAR A ABERTURA DA EDIÇÃO
function abrirEdicaoTransacao(t) {
    idEdicaoAtual = t.id;
    modalTitulo.textContent = "Editar Movimentação";
    
    inputNome.value = t.nome;
    inputValor.value = t.valor;
    inputBanco.value = t.banco || "Banco do Brasil";
    tipoSelecionado = t.tipo;

    if (t.tipo === 'despesa') {
        if(btnTipoDespesa) btnTipoDespesa.classList.add('ativo');
        if(btnTipoReceita) btnTipoReceita.classList.remove('ativo');
        wrapperCategoria.style.display = 'flex';
        inputCategoria.value = t.categoria;
    } else {
        if(btnTipoReceita) btnTipoReceita.classList.add('ativo');
        if(btnTipoDespesa) btnTipoDespesa.classList.remove('ativo');
        wrapperCategoria.style.display = 'none';
    }

    if(btnSalvarGasto) btnSalvarGasto.textContent = "Alterar";
    if(btnExcluirGasto) btnExcluirGasto.style.display = "block"; 

    modalGasto.classList.add('visivel');
}

// --- SALVAR PROCESSOS ---
if(btnSalvarGasto) btnSalvarGasto.addEventListener('click', () => {
    const nome = inputNome.value.trim();
    const valor = parseFloat(inputValor.value);
    const banco = inputBanco.value;
    const categoria = tipoSelecionado === 'receita' ? '' : inputCategoria.value;

    if (nome === '' || isNaN(valor) || valor <= 0) {
        alert('Por favor, preencha a descrição e o valor!');
        return;
    }

    const mesFiltro = filtroMesCategoria.value;

    if (idEdicaoAtual !== null) {
        const transacao = transacoes.find(t => t.id === idEdicaoAtual);
        if (transacao) {
            transacao.nome = nome; transacao.valor = valor;
            transacao.tipo = tipoSelecionado; transacao.banco = banco; transacao.categoria = categoria;
        }
    } else {
        transacoes.unshift({
            id: Date.now(), nome: nome, valor: valor, tipo: tipoSelecionado,
            banco: banco, categoria: categoria, mesAno: mesFiltro, data: "Hoje"
        });
    }
    
    salvarDados();
    atualizarInterface();
    fecharEResetarModal();
});

if(btnSalvarCartaoPrincipal) btnSalvarCartaoPrincipal.addEventListener('click', () => {
    const nome = inputCartaoNome.value.trim();
    const valorTotal = parseFloat(inputCartaoValorTotal.value);
    const numParcelas = parseInt(inputCartaoParcelas.value);
    const categoria = inputCartaoCategoria.value;
    const mesCompra = filtroMesCartao.value;
    const lancarNoProximo = inputCartaoProximoMes.checked === true; 

    if (nome === '' || isNaN(valorTotal) || valorTotal <= 0) {
        alert('Preencha os dados da compra corretamente!');
        return;
    }

    const valorDaParcela = valorTotal / numParcelas;
    const originIndex = listaMesesSequencia.indexOf(mesCompra);

    if (idEdicaoCartaoAtual !== null) {
        const compra = dadosCartao.find(c => c.id === idEdicaoCartaoAtual);
        if (compra) {
            compra.nome = nome;
            compra.valorTotal = valorTotal;
            compra.numParcelas = numParcelas;
            compra.valorParcela = valorDaParcela;
            compra.categoria = categoria;
            compra.mesOrigem = mesCompra;
            compra.indexInicial = originIndex;
            compra.lancarNoProximo = lancarNoProximo;
        }
    } else {
        dadosCartao.push({
            id: Date.now(), nome: nome, valorTotal: valorTotal, numParcelas: numParcelas,
            valorParcela: valorDaParcela, category: categoria, mesOrigem: mesCompra,
            indexInicial: originIndex, lancarNoProximo: lancarNoProximo
        });
    }

    salvarDados();
    fecharEResetarModalCartao();
    atualizarInterface();
});

if(btnExcluirGasto) btnExcluirGasto.addEventListener('click', () => {
    if (idEdicaoAtual !== null) {
        transacoes = transacoes.filter(t => t.id !== idEdicaoAtual);
        salvarDados();
        atualizarInterface();
        fecharEResetarModal();
    }
});

if(btnExcluirCartao) btnExcluirCartao.addEventListener('click', () => {
    if (idEdicaoCartaoAtual !== null) {
        dadosCartao = dadosCartao.filter(c => c.id !== idEdicaoCartaoAtual);
        salvarDados();
        fecharEResetarModalCartao();
        atualizarInterface();
    }
});

function fecharEResetarModal() {
    modalGasto.classList.remove('visivel');
    inputNome.value = ''; inputValor.value = '';
    idEdicaoAtual = null;
}

// --- DESENHAR GRÁFICO REDONDO ---
function desenharGrafico(dadosSoma, totalGasto) {
    if (!canvasGrafico) return;
    const ctx = canvasGrafico.getContext('2d');
    ctx.clearRect(0, 0, canvasGrafico.width, canvasGrafico.height);
    const centroX = canvasGrafico.width / 2; const centroY = canvasGrafico.height / 2;
    const raio = Math.min(centroX, centroY) - 5;

    if (totalGasto === 0) {
        ctx.beginPath(); ctx.arc(centroX, centroY, raio, 0, 2 * Math.PI);
        ctx.fillStyle = '#222222'; ctx.fill();
        ctx.beginPath(); ctx.arc(centroX, centroY, raio * 0.55, 0, 2 * Math.PI);
        ctx.fillStyle = '#161616'; ctx.fill();
        return;
    }
    let anguloInicial = -Math.PI / 2;
    for (let cat in dadosSoma) {
        const valor = dadosSoma[cat]; if (valor === 0) continue;
        const proporcao = valor / totalGasto; const anguloArco = proporcao * 2 * Math.PI;
        ctx.beginPath(); ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, raio, anguloInicial, anguloInicial + anguloArco);
        ctx.fillStyle = coresCategorias[cat] || "#FFF"; ctx.fill();
        anguloInicial += anguloArco;
    }
    ctx.beginPath(); ctx.arc(centroX, centroY, raio * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = '#161616'; ctx.fill();
}

// --- ATUALIZAR INTERFACE COMPLETA ---
function atualizarInterface() {
    let saldoGeral = 0; let totalEntradas = 0; let totalSaidas = 0;
    let saldosBancos = { "Banco do Brasil": 0, "Caixa Tem": 0, "Nubank": 0, "Inter": 0, "Mercado Pago": 0 };
    let somaCategorias = { "Fatura": 0, "Roupas": 0, "Beleza": 0, "Alimentação": 0, "Assinaturas": 0, "Lazer": 0, "Outros": 0 };

    const mesSelecionado = filtroMesCategoria.value;
    let totalSaidasMesSelecionado = 0;

    if(listaTransacoes) listaTransacoes.innerHTML = '';
    if(listaDetalhadaGastos) listaDetalhadaGastos.innerHTML = '';
    if(listaDetalhadaReceitas) listaDetalhadaReceitas.innerHTML = '';
    if(listaComprasCartao) listaComprasCartao.innerHTML = '';

    // 1. PROCESSAR TRANSAÇÕES TRADICIONAIS
    transacoes.forEach((t, index) => {
        const bancoDoItem = t.banco || "Banco do Brasil";

        if (t.tipo === 'despesa') {
            saldoGeral -= t.valor; totalSaidas += t.valor;
            if (saldosBancos[bancoDoItem] !== undefined) saldosBancos[bancoDoItem] -= t.valor;
            
            if (t.mesAno === mesSelecionado) {
                if (somaCategorias[t.categoria] !== undefined) {
                    somaCategorias[t.categoria] += t.valor;
                    totalSaidasMesSelecionado += t.valor;
                }
                const linhaGasto = document.createElement('tr');
                linhaGasto.innerHTML = `
                    <td style="color: var(--vermelho-vibrante); font-weight: 500;">${t.nome}</td>
                    <td style="color: var(--texto-cinza); font-size: 12px;">${t.categoria} • ${bancoDoItem}</td>
                    <td style="text-align: right; color: var(--vermelho-vibrante); font-weight: 600;">- R$ ${t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style="text-align: right; width: 30px; padding-left: 10px;">
                        <button class="btn-editar-transacao" style="background: none; border: none; color: var(--texto-cinza); cursor: pointer;">
                            <span class="material-icons-round" style="font-size: 16px;">edit</span>
                        </button>
                    </td>
                `;

                linhaGasto.querySelector('.btn-editar-transacao').addEventListener('click', () => abrirEdicaoTransacao(t));
                if(listaDetalhadaGastos) listaDetalhadaGastos.appendChild(linhaGasto);
            }
        } else {
            saldoGeral += t.valor; totalEntradas += t.valor;
            if (saldosBancos[bancoDoItem] !== undefined) saldosBancos[bancoDoItem] += t.valor;

            if (t.mesAno === mesSelecionado) {
                const inlineReceita = document.createElement('tr');
                inlineReceita.innerHTML = `
                    <td style="color: var(--verde-lucro); font-weight: 500;">${t.nome}</td>
                    <td style="color: var(--texto-cinza); font-size: 12px;">${bancoDoItem}</td>
                    <td style="text-align: right; color: var(--verde-lucro); font-weight: 600;">+ R$ ${t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style="text-align: right; width: 30px; padding-left: 10px;">
                        <button class="btn-editar-transacao" style="background: none; border: none; color: var(--texto-cinza); cursor: pointer;">
                            <span class="material-icons-round" style="font-size: 16px;">edit</span>
                        </button>
                    </td>
                `;

                inlineReceita.querySelector('.btn-editar-transacao').addEventListener('click', () => abrirEdicaoTransacao(t));
                if(listaDetalhadaReceitas) listaDetalhadaReceitas.appendChild(inlineReceita);
            }
        }

        // --- ATUALIZADO: ITENS RECENTES DA HOME COM O BOTÃO DE LÁPIS INDEPENDENTE ---
        if (index < 3 && listaTransacoes) {
            const itemHtml = document.createElement('div');
            itemHtml.className = 'transacao-item';
            
            const sinal = t.tipo === 'despesa' ? '-' : '+';
            const classeValor = t.tipo === 'despesa' ? '' : 'receita';
            const icone = t.tipo === 'despesa' ? 'arrow_downward' : 'arrow_upward';
            const textoSub = t.tipo === 'despesa' ? `${t.categoria} • ${bancoDoItem}` : bancoDoItem;

            itemHtml.innerHTML = `
                <div class="transacao-info">
                    <div class="transacao-icon ${t.tipo === 'despesa' ? 'despespa' : 'receita'}">
                        <span class="material-icons-round">${icone}</span>
                    </div>
                    <div class="transacao-detalhes"><h4>${t.nome}</h4><p>${textoSub}</p></div>
                </div>
                <div class="transacao-valores-acoes" style="display: flex; align-items: center; gap: 15px;">
                    <div class="transacao-valor ${classeValor}">${sinal} R$ ${t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <button class="btn-editar-recente" style="background: none; border: none; color: var(--texto-cinza); cursor: pointer; padding: 4px; display: flex; align-items: center;">
                        <span class="material-icons-round" style="font-size: 18px;">edit</span>
                    </button>
                </div>
            `;
            
            // O clique agora acontece apenas no botão do lápis da home
            itemHtml.querySelector('.btn-editar-recente').addEventListener('click', (e) => {
                e.stopPropagation(); // Evita qualquer outro comportamento na linha
                abrirEdicaoTransacao(t);
            });
            listaTransacoes.appendChild(itemHtml);
        }
    });

    // 2. PROCESSAR ENGINE DE CARTÃO DE CRÉDITO
    let totalFaturaDesteMes = 0;
    const indexMesAtualSistema = listaMesesSequencia.indexOf(mesSelecionado);

    dadosCartao.forEach(compra => {
        const mesInicioCobranca = compra.indexInicial + (compra.lancarNoProximo ? 1 : 0);
        const mesFimCobranca = mesInicioCobranca + compra.numParcelas - 1;

        if (indexMesAtualSistema >= mesInicioCobranca && indexMesAtualSistema <= mesFimCobranca) {
            const numeroParcelaAtual = (indexMesAtualSistema - mesInicioCobranca) + 1;
            const parcelasRestantes = compra.numParcelas - numeroParcelaAtual;

            totalFaturaDesteMes += compra.valorParcela;

            if (somaCategorias[compra.categoria] !== undefined) {
                somaCategorias[compra.categoria] += compra.valorParcela;
                totalSaidasMesSelecionado += compra.valorParcela;
            }

            const legendaParcela = compra.numParcelas > 1 ? ` (${numeroParcelaAtual}ª de ${compra.numParcelas})` : '';

            const linhaGastoCartao = document.createElement('tr');
            linhaGastoCartao.innerHTML = `
                <td style="color: var(--vermelho-vibrante); font-weight: 500;">${compra.nome}${legendaParcela}</td>
                <td style="color: var(--texto-cinza); font-size: 12px;">${compra.categoria} • Cartão</td>
                <td style="text-align: right; color: var(--vermelho-vibrante); font-weight: 600;">- R$ ${compra.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td></td>
            `;
            if(listaDetalhadaGastos) listaDetalhadaGastos.appendChild(linhaGastoCartao);

            const linhaCartaoDetalhe = document.createElement('tr');
            linhaCartaoDetalhe.innerHTML = `
                <td style="padding: 14px 0; vertical-align: middle;">
                    <div style="display: flex; align-items: baseline; gap: 12px;">
                        <span style="color: var(--vermelho-vibrante); font-size: 18px; font-weight: 700;">
                            R$ ${compra.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span style="color: white; font-weight: 500; font-size: 14px;">
                            ${compra.nome}
                        </span>
                    </div>
                </td>
                <td style="color: var(--texto-cinza); font-size: 12px; text-align: center; vertical-align: middle;">
                    <div>${compra.numParcelas > 1 ? `${numeroParcelaAtual}ª de ${compra.numParcelas}` : 'À vista'}</div>
                    <div style="font-size: 11px; color: #ff4d5a; margin-top: 1px;">
                        ${parcelasRestantes === 0 ? 'Última' : parcelasRestantes === 1 ? 'falta 1 mês' : `faltam ${parcelasRestantes} meses`}
                    </div>
                </td>
                <td style="text-align: right; color: var(--texto-cinza); font-size: 13px; font-weight: 500; vertical-align: middle;">
                    <div style="font-size: 11px; color: rgba(255,255,255,0.3); margin-bottom: 2px;">Total Compra</div>
                    R$ ${compra.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style="text-align: right; vertical-align: middle; padding-left: 10px;">
                    <button class="btn-editar-cartao" data-id="${compra.id}" style="background: none; border: none; color: var(--texto-cinza); cursor: pointer;">
                        <span class="material-icons-round" style="font-size: 18px;">edit</span>
                    </button>
                </td>
            `;

            const btnEditar = linhaCartaoDetalhe.querySelector('.btn-editar-cartao');
            btnEditar.addEventListener('click', () => {
                idEdicaoCartaoAtual = compra.id;
                inputCartaoNome.value = compra.nome;
                inputCartaoValorTotal.value = compra.valorTotal;
                inputCartaoParcelas.value = compra.numParcelas;
                inputCartaoCategoria.value = compra.categoria;
                filtroMesCartao.value = compra.mesOrigem;
                inputCartaoProximoMes.checked = compra.lancarNoProximo;

                if(btnSalvarCartaoPrincipal) btnSalvarCartaoPrincipal.textContent = "Salvar";
                if(btnExcluirCartao) btnExcluirCartao.style.display = "block"; 
                
                modalCartao.classList.add('visivel');
            });

            if(listaComprasCartao) listaComprasCartao.appendChild(linhaCartaoDetalhe);
        }
    });

    // === ATUALIZADO: HISTÓRICO DE TRANSAÇÕES COM COLUNA EXCLUSIVA PARA O LÁPIS ===
    if (listaHistoricoCompleto) {
        listaHistoricoCompleto.innerHTML = '';

        const tituloPrincipal = document.createElement('h2');
        tituloPrincipal.innerText = 'Transações';
        tituloPrincipal.style.color = 'var(--texto-branco)';
        tituloPrincipal.style.marginBottom = '25px';
        tituloPrincipal.style.fontSize = '28px'; 
        tituloPrincipal.style.fontWeight = '600';
        tituloPrincipal.style.textAlign = 'center'; 
        listaHistoricoCompleto.appendChild(tituloPrincipal);

        if (transacoes.length === 0) {
            const semDados = document.createElement('p');
            semDados.innerText = 'Nenhuma transação encontrada.';
            semDados.style.color = 'var(--texto-cinza)';
            semDados.style.textAlign = 'center';
            semDados.style.marginTop = '20px';
            listaHistoricoCompleto.appendChild(semDados);
        } else {
            const transacoesAgrupadas = {};
            const nomesMeses = {
                '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
                '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
                '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
            };

            transacoes.forEach(transacao => {
                const mesChave = transacao.mesAno; 
                if(mesChave && mesChave.includes('-')) {
                    const partes = mesChave.split('-');
                    const nomeMesExtenso = nomesMeses[partes[1]] || 'Outros';
                    const ano = partes[0];
                    const tituloMes = `${nomeMesExtenso} de ${ano}`;

                    if (!transacoesAgrupadas[tituloMes]) {
                        transacoesAgrupadas[tituloMes] = [];
                    }
                    transacoesAgrupadas[tituloMes].push(transacao);
                }
            });

            const mesesOrdenados = Object.keys(transacoesAgrupadas).sort((a, b) => {
                const indexA = listaMesesSequencia.findIndex(m => {
                    const p = m.split('-');
                    return `${nomesMeses[p[1]]} de ${p[0]}` === a;
                });
                const indexB = listaMesesSequencia.findIndex(m => {
                    const p = m.split('-');
                    return `${nomesMeses[p[1]]} de ${p[0]}` === b;
                });
                return indexB - indexA; 
            });

            mesesOrdenados.forEach(mesTitulo => {
                const divMesSecao = document.createElement('div');
                divMesSecao.style.marginTop = '25px';
                divMesSecao.style.marginBottom = '12px';
                
                const tituloMesEl = document.createElement('h3');
                tituloMesEl.innerText = mesTitulo;
                tituloMesEl.style.color = 'var(--texto-cinza)';
                tituloMesEl.style.fontSize = '13px';
                tituloMesEl.style.textTransform = 'uppercase';
                tituloMesEl.style.letterSpacing = '1px';
                tituloMesEl.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                tituloMesEl.style.paddingBottom = '6px';
                
                divMesSecao.appendChild(tituloMesEl);
                listaHistoricoCompleto.appendChild(divMesSecao);

                const tabelaMes = document.createElement('table');
                tabelaMes.style.width = '100%';
                tabelaMes.style.borderCollapse = 'collapse';
                tabelaMes.style.marginBottom = '20px';

                transacoesAgrupadas[mesTitulo].forEach(transacao => {
                    const inline = document.createElement('tr');
                    inline.style.borderBottom = '1px solid rgba(255, 255, 255, 0.02)';

                    const ehReceita = transacao.tipo === 'receita';
                    const corValor = ehReceita ? 'var(--verde-lucro)' : 'var(--vermelho-vibrante)';
                    const sinal = ehReceita ? '+ ' : '- ';
                    const detalheSub = ehReceita ? transacao.banco : `${transacao.categoria} • ${transacao.banco}`;

                    inline.innerHTML = `
                        <td style="padding: 12px 0; color: var(--texto-branco); font-weight: 500; font-size: 14px;">
                            ${transacao.nome}
                            <div style="font-size: 11px; color: var(--texto-cinza); margin-top: 2px;">${detalheSub}</div>
                        </td>
                        <td style="text-align: right; color: ${corValor}; font-weight: 600; font-size: 14px;">
                            ${sinal}R$ ${transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td style="text-align: right; width: 30px; padding-left: 15px;">
                            <button class="btn-editar-historico" style="background: none; border: none; color: var(--texto-cinza); cursor: pointer; display: flex; align-items: center; padding: 4px;">
                                <span class="material-icons-round" style="font-size: 16px;">edit</span>
                            </button>
                        </td>
                    `;
                    
                    // O clique passa a ser unicamente no botão de lápis da tabela do histórico
                    inline.querySelector('.btn-editar-historico').addEventListener('click', () => abrirEdicaoTransacao(transacao));
                    tabelaMes.appendChild(inline);
                });

                listaHistoricoCompleto.appendChild(tabelaMes);
            });
        }
    }

    if (listaDetalhadaGastos && listaDetalhadaGastos.children.length === 0) {
        listaDetalhadaGastos.innerHTML = `<tr><td colspan="4" style="color: var(--texto-cinza); text-align: center; font-size: 13px; padding: 16px 0;">Nenhum gasto neste mês.</td></tr>`;
    }
    if (listaDetalhadaReceitas && listaDetalhadaReceitas.children.length === 0) {
        listaDetalhadaReceitas.innerHTML = `<tr><td colspan="4" style="color: var(--texto-cinza); text-align: center; font-size: 13px; padding: 16px 0;">Nenhuma receita neste mês.</td></tr>`;
    }
    if (listaComprasCartao && listaComprasCartao.children.length === 0) {
        listaComprasCartao.innerHTML = `<tr><td colspan="4" style="color: var(--texto-cinza); text-align: center; font-size: 13px; padding: 16px 0;">Nenhuma compra parcelada nesta fatura.</td></tr>`;
    }

    if(totalFaturaMesEl) {
        totalFaturaMesEl.textContent = `R$ ${totalFaturaDesteMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    // 3. REPOVOAR OS BANCOS
    if (listaBancos) {
        listaBancos.innerHTML = '';
        for (let banco in saldosBancos) {
            const saldoBco = saldosBancos[banco];
            const itemBcoHtml = document.createElement('div');
            itemBcoHtml.className = 'banco-item';
            const corSaldo = saldoBco <= 0 ? 'var(--vermelho-vibrante)' : 'var(--verde-lucro)';
            itemBcoHtml.innerHTML = `
                <span class="banco-nome">${banco}</span>
                <span class="banco-saldo" style="color: ${corSaldo};">R$ ${saldoBco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            `;
            listaBancos.appendChild(itemBcoHtml);
        }
    }

    // 4. REPOVOAR CATEGORIAS FILTRADAS
    if (corpoTabelaCategorias) {
        corpoTabelaCategorias.innerHTML = '';
        for (let cat in somaCategorias) {
            const inlineCat = document.createElement('tr');
            inlineCat.innerHTML = `
                <td style="color: var(--texto-branco);"><span class="legenda-cor-indicador" style="background-color: ${coresCategorias[cat]};"></span>${cat}</td>
                <td style="text-align: right; font-weight: 500; color: ${somaCategorias[cat] > 0 ? 'var(--texto-branco)' : 'var(--texto-cinza)'};">R$ ${somaCategorias[cat].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            `;
            corpoTabelaCategorias.appendChild(inlineCat);
        }
    }

    desenharGrafico(somaCategorias, totalSaidasMesSelecionado);

    if(saldoTotalEl) saldoTotalEl.textContent = `R$ ${saldoGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if(totalSaidaEl) totalSaidaEl.textContent = `R$ ${totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if(totalEntradaEl) totalEntradaEl.textContent = `R$ ${totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Inicializa o sistema
atualizarInterface();
