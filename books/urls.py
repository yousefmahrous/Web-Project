from django.urls import path
from .views import (
    # API Views
    BookCreateView,
    BookListView,
    BookDetailView,
    BookSearchView,
    CategoryListView,
    # Template Views
    add_book_page,
    edit_book_page,
    book_list_admin_page,
)
 
api_urlpatterns = [
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/create/', BookCreateView.as_view(), name='book-create'),
    path('books/<int:id>/', BookDetailView.as_view(), name='book-detail'),
    path('search/', BookSearchView.as_view(), name='book-search'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]


template_urlpatterns = [
    path('add/', add_book_page, name='add-book-page'),
    path('edit/', edit_book_page, name='edit-book-page'),
    path('admin-list/', book_list_admin_page, name='book-list-admin-page'),
]


urlpatterns = api_urlpatterns + template_urlpatterns