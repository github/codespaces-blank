from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, "index.html")

def pagelist(request):
    return render(request, "pagelist.html")

def page1(request):
    return render(request, "placeholder.html")