import { clienteSection } from "./cliente-section.js";
import { clientePickerSection } from "./cliente-picker.js";
import { chamadoSection } from "./chamado-section.js";
import { financeiroSection } from "./financeiro-section.js";

const storageKey = "helpdesk.chamados";
const storageClientKey = "helpdesk.clientes";
const storageCompanyKey = "helpdesk.empresa";
const storageBudgetKey = "helpdesk.orcamentos";
const storageSalesKey = "helpdesk.vendas";

const clienteContainer = document.getElementById("clienteSection");
const clientePickerContainer = document.getElementById("clientePickerSection");
const chamadoContainer = document.getElementById("chamadoSection");
const financeiroContainer = document.getElementById("financeiroSection");

if (clienteContainer && clientePickerContainer && chamadoContainer && financeiroContainer) {
  clienteContainer.innerHTML = clienteSection;
  clientePickerContainer.innerHTML = clientePickerSection;
  chamadoContainer.innerHTML = chamadoSection;
  financeiroContainer.innerHTML = financeiroSection;
}

const state = {
  chamados: [],
  clientes: [],
  orcamentos: [],
  vendas: [],
  editId: null,
};

let companyInfo = {
  nome: "Helpdesk Company",
  documento: "00.000.000/0001-00",
  endereco: "Rua Exemplo, 100 - Centro - Cidade/UF",
  telefone: "(00) 0000-0000",
  logo: "logo.png",
  titulo: "Central de Suporte",
  subtitulo: "Gestão completa de chamados com cadastro PF/PJ.",
};

let currentDoc = "orcamento";
let lastDocChamadoId = "";
let pendingOrcamentoFromOs = null;
let editingOrcamentoNumero = null;
let pendingVendaPrefill = null;
let editingVendaNumero = null;

const elements = {
  lista: null,
  vazio: null,
  total: null,
  totalAbertos: null,
  totalAtendimento: null,
  totalFechados: null,
  totalDash: document.getElementById("totalOsDash"),
  totalAbertosDash: document.getElementById("totalOsAbertasDash"),
  totalAtendimentoDash: document.getElementById("totalOsAtendimentoDash"),
  totalFechadosDash: document.getElementById("totalOsFechadasDash"),
  totalOrcamentosDash: document.getElementById("totalOrcamentosDash"),
  totalVendasDash: document.getElementById("totalVendasDash"),
  filtroPrioridade: null,
  filtroStatus: null,
  filtroData: null,
  busca: null,
  btnNovo: null,
  chamadosOverlay: document.getElementById("chamadosOverlay"),
  chamadosConteudo: document.getElementById("chamadosConteudo"),
  fecharChamados: document.getElementById("fecharChamados"),
  clientesOverlay: document.getElementById("clientesOverlay"),
  clientesConteudo: document.getElementById("clientesConteudo"),
  fecharClientes: document.getElementById("fecharClientes"),
  orcamentoOverlay: document.getElementById("orcamentoOverlay"),
  orcamentoConteudo: document.getElementById("orcamentoConteudo"),
  fecharOrcamento: document.getElementById("fecharOrcamento"),
  vendasOverlay: document.getElementById("vendasOverlay"),
  vendasConteudo: document.getElementById("vendasConteudo"),
  fecharVendas: document.getElementById("fecharVendas"),
  financeiroOverlay: document.getElementById("financeiroOverlay"),
  financeiroConteudo: document.getElementById("financeiroConteudo"),
  fecharFinanceiro: document.getElementById("fecharFinanceiro"),
  menuChamados: document.getElementById("menuChamados"),
  menuCadastroCliente: document.getElementById("menuCadastroCliente"),
  menuOrcamento: document.getElementById("menuOrcamento"),
  menuVendas: document.getElementById("menuVendas"),
  menuPedido: document.getElementById("menuPedido"),
  menuFinanceiro: document.getElementById("menuFinanceiro"),
  menuEmpresa: document.getElementById("menuEmpresa"),
  modal: document.getElementById("modal"),
  fecharModal: document.getElementById("fecharModal"),
  cancelar: document.getElementById("cancelar"),
  form: document.getElementById("formChamado"),
  modalTitulo: document.getElementById("modalTitulo"),
  clienteSelect: document.getElementById("clienteSelect"),
  clienteHint: document.getElementById("clienteHint"),
  btnVerCliente: document.getElementById("btnVerCliente"),
  modalCliente: document.getElementById("modalCliente"),
  modalClienteTitulo: document.getElementById("modalClienteTitulo"),
  fecharModalCliente: document.getElementById("fecharModalCliente"),
  cancelarCliente: document.getElementById("cancelarCliente"),
  formCliente: document.getElementById("formCliente"),
  modalPagamento: document.getElementById("modalPagamento"),
  modalPagamentoTitulo: document.getElementById("modalPagamentoTitulo"),
  fecharModalPagamento: document.getElementById("fecharModalPagamento"),
  btnImprimir: document.getElementById("btnImprimir"),
  printActions: document.querySelector(".print-actions"),
  docConteudo: document.getElementById("docConteudo"),
  tabButtons: document.querySelectorAll(".tab-btn"),
  modalEmpresa: document.getElementById("modalEmpresa"),
  fecharModalEmpresa: document.getElementById("fecharModalEmpresa"),
  cancelarEmpresa: document.getElementById("cancelarEmpresa"),
  formEmpresa: document.getElementById("formEmpresa"),
  empresaNome: document.getElementById("empresaNome"),
  empresaDocumento: document.getElementById("empresaDocumento"),
  empresaEndereco: document.getElementById("empresaEndereco"),
  empresaTelefone: document.getElementById("empresaTelefone"),
  empresaLogo: document.getElementById("empresaLogo"),
  logoHeader: document.getElementById("logoHeader"),
  empresaTitulo: document.getElementById("empresaTitulo"),
  empresaSubtitulo: document.getElementById("empresaSubtitulo"),
  tituloHeader: document.getElementById("tituloHeader"),
  subtituloHeader: document.getElementById("subtituloHeader"),
  tipoCadastro: document.getElementById("tipoCadastro"),
  camposPF: document.getElementById("camposPF"),
  camposPJ: document.getElementById("camposPJ"),
  statusServico: document.getElementById("statusServico"),
  cepHint: document.getElementById("cepHint"),
  metodoPagamentoField: document.getElementById("metodoPagamentoField"),
  valorPagamentoField: document.getElementById("valorPagamentoField"),
  parcelasPagamentoField: document.getElementById("parcelasPagamentoField"),
};

const clienteFields = {
  tipoCadastro: document.getElementById("tipoCadastro"),
  nomeCompleto: document.getElementById("nomeCompleto"),
  cpf: document.getElementById("cpf"),
  razaoSocial: document.getElementById("razaoSocial"),
  cnpj: document.getElementById("cnpj"),
  contatoResponsavel: document.getElementById("contatoResponsavel"),
  email: document.getElementById("email"),
  telefone: document.getElementById("telefone"),
  whatsapp: document.getElementById("whatsapp"),
  rua: document.getElementById("rua"),
  numero: document.getElementById("numero"),
  complemento: document.getElementById("complemento"),
  bairro: document.getElementById("bairro"),
  cidade: document.getElementById("cidade"),
  uf: document.getElementById("uf"),
  cep: document.getElementById("cep"),
};

const chamadoFields = {
  categoria: document.getElementById("categoria"),
  prioridade: document.getElementById("prioridade"),
  statusServico: document.getElementById("statusServico"),
  dataEntrada: document.getElementById("dataEntrada"),
  dataEntrega: document.getElementById("dataEntrega"),
  modelo: document.getElementById("modelo"),
  marca: document.getElementById("marca"),
  localExecucao: document.getElementById("localExecucao"),
  descricao: document.getElementById("descricao"),
  aprovacao: document.getElementById("aprovacao"),
  metodoPagamento: document.getElementById("metodoPagamento"),
  valorPagamento: document.getElementById("valorPagamento"),
  parcelasPagamento: document.getElementById("parcelasPagamento"),
};

const osElements = {
  tabelaPecasBody: document.querySelector("#osTabelaPecas tbody"),
  tabelaServicosBody: document.querySelector("#osTabelaServicos tbody"),
  addPeca: document.getElementById("osAddPeca"),
  addServico: document.getElementById("osAddServico"),
  totalPecas: document.getElementById("osTotalPecas"),
  totalServicos: document.getElementById("osTotalServicos"),
  totalGeral: document.getElementById("osTotalGeral"),
};

const requiredByType = {
  PF: ["nomeCompleto", "cpf"],
  PJ: ["razaoSocial", "cnpj", "contatoResponsavel"],
};

const statusClass = {
  Aberto: "status--Aberto",
  "Em atendimento": "status--Em-atendimento",
  Resolvido: "status--Resolvido",
  Concluida: "status--Concluida",
  Fechado: "status--Fechado",
};

const priorityClass = {
  Baixa: "tag--baixa",
  Media: "tag--media",
  Alta: "tag--alta",
  Critica: "tag--critica",
};

const loadChamados = () => {
  const raw = localStorage.getItem(storageKey);
  state.chamados = raw ? JSON.parse(raw) : [];
};

let chamadosLoaded = false;
let chamadosBound = false;
let clientesLoaded = false;
let clientesBound = false;
let orcamentoLoaded = false;
let orcamentoBound = false;
let vendasLoaded = false;
let vendasBound = false;
let financeiroLoaded = false;
let financeiroBound = false;

const orcamentoElements = {
  listaSection: null,
  editorSection: null,
  busca: null,
  filtroData: null,
  lista: null,
  listaVazia: null,
  novo: null,
  numero: null,
  data: null,
  clienteModo: null,
  clienteId: null,
  clienteNome: null,
  toggleClienteDados: null,
  observacoes: null,
  referenciaOs: null,
  tabelaPecasBody: null,
  tabelaServicosBody: null,
  addItemPeca: null,
  addItemServico: null,
  totalPecas: null,
  totalServicos: null,
  totalGeral: null,
  btnVoltar: null,
  btnGerarVenda: null,
  btnSalvar: null,
  btnImprimir: null,
};

const clientesPanelElements = {
  busca: null,
  tipo: null,
  lista: null,
  vazio: null,
  novo: null,
};

const vendasElements = {
  listaSection: null,
  editorSection: null,
  busca: null,
  filtroData: null,
  filtroOrigem: null,
  filtroStatus: null,
  lista: null,
  vazio: null,
  novo: null,
  voltar: null,
  salvar: null,
  numero: null,
  data: null,
  origemTipo: null,
  origemId: null,
  clienteModo: null,
  clienteId: null,
  clienteNome: null,
  descricao: null,
  tabelaItensBody: null,
  tabelaServicosBody: null,
  addItem: null,
  addServico: null,
  valorTotal: null,
  descontoValor: null,
  outrosValores: null,
  valorFinal: null,
  valorRecebido: null,
  metodoPagamento: null,
  status: null,
};

const financeiroElements = {
  busca: null,
  data: null,
  origem: null,
  status: null,
  totalVendido: null,
  totalRecebido: null,
  totalAberto: null,
  lista: null,
  vazio: null,
};

const cacheChamadosElements = () => {
  elements.lista = document.getElementById("listaChamados");
  elements.vazio = document.getElementById("estadoVazio");
  elements.total = document.getElementById("totalChamados");
  elements.totalAbertos = document.getElementById("totalAbertos");
  elements.totalAtendimento = document.getElementById("totalAtendimento");
  elements.totalFechados = document.getElementById("totalFechados");
  elements.filtroPrioridade = document.getElementById("filtroPrioridade");
  elements.filtroStatus = document.getElementById("filtroStatus");
  elements.filtroData = document.getElementById("filtroData");
  elements.busca = document.getElementById("busca");
  elements.btnNovo = document.getElementById("btnNovo");
};

const bindChamadosEvents = () => {
  if (chamadosBound) {
    return;
  }
  if (elements.btnNovo) {
    elements.btnNovo.addEventListener("click", () => {
      resetChamadoForm();
      setModalOpen(true);
    });
  }
  if (elements.filtroPrioridade) {
    elements.filtroPrioridade.addEventListener("change", render);
  }
  if (elements.filtroStatus) {
    elements.filtroStatus.addEventListener("change", render);
  }
  if (elements.filtroData) {
    elements.filtroData.addEventListener("change", render);
  }
  if (elements.busca) {
    elements.busca.addEventListener("input", render);
  }
  chamadosBound = true;
};

const bindClearButtons = () => {
  document.querySelectorAll("[data-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-clear");
      const input = document.getElementById(targetId);
      if (input) {
        input.value = "";
        render();
      }
    });
  });
};

const setDataHoje = () => {
  if (elements.filtroData) {
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");
    const dd = String(hoje.getDate()).padStart(2, "0");
    elements.filtroData.value = `${yyyy}-${mm}-${dd}`;
    render();
  }
};

const loadChamadosPanel = async () => {
  if (chamadosLoaded) {
    return;
  }
  try {
    const response = await fetch("chamados.html");
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a tela de chamados.");
    }
    const html = await response.text();
    if (elements.chamadosConteudo) {
      elements.chamadosConteudo.innerHTML = html;
      cacheChamadosElements();
      bindChamadosEvents();
      bindClearButtons();
      render();
    }
    chamadosLoaded = true;
  } catch (error) {
    if (elements.chamadosConteudo) {
      elements.chamadosConteudo.innerHTML =
        '<p style="color:#991b1b;">Erro ao carregar os chamados. Recarregue a pagina.</p>';
    }
  }
};

const openChamadosPanel = async () => {
  await loadChamadosPanel();
  elements.chamadosOverlay?.classList.add("show");
};

const closeChamadosPanel = () => {
  elements.chamadosOverlay?.classList.remove("show");
};

const cacheClientesPanelElements = () => {
  clientesPanelElements.busca = document.getElementById("clientesBusca");
  clientesPanelElements.tipo = document.getElementById("clientesTipo");
  clientesPanelElements.lista = document.getElementById("clientesLista");
  clientesPanelElements.vazio = document.getElementById("clientesVazio");
  clientesPanelElements.novo = document.getElementById("btnNovoClientePainel");
};

const getFilteredClientes = () => {
  const busca = normalize(clientesPanelElements.busca?.value || "");
  const tipo = clientesPanelElements.tipo?.value || "";
  return state.clientes.filter((cliente) => {
    if (tipo && cliente.tipoCadastro !== tipo) {
      return false;
    }
    if (!busca) {
      return true;
    }
    const nome =
      cliente.tipoCadastro === "PF" ? cliente.cliente.nomeCompleto : cliente.cliente.razaoSocial;
    const doc = cliente.tipoCadastro === "PF" ? cliente.cliente.cpf : cliente.cliente.cnpj;
    const fields = [nome, doc, cliente.contato.email, cliente.endereco.cidade];
    return fields.some((field) => normalize(field || "").includes(busca));
  });
};

const createClienteCard = (cliente) => {
  const card = document.createElement("article");
  card.className = "card";
  const nome =
    cliente.tipoCadastro === "PF" ? cliente.cliente.nomeCompleto : cliente.cliente.razaoSocial;
  const documento =
    cliente.tipoCadastro === "PF" ? `CPF: ${cliente.cliente.cpf}` : `CNPJ: ${cliente.cliente.cnpj}`;
  card.innerHTML = `
    <div class="card__header">
      <div><h3 class="card__title">${nome}</h3></div>
      <div class="card__tags"><span class="tag tag--media">${cliente.tipoCadastro}</span></div>
    </div>
    <div class="card__meta">
      <span><strong>${documento}</strong></span>
      <span><strong>E-mail:</strong> ${cliente.contato.email || "-"}</span>
      <span><strong>Cidade:</strong> ${cliente.endereco.cidade || "-"} / ${cliente.endereco.uf || "-"}</span>
    </div>
    <div class="card__actions card__actions--inline">
      <button type="button" class="btn btn--ghost" data-view-cliente="${cliente.id}">Ver dados</button>
    </div>
  `;
  card.querySelector("[data-view-cliente]")?.addEventListener("click", () => {
    elements.docConteudo.innerHTML = buildClienteHTML(cliente);
    elements.modalPagamentoTitulo.textContent = "Dados do cliente";
    setPagamentoActionsVisible(false);
    setPagamentoModalOpen(true);
  });
  return card;
};

