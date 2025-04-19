# backend/apps/ecommerce/apps.py
from django.apps import AppConfig

class EcommerceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"  # Added underscore
    name = "ecommerce"