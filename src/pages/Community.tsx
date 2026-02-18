import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, UserPlus, UserMinus,
  Heart, MessageCircle, Send, ChevronDown, ChevronUp, Trash2, Image, MessageSquare
} from "lucide-react";
import { format } from "date-fns";

interface ProfileResult {
  user_id: string;
  display_name: string;
  username: string | null;
  avatar_url: string;
}

interface Post {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  profile?: ProfileResult;
  likeCount?: number;
  commentCount?: number;
  hasLiked?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: ProfileResult;
}

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'search'>('feed');
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (user) loadFollowing();
    loadPosts();
  }, [user]);

  const loadFollowing = async () => {
    if (!user) return;
    const { data } = await supabase.from("follows").select("following_id").eq("follower_id", user.id);
    if (data) setFollowing(new Set(data.map((f: any) => f.following_id)));
  };

  const loadPosts = async () => {
    setLoadingPosts(true);
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!postsData) { setLoadingPosts(false); return; }

    // Fetch profiles, likes, comments in parallel
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const postIds = postsData.map(p => p.id);

    const [profilesRes, likesRes, commentsRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, username, avatar_url").in("user_id", userIds),
      supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds),
      supabase.from("post_comments").select("post_id").in("post_id", postIds),
    ]);

    const profileMap = new Map((profilesRes.data || []).map((p: any) => [p.user_id, p]));
    const likesMap = new Map<string, string[]>();
    (likesRes.data || []).forEach((l: any) => {
      if (!likesMap.has(l.post_id)) likesMap.set(l.post_id, []);
      likesMap.get(l.post_id)!.push(l.user_id);
    });
    const commentCountMap = new Map<string, number>();
    (commentsRes.data || []).forEach((c: any) => {
      commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) || 0) + 1);
    });

    const enriched: Post[] = postsData.map(p => ({
      ...p,
      profile: profileMap.get(p.user_id) as ProfileResult | undefined,
      likeCount: (likesMap.get(p.id) || []).length,
      commentCount: commentCountMap.get(p.id) || 0,
      hasLiked: user ? (likesMap.get(p.id) || []).includes(user.id) : false,
    }));

    setPosts(enriched);
    setLoadingPosts(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) searchUsers();
      else setResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const searchUsers = async () => {
    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, username, avatar_url")
      .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
      .neq("user_id", user?.id || "")
      .limit(20);
    if (data) setResults(data as ProfileResult[]);
    setSearching(false);
  };

  const handleFollow = async (targetId: string) => {
    if (!user) return;
    if (following.has(targetId)) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetId);
      setFollowing(prev => { const s = new Set(prev); s.delete(targetId); return s; });
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: targetId });
      setFollowing(prev => new Set(prev).add(targetId));
    }
  };

  const handleLike = async (postId: string, hasLiked: boolean) => {
    if (!user) return;
    if (hasLiked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      hasLiked: !hasLiked,
      likeCount: (p.likeCount || 0) + (hasLiked ? -1 : 1),
    } : p));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <h1 className="text-xl font-bold text-foreground flex-1">Community</h1>
          {user && (
            <Link to="/messages">
              <Button variant="outline" size="sm" className="gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Messages
              </Button>
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-muted rounded-2xl p-1">
          {(['feed', 'search'] as const).map(tab => (
            <button
              key={tab}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'feed' ? '📰 Feed' : '🔍 Find Users'}
            </button>
          ))}
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {loadingPosts && (
              <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
            )}
            {!loadingPosts && posts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No posts yet. Share your first workout!</p>
              </div>
            )}
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onLike={() => handleLike(post.id, !!post.hasLiked)}
                onDelete={() => { setPosts(prev => prev.filter(p => p.id !== post.id)); }}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <motion.div className="relative mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or username..."
                className="pl-12 h-12 rounded-2xl bg-card border-border/50"
              />
            </motion.div>

            <div className="space-y-3">
              {searching && <p className="text-center text-muted-foreground py-8">Searching...</p>}
              {!searching && query.trim().length >= 2 && results.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              )}
              {results.map((profile, i) => (
                <motion.div
                  key={profile.user_id}
                  className="bg-card rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/profile/${profile.user_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                        {(profile.display_name || "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{profile.display_name || "Unnamed"}</p>
                      {profile.username && <p className="text-sm text-primary">@{profile.username}</p>}
                    </div>
                  </Link>
                  <div className="flex gap-2">
                    <Link to={`/messages?user=${profile.user_id}`}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </Link>
                    {user && (
                      <Button
                        variant={following.has(profile.user_id) ? "outline" : "gradient"}
                        size="sm"
                        onClick={() => handleFollow(profile.user_id)}
                      >
                        {following.has(profile.user_id) ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
              {!query.trim() && (
                <div className="text-center py-16 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Search for users to follow and connect</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Post Card Component with Likes & Comments
const PostCard = ({
  post, currentUserId, onLike, onDelete, index
}: {
  post: Post;
  currentUserId?: string;
  onLike: () => void;
  onDelete: () => void;
  index: number;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(post.hasLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const { user } = useAuth();

  const loadComments = async () => {
    setLoadingComments(true);
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });

    if (!data) { setLoadingComments(false); return; }

    const userIds = [...new Set(data.map((c: any) => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url, username")
      .in("user_id", userIds);

    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
    setComments(data.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) })));
    setLoadingComments(false);
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike();
  };

  const submitComment = async () => {
    if (!user || !newComment.trim() || submittingComment) return;
    setSubmittingComment(true);
    const content = newComment.trim();
    setNewComment('');
    const { data, error } = await supabase
      .from("post_comments")
      .insert({ post_id: post.id, user_id: user.id, content })
      .select()
      .single();
    if (!error && data) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, username")
        .eq("user_id", user.id)
        .single();
      setComments(prev => [...prev, { ...(data as any), profile }]);
      setCommentCount(prev => prev + 1);
    }
    setSubmittingComment(false);
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from("post_comments").delete().eq("id", commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
    setCommentCount(prev => prev - 1);
  };

  const deletePost = async () => {
    await supabase.from("posts").delete().eq("id", post.id);
    onDelete();
  };

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Post Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <Link to={`/profile/${post.user_id}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.profile?.avatar_url} />
            <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-sm">
              {(post.profile?.display_name || '?')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link to={`/profile/${post.user_id}`}>
            <p className="font-semibold text-foreground text-sm">{post.profile?.display_name || 'User'}</p>
          </Link>
          <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), 'MMM d, HH:mm')}</p>
        </div>
        {currentUserId === post.user_id && (
          <button onClick={deletePost} className="text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 text-foreground text-sm leading-relaxed">{post.content}</p>
      )}

      {/* Media */}
      {post.media_url && post.media_type === 'image' && (
        <img src={post.media_url} alt="Post" className="w-full max-h-80 object-cover" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border/50">
        <motion.button
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'
          }`}
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          disabled={!currentUserId}
        >
          <motion.div
            animate={liked ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
          </motion.div>
          <span>{likeCount}</span>
        </motion.button>

        <button
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleComments}
        >
          <MessageCircle className="w-5 h-5" />
          <span>{commentCount}</span>
          {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/50 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {loadingComments && <p className="text-xs text-muted-foreground">Loading comments...</p>}

              {comments.map(comment => (
                <motion.div
                  key={comment.id}
                  className="flex gap-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                    <AvatarImage src={comment.profile?.avatar_url} />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">
                      {(comment.profile?.display_name || '?')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted rounded-xl px-3 py-2">
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-foreground">{comment.profile?.display_name || 'User'}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(comment.created_at), 'HH:mm')}</span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                  {currentUserId === comment.user_id && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-muted-foreground hover:text-destructive self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              ))}

              {!loadingComments && comments.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Be the first!</p>
              )}

              {/* Comment Input */}
              {currentUserId && (
                <form
                  className="flex gap-2 pt-1"
                  onSubmit={e => { e.preventDefault(); submitComment(); }}
                >
                  <Input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 h-9 rounded-xl bg-muted border-0 text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 rounded-xl shrink-0"
                    disabled={!newComment.trim() || submittingComment}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Community;
