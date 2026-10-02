/*let name = "John";
let age = 30;
let hobbies = ["eating","drinking","singing","joking"];

hobbies.push("cosplay");//add an element
//console.log(name, age, hobbies[2]);
hobbies.pop();//contrary to push. delete pushing items
//console.log(hobbies.splice(1,3));//select a part of array to log

let person = {
	name, 
	age, 
	hobbies,
	height: 185,
}
console.log(person)

++++++++++++++++++++

let age = 25;

function calculateAgeInDays(age){
	return age*365;
}

console.log(calculateAgeInDays(age));

++++++++++++++++++++

let globaVar = "i am global";

function testScope(){
	let localVar = "i am local";
	console.log(globaVar);
	console.log(localVar);
	//if you do not return something then it shows 'undefined'
}

console.log(testScope());

//testScope();

*/

let numbers=[1,43,32,5,3,23889,352];

for (var i = 0; i < numbers.length; i++) {

	if (numbers[i]%2 == 0) {	//%就是除以二之后给出余一还是零.是一个判断奇偶数的计算方法
		console.log(numbers[i] +"is even");
	} else {
		console.log(numbers[i] +"is odd");
	}
}

















