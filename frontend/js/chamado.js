
formChamado.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario_id = null; // id será gerado pelo backend
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const sala_id = document.getElementById('sala').value;
  const computador_id = document.getElementById('computador').value;
  const categoria = document.getElementById('categoria').value;
  const urgencia = document.getElementById('urgencia').value;

  try {
    await fetch("https://conetec.vercel.app/api/chamado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        usuario_id,
        sala_id,
        computador_id,
        titulo,
        descricao,
        categoria,
        urgencia,
        localizacao: salaSelect.selectedOptions[0].textContent,
        status: "Pendente",
      }),
    });
    alert('Chamado criado com sucesso!');
    formCadastro.reset();
    getAllUsuario(); // atualiza a tabela
  } catch (err) {
    console.error('Erro ao criar chamado:', err);
    alert('Erro ao criar chamado.');
  }
});



const chamadoTable = document.querySelector('#chamadoTable tbody');

async function getAllChamado() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://conetec.vercel.app/api/chamado", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error("Erro ao buscar chamados:", response.status);
      return;
    }

    const chamado = await response.json();

    chamadoTable.innerHTML = ''; // limpa tabela

    chamado.reverse().forEach(c => {

  const tr = document.createElement('tr');
      tr.dataset.chamadoId = c.id;
      tr.dataset.salaId = c.sala_id || "";
      tr.dataset.pcId = c.computador_id || "";
      
      tr.innerHTML = `
      <td>${c.usuario_nome}</td>
      <td><input value="${c.titulo}" data-id="${c.id}" class="edit-titulo"></td>
      <td><input value="${c.descricao}" data-id="${c.id}" class="edit-descricao"></td>
      <td>${c.sala_id}</td>
      <td>${c.pc_id}</td>
      <td>${c.categoria}</td>
      <td>${c.urgencia}</td>
      <td>${c.status}</td>
      <td><input value="${formatDate(new Date(c.criado_em))}" data-id="${c.id}" class="edit-criadoEm" readonly></td>
      <td>${c.atualizado_em ? formatDate(new Date(c.atualizado_em)) : ''}</td>
            <div class="two-btn">
        <button class="edit-btn" onclick="updateChamado(${c.id})">Salvar</button>
        <button class="delete-btn" onclick="deleteChamado(${c.id})">Excluir</button>
      </div>
    </td>
  `;
  chamadoTable.appendChild(tr);
});

  } catch (err) {
    console.error("Erro ao carregar chamados:", err);
  }
}

async function updateChamado(id) {
  const token = localStorage.getItem("token");
  const titulo = document.querySelector(`.edit-titulo[data-id='${id}']`).value;
  const descricao = document.querySelector(`.edit-descricao[data-id='${id}']`).value;

  try {
    const response = await fetch(`https://conetec.vercel.app/api/chamado/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, descricao })
    });

    if (!response.ok) {
      console.error("Erro ao atualizar chamado");
      return;
    }

    alert("Chamado atualizado com sucesso!");
    getAllChamado();
  } catch (err) {
    console.error("Erro ao atualizar:", err);
  }
}

async function deleteChamado(id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://conetec.vercel.app/api/chamado/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error("Erro ao excluir chamado");
      return;
    }

    alert("Chamado excluído com sucesso!");
    getAllChamado();
  } catch (err) {
    console.error("Erro ao excluir:", err);
  }
}

// Chama quando abre a página
getAllChamado();