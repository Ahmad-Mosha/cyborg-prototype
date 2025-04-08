import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  FadeIn,
  FadeInDown 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function CyborgScreen() {
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState('');
  const scrollViewRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'cyborg', 
      text: "Hello, I'm your Cyborg AI Personal Trainer. How can I help you with your fitness journey today?",
      time: '9:41 AM'
    }
  ]);
  
  // Pulse animation for the cyborg brain visualization
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);
  
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: pulseOpacity.value,
    };
  });
  
  const handleSendMessage = () => {
    if (!question.trim()) return;
    
    const newUserMessage = {
      type: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMessage]);
    setQuestion('');
    setIsProcessing(true);
    
    // Simulate AI response
    setTimeout(() => {
      const demoResponses = [
        "Based on your goals, I recommend increasing your protein intake to 1.8g per kg of body weight. This will support your muscle growth objectives.",
        "I've analyzed your workout data. You're making excellent progress on your upper body strength, but your leg workouts could use more intensity. Let's adjust your program.",
        "Your sleep patterns show improvement! Consistent 7+ hour nights are helping your recovery. Keep it up!",
        "I've created a custom HIIT routine for you based on your cardiovascular metrics. It's designed to increase your VO2 max within 4 weeks.",
        "Looking at your nutrition logs, I notice you're consistently under your calorie goals. For muscle gain, try adding these high-protein snacks between meals."
      ];
      
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      const newCyborgMessage = {
        type: 'cyborg',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newCyborgMessage]);
      setIsProcessing(false);
    }, 2000);
  };
  
  React.useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  // Custom message bubble component
  const MessageBubble = ({ message, index }) => {
    const isCyborg = message.type === 'cyborg';
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(400)}
        className={`mb-4 max-w-[85%] ${isCyborg ? 'self-start' : 'self-end'}`}
      >
        <View 
          className={`rounded-2xl p-4 ${
            isCyborg 
              ? 'bg-dark-800 rounded-tl-none' 
              : 'bg-primary rounded-tr-none'
          }`}
        >
          <Text 
            className={isCyborg ? 'text-white' : 'text-dark-900'}
          >
            {message.text}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs mt-1 ml-1">
          {message.time}
        </Text>
      </Animated.View>
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
          <Text className="text-white text-2xl font-bold">Cyborg AI</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center">
            <Ionicons name="ellipsis-horizontal" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Cyborg Brain Visualization */}
      <View className="w-full items-center justify-center py-4">
        <View className="relative w-20 h-20 items-center justify-center">
          <Animated.View 
            style={pulseStyle}
            className="absolute w-20 h-20 rounded-full bg-primary opacity-30"
          />
          <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
            <Ionicons name="fitness" size={24} color="#121212" />
          </View>
        </View>
      </View>
      
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} index={index} />
        ))}
        
        {isProcessing && (
          <View className="self-start bg-dark-800 rounded-2xl rounded-tl-none p-4 mb-4">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-primary rounded-full mx-1 animate-pulse" />
              <View className="w-2 h-2 bg-primary rounded-full mx-1 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <View className="w-2 h-2 bg-primary rounded-full mx-1 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Quick Questions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="pb-4"
      >
        {[
          "Today's workout plan?",
          "Nutrition advice",
          "Track my progress",
          "Optimize recovery",
          "Sleep analysis"
        ].map((q, index) => (
          <TouchableOpacity
            key={index}
            className="bg-dark-800 rounded-full px-4 py-2 mr-2"
            onPress={() => {
              setQuestion(q);
            }}
          >
            <Text className="text-white">{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Input Box */}
      <View 
        className="flex-row items-center px-4 py-2 bg-dark-800 border-t border-dark-700"
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
      >
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="mic-outline" size={24} color="#A0A0A0" />
        </TouchableOpacity>
        
        <TextInput
          className="flex-1 bg-dark-700 rounded-full px-4 py-2 mx-2 text-white"
          placeholder="Ask your Cyborg AI trainer..."
          placeholderTextColor="#A0A0A0"
          value={question}
          onChangeText={setQuestion}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        
        <TouchableOpacity 
          className={`w-10 h-10 rounded-full items-center justify-center ${question.trim() ? 'bg-primary' : 'bg-dark-700'}`}
          onPress={handleSendMessage}
          disabled={!question.trim()}
        >
          <Ionicons 
            name="arrow-up" 
            size={20} 
            color={question.trim() ? '#121212' : '#A0A0A0'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
