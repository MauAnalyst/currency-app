/*------------------------ melhorando o input do valor */

function UpInputNumber(valorInput){ 
    //digitando no input
    valorInput.addEventListener("input", function(event) {
        const regex = /^[0-9.,]*$/;
        if (!event.data.match(regex)){
            return valorInput.value = '0,00';
            //console.log('caiu aq?')
        }
        let valorDigitado = valorInput.value.trim().replace(/[^0-9]/g, "");
        //let valueCalc = valorInput.value.replace(',','.')

        //console.log(valueCalc);
        // console.log(valorInput.value.split(',')[1][0] + ',' + valorInput.value.split(',')[1][2])
        //console.log(event.data)


        if (valorDigitado.startsWith("000", 0) || valorDigitado.length == 1) {
            digitoAnterior = event.data;
            return valorInput.value = "0,0" + event.data;

        } else if (valorDigitado.startsWith("00", 0)) {

            return valorInput.value = "0," + digitoAnterior + event.data; 
            
            
        } else {
            if (valorDigitado.length > 2) {
                valorDigitado = valorDigitado.replace(/^0+/, '');
            }
            
            let parteInteira = valorDigitado.slice(0, -2) || "0";
            let parteDecimal = valorDigitado.slice(-2);

            parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');  

            if (parteInteira.length < 2) {
                parteInteira = "" + parteInteira;
            }
            
            valorInput.value = parteInteira + "," + parteDecimal;
        }

        
    });

    //deletando input
    valorInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
            console.log(valorInput.value)
            e.preventDefault(); // Evita o comportamento padrão do Backspace
            let valor = valorInput.value.replace(/[^0-9]/g, "");
            if (valor.length > 0) {
                valor = valor.slice(0, -1);
                valorInput.value = valor;
                
                // Ajusta o formato
                if (valor.length === 0) {
                    valorInput.value = "0,00";
                } else if (valor.length === 1) {
                    valorInput.value = "0,0" + valor;
                } else if (valor.length === 2) {
                    valorInput.value = "0," + valor;
                } else if (valor.length > 2) {
                    valor = valor.replace(/^0+/, '');
                    let parteInteira = valor.slice(0, -2) || "0";
                    let parteDecimal = valor.slice(-2);
                    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    valorInput.value = parteInteira + "," + parteDecimal;
                }
            } /*else {
                valorInput.value = "0,00";
            } */
        }
    });
    
};

//formantando valores numericos
function FormataValor(number){
    let transfSrc = `${parseInt(number)}`;
    if(transfSrc.length < 4){ //999
        let src = `${number.toFixed(2)}`;

        return src.replace(".",",");

    } else if(transfSrc.length === 4 && transfSrc.length < 5){ //1.000
        let src = `${number.toFixed(2)}`;
        let srcAntes = src.substring(0,1);
        let srcDps = src.substring(1, src.length).replace(".",",");
        let vlFinal = `${srcAntes}.${srcDps}`;
        
        return vlFinal;

    } else if (transfSrc.length === 5 && transfSrc.length < 6){
        let src = `${number.toFixed(2)}`;
        let srcAntes = src.substring(0,2);
        let srcDps = src.substring(2, src.length).replace(".",",");
        let vlFinal = `${srcAntes}.${srcDps}`;
        
        return vlFinal;
    } else if (transfSrc.length === 6 && transfSrc.length < 7){
        let src = `${number.toFixed(2)}`;
        let srcAntes = src.substring(0,3);
        let srcDps = src.substring(3, src.length).replace(".",",");
        let vlFinal = `${srcAntes}.${srcDps}`;
        
        return vlFinal;
    } else if (transfSrc.length === 7 && transfSrc.length < 8){
        let src = `${number.toFixed(2)}`;
        let srcAntes = src.substring(0,1);
        let srcMeio = src.substring(1,4);
        let srcDps = src.substring(4, src.length).replace(".",",");
        let vlFinal = `${srcAntes}.${srcMeio}.${srcDps}`;
        
        return vlFinal;
    }
};

//remove acentos
function removerAcentos(str) {
    return str
        .normalize('NFD') // Decompõe caracteres acentuados em caracteres base + acento
        .replace(/[\u0300-\u036f]/g, ''); // Remove os acentos
}