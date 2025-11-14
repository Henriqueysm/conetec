// =======================
    // PROTEÇÃO DE ACESSO
    // =======================
    const token = localStorage.getItem("token");
    const tipo = localStorage.getItem("tipo");

    if (!token || tipo !== "admin") {
      alert("Acesso negado!");
      window.location.href = "../index.html";
    }

    // =======================
    // NAVBAR DINÂMICO
    // =======================
    fetch("../components/navAdmin.html")
      .then(res => res.text())
      .then(html => {
        document.body.insertAdjacentHTML("afterbegin", html);
        initNav();
        mostrarNomeUsuario();
        destacarLinkAtivo();
      });

    function mostrarNomeUsuario() {
      const nome = localStorage.getItem("nome") || "Usuário";
      const userNameSpan = document.getElementById("userName");
      if (userNameSpan) userNameSpan.textContent = nome;
    }

    function destacarLinkAtivo() {
      const path = window.location.pathname.split("/").pop();
      const links = document.querySelectorAll(".nav a");

      links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === path) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    function initNav() {
      const logoutBtn = document.getElementById("logoutBtn");
      if (!logoutBtn) return;
      logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../index.html";
      });
    }
