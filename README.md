# Odoo Globetrotter

Full-stack application containing both the **React + Vite Frontend** and **Django REST Framework Backend**.

## Repository Structure
- `src/`, `public/`, `package.json`: React + Vite Frontend
- `globetrotter/`, `manage.py`, `requirements.txt`: Django REST API Backend

## Getting Started

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
