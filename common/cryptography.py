from cryptography.fernet import Fernet
from decouple import config

def encrypt_token(token):
    fernet = Fernet(config('FERNET_KEY'))
    return fernet.encrypt(token.encode()).decode()

def decrypt_token(token):
    fernet = Fernet(config('FERNET_KEY'))
    return fernet.decrypt(token.encode()).decode()