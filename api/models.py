from django.db import models

class Casillero(models.Model):
    area   = models.CharField(max_length=20)
    numero = models.PositiveSmallIntegerField()
    valor  = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('area', 'numero')