const renderClientesPanel = () => {
  if (!clientesPanelElements.lista || !clientesPanelElements.vazio) {
    return;
  }
  clientesPanelElements.lista.innerHTML = "";
  const clientes = getFilteredClientes().sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
  clientes.forEach((cliente) => clientesPanelElements.lista.appendChild(createClienteCard(cliente)));
  clientesPanelElements.vazio.style.display = clientes.length ? "none" : "block";
};

const bindClientesPanelEvents = () => {
  if (clientesBound) {
    return;
  }
  clientesPanelElements.busca?.addEventListener("input", renderClientesPanel);
  clientesPanelElements.tipo?.addEventListener("change", renderClientesPanel);
  clientesPanelElements.novo?.addEventListener("click", () => {
    resetClienteForm();
    setClienteModalOpen(true);
  });
  clientesBound = true;
};

const loadClientesPanel = async () => {
  if (clientesLoaded) {
    return;
  }
  try {
    const response = await fetch("clientes.html");
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a tela de clientes.");
    }
    const html = await response.text();
    if (elements.clientesConteudo) {
      elements.clientesConteudo.innerHTML = html;
      cacheClientesPanelElements();
      bindClientesPanelEvents();
      renderClientesPanel();
    }
    clientesLoaded = true;
  } catch (error) {
    if (elements.clientesConteudo) {
      elements.clientesConteudo.innerHTML =
        '<p style="color:#991b1b;">Erro ao carregar clientes. Recarregue a pagina.</p>';
    }
  }
};

const openClientesPanel = async () => {
  await loadClientesPanel();
  renderClientesPanel();
  elements.clientesOverlay?.classList.add("show");
};

const closeClientesPanel = () => {
  elements.clientesOverlay?.classList.remove("show");
};

const cacheOrcamentoElements = () => {
  orcamentoElements.listaSection = document.getElementById("orcamentoListaSection");
  orcamentoElements.editorSection = document.getElementById("orcamentoEditorSection");
  orcamentoElements.busca = document.getElementById("orcamentoBusca");
  orcamentoElements.filtroData = document.getElementById("orcamentoFiltroData");
  orcamentoElements.lista = document.getElementById("orcamentoLista");
  orcamentoElements.listaVazia = document.getElementById("orcamentoListaVazia");
  orcamentoElements.novo = document.getElementById("orcamentoNovo");
  orcamentoElements.numero = document.getElementById("orcamentoNumero");
  orcamentoElements.data = document.getElementById("orcamentoData");
  orcamentoElements.clienteModo = document.getElementById("orcamentoClienteModo");
  orcamentoElements.clienteId = document.getElementById("orcamentoClienteId");
  orcamentoElements.clienteNome = document.getElementById("orcamentoClienteNome");
  orcamentoElements.toggleClienteDados = document.getElementById(
    "orcamentoToggleClienteDados"
  );
  orcamentoElements.observacoes = document.getElementById("orcamentoObservacoes");
  orcamentoElements.referenciaOs = document.getElementById("orcamentoReferenciaOs");
  orcamentoElements.tabelaPecasBody = document.querySelector("#tabelaPecas tbody");
  orcamentoElements.tabelaServicosBody = document.querySelector("#tabelaServicos tbody");
  orcamentoElements.addItemPeca = document.getElementById("addItemPeca");
  orcamentoElements.addItemServico = document.getElementById("addItemServico");
  orcamentoElements.totalPecas = document.getElementById("orcamentoTotalPecas");
  orcamentoElements.totalServicos = document.getElementById("orcamentoTotalServicos");
  orcamentoElements.totalGeral = document.getElementById("orcamentoTotalGeral");
  orcamentoElements.btnVoltar = document.getElementById("btnVoltarListaOrcamento");
  orcamentoElements.btnGerarVenda = document.getElementById("btnGerarVendaOrcamento");
  orcamentoElements.btnSalvar = document.getElementById("btnSalvarOrcamento");
  orcamentoElements.btnImprimir = document.getElementById("btnImprimirOrcamento");
};

const updateOrcamentoReferenciaOs = (osId = "") => {
  if (!orcamentoElements.referenciaOs) {
    return;
  }
  const value = osId ? String(osId) : "";
  orcamentoElements.referenciaOs.dataset.osId = value;
  if (value) {
    orcamentoElements.referenciaOs.style.display = "block";
    orcamentoElements.referenciaOs.textContent = `Referência da O.S.: #${value}`;
    return;
  }
  orcamentoElements.referenciaOs.style.display = "none";
  orcamentoElements.referenciaOs.textContent = "";
};

const autoGrowTextarea = (textarea) => {
  if (!textarea) {
    return;
  }
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const toggleOrcamentoClienteFields = () => {
  const isManual = orcamentoElements.clienteModo?.value === "manual";
  if (orcamentoElements.clienteId) {
    orcamentoElements.clienteId.style.display = isManual ? "none" : "block";
  }
  if (orcamentoElements.clienteNome) {
    orcamentoElements.clienteNome.style.display = isManual ? "block" : "none";
  }
  if (orcamentoElements.toggleClienteDados) {
    orcamentoElements.toggleClienteDados.style.display = isManual ? "none" : "inline-flex";
  }
  updateOrcamentoClienteLinkState();
};

const updateOrcamentoClienteLinkState = () => {
  if (!orcamentoElements.toggleClienteDados) {
    return;
  }
  const isManual = orcamentoElements.clienteModo?.value === "manual";
  if (isManual) {
    orcamentoElements.toggleClienteDados.style.display = "none";
    return;
  }
  const clienteId = orcamentoElements.clienteId?.value || "";
  orcamentoElements.toggleClienteDados.style.display = "inline-flex";
  orcamentoElements.toggleClienteDados.disabled = !clienteId;
};

const showOrcamentoList = () => {
  if (orcamentoElements.listaSection) {
    orcamentoElements.listaSection.style.display = "block";
  }
  if (orcamentoElements.editorSection) {
    orcamentoElements.editorSection.style.display = "none";
  }
  renderOrcamentosList();
};

const showOrcamentoEditor = () => {
  if (orcamentoElements.listaSection) {
    orcamentoElements.listaSection.style.display = "none";
  }
  if (orcamentoElements.editorSection) {
    orcamentoElements.editorSection.style.display = "block";
  }
};

const getOrcamentoClienteLabel = (orcamento) => {
  if (orcamento.clienteModo === "manual") {
    return orcamento.clienteNomeManual || "Cliente avulso";
  }
  const cliente = getClienteById(orcamento.clienteId);
  if (!cliente) {
    return "Cliente não encontrado";
  }
  return cliente.tipoCadastro === "PF"
    ? cliente.cliente.nomeCompleto
    : cliente.cliente.razaoSocial;
};

const getFilteredOrcamentos = () => {
  const busca = normalize(orcamentoElements.busca?.value || "");
  const data = orcamentoElements.filtroData?.value || "";
  return state.orcamentos.filter((item) => {
    if (data && item.data !== data) {
      return false;
    }
    if (!busca) {
      return true;
    }
    const cliente = getClienteById(item.clienteId);
    const cpfCnpj = cliente
      ? cliente.tipoCadastro === "PF"
        ? cliente.cliente.cpf
        : cliente.cliente.cnpj
      : "";
    const fields = [item.numero, getOrcamentoClienteLabel(item), cpfCnpj];
    return fields.some((field) => normalize(field || "").includes(busca));
  });
};

const loadOrcamentoIntoEditor = (orcamento) => {
  editingOrcamentoNumero = orcamento.numero;
  orcamentoElements.numero.value = orcamento.numero;
  orcamentoElements.data.value = orcamento.data || "";
  orcamentoElements.clienteModo.value = orcamento.clienteModo || "cadastrado";
  orcamentoElements.clienteId.value = orcamento.clienteId || "";
  orcamentoElements.clienteNome.value = orcamento.clienteNomeManual || "";
  orcamentoElements.observacoes.value = orcamento.observacoes || "";
  autoGrowTextarea(orcamentoElements.observacoes);
  updateOrcamentoReferenciaOs(orcamento.referenciaOs || "");
  toggleOrcamentoClienteFields();

  if (orcamentoElements.tabelaPecasBody) {
    orcamentoElements.tabelaPecasBody.innerHTML = "";
  }
  if (orcamentoElements.tabelaServicosBody) {
    orcamentoElements.tabelaServicosBody.innerHTML = "";
  }
  (orcamento.pecas || []).forEach((item) => addOrcamentoRow("peca", item));
  (orcamento.servicos || []).forEach((item) => addOrcamentoRow("servico", item));
  updateOrcamentoTotals();
  showOrcamentoEditor();
};

const createOrcamentoCard = (orcamento) => {
  const card = document.createElement("article");
  card.className = "card";
  const statusVenda = orcamento.statusVenda || "Aberto";
  card.innerHTML = `
    <div class="card__header">
      <div>
        <h3 class="card__title">Orçamento #${orcamento.numero}</h3>
      </div>
      <div class="card__tags">
        <span class="tag tag--baixa">${statusVenda}</span>
        <span class="status status--Aberto">${formatDate(orcamento.data) || "-"}</span>
      </div>
    </div>
    <div class="card__meta">
      <span><strong>Cliente:</strong> ${getOrcamentoClienteLabel(orcamento)}</span>
      <span><strong>Total:</strong> ${formatCurrency((orcamento.totalGeral || 0).toFixed(2))}</span>
    </div>
    <div class="card__actions card__actions--inline">
      <button type="button" class="btn btn--ghost" data-venda-orc="${orcamento.numero}">Gerar venda</button>
      <button type="button" class="btn btn--ghost" data-edit-orc="${orcamento.numero}">Editar</button>
      <button type="button" class="btn btn--ghost" data-delete-orc="${orcamento.numero}">Excluir</button>
    </div>
  `;
  card.querySelector("[data-venda-orc]")?.addEventListener("click", () => {
    openVendaFromOrcamento(orcamento.numero);
  });
  card.querySelector("[data-edit-orc]")?.addEventListener("click", () => {
    loadOrcamentoIntoEditor(orcamento);
  });
  card.querySelector("[data-delete-orc]")?.addEventListener("click", () => {
    const ok = window.confirm(`Excluir orçamento #${orcamento.numero}?`);
    if (!ok) {
      return;
    }
    state.orcamentos = state.orcamentos.filter((item) => item.numero !== orcamento.numero);
    saveOrcamentos();
    renderSummary();
    renderOrcamentosList();
  });
  return card;
};

const renderOrcamentosList = () => {
  if (!orcamentoElements.lista || !orcamentoElements.listaVazia) {
    return;
  }
  orcamentoElements.lista.innerHTML = "";
  const orcamentos = getFilteredOrcamentos().sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
  orcamentos.forEach((item) => {
    orcamentoElements.lista.appendChild(createOrcamentoCard(item));
  });
  orcamentoElements.listaVazia.style.display = orcamentos.length ? "none" : "block";
};

const generateBudgetNumber = () => {
  let code = "";
  do {
    code = Math.floor(10000 + Math.random() * 90000).toString();
  } while (state.orcamentos.some((item) => item.numero === code));
  return code;
};

const populateOrcamentoClientes = () => {
  if (!orcamentoElements.clienteId) {
    return;
  }
  orcamentoElements.clienteId.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione um cliente";
  orcamentoElements.clienteId.appendChild(placeholder);

  state.clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent =
      cliente.tipoCadastro === "PF"
        ? `${cliente.cliente.nomeCompleto} · CPF ${cliente.cliente.cpf}`
        : `${cliente.cliente.razaoSocial} · CNPJ ${cliente.cliente.cnpj}`;
    orcamentoElements.clienteId.appendChild(option);
  });
  updateOrcamentoClienteLinkState();
};

