import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfileImage, 
  deleteProfileImage,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  selectProfileUpdating 
} from '@/redux/slices/user/userProfileSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Trash2 } from 'lucide-react';

/**
 * Example component demonstrating how to use the userProfile slice
 * This shows the separation of concerns between auth and user profile management
 */
export function UserProfileExample() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get user ID from auth slice
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Get profile data from userProfile slice
  const profile = useSelector(selectProfile);
  const isLoading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);
  const isUpdating = useSelector(selectProfileUpdating);

  // Load user profile when component mounts
  useEffect(() => {
    if (user?.id && !profile) {
      dispatch(getUserProfile(user.id));
    }
  }, [dispatch, user?.id, profile]);

  const handleUpdateProfile = async () => {
    if (!user?.id) return;
    
    try {
      await dispatch(updateUserProfile({
        userId: user.id,
        updates: {
          full_name: 'Updated Name'
        }
      })).unwrap();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      await dispatch(uploadProfileImage({
        userId: user.id,
        imageFile: file
      })).unwrap();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleDeleteImage = async () => {
    if (!user?.id || !profile?.profile_image) return;

    try {
      await dispatch(deleteProfileImage({
        userId: user.id,
        imageUrl: profile.profile_image
      })).unwrap();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading profile: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>User Profile Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.profile_image} alt={profile?.full_name} />
            <AvatarFallback>
              {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex space-x-2">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </span>
              </Button>
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUpdating}
            />
            
            {profile?.profile_image && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteImage}
                disabled={isUpdating}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-2">
          <Label>Full Name</Label>
          <div className="text-sm">{profile?.full_name || 'Not set'}</div>
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <div className="text-sm">{profile?.role || 'Not set'}</div>
        </div>

        <div className="space-y-2">
          <Label>User ID</Label>
          <div className="text-xs text-muted-foreground">{profile?.user_id}</div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4">
          <Button 
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            className="flex-1"
          >
            {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Profile
          </Button>
        </div>

        {/* Status */}
        {profile && (
          <div className="text-xs text-muted-foreground text-center">
            Status: {profile.status ? 'Active' : 'Inactive'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
