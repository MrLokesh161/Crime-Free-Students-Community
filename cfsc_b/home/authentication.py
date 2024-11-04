from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import StaffUser, PoliceUser

class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Authorization')
        
        if not token:
            return None

        # Remove 'Token ' prefix if included
        token = token.replace('Token ', '')

        # Check token in StaffUser
        try:
            user = StaffUser.objects.get(token=token)
            return (user, None)
        except StaffUser.DoesNotExist:
            pass

        # Check token in PoliceUser
        try:
            user = PoliceUser.objects.get(token=token)
            return (user, None)
        except PoliceUser.DoesNotExist:
            pass

        raise AuthenticationFailed('Invalid token')