const parseMoney = (value) => {
  if (!value) {
    return 0;
  }
  const raw = value.toString().trim().replace(/[^\d,.-]/g, "");
  if (!raw) {
    return 0;
  }
  let normalized = raw;
  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");
  if (hasComma && hasDot) {
    if (normalized.lastIndexOf(",") > normalized.lastIndexOf(".")) {
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = normalized.replace(/,/g, "");
    }
  } else if (hasComma) {
    normalized = normalized.replace(",", ".");
  } else if (hasDot) {
    if (!/\.\d{1,2}$/.test(normalized)) {
      normalized = normalized.replace(/\./g, "");
    }
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getOsBodyByType = (type) =>
  type === "peca" ? osElements.tabelaPecasBody : osElements.tabelaServicosBody;

const addOsRow = (type, initialData = {}) => {
  const body = getOsBodyByType(type);
  if (!body) {
    return;
  }
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="orcamento-table__number"></td>
    <td><input type="text" class="os-desc" placeholder="Descrição" value="${initialData.descricao || ""}" /></td>
    <td><input type="text" class="os-un" placeholder="UN" value="${initialData.un || "UN"}" /></td>
    <td><input type="number" class="os-qtde" min="0" step="0.01" value="${initialData.qtde ?? "1"}" /></td>
    <td><input type="text" class="os-preco" placeholder="R$ 0,00" value="" /></td>
    <td class="orcamento-table__total">R$ 0,00</td>
    <td><button type="button" class="btn btn--ghost os-remove">Remover</button></td>
  `;
  body.appendChild(row);

  row.querySelector(".os-remove")?.addEventListener("click", () => {
    row.remove();
    recalcOsTable(type);
  });
  [".os-desc", ".os-un", ".os-qtde", ".os-preco"].forEach((selector) => {
    row.querySelector(selector)?.addEventListener("input", () => recalcOsTable(type));
  });
  const precoInput = row.querySelector(".os-preco");
  if (precoInput) {
    if (initialData.precoUn) {
      const initValue = Number(initialData.precoUn);
      if (!Number.isNaN(initValue)) {
        precoInput.dataset.valor = initValue.toFixed(2);
        precoInput.value = formatCurrency(initValue.toFixed(2));
      }
    }
    precoInput.addEventListener("input", (event) => {
      event.target.dataset.valor = parseMoney(event.target.value || "0").toFixed(2);
      recalcOsTable(type);
    });
    precoInput.addEventListener("focus", (event) => {
      if (event.target.dataset.valor) {
        event.target.value = event.target.dataset.valor.replace(".", ",");
      }
    });
    precoInput.addEventListener("blur", (event) => {
      const value = Number(event.target.dataset.valor || parseMoney(event.target.value || "0"));
      event.target.dataset.valor = value.toFixed(2);
      event.target.value = value ? formatCurrency(value.toFixed(2)) : "";
      recalcOsTable(type);
    });
  }

  recalcOsTable(type);
};

const recalcOsTable = (type) => {
  const body = getOsBodyByType(type);
  if (!body) {
    return;
  }
  Array.from(body.querySelectorAll("tr")).forEach((row, index) => {
    const qtde = parseMoney(row.querySelector(".os-qtde")?.value || "0");
    const precoInput = row.querySelector(".os-preco");
    const preco = Number(precoInput?.dataset.valor || parseMoney(precoInput?.value || "0"));
    const total = qtde * preco;
    const numberCell = row.querySelector(".orcamento-table__number");
    if (numberCell) {
      numberCell.textContent = (index + 1).toString();
    }
    const totalCell = row.querySelector(".orcamento-table__total");
    if (totalCell) {
      totalCell.textContent = formatCurrency(total.toFixed(2));
    }
  });
  updateOsTotals();
};

const getOsRows = (type) => {
  const body = getOsBodyByType(type);
  if (!body) {
    return [];
  }
  return Array.from(body.querySelectorAll("tr"))
    .map((row, index) => {
      const descricao = row.querySelector(".os-desc")?.value.trim() || "";
      const un = row.querySelector(".os-un")?.value.trim() || "";
      const qtde = parseMoney(row.querySelector(".os-qtde")?.value || "0");
      const precoInput = row.querySelector(".os-preco");
      const precoUn = Number(precoInput?.dataset.valor || parseMoney(precoInput?.value || "0"));
      return {
        numero: index + 1,
        descricao,
        un,
        qtde,
        precoUn,
        total: qtde * precoUn,
      };
    })
    .filter((item) => item.descricao);
};

const getOsTotals = () => {
  const totalPecas = getRowsTotal(getOsRows("peca"));
  const totalServicos = getRowsTotal(getOsRows("servico"));
  return {
    totalPecas,
    totalServicos,
    totalGeral: totalPecas + totalServicos,
  };
};

const updateOsTotals = () => {
  const totals = getOsTotals();
  if (osElements.totalPecas) {
    osElements.totalPecas.value = formatCurrency(totals.totalPecas.toFixed(2));
  }
  if (osElements.totalServicos) {
    osElements.totalServicos.value = formatCurrency(totals.totalServicos.toFixed(2));
  }
  if (osElements.totalGeral) {
    osElements.totalGeral.value = formatCurrency(totals.totalGeral.toFixed(2));
  }
};

const resetOsTables = () => {
  if (osElements.tabelaPecasBody) {
    osElements.tabelaPecasBody.innerHTML = "";
  }
  if (osElements.tabelaServicosBody) {
    osElements.tabelaServicosBody.innerHTML = "";
  }
  updateOsTotals();
};

const loadOsTablesFromChamado = (chamado) => {
  if (osElements.tabelaPecasBody) {
    osElements.tabelaPecasBody.innerHTML = "";
  }
  if (osElements.tabelaServicosBody) {
    osElements.tabelaServicosBody.innerHTML = "";
  }
  const pecas = chamado.servico.pecas || [];
  const servicos = chamado.servico.servicos || [];
  pecas.forEach((item) => addOsRow("peca", item));
  servicos.forEach((item) => addOsRow("servico", item));
  updateOsTotals();
};

const addOrcamentoRow = (type, initialData = {}) => {
  const body =
    type === "peca" ? orcamentoElements.tabelaPecasBody : orcamentoElements.tabelaServicosBody;
  if (!body) {
    return;
  }
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="orcamento-table__number"></td>
    <td><input type="text" class="orc-desc" placeholder="Descrição" value="${initialData.descricao || ""}" /></td>
    <td><input type="text" class="orc-un" placeholder="UN" value="${initialData.un || "UN"}" /></td>
    <td><input type="number" class="orc-qtde" min="0" step="0.01" value="${initialData.qtde || "1"}" /></td>
    <td><input type="text" class="orc-preco" placeholder="R$ 0,00" value="" /></td>
    <td class="orcamento-table__total">R$ 0,00</td>
    <td><button type="button" class="btn btn--ghost orc-remove">Remover</button></td>
  `;
  body.appendChild(row);

  row.querySelector(".orc-remove")?.addEventListener("click", () => {
    row.remove();
    recalcOrcamentoTable(type);
  });

  [".orc-qtde", ".orc-preco", ".orc-desc", ".orc-un"].forEach((selector) => {
    row.querySelector(selector)?.addEventListener("input", () => recalcOrcamentoTable(type));
  });
  const precoInput = row.querySelector(".orc-preco");
  if (precoInput) {
    if (initialData.precoUn) {
      const initValue = Number(initialData.precoUn);
      if (!Number.isNaN(initValue)) {
        precoInput.dataset.valor = initValue.toFixed(2);
        precoInput.value = formatCurrency(initValue.toFixed(2));
      }
    }
    precoInput.addEventListener("input", (event) => {
      event.target.dataset.valor = parseMoney(event.target.value || "0").toFixed(2);
      recalcOrcamentoTable(type);
    });
    precoInput.addEventListener("focus", (event) => {
      if (event.target.dataset.valor) {
        event.target.value = event.target.dataset.valor.replace(".", ",");
      }
    });
    precoInput.addEventListener("blur", (event) => {
      const value = Number(event.target.dataset.valor || parseMoney(event.target.value || "0"));
      event.target.dataset.valor = value.toFixed(2);
      event.target.value = value ? formatCurrency(value.toFixed(2)) : "";
      recalcOrcamentoTable(type);
    });
  }

  recalcOrcamentoTable(type);
};

const recalcOrcamentoTable = (type) => {
  const body =
    type === "peca" ? orcamentoElements.tabelaPecasBody : orcamentoElements.tabelaServicosBody;
  if (!body) {
    return;
  }
  Array.from(body.querySelectorAll("tr")).forEach((row, index) => {
    const qtde = parseMoney(row.querySelector(".orc-qtde")?.value || "0");
    const precoInput = row.querySelector(".orc-preco");
    const preco = Number(precoInput?.dataset.valor || parseMoney(precoInput?.value || "0"));
    const total = qtde * preco;
    const numberCell = row.querySelector(".orcamento-table__number");
    if (numberCell) {
      numberCell.textContent = (index + 1).toString();
    }
    const totalCell = row.querySelector(".orcamento-table__total");
    if (totalCell) {
      totalCell.textContent = formatCurrency(total.toFixed(2));
    }
  });
  updateOrcamentoTotals();
};

const getRowsData = (type) => {
  const body =
    type === "peca" ? orcamentoElements.tabelaPecasBody : orcamentoElements.tabelaServicosBody;
  if (!body) {
    return [];
  }
  return Array.from(body.querySelectorAll("tr"))
    .map((row, index) => {
      const descricao = row.querySelector(".orc-desc")?.value.trim() || "";
      const un = row.querySelector(".orc-un")?.value.trim() || "";
      const qtde = parseMoney(row.querySelector(".orc-qtde")?.value || "0");
      const precoInput = row.querySelector(".orc-preco");
      const precoUn = Number(precoInput?.dataset.valor || parseMoney(precoInput?.value || "0"));
      return {
        numero: index + 1,
        descricao,
        un,
        qtde,
        precoUn,
        total: qtde * precoUn,
      };
    })
    .filter((item) => item.descricao || item.qtde || item.precoUn);
};

const getRowsTotal = (rows) => rows.reduce((acc, item) => acc + item.total, 0);

const updateOrcamentoTotals = () => {
  const totalPecas = getRowsTotal(getRowsData("peca"));
  const totalServicos = getRowsTotal(getRowsData("servico"));
  const totalGeral = totalPecas + totalServicos;
  if (orcamentoElements.totalPecas) {
    orcamentoElements.totalPecas.textContent = formatCurrency(totalPecas.toFixed(2));
  }
  if (orcamentoElements.totalServicos) {
    orcamentoElements.totalServicos.textContent = formatCurrency(totalServicos.toFixed(2));
  }
  if (orcamentoElements.totalGeral) {
    orcamentoElements.totalGeral.textContent = formatCurrency(totalGeral.toFixed(2));
  }
};

const resetOrcamentoForm = () => {
  if (!orcamentoElements.numero || !orcamentoElements.data) {
    return;
  }
  editingOrcamentoNumero = null;
  orcamentoElements.numero.value = generateBudgetNumber();
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  orcamentoElements.data.value = `${yyyy}-${mm}-${dd}`;
  if (orcamentoElements.clienteModo) {
    orcamentoElements.clienteModo.value = "cadastrado";
  }
  if (orcamentoElements.clienteId) {
    orcamentoElements.clienteId.value = "";
  }
  if (orcamentoElements.clienteNome) {
    orcamentoElements.clienteNome.value = "";
  }
  if (orcamentoElements.observacoes) {
    orcamentoElements.observacoes.value = "";
    autoGrowTextarea(orcamentoElements.observacoes);
  }
  updateOrcamentoReferenciaOs("");
  toggleOrcamentoClienteFields();

  if (orcamentoElements.tabelaPecasBody) {
    orcamentoElements.tabelaPecasBody.innerHTML = "";
  }
  if (orcamentoElements.tabelaServicosBody) {
    orcamentoElements.tabelaServicosBody.innerHTML = "";
  }
  updateOrcamentoTotals();
};

const saveOrcamento = () => {
  if (!orcamentoElements.numero) {
    return;
  }
  const clienteModo = orcamentoElements.clienteModo?.value || "cadastrado";
  const clienteId = orcamentoElements.clienteId?.value || "";
  const clienteNomeManual = orcamentoElements.clienteNome?.value.trim() || "";

  if (clienteModo === "cadastrado" && !clienteId) {
    alert("Selecione um cliente cadastrado.");
    return;
  }
  if (clienteModo === "manual" && !clienteNomeManual) {
    alert("Digite o nome do cliente para o orçamento.");
    return;
  }

  const pecas = getRowsData("peca");
  const servicos = getRowsData("servico");
  const totalPecas = getRowsTotal(pecas);
  const totalServicos = getRowsTotal(servicos);
  const totalGeral = totalPecas + totalServicos;

  const previous = state.orcamentos.find(
    (item) => item.numero === (editingOrcamentoNumero || orcamentoElements.numero.value)
  );
  const orcamento = {
    numero: editingOrcamentoNumero || orcamentoElements.numero.value,
    data: orcamentoElements.data?.value || "",
    referenciaOs: orcamentoElements.referenciaOs?.dataset.osId || "",
    observacoes: orcamentoElements.observacoes?.value.trim() || "",
    clienteModo,
    clienteId,
    clienteNomeManual,
    pecas,
    servicos,
    totalPecas,
    totalServicos,
    totalGeral,
    statusVenda: previous?.statusVenda || "Aberto",
    createdAt: new Date().toISOString(),
  };

  state.orcamentos = state.orcamentos.filter((item) => item.numero !== orcamento.numero);
  state.orcamentos.unshift(orcamento);
  saveOrcamentos();
  renderSummary();
  alert(`Orçamento #${orcamento.numero} salvo.`);
  showOrcamentoList();
};

const getOrcamentoClienteNome = () => {
  const clienteModo = orcamentoElements.clienteModo?.value || "cadastrado";
  if (clienteModo === "manual") {
    return orcamentoElements.clienteNome?.value.trim() || "Não informado";
  }
  const clienteId = orcamentoElements.clienteId?.value || "";
  const cliente = getClienteById(clienteId);
  if (!cliente) {
    return "Não informado";
  }
  return cliente.tipoCadastro === "PF"
    ? cliente.cliente.nomeCompleto
    : cliente.cliente.razaoSocial;
};

const openOrcamentoClienteConferencia = () => {
  const clienteId = orcamentoElements.clienteId?.value || "";
  if (!clienteId) {
    alert("Selecione um cliente para visualizar os dados.");
    return;
  }
  const cliente = getClienteById(clienteId);
  if (!cliente) {
    alert("Cliente não encontrado.");
    return;
  }
  elements.docConteudo.innerHTML = buildClienteHTML(cliente);
  elements.modalPagamentoTitulo.textContent = "Dados do cliente";
  setPagamentoActionsVisible(false);
  setPagamentoModalOpen(true);
};

const rowsToPrintHtml = (rows) =>
  rows
    .map(
      (item) => `
      <tr>
        <td>${item.numero}</td>
        <td>${item.descricao || "-"}</td>
        <td>${item.un || "-"}</td>
        <td>${item.qtde.toFixed(2).replace(".", ",")}</td>
        <td>${formatCurrency(item.precoUn.toFixed(2))}</td>
        <td>${formatCurrency(item.total.toFixed(2))}</td>
      </tr>`
    )
    .join("");

const printOrcamento = () => {
  if (!orcamentoElements.numero) {
    return;
  }
  const pecas = getRowsData("peca");
  const servicos = getRowsData("servico");
  const totalPecas = getRowsTotal(pecas);
  const totalServicos = getRowsTotal(servicos);
  const totalGeral = totalPecas + totalServicos;
  const clienteNome = getOrcamentoClienteNome();
  const clienteId = orcamentoElements.clienteId?.value || "";
  const clienteCadastro = getClienteById(clienteId);
  const referenciaOs = orcamentoElements.referenciaOs?.dataset.osId || "";
  const observacoes = orcamentoElements.observacoes?.value.trim() || "";
  const data = formatDate(orcamentoElements.data?.value || "");
  const logoSrc = new URL(companyInfo.logo || "logo.png", window.location.href).href;
  const empresaTitulo = companyInfo.titulo || companyInfo.nome || "Empresa";
  const empresaSubtitulo = companyInfo.subtitulo || "";
  const clienteCpfCnpj = clienteCadastro
    ? clienteCadastro.tipoCadastro === "PF"
      ? clienteCadastro.cliente.cpf || "-"
      : clienteCadastro.cliente.cnpj || "-"
    : "-";
  const clienteEmail = clienteCadastro?.contato?.email || "-";
  const clienteWhatsapp = clienteCadastro?.contato?.whatsapp || "-";
  const clienteEndereco = clienteCadastro
    ? `${clienteCadastro.endereco?.rua || "-"}, ${clienteCadastro.endereco?.numero || "-"}${
        clienteCadastro.endereco?.bairro ? ` - ${clienteCadastro.endereco.bairro}` : ""
      }${clienteCadastro.endereco?.cidade ? ` - ${clienteCadastro.endereco.cidade}` : ""}${
        clienteCadastro.endereco?.uf ? `/${clienteCadastro.endereco.uf}` : ""
      }`
    : "-";

  const printWindow = window.open("", "_blank", "width=1000,height=700");
  if (!printWindow) {
    alert("Permita pop-up para imprimir o orçamento.");
    return;
  }

  printWindow.document.write(`
    <html lang="pt-BR">
      <head>
        <title>Orçamento #${orcamentoElements.numero.value}</title>
        <style>
          @page { size: A4; margin: 16mm 14mm 18mm; }
          * { box-sizing: border-box; }
          body { font-family: "Segoe UI", Arial, sans-serif; color: #0f172a; margin: 0; }
          .sheet { min-height: calc(297mm - 34mm); display: flex; flex-direction: column; }
          .header {
            border: 1px solid #dbe3ef;
            border-radius: 14px;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            background: linear-gradient(135deg, #f8fbff, #f2f8f7);
            margin-bottom: 14px;
          }
          .header__left { display: flex; gap: 12px; align-items: center; }
          .logo { width: 62px; height: 62px; border-radius: 14px; object-fit: cover; border: 1px solid #d5dbe7; background: #fff; }
          .title { margin: 0; font-size: 20px; font-weight: 700; }
          .subtitle { margin: 2px 0 0; color: #475569; font-size: 12px; }
          .company { margin-top: 8px; color: #334155; font-size: 12px; line-height: 1.45; }
          .orc-badge {
            border: 1px solid #0a7c6b;
            color: #0a7c6b;
            background: #ecfdf5;
            border-radius: 999px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
          }
          .meta {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 10px 12px;
            display: grid;
            gap: 8px;
            margin-bottom: 12px;
            background: #ffffff;
          }
          .meta__row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .meta__item { font-size: 12px; color: #475569; }
          .meta__item strong { color: #0f172a; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; margin-right: 6px; }
          h3 {
            margin: 12px 0 8px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: .05em;
            color: #0a7c6b;
          }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f8fafc; color: #334155; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; font-size: 11px; }
          td:nth-child(1), td:nth-child(3), td:nth-child(4) { width: 70px; }
          td:nth-child(5), td:nth-child(6) { width: 115px; }
          .empty-row td { text-align: center; color: #64748b; }
          .totais {
            margin-top: 8px;
            margin-left: auto;
            width: 330px;
            border: 1px solid #dbe3ef;
            border-radius: 12px;
            padding: 10px 12px;
            display: grid;
            gap: 6px;
            background: #f8fbff;
          }
          .totais div { display: flex; justify-content: space-between; font-size: 12px; color: #334155; }
          .totais .geral { border-top: 1px solid #dbe3ef; padding-top: 6px; font-weight: 800; color: #0f172a; }
          .spacer { flex: 1; }
          .footer {
            border-top: 1px solid #dbe3ef;
            margin-top: 18px;
            padding-top: 8px;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-size: 11px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <header class="header">
            <div class="header__left">
              <img class="logo" src="${logoSrc}" alt="Logo da empresa" />
              <div>
                <h1 class="title">${empresaTitulo}</h1>
                <p class="subtitle">${empresaSubtitulo}</p>
                <div class="company">
                  <div><strong>Empresa:</strong> ${companyInfo.nome || "-"}</div>
                  <div><strong>Documento:</strong> ${companyInfo.documento || "-"}</div>
                  <div><strong>Endereço:</strong> ${companyInfo.endereco || "-"}</div>
                  <div><strong>Telefone:</strong> ${companyInfo.telefone || "-"}</div>
                </div>
              </div>
            </div>
            <div class="orc-badge">Orçamento #${orcamentoElements.numero.value}</div>
          </header>

          <section class="meta">
            ${
              referenciaOs
                ? `<div class="meta__row"><div class="meta__item"><strong>Referência O.S.:</strong>#${referenciaOs}</div><div class="meta__item"></div></div>`
                : ""
            }
            <div class="meta__row">
              <div class="meta__item"><strong>Cliente:</strong>${clienteNome}</div>
              <div class="meta__item"><strong>${clienteCadastro?.tipoCadastro === "PF" ? "CPF" : "CNPJ"}:</strong>${clienteCpfCnpj}</div>
            </div>
            <div class="meta__row">
              <div class="meta__item"><strong>WhatsApp:</strong>${clienteWhatsapp}</div>
              <div class="meta__item"><strong>E-mail:</strong>${clienteEmail}</div>
            </div>
            <div class="meta__row">
              <div class="meta__item"><strong>Endereço:</strong>${clienteEndereco}</div>
              <div class="meta__item"><strong>Data:</strong>${data || "-"}</div>
            </div>
          </section>

          <h3>Peças</h3>
          <table>
            <thead>
              <tr><th>Nº</th><th>Descrição</th><th>Un</th><th>Qtde</th><th>Preço un</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${
                pecas.length
                  ? rowsToPrintHtml(pecas)
                  : '<tr class="empty-row"><td colspan="6">Nenhuma peça informada</td></tr>'
              }
            </tbody>
          </table>

          <h3>Serviços</h3>
          <table>
            <thead>
              <tr><th>Nº</th><th>Descrição</th><th>Un</th><th>Qtde</th><th>Preço un</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${
                servicos.length
                  ? rowsToPrintHtml(servicos)
                  : '<tr class="empty-row"><td colspan="6">Nenhum serviço informado</td></tr>'
              }
            </tbody>
          </table>

          ${
            observacoes
              ? `<section class="meta" style="margin-top:-4px;"><div class="meta__item"><strong>Observações:</strong>${observacoes.replace(/\n/g, "<br/>")}</div></section>`
              : ""
          }

          <div class="totais">
            <div><span>Total de peças</span><strong>${formatCurrency(totalPecas.toFixed(2))}</strong></div>
            <div><span>Total de serviços</span><strong>${formatCurrency(totalServicos.toFixed(2))}</strong></div>
            <div class="geral"><span>Total do orçamento</span><strong>${formatCurrency(totalGeral.toFixed(2))}</strong></div>
          </div>

          <div class="spacer"></div>
          <footer class="footer">
            <span>${companyInfo.nome || "-"} · ${companyInfo.documento || "-"}</span>
            <span>${companyInfo.telefone || "-"} · ${companyInfo.endereco || "-"}</span>
          </footer>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const bindOrcamentoEvents = () => {
  if (orcamentoBound) {
    return;
  }
  orcamentoElements.novo?.addEventListener("click", () => {
    resetOrcamentoForm();
    showOrcamentoEditor();
  });
  orcamentoElements.btnVoltar?.addEventListener("click", showOrcamentoList);
  orcamentoElements.btnGerarVenda?.addEventListener("click", () => {
    const numero = editingOrcamentoNumero || orcamentoElements.numero?.value || "";
    openVendaFromOrcamento(numero);
  });
  orcamentoElements.busca?.addEventListener("input", renderOrcamentosList);
  orcamentoElements.filtroData?.addEventListener("change", renderOrcamentosList);
  orcamentoElements.addItemPeca?.addEventListener("click", () => addOrcamentoRow("peca"));
  orcamentoElements.addItemServico?.addEventListener("click", () =>
    addOrcamentoRow("servico")
  );
  orcamentoElements.clienteModo?.addEventListener("change", toggleOrcamentoClienteFields);
  orcamentoElements.clienteId?.addEventListener("change", updateOrcamentoClienteLinkState);
  orcamentoElements.toggleClienteDados?.addEventListener(
    "click",
    openOrcamentoClienteConferencia
  );
  orcamentoElements.btnSalvar?.addEventListener("click", saveOrcamento);
  orcamentoElements.btnImprimir?.addEventListener("click", printOrcamento);
  orcamentoElements.observacoes?.addEventListener("input", (event) => {
    autoGrowTextarea(event.target);
  });
  orcamentoBound = true;
};

const loadOrcamentoPanel = async () => {
  if (orcamentoLoaded) {
    return;
  }
  try {
    const response = await fetch("orcamento.html");
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a tela de orçamento.");
    }
    const html = await response.text();
    if (elements.orcamentoConteudo) {
      elements.orcamentoConteudo.innerHTML = html;
      cacheOrcamentoElements();
      populateOrcamentoClientes();
      bindOrcamentoEvents();
      resetOrcamentoForm();
    }
    orcamentoLoaded = true;
  } catch (error) {
    if (elements.orcamentoConteudo) {
      elements.orcamentoConteudo.innerHTML =
        '<p style="color:#991b1b;">Erro ao carregar orçamento. Recarregue a pagina.</p>';
    }
  }
};

const openOrcamentoPanel = async () => {
  await loadOrcamentoPanel();
  populateOrcamentoClientes();
  showOrcamentoList();
  if (pendingOrcamentoFromOs) {
    resetOrcamentoForm();
    applyOrcamentoFromOsData(pendingOrcamentoFromOs);
    pendingOrcamentoFromOs = null;
  }
  elements.orcamentoOverlay?.classList.add("show");
};

const closeOrcamentoPanel = () => {
  elements.orcamentoOverlay?.classList.remove("show");
};

const applyOrcamentoFromOsData = (chamado) => {
  if (!orcamentoElements.numero || !orcamentoElements.data) {
    return;
  }
  orcamentoElements.numero.value = generateBudgetNumber();
  orcamentoElements.data.value = chamado.servico.dataEntrada || orcamentoElements.data.value;
  if (orcamentoElements.clienteModo) {
    orcamentoElements.clienteModo.value = "cadastrado";
  }
  if (orcamentoElements.clienteId) {
    orcamentoElements.clienteId.value = chamado.clienteId || "";
  }
  updateOrcamentoReferenciaOs(chamado.id || "");
  if (orcamentoElements.observacoes) {
    orcamentoElements.observacoes.value = "";
    autoGrowTextarea(orcamentoElements.observacoes);
  }
  toggleOrcamentoClienteFields();

  if (orcamentoElements.tabelaPecasBody) {
    orcamentoElements.tabelaPecasBody.innerHTML = "";
  }
  if (orcamentoElements.tabelaServicosBody) {
    orcamentoElements.tabelaServicosBody.innerHTML = "";
  }

  const pecas = chamado.servico.pecas || [];
  const servicos = chamado.servico.servicos || [];

  pecas.forEach((item) => addOrcamentoRow("peca", item));
  servicos.forEach((item) => addOrcamentoRow("servico", item));
  updateOrcamentoTotals();
  showOrcamentoEditor();
};

const openOrcamentoFromOs = async (chamadoId) => {
  const chamado = getChamadoById(chamadoId);
  if (!chamado) {
    return;
  }
  pendingOrcamentoFromOs = chamado;
  closeChamadosPanel();
  await openOrcamentoPanel();
};

const cacheVendasElements = () => {
  vendasElements.listaSection = document.getElementById("vendasListaSection");
  vendasElements.editorSection = document.getElementById("vendasEditorSection");
  vendasElements.busca = document.getElementById("vendasBusca");
  vendasElements.filtroData = document.getElementById("vendasFiltroData");
  vendasElements.filtroOrigem = document.getElementById("vendasFiltroOrigem");
  vendasElements.filtroStatus = document.getElementById("vendasFiltroStatus");
  vendasElements.lista = document.getElementById("vendasLista");
  vendasElements.vazio = document.getElementById("vendasVazio");
  vendasElements.novo = document.getElementById("vendasNovo");
  vendasElements.voltar = document.getElementById("vendasVoltar");
  vendasElements.salvar = document.getElementById("vendasSalvar");
  vendasElements.numero = document.getElementById("vendaNumero");
  vendasElements.data = document.getElementById("vendaData");
  vendasElements.origemTipo = document.getElementById("vendaOrigemTipo");
  vendasElements.origemId = document.getElementById("vendaOrigemId");
  vendasElements.clienteModo = document.getElementById("vendaClienteModo");
  vendasElements.clienteId = document.getElementById("vendaClienteId");
  vendasElements.clienteNome = document.getElementById("vendaClienteNome");
  vendasElements.descricao = document.getElementById("vendaDescricao");
  vendasElements.tabelaItensBody = document.querySelector("#vendaTabelaItens tbody");
  vendasElements.tabelaServicosBody = document.querySelector("#vendaTabelaServicos tbody");
  vendasElements.addItem = document.getElementById("vendaAddItem");
  vendasElements.addServico = document.getElementById("vendaAddServico");
  vendasElements.valorTotal = document.getElementById("vendaValorTotal");
  vendasElements.descontoValor = document.getElementById("vendaDescontoValor");
  vendasElements.outrosValores = document.getElementById("vendaOutrosValores");
  vendasElements.valorFinal = document.getElementById("vendaValorFinal");
  vendasElements.valorRecebido = document.getElementById("vendaValorRecebido");
  vendasElements.metodoPagamento = document.getElementById("vendaMetodoPagamento");
  vendasElements.status = document.getElementById("vendaStatusRecebimento");
};

const cacheFinanceiroElements = () => {
  financeiroElements.busca = document.getElementById("financeiroBusca");
  financeiroElements.data = document.getElementById("financeiroData");
  financeiroElements.origem = document.getElementById("financeiroOrigem");
  financeiroElements.status = document.getElementById("financeiroStatus");
  financeiroElements.totalVendido = document.getElementById("finTotalVendido");
  financeiroElements.totalRecebido = document.getElementById("finTotalRecebido");
  financeiroElements.totalAberto = document.getElementById("finTotalAberto");
  financeiroElements.lista = document.getElementById("financeiroLista");
  financeiroElements.vazio = document.getElementById("financeiroVazio");
};

const generateVendaNumero = () => {
  let code = "";
  do {
    code = Math.floor(10000 + Math.random() * 90000).toString();
  } while (state.vendas.some((item) => item.numero === code));
  return code;
};

const getClienteNomeByVenda = (venda) => {
  if (venda.clienteModo === "manual") {
    return venda.clienteNomeManual || "Cliente avulso";
  }
  const cliente = getClienteById(venda.clienteId);
  if (!cliente) {
    return "Cliente não encontrado";
  }
  return cliente.tipoCadastro === "PF"
    ? cliente.cliente.nomeCompleto
    : cliente.cliente.razaoSocial;
};

const toggleVendaClienteFields = () => {
  const manual = vendasElements.clienteModo?.value === "manual";
  if (vendasElements.clienteId) {
    vendasElements.clienteId.style.display = manual ? "none" : "block";
  }
  if (vendasElements.clienteNome) {
    vendasElements.clienteNome.style.display = manual ? "block" : "none";
  }
};

const parseVendaDesconto = (rawValue, bruto) => {
  const raw = (rawValue || "").toString().trim();
  if (!raw) {
    return { tipo: "Nenhum", valor: 0, percentual: 0 };
  }
  if (raw.includes("%")) {
    const numeric = raw.replace(/[^0-9,.-]/g, "");
    const percentual = Math.min(100, Math.max(0, parseMoney(numeric)));
    return {
      tipo: "Percentual",
      valor: bruto * (percentual / 100),
      percentual,
    };
  }
  return {
    tipo: "Valor",
    valor: parseMoney(raw),
    percentual: 0,
  };
};

const populateVendasClientes = () => {
  if (!vendasElements.clienteId) {
    return;
  }
  vendasElements.clienteId.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione um cliente";
  vendasElements.clienteId.appendChild(placeholder);
  state.clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent =
      cliente.tipoCadastro === "PF"
        ? `${cliente.cliente.nomeCompleto} · CPF ${cliente.cliente.cpf}`
        : `${cliente.cliente.razaoSocial} · CNPJ ${cliente.cliente.cnpj}`;
    vendasElements.clienteId.appendChild(option);
  });
};

