// -------------- para os inputs de valor

const inputValue = document.querySelectorAll('.value-coin input[type="text"]');

inputValue.forEach(element => {
    element.value = '0,00';
    UpInputNumber(element);
});



// seleção de moedas

//----------- primeiro input
function clickcoinIn(){
    const selectCoinIn = document.querySelector('#converte-in .select-coin .input-coin');
    const iconSelectIn = document.querySelector('#converte-in .select-coin .input-coin .material-symbols-outlined');
    const inputIn = document.querySelector('#converte-in .select-coin .input-coin input[type="text"]');
    const optionsCoinIn = document.querySelector('#converte-in .options-coin');
    const optionCoinIn = document.querySelectorAll('#converte-in .options-coin li');

    selectCoinIn.addEventListener('click', ()=>{
        optionsCoinIn.style.display = 'block';
        iconSelectIn.style.transform = 'rotate(-180deg)'
    });

    optionCoinIn.forEach(element => {
        element.addEventListener('click',()=>{
            inputIn.value = element.textContent;
            optionsCoinIn.style.display = 'none';
            iconSelectIn.style.transform = 'rotate(0deg)'
        });
    });

    document.addEventListener('click', (event)=>{
        if(!selectCoinIn.contains(event.target) && !optionsCoinIn.contains(event.target)){
            optionsCoinIn.style.display = 'none';
            iconSelectIn.style.transform = 'rotate(0deg)'
        };
    });
}


//----------- segundo input
function clickCoinOut(){
    const selectCoinOut = document.querySelector('#converte-out .select-coin .input-coin');
    const iconSelectOut = document.querySelector('#converte-out .select-coin .input-coin .material-symbols-outlined');
    const inputOut = document.querySelector('#converte-out .select-coin .input-coin input[type="text"]');
    const optionsCoinOut = document.querySelector('#converte-out .options-coin');
    const optionCoinOut = document.querySelectorAll('#converte-out .options-coin li');

    selectCoinOut.addEventListener('click', ()=>{
        optionsCoinOut.style.display = 'block';
        iconSelectOut.style.transform = 'rotate(-180deg)'
    });

    optionCoinOut.forEach(element => {
        element.addEventListener('click',()=>{
            inputOut.value = element.textContent;
            optionsCoinOut.style.display = 'none';
            iconSelectOut.style.transform = 'rotate(0deg)'
        });
    });

    document.addEventListener('click', (event)=>{
        if(!selectCoinOut.contains(event.target) && !optionsCoinOut.contains(event.target)){
            optionsCoinOut.style.display = 'none';
            iconSelectOut.style.transform = 'rotate(0deg)'
        };
    });
}

//adicionando dados nos input
NameMoedas().then(data => {
    const dados = JSON.parse(JSON.stringify(Object.entries(data)));


    function ListaMoedas(){
        html = '';
        dados.forEach(e => {
            html += `<li>${e[0]} - ${e[1]}</li>`
        });

        document.querySelector('#converte-in .options-coin').innerHTML = html;
        document.querySelector('#converte-out .options-coin').innerHTML = html;
        
    };
    

    ListaMoedas();
    clickcoinIn();
    clickCoinOut();


    /*function SearchCoin(value) {
        let html = '';
        const filteredData = dados.filter(element => {
            const text = `${element[0]} - ${element[1]}`;
            return element[0].startsWith(value, 0) ||
                   removerAcentos(element[1]).toUpperCase().startsWith(value, 0) ||
                   text.toUpperCase().includes(value);
        });
        if (filteredData.length === 0) {
            html = '<li>Não encontrado</li>';
        } else {
            html = filteredData.map(element => `<li>${element[0]} - ${element[1]}</li>`).join('');
        }
        OptionsCoinG.innerHTML = html;
    } */
}); 



//
const number = 123456.789;
console.log(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'BRL' }).format(number));
// saída esperada: "123.456,79 R$"
