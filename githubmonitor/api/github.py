import requests
from decouple import config

class Repository:
    def __init__(self, data):
        self.data = data

class RepositoryService:

    def __get_headers(self):
        return {
            'Authorization': f"token {config('GITHUB_ACCESS_TOKEN')}",
            'Accept': 'application/vnd.github.v3+json'
        }
    
    @staticmethod
    def fetch_by_user(username, params=None):
        url = f'https://api.github.com/users/{username}/repos'
        response = requests.get(url, headers=RepositoryService().__get_headers(), params=params)
        repositories = [Repository(repo_data) for repo_data in response.json()]
        return response.status_code, repositories

    @staticmethod
    def fetch_by_repo_name(username, repo_name, params=None):
        url = f'https://api.github.com/repos/{username}/{repo_name}'
        response = requests.get(url, headers=RepositoryService().__get_headers(), params=params)
        repository = Repository(response.json())
        return response.status_code, repository

    @staticmethod
    def fetch_by_authenticated_user(params=None):
        url = 'https://api.github.com/user/repos'
        response = requests.get(url, headers=RepositoryService().__get_headers(), params=params)
        repositories = [Repository(repo_data) for repo_data in response.json()]
        return response.status_code, repositories