'use client';
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';
import { Edit, Save, ArrowLeft } from 'lucide-react';
import Link from "next/link";

const UserDashboardPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', address: '' });
  const [tempDetails, setTempDetails] = useState({ name: '', email: '', address: '' });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [activeMenu, setActiveMenu] = useState('my-profile');
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const number = search.get('mobileNumber');
      if (!number) {
        router.push('/');
        return;
      }

      setMobileNumber(number);

      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);

      const storedBookingDetails = localStorage.getItem('bookingDetails');
      if (storedBookingDetails) {
        try {
          const parsed = JSON.parse(storedBookingDetails);
          setBookingDetails(parsed);
          setUserDetails({
            name: parsed.userName || '',
            email: parsed.email || '',
            address: '',
          });
          setTempDetails({
            name: parsed.userName || '',
            email: parsed.email || '',
            address: '',
          });
        } catch (error) {
          console.error('Error parsing bookingDetails:', error);
        }
      }

      const storedProfileImage = localStorage.getItem('profileImage');
      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      }

      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        try {
          const allBookings = JSON.parse(storedBookings);
          const userBookings = allBookings.filter((b: any) => b.mobileNumber === number);
          setBookingHistory(userBookings);
        } catch (error) {
          console.error('Error parsing bookings:', error);
        }
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setTempDetails({ ...userDetails });
  };

  const handleSaveClick = () => {
    setUserDetails({ ...tempDetails });
    setIsEditing(false);

    if (typeof window !== 'undefined') {
      const storedBookingDetails = localStorage.getItem('bookingDetails');
      if (storedBookingDetails) {
        try {
          const parsed = JSON.parse(storedBookingDetails);
          const updated = {
            ...parsed,
            userName: tempDetails.name,
            email: tempDetails.email
          };
          localStorage.setItem('bookingDetails', JSON.stringify(updated));
          setBookingDetails(updated);
          toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
        } catch (err) {
          console.error('Error updating bookingDetails:', err);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = () => {
    if (newProfileImage && profileImage && typeof window !== 'undefined') {
      localStorage.setItem('profileImage', profileImage);
      toast({ title: "Profile Image Updated", description: "Your profile image has been updated successfully." });
    }
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'my-profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your profile details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Avatar className="w-24 h-24">
                  {profileImage ? (
                    <AvatarImage src={profileImage} />
                  ) : (
                    <AvatarFallback>{userDetails.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              {isEditing ? (
                <div className="grid gap-4">
                  <Input name="name" value={tempDetails.name} onChange={handleInputChange} placeholder="Name" />
                  <Input name="email" value={tempDetails.email} onChange={handleInputChange} placeholder="Email" />
                  <Input name="address" value={tempDetails.address} onChange={handleInputChange} placeholder="Address" />
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={handleCancelClick}>Cancel</Button>
                    <Button onClick={handleSaveClick}><Save className="mr-2 h-4 w-4" /> Save</Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <p><b>Name:</b> {userDetails.name}</p>
                  <p><b>Email:</b> {userDetails.email}</p>
                  <p><b>Address:</b> {userDetails.address}</p>
                  <Button onClick={handleEditClick}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'booking-history':
        return (
          <Card>
            <CardHeader><CardTitle>Booking History</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookingHistory.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.date}</TableCell>
                        <TableCell>{b.source}</TableCell>
                        <TableCell>{b.destination}</TableCell>
                        <TableCell>{b.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      default:
        return <p>Select a menu item.</p>;
    }
  };

  if (!mobileNumber || !bookingDetails) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-4">
        <Link href="/" className="block py-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="inline-block mr-2" /> Back to Home
        </Link>
        <hr className="my-4" />
        <ul className="space-y-2">
          <li><Button variant={activeMenu === 'my-profile' ? 'default' : 'ghost'} onClick={() => setActiveMenu('my-profile')}>My Profile</Button></li>
          <li><Button variant={activeMenu === 'booking-history' ? 'default' : 'ghost'} onClick={() => setActiveMenu('booking-history')}>Booking History</Button></li>
          <li><Button onClick={handleLogout}>Logout</Button></li>
        </ul>
      </div>

      {/* Main */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {renderContent()}

          <Card>
            <CardHeader>
              <CardTitle>Your Booking Details</CardTitle>
              <CardDescription>For mobile: {mobileNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><b>User:</b> {bookingDetails.user}</p>
              <p><b>Name:</b> {bookingDetails.userName}</p>
              <p><b>Email:</b> {bookingDetails.email}</p>
              <p><b>Source:</b> {bookingDetails.source}</p>
              <p><b>Destination:</b> {bookingDetails.destination}</p>
              <p><b>Cab Type:</b> {bookingDetails.cabModel}</p>
              <p><b>Fare:</b> ₹{bookingDetails.fare}</p>
              <p><b>Driver Name:</b> {bookingDetails.driverName}</p>
              <Button onClick={() => setShowMap(!showMap)}>
                {showMap ? 'Hide Map' : 'Track Cab'}
              </Button>
              {showMap && (
                <div className="mt-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15764.868434407826!2d76.9127246!3d9.0344791"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                  <p><b>Cab Location:</b> Punalur, Kerala</p>
                  <p><b>Vehicle No:</b> KL01AB1234</p>
                  <p><b>Driver:</b> Anoop</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;
