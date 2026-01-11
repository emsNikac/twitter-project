export type PublicProfile = {
  id: string;
  username: string;
  picture: string | null;

  followersCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
};