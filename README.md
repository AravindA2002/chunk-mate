# Chunk Mate

---

## 🛠 Tech Stack

- **Frontend:** React + Vite + styled-components  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AravindA2002/chunk-mate.git
cd chunk-mate
```

---

### 2. Setup PostgreSQL

Create a new database named `chunkmate`.

```sql
CREATE DATABASE chunkmate;
```

Then run the provided `schema.sql` to initialize tables:

```sql
-- Inside psql
\i schema.sql
```

---

### 3. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder with the following content:

```env
PORT=""
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/chunkmate

```

Start the backend server:

```bash
node app.js
```

---

### 4. Setup Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

---

---

## Bonus: Unit Tests

A basic unit test for the Markdown parser is included using **Jest**.

### Location

backend/utils/markdownParser.test.js

### Run the test

cd backend
npm install 
npm test
