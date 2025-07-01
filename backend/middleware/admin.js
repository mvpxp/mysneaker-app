const admin = (req, res, next) => {
  // 'req.usuario' foi adicionado pelo middleware anterior ('proteger')
  if (req.usuario && req.usuario.role === 'admin') {
    next(); // Continua para a rota se for admin
  } else {
    // Bloqueia o acesso se não for admin
    res.status(403).json({ erro: 'Acesso negado. Requer perfil de administrador.' });
  }
};

module.exports = admin;