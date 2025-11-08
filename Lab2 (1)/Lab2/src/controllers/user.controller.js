// src/controllers/user.controller.js
let users = [];

/**
 * Devuelve todos los usuarios almacenados
 */
function getAllUsers(req, res) {
  res.json(users);
}

/**
 * Crea un nuevo usuario si se proveen name y email válidos
 */
function createUser(req, res) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
}

// Exporta users también
module.exports = { getAllUsers, createUser, users };