# Community Module Debug Guide

## Issues Fixed

### 1. Comments Error: "response.map is not a function"

**Problem**: The backend was returning comments in a different structure than expected.

**Solution**: Added flexible response handling in `getComments()`:
- Checks if response is directly an array
- Checks if response has `items` property
- Checks if response has `comments` property
- Added debug logging to see actual response structure

### 2. Like State Not Persisting

**Problem**: Backend doesn't return `isLiked` field when fetching posts, so likes disappear on refresh.

**Solution**: Created a local like state manager that:
- Tracks liked posts and comments locally
- Syncs with backend when toggling likes
- Persists like state across refreshes
- Applies like state when loading posts/comments

## How to Test

1. **Check Console Logs**: When you load posts or comments, check the console for debug logs:
   ```
   Posts response sample: { ... }
   Comments response: { ... }
   posts 123 like toggled to: true
   ```

2. **Test Comments**: 
   - Click on a post to open comments
   - Check console for "Comments response:" log
   - If you see the error, the log will show the actual response structure

3. **Test Likes**:
   - Like a post/comment
   - Check console for "like toggled to:" message
   - Refresh the page - likes should persist now

## Debug Steps

### If Comments Still Don't Work:
1. Check the console log for "Comments response:"
2. Share the logged response structure
3. We'll update the response handling accordingly

### If Likes Still Don't Persist:
1. Check if you see "like toggled to:" logs
2. Verify the like state manager is working
3. Check if the backend returns the correct `{ "liked": boolean }` format

## Current Implementation

### Like State Manager
- Local state tracking for likes
- Syncs with backend responses
- Persists across app sessions

### Flexible Comment Loading
- Handles multiple response formats
- Graceful fallback to empty array
- Debug logging for troubleshooting

### Debug Logging
- Posts response structure
- Comments response structure  
- Like toggle results

Try the app now and check the console logs - this will help us identify the exact response structures your backend is using!
