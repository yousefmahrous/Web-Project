from django.urls import path
from .views import (
    add_book_page,
    edit_book_page,
    book_list_admin_page,
)

urlpatterns = [
    path('add/', add_book_page, name='add-book-page'),
    path('edit/', edit_book_page, name='edit-book-page'),
    path('admin-list/', book_list_admin_page, name='book-list-admin-page'),
]
