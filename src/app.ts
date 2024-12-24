const search = document.querySelector("#search") as HTMLFormElement;
const searchValue = document.querySelector(
  "#currency-search"
) as HTMLFormElement;

search.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (searchValue.value.length < 3) {
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
      e.key.toLowerCase() === searchValue.value.toLowerCase() ||
      e.value.toLowerCase() === searchValue.value.toLowerCase()
    ) {
      check.push(e);
    }
  });

  if (!check[0]) {
    return (search.style.borderColor = "red");
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
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch currency data");
  //   }
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

      console.log(dataItem);

      const price: number = +dataItem.ask;
      const varia: number = +dataItem.pctChange;

      if (varia < 0) {
        arrowVariation.textContent = "trending_down";
        infos.style.backgroundColor = "#de3d3d";
      } else {
        arrowVariation.textContent = "trending_up";
        infos.style.backgroundColor = "#05b577";
      }

      //   var f = price.toLocaleString("pt-br", {
      //     style: "currency",
      //     currency: "BRL",
      //   });
      //   console.log(f);

      //   //sem R$
      //   var f2 = price.toLocaleString("pt-br", { minimumFractionDigits: 2 });
      //   console.log(f2);

      console.log(dataItem.code);

      currency.textContent = `1 ${dataItem.code} equivale à`;

      value.textContent = (+price.toFixed(2)).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
      });
      variation.textContent = `${varia.toFixed(2).replace(".", ",")}%`;
    } else {
      notfound.style.display = "flex";
      result.style.display = "none";
      textNotFound.textContent = `Cotação "${coin}" não encontrada`;
    }

    //   const rates = data.rates;
    //   container.innerHTML = Object.entries(rates)
    //     .map(([currency, rate]) => `<p>${currency}: ${rate.toFixed(2)}</p>`)
    //     .join('');
  } catch (error: any) {
    console.error(error);
    textNotFound.textContent = `Erro ao buscar cotação: ${error.message}`;
    //   container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// displayCurrencies("USD-BRL");
