from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from accounts.views import login_page, about_page 
from books.views import home_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', login_page, name='home'),

    # ✅ مسار صفحة About Us - ده اللي هيخلي اللينك في الـ Nav يشتغل
    path('about/', about_page, name='about_page'),
]
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),

    # ✅ Template Routes
    path('books/', include('books.template_urls')),    # /books/add/ , /books/edit/ , /books/admin-list/
    path('', include('accounts.urls')),                # /login-page/ , /signup-page/

    # ✅ API Routes
    path('api/accounts/', include('accounts.urls')),
    path('api/books/', include('books.api_urls')),
    path('api/borrow/', include('borrow.urls')),

    # ✅ Template Routes
    # path('books/', include('books.template_urls')),
    path('borrow/', include('borrow.urls')),
    path('', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)