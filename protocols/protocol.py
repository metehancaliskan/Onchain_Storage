from flask import Flask
import jwt
from cryptography.fernet import Fernet


app = Flask(__name__)
key = Fernet.generate_key()
@app.route("/encode")
def encryption(payload):
    encoded = jwt.encode({"some": payload}, key, algorithm="HS256")
    return key

@app.route("/decode")
def encryption(encoded):
    return jwt.decode(encoded, key, algorithms=["HS256"])