var person = {
	name: 'Craig',
	age: 22
};

var personJSON = JSON.stringify(person);

console.log(personJSON);
console.log(typeof personJSON);

var personObject = JSON.parse(personJSON);

console.log(personObject.name);
console.log(typeof personObject);

console.log('CHALLENGE AREA');

var animal = '{"name": "Rusty"}';

//Convert to object
var animalObject = JSON.parse(animal);
//add age prop
animalObject.age = 4;
//convert back to json
animal = JSON.stringify(animalObject);

console.log(anmial);