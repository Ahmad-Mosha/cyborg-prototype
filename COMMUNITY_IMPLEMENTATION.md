# Community Module Implementation

This document describes the complete implementation of the community module for the Cyborg Fitness mobile app, including all backend endpoint integrations.

## Overview

The community module allows users to:

- Create posts with different types (general, question, achievement, motivation)
- Like and unlike posts and comments
- Comment on posts and reply to comments
- View paginated posts with filtering options
- Manage their own posts (create, update, delete)

## Backend API Endpoints

### Posts

#### GET /community/posts

- **Purpose**: Get all posts with pagination and filtering
- **Parameters**:
  - `page` (query, number): Page number (default: 1)
  - `limit` (query, number): Items per page (default: 10)
  - `type` (query, string): Filter by post type
  - `status` (query, string): Filter by status (published, draft, archived)
- **Response**: Paginated list of posts with author information

#### POST /community/posts

- **Purpose**: Create a new post
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "type": "general" | "question" | "achievement" | "motivation",
    "tags": ["string"],
    "attachments": ["string"]
  }
  ```

#### GET /community/posts/{id}

- **Purpose**: Get a specific post by ID
- **Parameters**: `id` (path, string): Post ID

#### PUT /community/posts/{id}

- **Purpose**: Update a post
- **Parameters**: `id` (path, string): Post ID
- **Body**: Partial post data

#### DELETE /community/posts/{id}

- **Purpose**: Delete a post
- **Parameters**: `id` (path, string): Post ID

### Comments

#### GET /community/posts/{postId}/comments

- **Purpose**: Get comments for a specific post
- **Parameters**: `postId` (path, string): Post ID

#### POST /community/posts/{postId}/comments

- **Purpose**: Create a comment on a post
- **Parameters**: `postId` (path, string): Post ID
- **Body**:
  ```json
  {
    "content": "string",
    "parentCommentId": "string" // Optional, for replies
  }
  ```

#### DELETE /community/comments/{id}

- **Purpose**: Delete a comment
- **Parameters**: `id` (path, string): Comment ID

### Likes

#### POST /community/{targetType}/{id}/toggle-like

- **Purpose**: Toggle like status for a post or comment
- **Parameters**:
  - `targetType` (path, string): "posts" or "comments"
  - `id` (path, string): Post or comment ID

## Mobile App Implementation

### Core Files

1. **Types** (`/types/community.ts`)

   - `User`: User information interface
   - `Post`: Post data structure
   - `Comment`: Comment data structure with nested replies
   - `CreatePostData`: Interface for creating posts
   - `CreateCommentData`: Interface for creating comments

2. **API Service** (`/api/communityService.ts`)

   - Complete service with all endpoint methods
   - Error handling and type safety
   - Pagination support

3. **Components**:

   - `Post`: Main post component with like/comment functionality
   - `Comment`: Comment component with replies and likes
   - `NewPostInput`: Advanced post creation with type selection
   - `Header`: Community screen header

4. **Screen** (`/app/(main)/community/index.tsx`)
   - Main community feed
   - Infinite scroll pagination
   - Pull-to-refresh
   - Optimistic updates for likes

### Key Features

#### Post Creation

- Modal interface with title, content, type selection
- Support for tags (comma-separated)
- Post type selection (general, question, achievement, motivation)
- Visual type indicators with icons and colors

#### Post Display

- Author information with avatars
- Time formatting (relative time)
- Type badges with appropriate colors
- Like and comment counts
- Optimistic UI updates

#### Comments System

- Nested comments (replies)
- Like functionality for comments
- Reply input with send button
- Real-time comment count updates

#### Interaction Features

- Like/unlike posts and comments
- Comment on posts
- Reply to comments
- Share functionality (placeholder)

### Usage Examples

#### Creating a Post

```typescript
const postData: CreatePostData = {
  title: "My Fitness Journey",
  content: "Started my fitness journey today!",
  type: "general",
  tags: ["fitness", "journey", "motivation"],
  attachments: [],
};

await communityService.createPost(postData);
```

#### Liking a Post

```typescript
await communityService.toggleLike("posts", postId);
```

#### Adding a Comment

```typescript
await communityService.createComment(postId, {
  content: "Great post! Keep it up!",
  parentCommentId: undefined, // Or commentId for replies
});
```

#### Fetching Posts with Pagination

```typescript
const response = await communityService.getPosts({
  page: 1,
  limit: 10,
  status: "published",
  type: "general",
});
```

### Sample Backend Response

#### Posts Response

```json
{
  "items": [
    {
      "id": "77bd9fc0-7c01-47f1-8dd7-299e8291b3c3",
      "createdAt": "2025-05-04T15:55:08.000Z",
      "updatedAt": "2025-05-04T15:55:08.000Z",
      "deletedAt": null,
      "title": "My First Post",
      "content": "This is my first post in the community!",
      "type": "general",
      "status": "published",
      "tags": ["introduction", "fitness"],
      "authorId": "00589d83-320b-4733-80e0-df59c2552360",
      "likesCount": 5,
      "commentsCount": 3,
      "attachments": [],
      "isPinned": false,
      "isLocked": false,
      "author": {
        "id": "00589d83-320b-4733-80e0-df59c2552360",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "profilePictureUrl": null,
        "isActive": true
      }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

## Testing

A comprehensive test screen is provided at `/components/tests/CommunityTestScreen.tsx` to test all endpoints:

1. Get all posts
2. Create posts of different types
3. Toggle likes
4. Create comments
5. Fetch comments

## Installation & Setup

1. Ensure your backend API is running and accessible
2. Update the API base URL in your API configuration
3. Make sure authentication is properly configured
4. Test endpoints using the provided test screen

## Error Handling

- Network errors are caught and displayed to users
- Optimistic updates are reverted on failure
- Loading states are shown during API calls
- User-friendly error messages are displayed

## Performance Optimizations

- Memoized components to prevent unnecessary re-renders
- Optimistic updates for better UX
- Efficient pagination with infinite scroll
- Image caching for user avatars
- Debounced inputs where appropriate

## Future Enhancements

- Image/video attachments
- Push notifications for likes/comments
- User mentions and hashtags
- Advanced search and filtering
- Post bookmarking
- Community groups/categories
- Real-time updates with WebSockets
