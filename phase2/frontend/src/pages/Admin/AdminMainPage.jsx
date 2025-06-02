import React, { useCallback,useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminTournamentPage() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  /*players, setPlayers*/const [ setPlayers] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [matchNo, setMatchNo] = useState("");
  const [matches, setMatches] = useState([]);
  const [teamId, setTeamId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const navigate = useNavigate();

 

  const fetchTournaments = useCallback(async () => {
    fetch("http://localhost:6969/tournament")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((err) => console.error("Error fetching tournaments:", err));
  },[]);

  const fetchMatchesInTournament = useCallback( async() => {
    
    fetch(`http://localhost:6969/Matches?tr_id=${selectedTournament}`)
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Error fetching tournaments:", err));
  },[selectedTournament]);

  const fetchTeams = useCallback(async() => {
    if (!selectedTournament) return;
    fetch(`http://localhost:6969/tournamentTeams?tr_id=${selectedTournament}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeams(data);
        } else {
          console.error("Expected array of teams but got:", data);
          setTeams([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setTeams([]);
      });
  },[selectedTournament]);

  const fetchTeamPlayers = useCallback(() => {
    if (!selectedTeam ) return;
    fetch(
      `http://localhost:6969/teamPlayers?team_id=${selectedTeam}`
    )
      .then((res) => res.json())
      .then((data) => setTeamPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  },[selectedTeam]);





  const fetchPlayers = useCallback( () => {
    if (!selectedTeam || !selectedTournament) return;
    fetch(
      `http://localhost:6969/eligiblePlayers?team_id=${selectedTeam}&tr_id=${selectedTournament}`
    )
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  },[selectedTeam,selectedTournament,setPlayers]);

  const handleAddTournament = () => {
    if (!newTournamentName.trim()) return;
    fetch("http://localhost:6969/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tr_name: newTournamentName }),
    })
      .then(() => {
        setNewTournamentName("");
        fetchTournaments();
      })
      .catch((err) => console.error("Error adding tournament:", err));
  };

  const deleteTournament = (tr_id) => {
    fetch(`http://localhost:6969/deleteTournament/${tr_id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Deletion failed");
        return res.json();
      })
      .then(() => {
        setTournaments((prev) => prev.filter((t) => t.tr_id !== tr_id));
      })
      .catch((err) => {
        console.error("Deletion error:", err);
      });
  };

  const handleAddTeamToTournament = async () => {
    if (!selectedTournament || !teamName) {
      alert("Please select a tournament and enter team name");
      return;
    }
    try {
      
      const teamResponse = await fetch("http://localhost:6969/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_name: teamName,team_id:teamId }),
      });

      if (!teamResponse.ok) {
        const errorData = await teamResponse.json();
        throw new Error(errorData.message || "Failed to create team");
      }

      //const teamData = await teamResponse.json();
      //console.log("Team created:", teamData);
      //const newTeamId = teamData.team_id;

     
      const response = await fetch("http://localhost:6969/tournamentTeams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: teamId,
          tr_id: selectedTournament,
          team_group: "A", 
          match_played: 0,
          won: 0,
          draw: 0,
          lost: 0,
          goal_for: 0,
          goal_against: 0,
          goal_diff: 0,
          points: 0,
          group_position: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to add team to tournament"
        );
      }

      const result = await response.json();
      console.log("Team added to tournament:", result);

      setTeamName("");
      setTeamId("");
      await fetchTeams(); 
      alert("Team added to tournament successfully");
    } catch (error) {
      console.error("Error adding team to tournament:", error);
      alert(
        error.message || "Failed to add team to tournament. Please try again."
      );
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSelectCaptain = () => {
    if (!selectedTeam || !selectedCaptain || !matchNo) {
      alert("Please select a team, captain, and match number");
      return;
    }
    fetch("http://localhost:6969/selectCaptain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        match_no: matchNo,
        team_id: selectedTeam,
        player_id: selectedCaptain,
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Failed to select captain");
        }
        alert("✅ Captain selected successfully");
        setSelectedCaptain(null);
        setMatchNo("");
        fetchTeams();
      })
      .catch((err) => {
        console.error("Error selecting captain:", err);
        alert(`❌ Failed to select captain: ${err.message}`);
      });
  };

  const handleApprovePlayer = () => {
    if (!selectedTeam || !selectedPlayer || !selectedTournament) {
      alert(
        "Please select a team, enter a player name, and select a tournament"
      );
      return;
    }
    fetch("http://localhost:6969/approvePlayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_name: selectedPlayer,
        team_id: selectedTeam,
        tr_id: selectedTournament,
        playerId: playerId
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          throw new Error(
            result.message || result.error || "Failed to approve player"
          );
        }
        alert("✅ Player approved successfully");
        setSelectedPlayer("");
        fetchPlayers();
      })
      .catch((err) => {
        console.error("Error approving player:", err);
        alert(`❌ Failed to approve player: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    if (selectedTournament) {
      fetchTeams();
    }
  }, [selectedTournament,fetchTeams]);


  
  useEffect(() => {
    if (selectedTournament) {
      fetchMatchesInTournament();
    }
  }, [selectedTournament,fetchMatchesInTournament]);


  useEffect(() => {
    if (selectedTeam && selectedTournament) {
      fetchPlayers();
    }
  }, [selectedTeam, selectedTournament,fetchPlayers]);

  useEffect(()=>{
    if (selectedTeam ) {
      fetchTeamPlayers();
    }

  },[selectedTeam,fetchPlayers,fetchTeamPlayers])

  console.log(matchNo)
  console.log(selectedCaptain)
  console.log(selectedTeam)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-4 font-sans">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <img
            src={require("../../img/kfupm-logo.png")}
            alt="KFUPM Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-2xl font-extrabold text-white">
            Tournament Management
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-md transition-colors text-sm"
        >
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white/90">
            Tournament Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-white/90">
                Add New Tournament
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Tournament Name"
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={handleAddTournament}
                  className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg shadow-md transition-colors text-sm"
                >
                  Add Tournament
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-white/90">
                Existing Tournaments
              </h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.tr_id}
                    className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center border border-white/10"
                  >
                    <span className="font-medium text-sm">
                      {tournament.tr_name}
                    </span>
                    <button
                      onClick={() => deleteTournament(tournament.tr_id)}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white/90">
            Team Management
          </h2>
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg rounded-2xl px-6 py-4 border-2 border-blue-700">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <label className="text-white text-lg font-semibold mr-2">
                Select Tournament:
              </label>
              <select
                value={selectedTournament || ""}
                onChange={(e) => {setSelectedTournament(Number(e.target.value));}}
                className="px-4 py-2 rounded-lg bg-white text-blue-800 font-semibold border border-blue-300 focus:border-blue-700 focus:outline-none transition-colors text-base min-w-[200px] shadow-sm"
              >
                <option value="" disabled>
                  Select Tournament
                </option>
                {tournaments.map((t) => (
                  <option key={t.tr_id} value={t.tr_id}>
                    {t.tr_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-white/90">
                Add Team to Tournament
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <input
                  type="text"
                  placeholder="Team ID"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={handleAddTeamToTournament}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-md transition-colors text-sm"
                >
                  Add Team
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-white/90">
                Select Team Captain
              </h3>
              <div className="flex flex-col gap-3">
                <select
                  value={selectedTeam || ""}
                  onChange={(e) => setSelectedTeam(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                >
                  <option value="" disabled>
                    Select Team
                  </option>
                  {teams.map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCaptain || ""}
                  onChange={(e) => setSelectedCaptain(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                >
                  <option value="" disabled>
                    Select Captain
                  </option>
                  {teamPlayers.map((player) => (
                    <option key={player.kfupm_id} value={player.kfupm_id}>
                      {player.name}
                    </option>
                  ))}
                </select>  

                <select
                  value={matchNo || ""}
                  onChange={(e) => setMatchNo(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                >
                  
  <option value="" disabled>
    Select Match
  </option>
  {matches
    .filter((match) => match.team1_id === selectedTeam || match.team2_id === selectedTeam)
    .map((match) => (
      <option key={match.match_no} value={match.match_no}>
        {match.team1_name} vs {match.team2_name}
      </option>
    ))}
</select>  



                {/* <input
                  type="number"
                  placeholder="Match Number"
                  value={matches}
                  onChange={(e) => setMatchNo(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                /> */}
                <button
                  onClick={handleSelectCaptain}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-lg shadow-md transition-colors text-sm"
                >
                  Select Captain
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white/90">
            Player Management
          </h2>
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg w-full max-w-xl">
              <h3 className="text-lg font-semibold mb-3 text-white/90">
                Approve Player to Join Team
              </h3>
              <div className="flex flex-col gap-3">
                <select
                  value={selectedTeam || ""}
                  onChange={(e) => setSelectedTeam(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                >
                  <option value="" disabled>
                    Select Team
                  </option>
                  {teams.map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Player Name"
                  value={selectedPlayer || ""}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <input
                  type="text"
                  placeholder="Player ID"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={handleApprovePlayer}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-md transition-colors text-sm"
                >
                  Approve Player
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
