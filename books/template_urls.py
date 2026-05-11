# books/template_urls.py
# ADD the two new imports and two new paths shown below.
# The existing paths (add/, edit/, admin-list/) stay unchanged.

from django.urls import path
from .views import (
    add_book_page,
    edit_book_page,
    book_list_admin_page,
    view_books_page,      # ← ADD this import
    borrow_book_page,     # ← ADD this import
)

urlpatterns = [

    path('add/',        add_book_page,        name='add-book-page'),
    path('edit/',       edit_book_page,       name='edit-book-page'),
    path('admin-list/', book_list_admin_page, name='book-list-admin-page'),


    path('view/',       view_books_page,      name='view-books-page'),   # /books/view/
    path('borrow/',     borrow_book_page,     name='borrow-book-page'),  # /books/borrow/?id=<id>
]