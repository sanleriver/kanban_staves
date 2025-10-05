from firebase_admin import db

REF = db.reference()

def get_casilleros(area=None):
    """
    Devuelve lista de dicts {area, numero, valor}
    compatible con el ORM que espera el front.
    """
    if area:                       # solo un área
        snap = REF.child(area).get() or []   # array [None, v1, v2, …]
        return [
            {'area': area, 'numero': i, 'valor': val}
            for i, val in enumerate(snap) if i > 0 and val is not None
        ]
    # todas las áreas
    areas = ('Load to Stores', 'Dist', 'Stores', 'Damage', 'WIP')
    out = []
    for a in areas:
        out.extend(get_casilleros(a))
    return out

def set_casillero(area, numero, valor):
    """Graba en el array (índice = numero)"""
    REF.child(area).child(str(numero)).set(max(0, int(valor)))