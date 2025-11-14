 // script para selecionar um seat (apenas 1 selecionado)
    (function(){
      const seats = document.querySelectorAll('.room-grid .seat');
      const selectedBox = document.getElementById('selectedBox');
      const criarBtn = document.getElementById('criarBtn');

      function updateSelectedUI() {
        const sel = document.querySelector('.room-grid .seat.selecionado');
        selectedBox.textContent = sel ? sel.dataset.seat : '—';
      }

      // inicializa: aplica classes de status como estilos (data-status)
      seats.forEach(s => {
        // se status for amarelo/azul/verde/ocupado, apenas visual (já tratado com data-status no CSS)
        // clique:
        s.addEventListener('click', () => {
          if (s.dataset.status === 'ocupado') return; // não selecionável
          // remover seleção anterior
          document.querySelectorAll('.room-grid .seat.selecionado').forEach(x => x.classList.remove('selecionado'));
          s.classList.add('selecionado');
          updateSelectedUI();
        });
      });

      // botão criar chamado (substitua a ação por navegação real)
      criarBtn.addEventListener('click', () => {
        const sel = document.querySelector('.room-grid .seat.selecionado');
        if (!sel) {
          alert('Selecione um local antes de criar o chamado.');
          return;
        }
        const numero = sel.dataset.seat;
        // aqui você pode redirecionar, abrir modal ou preencher formulário com o número do assento
        alert('Criando chamado para o local: ' + numero);
        // exemplo: window.location.href = '/criar-chamado.html?local='+numero;
      });

      // define valor inicial se já houver "selecionado"
      updateSelectedUI();
    })();