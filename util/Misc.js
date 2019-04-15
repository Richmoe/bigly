"use strict"


export function shuffleArray(input) {
    //inplace array shuffle    
    for (var i = input.length-1; i >=0; i--) {
     
      var randomIndex = Math.floor(Math.random()*(i+1)); 
      var itemAtIndex = input[randomIndex]; 
       
      input[randomIndex] = input[i]; 
      input[i] = itemAtIndex;
    }
    return input;
  };


export function uid() {
  //8 byte guid, good enough for this I think.
  return ((((1+Math.random())*0x100000000)|0).toString(16).substring(1))
}

export function log(...args) {
  console.log("<-----------------------------");
  for (let i = 0; i < args.length; i++) {
      console.log(args[i]);
  }
  console.log("---------------------------->");
}