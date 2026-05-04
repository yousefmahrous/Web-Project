from django.db import models

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    description = models.TextField()
    img_src = models.CharField(max_length=100)
    available = models.BooleanField()
    created_at = models.DateField()