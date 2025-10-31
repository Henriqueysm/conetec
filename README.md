<p align="center">
  <img src="./prints/logo.png" alt="Logo Conetec" width="220"/>
</p>

<h1 align="center">🧰 Conetec</h1>
<p align="center">
  <strong>Sistema de Gerenciamento de Chamados Técnicos</strong><br>
  <em>Projeto desenvolvido como parte do TCC da ETEC</em>
</p>

---

# 💻 Conetec

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=flat&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

**Conetec** é um sistema web para **gerenciamento de chamados técnicos**, **controle de equipamentos** e **administração de salas**, desenvolvido para uso interno em instituições de ensino.  
O sistema centraliza a abertura e acompanhamento de chamados, com autenticação segura e painéis personalizados para cada tipo de usuário.

---

## 📚 Sumário

1. [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)  
2. [🧩 Funcionalidades Principais](#-funcionalidades-principais)  
3. [👥 Perfis de Usuário](#-perfis-de-usuário)  
4. [🧪 Funcionalidades Concluídas](#-funcionalidades-concluídas)  
5. [🔄 Etapas Restantes](#-etapas-restantes)  
6. [📸 Demonstrações](#-demonstrações)  
7. [👨‍💻 Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)  
8. [📄 Licença](#-licença)  

---

## 🚀 Tecnologias Utilizadas

### 🧠 Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/) (via [XAMPP](https://www.apachefriends.org/pt_br/index.html))
- [dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [cors](https://www.npmjs.com/package/cors)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

### 🎨 Frontend
- HTML5  
- CSS3  
- JavaScript (Fetch API)

---

## 🧩 Funcionalidades Principais

- 📋 Abertura e acompanhamento de **chamados técnicos**
- 🧑‍💼 Painel administrativo com **CRUD completo**
- 📊 **Dashboard com gráficos e estatísticas** (para o administrador)
- 🔒 **Autenticação segura (JWT)** com proteção de rotas
- 💾 Controle e cadastro de **salas, computadores, aparelhos e usuários**
- 🕓 **Histórico de manutenções** e atualizações de status

---

## 👥 Perfis de Usuário

### 👨‍💼 Administrador (Chefe dos Técnicos)
- Acesso total a todas as funcionalidades do sistema  
- **Dashboard com gráficos e estatísticas** (chamados abertos, concluídos, em andamento etc.)  
- CRUD completo de **salas**, **computadores**, **aparelhos** e **usuários**  
- Gerenciamento e atualização de **chamados técnicos**  
- Consulta ao **histórico de manutenções**  

### 🛠️ Técnico
- Acesso aos chamados atribuídos  
- Atualização do **status do chamado** (Pendente, Em andamento, Resolvido)  
- Registro de ações e comentários, exibindo o **histórico do chamado**  

### 👤 Usuário Comum
- Abertura de chamados técnicos  
- Acompanhamento do status do atendimento  
- Consulta do histórico de chamados realizados  

---

## 🧪 Funcionalidades Concluídas
✅ CRUD completo de salas, computadores, aparelhos e usuários  
✅ Sistema de autenticação com JWT e bcrypt  
✅ Painel administrativo com dashboard  
✅ Abertura e gerenciamento de chamados  
✅ Integração entre frontend e backend  

---

## 🔄 Etapas Restantes
- ☁️ Hospedagem do backend e banco de dados na nuvem  
- 🌐 Deploy completo (acesso remoto ao sistema)  
- 📱 Ajustes de layout e responsividade  

---


## 📸 Demonstrações

| Tela | Descrição |
|------|------------|
| ![Login](./prints/login.png) | Tela de login com autenticação segura |
| ![Dashboard](./prints/dashboardAdmin.png) | Painel principal com gráficos e estatísticas do administrador |
| ![Chamado](./prints/chamado.png) | Abertura e acompanhamento de chamados |
| ![Histórico](./prints/historico.png) | Histórico de manutenção dos equipamentos |


---

## 👨‍💻 Equipe de Desenvolvimento
- **Yuri Henrique** – Backend, Frontend & Autenticação  

---

## 📄 Licença
Este projeto foi desenvolvido para fins educacionais como parte do **Trabalho de Conclusão de Curso (TCC)** da **ETEC**.
