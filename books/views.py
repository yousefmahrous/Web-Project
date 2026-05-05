from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import BookSerializer
from django.shortcuts import get_object_or_404
from .models import Book

class BookDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, id):
        book = get_object_or_404(Book, id=id)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    
class BookSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        title = request.GET.get('title')
        author = request.GET.get('author')
        category = request.GET.get('category')

        queryset = Book.objects.all()

        if title:
            queryset = queryset.filter(title__icontains=title)
        if author:
            queryset = queryset.filter(author__icontains=author)
        if category:
            queryset = queryset.filter(category__icontains=category)

        serializer = BookSerializer(queryset, many=True)
        return Response(serializer.data)
    
# 1. الـ API اللي بيجيب كل الكتب للهوم بيج
@api_view(['GET'])
@permission_classes([AllowAny]) # خليه متاح لأي حد يشوف الكتب حتى لو مش عامل login
def get_all_books(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

# 2. الـ API اللي بيجيب التصنيفات عشان صفحة البحث
@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    # بيجيب التصنيفات المتاحة حالياً في الداتا بدون تكرار
    categories = Book.objects.values_list('category', flat=True).distinct()
    return Response(list(categories))