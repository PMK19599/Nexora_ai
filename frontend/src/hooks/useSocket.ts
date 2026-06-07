import { useEffect, useState, useCallback } from 'react';
import { getSocket, joinRoom, leaveRoom, sendMessage, sendTyping } from '@/services/socket';

export function useSocket() { const s = getSocket(); return { socket: s, isConnected: s?.connected ?? false }; }

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const socket = getSocket();
  useEffect(() => {
    if (!socket || !roomId) return;
    joinRoom(roomId);
    const onMsg = (m: any) => setMessages(p => [...p, m]);
    const onType = (d: any) => d.isTyping ? setTypingUsers(p => [...new Set([...p, d.userName])]) : setTypingUsers(p => p.filter(n => n !== d.userName));
    socket.on('chat:message', onMsg); socket.on('chat:typing', onType);
    return () => { leaveRoom(roomId); socket.off('chat:message', onMsg); socket.off('chat:typing', onType); };
  }, [socket, roomId]);
  const send = useCallback((msg: string) => sendMessage(roomId, msg), [roomId]);
  const setTyp = useCallback((t: boolean) => sendTyping(roomId, t), [roomId]);
  return { messages, typingUsers, send, setTyping: setTyp };
}

export function useOnlineUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const socket = getSocket();
  useEffect(() => { if (!socket) return; const h = (u: any[]) => setUsers(u); socket.on('users:online', h); return () => { socket.off('users:online', h); }; }, [socket]);
  return users;
}
