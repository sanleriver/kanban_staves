from rest_framework.decorators import api_view
from rest_framework.response import Response
from .firebase_manager import get_casilleros, set_casillero

@api_view(['GET'])
def por_area(request):
    area = request.query_params.get('area')
    return Response(get_casilleros(area))

@api_view(['POST'])
def incrementa(request):
    area   = request.data['area']
    numero = request.data['numero']
    cant   = request.data['cantidad']
    valor_actual = next(
        (c['valor'] for c in get_casilleros(area) if c['numero'] == numero), 0
    )
    set_casillero(area, numero, valor_actual + cant)
    return Response({'area': area, 'numero': numero, 'valor': valor_actual + cant})