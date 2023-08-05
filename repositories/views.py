from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from repositories.tasks import fetch_and_store_commits
from githubmonitor.api.github import RepositoryService
from .models import Commit, CommitFilter, Repository
from .serializers import CommitSerializer, RepositorySerializer
from githubmonitor.pagination import CustomPageNumberPagination
from common.cryptography import encrypt_token
class BaseView(APIView):
    permission_classes = [IsAuthenticated]


class CommitListView(BaseView):

    def get(self, request):
        user = request.user
        queryset = user.commits.all()
        filters = CommitFilter(request.GET, queryset=queryset)
        paginator = CustomPageNumberPagination()
        context = paginator.paginate_queryset(filters.qs, request)
        serializer = CommitSerializer(context, many=True)
        return paginator.get_paginated_response(serializer.data)


class RepositoryListView(BaseView):

    def get(self, request):
        user = request.user
        repositories = user.repositories.all()
        serializer = RepositorySerializer(repositories, many=True)
        return Response(serializer.data)


class RepositoryCreateView(BaseView):

    def post(self, request):
        repo_name = request.data.get('name')
        user = request.user
        social_auth = user.social_auth.get(provider='github')
        access_token = social_auth.extra_data['access_token']
        encrypted_token = encrypt_token(access_token)
        status_code, repositories = RepositoryService.fetch_by_authenticated_user(encrypted_token)

        if Repository.objects.filter(name=repo_name, user=user).exists():
            return Response({'error': 'Repository already created.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if status_code in [401, 403]:
            return Response(
                {'error': 'Unauthorized or forbidden.'}, status=status_code)
        elif status_code == 422:
            return Response({'error': 'Unprocessable Entity.'},
                            status=status_code)
        elif status_code not in [200, 304]:
            return Response({'error': 'Unknown error.'}, status=status_code)

        if any(repo.data['name'].lower() == repo_name.lower()
               for repo in repositories):
            serializer_data = {**request.data, 'user': user.id}
            serializer = RepositorySerializer(data=serializer_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            fetch_and_store_commits.delay(user.username, serializer.data['id'], encrypted_token)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({'error': 'Repository does not exist.'},
                        status=status.HTTP_404_NOT_FOUND)
