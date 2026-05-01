from django.urls import path
from . import views


urlpatterns = [
    path('api/accounts/signup/', views.signup, name='signup'),
    path('api/accounts/login/', views.login, name='login'),
    path('api/accounts/me/', views.me, name='me'),
    path('login/', views.login_page, name='login_page'),
    path('signup/', views.signup_page, name='signup_page'),
]