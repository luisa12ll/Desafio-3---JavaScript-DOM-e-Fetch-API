document.addEventListener('DOMContentLoaded', () => {
  const ufSelect = document.getElementById('ufSelect');
  const tbody = document.querySelector('#municipiosTable tbody');
  const listaDiv = document.getElementById('listaMunicipios');

  function carregarUFs() {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(resp => resp.json())
      .then(ufs => {
        ufSelect.innerHTML = '<option value="">Selecione uma UF</option>';
        ufs.sort((a, b) => a.nome.localeCompare(b.nome));
        ufs.forEach(uf => {
          ufSelect.innerHTML += `<option value="${uf.sigla}">${uf.sigla} - ${uf.nome}</option>`;
        });
      })
      .catch(() => {
        ufSelect.innerHTML = '<option value="">Erro ao carregar as UFs</option>';
      });
  }

  function mostrarMunicipios(municipios) {
    tbody.innerHTML = '';
    municipios.forEach(m => {
      const row = tbody.insertRow();
      const cell = row.insertCell(0);
      cell.textContent = m.nome;
    });
  }

  function carregarMunicipios(ufSigla) {
    tbody.innerHTML = '';
    listaDiv.style.display = 'none';

    if (!ufSigla) return;

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSigla}/municipios`)
      .then(resp => resp.json())
      .then(data => {
        mostrarMunicipios(data);
        listaDiv.style.display = 'block';
      })
      .catch(() => {
        tbody.innerHTML = '<tr><td colspan="1">Erro ao carregar os municípios</td></tr>';
        listaDiv.style.display = 'block';
      });
  }

  ufSelect.addEventListener('change', e => {
    carregarMunicipios(e.target.value);
  });

  carregarUFs();
});
