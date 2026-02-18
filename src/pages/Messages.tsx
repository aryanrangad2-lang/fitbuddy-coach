import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Search, MessageCircle, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  user_id: string;
  display_name: string;
  avatar_url: string;
  username: string | null;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();
    // Check if there's a user to start a conversation with from URL
    const targetUserId = searchParams.get('user');
    if (targetUserId) loadUserAndSelect(targetUserId);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    // Setup realtime subscription
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase
      .channel(`messages-${user.id}-${selectedUser.user_id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === selectedUser.user_id) {
          setMessages(prev => [...prev, msg]);
          markMessagesRead(selectedUser.user_id);
        }
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [user, selectedUser]);

  const loadConversations = async () => {
    if (!user) return;
    // Get all messages involving this user
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!data) return;

    // Get unique conversation partners
    const partnerIds = new Set<string>();
    data.forEach(m => {
      const partner = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      partnerIds.add(partner);
    });

    if (partnerIds.size === 0) return;

    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url, username')
      .in('user_id', Array.from(partnerIds));

    if (!profiles) return;

    const convs: Conversation[] = profiles.map(p => {
      const msgs = data.filter(m =>
        (m.sender_id === p.user_id && m.receiver_id === user.id) ||
        (m.receiver_id === p.user_id && m.sender_id === user.id)
      );
      const last = msgs[0];
      const unread = msgs.filter(m => m.receiver_id === user.id && !m.read).length;
      return {
        user_id: p.user_id,
        display_name: p.display_name || 'User',
        avatar_url: p.avatar_url || '',
        username: p.username,
        lastMessage: last?.content,
        lastTime: last?.created_at,
        unread,
      };
    });

    setConversations(convs);
  };

  const loadUserAndSelect = async (targetId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', targetId).single();
    if (data) {
      const conv: Conversation = {
        user_id: data.user_id,
        display_name: data.display_name || 'User',
        avatar_url: data.avatar_url || '',
        username: data.username,
      };
      setSelectedUser(conv);
      loadMessages(targetId);
    }
  };

  const loadMessages = async (partnerId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
    markMessagesRead(partnerId);
  };

  const markMessagesRead = async (partnerId: string) => {
    if (!user) return;
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', partnerId)
      .eq('receiver_id', user.id)
      .eq('read', false);
  };

  const sendMessage = async () => {
    if (!user || !selectedUser || !newMessage.trim() || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    const msg: Omit<Message, 'id' | 'created_at'> = {
      sender_id: user.id,
      receiver_id: selectedUser.user_id,
      content,
      read: false,
    };

    const { data, error } = await supabase.from('messages').insert(msg).select().single();
    if (!error && data) {
      setMessages(prev => [...prev, data as Message]);
      loadConversations();
    }
    setSending(false);
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url, username')
      .or(`display_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
      .neq('user_id', user?.id || '')
      .limit(10);
    if (data) setSearchResults(data.map(p => ({ user_id: p.user_id, display_name: p.display_name || 'User', avatar_url: p.avatar_url || '', username: p.username })));
    setSearching(false);
  };

  useEffect(() => {
    const t = setTimeout(searchUsers, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const selectConversation = (conv: Conversation) => {
    setSelectedUser(conv);
    setSearchQuery('');
    setSearchResults([]);
    loadMessages(conv.user_id);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">Sign in to access messages</p>
          <Link to="/auth"><Button>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-3 shrink-0">
        <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <h1 className="text-xl font-bold text-foreground flex-1">Messages</h1>
        {selectedUser && (
          <motion.button
            onClick={() => { setSelectedUser(null); setMessages([]); }}
            className="text-sm text-muted-foreground hover:text-foreground"
            whileHover={{ scale: 1.05 }}
          >
            All Chats
          </motion.button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Conversation List */}
        <AnimatePresence mode="wait">
          {!selectedUser && (
            <motion.div
              className="w-full md:w-80 flex flex-col border-r border-border"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              {/* Search */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="pl-9 h-9 rounded-xl bg-muted border-0"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground px-2 mb-1">Search Results</p>
                    {searchResults.map(u => (
                      <motion.button
                        key={u.user_id}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                        onClick={() => selectConversation(u)}
                        whileHover={{ x: 2 }}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={u.avatar_url} />
                          <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-bold">
                            {(u.display_name || '?')[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-foreground text-sm">{u.display_name}</p>
                          {u.username && <p className="text-xs text-primary">@{u.username}</p>}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Conversations */}
                {conversations.length > 0 ? (
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground px-2 mb-1">Recent</p>
                    {conversations.map((conv, i) => (
                      <motion.button
                        key={conv.user_id}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors relative"
                        onClick={() => selectConversation(conv)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 2 }}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={conv.avatar_url} />
                            <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                              {(conv.display_name || '?')[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {(conv.unread || 0) > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-bold">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="font-semibold text-foreground text-sm truncate">{conv.display_name}</p>
                            {conv.lastTime && (
                              <p className="text-xs text-muted-foreground shrink-0 ml-1">
                                {format(new Date(conv.lastTime), 'HH:mm')}
                              </p>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : !searching && !searchQuery && (
                  <div className="text-center py-16 text-muted-foreground px-4">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs mt-1">Search for users to start chatting</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Chat Thread */}
        {selectedUser ? (
          <motion.div
            className="flex-1 flex flex-col"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 shrink-0">
              <button
                className="md:hidden"
                onClick={() => { setSelectedUser(null); setMessages([]); }}
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <Link to={`/profile/${selectedUser.user_id}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                    {(selectedUser.display_name || '?')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <p className="font-semibold text-foreground">{selectedUser.display_name}</p>
                {selectedUser.username && <p className="text-xs text-primary">@{selectedUser.username}</p>}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => {
                  const isOwn = msg.sender_id === user.id;
                  return (
                    <motion.div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwn
                              ? 'rounded-br-sm text-primary-foreground'
                              : 'bg-muted text-foreground rounded-bl-sm'
                          }`}
                          style={isOwn ? { background: 'linear-gradient(135deg, hsl(150 80% 40%), hsl(170 75% 35%))' } : {}}
                        >
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(msg.created_at), 'HH:mm')}
                          </p>
                          {isOwn && (
                            msg.read
                              ? <CheckCheck className="w-3 h-3 text-primary" />
                              : <Check className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border shrink-0">
              <form
                className="flex gap-2"
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              >
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl bg-muted border-0 h-11"
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-11 w-11 rounded-xl shrink-0"
                    style={{ background: 'linear-gradient(135deg, hsl(150 80% 40%), hsl(170 75% 35%))' }}
                    disabled={!newMessage.trim() || sending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground flex-col gap-3">
            <MessageCircle className="w-16 h-16 opacity-20" />
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
