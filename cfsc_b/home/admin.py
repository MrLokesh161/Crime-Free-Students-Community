from django.contrib import admin
from .models import UserProfile, StaffUser, PoliceUser, Task

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
    list_display = ('description', 'created_at', 'completed')
    search_fields = ('description', 'created_at')
    list_filter = ('created_at', 'completed')