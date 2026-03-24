export const financeiroSection = `
  <!-- Etapa: Orçamento da O.S. -->
  <div class="form-section">
    <h3>Orçamento da O.S.</h3>
    <div class="grid">
      <div class="field">
        <label for="aprovacao">Status do orçamento</label>
        <select id="aprovacao" required>
          <option value="Em orçamento">Em orçamento</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Reprovado">Reprovado</option>
        </select>
      </div>
      <div class="field">
        <label for="metodoPagamento">Tipo de pagamento</label>
        <select id="metodoPagamento">
          <option value="Nao informado">Não informado</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
          <option value="Cartao">Cartão</option>
          <option value="Boleto">Boleto</option>
          <option value="Crediario">Crediário</option>
        </select>
      </div>
      <div class="field field--full">
        <small class="field__hint">
          Em orçamento: não gera venda. Aprovado: gera venda automaticamente. Reprovado: arquiva a O.S. com opção de reativar.
        </small>
      </div>
    </div>
  </div>
`;
