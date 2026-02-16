import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ArrowLeft, Search, UserPlus, UserMinus } from "lucide-react";

interface ProfileResult {
  user_id: string;
  display_name: string;
  username: string | null;
  avatar_url: string;
}

const Community = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user) loadFollowing();
  }, [user]);

  const loadFollowing = async () => {
    if (!user) return;
    const { data } = await supabase.from("follows").select("following_id").eq("follower_id", user.id);
    if (data) setFollowing(new Set(data.map((f: any) => f.following_id)));
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

  return (
    <div className="min-h-screen gradient-warm">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <h1 className="text-xl font-bold text-foreground">Community</h1>
        </div>

        {/* Search */}
        <motion.div className="relative mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="pl-12 h-12 rounded-2xl bg-card border-border/50"
          />
        </motion.div>

        {/* Results */}
        <div className="space-y-3">
          {searching && <p className="text-center text-muted-foreground py-8">Searching...</p>}
          {!searching && query.trim().length >= 2 && results.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No users found</p>
          )}
          {results.map((profile, i) => (
            <motion.div
              key={profile.user_id}
              className="bg-card rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
              {user && (
                <Button
                  variant={following.has(profile.user_id) ? "outline" : "gradient"}
                  size="sm"
                  onClick={() => handleFollow(profile.user_id)}
                >
                  {following.has(profile.user_id) ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {!query.trim() && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Search for users to follow and connect</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
