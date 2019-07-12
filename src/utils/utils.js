export const createOrderId = date => {
  let now = Date.now().toString();
  if (now.length < 14) {
    const pad = 14 - now.length;
    now += randomNumber(pad);
  }
  return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join("-");
};

export const randomNumber = length =>{
  return Math.floor(
    Math.pow(10, length - 1) +
    Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  ).toString();
};

export const hashCode = (str) =>{
  var hash = 0;
  var i = 0;
  var char;
  if (str.length == 0) return hash;
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
