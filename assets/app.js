// -------------- para os inputs de valor

const inputValue = document.querySelectorAll('.value-coin input[type="text"]');

inputValue.forEach(element => {
    element.value = '0,00';
    UpInputNumber(element)
})

const number = 123456.789;
console.log(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'BRL' }).format(number));
// saída esperada: "123.456,79 R$"
