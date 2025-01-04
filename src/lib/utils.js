export function parseBearer(token) {
  if (token.split(' ')[0] === 'Bearer') {
    return token.split(' ')[1] || null;
  }
  return token.split(' ')[0] || null;
}
