from rest_framework import serializers
from .models import UserProfile, PoliceUser, Task, StaffUser, PoliceUser

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['CreatedBy', 'photo', 'name', 'age', 'aadhar_number', 'phone_number', 'email_id',
                  'course_name', 'course_year', 'passingout_year', 'college_register_number',
                  'college_name', 'parents_address', 'parents_phone_number', 'present_residential_address',
                  'latitude', 'longitude', 'residency_name', 'residency_ownername', 'owner_phone_number',
                  'room_number', 'previous_cases_count', 'vehicle_number', 'flagged_reason', 
                  'flagged_reason_image', 'flag_count']

class UserProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['CreatedBy', 'photo', 'name', 'age', 'aadhar_number', 'phone_number', 'email_id',
                  'course_name', 'course_year', 'passingout_year', 'college_register_number',
                  'college_name', 'parents_address', 'parents_phone_number', 'present_residential_address',
                  'latitude', 'longitude', 'residency_name', 'residency_ownername', 'owner_phone_number',
                  'room_number', 'previous_cases_count', 'vehicle_number']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'PoliceUser', 'description', 'created_at', 'completed']

    def validate(self, data):
        if not PoliceUser.objects.filter(id=data['PoliceUser'].id).exists():
            raise serializers.ValidationError("Invalid PoliceUser ID")
        return data
    
class StaffUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffUser
        fields = ['id', 'Name', 'CollegeName', 'Profession', 'Email', 'token']
        read_only_fields = ['token'] 

class PoliceUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoliceUser
        fields = ['id', 'Name', 'Profession', 'Email', 'token']
        read_only_fields = ['token']
