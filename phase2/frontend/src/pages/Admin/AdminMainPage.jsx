import React, { useEffect, useState } from "react";

export default function AdminTournamentPage() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = () => {
    fetch("http://localhost:6969/tournament")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((err) => console.error("Error fetching tournaments:", err));
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
  // In React component
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
        // Show error message to user
      });
  };

  const handleAddTeam = () => {
    if (!selectedTournament || !teamName.trim()) return;
    fetch(`http://localhost:6969/tournament/${selectedTournament}/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team_name: teamName }),
    })
      .then(() => setTeamName(""))
      .catch((err) => console.error("Error adding team:", err));
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center space-x-3">
          <img
            src={require("../../img/kfupm-logo.png")}
            alt="KFUPM Logo"
            className="w-12 h-12 rounded-full"
          />
          <h1 className="text-3xl font-extrabold text-white">
            Admin - Manage Tournaments
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <section className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Tournament</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tournament Name"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full"
            />
            <button
              onClick={handleAddTournament}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg shadow-md"
            >
              Add Tournament
            </button>
          </div>
        </section>

        <section className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add Team to Tournament</h2>
          <div className="flex flex-col gap-4">
            <select
              value={selectedTournament || ""}
              onChange={(e) => setSelectedTournament(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full"
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
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full"
            />
            <button
              onClick={handleAddTeam}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-md"
            >
              Add Team
            </button>
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Existing Tournaments</h2>
        <ul className="space-y-4">
          {tournaments.map((tournament) => (
            <li
              key={tournament.tr_id}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-lg flex justify-between items-center"
            >
              <span>{tournament.tr_name}</span>
              <button
                onClick={() => deleteTournament(tournament.tr_id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
