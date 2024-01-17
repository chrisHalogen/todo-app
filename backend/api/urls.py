from django.urls import path
from .views import home, TodoCLView, TodoRUDView, toggle_completed, get_filtered_data

urlpatterns = [
    path('api/todos/', TodoCLView.as_view(), name='todo-list-create'),
    path('api/todos/<int:pk>/', TodoRUDView.as_view(), name='todo-rud'),
    path('api/todos/<int:pk>/toggle/', toggle_completed, name='toggle-completed'),
    path('api/todos/<int:value>/filter/', get_filtered_data, name='filter-todos'),
    path('', home, name="api-home")
]