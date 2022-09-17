import jwt
from cryptography.fernet import Fernet
key = Fernet.generate_key()
encoded = jwt.encode({"some": "payload"}, key, algorithm="HS256")