const addVendaItemRow = (type = "peca", initialData = {}) => {
  const body = type === "servico" ? vendasElements.tabelaServicosBody : vendasElements.tabelaItensBody;
  if (!body) {
    return;
  }
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="orcamento-table__number"></td>
    <td><input type="text" class="venda-desc" placeholder="Descrição" value="${initialData.descricao || ""}" /></td>
    <td><input type="text" class="venda-un" placeholder="UN" value="${initialData.un || "UN"}" /></td>
    <td><input type="number" class="venda-qtde" min="0" step="0.01" value="${initialData.qtde ?? "1"}" /></td>
    <td><input type="text" class="venda-preco" placeholder="R$ 0,00" value="" /></td>
    <td class="orcamento-table__total">R$ 0,00</td>
    <td><button type="button" class="btn btn--ghost venda-remove">Remover</button></td>
  `;
  body.appendChild(row);
  row.querySelector(".venda-remove")?.addEventListener("click", () => {
    row.remove();
    recalcVendaItens();
  });
  [".venda-desc", ".venda-un", ".venda-qtde", ".venda-preco"].forEach((selector) => {
    row.querySelector(selector)?.addEventListener("input", recalcVendaItens);
  });
  const precoInput = row.querySelector(".venda-preco");
  if (precoInput) {
    if (initialData.precoUn) {
      const initValue = Number(initialData.precoUn);
      if (!Number.isNaN(initValue)) {
        precoInput.dataset.valor = initValue.toFixed(2);
        precoInput.value = formatCurrency(initValue.toFixed(2));
      }
    }
    precoInput.addEventListener("input", (event) => {
      event.target.dataset.valor = parseMoney(event.target.value || "0").toFixed(2);
      recalcVendaItens();
    });
    precoInput.addEventListener("blur", (event) => {
      const value = Number(event.target.dataset.valor || parseMoney(event.target.value || "0"));
      event.target.dataset.valor = value.toFixed(2);
      event.target.value = value ? formatCurrency(value.toFixed(2)) : "";
      recalcVendaItens();
    });
    precoInput.addEventListener("focus", (event) => {
      if (event.target.dataset.valor) {
        event.target.value = event.target.dataset.valor.replace(".", ",");
      }
    });
  }
  recalcVendaItens();
};

const getVendaItensByType = (type = "peca") => {
  const body = type === "servico" ? vendasElements.tabelaServicosBody : vendasElements.tabelaItensBody;
  if (!body) {
    return [];
  }
  return Array.from(body.querySelectorAll("tr"))
    .map((row, index) => {
      const descricao = row.querySelector(".venda-desc")?.value.trim() || "";
      const un = row.querySelector(".venda-un")?.value.trim() || "";
      const qtde = parseMoney(row.querySelector(".venda-qtde")?.value || "0");
      const precoInput = row.querySelector(".venda-preco");
      const precoUn = Number(precoInput?.dataset.valor || parseMoney(precoInput?.value || "0"));
      return {
        numero: index + 1,
        tipo,
        descricao,
        un,
        qtde,
        precoUn,
        total: qtde * precoUn,
      };
    })
    .filter((item) => item.descricao);
};

const getVendaItens = () => [
  ...getVendaItensByType("peca"),
  ...getVendaItensByType("servico"),
];

const recalcVendaResumo = () => {
  const bruto = getRowsTotal(getVendaItens());
  const descontoInfo = parseVendaDesconto(vendasElements.descontoValor?.value || "", bruto);
  const outros = Number(
    vendasElements.outrosValores?.dataset.valor ||
      parseMoney(vendasElements.outrosValores?.value || "0")
  );
  const totalFinal = Math.max(0, bruto - descontoInfo.valor + outros);

  if (vendasElements.valorTotal) {
    vendasElements.valorTotal.dataset.valor = bruto.toFixed(2);
    vendasElements.valorTotal.value = formatCurrency(bruto.toFixed(2));
  }
  if (vendasElements.descontoValor) {
    vendasElements.descontoValor.dataset.tipo = descontoInfo.tipo;
    vendasElements.descontoValor.dataset.valor = descontoInfo.valor.toFixed(2);
    vendasElements.descontoValor.dataset.percentual = descontoInfo.percentual.toFixed(2);
  }
  if (vendasElements.valorFinal) {
    vendasElements.valorFinal.dataset.valor = totalFinal.toFixed(2);
    vendasElements.valorFinal.value = formatCurrency(totalFinal.toFixed(2));
  }
};

const recalcVendaItens = () => {
  const recalcBody = (body) => {
    if (!body) {
      return;
    }
    Array.from(body.querySelectorAll("tr")).forEach((row, index) => {
      const qtde = parseMoney(row.querySelector(".venda-qtde")?.value || "0");
      const precoInput = row.querySelector(".venda-preco");
      const preco = Number(precoInput?.dataset.valor || parseMoney(precoInput?.value || "0"));
      const total = qtde * preco;
      const numberCell = row.querySelector(".orcamento-table__number");
      if (numberCell) {
        numberCell.textContent = (index + 1).toString();
      }
      const totalCell = row.querySelector(".orcamento-table__total");
      if (totalCell) {
        totalCell.textContent = formatCurrency(total.toFixed(2));
      }
    });
  };
  recalcBody(vendasElements.tabelaItensBody);
  recalcBody(vendasElements.tabelaServicosBody);
  recalcVendaResumo();
};

const showVendasList = () => {
  if (vendasElements.listaSection) {
    vendasElements.listaSection.style.display = "block";
  }
  if (vendasElements.editorSection) {
    vendasElements.editorSection.style.display = "none";
  }
  renderVendasList();
};

const showVendasEditor = () => {
  if (vendasElements.listaSection) {
    vendasElements.listaSection.style.display = "none";
  }
  if (vendasElements.editorSection) {
    vendasElements.editorSection.style.display = "block";
  }
};

const resetVendaForm = () => {
  editingVendaNumero = null;
  if (!vendasElements.numero || !vendasElements.data) {
    return;
  }
  vendasElements.numero.value = generateVendaNumero();
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2, "0");
  const dd = String(hoje.getDate()).padStart(2, "0");
  vendasElements.data.value = `${yyyy}-${mm}-${dd}`;
  vendasElements.origemTipo.value = "Direta";
  vendasElements.origemId.value = "";
  vendasElements.clienteModo.value = "cadastrado";
  vendasElements.clienteId.value = "";
  vendasElements.clienteNome.value = "";
  vendasElements.descricao.value = "";
  if (vendasElements.tabelaItensBody) {
    vendasElements.tabelaItensBody.innerHTML = "";
  }
  if (vendasElements.tabelaServicosBody) {
    vendasElements.tabelaServicosBody.innerHTML = "";
  }
  vendasElements.valorTotal.value = "";
  vendasElements.valorTotal.dataset.valor = "";
  vendasElements.descontoValor.value = "";
  vendasElements.descontoValor.dataset.valor = "";
  vendasElements.descontoValor.dataset.tipo = "Nenhum";
  vendasElements.descontoValor.dataset.percentual = "0";
  vendasElements.outrosValores.value = "";
  vendasElements.outrosValores.dataset.valor = "";
  vendasElements.valorFinal.value = "";
  vendasElements.valorFinal.dataset.valor = "";
  vendasElements.valorRecebido.value = "";
  vendasElements.valorRecebido.dataset.valor = "";
  vendasElements.metodoPagamento.value = "Nao informado";
  vendasElements.status.value = "Pendente";
  toggleVendaClienteFields();
  recalcVendaResumo();
};

const getVendaStatusByValues = (valorTotal, valorRecebido, currentStatus = "") => {
  if (currentStatus === "Recebido" || valorRecebido >= valorTotal) {
    return "Recebido";
  }
  if (valorRecebido > 0) {
    return "Parcial";
  }
  return "Pendente";
};

const saveVenda = () => {
  if (!vendasElements.numero) {
    return;
  }
  if (vendasElements.clienteModo.value === "cadastrado" && !vendasElements.clienteId.value) {
    alert("Selecione um cliente para a venda.");
    return;
  }
  if (vendasElements.clienteModo.value === "manual" && !vendasElements.clienteNome.value.trim()) {
    alert("Informe o nome do cliente para a venda.");
    return;
  }
  const itens = getVendaItens();
  const pecas = getVendaItensByType("peca");
  const servicos = getVendaItensByType("servico");
  const valorBruto = Number(vendasElements.valorTotal.dataset.valor || "0");
  const valorTotal = Number(vendasElements.valorFinal.dataset.valor || "0");
  const descontoInfo = parseVendaDesconto(vendasElements.descontoValor.value || "", valorBruto);
  if (!itens.length) {
    alert("Adicione pelo menos uma peça ou serviço na venda.");
    return;
  }
  const itensInvalidos = itens.some(
    (item) => !item.descricao || !item.un || item.qtde <= 0 || item.precoUn <= 0
  );
  if (itensInvalidos || valorBruto <= 0 || valorTotal <= 0) {
    alert("Preencha Descrição, UN, Qtde e Preço un dos itens da venda.");
    return;
  }
  const valorRecebido = Number(vendasElements.valorRecebido.dataset.valor || "0");
  const statusAuto = getVendaStatusByValues(
    valorTotal,
    valorRecebido,
    vendasElements.status.value
  );
  const venda = {
    numero: editingVendaNumero || vendasElements.numero.value,
    dataVenda: vendasElements.data.value,
    origemTipo: vendasElements.origemTipo.value,
    origemId: vendasElements.origemId.value.trim(),
    clienteModo: vendasElements.clienteModo.value,
    clienteId: vendasElements.clienteId.value,
    clienteNomeManual: vendasElements.clienteNome.value.trim(),
    descricao: vendasElements.descricao.value.trim(),
    itens,
    pecas,
    servicos,
    valorBruto: Number(valorBruto.toFixed(2)),
    descontoTipo: descontoInfo.tipo,
    descontoValor: Number(descontoInfo.valor.toFixed(2)),
    descontoPercentual: Number(descontoInfo.percentual.toFixed(2)),
    descontoEntrada: vendasElements.descontoValor.value.trim(),
    outrosValores: Number(
      Number(vendasElements.outrosValores.dataset.valor || "0").toFixed(2)
    ),
    valorTotal: Number(valorTotal.toFixed(2)),
    valorRecebido: Number(valorRecebido.toFixed(2)),
    metodoPagamento: vendasElements.metodoPagamento.value,
    statusRecebimento: statusAuto,
    createdAt: editingVendaNumero
      ? state.vendas.find((item) => item.numero === editingVendaNumero)?.createdAt ||
        new Date().toISOString()
      : new Date().toISOString(),
  };
  state.vendas = state.vendas.filter((item) => item.numero !== venda.numero);
  state.vendas.unshift(venda);
  saveVendas();
  renderSummary();
  if (venda.origemTipo === "OS") {
    const chamado = state.chamados.find((item) => item.id === venda.origemId);
    if (chamado) {
      chamado.servico.statusServico = "Concluida";
      saveChamados();
      render();
    }
  }
  if (venda.origemTipo === "Orcamento") {
    const orcamento = state.orcamentos.find((item) => item.numero === venda.origemId);
    if (orcamento) {
      orcamento.statusVenda = "Vendido";
      saveOrcamentos();
      renderSummary();
      renderOrcamentosList();
    }
  }
  alert(`Venda #${venda.numero} salva.`);
  showVendasList();
  renderFinanceiroList();
};

