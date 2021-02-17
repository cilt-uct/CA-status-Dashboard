import json
import requests

from requests.auth import HTTPDigestAuth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status

from config import DIGEST_AUTH, CAPTURE_AGENT_URL, CAPTURE_AGENT_NAMES_URL


# Create your views here.
class Agents(APIView):
    
    def get(self, request, *args, **kw):
        try:
            if DIGEST_AUTH["username"] and DIGEST_AUTH["password"]:
                params = {"X-Requested-Auth": "Digest"}
                auth = HTTPDigestAuth(DIGEST_AUTH["username"], DIGEST_AUTH["password"])
                result = requests.get(CAPTURE_AGENT_URL, auth=auth, headers=params)
                data = json.loads(result.text)
                response = Response(data, status=status.HTTP_200_OK)
            else:
                result = requests.get(CAPTURE_AGENT_URL)
                data = json.loads(result.text)
                response = Response(data, status=status.HTTP_200_OK)
            
            return response
        except requests.HTTPError as e:
            error_text = e.response.text
            status_code = e.response.status_code
            print(error_text + ": " +status_code)

class AgentNames(APIView):
    
    def get(self, request, *args, **kw):
        try:
            result = requests.get(CAPTURE_AGENT_NAMES_URL)
            data = json.loads(result.text)
            response = Response(data, status=status.HTTP_200_OK)
            
            return response
        except requests.HTTPError as e:
            error_text = e.response.text
            status_code = e.response.status_code
            print(error_text + ": " +status_code)
