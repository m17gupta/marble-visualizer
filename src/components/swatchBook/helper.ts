export const generateSKU = (arr: any[]) => {
  let final = "";
  for (let i of arr) {
    final += i.split(" ").join("");
  }

  let n = final.length;

  let SKU = "";

  for (let i = 1; i <= 10; i++) {
    let randomIndex = Math.floor(Math.random() * 10);
    if ((i >= 1 && i < 4) || (i >= 6 && i < 9)) {
      SKU += final[randomIndex];
    } else {
      SKU += randomIndex;
    }
  }

  return SKU.toUpperCase();
};
