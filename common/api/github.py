import requests

class Repository:
    def __init__(self, data):
        self.data = data

class RepositoryService:
    @staticmethod
    def fetch(username):
        url = f'https://api.github.com/users/{username}/repos'
        response = requests.get(url)
        repositories = [Repository(repo_data) for repo_data in response.json()]
        return repositories