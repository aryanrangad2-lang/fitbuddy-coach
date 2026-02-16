import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Edit2, Save, X, Image, Video, Trash2, UserPlus, UserMinus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RankBadge } from "@/components/RankBadge";

const WORKOUTS_STORAGE_KEY = 'fitbuddy_workouts';
const getWorkoutStats = () => {
  try {
    const saved = localStorage.getItem(WORKOUTS_STORAGE_KEY);
    if (saved) {
      const workouts = JSON.parse(saved).map((w: any) => ({ ...w, date: new Date(w.date) }));
      const totalWorkouts = workouts.length;
      const totalMinutes = workouts.reduce((a: number, w: any) => a + (w.duration || 0), 0);
      // simple streak calc
      const today = new Date(); today.setHours(0,0,0,0);
      const days = new Set(workouts.map((w: any) => { const d = new Date(w.date); d.setHours(0,0,0,0); return d.getTime(); }));
      let streak = 0, check = new Date(today);
      if (!days.has(check.getTime())) check.setDate(check.getDate() - 1);
      while (days.has(check.getTime())) { streak++; check.setDate(check.getDate() - 1); }
      return { totalWorkouts, totalMinutes, streak };
    }
  } catch {}
  return { totalWorkouts: 0, totalMinutes: 0, streak: 0 };
};

