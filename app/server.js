// Import required modules
const express = require('express');           // Web framework for building REST APIs
const client = require('prom-client');        // Prometheus metrics client
const fs = require('fs');                     // File system for data persistence
const path = require('path');                 // To resolve file paths
const app = express();                        // Create an Express app instance
const port = 8000;                            // Define the port the app will listen on

app.use(express.json()); // Middleware to parse JSON request bodies

const DATA_FILE = path.join(__dirname, 'data.json');

// Load Persistent Data (if exists)

let employees = {
    1: { name: "John Doe", position: "Manager", salary: 80000 },
    2: { name: "Jane Smith", position: "Developer", salary: 60000 }
};
let nextId = 3;
let counterState = {
    employees_added_total: 0,
    employees_updated_total: 0,
    employees_deleted_total: 0,
    errors_total: 0
};

if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    employees = data.employees || employees;
    nextId = data.nextId || nextId;
    counterState = data.counterState || counterState;
}

// Prometheus Metric Configuration

client.collectDefaultMetrics();

const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'endpoint']
});

const employeeAddedCounter = new client.Counter({
    name: 'employees_added_total',
    help: 'Total number of employees added'
});

const employeeUpdatedCounter = new client.Counter({
    name: 'employees_updated_total',
    help: 'Total number of employee updates'
});

const employeeDeletedCounter = new client.Counter({
    name: 'employees_deleted_total',
    help: 'Total number of employee deletions'
});

const errorCounter = new client.Counter({
    name: 'errors_total',
    help: 'Total number of errors (e.g., not found, bad request)'
});

const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5] // seconds
});

// Restore counter values
employeeAddedCounter.inc(counterState.employees_added_total);
employeeUpdatedCounter.inc(counterState.employees_updated_total);
employeeDeletedCounter.inc(counterState.employees_deleted_total);
errorCounter.inc(counterState.errors_total);

// Middleware to Track Requests Automatically

app.use((req, res, next) => {
    const end = httpRequestDurationSeconds.startTimer();
    res.on('finish', () => {
        const routePath = req.route?.path || req.path;
        requestCounter.labels(req.method, routePath).inc();
        end({ method: req.method, route: routePath, code: res.statusCode });
    });
    next();
});

// API ROUTES

app.get('/employees', (req, res) => {
    res.json(employees);
});

app.get('/employees/:id', (req, res) => {
    const employee = employees[req.params.id];
    if (!employee) {
        errorCounter.inc();
        counterState.errors_total++;
        saveData();
        return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
});

app.post('/employees', (req, res) => {
    const { name, position, salary } = req.body;
    if (!name || !position || !salary) {
        errorCounter.inc();
        counterState.errors_total++;
        saveData();
        return res.status(400).json({ error: 'Name, position, and salary are required.' });
    }
    const id = nextId++;
    employees[id] = { name, position, salary };
    employeeAddedCounter.inc();
    counterState.employees_added_total++;
    saveData();
    res.status(201).json({ id, ...employees[id] });
});

app.put('/employees/:id', (req, res) => {
    const employee = employees[req.params.id];
    if (!employee) {
        errorCounter.inc();
        counterState.errors_total++;
        saveData();
        return res.status(404).json({ error: 'Employee not found' });
    }
    const { name, position, salary } = req.body;
    if (name) employee.name = name;
    if (position) employee.position = position;
    if (salary) employee.salary = salary;
    employeeUpdatedCounter.inc();
    counterState.employees_updated_total++;
    saveData();
    res.json(employee);
});

app.delete('/employees/:id', (req, res) => {
    if (!employees[req.params.id]) {
        errorCounter.inc();
        counterState.errors_total++;
        saveData();
        return res.status(404).json({ error: 'Employee not found' });
    }
    delete employees[req.params.id];
    employeeDeletedCounter.inc();
    counterState.employees_deleted_total++;
    saveData();
    res.status(204).send();
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ employees, nextId, counterState }, null, 2));
}

app.listen(port, () => {
    console.log(`Employee Management API running at http://localhost:${port}`);
});
