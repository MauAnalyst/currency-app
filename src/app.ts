declare const Fuse: any;

const items = [
  { name: "apple", type: "fruit" },
  { name: "banana", type: "fruit" },
  { name: "cherry", type: "fruit" },
  { name: "date", type: "fruit" },
];

const options = {
  keys: ["key", "value"], // Campos para buscar
  threshold: 0.3, // Limite de similaridade
};

const search = document.querySelector("#search") as HTMLFormElement;
const searchValue = document.querySelector(
  "#currency-search"
) as HTMLFormElement;

//realizando pesquisa
search.addEventListener("submit", async (event) => {
  event.preventDefault();

  let Checkvalue: string = searchValue.value.trim();

  if (Checkvalue.length < 2) {
    return (search.style.borderColor = "red");
  }

  const coinsList = await currencyList();

  const coinsArray = Object.keys(coinsList).map((key) => ({
    key,
    value: coinsList[key],
  }));

  let check: { key: string; value: string }[] = [];
  coinsArray.forEach((e) => {
    if (
      e.key.toLowerCase() === Checkvalue.toLowerCase() ||
      e.value.toLowerCase() === Checkvalue.toLowerCase()
    ) {
      check.push(e);
    }
  });

  if (!check[0]) {
    console.log(coinsArray);
    // Cria a instância do Fuse.js
    const fuse = new Fuse(coinsArray, options);

    // Realiza a pesquisa
    const result = fuse.search(Checkvalue.toLowerCase());

    if (result.length > 0) {
      check.push(result[0].item);
    } else {
      return (search.style.borderColor = "red");
    }
  }

  searchValue.value = `${check[0].key} - ${check[0].value}`;

  displayCurrencies(`${check[0].key}-BRL`);
});

document.addEventListener("click", () => {
  search.style.borderColor = "";
});

// --------------- funções

//---- lista de moedas
async function currencyList() {
  const response = await fetch(
    "https://economia.awesomeapi.com.br/json/available/uniq"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch currency data");
  }

  return response.json();
}

//---- buscando cotação moeda
async function currencyData(coins: string) {
  const response = await fetch(
    `https://economia.awesomeapi.com.br/json/last/${coins}`
  );
  return response;
}

//---- adicionando moeda
async function displayCurrencies(coin: string) {
  const result = document.querySelector(".result") as HTMLBodyElement;
  const currency = document.querySelector("#currency") as HTMLBodyElement;
  const value = document.querySelector(
    "#currency-in #value"
  ) as HTMLBodyElement;
  const variation = document.querySelector("#variation") as HTMLBodyElement;
  const arrowVariation = document.querySelector(
    "#arrow-variation"
  ) as HTMLBodyElement;
  const infos = document.querySelector(".infos p") as HTMLBodyElement;

  const notfound = document.querySelector(
    ".result-notfound"
  ) as HTMLBodyElement;
  const textNotFound = document.querySelector(
    "#text-notfound"
  ) as HTMLBodyElement;

  try {
    const data = await currencyData(coin);
    if (data.status === 200) {
      result.style.display = "block";
      notfound.style.display = "none";
      const dataJson = await data.json();
      const dataKey = Object.keys(dataJson)[0];
      const dataItem = dataJson[dataKey];

      const price: number = +dataItem.ask;
      const varia: number = +dataItem.pctChange;

      if (varia < 0) {
        arrowVariation.textContent = "trending_down";
        infos.style.color = "#dc2323";
      } else {
        arrowVariation.textContent = "trending_up";
        infos.style.color = "#0ee190";
      }

      currency.textContent = `1 ${dataItem.code} equivale à`;

      value.textContent = (+price.toFixed(2)).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
      });
      variation.textContent = `${varia.toFixed(2).replace(".", ",")}%`;

      animateNumberFromZero(100);
    } else {
      notfound.style.display = "flex";
      result.style.display = "none";
      textNotFound.textContent = `Cotação "${coin}" não encontrada`;
    }
  } catch (error: any) {
    console.error(error);
    textNotFound.textContent = `Erro ao buscar cotação: ${error.message}`;
  }
}

// displayCurrencies("USD-BRL");

function animateNumberFromZero(duration: number = 2000): void {
  const element = document.getElementById("value") as HTMLBodyElement;
  if (!element) {
    console.error('Element with id "value" not found.');
    return;
  }

  // Obtém o valor atual do elemento e converte para número
  const targetValue = parseFloat(
    element.textContent?.replace(/\./g, "").replace(",", ".") || "0"
  );

  if (isNaN(targetValue)) {
    console.error('The value in "value" is not a valid number.');
    return;
  }

  const startValue = 0;
  const startTime = performance.now();
  const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function update(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentValue = startValue + (targetValue - startValue) * progress;

    element.textContent = formatter.format(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

//nimateNumberFromZero(3000);
