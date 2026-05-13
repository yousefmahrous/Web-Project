from django.urls import path
from .views import (
    add_book_page,
    edit_book_page,
    book_list_admin_page,
    view_books_page,
    borrow_book_page,
    details_page,
    search_page,
)

urlpatterns = [
    path('add/',        add_book_page,        name='add-book-page'),
    path('edit/',       edit_book_page,       name='edit-book-page'),
    path('admin-list/', book_list_admin_page, name='book-list-admin-page'),
    path('search/',     search_page,          name='search'),
    path('view/',       view_books_page,      name='view-books-page'),
    path('borrow/',     borrow_book_page,     name='borrow-book-page'),
    path('details/',    details_page,         name='details-page'), 
]