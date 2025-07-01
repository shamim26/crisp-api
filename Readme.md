# Crisp API

Crisp API is a RESTful backend service for an eCommerce platform, providing endpoints for managing products, categories, orders, and more. Built with Node.js, Express, TypeScript, and MongoDB, it is designed to be modular, scalable, and easy to integrate with frontend applications such as the [Portal App](https://github.com/shamim26/admin-portal/blob/main/README.md).

## Features

- Product management (CRUD)
- Category management (CRUD)
- Order and customer endpoints (extendable)
- Consistent API response structure
- Asynchronous error handling
- MongoDB integration via Mongoose
- Modular controller structure

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** (Node js)

## Project Structure

```
crisp-api/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── constant.ts
│   ├── controllers/
│   ├── db/
│   ├── helper/
│   ├── interfaces/
│   ├── jobs/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
├── public/
├── .env
├── package.json
├── tsconfig.json
└── Readme.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/shamim26/crisp-api.git
   cd crisp-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Copy `.env` and update values as needed:

     ```
     PORT=8000
     MONGODB_URI=your_mongodb_uri
     ACCESS_TOKEN_SECRET=your_access_token_secret
     REFRESH_TOKEN_SECRET=your_refresh_token_secret
     CORS_ORIGIN=your_origin
     NODE_ENV=development

     # Cloudinary
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

4. **Build the project:**

   ```bash
   npm run build
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Or to run the compiled code:
   ```bash
   npm start
   ```

## API Usage

- Base URL: `http://localhost:8000/api/v1`
- Main endpoints:
  - `/products` - Product CRUD
  - `/categories` - Category CRUD
  - `/users` - User management
  - `/suggestions` - Suggestions
  - `/orders` - (To be implemented)

**Example:**

```http
GET /api/v1/products
```

For a full list of endpoints and request/response formats, see the source code in `src/routes/` and `src/controllers/`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
