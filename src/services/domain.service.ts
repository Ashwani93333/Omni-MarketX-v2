import { activityFeed } from "@/mocks/activity";
import {
  leaderboardRows,
  risingTraders,
  trendingTraders,
} from "@/mocks/leaderboard";
import { groups, myGroups, popularGroups } from "@/mocks/groups";
import { notifications } from "@/mocks/notifications";
import {
  comments,
  posts,
  socialUsers,
  stories,
} from "@/mocks/social";
import { mockRequest } from "@/services/client";
import type {
  ActivityPost,
  Comment,
  Group,
  LeaderboardEntry,
  NotificationItem,
  Post,
} from "@/types";

export const activityService = {
  async getActivityFeed(): Promise<ActivityPost[]> {
    return mockRequest(activityFeed, 350);
  },
};

export const socialService = {
  async getPosts(): Promise<Post[]> {
    return mockRequest(posts, 350);
  },
  async getStories() {
    return mockRequest(stories, 200);
  },
  async getComments(postId: string): Promise<Comment[]> {
    void postId;
    return mockRequest(comments, 200);
  },
  async createPost(content: string, poll?: Post["poll"]): Promise<Post> {
    return mockRequest({
      id: `post-${Date.now()}`,
      user: socialUsers[0],
      content,
      time: "now",
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      poll,
    } as Post);
  },
  async getSuggestedTraders() {
    return mockRequest(
      socialUsers.filter((user) => user.id !== socialUsers[0].id),
      200
    );
  },
};

export const groupService = {
  async getGroups(): Promise<Group[]> {
    return mockRequest(groups, 300);
  },
  async getMyGroups(): Promise<Group[]> {
    return mockRequest(myGroups, 250);
  },
  async getPopularGroups(): Promise<Group[]> {
    return mockRequest(popularGroups, 250);
  },
};

export const leaderboardService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return mockRequest(leaderboardRows, 350);
  },
  async getRisingTraders() {
    return mockRequest(risingTraders, 250);
  },
  async getTrendingTraders() {
    return mockRequest(trendingTraders, 250);
  },
};

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    return mockRequest(notifications, 300);
  },
};

export const userService = {
  async getCurrentUser() {
    return mockRequest(
      {
        id: "user-me",
        username: "alexriver",
        displayName: "Alex River",
        email: "alex@omnimarketx.com",
        initials: "AR",
        memberSince: "2026-01-12",
      },
      250
    );
  },
};