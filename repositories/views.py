from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from githubmonitor.api.github import RepositoryService

from .models import Commit
from .serializers import CommitSerializer, RepositorySerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def commit_list_view(request):
    commits = Commit.objects.all()
    serializer = CommitSerializer(commits, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def repository_create_view(request):
    user = request.user
    social_auth = user.social_auth.get(provider='github')
    access_token = social_auth.extra_data['access_token']
    repositories = RepositoryService.fetch_by_authenticated_user(access_token)
    serializer = RepositorySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
