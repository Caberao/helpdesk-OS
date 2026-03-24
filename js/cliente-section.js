export const clienteSection = `
  <!-- Etapa: Cadastro do cliente -->
  <div class="form-section">
    <h3>Cadastro do cliente</h3>
    <div class="grid">
      <div class="field">
        <label for="tipoCadastro">Tipo de cadastro</label>
        <select id="tipoCadastro" required>
          <option value="PF">Pessoa fisica</option>
          <option value="PJ">Pessoa juridica</option>
        </select>
      </div>
    </div>
    <div id="camposPF" class="grid">
      <div class="field">
        <label for="nomeCompleto">Nome completo</label>
        <input id="nomeCompleto" type="text" required />
      </div>
      <div class="field">
        <label for="cpf">CPF</label>
        <input id="cpf" type="text" inputmode="numeric" required />
      </div>
    </div>
    <div id="camposPJ" class="grid">
      <div class="field">
        <label for="razaoSocial">Razao social</label>
        <input id="razaoSocial" type="text" />
      </div>
      <div class="field">
        <label for="cnpj">CNPJ</label>
        <input id="cnpj" type="text" inputmode="numeric" />
      </div>
      <div class="field">
        <label for="contatoResponsavel">Contato responsavel</label>
        <input id="contatoResponsavel" type="text" />
      </div>
    </div>
  </div>

  <!-- Etapa: Contato -->
  <div class="form-section">
    <h3>Contato</h3>
    <div class="grid">
      <div class="field">
        <label for="email">E-mail</label>
        <input id="email" type="email" required />
      </div>
      <div class="field">
        <label for="telefone">Telefone</label>
        <input id="telefone" type="text" />
      </div>
      <div class="field">
        <label for="whatsapp">WhatsApp</label>
        <input id="whatsapp" type="text" />
      </div>
    </div>
  </div>

  <!-- Etapa: Endereço -->
  <div class="form-section">
    <h3>Endereço do cliente</h3>
    <div class="grid">
      <div class="field">
        <label for="cep">CEP</label>
        <input id="cep" type="text" placeholder="00000-000" />
        <small class="field__hint" id="cepHint">Digite o CEP para buscar o endereço ou preencha manualmente.</small>
      </div>
      <div class="field">
        <label for="rua">Rua</label>
        <input id="rua" type="text" required />
      </div>
      <div class="field">
        <label for="numero">Número</label>
        <input id="numero" type="text" required />
      </div>
      <div class="field">
        <label for="complemento">Complemento</label>
        <input id="complemento" type="text" />
      </div>
      <div class="field">
        <label for="bairro">Bairro</label>
        <input id="bairro" type="text" required />
      </div>
      <div class="field">
        <label for="cidade">Cidade</label>
        <input id="cidade" type="text" required />
      </div>
      <div class="field">
        <label for="uf">UF</label>
        <input id="uf" type="text" maxlength="2" required />
      </div>
    </div>
  </div>
`;
