from rest_framework import serializers
from .models import Casillero

class CasilleroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Casillero
        fields = '__all__'