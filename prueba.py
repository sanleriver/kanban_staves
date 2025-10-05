# check_firebase.py
import os, firebase_admin
from firebase_admin import credentials, db, get_app
from kanban.settings import BASE_DIR

# Si YA está iniciada, simplemente usala
try:
    app = get_app()          # devuelve la app default
except ValueError:
    # No está iniciada → la creamos
    import firebase_admin
    from firebase_admin import credentials
    from pathlib import Path

    BASE_DIR = Path(__file__).resolve().parent
    cred = credentials.Certificate(BASE_DIR / 'firebase-crd.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://logisticdollarcity-default-rtdb.firebaseio.com/'
    })

print("Raíz completa:", db.reference().get())
print("———")
print("Casilleros   :", db.reference('casilleros').get())
print("Load to Stores:", db.reference('Load to Stores').get())