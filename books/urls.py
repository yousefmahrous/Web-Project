from django.urls import path
from .views import BookDetailsView, BookSearchView
from . import views

urlpatterns = [
    path('api/books/<int:id>/', BookDetailsView.as_view(), name='book-detail'),
    path('api/books/search/', BookSearchView.as_view(), name='book-search'),
    path('', views.get_all_books, name='all-books'),
    path('categories/', views.get_categories, name='categories'),
]