const loadVendaIntoEditor = (venda) => {
  editingVendaNumero = venda.numero;
  vendasElements.numero.value = venda.numero;
  vendasElements.data.value = venda.dataVenda || "";
  vendasElements.origemTipo.value = venda.origemTipo || "Direta";
  vendasElements.origemId.value = venda.origemId || "";
  vendasElements.clienteModo.value = venda.clienteModo || "cadastrado";
  vendasElements.clienteId.value = venda.clienteId || "";
  vendasElements.clienteNome.value = venda.clienteNomeManual || "";
  vendasElements.descricao.value = venda.descricao || "";
  if (vendasElements.tabelaItensBody) {
    vendasElements.tabelaItensBody.innerHTML = "";
  }
  if (vendasElements.tabelaServicosBody) {
    vendasElements.tabelaServicosBody.innerHTML = "";
  }
  (venda.pecas || venda.itens || []).forEach((item) => addVendaItemRow("peca", item));
  (venda.servicos || []).forEach((item) => addVendaItemRow("servico", item));
  if (venda.descontoEntrada) {
    vendasElements.descontoValor.value = venda.descontoEntrada;
  } else if (venda.descontoTipo === "Percentual") {
    vendasElements.descontoValor.value = `${Number(venda.descontoPercentual || 0)
      .toString()
      .replace(".", ",")}%`;
  } else {
    vendasElements.descontoValor.value = venda.descontoValor
      ? formatCurrency(Number(venda.descontoValor).toFixed(2))
      : "";
  }
  vendasElements.descontoValor.dataset.valor = String(venda.descontoValor || 0);
  vendasElements.descontoValor.dataset.percentual = String(venda.descontoPercentual || 0);
  vendasElements.descontoValor.dataset.tipo = venda.descontoTipo || "Nenhum";
  vendasElements.outrosValores.dataset.valor = String(venda.outrosValores || 0);
  vendasElements.outrosValores.value = venda.outrosValores
    ? formatCurrency(Number(venda.outrosValores).toFixed(2))
    : "";
  vendasElements.valorTotal.dataset.valor = String(venda.valorTotal || 0);
  vendasElements.valorTotal.value = venda.valorTotal
    ? formatCurrency(venda.valorTotal.toFixed(2))
    : "";
  vendasElements.valorFinal.dataset.valor = String(venda.valorTotal || 0);
  vendasElements.valorFinal.value = venda.valorTotal
    ? formatCurrency(venda.valorTotal.toFixed(2))
    : "";
  vendasElements.valorRecebido.dataset.valor = String(venda.valorRecebido || 0);
  vendasElements.valorRecebido.value = venda.valorRecebido
    ? formatCurrency(venda.valorRecebido.toFixed(2))
    : "";
  vendasElements.metodoPagamento.value = venda.metodoPagamento || "Nao informado";
  vendasElements.status.value = venda.statusRecebimento || "Pendente";
  recalcVendaItens();
  toggleVendaClienteFields();
  showVendasEditor();
};

const createVendaCard = (venda) => {
  const card = document.createElement("article");
  card.className = "card";
  const aberto = Math.max(0, (venda.valorTotal || 0) - (venda.valorRecebido || 0));
  card.innerHTML = `
    <div class="card__header">
      <div><h3 class="card__title">Venda #${venda.numero}</h3></div>
      <div class="card__tags">
        <span class="tag tag--media">${venda.origemTipo || "Direta"}</span>
        <span class="status status--Aberto">${venda.statusRecebimento || "Pendente"}</span>
      </div>
    </div>
    <div class="card__meta">
      <span><strong>Cliente:</strong> ${getClienteNomeByVenda(venda)}</span>
      <span><strong>Data:</strong> ${formatDate(venda.dataVenda)}</span>
      <span><strong>Peças:</strong> ${(venda.pecas || venda.itens || []).length}</span>
      <span><strong>Serviços:</strong> ${(venda.servicos || []).length}</span>
      <span><strong>Total:</strong> ${formatCurrency((venda.valorTotal || 0).toFixed(2))}</span>
      <span><strong>Em aberto:</strong> ${formatCurrency(aberto.toFixed(2))}</span>
      <span><strong>Origem:</strong> ${
        venda.origemTipo === "Direta"
          ? "Venda direta"
          : `${venda.origemTipo} #${venda.origemId || "-"}`
      }</span>
    </div>
    <div class="card__actions card__actions--inline">
      <button type="button" class="btn btn--ghost" data-edit-venda="${venda.numero}">Editar</button>
      <button type="button" class="btn btn--ghost" data-delete-venda="${venda.numero}">Excluir</button>
    </div>
  `;
  card.querySelector("[data-edit-venda]")?.addEventListener("click", () => {
    loadVendaIntoEditor(venda);
  });
  card.querySelector("[data-delete-venda]")?.addEventListener("click", () => {
    const ok = window.confirm(`Excluir venda #${venda.numero}?`);
    if (!ok) {
      return;
    }
    state.vendas = state.vendas.filter((item) => item.numero !== venda.numero);
    saveVendas();
    renderSummary();
    renderVendasList();
    renderFinanceiroList();
  });
  return card;
};

const getFilteredVendas = () => {
  const busca = normalize(vendasElements.busca?.value || "");
  const data = vendasElements.filtroData?.value || "";
  const origem = vendasElements.filtroOrigem?.value || "";
  const status = vendasElements.filtroStatus?.value || "";
  return state.vendas.filter((item) => {
    if (data && item.dataVenda !== data) {
      return false;
    }
    if (origem && item.origemTipo !== origem) {
      return false;
    }
    if (status && item.statusRecebimento !== status) {
      return false;
    }
    if (!busca) {
      return true;
    }
    const fields = [
      item.numero,
      getClienteNomeByVenda(item),
      item.origemTipo,
      item.origemId,
    ];
    return fields.some((field) => normalize(field || "").includes(busca));
  });
};

const renderVendasList = () => {
  if (!vendasElements.lista || !vendasElements.vazio) {
    return;
  }
  vendasElements.lista.innerHTML = "";
  const vendas = getFilteredVendas().sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
  vendas.forEach((item) => vendasElements.lista.appendChild(createVendaCard(item)));
  vendasElements.vazio.style.display = vendas.length ? "none" : "block";
};

const bindVendasEvents = () => {
  if (vendasBound) {
    return;
  }
  vendasElements.novo?.addEventListener("click", () => {
    resetVendaForm();
    showVendasEditor();
  });
  vendasElements.voltar?.addEventListener("click", showVendasList);
  vendasElements.busca?.addEventListener("input", renderVendasList);
  vendasElements.filtroData?.addEventListener("change", renderVendasList);
  vendasElements.filtroOrigem?.addEventListener("change", renderVendasList);
  vendasElements.filtroStatus?.addEventListener("change", renderVendasList);
  vendasElements.clienteModo?.addEventListener("change", toggleVendaClienteFields);
  vendasElements.addItem?.addEventListener("click", () => addVendaItemRow("peca"));
  vendasElements.addServico?.addEventListener("click", () => addVendaItemRow("servico"));
  vendasElements.descontoValor?.addEventListener("input", (event) => {
    if ((event.target.value || "").includes("%")) {
      recalcVendaResumo();
      return;
    }
    handleCurrencyInput(event);
    recalcVendaResumo();
  });
  vendasElements.descontoValor?.addEventListener("blur", (event) => {
    const desconto = parseVendaDesconto(event.target.value || "", Number(vendasElements.valorTotal?.dataset.valor || "0"));
    if (desconto.tipo === "Percentual") {
      event.target.value = `${desconto.percentual.toString().replace(".", ",")}%`;
    } else {
      event.target.value = desconto.valor ? formatCurrency(desconto.valor.toFixed(2)) : "";
    }
    recalcVendaResumo();
  });
  vendasElements.outrosValores?.addEventListener("input", (event) => {
    handleCurrencyInput(event);
    recalcVendaResumo();
  });
  vendasElements.valorRecebido?.addEventListener("input", handleCurrencyInput);
  vendasElements.salvar?.addEventListener("click", saveVenda);
  vendasBound = true;
};

const loadVendasPanel = async () => {
  if (vendasLoaded) {
    return;
  }
  try {
    const response = await fetch("vendas.html");
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a tela de vendas.");
    }
    const html = await response.text();
    if (elements.vendasConteudo) {
      elements.vendasConteudo.innerHTML = html;
      cacheVendasElements();
      populateVendasClientes();
      bindVendasEvents();
      resetVendaForm();
      showVendasList();
    }
    vendasLoaded = true;
  } catch (error) {
    if (elements.vendasConteudo) {
      elements.vendasConteudo.innerHTML =
        '<p style="color:#991b1b;">Erro ao carregar vendas. Recarregue a pagina.</p>';
    }
  }
};

const openVendasPanel = async () => {
  await loadVendasPanel();
  populateVendasClientes();
  showVendasList();
  if (pendingVendaPrefill) {
    resetVendaForm();
    const prefill = pendingVendaPrefill;
    pendingVendaPrefill = null;
    vendasElements.origemTipo.value = prefill.origemTipo;
    vendasElements.origemId.value = prefill.origemId;
    vendasElements.clienteModo.value = "cadastrado";
    vendasElements.clienteId.value = prefill.clienteId || "";
    vendasElements.descricao.value = prefill.descricao || "";
    if (vendasElements.tabelaItensBody) {
      vendasElements.tabelaItensBody.innerHTML = "";
    }
    if (vendasElements.tabelaServicosBody) {
      vendasElements.tabelaServicosBody.innerHTML = "";
    }
    (prefill.pecas || prefill.itens || []).forEach((item) => addVendaItemRow("peca", item));
    (prefill.servicos || []).forEach((item) => addVendaItemRow("servico", item));
    recalcVendaItens();
    toggleVendaClienteFields();
    showVendasEditor();
  }
  elements.vendasOverlay?.classList.add("show");
};

const closeVendasPanel = () => {
  elements.vendasOverlay?.classList.remove("show");
};

