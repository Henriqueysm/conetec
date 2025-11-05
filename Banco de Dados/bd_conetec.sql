-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 05/11/2025 às 02:04
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bd_conetec`
--
CREATE DATABASE IF NOT EXISTS `bd_conetec` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bd_conetec`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `anexo`
--

CREATE TABLE `anexo` (
  `id` int(11) NOT NULL,
  `chamado_id` int(11) NOT NULL,
  `caminho` varchar(255) NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `aparelhos`
--

CREATE TABLE `aparelhos` (
  `id` int(11) NOT NULL,
  `sala_id` int(11) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `patrimonio` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `aparelhos`
--

INSERT INTO `aparelhos` (`id`, `sala_id`, `tipo`, `modelo`, `patrimonio`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Televisão', 'Samsung Smart TV 50\"', 'S1-TV-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(2, 1, 'Ar-condicionado', 'LG Dual Inverter 12000 BTU', 'S1-AR-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(3, 2, 'Televisão', 'LG Smart TV 43\"', 'S2-TV-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(4, 2, 'Ar-condicionado', 'Philco Inverter 9000 BTU', 'S2-AR-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(5, 3, 'Televisão', 'Philips 4K 50\"', 'S3-TV-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(6, 3, 'Ar-condicionado', 'Samsung WindFree 12000 BTU', 'S3-AR-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(7, 4, 'Impressora', 'HP LaserJet Pro MFP M428fdw', 'REC-IMP-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(8, 4, 'Ar-condicionado', 'LG Dual Inverter 12000 BTU', 'REC-AR-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(9, 4, 'Televisão', 'Samsung Smart TV 43\"', 'REC-TV-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(10, 5, 'Impressora', 'Epson EcoTank L3250', 'COORD-IMP-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(11, 5, 'Ar-condicionado', 'Samsung WindFree 18000 BTU', 'COORD-AR-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(12, 5, 'Televisão', 'LG UHD 55\"', 'COORD-TV-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(13, 6, 'Impressora', 'Canon MegaTank G3160', 'PROF-IMP-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(14, 6, 'Ar-condicionado', 'Philco Inverter 12000 BTU', 'PROF-AR-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(15, 6, 'Televisão', 'Philips Ambilight 50\"', 'PROF-TV-001', 'Funcionando', '2025-10-20 00:01:09', '2025-10-20 00:01:09');

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacao`
--

CREATE TABLE `avaliacao` (
  `id` int(11) NOT NULL,
  `chamado_id` int(11) NOT NULL,
  `nota` tinyint(4) NOT NULL,
  `comentario` text DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria_chamado`
--

CREATE TABLE `categoria_chamado` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `chamado`
--

CREATE TABLE `chamado` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `data_abertura` datetime NOT NULL DEFAULT current_timestamp(),
  `categoria` enum('Rede','Hardware','Software','Periféricos','Impressora','Usuário','Infraestrutura','Segurança','Outros') DEFAULT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `localizacao` varchar(150) DEFAULT NULL,
  `urgencia` enum('Baixa','Média','Alta') DEFAULT NULL,
  `status` enum('Pendente','Em Andamento','Resolvido') DEFAULT 'Pendente',
  `computador_id` int(11) DEFAULT NULL,
  `aparelhos_id` int(11) DEFAULT NULL,
  `sala_id` int(11) DEFAULT NULL,
  `patrimonio` varchar(50) DEFAULT NULL,
  `tecnico_responsavel_id` int(11) DEFAULT NULL,
  `observacao_tecnico` text DEFAULT NULL,
  `prazo_resolucao` datetime DEFAULT NULL,
  `data_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `usuario_nome` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `chamado`
--

INSERT INTO `chamado` (`id`, `usuario_id`, `data_abertura`, `categoria`, `titulo`, `descricao`, `localizacao`, `urgencia`, `status`, `computador_id`, `aparelhos_id`, `sala_id`, `patrimonio`, `tecnico_responsavel_id`, `observacao_tecnico`, `prazo_resolucao`, `data_atualizacao`, `usuario_nome`) VALUES
(28, 2, '2025-10-21 09:57:49', 'Rede', 'Estamos sem Internet', 'Cabo de Rede Quebrado ', NULL, 'Alta', 'Resolvido', 67, NULL, 4, NULL, 5, 'Resolvido, troquei o cabo', NULL, '2025-10-23 15:30:36', NULL),
(29, 2, '2025-10-21 09:58:26', 'Outros', 'Sem Cabo HDMI', 'Tv sem Cabo HDMI ', NULL, 'Média', 'Resolvido', NULL, 12, 5, NULL, 5, 'Já foi colocado um novo', NULL, '2025-10-23 15:26:46', NULL),
(32, 2, '2025-10-21 10:28:29', 'Software', 'Aplicativo', 'Por favor baixe o apk do MySQL Baench', NULL, 'Baixa', 'Resolvido', 57, NULL, 3, NULL, 5, 'Tudo certo, ja foi instalado na máquina', NULL, '2025-10-23 18:21:51', 'Daniel'),
(33, 2, '2025-10-21 10:28:58', 'Hardware', 'Mouse', 'Por favor trocar o mouse, esta quebrado', NULL, 'Baixa', 'Resolvido', 33, NULL, 2, NULL, 5, 'Ja trocado', NULL, '2025-10-23 15:27:14', 'Daniel'),
(34, 2, '2025-10-21 10:29:40', 'Outros', 'Impressora', 'Esta sem tinta, nao tem como fazer impressão', NULL, 'Baixa', 'Resolvido', NULL, 10, 5, NULL, 4, 'Ja trocado os cartuchos', NULL, '2025-10-23 15:27:38', 'Daniel'),
(38, 2, '2025-10-21 11:01:29', 'Hardware', 'Teclado ou mouse não funcionam', 'O teclado parou de responder repentinamente. Tentei desconectar e reconectar, mas o problema persiste. O mouse continua funcionando normalmente. O problema começou hoje, por volta das 14h. O modelo do teclado é um Logitech K120.', NULL, 'Alta', 'Resolvido', 34, NULL, 2, NULL, 5, 'Já instalei novo driver no pc mesa 12', NULL, '2025-10-23 15:31:06', 'Daniel'),
(39, 2, '2025-10-21 11:03:04', 'Outros', 'Impressora não reconhece o computador.', 'A impressora não é mais reconhecida pelo computador. Quando tento imprimir, recebo a mensagem de \'impressora não conectada\' ou \'offline\'. Já verifiquei o cabo USB, reiniciei os dois dispositivos e tentei reinstalar o driver, mas não consegui resolver. O problema começou hoje, por volta das 10h.', NULL, 'Média', 'Resolvido', NULL, 10, 5, NULL, 4, 'Ja verifiquei, esta tudo ok', NULL, '2025-10-23 18:01:50', 'Daniel'),
(40, 2, '2025-10-21 11:47:25', 'Rede', 'Computador muito lento.', 'O computador está extremamente lento e travando constantemente. Os programas demoram muito para abrir, e às vezes recebo a mensagem \'disco em 100%\' no gerenciador de tarefas. Já reiniciei várias vezes, mas o problema não melhora. Suspeito que seja o disco rígido, que já faz barulhos estranhos (estalos) há alguns dias. O problema se agravou na última semana.', NULL, 'Alta', 'Resolvido', 24, NULL, 2, NULL, 4, 'Tudo certo. funcionando 100%', NULL, '2025-10-23 18:02:22', 'Daniel'),
(41, NULL, '2025-10-23 14:48:17', 'Usuário', 'Problemas de Usuário/Senha', 'Nome: Yuri Henrique\nEmail: yuri@conetec.com\nTelefone: 11 995921128\nMatrícula: 20200\nEstou sem acesso ao meu login, pfv reset minha senha', NULL, 'Alta', 'Resolvido', NULL, NULL, NULL, NULL, 4, 'Usuario resetado, senha padrão', NULL, '2025-10-23 16:52:49', 'Yuri Henrique'),
(42, 3, '2025-10-23 17:08:32', 'Hardware', 'Som', 'Caixinha de som não está funcionando', NULL, 'Baixa', 'Resolvido', 68, NULL, 4, NULL, 5, 'Resolvido', NULL, '2025-10-23 18:19:54', 'Tina'),
(43, 3, '2025-10-23 18:23:44', 'Hardware', 'Computador com ruído estranho	', 'Ruído alto vindo do cooler do computador.', NULL, 'Baixa', 'Pendente', 9, NULL, 1, NULL, NULL, NULL, NULL, '2025-10-23 18:23:44', 'Tina'),
(44, 3, '2025-10-23 18:24:08', 'Software', 'Erro ao iniciar o Windows	', 'Mensagem de erro durante a inicialização do sistema.', NULL, 'Alta', 'Pendente', 25, NULL, 2, NULL, NULL, NULL, NULL, '2025-10-23 18:24:08', 'Tina'),
(45, 3, '2025-10-23 18:24:34', 'Software', 'Sistema travando com frequência	', 'Sistema operacional apresenta lentidão e travamentos constantes.', NULL, 'Média', 'Pendente', 70, NULL, 5, NULL, NULL, NULL, NULL, '2025-10-23 18:24:34', 'Tina'),
(46, 3, '2025-10-23 18:25:09', 'Hardware', 'Monitor com tela piscando', 'Monitor apresenta piscadas constantes após 10 minutos de uso.', NULL, 'Média', 'Pendente', 36, NULL, 2, NULL, NULL, NULL, NULL, '2025-10-23 18:25:09', 'Tina');

-- --------------------------------------------------------

--
-- Estrutura para tabela `computador`
--

CREATE TABLE `computador` (
  `id` int(11) NOT NULL,
  `numero_mesa` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `patrimonio_monitor` varchar(50) NOT NULL,
  `patrimonio_cpu` varchar(50) NOT NULL,
  `numero_serie` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `sala_id` int(11) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `computador`
--

INSERT INTO `computador` (`id`, `numero_mesa`, `modelo`, `patrimonio_monitor`, `patrimonio_cpu`, `numero_serie`, `status`, `sala_id`, `criado_em`, `atualizado_em`) VALUES
(1, 'PC-Professor', 'Lenovo', '1324842', '1324702', 'PE089635', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(2, '1', 'Lenovo', '1324837', '1324696', 'PE089GSZ', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(3, '2', 'Lenovo', '1324838', '1324697', 'PE089GT6', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(4, '3', 'Lenovo', '1324839', '1324698', 'PE08962R', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(5, '4', 'Lenovo', '1324840', '1324699', 'PE089632', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(6, '5', 'Lenovo', '1324841', '1324700', 'PE08962D', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(7, '6', 'Lenovo', '1324843', '1324703', 'PE089629', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(8, '7', 'Lenovo', '1324844', '1324704', 'PE089609', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(9, '8', 'Lenovo', '1324845', '1324705', 'PE089GSQ', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(10, '9', 'Lenovo', '1324846', '1324706', 'PE089GT9', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(11, '10', 'Lenovo', '1324847', '1324707', 'PE089642', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(12, '11', 'Lenovo', '1324850', '1324710', 'PE089GTD', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(13, '12', 'Lenovo', '1324851', '1324711', 'PE08960Q', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(14, '13', 'Lenovo', '1324852', '1324712', 'PE089GTT', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(15, '14', 'Lenovo', '1324853', '1324713', 'PE089GTR', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(16, '15', 'Lenovo', '1324854', '1324714', 'PE089GTO', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(17, '16', 'Lenovo', '1324848', '1324708', 'PE089GTF', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(18, '17', 'Lenovo', '1324836', '1324701', 'PE089GVG', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(19, '18', 'Lenovo', '1324849', '1324709', 'PE089GTG', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(20, '19', 'Lenovo', '1324768', '1324716', 'PE089GVH', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(21, '20', 'Lenovo', '1324855', '1324715', 'PE0896OL', NULL, 1, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(22, 'PC-Professor', 'Lenovo', '1324770', '1324725', 'PE08962B', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(23, '1', 'Lenovo', '1324772', '1324727', 'PE089GRA', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(24, '2', 'Lenovo', '1324773', '1324728', 'PE089GTC', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(25, '3', 'Lenovo', '1324774', '1324729', 'PE0895WB', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(26, '4', 'Lenovo', '1324775', '1324730', 'PE0895W1', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(27, '5', 'Lenovo', '1324776', '1324731', 'PE08966T', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(28, '6', 'Lenovo', '1324781', '1324736', 'PE089GTW', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(29, '7', 'Lenovo', '1324780', '1324735', 'PE089GTQ', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(30, '8', 'Lenovo', '1324779', '1324734', 'PE08963R', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(31, '9', 'Lenovo', '1324773', '1324733', 'PE08963Q', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(32, '10', 'Lenovo', '1324777', '1324732', 'PE089GTJ', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(33, '11', 'Lenovo', '1324782', '1324737', 'PE08963J', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(34, '12', 'Lenovo', '1324783', '1324738', 'PE089GS6', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(35, '13', 'Lenovo', '1324784', '1324739', 'PE08966Q', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(36, '14', 'Lenovo', '1324785', '1324740', 'PE089GWS', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(37, '15', 'Lenovo', '1324786', '1324741', 'PE0966S', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(38, '16', 'Lenovo', '1324771', '1324726', 'PE08963K', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(39, '17', 'Lenovo', '1324788', '1324744', 'PE089GT4', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(40, '18', 'Lenovo', '1324789', '1324746', 'PE0895N2', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(41, '19', 'Lenovo', '1324790', '1324743', 'PE089630', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(42, '20', 'Lenovo', '1324791', '1324742', 'PE089634', NULL, 2, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(43, 'PC-Professor', 'Lenovo', '1324792', '1324747', 'PE089GVJ', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(44, '1', 'Lenovo', '1324793', '1324748', 'PE089GT7', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(45, '2', 'Lenovo', '1324794', '1324749', 'PE0895WA', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(46, '3', 'Lenovo', '1324795', '1324750', 'PE089GVC', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(47, '4', 'Lenovo', '1324796', '1324751', 'PE089GTK', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(48, '5', 'Lenovo', '1324797', '1324752', 'PE089GV2', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(49, '6', 'Lenovo', '1324770', '1324725', 'PE08962B', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(50, '7', 'Lenovo', '1324803', '1324758', 'PE089GSX', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(51, '8', 'Lenovo', '1324802', '1324757', 'PE089GV6', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(52, '9', 'Lenovo', '1324801', '1324756', 'PE089GVF', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(53, '10', 'Lenovo', '1324800', '1324755', 'PE08966K', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(54, '11', 'Lenovo', '1324799', '1324754', 'PE08963M', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(55, '12', 'Lenovo', '1324805', '1324760', 'PE0896GTY', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(56, '13', 'Lenovo', '1324806', '1324761', 'PE089GVA', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(57, '14', 'Lenovo', '1324807', '1324762', 'PE08962H', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(58, '15', 'Lenovo', '1324808', '1324763', 'PE0896VV', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(59, '16', 'Lenovo', '1324809', '1324764', 'PE08963N', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(60, '17', 'Lenovo', '1324798', '1324753', 'PE0896GS1', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(61, '18', 'Lenovo', '1324804', '1324759', 'PE08966V', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(62, '19', 'Lenovo', '1324792', '1324718', 'PE089626', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(63, '20', 'Lenovo', '', '1324719', 'PE08962K', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(64, '21', 'Lenovo', '', '1324767', 'PE08960M', NULL, 3, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(65, '1', 'Lenovo', '1324816', '1324676', 'PE089GTS', NULL, 4, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(66, '2', 'Lenovo', '1324818', '1324678', 'PE089GVD', NULL, 4, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(67, '3', 'Lenovo', '1324817', '1324687', 'PE0895Q', NULL, 4, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(68, '4', 'Lenovo', '1324819', '1324679', 'PE089GSG', NULL, 4, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(69, '1', 'Lenovo', '1324823', '1324681', 'PE089GTL', NULL, 5, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(70, '2', 'Lenovo', '000000', '1391484', '000000', NULL, 5, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(71, '3', 'Lenovo', '1324822', '1324682', 'PE089GT8', NULL, 5, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(72, '4', 'Lenovo', '1324820', '1324680', 'PE089GVN', NULL, 5, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(73, '1', 'Lenovo', '1324811', '1324677', 'PE089GTV', NULL, 6, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(74, '2', 'Lenovo', '1324826', '1324686', 'PE089GVK', NULL, 6, '2025-10-20 00:01:09', '2025-10-20 00:01:09'),
(75, '1', 'Notebook', '-', '-', '1391496', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(76, '2', 'Notebook', '-', '-', '1391485', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(77, '3', 'Notebook', '-', '-', '-', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(78, '4', 'Notebook', '-', '-', '-', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(79, '5', 'Notebook', '-', '-', '1391489', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(80, '6', 'Notebook', '-', '-', '1391486', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(81, '7', 'Notebook', '-', '-', '1391492', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(82, '8', 'Notebook', '-', '-', '-', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(83, '9', 'Notebook', '-', '-', '1391495', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(84, '10', 'Notebook', '-', '-', '-', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(85, '11', 'Notebook', '-', '-', '1409500', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(86, '12', 'Notebook', '-', '-', '1409501', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(87, '13', 'Notebook', '-', '-', '-', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(88, '14', 'Notebook', '-', '-', '13914', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25'),
(89, '15', 'Notebook', '-', '-', '1391482', NULL, 7, '2025-10-23 18:49:25', '2025-10-23 18:49:25');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico`
--

CREATE TABLE `historico` (
  `id` int(11) NOT NULL,
  `chamado_id` int(11) NOT NULL,
  `tecnico_id` int(11) DEFAULT NULL,
  `status_novo` varchar(50) DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  `data_hora` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `historico`
--

INSERT INTO `historico` (`id`, `chamado_id`, `tecnico_id`, `status_novo`, `observacao`, `data_hora`) VALUES
(4, 28, 5, 'Em Andamento', 'Ja estou verificando o motivo', '2025-10-23 15:26:34'),
(5, 29, 5, 'Resolvido', 'Já foi colocado um novo', '2025-10-23 15:26:46'),
(6, 32, 5, 'Em Andamento', 'Vou verificar peço que aguarde', '2025-10-23 15:27:00'),
(7, 33, 5, 'Resolvido', 'Ja trocado', '2025-10-23 15:27:14'),
(8, 34, 4, 'Resolvido', 'Ja trocado os cartuchos', '2025-10-23 15:27:38'),
(9, 38, 4, 'Em Andamento', 'Verificar instalação de driver', '2025-10-23 15:28:07'),
(10, 39, 4, 'Em Andamento', 'Verificar instalação de driver', '2025-10-23 15:28:22'),
(11, 28, 5, 'Resolvido', 'Resolvido, troquei o cabo', '2025-10-23 15:30:36'),
(12, 38, 5, 'Em Andamento', 'Já instalei novo driver no pc mesa 12', '2025-10-23 15:30:59'),
(13, 38, 5, 'Resolvido', 'Já instalei novo driver no pc mesa 12', '2025-10-23 15:31:06'),
(14, 41, 5, 'Em Andamento', 'Estou a verificar', '2025-10-23 16:51:14'),
(15, 40, 4, 'Em Andamento', 'Irei realizar uma limpeza no mesmo', '2025-10-23 16:52:30'),
(16, 41, 4, 'Resolvido', 'Usuario resetado, senha padrão', '2025-10-23 16:52:49'),
(17, 42, 4, 'Em Andamento', 'Vou verificar', '2025-10-23 18:01:23'),
(18, 39, 4, 'Resolvido', 'Verificar instalação de driver', '2025-10-23 18:01:30'),
(19, 39, 4, 'Resolvido', 'Ja verifiquei, esta tudo ok', '2025-10-23 18:01:50'),
(20, 40, 4, 'Resolvido', 'Tudo certo. funcionando 100%', '2025-10-23 18:02:22'),
(21, 42, 5, 'Resolvido', 'Resolvido', '2025-10-23 18:19:54'),
(25, 32, 5, 'Em Andamento', 'Tudo certo, ja foi instalado na máquina', '2025-10-23 18:21:45'),
(26, 32, 5, 'Resolvido', 'Tudo certo, ja foi instalado na máquina', '2025-10-23 18:21:51');

-- --------------------------------------------------------

--
-- Estrutura para tabela `prioridade`
--

CREATE TABLE `prioridade` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `tempo_resolucao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sala`
--

CREATE TABLE `sala` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `sala`
--

INSERT INTO `sala` (`id`, `nome`, `descricao`, `criado_em`, `atualizado_em`) VALUES
(1, 'Sala 1', 'Laboratório de Informática', '2025-10-20 00:00:15', '2025-10-20 00:00:15'),
(2, 'Sala 2', 'Laboratório de Informática', '2025-10-20 00:00:15', '2025-10-20 00:00:15'),
(3, 'Sala 3', 'Laboratório de Informática', '2025-10-20 00:00:15', '2025-10-20 00:00:15'),
(4, 'Recepção', 'Primeiro Piso', '2025-10-20 00:00:15', '2025-10-20 00:00:15'),
(5, 'Sala dos Coordenadores', 'Primeiro Piso', '2025-10-20 00:00:15', '2025-10-20 00:00:15'),
(6, 'Sala dos Professores', 'Primeiro Piso', '2025-10-20 00:00:15', '2025-10-20 00:00:15'),
(7, 'Sala Maker', 'Laboratório com notebooks para aulas práticas.', '2025-10-23 18:44:18', '2025-10-23 18:44:18');

-- --------------------------------------------------------

--
-- Estrutura para tabela `sla`
--

CREATE TABLE `sla` (
  `id` int(11) NOT NULL,
  `urgencia` varchar(50) NOT NULL,
  `horas_limite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('funcionario','tecnico','admin') NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_code` varchar(6) DEFAULT NULL,
  `reset_code_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `email`, `senha`, `tipo`, `ativo`, `criado_em`, `atualizado_em`, `reset_code`, `reset_code_expires`) VALUES
(1, 'Yuri', 'yuri@conetec.com', '$2b$10$/hkkdRu.Tvtlksym7387z.fl2il3ST075J2t/sQytXVPqaFdLR3Me', 'admin', 1, '2025-10-20 00:00:55', '2025-11-04 21:24:34', '361217', '2025-11-04 21:39:34'),
(2, 'Daniel', 'daniel@conetec.com', '$2b$10$TLfSPilsiqUCJIy/ULwBkuwzEG6IGad.nzoGxUV86uF6xGCP32RpC', 'funcionario', 1, '2025-10-20 00:00:56', '2025-10-20 00:00:56', NULL, NULL),
(3, 'Tina', 'tina@conetec.com', '$2b$10$jFOZAZmxMronXvK.D6QiYOnEt/CKz8kPmMPkdOMQtkg9HmX3jubY6', 'funcionario', 1, '2025-10-20 00:00:56', '2025-11-04 20:50:38', NULL, NULL),
(4, 'Ana', 'ana@conetec.com', '$2b$10$melvEsjfQxV0LOlo.nUCmOzmEP5K1YmvWheYZC0QHTMAXZrOrnAx2', 'tecnico', 1, '2025-10-20 00:00:56', '2025-10-20 00:00:56', NULL, NULL),
(5, 'Isa', 'isa@conetec.com', '$2b$10$GDgaMwkWivQPeONRZioY0.yQoxR1U0woCf3vIR6p8lEd77rs28W5q', 'tecnico', 1, '2025-10-20 00:00:56', '2025-10-20 00:00:56', NULL, NULL),
(6, 'Yuri', 'yuridelara@hotmail.com', '$2b$10$oP9vZqBrq5nYh3y/0iKxbeAs/uKVdXUc/LUTxRnxyZKRfLx7CU9MG', 'admin', 1, '2025-11-04 21:25:25', '2025-11-04 21:31:35', '748417', '2025-11-04 21:46:35'),
(7, 'Yuri icloud', 'yurimarques1962@icloud.com', '$2b$10$/S9C.ZPkRf/Q653rxN0Kc.WhBX.b5uxijbRAhgLxdv5gLVvJ.QCLm', 'admin', 1, '2025-11-04 21:49:46', '2025-11-04 22:01:38', NULL, NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `anexo`
--
ALTER TABLE `anexo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chamado_id` (`chamado_id`);

--
-- Índices de tabela `aparelhos`
--
ALTER TABLE `aparelhos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sala_id` (`sala_id`);

--
-- Índices de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chamado_id` (`chamado_id`);

--
-- Índices de tabela `categoria_chamado`
--
ALTER TABLE `categoria_chamado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `chamado`
--
ALTER TABLE `chamado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `tecnico_responsavel_id` (`tecnico_responsavel_id`),
  ADD KEY `computador_id` (`computador_id`),
  ADD KEY `sala_id` (`sala_id`),
  ADD KEY `aparelhos_id` (`aparelhos_id`);

--
-- Índices de tabela `computador`
--
ALTER TABLE `computador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sala_id` (`sala_id`);

--
-- Índices de tabela `historico`
--
ALTER TABLE `historico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_historico_chamado` (`chamado_id`),
  ADD KEY `fk_historico_tecnico` (`tecnico_id`);

--
-- Índices de tabela `prioridade`
--
ALTER TABLE `prioridade`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `sala`
--
ALTER TABLE `sala`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `sla`
--
ALTER TABLE `sla`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `anexo`
--
ALTER TABLE `anexo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `aparelhos`
--
ALTER TABLE `aparelhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `categoria_chamado`
--
ALTER TABLE `categoria_chamado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `chamado`
--
ALTER TABLE `chamado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de tabela `computador`
--
ALTER TABLE `computador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de tabela `historico`
--
ALTER TABLE `historico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de tabela `prioridade`
--
ALTER TABLE `prioridade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `sala`
--
ALTER TABLE `sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `sla`
--
ALTER TABLE `sla`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `anexo`
--
ALTER TABLE `anexo`
  ADD CONSTRAINT `anexo_ibfk_1` FOREIGN KEY (`chamado_id`) REFERENCES `chamado` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `aparelhos`
--
ALTER TABLE `aparelhos`
  ADD CONSTRAINT `aparelhos_ibfk_1` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`chamado_id`) REFERENCES `chamado` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `chamado`
--
ALTER TABLE `chamado`
  ADD CONSTRAINT `chamado_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chamado_ibfk_2` FOREIGN KEY (`tecnico_responsavel_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chamado_ibfk_3` FOREIGN KEY (`computador_id`) REFERENCES `computador` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chamado_ibfk_4` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chamado_ibfk_5` FOREIGN KEY (`aparelhos_id`) REFERENCES `aparelhos` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `computador`
--
ALTER TABLE `computador`
  ADD CONSTRAINT `computador_ibfk_1` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `historico`
--
ALTER TABLE `historico`
  ADD CONSTRAINT `fk_historico_chamado` FOREIGN KEY (`chamado_id`) REFERENCES `chamado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_historico_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
