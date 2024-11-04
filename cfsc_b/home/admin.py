from django.contrib import admin
from .models import UserProfile, StaffUser, PoliceUser, Task, Feedback, Broadcast, LoginRecord
from django import forms


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        'name', 
        'flag_count',
        'latitude',
        'longitude',
        'age', 
        'aadhar_number', 
        'phone_number', 
        'email_id', 
        'course_name', 
        'course_year', 
        'passingout_year', 
        'college_register_number', 
        'college_name', 
        'parents_phone_number', 
        'previous_cases_count', 
        'vehicle_number',
        'residency_name', 
        'residency_ownername', 
        'owner_phone_number', 
        'room_number'
    )
    search_fields = ('name', 'aadhar_number', 'phone_number', 'email_id', 'college_register_number')
    list_filter = ('course_year', 'passingout_year', 'college_name', 'previous_cases_count')

    fieldsets = (
        ('Personal Information', {
            'fields': ('CreatedBy', 'photo', 'name', 'age', 'aadhar_number', 'phone_number', 'email_id')
        }),
        ('Educational Information', {
            'fields': ('course_name', 'course_year', 'passingout_year', 'college_register_number', 'college_name')
        }),
        ('Residency Information', {
            'fields': ('present_residential_address', 'latitude', 'longitude', 'residency_name', 'residency_ownername', 'owner_phone_number', 'room_number')
        }),
        ('Parental Information', {
            'fields': ('parents_address', 'parents_phone_number')
        }),
        ('Additional Information', {
            'fields': ('previous_cases_count', 'vehicle_number')
        }),
        ('Flag Information', {
            'fields': ('flag_count', 'flagged_reason', 'flagged_reason_image')
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj: 
            return self.readonly_fields + ('aadhar_number',)
        return self.readonly_fields


@admin.register(StaffUser)
class StaffUserAdmin(admin.ModelAdmin):
    list_display = ('Name', 'CollegeName', 'Profession', 'Email')
    search_fields = ('Name', 'CollegeName', 'Profession', 'Email')
    list_filter = ('CollegeName', 'Profession')


@admin.register(PoliceUser)
class PoliceUserAdmin(admin.ModelAdmin):
    list_display = ('Name', 'Profession', 'Email')
    search_fields = ('Name', 'Profession', 'Email')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)
    list_display = ('description', 'created_by', 'police_user', 'created_at', 'completed', 'completed_at')
    list_filter = ('completed', 'created_at')
    search_fields = ('description', 'police_user')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)
    list_display = ('get_user_name', 'get_user_type', 'feedback', 'rating', 'created_at')
    search_fields = ('feedback', 'rating')
    list_filter = ('rating', 'created_at')
    ordering = ('-created_at',)

    def get_user_name(self, obj):
        """Display the name of the associated user."""
        if obj.staff_user:
            return obj.staff_user.Name
        elif obj.police_user:
            return obj.police_user.Name
        return "Unknown"
    get_user_name.short_description = 'User Name'

    def get_user_type(self, obj):
        """Display the type of the associated user."""
        if obj.staff_user:
            return "Staff"
        elif obj.police_user:
            return "Police"
        return "Unknown"
    get_user_type.short_description = 'User Type'


@admin.register(Broadcast)
class BroadcastAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)
    list_display = ('title', 'place', 'created_at', 'staff_user', 'police_user')
    search_fields = ('title', 'description', 'place')
    list_filter = ('created_at',)


@admin.register(LoginRecord)
class LoginRecordAdmin(admin.ModelAdmin):
    readonly_fields = ('login_time',)
    list_display = ('user_type', 'login_time')
    search_fields = ('user_type', 'login_time')
    list_filter = ('user_type', 'login_time')