const openVendaFromOs = async (chamadoId) => {
  const chamado = getChamadoById(chamadoId);
  if (!chamado) {
    return;
  }
  const pecas = chamado.servico.pecas || [];
  const servicos = chamado.servico.servicos || [];
  pendingVendaPrefill = {
    origemTipo: "OS",
    origemId: chamado.id,
    clienteId: chamado.clienteId,
    descricao: `Venda gerada da O.S. #${chamado.id}`,
    pecas,
    servicos,
  };
  chamado.servico.statusServico = "Concluida";
  saveChamados();
  render();
  closeChamadosPanel();
  setPagamentoModalOpen(false);
  await openVendasPanel();
};

const openVendaFromOrcamento = async (orcamentoNumero) => {
  const orcamento = state.orcamentos.find((item) => item.numero === orcamentoNumero);
  if (!orcamento) {
    alert("Salve o orçamento antes de gerar a venda.");
    return;
  }
  pendingVendaPrefill = {
    origemTipo: "Orcamento",
    origemId: orcamento.numero,
    clienteId: orcamento.clienteId,
    descricao: `Venda gerada do Orçamento #${orcamento.numero}`,
    pecas: orcamento.pecas || [],
    servicos: orcamento.servicos || [],
  };
  orcamento.statusVenda = "Vendido";
  saveOrcamentos();
  renderSummary();
  renderOrcamentosList();
  closeOrcamentoPanel();
  await openVendasPanel();
};

const getFilteredFinanceiroVendas = () => {
  const busca = normalize(financeiroElements.busca?.value || "");
  const data = financeiroElements.data?.value || "";
  const origem = financeiroElements.origem?.value || "";
  const status = financeiroElements.status?.value || "";
  return state.vendas.filter((item) => {
    if (data && item.dataVenda !== data) {
      return false;
    }
    if (origem && item.origemTipo !== origem) {
      return false;
    }
    if (status && item.statusRecebimento !== status) {
      return false;
    }
    if (!busca) {
      return true;
    }
    const fields = [item.numero, getClienteNomeByVenda(item), item.origemTipo, item.origemId];
    return fields.some((field) => normalize(field || "").includes(busca));
  });
};

const registerRecebimento = (vendaNumero, valorAdicionar) => {
  const venda = state.vendas.find((item) => item.numero === vendaNumero);
  if (!venda) {
    return;
  }
  const novoRecebido = Math.min(
    venda.valorTotal || 0,
    (venda.valorRecebido || 0) + Number(valorAdicionar || 0)
  );
  venda.valorRecebido = Number(novoRecebido.toFixed(2));
  venda.statusRecebimento = getVendaStatusByValues(venda.valorTotal, venda.valorRecebido);
  saveVendas();
  renderSummary();
  renderFinanceiroList();
  renderVendasList();
};

const renderFinanceiroList = () => {
  if (!financeiroElements.lista || !financeiroElements.vazio) {
    return;
  }
  const vendas = getFilteredFinanceiroVendas();
  const totalVendido = vendas.reduce((acc, item) => acc + Number(item.valorTotal || 0), 0);
  const totalRecebido = vendas.reduce((acc, item) => acc + Number(item.valorRecebido || 0), 0);
  const totalAberto = totalVendido - totalRecebido;
  if (financeiroElements.totalVendido) {
    financeiroElements.totalVendido.textContent = formatCurrency(totalVendido.toFixed(2));
  }
  if (financeiroElements.totalRecebido) {
    financeiroElements.totalRecebido.textContent = formatCurrency(totalRecebido.toFixed(2));
  }
  if (financeiroElements.totalAberto) {
    financeiroElements.totalAberto.textContent = formatCurrency(totalAberto.toFixed(2));
  }

  financeiroElements.lista.innerHTML = "";
  vendas.forEach((venda) => {
    const card = document.createElement("article");
    card.className = "card";
    const emAberto = Math.max(0, (venda.valorTotal || 0) - (venda.valorRecebido || 0));
    card.innerHTML = `
      <div class="card__header">
        <div><h3 class="card__title">Venda #${venda.numero}</h3></div>
        <div class="card__tags">
          <span class="tag tag--media">${venda.origemTipo || "Direta"}</span>
          <span class="status status--Aberto">${venda.statusRecebimento || "Pendente"}</span>
        </div>
      </div>
      <div class="card__meta">
        <span><strong>Cliente:</strong> ${getClienteNomeByVenda(venda)}</span>
        <span><strong>Data:</strong> ${formatDate(venda.dataVenda)}</span>
        <span><strong>Vendido:</strong> ${formatCurrency((venda.valorTotal || 0).toFixed(2))}</span>
        <span><strong>Recebido:</strong> ${formatCurrency((venda.valorRecebido || 0).toFixed(2))}</span>
        <span><strong>Em aberto:</strong> ${formatCurrency(emAberto.toFixed(2))}</span>
      </div>
      <div class="card__actions">
        <input type="text" data-recebimento-input="${venda.numero}" placeholder="Valor recebido" />
        <button type="button" class="btn btn--ghost" data-add-recebimento="${venda.numero}">Adicionar recebimento</button>
        <button type="button" class="btn btn--ghost" data-quitar="${venda.numero}">Marcar recebido</button>
      </div>
    `;
    const input = card.querySelector(`[data-recebimento-input="${venda.numero}"]`);
    input?.addEventListener("input", handleCurrencyInput);
    card
      .querySelector(`[data-add-recebimento="${venda.numero}"]`)
      ?.addEventListener("click", () => {
        const value = Number(input?.dataset.valor || "0");
        if (value <= 0) {
          alert("Informe um valor de recebimento.");
          return;
        }
        registerRecebimento(venda.numero, value);
      });
    card.querySelector(`[data-quitar="${venda.numero}"]`)?.addEventListener("click", () => {
      const falta = Math.max(0, (venda.valorTotal || 0) - (venda.valorRecebido || 0));
      registerRecebimento(venda.numero, falta);
    });
    financeiroElements.lista.appendChild(card);
  });
  financeiroElements.vazio.style.display = vendas.length ? "none" : "block";
};

const bindFinanceiroEvents = () => {
  if (financeiroBound) {
    return;
  }
  financeiroElements.busca?.addEventListener("input", renderFinanceiroList);
  financeiroElements.data?.addEventListener("change", renderFinanceiroList);
  financeiroElements.origem?.addEventListener("change", renderFinanceiroList);
  financeiroElements.status?.addEventListener("change", renderFinanceiroList);
  financeiroBound = true;
};

const loadFinanceiroPanel = async () => {
  if (financeiroLoaded) {
    return;
  }
  try {
    const response = await fetch("financeiro.html");
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a tela financeira.");
    }
    const html = await response.text();
    if (elements.financeiroConteudo) {
      elements.financeiroConteudo.innerHTML = html;
      cacheFinanceiroElements();
      bindFinanceiroEvents();
      renderFinanceiroList();
    }
    financeiroLoaded = true;
  } catch (error) {
    if (elements.financeiroConteudo) {
      elements.financeiroConteudo.innerHTML =
        '<p style="color:#991b1b;">Erro ao carregar financeiro. Recarregue a pagina.</p>';
    }
  }
};

const openFinanceiroPanel = async () => {
  await loadFinanceiroPanel();
  renderFinanceiroList();
  elements.financeiroOverlay?.classList.add("show");
};

const closeFinanceiroPanel = () => {
  elements.financeiroOverlay?.classList.remove("show");
};

const loadClientes = () => {
  const raw = localStorage.getItem(storageClientKey);
  state.clientes = raw ? JSON.parse(raw) : [];
};

const loadOrcamentos = () => {
  const raw = localStorage.getItem(storageBudgetKey);
  state.orcamentos = raw ? JSON.parse(raw) : [];
};

const loadVendas = () => {
  const raw = localStorage.getItem(storageSalesKey);
  state.vendas = raw ? JSON.parse(raw) : [];
};

const saveChamados = () => {
  localStorage.setItem(storageKey, JSON.stringify(state.chamados));
};

const saveClientes = () => {
  localStorage.setItem(storageClientKey, JSON.stringify(state.clientes));
};

const saveOrcamentos = () => {
  localStorage.setItem(storageBudgetKey, JSON.stringify(state.orcamentos));
};

const saveVendas = () => {
  localStorage.setItem(storageSalesKey, JSON.stringify(state.vendas));
};

const loadEmpresa = () => {
  const raw = localStorage.getItem(storageCompanyKey);
  if (raw) {
    companyInfo = { ...companyInfo, ...JSON.parse(raw) };
  }
};

const saveEmpresa = () => {
  localStorage.setItem(storageCompanyKey, JSON.stringify(companyInfo));
};

const migrateChamados = () => {
  let changed = false;
  state.chamados.forEach((chamado) => {
    const normalized = normalizeChamado(chamado);
    if (normalized) {
      changed = true;
    }
    if (!/^\d{5}$/.test(chamado.id || "")) {
      chamado.id = generateId();
      changed = true;
    }
    if (chamado.clienteId) {
      return;
    }
    if (!chamado.cliente) {
      return;
    }
    const tipo = chamado.tipoCadastro || (chamado.cliente.cnpj ? "PJ" : "PF");
    const doc = tipo === "PF" ? chamado.cliente.cpf : chamado.cliente.cnpj;
    let cliente = state.clientes.find((item) => {
      const itemDoc =
        item.tipoCadastro === "PF" ? item.cliente.cpf : item.cliente.cnpj;
      return itemDoc === doc;
    });
    if (!cliente) {
      cliente = {
        id: generateId(),
        tipoCadastro: tipo,
        cliente: chamado.cliente,
        contato: chamado.contato,
        endereco: chamado.endereco,
        createdAt: new Date().toISOString(),
      };
      state.clientes.unshift(cliente);
      changed = true;
    }
    chamado.clienteId = cliente.id;
    changed = true;
  });
  if (changed) {
    saveClientes();
    saveChamados();
  }
};

const normalizeChamado = (chamado) => {
  let updated = false;

  if (!chamado.servico && chamado.Serviço) {
    chamado.servico = chamado.Serviço;
    delete chamado.Serviço;
    updated = true;
  }

  if (chamado.servico && chamado.servico.statusServiço) {
    chamado.servico.statusServico = chamado.servico.statusServiço;
    delete chamado.servico.statusServiço;
    updated = true;
  }

  if (chamado.financeiro) {
    if (chamado.financeiro.Aprovação && !chamado.financeiro.aprovacao) {
      chamado.financeiro.aprovacao = chamado.financeiro.Aprovação;
      delete chamado.financeiro.Aprovação;
      updated = true;
    }
    if (chamado.financeiro.MétodoPagamento && !chamado.financeiro.metodoPagamento) {
      chamado.financeiro.metodoPagamento = chamado.financeiro.MétodoPagamento;
      delete chamado.financeiro.MétodoPagamento;
      updated = true;
    }
    if (
      typeof chamado.financeiro.aprovado === "boolean" &&
      !chamado.financeiro.aprovacao
    ) {
      chamado.financeiro.aprovacao = chamado.financeiro.aprovado ? "Sim" : "Não";
      updated = true;
    }
    if (chamado.financeiro.condicaoPagamento && !chamado.financeiro.metodoPagamento) {
      chamado.financeiro.metodoPagamento = chamado.financeiro.condicaoPagamento;
      updated = true;
    }
  }

  return updated;
};

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/gi, "");

const formatCpf = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatCnpj = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

const formatCep = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};

const setModalOpen = (open) => {
  elements.modal.classList.toggle("show", open);
  document.body.style.overflow = open ? "hidden" : "";
};

const setClienteModalOpen = (open) => {
  elements.modalCliente.classList.toggle("show", open);
  document.body.style.overflow = open ? "hidden" : "";
};

const setPagamentoModalOpen = (open) => {
  elements.modalPagamento.classList.toggle("show", open);
  document.body.style.overflow = open ? "hidden" : "";
};

const setPagamentoActionsVisible = (visible) => {
  if (elements.printActions) {
    elements.printActions.style.display = visible ? "flex" : "none";
  }
};

const setEmpresaModalOpen = (open) => {
  elements.modalEmpresa.classList.toggle("show", open);
  document.body.style.overflow = open ? "hidden" : "";
};

const setCepHint = (message, type = "") => {
  if (!elements.cepHint) {
    return;
  }
  elements.cepHint.textContent = message;
  elements.cepHint.classList.remove("field__hint--loading", "field__hint--error");
  if (type === "loading") {
    elements.cepHint.classList.add("field__hint--loading");
  }
  if (type === "error") {
    elements.cepHint.classList.add("field__hint--error");
  }
};

const fetchEnderecoByCep = async (cep) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error("Falha ao consultar o CEP.");
  }
  const data = await response.json();
  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }
  return data;
};

const buildDocumentoHTML = (chamado, cliente, tipo) => {
  const titulo =
    tipo === "recibo"
      ? "Recibo de pagamento"
      : tipo === "pedido"
      ? "Pedido"
      : "Orcamento";
  const metodo = chamado.financeiro.metodoPagamento || "Não informado";
  const valor = chamado.financeiro.valor || "";
  const parcelas = chamado.financeiro.parcelas || "";

  return `
    <div class="doc-header">
      <div>
        <h3>${titulo}</h3>
        <div class="doc-meta">
          <span>${companyInfo.nome}</span>
          <span>${companyInfo.documento}</span>
          <span>${companyInfo.endereco}</span>
          <span>${companyInfo.telefone}</span>
        </div>
      </div>
      <img class="doc-logo" src="${companyInfo.logo || "logo.png"}" alt="Logo" />
    </div>

    <div class="doc-section">
      <strong>Cliente</strong>
      <span>${cliente ? (cliente.tipoCadastro === "PF" ? cliente.cliente.nomeCompleto : cliente.cliente.razaoSocial) : "Não informado"}</span>
      <span>${cliente ? (cliente.tipoCadastro === "PF" ? `CPF: ${cliente.cliente.cpf}` : `CNPJ: ${cliente.cliente.cnpj}`) : ""}</span>
      ${cliente && cliente.tipoCadastro === "PJ" ? `<span>Responsavel: ${cliente.cliente.contatoResponsavel}</span>` : ""}
      <span>Contato: ${cliente?.contato.email || ""} · ${cliente?.contato.telefone || ""}</span>
    </div>

    <div class="doc-section">
      <strong>Dados da O.S.</strong>
      <span>O.S.: #${chamado.id}</span>
      <span>Categoria: ${chamado.servico.categoria}</span>
      <span>Modelo/Marca: ${chamado.servico.modelo} · ${chamado.servico.marca}</span>
      <span>Data de entrada: ${formatDate(chamado.servico.dataEntrada)}</span>
      <span>Data de entrega: ${chamado.servico.dataEntrega ? formatDate(chamado.servico.dataEntrega) : "Não definida"}</span>
      <span>Local: ${chamado.servico.localExecucao}</span>
    </div>

    <div class="doc-section">
      <strong>Financeiro</strong>
      <span>Aprovação: ${chamado.financeiro.aprovacao || "Não informado"}</span>
      <span>Método: ${metodo}</span>
      <span>Valor: ${valor ? formatCurrency(valor) : "Não informado"}</span>
      ${parcelas ? `<span>Parcelas: ${parcelas}x</span>` : ""}
    </div>
    ${
      tipo === "pedido"
        ? `<div class="doc-section"><strong>Pedido</strong><span>Documento gerado para aprovação do serviço.</span></div>`
        : ""
    }
  `;
};

const buildClienteHTML = (cliente) => `
  <div class="doc-section">
    <strong>Cliente</strong>
    <span>${cliente.tipoCadastro === "PF" ? cliente.cliente.nomeCompleto : cliente.cliente.razaoSocial}</span>
    <span>${cliente.tipoCadastro === "PF" ? `CPF: ${cliente.cliente.cpf}` : `CNPJ: ${cliente.cliente.cnpj}`}</span>
    ${cliente.tipoCadastro === "PJ" ? `<span>Responsavel: ${cliente.cliente.contatoResponsavel}</span>` : ""}
  </div>

  <div class="doc-section">
    <strong>Contato</strong>
    <span>E-mail: ${cliente.contato.email || "Não informado"}</span>
    <span>Telefone: ${cliente.contato.telefone || "Não informado"}</span>
    <span>WhatsApp: ${cliente.contato.whatsapp || "Não informado"}</span>
  </div>

  <div class="doc-section">
    <strong>Endereço</strong>
    <span>${cliente.endereco.rua}, ${cliente.endereco.numero}${cliente.endereco.complemento ? ` - ${cliente.endereco.complemento}` : ""}</span>
    <span>${cliente.endereco.bairro} - ${cliente.endereco.cidade}/${cliente.endereco.uf}</span>
    <span>CEP: ${cliente.endereco.cep || "Não informado"}</span>
  </div>
`;

