    
    const narrowLength = 14;
    const wideLength = 17;
    let inputLength = narrowLength;
    const add = (n1, n2) => n1 + n2;
    const subtract = (n1, n2) => n1 - n2;
    const multiply = (n1, n2) => n1 * n2;
    const divide = (n1, n2) => {
        if (n2 === 0) throw Error('No division by zero'); 
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
                try {
                    return Number(divide(n1, n2).toPrecision(inputLength -2)).toString();
                }
                catch {
                    return undefined;
                }
        }
    }
    let data = [{number: "0"}]; 
    /*
    let data = [
        {number: "2", operator: "+" },
        {number: "3",  operator: "*"},
        {number: "3", operator: "*"}
    ] 
    */
    let lastToken = "0";
    
    const clear = () => {
        data = [{number: "0"}];
        lastToken = "0";        
    }; //cancels all current data

    function load(token){
        //over limit block        
        inputText = data.reduce((p , c) => {
            let text = p + (c.number ? c.number : "0") + (c.operator ? c.operator : "") ;
            return text;
            }, "");
        if (inputText.length >= inputLength) return false;              
        let index = data.length - 1;  
        // Ignores number if zero is in front of it
        if (token !== "." && !isNaN(lastToken) && data[index].number === "0" && index > 0)
        {
            return false;
        }
        //Cleans zero in data if a number is comming       
        if (!isNaN(token) && !isNaN(lastToken) && data[index].number === "0" && index === 0)
        {
            data[index].number = "";
        }        
        if (!isNaN(token) && (!isNaN(lastToken) || lastToken === ".")) {
            data[index].number += token.toString();
            lastToken = token;
            return true
        }
        else if (!isNaN(token) && isNaN(lastToken)) {
            data[index + 1] = {number: token.toString()};
            lastToken = token;
            return true;
        }        
        else if (token === "." && isNaN(lastToken)) { 
            data[index + 1] = {number : "0."};
            lastToken = token;
            return true
        }
        else if (token === "." && !isNaN(lastToken)) {
            if (data[index].number.match(/\./g)) return false;
            data[index].number += ".";
            lastToken = token;
            return true
        }
        else if (isNaN(token) && lastToken === "."){
            let numberLength = data[index].number.length;
            data[index].number = data[index].number.slice(0, numberLength - 1);
            data[index].operator = token;
            lastToken = token;
            return true;
        }
        else {
            data[index].operator = token;
            lastToken = token;
            return true;
        }
    }
    function calculate(){
      if (!data[0]) return "";
      let first = data[0].number;
      let i = 0;
      while (data[i+1]) {
        let operator = data[i].operator;
        let second = data[i+1].number;
          if (data[i].operator === "-" || data[i].operator === "+") {              
              while (data[i+2] && (data[i+1].operator === "*" || data[i+1].operator === "/")){
                  let nextFactor = data[i+2].number;
                  second = operate(second, nextFactor, data[i+1].operator)
                  i++;
              }
              first = operate(first, second, operator);
              i++;
          }
          else { 
              first = operate(first, second, operator);
              i++;
          }
      }
      return first;
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
            if (numberLength > 1 && lastData.number[numberLength-2] !== "-") {
                lastData.number = lastData.number.slice(0, numberLength - 1);
                lastToken = lastData.number[numberLength - 2];
            }
            else if (data.length === 1){                
                data[0] = {number: "0"};
                lastToken = "0";
            }
            else {
                lastToken = data[data.length - 2].operator;
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
    document.querySelector(".cancel").addEventListener('click', e => {clear(); showDisplay()});
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
let result;
function showDisplay(){
    let resultNode = document.querySelector("#result");
    result = calculate();
    //resultNode.textContent = result ? "= " + result : "= 0 ";   
    resultNode.textContent = "= " + result;       
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
    showDisplay();
} 


    
