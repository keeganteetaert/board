// eslint-disable-next-line no-extend-native
Array.prototype.shuffle = function shuffle() {
  const memo = [];
  const initialLength = this.length;
  for (let i = 0; i < initialLength; i += 1) {
    const k = Math.floor(Math.random() * (initialLength - i));
    memo.push(this[k]);
    this.splice(k, 1);
  }
  return memo;
};
