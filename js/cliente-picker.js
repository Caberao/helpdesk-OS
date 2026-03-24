export const clientePickerSection = `
  <!-- Etapa: Cliente do chamado -->
  <div class="form-section">
    <h3>Cliente do chamado</h3>
    <div class="grid">
      <div class="field field--full">
        <label for="clienteSelect">Cliente</label>
        <select id="clienteSelect" required></select>
        <small class="field__hint" id="clienteHint">Selecione um cliente cadastrado.</small>
      </div>
      <div class="field">
        <button type="button" class="btn btn--ghost btn--link" id="btnVerCliente">Ver dados do cliente</button>
      </div>
    </div>
  </div>
`;
