from django.contrib import admin
from .models import Book

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['book_id', 'title', 'author', 'category', 'available', 'created_by_username', 'created_at']
    list_filter = ['category', 'available', 'created_at']
    search_fields = ['title', 'author', 'book_id']
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']

    def created_by_username(self, obj):
        return obj.created_by.username if obj.created_by else '-'
    created_by_username.short_description = 'Created By'