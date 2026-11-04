import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Shield, Check, X, Crown, LogOut, Calendar, Search, MapPin } from "lucide-react";
import { inviteUser, removeMember, leaveTeam, requestToJoin, handleRequest } from "@/app/actions/teams";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";
import { DeleteTeamButton } from "@/components/public/DeleteTeamButton";
import { TeamSettingsForm } from "@/components/public/TeamSettingsForm";
import { SquadList } from "@/components/public/SquadList";
import { CreateTeamForm } from "@/components/public/CreateTeamForm";

export const metadata = { title: "Teams Hub" };
export const instant = false;

async function TeamsContent({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await connection();
  const params = await searchParams;
  const activeTab = params.tab || "my-team";
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myMembership } = await supabase.from("team_members").select("team_id, role, teams(*)").eq("user_id", user.id).maybeSingle();
  const myTeam = myMembership?.teams as any;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Teams Hub</h1>
        <p className="text-slate-500 mt-1">Manage your team, discover squads, and find players.</p>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto">
        <Link href="/dashboard/teams?tab=my-team" className={`px-6 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'my-team' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Users className="w-4 h-4 inline mr-2" /> {myTeam ? "My Team" : "Create Team"}
        </Link>
        <Link href="/dashboard/teams?tab=discover" className={`px-6 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'discover' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Search className="w-4 h-4 inline mr-2" /> Discover Teams
        </Link>
        <Link href="/dashboard/teams?tab=finder" className={`px-6 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'finder' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Users className="w-4 h-4 inline mr-2" /> Find Players
        </Link>
      </div>

      <div className="mt-6">
        {activeTab === 'my-team' && (myTeam ? <MyTeamDashboard team={myTeam} membership={myMembership} userId={user.id} /> : <CreateTeamForm />)}
        {activeTab === 'discover' && <DiscoverTeamsList userId={user.id} myMembership={myMembership} />}
        {activeTab === 'finder' && <FindPlayersList myTeamId={myTeam?.id} isLeader={myMembership?.role === 'leader'} />}
      </div>
    </div>
  );
}

async function MyTeamDashboard({ team, membership, userId }: { team: any, membership: any, userId: string }) {
  const supabase = await createClient();
  
  const { data: members } = await supabase.from("team_members").select("user_id, role, profiles(full_name, username, avatar_url)").eq("team_id", team.id);
  
  let pendingRequests: any[] = [];
  if (membership.role === "leader") {
    const { data: reqs } = await supabase.from("team_requests").select("id, user_id, profiles(full_name, username)").eq("team_id", team.id).eq("status", "pending");
    pendingRequests = reqs || [];
  }

  const { data: squads } = await supabase.from("team_events").select("id, name, event_id, member_ids, events(title, start_date, slug)").eq("team_id", team.id);
  const { data: availableEvents } = await supabase.from("events").select("id, title").neq("status", "draft").gte("start_date", new Date().toISOString()).order("start_date", { ascending: true });

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {team.logo_url ? <img src={team.logo_url} className="w-full h-full object-cover" /> : <Shield className="w-10 h-10 text-slate-300" />}
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-slate-900 mb-1">{team.name}</h2>
          <p className="text-sm font-medium text-slate-500 mb-1">Team ID: <span className="text-orange-500 font-bold">@{team.slug}</span></p>
          <p className="text-slate-500">{team.description}</p>
        </div>
      </div>

      {/* Leader: Team Settings + Delete */}
      {membership.role === "leader" && (
        <>
          <TeamSettingsForm team={team} userId={userId} />
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-end">
            <DeleteTeamButton teamId={team.id} teamName={team.name} />
          </div>
        </>
      )}

      {/* Leader: Join Requests */}
      {membership.role === "leader" && pendingRequests.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-800"><Shield className="w-5 h-5" /> Join Requests</h2>
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-white border border-orange-100 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <UserAvatar name={(req.profiles as any)?.full_name} size="sm" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{(req.profiles as any)?.full_name}</p>
                    <p className="text-xs text-slate-500">@{(req.profiles as any)?.username}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={async () => { "use server"; await handleRequest(req.id, true); }}><FormSubmitButton iconOnly className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Check className="w-4 h-4" /></FormSubmitButton></form>
                  <form action={async () => { "use server"; await handleRequest(req.id, false); }}><FormSubmitButton iconOnly className="p-2 bg-red-100 text-red-700 rounded-lg"><X className="w-4 h-4" /></FormSubmitButton></form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-orange-500" /> Team Members ({members?.length})</h2>
        <div className="divide-y divide-slate-100">
          {members?.map(m => (
            <div key={m.user_id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar name={(m.profiles as any)?.full_name || "User"} url={(m.profiles as any)?.avatar_url} size="md" />
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">{(m.profiles as any)?.full_name} {m.role === "leader" && <Crown className="w-3.5 h-3.5 text-amber-500" />}</p>
                  <p className="text-xs text-slate-500">@{(m.profiles as any)?.username}</p>
                </div>
              </div>
              {membership.role === "leader" && m.role !== "leader" && (
                <form action={async () => { "use server"; await removeMember(team.id, m.user_id); }}><FormSubmitButton className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded inline-flex items-center gap-1">Remove</FormSubmitButton></form>
              )}
            </div>
          ))}
        </div>
        {membership.role !== "leader" && (
          <div className="mt-6 pt-4 border-t">
            <form action={async () => { "use server"; await leaveTeam(team.id); }}><FormSubmitButton className="flex items-center gap-2 text-sm font-semibold text-red-600"><LogOut className="w-4 h-4" /> Leave Team</FormSubmitButton></form>
          </div>
        )}
      </div>

      {/* Event Squads */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-500" /> Event Squads</h2>
        <SquadList 
          squads={squads || []} 
          members={members || []} 
          availableEvents={availableEvents || []} 
          isLeader={membership.role === "leader"}
          teamId={team.id}
        />
      </div>
    </div>
  );
}

async function DiscoverTeamsList({ userId, myMembership }: { userId: string, myMembership: any }) {
  const supabase = await createClient();
  const { data: teams } = await supabase.from("teams").select("id, name, description, logo_url, slug, team_members(user_id)").eq("looking_for_members", true);

  return (
    <div className="space-y-4">
      {!teams || teams.length === 0 ? <p className="text-slate-500">No teams are currently looking for members.</p> : (
        teams.map(team => {
          const isMyTeam = myMembership?.team_id === team.id;
          return (
            <div key={team.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {team.logo_url ? <img src={team.logo_url} className="w-full h-full object-cover" /> : <Shield className="w-6 h-6 text-slate-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{team.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mb-1">Team ID: <span className="text-orange-500 font-bold">@{team.slug}</span></p>
                  <p className="text-sm text-slate-600 mb-1">{team.description}</p>
                  <p className="text-xs font-semibold text-slate-500"><Users className="w-3.5 h-3.5 inline mr-1" /> {team.team_members?.length} Members</p>
                </div>
              </div>
              {isMyTeam ? <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold">Your Team</span> : (
                <form action={async () => { "use server"; await requestToJoin(team.id); }}>
                  <FormSubmitButton className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold whitespace-nowrap">Request to Join</FormSubmitButton>
                </form>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

async function FindPlayersList({ myTeamId, isLeader }: { myTeamId?: string, isLeader: boolean }) {
  const supabase = await createClient();
  
  const { data: players } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, city, skills")
    .eq("looking_for_team", true)
    .not("id", "in", `(${(await supabase.from("team_members").select("user_id")).data?.map(m => m.user_id).join(",") || "00000000-0000-0000-0000-000000000000"})`);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {!players || players.length === 0 ? <p className="text-slate-500">No players currently looking for a team.</p> : (
        players.map(player => (
          <div key={player.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar name={player.full_name} url={player.avatar_url} size="lg" />
              <div>
                <p className="font-bold text-slate-900">{player.full_name}</p>
                <p className="text-xs text-slate-500">@{player.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3"><MapPin className="w-3 h-3" /> {player.city || "Pakistan"}</div>
            
            {player.skills && player.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {player.skills.slice(0, 3).map((s: string) => <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] rounded">{s}</span>)}
              </div>
            )}

            {isLeader && myTeamId ? (
              <form action={async () => { "use server"; await inviteUser(myTeamId, player.id); }}>
                <FormSubmitButton className="w-full py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 flex items-center justify-center gap-2">Invite to Team</FormSubmitButton>
              </form>
            ) : (
              <button disabled className="w-full py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-bold cursor-not-allowed" title="You must be a team leader to invite">
                Invite to Team
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default async function TeamsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 animate-pulse space-y-6"><div className="h-8 bg-slate-200 w-48 rounded"></div><div className="h-32 bg-slate-200 rounded-xl"></div></div>}>
      <TeamsContent searchParams={searchParams} />
    </Suspense>
  );
}
