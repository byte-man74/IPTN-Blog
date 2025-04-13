
'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { ChevronDown, Search, UserCog, UserMinus, UserPlus, RefreshCw, Loader2 } from 'lucide-react'
import { useFetchUsers } from '@/network/http-service/user.hooks'
import { useUpdateUserInformation } from '@/network/http-service/user.mutations'
import { useSession } from 'next-auth/react'

export  const AdminSettingsPageMainComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [processingUser, setProcessingUser] = useState<string | null>(null)
  const [userToUpdate, setUserToUpdate] = useState<string>('')
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  // Use the hook to fetch users
  const { data: users = [], isLoading, refetch } = useFetchUsers()

  // Initialize the update user mutation hook with the userToUpdate state
  const updateUserMutation = useUpdateUserInformation(userToUpdate)

  // Filter users based on search term
  const filteredUsers =
    searchTerm.trim() === ''
      ? users
      : users.filter(
          (user) =>
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setProcessingUser(userId)
    setUserToUpdate(userId)

    try {
      // Use the mutation directly with the userId in the parameters
      await updateUserMutation.mutateAsync({
        data: {
          id: userId,
          isAdmin: !currentStatus,
        },
      })

      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'promoted to admin' : 'demoted from admin'}`,
      })
    } catch (error) {
      console.error('Error updating user admin status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user admin status.',
        variant: 'destructive',
      })
    } finally {
      setProcessingUser(null)
    }
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    // Prevent deactivating your own account
    if (userId === currentUserId && currentStatus) {
      toast({
        title: 'Action Denied',
        description: 'You cannot deactivate your own account',
        variant: 'destructive',
      })
      return
    }

    setProcessingUser(userId)
    setUserToUpdate(userId)

    try {
      // Use the mutation directly with the userId in the parameters
      await updateUserMutation.mutateAsync({
        data: {
          id: userId,
          isActive: !currentStatus,
        },
      })

      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
      })
    } finally {
      setProcessingUser(null)
    }
  }

  const refreshUserList = () => {
    refetch()
    toast({
      title: 'Refreshed',
      description: 'User list has been refreshed',
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, permissions, and status</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={refreshUserList} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>News Published</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user?.firstName} {user?.lastName}
                          {user.id === currentUserId && " (You)"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={user.isActive}
                              disabled={processingUser === user.id || (user.id === currentUserId && user.isActive)}
                              onCheckedChange={() =>
                                handleToggleActive(user.id, user?.isActive ?? false)
                              }
                              className={user.isActive ? 'data-[state=checked]:bg-green-600' : ''}
                            />
                            <Badge
                              variant={user.isActive ? 'outline' : 'destructive'}
                              className={
                                user.isActive
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : ''
                              }
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isAdmin ? 'default' : 'outline'}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.newsCount || 0}</TableCell>
                        <TableCell>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                                disabled={processingUser === user.id || (user.id === currentUserId && user.isActive)}
                              >
                                {user.isAdmin ? (
                                  <>
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Remove Admin
                                  </>
                                ) : (
                                  <>
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Make Admin
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(user.id, user?.isActive ?? false)}
                                disabled={processingUser === user.id || (user.id === currentUserId && user.isActive)}
                              >
                                {user.isActive ? (
                                  <>
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Deactivate
                                    {user.id === currentUserId && " (Not Allowed)"}
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
