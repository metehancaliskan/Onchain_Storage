import jwt
import encryption as enc
key=enc.key
encoded = enc.encoded
jwt.decode(encoded, "secret", algorithms=["HS256"])