const updateFinanceiroFields = () => {
  const aprovado = chamadoFields.aprovacao?.value === "Sim";
  if (elements.metodoPagamentoField) {
    elements.metodoPagamentoField.style.display = aprovado ? "flex" : "none";
  }
  if (elements.valorPagamentoField) {
    elements.valorPagamentoField.style.display = aprovado ? "flex" : "none";
  }
  if (elements.parcelasPagamentoField) {
    const metodo = chamadoFields.metodoPagamento?.value || "";
    const precisaParcelas = ["Cartao", "Crediario", "Boleto"].includes(metodo);
    elements.parcelasPagamentoField.style.display =
      aprovado && precisaParcelas ? "flex" : "none";
  }
};

const syncLogoHeader = () => {
  const logoEl = elements.logoHeader;
  if (logoEl) {
    logoEl.src = companyInfo.logo || "logo.png";
  }
  if (elements.tituloHeader) {
    elements.tituloHeader.textContent = companyInfo.titulo || "Central de Suporte";
  }
  if (elements.subtituloHeader) {
    elements.subtituloHeader.textContent =
      companyInfo.subtitulo || "Gestão completa de chamados com cadastro PF/PJ.";
  }
};

const updateCadastroFields = () => {
  const tipo = clienteFields.tipoCadastro.value;
  const isPF = tipo === "PF";
  elements.camposPF.style.display = isPF ? "grid" : "none";
  elements.camposPJ.style.display = isPF ? "none" : "grid";

  requiredByType.PF.forEach((field) => {
    clienteFields[field].required = isPF;
  });
  requiredByType.PJ.forEach((field) => {
    clienteFields[field].required = !isPF;
  });
};

const setFormDisabled = (disabled) => {
  const skip = new Set(["statusServico"]);
  Object.entries(chamadoFields).forEach(([key, input]) => {
    if (skip.has(key)) {
      return;
    }
    if (!input) {
      return;
    }
    input.disabled = disabled;
  });
  if (elements.clienteSelect) {
    elements.clienteSelect.disabled = disabled;
  }
  document
    .querySelectorAll("#osTabelaPecas input, #osTabelaServicos input, #osTabelaPecas button, #osTabelaServicos button")
    .forEach((el) => {
      el.disabled = disabled;
    });
  if (osElements.addPeca) {
    osElements.addPeca.disabled = disabled;
  }
  if (osElements.addServico) {
    osElements.addServico.disabled = disabled;
  }
};

const resetChamadoForm = () => {
  state.editId = null;
  elements.modalTitulo.textContent = "Nova O.S.";
  elements.form.reset();
  chamadoFields.prioridade.value = "Baixa";
  chamadoFields.statusServico.value = "Aberto";
  chamadoFields.dataEntrada.valueAsDate = new Date();
  if (chamadoFields.aprovacao) {
    chamadoFields.aprovacao.value = "Em andamento";
  }
  updateFinanceiroFields();
  resetOsTables();
  setFormDisabled(false);
};

const resetClienteForm = () => {
  elements.formCliente.reset();
  clienteFields.tipoCadastro.value = "PF";
  updateCadastroFields();
  setCepHint("Digite o CEP para buscar o endereço ou preencha manualmente.");
};

const validateChamadoForm = () => {
  if (!elements.clienteSelect.value) {
    alert("Selecione um cliente para a O.S.");
    return false;
  }

  const descricao = chamadoFields.descricao.value.trim();
  if (descricao.length < 10) {
    alert("A descrição deve ter no minimo 10 caracteres.");
    return false;
  }

  const dataEntrada = chamadoFields.dataEntrada.value;
  const dataEntrega = chamadoFields.dataEntrega.value;
  if (dataEntrega && dataEntrada && dataEntrega < dataEntrada) {
    alert("A data de entrega não pode ser anterior a data de entrada.");
    return false;
  }

  const pecas = getOsRows("peca");
  const servicos = getOsRows("servico");
  const linhasInvalidas = [...pecas, ...servicos].some(
    (item) => !item.descricao || !item.un || item.qtde <= 0 || item.precoUn <= 0
  );
  if (linhasInvalidas) {
    alert("Preencha Descrição, UN, Qtde e Preço un em todos os itens da O.S.");
    return false;
  }

  if (chamadoFields.aprovacao.value === "Sim") {
    if (!chamadoFields.metodoPagamento.value) {
      alert("Selecione o Método de pagamento.");
      return false;
    }
    if (!chamadoFields.valorPagamento.value) {
      alert("Informe o valor do pagamento.");
      return false;
    }
    const metodo = chamadoFields.metodoPagamento.value;
    if (
      (metodo === "Cartao" || metodo === "Crediario" || metodo === "Boleto") &&
      !chamadoFields.parcelasPagamento.value
    ) {
      alert("Informe a quantidade de parcelas.");
      return false;
    }
  }

  return true;
};

const validateClienteForm = () => {
  if (clienteFields.tipoCadastro.value === "PF") {
    const cpfDigits = clienteFields.cpf.value.replace(/\D/g, "");
    if (cpfDigits.length !== 11) {
      alert("CPF deve ter 11 digitos.");
      return false;
    }
  }

  if (clienteFields.tipoCadastro.value === "PJ") {
    const cnpjDigits = clienteFields.cnpj.value.replace(/\D/g, "");
    if (cnpjDigits.length !== 14) {
      alert("CNPJ deve ter 14 digitos.");
      return false;
    }
  }

  return true;
};

const generateId = () => {
  let code = "";
  do {
    code = Math.floor(10000 + Math.random() * 90000).toString();
  } while (state.chamados.some((item) => item.id === code));
  return code;
};

const buildClienteFromForm = () => {
  const tipo = clienteFields.tipoCadastro.value;
  return {
    id: generateId(),
    tipoCadastro: tipo,
    cliente:
      tipo === "PF"
        ? {
            nomeCompleto: clienteFields.nomeCompleto.value.trim(),
            cpf: clienteFields.cpf.value.trim(),
          }
        : {
            razaoSocial: clienteFields.razaoSocial.value.trim(),
            cnpj: clienteFields.cnpj.value.trim(),
            contatoResponsavel: clienteFields.contatoResponsavel.value.trim(),
          },
    contato: {
      email: clienteFields.email.value.trim(),
      telefone: clienteFields.telefone.value.trim(),
      whatsapp: clienteFields.whatsapp.value.trim(),
    },
    endereco: {
      rua: clienteFields.rua.value.trim(),
      numero: clienteFields.numero.value.trim(),
      complemento: clienteFields.complemento.value.trim(),
      bairro: clienteFields.bairro.value.trim(),
      cidade: clienteFields.cidade.value.trim(),
      uf: clienteFields.uf.value.trim().toUpperCase(),
      cep: clienteFields.cep.value.trim(),
    },
    createdAt: new Date().toISOString(),
  };
};

const buildChamadoFromForm = () => ({
  id: state.editId ?? generateId(),
  clienteId: elements.clienteSelect.value,
  servico: {
    categoria: chamadoFields.categoria.value.trim(),
    descricao: chamadoFields.descricao.value.trim(),
    statusServico: chamadoFields.statusServico.value,
    prioridade: chamadoFields.prioridade.value,
    dataEntrada: chamadoFields.dataEntrada.value,
    dataEntrega: chamadoFields.dataEntrega.value || "",
    modelo: chamadoFields.modelo.value.trim(),
    marca: chamadoFields.marca.value.trim(),
    localExecucao: chamadoFields.localExecucao.value,
    pecas: getOsRows("peca"),
    servicos: getOsRows("servico"),
    totais: getOsTotals(),
  },
  financeiro: {
    aprovacao: chamadoFields.aprovacao.value,
    metodoPagamento:
      chamadoFields.aprovacao.value === "Sim"
        ? chamadoFields.metodoPagamento.value
        : "",
    valor:
      chamadoFields.aprovacao.value === "Sim"
        ? (chamadoFields.valorPagamento.dataset.valor || "")
        : "",
    parcelas:
      chamadoFields.aprovacao.value === "Sim"
        ? chamadoFields.parcelasPagamento.value
        : "",
  },
  createdAt: state.editId
    ? getChamadoById(state.editId)?.createdAt ?? new Date().toISOString()
    : new Date().toISOString(),
});

const getChamadoById = (id) => state.chamados.find((item) => item.id === id);
const getClienteById = (id) => state.clientes.find((item) => item.id === id);

const upsertChamado = (chamado) => {
  const index = state.chamados.findIndex((item) => item.id === chamado.id);
  if (index >= 0) {
    state.chamados[index] = chamado;
  } else {
    state.chamados.unshift(chamado);
  }
  saveChamados();
  render();
};

const deleteChamado = (id) => {
  state.chamados = state.chamados.filter((item) => item.id !== id);
  saveChamados();
  render();
};

const renderSummary = () => {
  const totalValue = state.chamados.length.toString();
  const totalAbertosValue = state.chamados.filter(
    (item) => item.servico.statusServico === "Aberto"
  ).length.toString();
  const totalAtendimentoValue = state.chamados.filter(
    (item) => item.servico.statusServico === "Em atendimento"
  ).length.toString();
  const totalFechadosValue = state.chamados.filter(
    (item) =>
      item.servico.statusServico === "Fechado" || item.servico.statusServico === "Concluida"
  ).length.toString();
  const totalOrcamentosValue = state.orcamentos.length.toString();
  const totalVendasValue = state.vendas.length.toString();

  if (elements.total) {
    elements.total.textContent = totalValue;
    elements.totalAbertos.textContent = totalAbertosValue;
    elements.totalAtendimento.textContent = totalAtendimentoValue;
    elements.totalFechados.textContent = totalFechadosValue;
  }
  if (elements.totalDash) {
    elements.totalDash.textContent = totalValue;
    elements.totalAbertosDash.textContent = totalAbertosValue;
    elements.totalAtendimentoDash.textContent = totalAtendimentoValue;
    elements.totalFechadosDash.textContent = totalFechadosValue;
    if (elements.totalOrcamentosDash) {
      elements.totalOrcamentosDash.textContent = totalOrcamentosValue;
    }
    if (elements.totalVendasDash) {
      elements.totalVendasDash.textContent = totalVendasValue;
    }
  }
};

const getFilteredChamados = () => {
  const prioridade = elements.filtroPrioridade?.value || "";
  const status = elements.filtroStatus?.value || "";
  const dataEntrada = elements.filtroData?.value || "";
  const busca = normalize(elements.busca?.value || "");

  return state.chamados
    .filter((item) => {
      if (prioridade && item.servico.prioridade !== prioridade) {
        return false;
      }
      if (status && item.servico.statusServico !== status) {
        return false;
      }
      if (dataEntrada && item.servico.dataEntrada !== dataEntrada) {
        return false;
      }
      if (busca) {
        const cliente = getClienteById(item.clienteId);
        const fields = [
          cliente
            ? cliente.tipoCadastro === "PF"
              ? cliente.cliente.nomeCompleto
              : cliente.cliente.razaoSocial
            : "",
          cliente
            ? cliente.tipoCadastro === "PF"
              ? cliente.cliente.cpf
              : cliente.cliente.cnpj
            : "",
          item.id,
        ];
        return fields.some((value) => normalize(value || "").includes(busca));
      }
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
};

const formatCurrency = (value) => {
  if (!value) {
    return "";
  }
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    return "";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numberValue);
};

const handleCurrencyInput = (event) => {
  const digits = event.target.value.replace(/\D/g, "");
  if (!digits) {
    event.target.value = "";
    event.target.dataset.valor = "";
    return;
  }
  const value = (Number(digits) / 100).toFixed(2);
  event.target.dataset.valor = value;
  event.target.value = formatCurrency(value);
};

const createCard = (chamado) => {
  const card = document.createElement("article");
  card.className = "card";

  const prioridadeClass = priorityClass[chamado.servico.prioridade] || "";
  const statusClassName = statusClass[chamado.servico.statusServico] || "";
  const cliente = getClienteById(chamado.clienteId);
  const clienteNome = cliente
    ? cliente.tipoCadastro === "PF"
      ? cliente.cliente.nomeCompleto
      : cliente.cliente.razaoSocial
    : "Cliente não encontrado";

  card.innerHTML = `
    <div class="card__header">
      <div>
        <h3 class="card__title">O.S. #${chamado.id}</h3>
      </div>
      <div class="card__tags">
        <span class="tag ${prioridadeClass}">${chamado.servico.prioridade}</span>
        <span class="status ${statusClassName}">${chamado.servico.statusServico}</span>
      </div>
    </div>
    <div class="card__row">
      <div class="card__meta">
        <span><strong>Cliente:</strong> ${clienteNome}</span>
        <span><strong>Entrada:</strong> ${formatDate(chamado.servico.dataEntrada)}</span>
      </div>
      <div class="card__actions card__actions--inline">
        <button class="btn btn--ghost" data-view="${chamado.id}">Visualizar</button>
        <button class="btn btn--ghost" data-edit="${chamado.id}">Editar</button>
      </div>
    </div>
  `;

  const editButton = card.querySelector("[data-edit]");
  editButton.addEventListener("click", () => openEdit(chamado.id));

  const viewButton = card.querySelector("[data-view]");
  viewButton.addEventListener("click", () => openView(chamado.id));

  return card;
};

const render = () => {
  renderSummary();
  if (!elements.lista || !elements.vazio) {
    return;
  }
  elements.lista.innerHTML = "";
  const chamados = getFilteredChamados();
  chamados.forEach((chamado) => {
    elements.lista.appendChild(createCard(chamado));
  });
  elements.vazio.style.display = chamados.length ? "none" : "block";
};

const buildChamadoViewHTML = (chamado, cliente) => `
  ${
    (() => {
      const pecas = chamado.servico.pecas || [];
      const servicos = chamado.servico.servicos || [];
      const totalPecas = getRowsTotal(pecas);
      const totalServicos = getRowsTotal(servicos);
      const totalGeral = totalPecas + totalServicos;

      const tableRows = (rows) =>
        rows
          .map(
            (item) => `
              <tr>
                <td>${item.numero || "-"}</td>
                <td>${item.descricao || "-"}</td>
                <td>${item.un || "-"}</td>
                <td>${Number(item.qtde || 0).toFixed(2).replace(".", ",")}</td>
                <td>${formatCurrency(Number(item.precoUn || 0).toFixed(2))}</td>
                <td>${formatCurrency(Number(item.total || 0).toFixed(2))}</td>
              </tr>`
          )
          .join("");

      return `
        <div class="doc-section">
          <strong>Peças</strong>
          ${
            pecas.length
              ? `<div class="table-scroll">
                  <table class="orcamento-table">
                    <thead>
                      <tr><th>Nº</th><th>Descrição</th><th>Un</th><th>Qtde</th><th>Preço un</th><th>Total</th></tr>
                    </thead>
                    <tbody>${tableRows(pecas)}</tbody>
                  </table>
                </div>`
              : "<span>Nenhuma peça informada.</span>"
          }
        </div>

        <div class="doc-section">
          <strong>Serviços</strong>
          ${
            servicos.length
              ? `<div class="table-scroll">
                  <table class="orcamento-table">
                    <thead>
                      <tr><th>Nº</th><th>Descrição</th><th>Un</th><th>Qtde</th><th>Preço un</th><th>Total</th></tr>
                    </thead>
                    <tbody>${tableRows(servicos)}</tbody>
                  </table>
                </div>`
              : "<span>Nenhum serviço informado.</span>"
          }
          <span><strong>Total de peças:</strong> ${formatCurrency(totalPecas.toFixed(2))}</span>
          <span><strong>Total de serviços:</strong> ${formatCurrency(totalServicos.toFixed(2))}</span>
          <span><strong>Total da O.S.:</strong> ${formatCurrency(totalGeral.toFixed(2))}</span>
        </div>
      `;
    })()
  }

  <div class="doc-header">
    <div>
      <h3>Visualização da O.S. #${chamado.id}</h3>
      <div class="doc-meta">
        <span>${companyInfo.nome}</span>
        <span>${companyInfo.documento}</span>
      </div>
    </div>
    <img class="doc-logo" src="${companyInfo.logo || "logo.png"}" alt="Logo" />
  </div>

  <div class="doc-section">
    <strong>Resumo</strong>
    <span>Status: ${chamado.servico.statusServico}</span>
    <span>Entrada: ${formatDate(chamado.servico.dataEntrada)}</span>
    <span>Entrega: ${chamado.servico.dataEntrega ? formatDate(chamado.servico.dataEntrega) : "Não definida"}</span>
  </div>

  <div class="doc-section">
    <strong>Cliente</strong>
    <span>${cliente ? (cliente.tipoCadastro === "PF" ? cliente.cliente.nomeCompleto : cliente.cliente.razaoSocial) : "Não informado"}</span>
    <span>${cliente ? (cliente.tipoCadastro === "PF" ? `CPF: ${cliente.cliente.cpf}` : `CNPJ: ${cliente.cliente.cnpj}`) : ""}</span>
    ${cliente && cliente.tipoCadastro === "PJ" ? `<span>Responsavel: ${cliente.cliente.contatoResponsavel}</span>` : ""}
  </div>

  <div class="doc-section">
    <strong>Serviço</strong>
    <span>Categoria: ${chamado.servico.categoria}</span>
    <span>Descrição: ${chamado.servico.descricao}</span>
    <span>Modelo/Marca: ${chamado.servico.modelo} · ${chamado.servico.marca}</span>
    <span>Local: ${chamado.servico.localExecucao}</span>
  </div>

  <div class="doc-section">
    <strong>Financeiro</strong>
    <span>Aprovação: ${chamado.financeiro.aprovacao || "Não informado"}</span>
    <span>Método: ${chamado.financeiro.metodoPagamento || "Não informado"}</span>
    <span>Valor: ${chamado.financeiro.valor ? formatCurrency(chamado.financeiro.valor) : "Não informado"}</span>
    ${chamado.financeiro.parcelas ? `<span>Parcelas: ${chamado.financeiro.parcelas}x</span>` : ""}
  </div>
`;

const openView = (id) => {
  const chamado = getChamadoById(id);
  if (!chamado) {
    return;
  }
  closeChamadosPanel();
  closeClientesPanel();
  closeOrcamentoPanel();
  closeVendasPanel();
  closeFinanceiroPanel();
  const cliente = getClienteById(chamado.clienteId);
  setPagamentoActionsVisible(false);
  elements.docConteudo.innerHTML = `
    ${buildChamadoViewHTML(chamado, cliente)}
    <div class="doc-section">
      <strong>Ações</strong>
      <div class="card__actions">
        <button class="btn btn--ghost" id="viewOrcamento">Orçamento</button>
        <button class="btn btn--ghost" id="viewVenda">Venda</button>
        <button class="btn btn--ghost" id="viewEditar">Editar</button>
        <button class="btn btn--ghost" id="viewExcluir">Excluir</button>
      </div>
      <div id="confirmExcluir" class="field__hint" style="display:none;">
        Clique em \"Confirmar exclusao\" para remover a O.S.
        <button class="btn btn--ghost" id="confirmarExcluir">Confirmar exclusao</button>
      </div>
    </div>
  `;
  elements.modalPagamentoTitulo.textContent = "Visualizar O.S.";
  setPagamentoModalOpen(true);

  document.getElementById("viewEditar")?.addEventListener("click", () => {
    setPagamentoModalOpen(false);
    openEdit(id);
  });
  document.getElementById("viewOrcamento")?.addEventListener("click", () => {
    setPagamentoModalOpen(false);
    openOrcamentoFromOs(id);
  });
  document.getElementById("viewVenda")?.addEventListener("click", () => {
    setPagamentoModalOpen(false);
    openVendaFromOs(id);
  });
  document.getElementById("viewExcluir")?.addEventListener("click", () => {
    const confirmBox = document.getElementById("confirmExcluir");
    if (confirmBox) {
      confirmBox.style.display = "block";
    }
  });
  document.getElementById("confirmarExcluir")?.addEventListener("click", () => {
    deleteChamado(id);
    setPagamentoModalOpen(false);
  });
};

const renderDocumento = (chamadoId, tipo) => {
  setPagamentoActionsVisible(true);
  const chamado = getChamadoById(chamadoId);
  if (!chamado) {
    elements.docConteudo.innerHTML =
      "<p>Selecione uma O.S. para gerar o documento.</p>";
    elements.modalPagamentoTitulo.textContent = "Financeiro";
    return;
  }
  const cliente = getClienteById(chamado.clienteId);
  elements.docConteudo.innerHTML = buildDocumentoHTML(chamado, cliente, tipo);
  elements.modalPagamentoTitulo.textContent =
    tipo === "recibo" ? "Recibo" : tipo === "pedido" ? "Pedido" : "Orcamento";
  currentDoc = tipo;
  lastDocChamadoId = chamadoId;
  elements.tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.doc === tipo);
  });
};

