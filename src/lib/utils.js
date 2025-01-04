export function parseBearer(token) {
  return token.split(' ')[1] || null;
}