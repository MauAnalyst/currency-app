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
const items = [
    { name: "apple", type: "fruit" },
    { name: "banana", type: "fruit" },
    { name: "cherry", type: "fruit" },
    { name: "date", type: "fruit" },
];
const options = {
    keys: ["key", "value"],
    threshold: 0.3,
};
const search = document.querySelector("#search");
const searchValue = document.querySelector("#currency-search");
search.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    let Checkvalue = searchValue.value.trim();
    if (Checkvalue.length < 2) {
        return (search.style.borderColor = "red");
    }
    const coinsList = yield currencyList();
    const coinsArray = Object.keys(coinsList).map((key) => ({
        key,
        value: coinsList[key],
    }));
    let check = [];
    coinsArray.forEach((e) => {
        if (e.key.toLowerCase() === Checkvalue.toLowerCase() ||
            e.value.toLowerCase() === Checkvalue.toLowerCase()) {
            check.push(e);
        }
    });
    if (!check[0]) {
        console.log(coinsArray);
        const fuse = new Fuse(coinsArray, options);
        const result = fuse.search(Checkvalue.toLowerCase());
        if (result.length > 0) {
            check.push(result[0].item);
        }
        else {
            return (search.style.borderColor = "red");
        }
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
                const price = +dataItem.ask;
                const varia = +dataItem.pctChange;
                if (varia < 0) {
                    arrowVariation.textContent = "trending_down";
                    infos.style.color = "#dc2323";
                }
                else {
                    arrowVariation.textContent = "trending_up";
                    infos.style.color = "#0ee190";
                }
                currency.textContent = `1 ${dataItem.code} equivale à`;
                value.textContent = (+price.toFixed(2)).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                });
                variation.textContent = `${varia.toFixed(2).replace(".", ",")}%`;
                animateNumberFromZero(100);
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
function animateNumberFromZero(duration = 2000) {
    var _a;
    const element = document.getElementById("value");
    if (!element) {
        console.error('Element with id "value" not found.');
        return;
    }
    const targetValue = parseFloat(((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\./g, "").replace(",", ".")) || "0");
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
    function update(currentTime) {
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
