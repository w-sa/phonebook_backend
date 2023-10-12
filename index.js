const express = require("express");
const app = express();

let persons = [];

app.get("/", (request, response) => {
  response.send("<h1>Something else!!</h1>");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
