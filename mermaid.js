//flowchart TD
 //   %% Deployment
 //   subgraph "Deployment"
 //       VERCEL("Vercel Deployment"):::deployment
 //       VERCEL_FRONT("Vercel Frontend Config"):::deployment
 //       VERCEL_BACK("Vercel Backend Config"):::deployment
 //   end
//
 //   %% Frontend Layer
 //   subgraph "Frontend Layer"
 //       FE("Frontend (React & TS UI)"):::frontend
 //       FE_Landing("Landing Page"):::frontend
 //       FE_LandingUI("Landing UI Components"):::frontend
 //       FE_Dashboard("Dashboard Page"):::frontend
 //       FE_Login("Login Page"):::frontend
 //       FE_AdminOrders("Admin Orders Panel"):::frontend
 //       FE_AdminProducts("Admin Products Panel"):::frontend
 //       FE_UI("Reusable UI Components"):::frontend
 //       FE_TailwindConf("Tailwind CSS Config"):::frontend
 //       FE_GlobalCSS("Global Stylesheet"):::frontend
 //   end
//
 //   %% Backend Layer
 //   subgraph "Backend Layer"
 //       BE("Backend Server (Node/Express)"):::backend
 //       BE_DBConfig("Database Config"):::backend
 //       BE_AuthMW("Authentication Middleware"):::backend
 //       BE_AuthRoute("Auth API Route"):::backend
 //       BE_ImageUpload("Image Upload API Route"):::backend
 //       BE_OrderApi("Order Management API"):::backend
 //       BE_ProductApi("Product Management API"):::backend
 //   end
//
 //   %% Database
 //   MONGO("MongoDB Database"):::database
//
 //   %% Legend
 //   subgraph "Legend"
 //       LEG("Legend: Frontend (light blue), Backend (light orange), Database (soft teal), Deployment (lavender)"):::legend
 //   end
//
 //   %% Connections between layers
 //   VERCEL_FRONT --> FE
 //   VERCEL_BACK --> BE
 //   FE -->|"RESTful-API"| BE
 //   BE -->|"Data-Persistence"| MONGO
//
 //   %% Frontend internal connections
 //   FE --> FE_Landing
 //   FE_Landing --> FE_LandingUI
 //   FE --> FE_Dashboard
 //   FE --> FE_Login
 //   FE --> FE_AdminOrders
 //   FE --> FE_AdminProducts
 //   FE --> FE_UI
 //   FE --> FE_TailwindConf
 //   FE --> FE_GlobalCSS
//
 //   %% Backend internal connections
 //   BE --> BE_DBConfig
 //   BE --> BE_AuthMW
 //   BE --> BE_AuthRoute
 //   BE --> BE_ImageUpload
 //   BE --> BE_OrderApi
 //   BE --> BE_ProductApi
//
 //   %% Click Events - Frontend
 //   click FE "https://github.com/pranjalbajpai3030/farm2market/tree/main/frontend/"
 //   click FE_Landing "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/src/pages/Landing.tsx"
 //   click FE_LandingUI "https://github.com/pranjalbajpai3030/farm2market/tree/main/frontend/src/components/Landing/"
 //   click FE_Dashboard "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/src/pages/Dashboard.tsx"
 //   click FE_Login "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/src/pages/Login.tsx"
 //   click FE_AdminOrders "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/src/pages/Admin-orders.tsx"
 //   click FE_AdminProducts "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/src/pages/Admin_Products.tsx"
 //   click FE_UI "https://github.com/pranjalbajpai3030/farm2market/tree/main/frontend/src/components/"
 //   click FE_TailwindConf "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/tailwind.config.js"
 //   click FE_GlobalCSS "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/src/index.css"
//
 //   %% Click Events - Backend
 //   click BE "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/index.js"
 //   click BE_DBConfig "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/config/db.js"
 //   click BE_AuthMW "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/middleware/authenticate.js"
 //   click BE_AuthRoute "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/routes/auth.js"
 //   click BE_ImageUpload "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/routes/imageUpload.js"
 //   click BE_OrderApi "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/routes/ordersApi.js"
 //   click BE_ProductApi "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/routes/products.js"
//
 //   %% Click Events - Deployment Configurations
 //   click VERCEL_FRONT "https://github.com/pranjalbajpai3030/farm2market/blob/main/frontend/vercel.json"
 //   click VERCEL_BACK "https://github.com/pranjalbajpai3030/farm2market/blob/main/backend/vercel.json"
//
 //   %% Styles for glassomorphism effect and color coding
 //   classDef frontend fill:#a0d8ef,stroke:#1a1a1a,stroke-width:2px,fill-opacity:0.5;
 //   classDef backend fill:#ffcc99,stroke:#1a1a1a,stroke-width:2px,fill-opacity:0.5;
 //   classDef database fill:#b2dfdb,stroke:#1a1a1a,stroke-width:2px,fill-opacity:0.5;
 //   classDef deployment fill:#d1c4e9,stroke:#1a1a1a,stroke-width:2px,fill-opacity:0.5;
 //   classDef legend fill:#ffffff,stroke:#000,stroke-dasharray: 5,fill-opacity:0.0,font-size:10px;