from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from .models import StaffUser, PoliceUser, UserProfile, Task
from .serializers import UserProfileSerializer, UserProfileCreateSerializer, TaskSerializer, StaffUserSerializer, PoliceUserSerializer
import uuid

@api_view(["GET"])
def test(request):
    return Response({"message": "API Working"})


@api_view(['POST'])
def create_user(request):
    user_type = request.data.get('user_type')  # Expecting "staff" or "police"
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')
    profession = request.data.get('profession')
    
    # Check for required fields
    if not all([user_type, name, email, password, profession]):
        return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Handle staff user creation
    if user_type.lower() == "staff":
        college_name = request.data.get('college_name')
        if not college_name:
            return Response({'message': 'College name is required for staff user'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user already exists
        if StaffUser.objects.filter(Email=email).exists():
            return Response({'message': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the staff user
        staff_user = StaffUser(
            Name=name,
            CollegeName=college_name,
            Profession=profession,
            Email=email,
            Password=password,
            token=str(uuid.uuid4())  # Generate a unique token
        )
        staff_user.save()

        serializer = StaffUserSerializer(staff_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Handle police user creation
    elif user_type.lower() == "police":
        # Check if the user already exists
        if PoliceUser.objects.filter(Email=email).exists():
            return Response({'message': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the police user
        police_user = PoliceUser(
            Name=name,
            Profession=profession,
            Email=email,
            Password=password,
            token=str(uuid.uuid4())  # Generate a unique token
        )
        police_user.save()

        serializer = PoliceUserSerializer(police_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    else:
        return Response({'message': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        staff_user = StaffUser.objects.get(Email=email)
        if password == staff_user.Password:
            return Response({'message': 'Login successful', 'user_type': 'staff'})
    except StaffUser.DoesNotExist:
        pass

    try:
        police_user = PoliceUser.objects.get(Email=email)
        if password == police_user.Password:
            return Response({'message': 'Login successful', 'user_type': 'police'})
    except PoliceUser.DoesNotExist:
        pass
    
    return Response({'message': 'Invalid email or password'}, status=400)

@api_view(['GET'])
def user_profile_list(request):
    if request.method == 'GET':
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def user_profile_create(request):
    if request.method == 'POST':
        # Extract the token from the request data
        token = request.data.get('token')

        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the user based on the token
        try:
            user = StaffUser.objects.get(token=token)
        except StaffUser.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Log the request data for debugging
        print("Request data:", request.data)

        # Include the user id in the request data for the serializer
        request.data['CreatedBy'] = user.id  # or user.pk, both are fine

        # Create a serializer instance
        serializer = UserProfileCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)  # Log serializer errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def task_create(request):
    if request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def red_flag(request):
    name = request.data.get('name')
    roll_number = request.data.get('roll_number')
    college = request.data.get('college')
    flagged_reason = request.data.get('flagged_reason')
    flagged_reason_image = request.FILES.get('flagged_reason_image')

    try:
         
        user_profile = UserProfile.objects.get(
            name=name, 
            college_register_number=roll_number, 
            college_name=college
        )

        # Update the flagged_reason and flagged_reason_image
        user_profile.flagged_reason = flagged_reason
        if flagged_reason_image:
            user_profile.flagged_reason_image = flagged_reason_image

        # Increase the flag_count by 1
        user_profile.flag_count += 1
        user_profile.save()

        # Serialize the updated user profile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except UserProfile.DoesNotExist:
        return Response(
            {'message': 'User profile not found with the provided details'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    

@api_view(['GET'])
def student_profile_detail(request):
    name = request.query_params.get('name')
    college_register_number = request.query_params.get('college_register_number')
    college_name = request.query_params.get('college_name')
    
    if not name or not college_register_number or not college_name:
        return Response(
            {'message': 'Name, college register number, and college name are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try: 
        # Search for the user profile
        user_profile = UserProfile.objects.get(
            name=name, 
            college_register_number=college_register_number, 
            college_name=college_name
        )

        # Serialize the user profile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response(
            {'message': 'User profile not found with the provided details'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def latlong_list(request):
    latlongs = UserProfile.objects.values('latitude', 'longitude').distinct()
    return Response(latlongs, status=status.HTTP_200_OK)

@api_view(['GET'])
def profile_by_latlong(request):
    latitude = request.query_params.get('latitude')
    longitude = request.query_params.get('longitude')

    if not latitude or not longitude:
        return Response(
            {'message': 'Latitude and longitude are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user_profile = UserProfile.objects.get(latitude=latitude, longitude=longitude)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except UserProfile.DoesNotExist:
        return Response(
            {'message': 'No user found with the provided latitude and longitude'}, 
            status=status.HTTP_404_NOT_FOUND
        )
