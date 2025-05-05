import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TeamProfilePage() {
  const { teamId } = useParams();
  const [teamInfo, setTeamInfo] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:6969/teams/${teamId}`)
      .then((res) => res.json())
      .then((data) => setTeamInfo(data))
      .catch((err) => console.error("Error fetching team info:", err));

    fetch(`http://localhost:6969/teams/${teamId}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Error fetching team members:", err));
  }, [teamId]);

  const getMemberByRole = (role) => members.find((m) => m.role === role);
  const players = members.filter((m) => m.role === "player");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white">Team Profile</h1>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {teamInfo?.team_name || "Teamname"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-5 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-1">Manager</h3>
            <p className="text-sm text-gray-200">
              {getMemberByRole("manager")?.name || "Not assigned"}
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-1">Coach</h3>
            <p className="text-sm text-gray-200">
              {getMemberByRole("coach")?.name || "Not assigned"}
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-1">Captain</h3>
            <p className="text-sm text-gray-200">
              {getMemberByRole("captain")?.name || "Not assigned"}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Players</h2>
        {players.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-white/10 p-4 rounded-xl shadow-sm"
              >
                <p className="font-medium text-white">{player.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No players listed for this team.</p>
        )}
      </section>
    </div>
  );
}
