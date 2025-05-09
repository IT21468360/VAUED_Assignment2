# PowerShell Script for Testing Employee Management API

# GET All Employees
Invoke-RestMethod -Uri http://localhost:8000/employees -Method GET

# GET Employee by ID
Invoke-RestMethod -Uri http://localhost:8000/employees/1 -Method GET

# POST Add New Employee
Invoke-RestMethod -Uri http://localhost:8000/employees `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"name":"Maala","position":"SE","salary":100000}'

# PUT Update Employee
Invoke-RestMethod -Uri http://localhost:8000/employees/3 `
  -Method PUT `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"salary":65000}'

# DELETE Employee
Invoke-RestMethod -Uri http://localhost:8000/employees/4 -Method DELETE

# GET Prometheus Metrics
Invoke-RestMethod -Uri http://localhost:8000/metrics -Method GET