const openDocumentoModal = (chamadoId, tipo) => {
  closeChamadosPanel();
  closeClientesPanel();
  closeOrcamentoPanel();
  closeVendasPanel();
  closeFinanceiroPanel();
  renderDocumento(chamadoId, tipo);
  elements.modalPagamento.dataset.chamadoId = chamadoId;
  setPagamentoModalOpen(true);
};

const openFinanceiroMenu = (tipo = currentDoc) => {
  setPagamentoActionsVisible(true);
  if (lastDocChamadoId) {
    openDocumentoModal(lastDocChamadoId, tipo);
    return;
  }
  elements.modalPagamento.dataset.chamadoId = "";
  elements.docConteudo.innerHTML =
    "<p>Selecione uma O.S. para gerar Orcamento, Recibo ou Pedido.</p>";
  elements.modalPagamentoTitulo.textContent = "Financeiro";
  setPagamentoModalOpen(true);
};

const renderClientesSelect = (selectedId = "") => {
  elements.clienteSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione um cliente";
  elements.clienteSelect.appendChild(placeholder);

  state.clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    const nome =
      cliente.tipoCadastro === "PF"
        ? cliente.cliente.nomeCompleto
        : cliente.cliente.razaoSocial;
    option.textContent = `${nome} · ${cliente.tipoCadastro}`;
    elements.clienteSelect.appendChild(option);
  });

  if (selectedId) {
    elements.clienteSelect.value = selectedId;
  }
};

const openEdit = (id) => {
  const chamado = getChamadoById(id);
  if (!chamado) {
    return;
  }
  closeChamadosPanel();
  closeClientesPanel();
  closeOrcamentoPanel();
  closeVendasPanel();
  closeFinanceiroPanel();
  state.editId = id;
  elements.modalTitulo.textContent = "Editar O.S.";

  elements.clienteSelect.value = chamado.clienteId;

  chamadoFields.categoria.value = chamado.servico.categoria;
  chamadoFields.prioridade.value = chamado.servico.prioridade;
  chamadoFields.statusServico.value = chamado.servico.statusServico;
  chamadoFields.dataEntrada.value = chamado.servico.dataEntrada;
  chamadoFields.dataEntrega.value = chamado.servico.dataEntrega;
  chamadoFields.modelo.value = chamado.servico.modelo;
  chamadoFields.marca.value = chamado.servico.marca;
  chamadoFields.localExecucao.value = chamado.servico.localExecucao;
  chamadoFields.descricao.value = chamado.servico.descricao;
  loadOsTablesFromChamado(chamado);

  chamadoFields.aprovacao.value = chamado.financeiro.aprovacao || "Em andamento";
  chamadoFields.metodoPagamento.value = chamado.financeiro.metodoPagamento || "Dinheiro";
  chamadoFields.valorPagamento.value = chamado.financeiro.valor
    ? formatCurrency(chamado.financeiro.valor)
    : "";
  chamadoFields.valorPagamento.dataset.valor = chamado.financeiro.valor || "";
  chamadoFields.parcelasPagamento.value = chamado.financeiro.parcelas || "";
  updateFinanceiroFields();

  setFormDisabled(
    chamado.servico.statusServico === "Fechado" || chamado.servico.statusServico === "Concluida"
  );
  setModalOpen(true);
};

const handleChamadoSubmit = (event) => {
  event.preventDefault();
  if (!validateChamadoForm()) {
    return;
  }
  const chamado = buildChamadoFromForm();
  upsertChamado(chamado);
  setModalOpen(false);
};

const handleClienteSubmit = (event) => {
  event.preventDefault();
  if (!validateClienteForm()) {
    return;
  }
  const cliente = buildClienteFromForm();
  state.clientes.unshift(cliente);
  saveClientes();
  renderClientesSelect(cliente.id);
  populateOrcamentoClientes();
  populateVendasClientes();
  renderClientesPanel();
  setClienteModalOpen(false);
};

const init = () => {
  loadChamados();
  loadClientes();
  loadOrcamentos();
  loadVendas();
  loadEmpresa();
  migrateChamados();
  renderClientesSelect();
  render();
  resetChamadoForm();
  syncLogoHeader();

  elements.menuChamados.addEventListener("click", () => {
    closeClientesPanel();
    closeVendasPanel();
    closeFinanceiroPanel();
    closeOrcamentoPanel();
    openChamadosPanel();
  });
  elements.fecharChamados?.addEventListener("click", closeChamadosPanel);
  elements.fecharClientes?.addEventListener("click", closeClientesPanel);
  elements.fecharOrcamento?.addEventListener("click", closeOrcamentoPanel);
  elements.fecharVendas?.addEventListener("click", closeVendasPanel);
  elements.fecharFinanceiro?.addEventListener("click", closeFinanceiroPanel);

  elements.menuCadastroCliente.addEventListener("click", () => {
    closeChamadosPanel();
    closeClientesPanel();
    closeOrcamentoPanel();
    closeVendasPanel();
    closeFinanceiroPanel();
    openClientesPanel();
  });

  elements.menuOrcamento.addEventListener("click", () => {
    closeChamadosPanel();
    closeClientesPanel();
    closeVendasPanel();
    closeFinanceiroPanel();
    openOrcamentoPanel();
  });

  elements.menuVendas?.addEventListener("click", () => {
    closeChamadosPanel();
    closeClientesPanel();
    closeOrcamentoPanel();
    closeFinanceiroPanel();
    openVendasPanel();
  });

  elements.menuPedido?.addEventListener("click", () => {
    closeOrcamentoPanel();
    openFinanceiroMenu("pedido");
  });

  elements.menuFinanceiro.addEventListener("click", () => {
    closeVendasPanel();
    closeChamadosPanel();
    closeClientesPanel();
    closeOrcamentoPanel();
    openFinanceiroPanel();
  });
  elements.menuEmpresa.addEventListener("click", () => {
    closeChamadosPanel();
    closeClientesPanel();
    closeOrcamentoPanel();
    closeVendasPanel();
    closeFinanceiroPanel();
    elements.empresaNome.value = companyInfo.nome;
    elements.empresaDocumento.value = companyInfo.documento;
    elements.empresaEndereco.value = companyInfo.endereco;
    elements.empresaTelefone.value = companyInfo.telefone;
    elements.empresaLogo.value = companyInfo.logo || "logo.png";
    elements.empresaTitulo.value = companyInfo.titulo || "Central de Suporte";
    elements.empresaSubtitulo.value =
      companyInfo.subtitulo || "Gestão completa de chamados com cadastro PF/PJ.";
    setEmpresaModalOpen(true);
  });

  elements.fecharModal.addEventListener("click", () => setModalOpen(false));
  elements.cancelar.addEventListener("click", () => setModalOpen(false));
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      setModalOpen(false);
    }
  });

  elements.btnVerCliente.addEventListener("click", () => {
    const clienteId = elements.clienteSelect.value;
    if (!clienteId) {
      alert("Selecione um cliente para visualizar.");
      return;
    }
    const cliente = getClienteById(clienteId);
    if (!cliente) {
      alert("Cliente não encontrado.");
      return;
    }
    elements.docConteudo.innerHTML = buildClienteHTML(cliente);
    elements.modalPagamentoTitulo.textContent = "Dados do cliente";
    setPagamentoActionsVisible(false);
    setPagamentoModalOpen(true);
  });

  elements.fecharModalCliente.addEventListener("click", () => setClienteModalOpen(false));
  elements.cancelarCliente.addEventListener("click", () => setClienteModalOpen(false));
  elements.modalCliente.addEventListener("click", (event) => {
    if (event.target === elements.modalCliente) {
      setClienteModalOpen(false);
    }
  });

  elements.fecharModalPagamento.addEventListener("click", () =>
    setPagamentoModalOpen(false)
  );
  elements.modalPagamento.addEventListener("click", (event) => {
    if (event.target === elements.modalPagamento) {
      setPagamentoModalOpen(false);
    }
  });
  elements.tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chamadoId = elements.modalPagamento.dataset.chamadoId;
      if (!chamadoId) {
        return;
      }
      renderDocumento(chamadoId, btn.dataset.doc);
    });
  });
  elements.btnImprimir.addEventListener("click", () => {
    window.print();
  });

  elements.fecharModalEmpresa.addEventListener("click", () =>
    setEmpresaModalOpen(false)
  );
  elements.cancelarEmpresa.addEventListener("click", () =>
    setEmpresaModalOpen(false)
  );
  elements.modalEmpresa.addEventListener("click", (event) => {
    if (event.target === elements.modalEmpresa) {
      setEmpresaModalOpen(false);
    }
  });
  elements.formEmpresa.addEventListener("submit", (event) => {
    event.preventDefault();
    companyInfo = {
      nome: elements.empresaNome.value.trim() || "Helpdesk Company",
      documento: elements.empresaDocumento.value.trim(),
      endereco: elements.empresaEndereco.value.trim(),
      telefone: elements.empresaTelefone.value.trim(),
      logo: elements.empresaLogo.value.trim() || "logo.png",
      titulo: elements.empresaTitulo.value.trim() || "Central de Suporte",
      subtitulo:
        elements.empresaSubtitulo.value.trim() ||
        "Gestão completa de chamados com cadastro PF/PJ.",
    };
    saveEmpresa();
    syncLogoHeader();
    setEmpresaModalOpen(false);
  });

  elements.form.addEventListener("submit", handleChamadoSubmit);
  elements.formCliente.addEventListener("submit", handleClienteSubmit);

  osElements.addPeca?.addEventListener("click", () => addOsRow("peca"));
  osElements.addServico?.addEventListener("click", () => addOsRow("servico"));

  clienteFields.tipoCadastro.addEventListener("change", updateCadastroFields);

  clienteFields.cpf.addEventListener("input", (event) => {
    event.target.value = formatCpf(event.target.value);
  });

  clienteFields.cnpj.addEventListener("input", (event) => {
    event.target.value = formatCnpj(event.target.value);
  });

  clienteFields.telefone.addEventListener("input", (event) => {
    event.target.value = formatPhone(event.target.value);
  });

  clienteFields.whatsapp.addEventListener("input", (event) => {
    event.target.value = formatPhone(event.target.value);
  });

  clienteFields.cep.addEventListener("input", (event) => {
    event.target.value = formatCep(event.target.value);
  });

  clienteFields.cep.addEventListener("blur", async (event) => {
    const digits = event.target.value.replace(/\D/g, "");
    if (digits.length !== 8) {
      return;
    }
    setCepHint("Buscando endereço...", "loading");
    try {
      const data = await fetchEnderecoByCep(digits);
      if (!clienteFields.rua.value) {
        clienteFields.rua.value = data.logradouro || "";
      }
      if (!clienteFields.bairro.value) {
        clienteFields.bairro.value = data.bairro || "";
      }
      if (!clienteFields.cidade.value) {
        clienteFields.cidade.value = data.localidade || "";
      }
      if (!clienteFields.uf.value) {
        clienteFields.uf.value = data.uf || "";
      }
      setCepHint("Endereço preenchido automaticamente.");
      clienteFields.numero.focus();
    } catch (error) {
      setCepHint(error.message || "não foi possível buscar o endereço.", "error");
    }
  });

  if (elements.statusServico) {
    elements.statusServico.addEventListener("change", () => {
      const isFechado =
        elements.statusServico.value === "Fechado" ||
        elements.statusServico.value === "Concluida";
      setFormDisabled(isFechado);
    });
  }

  if (chamadoFields.aprovacao) {
  chamadoFields.aprovacao?.addEventListener("change", updateFinanceiroFields);
  }
  if (chamadoFields.metodoPagamento) {
    chamadoFields.metodoPagamento.addEventListener("change", updateFinanceiroFields);
  }
  if (chamadoFields.valorPagamento) {
    chamadoFields.valorPagamento.addEventListener("input", handleCurrencyInput);
  }

  updateCadastroFields();
};

init();





