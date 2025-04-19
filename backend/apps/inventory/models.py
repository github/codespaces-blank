# Create your models here.
from django.db import models # type: ignore
from ecommerce.models import Product

class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    last_restocked = models.DateTimeField(auto_now=True)

    def is_low_stock(self):
        return self.quantity < self.low_stock_threshold

    def __str__(self):
        return f"{self.product.name} - {self.quantity} in stock"