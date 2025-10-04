# 🚀 Start API Gateway in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'api-gateway'; npx nodemon index.js | Tee-Object './logs/api-gateway.log'"

# 👤 Start User Service in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'user-service'; npx nodemon index.js | Tee-Object './logs/user-service.log'"

# 🏢 Start Page Service in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'page-service'; npx nodemon index.js | Tee-Object './logs/page-service.log'"
