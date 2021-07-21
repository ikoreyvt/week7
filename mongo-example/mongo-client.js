const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const DataStore = require("./data-store");
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

let collection = new DataStore("mongodb://localhost:27017", "test", "league");

async function whichOp() {
  let userAnswer = await ask(
    "Which operation would you like to do? (see all, find by role, add entry, find one, or update one) "
  );

  let allowableAns = [
    "see all",
    "find by role",
    "add entry",
    "find one",
    "update one",
  ];

  if (!allowableAns.includes(userAnswer)) {
    console.log("Unknown command, please try again. ");
    whichOp();
  }

  if (userAnswer === "see all") {
    await run();
  } else if (userAnswer === "find by role") {
    let role = await ask("Which role would you like to search? ");
    await find(role);
  } else if (userAnswer === "add entry") {
    let name = await ask("What is the champ's name? ");
    let role = await ask("And their role? ");
    await addEntry(name, role);
  } else if (userAnswer === "find one") {
    let id = await ask("Enter an id to look up. ");
    await findOne(id);
  } else if (userAnswer === "update one") {
    let id = await ask("Enter an id ");
    let role = await ask("What would you like their role to be? ");
    await updateOne(id, role);
  }

  let cont = await ask("Do you wish to run another operation? (yes/no) ");

  let allowableCont = ["yes", "no"];

  while (!allowableCont.includes(cont)) {
    console.log("Try again. (yes/no) ");
  }

  if (cont === "yes") {
    whichOp();
  } else if (cont === "no") {
    process.exit();
  }
}

async function run() {
  let allChamps = await collection.all();
  await allChamps.forEach((champ) => {
    console.log(champ);
  });
}

async function find(role) {
  let query = await collection.find({ role: role });
  await query.forEach((champ) => {
    console.log(champ);
  });
}

async function addEntry(name, role) {
  console.log(await collection.addEntry({ name: name, role: role }));
}

async function findOne(id) {
  let champs = await collection.findOne(id);

  await champs.forEach((champ) => {
    console.log(champ);
  });
}

async function updateOne(id, role) {
  let updateObj = { $set: { role: role } };

  await collection.updateOne(id, updateObj);
}

whichOp();
