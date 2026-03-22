export const financeiroSection = `
  <!-- Etapa: Financeiro -->
  <div class="form-section">
    <h3>Financeiro</h3>
    <div class="grid">
      <div class="field">
        <label for="aprovacao">Aprovação</label>
        <select id="aprovacao" required>
          <option value="Em andamento">Em andamento</option>
          <option value="Sim">Sim</option>
          <option value="Nao">Não</option>
        </select>
      </div>
      <div class="field" id="metodoPagamentoField" style="display: none;">
        <label for="metodoPagamento">Método de pagamento</label>
        <select id="metodoPagamento">
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
          <option value="Cartao">Cartao</option>
          <option value="Boleto">Boleto</option>
          <option value="Crediario">Crediario</option>
        </select>
      </div>
      <div class="field" id="valorPagamentoField" style="display: none;">
        <label for="valorPagamento">Valor</label>
        <input id="valorPagamento" type="text" inputmode="numeric" />
      </div>
      <div class="field" id="parcelasPagamentoField" style="display: none;">
        <label for="parcelasPagamento">Parcelas</label>
        <input id="parcelasPagamento" type="number" min="1" step="1" />
      </div>
    </div>
  </div>
`;
