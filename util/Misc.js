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