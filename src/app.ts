declare const Fuse: any;

const body = document.querySelector("body") as HTMLElement;
body.style.opacity = "0";

setTimeout(() => {
  body.style.opacity = "1";
  document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector("#search") as HTMLFormElement;

    // moedas de pesquisa

    const currencySearch = document.querySelector(
      "#currency-search"
    ) as HTMLFormElement;
    const currencyOptions = document.querySelector(
      "#currency-options"
    ) as HTMLFormElement;

    currencySearch.addEventListener("input", async (event: any) => {
      currencyOptions.style.display = "block";
      if (currencySearch.value === "") {
        currencyOptions.style.display = "none";
      }

      const coinsList = await currencyList();

      const coinsArray = Object.keys(coinsList).map((key) => ({
        key,
        value: coinsList[key],
      }));

      const options = {
        keys: ["key", "value"], // campos para buscar
        threshold: 0.3, // similaridade
      };

      const fuse = new Fuse(coinsArray, options);

      // verificando a similaridade
      const result = fuse.search(currencySearch.value.toLowerCase());

      let html: string = "";
      if (result.length > 0) {
        result.forEach((e: { item: { key: string; value: string } }) => {
          html += `<li>${e.item.key} - ${e.item.value}</li>`;
        });
      } else {
        html = "<li>Moeda não encontrada</li>";
      }
      currencyOptions.innerHTML = html;

      const currencyOption = document.querySelectorAll(
        "#currency-options li"
      ) as NodeListOf<HTMLLIElement>;
      currencyOption.forEach((e) => {
        e.addEventListener("click", async () => {
          currencySearch.value = e.textContent;
          currencyOptions.style.display = "none";

          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });
          search.dispatchEvent(submitEvent);
        });
      });
    });

    document.addEventListener("click", (event: MouseEvent) => {
      search.style.borderColor = "";

      if (
        !search.contains(event.target as Node) &&
        !currencyOptions.contains(event.target as Node)
      ) {
        currencyOptions.style.display = "none";
      }
    });

    //realizando pesquisa
    search.addEventListener("submit", async (event) => {
      event.preventDefault();
      currencyOptions.style.display = "none";

      const searchValue = document.querySelector(
        "#currency-search"
      ) as HTMLFormElement;

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
        const currency = `${e.key} - ${e.value}`;
        if (
          e.key.toLowerCase() === Checkvalue.toLowerCase() ||
          e.value.toLowerCase() === Checkvalue.toLowerCase() ||
          currency.toLowerCase() === Checkvalue.toLowerCase()
        ) {
          check.push(e);
        }
      });

      if (!check[0]) {
        const options = {
          keys: ["key", "value"], // campos para buscar
          threshold: 0.3, // similaridade
        };

        const fuse = new Fuse(coinsArray, options);

        // verificando a similaridade
        const result = fuse.search(Checkvalue.toLowerCase());

        if (result.length > 0) {
          //pega o primeiro mais similar
          check.push(result[0].item);
        } else {
          return (search.style.borderColor = "red");
        }
      }

      searchValue.value = `${check[0].key} - ${check[0].value}`;

      displayCurrencies(`${check[0].key}-${checkCurrencyBase()}`);
    });

    // editando moeda base
    const baseCurrency = document.querySelector(
      "#base-currency"
    ) as HTMLBodyElement;
    const buttonEdit = document.querySelector(
      "#button-edit"
    ) as HTMLBodyElement;
    const background = document.querySelector(".background") as HTMLBodyElement;
    const containerEdit = document.querySelector(
      ".edit-base"
    ) as HTMLBodyElement;
    const closeContainer = document.querySelector("#close") as HTMLBodyElement;
    const formEdit = document.querySelector("#form-edit") as HTMLFormElement;

    buttonEdit.addEventListener("click", async () => {
      const formOptions = document.querySelector(
        "#change-baseCurrency"
      ) as HTMLFormElement;
      const baseCurrency = document.querySelector(
        "#base-currency"
      ) as HTMLBodyElement;

      background.style.display = "block";
      containerEdit.style.display = "flex";
      setTimeout(() => {
        containerEdit.classList.add("slow");
      }, 50);

      const coinsList = await currencyList();

      const coinsArray = Object.keys(coinsList).map((key) => ({
        key,
        value: coinsList[key],
      }));

      let html = `<option value="${baseCurrency.textContent}" > ${baseCurrency.textContent} </option>`;
      coinsArray.forEach((e) => {
        html += `<option value="${e.key} - ${e.value}">${e.key} - ${e.value}</option>`;
      });

      formOptions.innerHTML = html;
    });

    closeContainer.addEventListener("click", () => {
      background.style.display = "none";
      containerEdit.style.display = "none";
      containerEdit.classList.remove("slow");
    });

    // background.addEventListener("click", () => {
    //   background.style.display = "none";
    //   containerEdit.style.display = "none";
    //   containerEdit.classList.remove("slow");
    // });

    //adicionado moeda base
    formEdit.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formOptions = document.querySelector(
        "#change-baseCurrency"
      ) as HTMLFormElement;
      const acronym = document.querySelector(
        "#name-currency"
      ) as HTMLFormElement;
      const searchValue = document.querySelector(
        "#currency-search"
      ) as HTMLFormElement;

      background.style.display = "none";
      containerEdit.style.display = "none";
      containerEdit.classList.remove("slow");

      const baseCurrency = document.querySelector(
        "#base-currency"
      ) as HTMLBodyElement;

      baseCurrency.textContent = formOptions.value;

      acronym.textContent = `${checkCurrencyBase()}`;

      console.log("valor da pesquisa", searchValue.value);

      if (searchValue.value) {
        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        search.dispatchEvent(submitEvent);
      }
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

    //buscando moeda base

    function checkCurrencyBase() {
      const baseCurrency = document.querySelector(
        "#base-currency"
      ) as HTMLBodyElement;

      return baseCurrency.textContent?.split(" ")[0];
    }
  });
}, 300);
