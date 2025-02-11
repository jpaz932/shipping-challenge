create database shipping_challenge;

use shipping_challenge;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    document INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
  	role VARCHAR(255) DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO users (name, document, email, password, is_active, role) 
VALUES ('Admin Test', 123456789, 'admin@example.com', '$2a$10$RMDSzqwgi/Idv999VoW5heTTxTWZHcB/8quEBx7h7P6dQ/4AcQAdW', true, 'Admin');

CREATE TABLE shipments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  dimensions VARCHAR(50) NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'En Espera',
  origin_city VARCHAR(50) NOT NULL,
  destination_city VARCHAR(50) NOT NULL,
  tracking_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE carriers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  vehicle_capacity DECIMAL(10, 2) NOT NULL
);

INSERT INTO carriers (name, phone, vehicle_type, vehicle_capacity) VALUES
('Ana Pérez', '5551234567', 'Furgoneta', 500.00),
('Juan Rodríguez', '5559876543', 'Camión pequeño', 2000.00),
('María Sánchez', '5555555555', 'Moto', 20.00),
('Carlos López', '5551112222', 'Furgoneta', 500.00),
('Sofía Martínez', '5553334444', 'Furgón', 1000.00),
('Pedro González', '5556667777', 'Coche', 100.00),
('Luisa Fernández', '5558889999', 'Camión mediano', 1500.00),
('Javier García', '5550001111', 'Camión con plataforma elevadora', 5000.00),
('Carmen Ruiz', '5552223333', 'Furgoneta', 750.00),
('Miguel Díaz', '5554445555', 'Camión grande', 10000.00);

CREATE TABLE carrier_locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
  	carrier_id INT NOT NULL,
    current_location VARCHAR(50) NOT NULL,
    available BOOLEAN DEFAULT true,
    FOREIGN KEY (carrier_id) REFERENCES carriers(id)
);

INSERT INTO carrier_locations (carrier_id, current_location, available)
VALUES
(1, 'Medellín', true),
(2, 'Bogotá', true),
(3, 'Cali', true),
(4, 'Medellín', true),
(5, 'Barranquilla', true),
(6, 'Pereira', true),
(7, 'Bucaramanga', true),
(8, 'Manizales', true),
(9, 'Medellín', true),
(10, 'Bogotá', true);

CREATE TABLE routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  carrier_id INT NULL,
  status Boolean DEFAULT true,
  FOREIGN KEY (carrier_id) REFERENCES carriers(id) 
);

CREATE TABLE shipment_routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shipment_id INT NOT NULL,
  route_id INT NOT NULL,
  assigned_carrier_id INT NOT NULL,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id),
  FOREIGN KEY (route_id) REFERENCES routes(id),
  FOREIGN KEY (assigned_carrier_id) REFERENCES carriers(id)
);

CREATE TABLE shipment_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shipment_id INT NOT NULL,
  	carrier_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id),
  	FOREIGN KEY (carrier_id) REFERENCES carriers(id)
);
