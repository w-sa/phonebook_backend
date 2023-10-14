const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
app.use(express.json());
app.use(cors());

morgan.token("content-body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content-body",
    {
      skip: (req, res) => {
        return req.method !== "POST";
      },
    }
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = date.toString();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${formattedDate}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  console.log(req.params);
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  console.log(person);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  // console.log(req, res);

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "missing content" });
  }

  if (persons.some((person) => person.name === body.name)) {
    // complete method for handling error when name exists
    return res
      .status(406)
      .json({ error: "an entry with that name already exists." });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
