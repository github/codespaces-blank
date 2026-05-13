function fizzbuzz (n) {
    var returns=[];
    var param=Number(n);
    var i=1;
  for( i=1;i<=param;i++){
      if(i%15===0){
          returns.push("FizzBuzz");
      }else if(i%3===0){
          returns.push("Fizz");
      }
      else if(i%5===0){
          returns.push("Buzz");
      }
      else {
          returns.push(i);
      }
 　}
 　return returns;
}