import requests

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
        return repositories
    
    @staticmethod
    def fetch_by_repo_name(access_token, username, repo_name):
        url = f'https://api.github.com/repos/{username}/{repo_name}'
        headers = {'Authorization': f"token {access_token}"}
        response = requests.get(url, headers=headers)
        return Repository(response.json())

    @staticmethod
    def fetch_by_authenticated_user(access_token):
        url = 'https://api.github.com/user/repos'
        headers = {'Authorization': f"token {access_token}"}
        response = requests.get(url, headers=headers)
        return [Repository(repo_data) for repo_data in response.json()]
    
    @staticmethod
    def fetch_repo_commits(access_token, username, repo_name, since_date):
        url = f'https://api.github.com/repos/{username}/{repo_name}/commits'
        headers = {'Authorization': f"token {access_token}"}
        params = {'since': since_date}
        response = requests.get(url, headers=headers, params=params)
        return response.json()  # list of commits
