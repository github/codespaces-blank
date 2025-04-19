# Create your models here.
from django.contrib.auth.models import AbstractUser # type: ignore
from django.db import models # type: ignore

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email