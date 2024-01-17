from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.forms import model_to_dict
from rest_framework import status
from rest_framework.response import Response
from .serializers import TodoSerializer
from .models import Todo

@api_view(["GET"])
def home(request):
    routes = [
        {
            'Endpoint': '/api/todos/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of todos'
        },
        {
            'Endpoint': '/api/todos/:value/filter/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of todos'
        },
        {
            'Endpoint': '/api/todos/',
            'method': 'POST',
            'body': {
                    'description': 'The description of the task'
                },
            'description': 'Creates a new todo'
        },
        {
            'Endpoint': '/api/todos/:id/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single todo object'
        },
        {
            'Endpoint': '/api/todos/:id/',
            'method': 'PUT',
            'body': {
                'description': "The description of the task"
            },
            'description': 'Returns a single todo object'
        },
        {
            'Endpoint': '/api/todos/:id/toggle/',
            'method': 'PATCH',
            'body': None,
            'description': 'Toggles the status of the completed attribute of the Todo Object'
        },
        {
            'Endpoint': '/api/todo/:id/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes a Single Todo'
        },
        
    ]

    return Response(routes)

class TodoCLView(ListCreateAPIView):
    queryset = Todo.objects.all().order_by("-id")
    serializer_class = TodoSerializer

class TodoRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all().order_by("-id")
    serializer_class = TodoSerializer

@api_view(["PATCH"])
def toggle_completed(request, pk):
    
    instance = get_object_or_404(Todo, pk=pk)

    data = model_to_dict(instance)

    data['completed'] = not data['completed']

    serializer = TodoSerializer(instance, data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_filtered_data(request, value):
    data = False
    if value == 1:
        data = True

    queryset = Todo.objects.filter(completed = data).order_by("-id")

    output = [model_to_dict(todo) for todo in queryset]

    return Response(output, status=status.HTTP_200_OK)
