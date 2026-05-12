from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404, render
from django.db import IntegrityError

from django.shortcuts import render
from .models import Book
from .serializers import BookSerializer


def is_admin(user):
    return user.is_staff or user.is_superuser or getattr(user, 'is_admin', False)


class BookCreateView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not is_admin(request.user):
            return Response(
                {"error": "Only admins can add books"}, 
                status=status.HTTP_403_FORBIDDEN
            )

       
        data = {
            'book_id': request.data.get('bookid'),
            'title': request.data.get('bookname'),
            'author': request.data.get('author'),
            'category': request.data.get('category'),
            'description': request.data.get('description'),
            'available': request.data.get('available', True),
        }

        if 'image' in request.FILES:
            data['image'] = request.FILES['image']

        serializer = BookSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            try:
                book = serializer.save(created_by=request.user)
                return Response({
                    "message": "Book added successfully",
                    "data": serializer.data,
                    "book_id": book.book_id,
                    "id": book.id
                }, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({"error": "Book ID already exists"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookDetailView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            book = Book.objects.get(book_id=id)
        except Book.DoesNotExist:
            book = get_object_or_404(Book, id=id)

        serializer = BookSerializer(book, context={'request': request})
        return Response(serializer.data)

    def put(self, request, id):
        if not is_admin(request.user):
            return Response({"error": "Only admins can update books"}, status=status.HTTP_403_FORBIDDEN)

        try:
            book = Book.objects.get(book_id=id)
        except Book.DoesNotExist:
            book = get_object_or_404(Book, id=id)

        
        data = {
            'book_id': request.data.get('bookid'),
            'title': request.data.get('bookname'),
            'author': request.data.get('author'),
            'category': request.data.get('category'),
            'description': request.data.get('description'),
        }

        
        data = {k: v for k, v in data.items() if v is not None}

        if 'image' in request.FILES:
            data['image'] = request.FILES['image']

        serializer = BookSerializer(book, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            old_image = book.image if 'image' in request.FILES else None
            book = serializer.save(updated_by=request.user)
            if old_image and old_image != book.image:
                old_image.delete(save=False)
            return Response({
                "message": "Book updated successfully",
                "data": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        if not is_admin(request.user):
            return Response({"error": "Admins only"}, status=status.HTTP_403_FORBIDDEN)

        try:
            book = Book.objects.get(book_id=id)
        except Book.DoesNotExist:
            book = get_object_or_404(Book, id=id)

        if book.image:
            book.image.delete(save=False)

        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Book.objects.all()

        title = request.GET.get('title')
        author = request.GET.get('author')
        category = request.GET.get('category')
        book_id = request.GET.get('bookid')

        if book_id:
            queryset = queryset.filter(book_id=book_id)
        if title:
            queryset = queryset.filter(title__icontains=title)
        if author:
            queryset = queryset.filter(author__icontains=author)
        if category:
            queryset = queryset.filter(category__icontains=category)

        queryset = queryset.order_by('-created_at')
        serializer = BookSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class BookListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        books = Book.objects.all().order_by('-created_at')
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Book.objects.values_list('category', flat=True).distinct()
        return Response(list(categories))




def add_book_page(request):
    return render(request, 'pages/addbook.html')

def search_page(request):
    return render(request, 'pages/search.html')

def edit_book_page(request):
    book_id = request.GET.get('id')
    return render(request, 'pages/editbook.html', {'book_id': book_id})


def book_list_admin_page(request):
    return render(request, 'pages/book-list-admin.html')


def view_books_page(request):
    """Serves the main library catalog page — /books/view/"""
    return render(request, 'pages/view_books.html')


def borrow_book_page(request):
    """Serves the borrow form page — /books/borrow/?id=<book_id>"""
    book_id = request.GET.get('id')
    return render(request, 'pages/borrow_book.html', {'book_id': book_id})

def home_view(request):
    return render(request, 'pages/index.html')
