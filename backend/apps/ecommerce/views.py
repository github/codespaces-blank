# Corrected backend/apps/ecommerce/views.py
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartSerializer
from django_filters.rest_framework import DjangoFilterBackend

class ProductListView(generics.ListAPIView):  # Fixed ListoprView → ListAPIView
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]  # Fixed backend → backends
    filterset_fields = ['category']  # Fixed set_fields → filterset_fields
    search_fields = ['name', 'description']

class ProductDetailView(generics.RetrieveAPIView):  # Added proper implementation
    queryset = Product.objects.all()
    serializer_class = ProductSerialize r