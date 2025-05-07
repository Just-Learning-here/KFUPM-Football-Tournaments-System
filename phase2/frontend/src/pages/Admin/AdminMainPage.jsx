import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminTournamentPage() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [matchNo, setMatchNo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchTeams();
    }
  }, [selectedTournament]);

  useEffect(() => {
    if (selectedTeam) {
      fetchPlayers();
    }
  }, [selectedTeam]);

  const fetchTournaments = () => {
    fetch("http://localhost:6969/tournament")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((err) => console.error("Error fetching tournaments:", err));
  };

  const fetchTeams = () => {
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
  };

  const fetchPlayers = () => {
    fetch(`http://localhost:6969/teamPlayers?team_id=${selectedTeam}`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  };

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

  const handleAddTeam = () => {
    if (!teamId || !teamName.trim() || !selectedTournament) {
      console.warn("Team ID, Name, and Tournament ID are required.");
      return;
    }
    fetch("http://localhost:6969/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_id: teamId,
        team_name: teamName,
        tr_id: selectedTournament,
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Failed to add team");
        }
        alert(`✅ Team added: ${teamName}`);
        setTeamId("");
        setTeamName("");
      })
      .catch((err) => {
        console.error("Error adding team:", err);
        alert("❌ Failed to add team. See console.");
      });
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
      alert("Please select a team, player, and tournament");
      return;
    }
    fetch("http://localhost:6969/approvePlayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_id: selectedPlayer,
        team_id: selectedTeam,
        tr_id: selectedTournament,
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Failed to approve player");
        }
        alert("✅ Player approved successfully");
        setSelectedPlayer(null);
        fetchPlayers();
      })
      .catch((err) => {
        console.error("Error approving player:", err);
        alert(`❌ Failed to approve player: ${err.message}`);
      });
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-white/90">
                Add Team to Tournament
              </h3>
              <div className="flex flex-col gap-3">
                <select
                  value={selectedTournament || ""}
                  onChange={(e) =>
                    setSelectedTournament(Number(e.target.value))
                  }
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
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
                <input
                  type="text"
                  placeholder="Team ID"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <input
                  type="text"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={handleAddTeam}
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
                  {players.map((player) => (
                    <option key={player.kfupm_id} value={player.kfupm_id}>
                      {player.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Match Number"
                  value={matchNo}
                  onChange={(e) => setMatchNo(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
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
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
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
              <select
                value={selectedPlayer || ""}
                onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-white w-full border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
              >
                <option value="" disabled>
                  Select Player
                </option>
                {players.map((player) => (
                  <option key={player.kfupm_id} value={player.kfupm_id}>
                    {player.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleApprovePlayer}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-md transition-colors text-sm"
              >
                Approve Player
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
