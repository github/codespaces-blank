from django.urls import path, include
from . import views


urlpatterns = [
    path("", views.pagelist, name="pagelist"),
    path("page1", views.page1, name="page1")

]