interface Profile {
  user_id: string;
  display_name: string;
  username: string | null;
  bio: string;
  avatar_url: string;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postMediaRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ display_name: "", username: "", bio: "" });
  const [newPost, setNewPost] = useState("");
  const [postMedia, setPostMedia] = useState<File | null>(null);
  const [postMediaPreview, setPostMediaPreview] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const targetUserId = userId || user?.id;
  const isOwnProfile = targetUserId === user?.id;
  const workoutStats = isOwnProfile ? getWorkoutStats() : { totalWorkouts: 0, totalMinutes: 0, streak: 0 };

  useEffect(() => {
    if (targetUserId) {
      loadProfile();
      loadPosts();
      loadFollowCounts();
      if (!isOwnProfile && user) checkFollowStatus();
    }
  }, [targetUserId, user]);

  const loadProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", targetUserId!).single();
    if (data) {
      setProfile(data as Profile);
      setEditForm({ display_name: data.display_name || "", username: data.username || "", bio: data.bio || "" });
    }
    setLoading(false);
  };

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").eq("user_id", targetUserId!).order("created_at", { ascending: false });
    if (data) setPosts(data as Post[]);
  };

  const loadFollowCounts = async () => {
    const { count: followers } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", targetUserId!);
    const { count: following } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", targetUserId!);
    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  };

  const checkFollowStatus = async () => {
    const { data } = await supabase.from("follows").select("*").eq("follower_id", user!.id).eq("following_id", targetUserId!).maybeSingle();
    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!user) return;
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetUserId!);
      setIsFollowing(false);
      setFollowersCount(c => c - 1);
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: targetUserId! });
      setIsFollowing(true);
      setFollowersCount(c => c + 1);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      display_name: editForm.display_name,
      username: editForm.username || null,
      bio: editForm.bio,
    }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message === 'duplicate key value violates unique constraint "profiles_username_key"' ? "Username already taken" : error.message, variant: "destructive" });
    } else {
      setEditing(false);
      loadProfile();
      toast({ title: "Profile updated! ✨" });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `${user.id}/avatar-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    loadProfile();
    toast({ title: "Avatar updated! 📸" });
  };

  const handlePostMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPostMedia(file);
    setPostMediaPreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async () => {
    if (!user || (!newPost.trim() && !postMedia)) return;
    setPosting(true);
    let mediaUrl: string | null = null;
    let mediaType: string | null = null;

    if (postMedia) {
      const ext = postMedia.name.split('.').pop();
      const path = `${user.id}/post-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, postMedia);
      if (error) { toast({ title: "Upload failed", variant: "destructive" }); setPosting(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      mediaUrl = publicUrl;
      mediaType = postMedia.type.startsWith("video") ? "video" : "image";
    }

    await supabase.from("posts").insert({ user_id: user.id, content: newPost, media_url: mediaUrl, media_type: mediaType });
    setNewPost("");
    setPostMedia(null);
    setPostMediaPreview(null);
    setPosting(false);
    loadPosts();
    toast({ title: "Post shared! 🎉" });
  };

  const handleDeletePost = async (postId: string) => {
    await supabase.from("posts").delete().eq("id", postId);
    loadPosts();
    toast({ title: "Post deleted" });
  };

  if (loading) {
    return <div className="min-h-screen gradient-warm flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!profile) {
    return <div className="min-h-screen gradient-warm flex items-center justify-center"><p className="text-muted-foreground">Profile not found</p></div>;
  }

  return (
    <div className="min-h-screen gradient-warm">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Profile Card */}
        <motion.div className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-xl font-bold gradient-primary text-primary-foreground">
                  {(profile.display_name || "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-primary flex items-center justify-center shadow-soft">
                  <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <Input value={editForm.display_name} onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))} placeholder="Display name" />
                  <Input value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" />
                  <Textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio" rows={2} />
                  <div className="flex gap-2">
                    <Button variant="gradient" size="sm" onClick={handleSaveProfile}><Save className="w-4 h-4 mr-1" />Save</Button>
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-foreground truncate">{profile.display_name || "Unnamed"}</h2>
                      {profile.username && <p className="text-sm text-primary">@{profile.username}</p>}
                    </div>
                    {isOwnProfile && (
                      <RankBadge
                        totalWorkouts={workoutStats.totalWorkouts}
                        totalMinutes={workoutStats.totalMinutes}
                        streak={workoutStats.streak}
                        showProgress={false}
                        size="sm"
                      />
                    )}
                  </div>
                  {profile.bio && <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="text-foreground font-semibold">{followersCount} <span className="text-muted-foreground font-normal">followers</span></span>
                    <span className="text-foreground font-semibold">{followingCount} <span className="text-muted-foreground font-normal">following</span></span>
                    <span className="text-foreground font-semibold">{posts.length} <span className="text-muted-foreground font-normal">posts</span></span>
                  </div>
                </>
              )}
            </div>
            {isOwnProfile && !editing ? (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Edit2 className="w-4 h-4" /></Button>
            ) : !isOwnProfile && user ? (
              <Button variant={isFollowing ? "outline" : "gradient"} size="sm" onClick={handleFollow}>
                {isFollowing ? <><UserMinus className="w-4 h-4 mr-1" />Unfollow</> : <><UserPlus className="w-4 h-4 mr-1" />Follow</>}
              </Button>
            ) : null}
          </div>
        </motion.div>

        {/* Create Post (own profile only) */}
        {isOwnProfile && (
          <motion.div className="bg-card rounded-3xl p-5 shadow-card border border-border/50 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share your workout progress..." rows={2} className="mb-3" />
            <AnimatePresence>
              {postMediaPreview && (
                <motion.div className="relative mb-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  {postMedia?.type.startsWith("video") ? (
                    <video src={postMediaPreview} className="rounded-xl max-h-48 w-full object-cover" controls />
                  ) : (
                    <img src={postMediaPreview} className="rounded-xl max-h-48 w-full object-cover" alt="Preview" />
                  )}
                  <button onClick={() => { setPostMedia(null); setPostMediaPreview(null); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { postMediaRef.current?.setAttribute("accept", "image/*"); postMediaRef.current?.click(); }}>
                  <Image className="w-4 h-4 mr-1" />Photo
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { postMediaRef.current?.setAttribute("accept", "video/*"); postMediaRef.current?.click(); }}>
                  <Video className="w-4 h-4 mr-1" />Video
                </Button>
              </div>
              <Button variant="gradient" size="sm" onClick={handleCreatePost} disabled={posting || (!newPost.trim() && !postMedia)}>
                {posting ? "Posting..." : "Post"}
              </Button>
            </div>
            <input ref={postMediaRef} type="file" className="hidden" onChange={handlePostMediaSelect} />
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div key={post.id} className="bg-card rounded-2xl p-5 shadow-card border border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-xs gradient-primary text-primary-foreground">{(profile.display_name || "?")[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{profile.display_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {isOwnProfile && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeletePost(post.id)}>
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
              {post.content && <p className="text-sm text-foreground mb-3">{post.content}</p>}
              {post.media_url && (
                post.media_type === "video" ? (
                  <video src={post.media_url} className="rounded-xl w-full max-h-96 object-cover" controls />
                ) : (
                  <img src={post.media_url} className="rounded-xl w-full max-h-96 object-cover" alt="Post" />
                )
              )}
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
