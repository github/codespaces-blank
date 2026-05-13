function isPrime (n) {
   var param=Number(n);
       if(param===1){
           return false;
       }
       if(param===2){
           return true;
       }
       if(param%2===0){
           return false;
       }
       for(var i=3;i<= Math.sqrt(param);i+=2){
           if(param%i===0)
           return false;
       }
   return true;
}