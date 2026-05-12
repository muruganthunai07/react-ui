import { ProfileTabs } from '@/components/profile-tabs';

export default function ProfilePage() {
  return (
    <div className='pl-4 mx-auto pt-4 py-6'>
      <h1 className='text-3xl font-bold mb-6'>Profile</h1>
      <ProfileTabs />
    </div>
  );
}
