import requests

class Repository:
    def __init__(self, data):
        self.data = data

class RepositoryService:
    @staticmethod
    def fetch_by_user(username):
        url = f'https://api.github.com/users/{username}/repos'
        response = requests.get(url)
        repositories = [Repository(repo_data) for repo_data in response.json()]
        return repositories
    
    @staticmethod
    def fetch_by_repo_name(username, repo_name):
        url = f'https://api.github.com/repos/{username}/{repo_name}'
        response = requests.get(url)
        return Repository(response.json())

    @staticmethod
    def fetch_by_authenticated_user(access_token):
        url = 'https://api.github.com/user/repos'
        headers = {'Authorization': f"token {access_token}"}
        response = requests.get(url, headers=headers)
        return [Repository(repo_data) for repo_data in response.json()]
