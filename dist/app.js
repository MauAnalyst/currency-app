"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const search = document.querySelector("#search");
const searchValue = document.querySelector("#currency-search");
search.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    if (searchValue.value.length < 3) {
        return (search.style.borderColor = "red");
    }
    const coinsList = yield currencyList();
    const coinsArray = Object.keys(coinsList).map((key) => ({
        key,
        value: coinsList[key],
    }));
    let check = [];
    coinsArray.forEach((e) => {
        if (e.key.toLowerCase() === searchValue.value.toLowerCase() ||
            e.value.toLowerCase() === searchValue.value.toLowerCase()) {
            check.push(e);
        }
    });
    if (!check[0]) {
        return (search.style.borderColor = "red");
    }
    searchValue.value = `${check[0].key} - ${check[0].value}`;
    displayCurrencies(`${check[0].key}-BRL`);
}));
document.addEventListener("click", () => {
    search.style.borderColor = "";
});
function currencyList() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://economia.awesomeapi.com.br/json/available/uniq");
        if (!response.ok) {
            throw new Error("Failed to fetch currency data");
        }
        return response.json();
    });
}
function currencyData(coins) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://economia.awesomeapi.com.br/json/last/${coins}`);
        return response;
    });
}
function displayCurrencies(coin) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = document.querySelector(".result");
        const currency = document.querySelector("#currency");
        const value = document.querySelector("#currency-in #value");
        const variation = document.querySelector("#variation");
        const arrowVariation = document.querySelector("#arrow-variation");
        const infos = document.querySelector(".infos p");
        const notfound = document.querySelector(".result-notfound");
        const textNotFound = document.querySelector("#text-notfound");
        try {
            const data = yield currencyData(coin);
            if (data.status === 200) {
                result.style.display = "block";
                notfound.style.display = "none";
                const dataJson = yield data.json();
                const dataKey = Object.keys(dataJson)[0];
                const dataItem = dataJson[dataKey];
                console.log(dataItem);
                const price = +dataItem.ask;
                const varia = +dataItem.pctChange;
                if (varia < 0) {
                    arrowVariation.textContent = "trending_down";
                    infos.style.backgroundColor = "#de3d3d";
                }
                else {
                    arrowVariation.textContent = "trending_up";
                    infos.style.backgroundColor = "#05b577";
                }
                console.log(dataItem.code);
                currency.textContent = `1 ${dataItem.code} equivale à`;
                value.textContent = (+price.toFixed(2)).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                });
                variation.textContent = `${varia.toFixed(2).replace(".", ",")}%`;
            }
            else {
                notfound.style.display = "flex";
                result.style.display = "none";
                textNotFound.textContent = `Cotação "${coin}" não encontrada`;
            }
        }
        catch (error) {
            console.error(error);
            textNotFound.textContent = `Erro ao buscar cotação: ${error.message}`;
        }
    });
}
