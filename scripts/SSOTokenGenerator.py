#!/usr/bin/python
from Crypto import Random
from Crypto.Cipher import AES
import json
import hashlib
import base64

BLOCK_SIZE = 16
# Company Info
# go to: https://app.klipfolio.com/settings/single_signon_edit
# to find your companyId and secretKey
# --------------------------------------------------------------
email = ''
companyId = ''
sso = ''
salt = sso+companyId

params = {'email':email}
json_string = json.dumps(params, separators=(',',':'))

hash_salt = hashlib.sha1(salt.encode()).digest()[:16]
iv = Random.new().read(AES.block_size)
json_bytes = json_string.encode()
pad = BLOCK_SIZE - len(json_string)%BLOCK_SIZE

aes = AES.new(hash_salt, AES.MODE_CBC, iv)
encrypted_bytes = aes.encrypt( (iv + json_bytes) + pad*chr(pad).encode())
sso_token = base64.b64encode(encrypted_bytes)

print ("Test this token: https://klipfolio.github.io/kfapp-custom-sso/index.html\n\n" + "email = " +email+ "\ntoken = " +sso_token+ "\ncompany id = " +companyId)
