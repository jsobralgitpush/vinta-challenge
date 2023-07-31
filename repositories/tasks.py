from githubmonitor.celery import app
from django.contrib.auth.models import User
from githubmonitor.api.github import RepositoryService
from .models import Repository, Commit
from datetime import timedelta
import datetime


@app.task(name='repositories.tasks.fetch_and_store_commits')
def fetch_and_store_commits(user_id, repo_name):
    user = User.objects.get(id=user_id)
    social_auth = user.social_auth.get(provider='github')
    access_token = social_auth.extra_data['access_token']

    since_date = (datetime.now() - timedelta(days=30)).isoformat()
    commits = RepositoryService.fetch_repo_commits(access_token, user.username, repo_name, since_date)

    repository = Repository.objects.get(name=repo_name)

    for commit in commits:
        commit_author = commit['commit']['author']['name']
        commit_message = commit['commit']['message']
        commit_date = commit['commit']['author']['date']
        commit_sha = commit['sha']
        commit_url = commit['html_url']
        commit_avatar = commit['author']['avatar_url'] if commit['author'] else ""

        Commit.objects.create(
            message=commit_message,
            sha=commit_sha,
            author=commit_author,
            url=commit_url,
            date=commit_date,
            avatar=commit_avatar,
            repository=repository,
        )
