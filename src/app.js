const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);
  const oldProject = repositories.find((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  const project = {
    id,
    title,
    url,
    techs,
    likes: oldProject.likes,
  };

  repositories[projectIndex] = project;

  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const project = repositories.find((project) => project.id === id);
  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (!project) {
    return response.status(400).json({ error: "Project not found." });
  }

  project.likes = project.likes + 1;

  repositories[projectIndex] = project;

  return response.json(project);
});

module.exports = app;
