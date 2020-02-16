const db = low(adapter);

var user = db.get('users').find({name:userName}).value();
document.querySelector('#id').innerText();

console.log("test");