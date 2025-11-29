'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clientApi } from '../../../lib/client-api';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface Team {
  _id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

interface TeamMember {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  role: string;
  joinedAt: string;
}

interface TeamActivity {
  _id: string;
  type: string;
  description: string;
  performedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function TeamDetail() {
  const params = useParams();
  const teamId = params.id as string;

  return (
    <ProtectedRoute>
      <TeamDetailContent teamId={teamId} />
    </ProtectedRoute>
  );
}

function TeamDetailContent({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'activity'>('overview');
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadTeamData();
    }
  }, [teamId, currentUserId]);

  const loadCurrentUser = async () => {
    try {
      const response:any = await clientApi.getProfile();
      setCurrentUserId(response._id);
    } catch (error) {
      console.error('Failed to load current user');
    }
  };

  const loadTeamData = async () => {
    try {
      const [teamRes, membersRes, activitiesRes]:any = await Promise.all([
        clientApi.getTeam(teamId),
        clientApi.getTeamMembers(teamId),
        clientApi.getTeamActivities(teamId, 1, 10),
      ]);

      setTeam(teamRes);
      setMembers(membersRes);
      setActivities(activitiesRes.activities);

      // Find current user's role
      const currentUserMember = membersRes.find(
        (member: TeamMember) => member.userId._id === currentUserId
      );
      setUserRole(currentUserMember?.role || '');
    } catch (error) {
      console.log("🚀 ~ loadTeamData ~ error:", error)
      console.error('Failed to load team data');
      router.push('/teams');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;

    try {
      await clientApi.leaveTeam(teamId);
      router.push('/teams');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to leave team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;

    try {
      await clientApi.deleteTeam(teamId);
      router.push('/teams');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete team');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading team...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Team not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-600 mt-2">
                Created {new Date(team.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              {userRole === 'OWNER' && (
                <button 
                  onClick={handleDeleteTeam}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete Team
                </button>
              )}
              {userRole !== 'OWNER' && (
                <button 
                  onClick={handleLeaveTeam}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Leave Team
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'members', name: 'Members' },
                { id: 'activity', name: 'Activity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab 
                team={team} 
                userRole={userRole} 
                teamId={teamId}
                onTeamUpdate={loadTeamData}
              />
            )}
            {activeTab === 'members' && (
              <MembersTab 
                members={members} 
                userRole={userRole}
                teamId={teamId}
                currentUserId={currentUserId}
                onMemberUpdate={loadTeamData}
              />
            )}
            {activeTab === 'activity' && (
              <ActivityTab activities={activities} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ 
  team, 
  userRole, 
  teamId,
  onTeamUpdate 
}: { 
  team: Team; 
  userRole: string; 
  teamId: string;
  onTeamUpdate: () => void;
}) {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showTeamSettingsModal, setShowTeamSettingsModal] = useState(false);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Team Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Team Information</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Team Name</dt>
              <dd className="text-sm text-gray-900">{team.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Created</dt>
              <dd className="text-sm text-gray-900">
                {new Date(team.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Your Role</dt>
              <dd className="text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userRole === 'OWNER' 
                    ? 'bg-purple-100 text-purple-800'
                    : userRole === 'ADMIN'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userRole}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
          <div className="space-y-2">
            {(userRole === 'OWNER' || userRole === 'ADMIN') && (
              <button 
                onClick={() => setShowCreateProjectModal(true)}
                className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              >
                Create Project
              </button>
            )}
            <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
              View Projects
            </button>
            {userRole === 'OWNER' && (
              <button 
                onClick={() => setShowTeamSettingsModal(true)}
                className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              >
                Team Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <CreateProjectModal
          teamId={teamId}
          onClose={() => setShowCreateProjectModal(false)}
          onProjectCreated={onTeamUpdate}
        />
      )}

      {/* Team Settings Modal */}
      {showTeamSettingsModal && (
        <TeamSettingsModal 
          team={team}
          onClose={() => setShowTeamSettingsModal(false)}
          onTeamUpdated={onTeamUpdate}
        />
      )}
    </div>
  );
}

function MembersTab({ 
  members, 
  userRole, 
  teamId,
  currentUserId,
  onMemberUpdate 
}: { 
  members: TeamMember[]; 
  userRole: string;
  teamId: string;
  currentUserId: string;
  onMemberUpdate: () => void;
}) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const canManageMembers = userRole === 'OWNER' || userRole === 'ADMIN';

  const handleKickMember = async (member: TeamMember) => {
    if (!window.confirm(`Are you sure you want to remove ${member.userId.name} from the team?`)) return;

    try {
      await clientApi.kickMember(teamId, member.userId._id);
      onMemberUpdate();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleChangeRole = async (member: TeamMember, newRole: string) => {
    try {
      await clientApi.changeRole(teamId, {
        userId: member.userId._id,
        newRole: newRole as any,
      });
      onMemberUpdate();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to change role');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
        {canManageMembers && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
          >
            Invite Member
          </button>
        )}
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                {member.userId.profileImage ? (
                  <img 
                    src={member.userId.profileImage} 
                    alt={member.userId.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600 font-medium">
                    {member.userId.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{member.userId.name}</h4>
                <p className="text-sm text-gray-600">{member.userId.email}</p>
                <p className="text-xs text-gray-500">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 text-xs rounded-full ${
                member.role === 'OWNER' 
                  ? 'bg-purple-100 text-purple-800'
                  : member.role === 'ADMIN'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {member.role}
              </span>
              
              {canManageMembers && member.role !== 'OWNER' && member.userId._id !== currentUserId && (
                <div className="flex space-x-2">
                  {userRole === 'OWNER' && (
                    <select 
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      value={member.role}
                      onChange={(e) => handleChangeRole(member, e.target.value)}
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  )}
                  <button
                    onClick={() => handleKickMember(member)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showInviteModal && (
        <InviteMemberModal 
          teamId={teamId}
          onClose={() => setShowInviteModal(false)}
          onInviteSent={onMemberUpdate}
        />
      )}
    </div>
  );
}

function ActivityTab({ activities }: { activities: TeamActivity[] }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity._id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 text-sm">⚡</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-900">{activity.description}</p>
              <p className="text-sm text-gray-600 mt-1">
                By {activity.performedBy.name} • {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No activity yet
          </div>
        )}
      </div>
    </div>
  );
}

function InviteMemberModal({ 
  teamId, 
  onClose, 
  onInviteSent 
}: { 
  teamId: string; 
  onClose: () => void; 
  onInviteSent: () => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await clientApi.inviteMember(teamId, { email: email.trim(), role });
      setSuccess(`Invitation sent to ${email.trim()}! They will receive an email with instructions.`);
      setEmail(''); // Clear form
      onInviteSent();
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Invite Member</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter email address"
              required
              disabled={loading || !!success}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading || !!success}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  An invitation email will be sent with a link to join the team. The invitation expires in 7 days.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              disabled={loading}
            >
              {success ? 'Close' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim() || !!success}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : success ? 'Sent!' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function CreateProjectModal({
  teamId,
  onClose,
  onProjectCreated
}: {
  teamId: string;
  onClose: () => void;
  onProjectCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      // This would call a projects API when implemented
      // For now, we'll just show a success message
      console.log('Creating project:', { name, description, teamId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Project created successfully! (Project feature coming soon)');
      onProjectCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Create Project</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter project name"
              required
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">{name.length}/50 characters</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter project description"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/200 characters</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Project management features are coming soon! This will create a project where you can track issues, assign tasks, and collaborate with your team.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TeamSettingsModal({
  team,
  onClose,
  onTeamUpdated
}: {
  team: Team;
  onClose: () => void;
  onTeamUpdated: () => void;
}) {
  const [name, setName] = useState(team.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      await clientApi.updateTeam(team._id, { name: name.trim() });
      onTeamUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update team');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm(
      `Are you absolutely sure you want to delete "${team.name}"? This action cannot be undone and will permanently delete the team and all its data.`
    )) return;

    try {
      await clientApi.deleteTeam(team._id);
      onClose();
      // Navigation will be handled by the parent component
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete team');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Team Settings</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team name"
              required
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">{name.length}/50 characters</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team ID
            </label>
            <input
              type="text"
              value={team._id}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm font-mono"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">This is your team's unique identifier</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created Date
            </label>
            <input
              type="text"
              value={new Date(team.createdAt).toLocaleDateString()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              readOnly
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium text-red-700 mb-3">Danger Zone</h3>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-red-800">Delete Team</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Once you delete a team, there is no going back. Please be certain.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteTeam}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete Team
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || name === team.name}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ... Keep the CreateProjectModal and TeamSettingsModal components the same