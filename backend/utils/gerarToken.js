const jwt = require('jsonwebtoken');

function gerarToken(usuario) {
  return jwt.sign(
    // Adicione o perfil (role) ao payload do token
    { id: usuario._id, email: usuario.email, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

module.exports = gerarToken;