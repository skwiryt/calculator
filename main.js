    
    const narrowLength = 14;
    const wideLength = 17;
    let inputLength = narrowLength;
    const add = (n1, n2) => n1 + n2;
    const subtract = (n1, n2) => n1 - n2;
    const multiply = (n1, n2) => n1 * n2;
    const divide = (n1, n2) => {
        if (n2 === 0) return 'No division by zero'; 
        return n1 / n2;
    }
    function operate(n1, n2, operator){
        n1 = Number(n1);
        n2 = Number(n2);
        switch(operator)
        {
            case "+" :
                return Number(add(n1, n2).toPrecision(inputLength -2)).toString();
            case "-" :
                return Number(subtract(n1, n2).toPrecision(inputLength - 2)).toString();
            case "*" :
                return Number(multiply(n1, n2).toPrecision(inputLength -2)).toString();
            case "/" :
                return Number(divide(n1, n2).toPrecision(inputLength -2)).toString();
        }
    }
    let data = []; 
    /*
    let data = [
        {number: "2", operator: "+" },
        {number: "2",  operator: "*"}
    ] 
    */
    let lastToken;

    const clear = () => {
        data = [];
        lastToken = undefined;
        showDisplay();
    }; //cancels all current data

    function load(token){
        if(data[0]){
            inputText = data.reduce((p , c) => {
                let text = p + (c.number ? c.number : "0") + (c.operator ? c.operator : "") ;
                return text;
                }, "");
            if (inputText.length >= inputLength) return false;
        }
        let index = data[0] ? data.length - 1: 0;     
        if (token !== "." && !isNaN(lastToken) && data[index].number === "0" && index > 0)
        {
            return false;
        }
        if (token !== "." && !isNaN(lastToken) && data[index].number === "0" && index === 0)
        {
            data[index].number = "";
        }
        if (!isNaN(token) && lastToken === undefined ){
            data[index] = {number: token.toString()};
            lastToken = token;
            return true;
        }
        else if (!isNaN(token) && isNaN(lastToken)){
            data[index + 1] = {number: token.toString()};
            lastToken = token;
            return true;
        }
        else if (!isNaN(token) && !isNaN(lastToken)){
            data[index].number += token.toString();
            lastToken = token;
            return true
        }
        else if (token === "." && lastToken === undefined){
            data[index] = {number : "0."};
            lastToken = 0;
            return true
        }
        else if (token === "." && isNaN(lastToken)){ //
            data[index + 1] = {number : "0."};
            lastToken = 0;
            return true
        }
        else if (token === "." && !isNaN(lastToken)){
            if (data[index].number.match(/\./g)) return false;
            data[index].number += ".";
            lastToken = 0;
            return true
        }
        else if (isNaN(token) && lastToken === undefined){
            return false;            
        }
        else {
            data[index].operator = token;
            lastToken = token;
            return true;
        }
    }
    function calculate(){
       if (!data[0]) return "";
       let base = {number: data[0].number, operator: data[0].operator};
       let i = 1;       
       while (data[i]) {
           let nextToSum = {number: data[i].number, operator: data[i].operator};
           //in below while loop there is a logic of precedence of * and / over + -
           while (data[i+1] && (nextToSum.operator === "*" || nextToSum.operator === "/")){
               i++;
               nextToSum.number = operate(nextToSum.number, data[i].number, nextToSum.operator);
               nextToSum.operator = data[i].operator;
           }
           base.number = operate(base.number, nextToSum.number, base.operator);
           base.operator = nextToSum.operator;
           i++;
       }
       return base.number;
    }
    function back() {
        let lastData = data[data.length - 1];
        if (lastData.operator) {
            lastData.operator = undefined; 
            let numberLength = lastData.number.length;
            lastToken = lastData.number[numberLength - 1]           
        }
        else if (lastData.number) {
            let numberLength = lastData.number.length;
            if (numberLength > 1) {
                lastData.number = lastData.number.slice(0, numberLength - 1);
                lastToken = lastData.number[numberLength - 2];
            }
            else {                
                lastToken = data[data.length - 1].operator;
                data.pop();
            }
        }  
        showDisplay();     
    }
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".number").forEach(n => {
        n.addEventListener('click', enterInput);
    });
    document.querySelectorAll(".function").forEach(f => {
        f.addEventListener('click', enterInput)
    });
    document.querySelector(".cancel").addEventListener('click', clear);
    document.querySelector(".back").addEventListener('click', back);    
    document.querySelector(".equals").addEventListener('click', equals);
    document.querySelector(".switch").addEventListener('click', sizeToggle);
})    

function enterInput(event) {
    let number = event.target.textContent;
    if (load(number)){
       showDisplay();        
    }
}
function showDisplay(){
    let resultNode = document.querySelector("#result");
    let result = calculate();
    resultNode.textContent = result ? "= " + result : "= 0 ";        
    let input = document.querySelector("#input");
    let inputText;
    if (data[0]){
        inputText = data.reduce((p , c) => {
            let text = p + (c.number ? c.number : "0") + (c.operator ? c.operator : "") ;
            return text;
            }, "");
    }
    else {
        inputText = "0";
    }    
    input.textContent = inputText;
}
function equals() {
    let finalResult = calculate();
    clear();
    load(finalResult); 
    showDisplay();    
}
function sizeToggle() {
    clear();
    let body = document.querySelector('body');
    body.classList.toggle('narrow-body');
    body.classList.toggle('wide-body');
    let calculator = document.querySelector(".calculator");
    calculator.classList.toggle("narrow-calculator");
    calculator.classList.toggle("wide-calculator");
    let functions = document.querySelector(".functions");
    functions.classList.toggle("narrow-functions");
    functions.classList.toggle("wide-functions");
    inputLength =  inputLength === wideLength ? narrowLength : wideLength;  
} 


    
