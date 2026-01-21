
-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS th_solucoes;
USE th_solucoes;

-- 1. Unidades (Instituições)
CREATE TABLE IF NOT EXISTS institutions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status ENUM('Ativa', 'Desativa') DEFAULT 'Ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Usuários
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    avatar TEXT,
    jobTitle VARCHAR(100),
    institution VARCHAR(100),
    accessibleInstitutions JSON, -- Lista de nomes de unidades permitidas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Grupos de Trabalho (Esquadrões)
CREATE TABLE IF NOT EXISTS user_groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    userIds JSON, -- Lista de IDs de usuários membros
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Projetos Estratégicos
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50),
    institution VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status ENUM('Planejado', 'Em Andamento', 'Concluído', 'Em Pausa') DEFAULT 'Planejado',
    progress INT DEFAULT 0,
    startDate DATE,
    endDate DATE,
    description TEXT,
    responsibleName VARCHAR(100),
    votes_up INT DEFAULT 0,
    votes_down INT DEFAULT 0,
    user_votes_json JSON, -- Detalhes de quem votou: {"userId": {"type": "up", "userName": "..."}}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Log de Auditoria de Decisões (Votos)
CREATE TABLE IF NOT EXISTS votes_log (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50),
    userName VARCHAR(100),
    userAvatar TEXT,
    itemId VARCHAR(50),
    itemName VARCHAR(255),
    itemType VARCHAR(20) DEFAULT 'project',
    voteType ENUM('up', 'down') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS (SEED)
INSERT IGNORE INTO institutions (id, name, status) VALUES 
('i1', 'Matriz Central', 'Ativa'),
('i2', 'Syrius de Campinas', 'Ativa'),
('i3', 'Syrius de Jacutinga', 'Ativa');

INSERT IGNORE INTO users (id, name, email, password, role, avatar, jobTitle, institution, accessibleInstitutions) VALUES 
('u1', 'Diretoria Executiva', 'admin@th.com', 'admin', 'ADMIN', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'Diretor Geral', 'Matriz Central', '["Matriz Central", "Syrius de Campinas", "Syrius de Jacutinga"]');

INSERT IGNORE INTO user_groups (id, name, description, userIds) VALUES 
('g1', 'Gestão Estratégica', 'Grupo de tomada de decisão corporativa', '["u1"]');
