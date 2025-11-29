import { api } from "./api";

class ClientAPI {
  private getHeader = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      console.log("🚀 ~ ClientAPI ~ token:", token);

      if (!token) {
        console.warn("No access token found in localStorage");
        return {
          withCredentials: true,
        };
      }

      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
    }

    return {
      withCredentials: true,
    };
  };

  // Auth methods
  login = (email: string, password: string) => {
    const url = `/auth/login`;
    const data = { email, password };
    return api.post(url, data, this.getHeader());
  };

  signup = (name: string, email: string, password: string) => {
    const url = `/auth/signup`;
    const data = { name, email, password };
    return api.post(url, data);
  };

  getProfile = () => {
    const url = `/auth/profile`;
    return api.get(url, this.getHeader());
  };

  updateProfile = (data: { name: string; profileImage?: string }) => {
    const url = `/auth/profile`;
    return api.put(url, data, this.getHeader());
  };

  changePassword = (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const url = `/auth/change-password`;
    return api.put(url, data, this.getHeader());
  };

  deleteAccount = () => {
    const url = `/auth/account`;
    return api.delete(url, this.getHeader());
  };

  // Forgot password
  forgotPassword = (email: string) => {
    const url = `/auth/forgot-password`;
    const data = { email };
    return api.post(url, data);
  };

  resetPassword = (token: string, data: { newPassword: string; confirmPassword: string }) => {
    const url = `/auth/reset-password?token=${token}`;
    return api.post(url, data);
  };


   // Team methods
   createTeam = (data: { name: string }) => {
    const url = `/teams`;
    return api.post(url, data, this.getHeader());
  };

  getMyTeams = () => {
    const url = `/teams/my-teams`;
    return api.get(url, this.getHeader());
  };

  getTeam = (teamId: string) => {
    const url = `/teams/${teamId}`;
    return api.get(url, this.getHeader());
  };

  updateTeam = (teamId: string, data: { name: string }) => {
    const url = `/teams/${teamId}`;
    return api.put(url, data, this.getHeader());
  };

  deleteTeam = (teamId: string) => {
    const url = `/teams/${teamId}`;
    return api.delete(url, this.getHeader());
  };

  inviteMember = (teamId: string, data: { email: string; role?: string }) => {
    const url = `/teams/${teamId}/invite`;
    return api.post(url, data, this.getHeader());
  };

  getTeamMembers = (teamId: string) => {
    const url = `/teams/${teamId}/members`;
    return api.get(url, this.getHeader());
  };

  kickMember = (teamId: string, userId: string) => {
    const url = `/teams/${teamId}/members/${userId}`;
    return api.delete(url, this.getHeader());
  };

  leaveTeam = (teamId: string) => {
    const url = `/teams/${teamId}/leave`;
    return api.post(url, {}, this.getHeader());
  };

  changeRole = (teamId: string, data: { userId: string; newRole: string }) => {
    const url = `/teams/${teamId}/role`;
    return api.put(url, data, this.getHeader());
  };

  getTeamActivities = (teamId: string, page: number = 1, limit: number = 20) => {
    const url = `/teams/${teamId}/activities?page=${page}&limit=${limit}`;
    return api.get(url, this.getHeader());
  };

  acceptInvite = (token: string) => {
    const url = `/teams/invite/accept?token=${token}`;
    return api.post(url, {}, this.getHeader());
  };
  
}

export const clientApi = new ClientAPI();