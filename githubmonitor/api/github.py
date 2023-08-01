import requests

class Commit:
    def __init__(self, data):
        self.sha = data['sha']
        self.url = data['html_url']
        self.author = data['commit']['author']['name'] if data['author'] else None
        self.message = data['commit']['message']
        self.date = data['commit']['author']['date']
        self.avatar = data['author']['avatar_url'] if data['author'] else None

class Repository:
    def __init__(self, data):
        self.data = data

class RepositoryService:
    @staticmethod
    def fetch_by_user(access_token, username):
        url = f'https://api.github.com/users/{username}/repos'
        headers = {'Authorization': f"token {access_token}"}
        response = requests.get(url, headers=headers)
        repositories = [Repository(repo_data) for repo_data in response.json()]
        return response.status_code, repositories

    @staticmethod
    def fetch_by_repo_name(access_token, username, repo_name):
        url = f'https://api.github.com/repos/{username}/{repo_name}'
        headers = {'Authorization': f"token {access_token}"}
        response = requests.get(url, headers=headers)
        repository = Repository(response.json())
        return response.status_code, repository

    @staticmethod
    def fetch_by_authenticated_user(access_token):
        url = 'https://api.github.com/user/repos'
        headers = {'Authorization': f"token {access_token}"}
        response = requests.get(url, headers=headers)
        repositories = [Repository(repo_data) for repo_data in response.json()]
        return response.status_code, repositories
    
    @staticmethod
    def fetch_repo_commits(access_token, username, repo_name):
        url = f'https://api.github.com/repos/{username}/{repo_name}/commits'
        headers = {'Authorization': f"token {access_token}"}
        response = requests.get(url, headers=headers, params={})
        commits = [Commit(commit_data) for commit_data in response.json()]
        return response.status_code, commits
    
