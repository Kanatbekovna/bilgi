CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  country_city VARCHAR(255), 
  academic_degree VARCHAR(255),
  academic_title VARCHAR(255), 
  workplace VARCHAR(500), -- иштеген же окуган жери
  position_status VARCHAR(255), -- кызмат / статусу
  academic_competencies VARCHAR(255), -- илимий компетенциясынын багыты
  research_interests TEXT, -- илимий кызыкчылыктарынын багыты
  phone VARCHAR(50), -- телефон номери
  extra_info TEXT, -- кошумча маалымат
  profile_file_path VARCHAR(500), -- жүктөлгөн файлдын жолү
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  keywords TEXT,
  pdf_path VARCHAR(500),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
