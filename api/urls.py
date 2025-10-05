from django.urls import path, include
from .views import por_area, incrementa

urlpatterns = [
    path('casilleros/por-area/', por_area, name='por_area'),
    path('casilleros/incrementa/', incrementa, name='incrementa'),
]