import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    american: ["#D10F0F", "#FB5F5F"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

 //setCardType("american")

globalThis.setCardType = setCardType

//security-code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//expiration-date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),   //transforma o pacote Date numa string, usa a propriedade de pegar o ano atual e fatia essa string pegando os dois ultimos termos
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,  
      to: 12    //do mês 1 ao mês 12
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

/* REGRAS DOS NÚMEROS DOS CARTÕES:
  - MASTERCARD
      --> inicia com 5, seguido de um dígito entre 1 e 5, seguido de mais 2 dígitos
        ^5[1,5]\d{0,2}
      ou
      --> inicia com 22, seguido de um dígito entre 2 e 9, seguido de mais 1 dígito
        ^22[2,9]\d
      ou
      --> inicia com 2, seguido de um dígito entre 3 e 7,seguido de mais 2 dígtos
        ^2[3,7]\d{0,2}
      seguidos de mais 12 dígitos
      --> FINAL: (^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}
  - VISA
      --> inicia com 4 seguido de mais 15 dígitos
          ^4\d{0,15}
  - DEFAULT
*/
//número do cartão de crédito
const cardNumber = document.querySelector("#card-number")
const cardNumberParttern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: '0000 000000 00000',
      regex: /^3[47]\d{0,13}/,
      cardtype: 'american'
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function(appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,'')
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)

    return foundMask
  }

  /*appended: será o primeiro número digitado;
    dynamicMasked: será a memória dos valores digitados, começa com vazio e a cada número digitado a função é chamada e o dynamicMasked.value é chamado com os valores digitados anteriormente;
    dynamicMasked + appended: valores ja digitados + novo valor;
    .replace(/\D/g,''): troca o que não for dígito por espaço vazio, isto é, se digitar uma letra não irá aparecer no input; 
    compiledMasks: é o array;
    match(item.regex): procura essa propriedade em cada item do array*/
}

const cardNumberMasked = IMask(cardNumber, cardNumberParttern)