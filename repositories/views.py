from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from repositories.tasks import fetch_and_store_commits 
from githubmonitor.api.github import RepositoryService
from .models import Commit, CommitFilter
from .serializers import CommitSerializer, RepositorySerializer
from rest_framework.pagination import PageNumberPagination

class BaseView(APIView):
    permission_classes = [IsAuthenticated]
    
class CommitListView(BaseView):

    def get(self, request):
        queryset = Commit.objects.all()
        filters = CommitFilter(request.GET, queryset=queryset)
        paginator = PageNumberPagination()
        context = paginator.paginate_queryset(filters.qs, request)
        serializer = CommitSerializer(context, many=True)
        return paginator.get_paginated_response(serializer.data)

class RepositoryCreateView(BaseView):

    def post(self, request):
        repo_name = request.data.get('name')
        status_code, repositories = RepositoryService.fetch_by_authenticated_user()

        if status_code in [401, 403]:
            return Response({'error': 'Unauthorized or forbidden.'}, status=status_code)
        elif status_code == 422:
            return Response({'error': 'Unprocessable Entity.'}, status=status_code)
        elif status_code not in [200, 304]:
            return Response({'error': 'Unknown error.'}, status=status_code)

        if any(repo.data['name'] == repo_name for repo in repositories):
            serializer = RepositorySerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            fetch_and_store_commits.delay(access_token, user.username, serializer.data['id'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({'error': 'Repository does not exist.'}, status=status.HTTP_404_NOT_FOUND)
