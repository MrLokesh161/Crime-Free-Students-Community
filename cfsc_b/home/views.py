from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from django.http import JsonResponse
from .models import StaffUser, PoliceUser, UserProfile, Task, Feedback, Broadcast, LoginRecord
from .serializers import UserProfileSerializer, UserProfileCreateSerializer, TaskSerializer, StaffUserSerializer, PoliceUserSerializer, FeedbackSerializer, BroadcastSerializer
import uuid

@api_view(["GET"])
def test(request):
    return Response({"message": "API Working"})

@api_view(['GET'])
def AllPoliceUsers(request):
    police_users = PoliceUser.objects.all()
    serializer = PoliceUserSerializer(police_users, many=True)
    return Response(serializer.data)


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
    
    # Attempt to authenticate as a staff user
    try:
        staff_user = StaffUser.objects.get(Email=email)
        if password == staff_user.Password:
            # Save login record for staff user using email
            LoginRecord.objects.create(user_type='staff', email=staff_user.Email)
            return Response({
                'message': 'Login successful',
                'user_type': 'staff',
                'token': staff_user.token
            }, status=status.HTTP_200_OK)
    except StaffUser.DoesNotExist:
        pass

    # Attempt to authenticate as a police user
    try:
        police_user = PoliceUser.objects.get(Email=email)
        if password == police_user.Password:
            # Save login record for police user using email
            LoginRecord.objects.create(user_type='police', email=police_user.Email)
            return Response({
                'message': 'Login successful',
                'user_type': 'police',
                'token': police_user.token
            }, status=status.HTTP_200_OK)
    except PoliceUser.DoesNotExist:
        pass
    
    # If no user is found or password does not match
    return Response({'message': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)


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
    token = request.query_params.get('token')
    
    if not token:
        return Response({"detail": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = PoliceUser.objects.get(token=token)  # Ensure auth_token field is in your User model
    except PoliceUser.DoesNotExist:
        return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    
    tasks = Task.objects.filter(created_by=user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def task_create(request):
    token = request.data.get('token')
    police_user = request.data.get('police_user')
    description = request.data.get('description')

    # Validate that token, police_user, and description are provided
    if not all([token, police_user, description]):
        return Response({'message': 'Token, police_user, and description are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Find the PoliceUser based on the token
    try:
        created_by = PoliceUser.objects.get(token=token)
    except PoliceUser.DoesNotExist:
        return Response({'message': 'Invalid token provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Create the Task instance
    task = Task(
        created_by=created_by,
        police_user=police_user,
        description=description,
        created_at=timezone.now(),
        completed=False
    )
    task.save()

    # Serialize the created Task to return in the response
    serializer = TaskSerializer(task)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
    
@api_view(['PUT'])
def task_update(request, task_id):
    token = request.data.get('token')
    completed = request.data.get('completed')

    # Validate that token and completed status are provided
    if token is None or completed is None:
        return Response({'message': 'Token and completed status are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Find the PoliceUser based on the token
    try:
        police_user = PoliceUser.objects.get(token=token)
    except PoliceUser.DoesNotExist:
        return Response({'message': 'Invalid token provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Find the Task by its ID
    try:
        task = Task.objects.get(id=task_id, created_by=police_user)
    except Task.DoesNotExist:
        return Response({'message': 'Task not found or you do not have permission to update it.'}, status=status.HTTP_404_NOT_FOUND)

    # Update the completed status
    task.completed = completed
    if completed:
        task.completed_at = timezone.now()
    else:
        task.completed_at = None  # Clear completed_at if the task is not completed

    task.save()

    # Serialize the updated Task to return in the response
    serializer = TaskSerializer(task)
    return Response(serializer.data, status=status.HTTP_200_OK)

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


def get_user_by_token(token):
    try:
        staff_user = StaffUser.objects.get(token=token)
        return staff_user, 'staff'
    except StaffUser.DoesNotExist:
        pass

    try:
        police_user = PoliceUser.objects.get(token=token)
        return police_user, 'police'
    except PoliceUser.DoesNotExist:
        pass

    return None, None


@api_view(['POST'])
def submit_feedback(request):
    token = request.data.get('token')
    feedback_text = request.data.get('feedback')
    rating = request.data.get('rating', 1)

    user, user_type = get_user_by_token(token)
    if not user:
        return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

    feedback = Feedback(feedback=feedback_text, rating=rating)
    
    if user_type == 'staff':
        feedback.staff_user = user
    elif user_type == 'police':
        feedback.police_user = user

    feedback.save()
    serializer = FeedbackSerializer(feedback)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def feedback_list(request):
    feedbacks = Feedback.objects.all() 
    serializer = FeedbackSerializer(feedbacks, many=True) 
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_broadcast(request):

    token = request.data.get('token')
    
    if not token:
        return Response({'message': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Try to find the user based on the token
    staff_user = StaffUser.objects.filter(token=token).first()
    police_user = PoliceUser.objects.filter(token=token).first()

    if not staff_user and not police_user:
        return Response({'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    # Set the appropriate user in the broadcast
    broadcast_data = request.data.copy()  # Make a copy of the request data
    if staff_user:
        broadcast_data['staff_user'] = staff_user.id
    if police_user:
        broadcast_data['police_user'] = police_user.id

    serializer = BroadcastSerializer(data=broadcast_data)

    if serializer.is_valid():
        serializer.save()  # Save the new broadcast
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def broadcast_list(request):
    
    broadcasts = Broadcast.objects.all()
    serializer = BroadcastSerializer(broadcasts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
