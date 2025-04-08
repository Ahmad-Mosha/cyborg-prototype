import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('feed');
  
  // Demo data for community feed
  const posts = [
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://via.placeholder.com/100/121212/BBFD00?text=SJ',
        isVerified: true,
      },
      time: '1h ago',
      content: 'Just smashed my deadlift PR! 💪 The Cyborg workout program is really working for me after just 3 weeks. Anyone else seeing rapid gains?',
      likes: 48,
      comments: 12,
      isLiked: true,
    },
    {
      id: '2',
      user: {
        name: 'Mike Torres',
        avatar: 'https://via.placeholder.com/100/121212/BBFD00?text=MT',
        isVerified: false,
      },
      time: '3h ago',
      content: 'Morning HIIT session complete! Cyborg suggested adding mountain climbers and it destroyed me in the best way 🔥 Anyone have recommendations for post-workout recovery?',
      likes: 32,
      comments: 8,
      isLiked: false,
    },
    {
      id: '3',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://via.placeholder.com/100/121212/BBFD00?text=EW',
        isVerified: true,
      },
      time: '5h ago',
      content: 'Day 30 of the Cyborg Transformation Challenge! Before and after pics - can\'t believe the difference. The diet plan was key for me, especially the high protein breakfast options.',
      likes: 157,
      comments: 43,
      isLiked: true,
      image: 'https://via.placeholder.com/600/121212/BBFD00?text=Before+and+After',
    },
  ];
  
  // Demo data for challenges
  const challenges = [
    {
      id: '1',
      title: '30-Day Arms Challenge',
      participants: 2489,
      daysLeft: 18,
      progress: 40,
      banner: 'https://via.placeholder.com/600/121212/BBFD00?text=Arms+Challenge',
    },
    {
      id: '2',
      title: 'Summer Shred Challenge',
      participants: 5671,
      daysLeft: 45,
      progress: 0,
      status: 'Not Started',
      banner: 'https://via.placeholder.com/600/121212/BBFD00?text=Summer+Shred',
    },
    {
      id: '3',
      title: 'Core Crusher Challenge',
      participants: 1892,
      daysLeft: 0,
      progress: 100,
      status: 'Completed',
      banner: 'https://via.placeholder.com/600/121212/BBFD00?text=Core+Crusher',
    },
  ];
  
  // Demo data for groups
  const groups = [
    {
      id: '1',
      name: 'Morning Workout Crew',
      members: 856,
      posts: 45,
      banner: 'https://via.placeholder.com/600/121212/BBFD00?text=Morning+Crew',
      isJoined: true,
    },
    {
      id: '2',
      name: 'Nutrition & Meal Prep',
      members: 1243,
      posts: 78,
      banner: 'https://via.placeholder.com/600/121212/BBFD00?text=Nutrition',
      isJoined: false,
    },
    {
      id: '3',
      name: 'Marathon Training',
      members: 572,
      posts: 32,
      banner: 'https://via.placeholder.com/600/121212/BBFD00?text=Marathon',
      isJoined: true,
    },
  ];
  
  // Post component
  const Post = ({ post }) => {
    const [liked, setLiked] = useState(post.isLiked);
    const [likes, setLikes] = useState(post.likes);
    
    const handleLike = () => {
      if (liked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setLiked(!liked);
    };
    
    return (
      <Animated.View 
        entering={FadeInDown.delay(200).duration(500)}
        className="bg-dark-800 rounded-3xl mb-4 p-4 border border-dark-700"
      >
        {/* Post header */}
        <View className="flex-row items-center mb-3">
          <Image 
            source={{ uri: post.user.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <View className="flex-1 ml-3">
            <View className="flex-row items-center">
              <Text className="text-white font-bold">{post.user.name}</Text>
              {post.user.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#BBFD00" className="ml-1" />
              )}
            </View>
            <Text className="text-gray-400 text-xs">{post.time}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Post content */}
        <Text className="text-white mb-3">{post.content}</Text>
        
        {/* Post image if any */}
        {post.image && (
          <Image 
            source={{ uri: post.image }}
            className="w-full h-40 rounded-2xl mb-3"
            resizeMode="cover"
          />
        )}
        
        {/* Post actions */}
        <View className="flex-row items-center justify-between pt-2 border-t border-dark-700">
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={handleLike}
          >
            <Ionicons 
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color={liked ? "#F44336" : "white"} 
            />
            <Text className="text-white ml-1">{likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={20} color="white" />
            <Text className="text-white ml-1">{post.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="share-social-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };
  
  // Challenge card component
  const ChallengeCard = ({ challenge }) => {
    const isCompleted = challenge.progress === 100;
    const isNotStarted = challenge.progress === 0;
    
    return (
      <TouchableOpacity className="bg-dark-800 rounded-3xl mr-4 border border-dark-700 overflow-hidden" style={{ width: 250 }}>
        <Image 
          source={{ uri: challenge.banner }}
          className="w-full h-32"
          resizeMode="cover"
        />
        
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-1">{challenge.title}</Text>
          <Text className="text-gray-400 mb-3">{challenge.participants.toLocaleString()} participants</Text>
          
          {isNotStarted && (
            <TouchableOpacity className="bg-primary py-2 rounded-full">
              <Text className="text-dark-900 font-bold text-center">Join Challenge</Text>
            </TouchableOpacity>
          )}
          
          {!isNotStarted && !isCompleted && (
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-white">{challenge.progress}% Complete</Text>
                <Text className="text-gray-400">{challenge.daysLeft} days left</Text>
              </View>
              
              <View className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-primary" 
                  style={{ width: `${challenge.progress}%` }} 
                />
              </View>
            </View>
          )}
          
          {isCompleted && (
            <View className="bg-dark-700 py-2 rounded-full flex-row justify-center items-center">
              <Ionicons name="checkmark-circle" size={16} color="#BBFD00" />
              <Text className="text-white ml-1 font-bold text-center">Challenge Completed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Group card component
  const GroupCard = ({ group }) => {
    return (
      <TouchableOpacity className="bg-dark-800 rounded-3xl mr-4 border border-dark-700 overflow-hidden" style={{ width: 250 }}>
        <Image 
          source={{ uri: group.banner }}
          className="w-full h-32"
          resizeMode="cover"
        />
        
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-1">{group.name}</Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-400">{group.members} members</Text>
            <Text className="text-gray-400">{group.posts} posts</Text>
          </View>
          
          {group.isJoined ? (
            <TouchableOpacity className="bg-dark-700 py-2 rounded-full">
              <Text className="text-white font-bold text-center">Joined</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="bg-primary py-2 rounded-full">
              <Text className="text-dark-900 font-bold text-center">Join Group</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top }}
        className="px-6 pt-6 pb-4"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Community</Text>
          <View className="flex-row">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center mr-2">
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center">
              <Ionicons name="notifications-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Tabs */}
      <View className="flex-row px-6 mb-5">
        {['feed', 'challenges', 'groups', 'events'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-4 pb-2 ${activeTab === tab ? 'border-b-2 border-primary' : ''}`}
          >
            <Text 
              className={`text-base ${
                activeTab === tab ? 'text-primary font-bold' : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {activeTab === 'feed' && (
          <View className="px-6">
            {/* New post input */}
            <Animated.View 
              entering={FadeInDown.delay(100).duration(500)}
              className="bg-dark-800 rounded-3xl mb-6 p-4 border border-dark-700"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center">
                  <Ionicons name="person" size={18} color="#A0A0A0" />
                </View>
                <TouchableOpacity className="flex-1 bg-dark-700 rounded-full ml-3 px-4 py-3">
                  <Text className="text-gray-400">Share your fitness journey...</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex-row justify-around mt-4">
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="image-outline" size={20} color="#A0A0A0" />
                  <Text className="text-gray-400 ml-1">Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="videocam-outline" size={20} color="#A0A0A0" />
                  <Text className="text-gray-400 ml-1">Video</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="fitness-outline" size={20} color="#A0A0A0" />
                  <Text className="text-gray-400 ml-1">Workout</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            {/* Feed posts */}
            {posts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </View>
        )}
        
        {activeTab === 'challenges' && (
          <View>
            {/* Featured challenge */}
            <Animated.View 
              entering={FadeIn.delay(100).duration(500)}
              className="px-6 mb-6"
            >
              <Text className="text-white text-lg font-bold mb-4">Featured Challenge</Text>
              <TouchableOpacity className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden">
                <Image 
                  source={{ uri: 'https://via.placeholder.com/600/121212/BBFD00?text=90+Day+Transformation' }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                
                <View className="p-5">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold text-xl">90-Day Transformation</Text>
                    <View className="bg-primary/20 px-3 py-1 rounded-full">
                      <Text className="text-primary font-bold">10k+ participants</Text>
                    </View>
                  </View>
                  
                  <Text className="text-gray-400 mb-4">Complete full-body transformation with guided workouts and nutrition plans. Coached by professional athletes.</Text>
                  
                  <TouchableOpacity className="bg-primary py-3 rounded-full">
                    <Text className="text-dark-900 font-bold text-center">Join Challenge</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
            
            {/* Active challenges */}
            <View className="mb-6">
              <View className="px-6 mb-4 flex-row justify-between items-center">
                <Text className="text-white text-lg font-bold">Active Challenges</Text>
                <TouchableOpacity>
                  <Text className="text-primary">View All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
              >
                {challenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        
        {activeTab === 'groups' && (
          <View>
            {/* Search groups */}
            <View className="px-6 mb-6">
              <TextInput
                className="bg-dark-800 text-white px-4 py-3 rounded-full"
                placeholder="Search groups..."
                placeholderTextColor="#A0A0A0"
              />
            </View>
            
            {/* Recommended groups */}
            <View className="mb-6">
              <View className="px-6 mb-4">
                <Text className="text-white text-lg font-bold">Recommended Groups</Text>
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
              >
                {groups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </ScrollView>
            </View>
            
            {/* Your groups */}
            <View>
              <View className="px-6 mb-4">
                <Text className="text-white text-lg font-bold">Your Groups</Text>
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
              >
                {groups.filter(g => g.isJoined).map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        
        {activeTab === 'events' && (
          <View className="px-6 items-center justify-center mt-10">
            <Ionicons name="calendar-outline" size={60} color="#A0A0A0" />
            <Text className="text-white text-lg mt-4 text-center">Events coming soon!</Text>
            <Text className="text-gray-400 text-center mt-2">
              We're working on bringing you fitness events, competitions, and meetups in your area.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
