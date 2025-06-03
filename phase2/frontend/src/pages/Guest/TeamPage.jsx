import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function TeamProfilePage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const tournamentId = params.get('tr_id');
  const teamId = params.get('team_id');
  const teamName = params.get('team_name');
  const matchNo = params.get('match_no');



  const [teamStaff, setTeamStaff] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [teamCaptain, setTeamCaptain] = useState([]);
  
  

  

  useEffect(() => {
    fetch(`http://51.20.127.216:3306/teamStaff/?team_id=${teamId}`)
      .then((res) => res.json())
      .then((data) => setTeamStaff(data))
      .catch((err) => console.error("Error fetching team info:", err));

    
  }, [teamId]);

  useEffect(() => {
    fetch(`http://51.20.127.216:3306/matchCaptain?match_no=${matchNo}&team_id=${teamId}&tr_id=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => setTeamCaptain(data))
      .catch((err) => console.error("Error fetching team info:", err));


  }, [matchNo,teamId,tournamentId]);


  useEffect(() => {
    fetch(`http://51.20.127.216:3306/teamPlayers?team_id=${teamId}`)
      .then((res) => res.json())
      .then((data) => setTeamPlayers(data))
      .catch((err) => console.error("Error fetching team members:", err));

  }, [teamId]);

  const captainResult= teamCaptain;
console.log(captainResult);






 // const getMemberByRole = (role) => members.find((m) => m.role === role);
  //const players = members.filter((m) => m.role === "player");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white">Team Profile</h1>
      </header>

      <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
          {teamName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-white">Staff</h3>

{teamStaff.length > 0 ? (
  <div className="grid grid-cols-2 gap-4 text-white">
    {/* Column Headers */}
    <div className="font-bold border-b pb-2">Name</div>
    <div className="font-bold border-b pb-2">Support Type</div>

    {/* Data Rows */}
    {teamStaff.filter((staff) => staff.support_type !== 'CH').map((staff) => (
        <React.Fragment key={staff.id}>
          <div className="bg-white/10 p-3 rounded">{staff.name}</div>
          <div className="bg-white/10 p-3 rounded">{staff.support_type}</div>
        </React.Fragment>
      ))}
  </div>
) : (
  <p className="text-gray-400">This team does not have a staff.</p>
)}


         
            <p className="text-sm text-gray-200">
              {/* {getMemberByRole("manager")?.name || "Not assigned"} */}
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-1">Coach</h3>
            {teamStaff.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamStaff.filter((coach) => coach.support_type === 'CH').map((coach) => (
        <React.Fragment key={coach.id}>
          <div className="bg-white/10 p-3 rounded">{coach.name}</div>
        </React.Fragment>
      ))}
    </div>
    ) : (
    <p className="text-gray-400">this team does not have coaches.</p>
    )}

            <p className="text-sm text-gray-200">
              {/* {getMemberByRole("coach")?.name || "Not assigned"} */}
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-1">Captain</h3>
            {teamCaptain && teamCaptain.length > 0 ? (
          teamCaptain.map((captain) => (
            <div key={captain.id} className="bg-white/10 p-3 rounded text-white">
            {captain.name}
            </div>
                 ))
                ) : (
            <p className="text-gray-300">No captain assigned</p>
                )}


            <p className="text-sm text-gray-200">
              {/* {getMemberByRole("captain")?.name || "Not assigned"} */}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Players</h2>
        {teamPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamPlayers.map((player) => (
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
