document.addEventListener('DOMContentLoaded', () => {
  const ufSelect = document.getElementById('ufSelect');
  const tbody = document.querySelector('#municipiosTable tbody');
  const listaDiv = document.getElementById('listaMunicipios');

  const paginacaoDiv = document.getElementById('paginacao');
  const btnAnterior = document.getElementById('btnAnterior');
  const btnProximo = document.getElementById('btnProximo');
  const infoPagina = document.getElementById('infoPagina');

  let municipios = [];
  let paginaAtual = 1;
  const itensPorPagina = 10;

  function mostrarPagina(pagina) {
    tbody.innerHTML = ''; // Limpa tabela antes
    paginaAtual = pagina;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const itensParaMostrar = municipios.slice(inicio, fim);

    itensParaMostrar.forEach((m) => {
      const row = tbody.insertRow();
      const cell = row.insertCell(0);
      cell.textContent = m.nome;
    });

    const totalPaginas = Math.ceil(municipios.length / itensPorPagina);
    infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

    btnAnterior.disabled = paginaAtual === 1;
    btnProximo.disabled = paginaAtual === totalPaginas || totalPaginas === 0;

    paginacaoDiv.style.display = totalPaginas > 1 ? 'block' : 'none';
  }

  function carregarMunicipios(ufSigla) {
    tbody.innerHTML = '';
    listaDiv.style.display = 'none';
    paginacaoDiv.style.display = 'none';

    if (!ufSigla) return;

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSigla}/municipios`)
      .then((resp) => resp.json())
      .then((data) => {
        municipios = data;
        mostrarPagina(1);
        listaDiv.style.display = 'block';
      })
      .catch(() => {
        tbody.innerHTML = '<tr><td colspan="1">Erro ao carregar os municípios</td></tr>';
        listaDiv.style.display = 'block';
        paginacaoDiv.style.display = 'none';
      });
  }

  btnAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) { mostrarPagina(paginaAtual - 1); }
  });

  btnProximo.addEventListener('click', () => {
    const totalPaginas = Math.ceil(municipios.length / itensPorPagina);
    if (paginaAtual < totalPaginas) { mostrarPagina(paginaAtual + 1); }
  });

  ufSelect.addEventListener('change', (e) => {
    carregarMunicipios(e.target.value);
  });

  // Carrega UFs no select
  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(resp => resp.json())
    .then(ufs => {
      ufSelect.innerHTML = '<option value="">Selecione uma UF</option>';
      ufs.sort((a, b) => a.nome.localeCompare(b.nome));
      ufs.forEach(uf => {
        ufSelect.innerHTML += `<option value="${uf.sigla}">${uf.sigla} - ${uf.nome}</option>`;
      });
    });
});
