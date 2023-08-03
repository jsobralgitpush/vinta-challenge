from githubmonitor.celery import app
from django.contrib.auth.models import User
from githubmonitor.api.github import RepositoryService
from .models import Repository, Commit
from datetime import datetime, timedelta


@app.task(name='repositories.tasks.fetch_and_store_commits')
def fetch_and_store_commits(username, repo_id):
    repository = Repository.objects.get(id=repo_id)
    status_code, commits = RepositoryService.fetch_repo_commits(username, repository.name)

    if status_code == 200:

        for commit in commits:
            
            Commit.objects.create(
                message=commit.message,
                sha=commit.sha,
                author=commit.author,
                url=commit.url,
                date=commit.date,
                avatar=commit.avatar,
                repository=repository,
            )
