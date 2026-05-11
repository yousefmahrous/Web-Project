from django.urls import path
from .views import my_borrows, return_book, borrowed_books_page, borrow_book

urlpatterns = [
    # 1. صفحة عرض الكتب المستعارة (الخاصة بخالد)
    path('borrowed-books/', borrowed_books_page, name='borrowed_books_page'),

    # 2. روابط الـ API والعمليات (خالد ومحمود)
    path('my-borrows/', my_borrows, name='my_borrows'),
    path('return/<int:borrow_id>/', return_book, name='return_book'),
    path('', borrow_book, name='borrow_book'),
]