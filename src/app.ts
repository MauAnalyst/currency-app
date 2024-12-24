const search = document.querySelector("#search") as HTMLFormElement;
const searchValue = document.querySelector(
  "#currency-search"
) as HTMLFormElement;

search.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (searchValue.value.length < 3) {
    return (search.style.borderColor = "red");
  }

  const coinsList = await currencyList("aaa");

  const retorno = Object.keys(coinsList).map((key) => ({
    key,
    value: coinsList[key],
  }));

  console.log(retorno);

  searchValue.value = "";
});

document.addEventListener("click", () => {
  search.style.borderColor = "";
});

// --------------- funções

//---- lista de moedas
async function currencyList(coins: string) {
  const response = await fetch(
    "https://economia.awesomeapi.com.br/json/available/uniq"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch currency data");
  }

  const data = response.json();

  // const dataKeys = Object.keys(data)
  return data;
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

async function displayCurrencies(coin: string) {
  const result = document.querySelector(".result");
  const value = document.querySelector("#currency-in #value")!;

  try {
    const data = await currencyData(coin);
    if (data.status === 200) {
      const dataJson = await data.json();
      const dataKey = Object.keys(dataJson)[0];
      const dataItem = dataJson[dataKey];

      const price: number = +dataItem.ask;

      value.innerHTML = price.toFixed(2).replace(".", ",");
    } else {
    }

    //   const rates = data.rates;
    //   container.innerHTML = Object.entries(rates)
    //     .map(([currency, rate]) => `<p>${currency}: ${rate.toFixed(2)}</p>`)
    //     .join('');
  } catch (error) {
    //   container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

displayCurrencies("USD-BRL");
