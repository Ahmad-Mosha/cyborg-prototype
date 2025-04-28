// import React, { useState } from 'react';
// import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
// import { chatService } from '../../api';
// import { ChatConversation } from '../../types/chat/chat';

// /**
//  * A component for testing chat service functionality
//  * Add this component temporarily to any authenticated screen to test
//  */
// const ChatServiceTester: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [conversations, setConversations] = useState<ChatConversation[]>([]);

//   const resetState = () => {
//     setLoading(false);
//     setError(null);
//     setResult(null);
//   };

//   const handleError = (err: any) => {
//     console.error('Test error:', err);
//     setError(err.message || 'An unknown error occurred');
//     setLoading(false);
//   };

//   const createConversation = async () => {
//     resetState();
//     setLoading(true);
//     try {
//       const conversation = await chatService.createConversation();
//       setResult(conversation);
//       setConversationId(conversation.id);
//       setLoading(false);
//     } catch (err: any) {
//       handleError(err);
//     }
//   };

//   const sendMessage = async () => {
//     if (!conversationId) {
//       setError('No conversation ID. Create a conversation first.');
//       return;
//     }

//     resetState();
//     setLoading(true);
//     try {
//       const message = { content: "Help me create a workout plan" };
//       const response = await chatService.sendMessage(conversationId, message);
//       setResult(response);
//       setLoading(false);
//     } catch (err: any) {
//       handleError(err);
//     }
//   };

//   const getConversation = async () => {
//     if (!conversationId) {
//       setError('No conversation ID. Create a conversation first.');
//       return;
//     }

//     resetState();
//     setLoading(true);
//     try {
//       const conversation = await chatService.getConversationById(conversationId);
//       setResult(conversation);
//       setLoading(false);
//     } catch (err: any) {
//       handleError(err);
//     }
//   };

//   const getAllConversations = async () => {
//     resetState();
//     setLoading(true);
//     try {
//       const allConversations = await chatService.getAllConversations();
//       setConversations(allConversations);
//       setResult(allConversations);
//       setLoading(false);
//     } catch (err: any) {
//       handleError(err);
//     }
//   };

//   const deleteConversation = async () => {
//     if (!conversationId) {
//       setError('No conversation ID. Create a conversation first.');
//       return;
//     }

//     resetState();
//     setLoading(true);
//     try {
//       await chatService.deleteConversation(conversationId);
//       setResult({ message: `Conversation ${conversationId} deleted successfully` });
//       setConversationId(null);
//       setLoading(false);
//     } catch (err: any) {
//       handleError(err);
//     }
//   };

//   const renderResultJSON = (data: any) => {
//     return (
//       <ScrollView style={styles.jsonContainer}>
//         <Text style={styles.jsonText}>{JSON.stringify(data, null, 2)}</Text>
//       </ScrollView>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Chat Service Tester</Text>

//       <View style={styles.buttonContainer}>
//         <Button title="Create Conversation" onPress={createConversation} disabled={loading} />
//         <Button title="Send Message" onPress={sendMessage} disabled={loading || !conversationId} />
//         <Button title="Get Conversation" onPress={getConversation} disabled={loading || !conversationId} />
//         <Button title="Get All Conversations" onPress={getAllConversations} disabled={loading} />
//         <Button title="Delete Conversation" onPress={deleteConversation} disabled={loading || !conversationId} />
//       </View>

//       {loading && <Text style={styles.loading}>Loading...</Text>}
//       {error && <Text style={styles.error}>{error}</Text>}

//       {conversationId && (
//         <View style={styles.currentConversation}>
//           <Text style={styles.subTitle}>Current Conversation ID:</Text>
//           <Text style={styles.conversationId}>{conversationId}</Text>
//         </View>
//       )}

//       {result && (
//         <View style={styles.result}>
//           <Text style={styles.subTitle}>Result:</Text>
//           {renderResultJSON(result)}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     margin: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   loading: {
//     marginVertical: 10,
//     color: 'blue',
//   },
//   error: {
//     marginVertical: 10,
//     color: 'red',
//   },
//   currentConversation: {
//     marginVertical: 10,
//     padding: 10,
//     backgroundColor: '#e6f7ff',
//     borderRadius: 5,
//   },
//   conversationId: {
//     fontFamily: 'monospace',
//   },
//   result: {
//     marginTop: 10,
//   },
//   jsonContainer: {
//     maxHeight: 300,
//     backgroundColor: '#eee',
//     padding: 10,
//     borderRadius: 5,
//   },
//   jsonText: {
//     fontFamily: 'monospace',
//     fontSize: 12,
//   },
// });

// export default ChatServiceTester;
