# Glazia Mini Design Canvas

A full-stack mini design canvas built using Next.js, React Konva, Node.js, Express.js, and MongoDB.

## Features

* Create Rectangle, Circle, and Text
* Select, drag, resize, and rotate elements
* Edit position, size, rotation, color, and text
* Delete elements
* Save, load, update, and delete canvases
* JWT authentication and canvas ownership

### Bonus Features

* Layer reordering
* Undo / Redo
* Autosave
* PNG export

## Tech Stack

**Frontend:** Next.js, React, TypeScript, React Konva, Tailwind CSS

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT

## Project Structure

```text
glazia-canvas/
├── frontend/
├── backend/
└── README.md
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Run the backend:

```bash
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Architecture

The frontend and backend are separated.

```text
Frontend → REST API → Controllers → MongoDB
```

React state manages canvas elements and editor history.

React Konva handles canvas rendering, dragging, resizing, and transformations.

MongoDB stores canvas data and user ownership.

## API Endpoints

| Method | Endpoint            | Purpose          |
| ------ | ------------------- | ---------------- |
| POST   | `/api/auth/signup`  | Register user    |
| POST   | `/api/auth/login`   | Login user       |
| GET    | `/api/auth/me`      | Get current user |
| POST   | `/api/canvases`     | Create canvas    |
| GET    | `/api/canvases`     | Get all canvases |
| GET    | `/api/canvases/:id` | Get a canvas     |
| PUT    | `/api/canvases/:id` | Update canvas    |
| DELETE | `/api/canvases/:id` | Delete canvas    |

## Known Limitations

* Fixed canvas size
* No real-time collaboration
* No image upload
* No multi-select/grouping

## Bonus Features Implemented

* Layer reordering
* Undo / Redo
* Autosave
* PNG export

## Status

Required features and bonus features have been implemented and manually tested.
