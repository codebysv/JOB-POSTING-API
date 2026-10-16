
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
let jobs = [];
let id = 1;

// POST - Add job
app.post("/api/jobs", (req, res) => {
  const j = req.body;
  if (!j.title || !j.company || !j.jobCode)
    return res.status(400).json({error:"Missing data"});

  if (jobs.some(x => x.jobCode === j.jobCode))
    return res.status(409).json({error:"Duplicate"});

  const job = {id: id++, ...j};
  jobs.push(job);
  res.status(201).json(job);
});

// GET - All jobs
app.get("/api/jobs", (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  res.json({
    data: jobs.slice((page-1)*limit, page*limit),
    page, limit,
    total: jobs.length,
    totalPages: Math.ceil(jobs.length/limit)
  });
});

// GET - One job
app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.find(j => j.id == req.params.id);
  if (!job) return res.status(404).json({error:"Not found"});
  res.json(job);
});

// PUT - Replace job
app.put("/api/jobs/:id", (req, res) => {
  const i = jobs.findIndex(j => j.id == req.params.id);
  if (i < 0) return res.status(404).json({error:"Not found"});
  jobs[i] = {id: jobs[i].id, ...req.body};
  res.json(jobs[i]);
});

// PATCH - Update job
app.patch("/api/jobs/:id", (req, res) => {
  const job = jobs.find(j => j.id == req.params.id);
  if (!job) return res.status(404).json({error:"Not found"});
  Object.assign(job, req.body);
  res.json(job);
});

// DELETE - Remove job
app.delete("/api/jobs/:id", (req, res) => {
  const i = jobs.findIndex(j => j.id == req.params.id);
  if (i < 0) return res.status(404).json({error:"Not found"});
  jobs.splice(i, 1);
  res.status(204).send();
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({error:"Route not found"});
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
