from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from books.views import home_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),
    # ✅ Template Routes
    path('books/', include('books.template_urls')),    # /books/add/ , /books/edit/ , /books/admin-list/
    path('', include('accounts.urls')),                # /login-page/ , /signup-page/

    # ✅ API Routes
    path('api/accounts/', include('accounts.urls')),   # /api/accounts/login/ , /api/accounts/signup/
    path('api/books/', include('books.api_urls')),     # /api/books/create/ , /api/books/<id>/
    path('api/borrow/', include('borrow.urls')),       # /api/borrow/

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)