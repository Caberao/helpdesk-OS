export const chamadoSection = `
  <!-- Etapa: Dados da O.S. -->
  <div class="form-section">
    <h3>Dados da O.S.</h3>
    <div class="grid">
      <div class="field">
        <label for="categoria">Categoria</label>
        <input id="categoria" type="text" required />
      </div>
      <div class="field">
        <label for="prioridade">Prioridade</label>
        <select id="prioridade" required>
          <option value="Baixa">Baixa</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
          <option value="Critica">Critica</option>
        </select>
      </div>
      <div class="field">
        <label for="statusServico">Status do serviço</label>
        <select id="statusServico" required>
          <option value="Aberto">Aberto</option>
          <option value="Em atendimento">Em atendimento</option>
          <option value="Resolvido">Resolvido</option>
          <option value="Concluida">Concluída</option>
          <option value="Fechado">Fechado</option>
        </select>
      </div>
      <div class="field">
        <label for="dataEntrada">Data de entrada</label>
        <input id="dataEntrada" type="date" required />
      </div>
      <div class="field">
        <label for="dataEntrega">Data de entrega</label>
        <input id="dataEntrega" type="date" />
      </div>
      <div class="field">
        <label for="modelo">Modelo</label>
        <input id="modelo" type="text" required />
      </div>
      <div class="field">
        <label for="marca">Marca</label>
        <input id="marca" type="text" required />
      </div>
      <div class="field">
        <label for="localExecucao">Local de execucao</label>
        <select id="localExecucao" required>
          <option value="Interno">Interno</option>
          <option value="Externo">Externo</option>
        </select>
      </div>
      <div class="field field--full">
        <label for="descricao">Descrição do problema</label>
        <textarea id="descricao" rows="3" required></textarea>
      </div>
    </div>
  </div>

  <div class="form-section">
    <h3>Itens da O.S.</h3>

    <section class="table-block">
      <div class="table-block__header">
        <h3>Peças</h3>
        <button type="button" class="btn btn--ghost" id="osAddPeca">Adicionar peça</button>
      </div>
      <div class="table-scroll">
        <table class="orcamento-table" id="osTabelaPecas">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Descrição</th>
              <th>Un</th>
              <th>Qtde</th>
              <th>Preço un</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <section class="table-block">
      <div class="table-block__header">
        <h3>Serviços</h3>
        <button type="button" class="btn btn--ghost" id="osAddServico">Adicionar serviço</button>
      </div>
      <div class="table-scroll">
        <table class="orcamento-table" id="osTabelaServicos">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Descrição</th>
              <th>Un</th>
              <th>Qtde</th>
              <th>Preço un</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <div class="grid">
      <div class="field">
        <label for="osTotalPecas">Total de peças</label>
        <input id="osTotalPecas" type="text" readonly />
      </div>
      <div class="field">
        <label for="osTotalServicos">Total de serviços</label>
        <input id="osTotalServicos" type="text" readonly />
      </div>
      <div class="field">
        <label for="osTotalGeral">Total da O.S.</label>
        <input id="osTotalGeral" type="text" readonly />
      </div>
    </div>
  </div>
`;
