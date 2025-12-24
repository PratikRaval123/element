const revokedTokens = new Set();

const add = (token, ttlMs = 1000 * 60 * 60 * 24) => {
  revokedTokens.add(token);
  setTimeout(() => revokedTokens.delete(token), ttlMs).unref();
};

const isRevoked = (token) => revokedTokens.has(token);

module.exports = {
  add,
  isRevoked,
};


