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
    const coinsList = yield currencyList("aaa");
    const retorno = Object.keys(coinsList).map((key) => ({
        key,
        value: coinsList[key],
    }));
    console.log(retorno);
    searchValue.value = "";
}));
document.addEventListener("click", () => {
    search.style.borderColor = "";
});
function currencyList(coins) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://economia.awesomeapi.com.br/json/available/uniq");
        if (!response.ok) {
            throw new Error("Failed to fetch currency data");
        }
        const data = response.json();
        return data;
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
        const value = document.querySelector("#currency-in #value");
        try {
            const data = yield currencyData(coin);
            if (data.status === 200) {
                const dataJson = yield data.json();
                const dataKey = Object.keys(dataJson)[0];
                const dataItem = dataJson[dataKey];
                const price = +dataItem.ask;
                value.innerHTML = price.toFixed(2).replace(".", ",");
            }
            else {
            }
        }
        catch (error) {
        }
    });
}
displayCurrencies("USD-BRL");
