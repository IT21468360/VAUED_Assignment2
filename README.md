# Employee Management System with Prometheus & Grafana Monitoring

This project implements a full RESTful Employee Management System in Node.js, with observability using Prometheus and Grafana. It includes API endpoints for CRUD operations and Docker-based deployment for all services.


## Prerequisites

Ensure the following are installed on your machine:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Optional: [Node.js](https://nodejs.org/) (for manual API testing outside Docker)


## Clone the Project

1.Go to the place you want to create the project folder (In your Local Machine), Then right click and open 'git bash here'. (If you don't have Git Bash, download it)
2.Now type -> git clone -b main https://github.com/IT21468360/VAUED_Assignment2.git
3.Then a folder will be created
4.Open it in the VS code
5.Ensure that `data.json` exists in `app/`. If not, create a blank one:


## Folder Structure

VAUED_Assignment2/
├── app/                        # Node.js REST API
│   ├── server.js               # API logic and Prometheus metrics
│   ├── Dockerfile              # Dockerfile for the app
│   ├── package.json            # Node.js dependencies
│   └── data.json               # Persistent employee data
├── prometheus/
│   └── prometheus.yml          # Prometheus configuration
├── grafana/
│   └── dashboard.json          # Exported Grafana dashboard
├── docker-compose.yml          # Runs all services together
└── README.md                   # This file



## Starting the System

To build and start all services (API, Prometheus, Grafana, Node Exporter):

```bash
docker-compose up --build
```

To start services normally (without rebuilding):

```bash
docker-compose up -d
```

---

## Stopping the System

To stop all running services:

```bash
docker-compose down
```

This stops and removes the containers but **keeps your volumes** (e.g., Grafana storage and dashboard configs).


##  Restarting After Shutdown

If everything is already built once:

```bash
docker-compose up
```

If you made code changes in `server.js` and want to rebuild:

```bash
docker-compose up --build
```

## Accessing Services

| Service     | URL                            |
|-------------|---------------------------------|
| API         | http://localhost:8000/employees |
| Metrics     | http://localhost:8000/metrics   |
| Prometheus  | http://localhost:9090           |
| Grafana     | http://localhost:3000           |


## Testing API Endpoints

Use the included PowerShell test script:

```bash
.	test_employee_api.ps1
```

Or test manually using power shell


## Grafana Setup and Dashboard Import

1. Open Grafana at `http://localhost:3000`
2. Login:
   - Username: `admin`
   - Password: `vaued`
3. Navigate to: **→ Data Sources**
   - Add Prometheus → URL: `http://prometheus:9090`
4. Navigate to: ➕ **→ Import**
   - Upload `grafana/dashboard.json`
   - Select Prometheus as the data source
   - Click **Import**

## Alerts

The system has the following alert rules configured:

- `High Employees Added Rate`: Triggers if additions > 6/min
- `High Error Count`: Triggers if errors_total > 5

Alerts are visible under **Alerting → Alert Rules** in Grafana. External contact points are optional.


## Notes

- No external database is used. Employees are stored in `data.json`.
- Prometheus metrics are exposed at `/metrics`.
- Node Exporter tracks CPU, memory, and disk stats.
- Grafana dashboards and Prometheus data are persisted using Docker volumes.
