import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  getAllTournament,
  getMatchesInCertainTournament,
  getRedCards,
  getScorers,
  showMatchCaptain,
  showTeamPlayers,
  showTeamStaff,
  deleteTournament,
  addTournament,
  verifyAdminCredentials,
  insertTeamById,
  selectCaptain,
  approvePlayerJoin,
  getTeamsInTournament,
  pool,
  getEligiblePlayersForTeam,
} from "./db.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6969;

app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

//app.use(express.static(path.join(__dirname,"..//phase2")))
console.log("Hello world");

app.get("/tournament", async (req, res) => {
  try {
    const tournaments = await getAllTournament();
    res.json(tournaments);
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    res.status(500).json({ error: "Failed to fetch tournaments" });
  }
});

app.get("/Matches", async (req, res) => {
  const tournamentId = parseInt(req.query.tr_id);

  if (!tournamentId) {
    return res.status(400).json({ error: "Tournament ID is required" });
  }

  try {
    const matches = await getMatchesInCertainTournament(tournamentId);
    const formattedResults = matches.map((row) => ({
      ...row,
      play_date: new Date(row.play_date).toISOString().slice(0, 10),
    }));

    res.json(formattedResults);

    //res.json(matches)
    //console.log(matches)
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/teamStaff", async (req, res) => {
  const teamId = parseInt(req.query.team_id);

  if (!teamId) {
    return res.status(400).json({ error: "Tournament ID is required" });
  }

  try {
    const staff = await showTeamStaff(teamId);
    res.json(staff);
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/teamPlayers", async (req, res) => {
  // const tournamentId = parseInt(req.query.tr_id);
  const teamID = parseInt(req.query.team_id);

  if (!teamID) {
    return res
      .status(400)
      .json({ error: "Tournament ID is required and Team ID is required" });
  }

  try {
    // const players = await showTeamPlayers(tournamentId, teamID);
    const players = await showTeamPlayers(teamID);
    res.json(players);
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/matchCaptain", async (req, res) => {
  const matchNo = parseInt(req.query.match_no);
  const teamId = parseInt(req.query.team_id);
  const tournamentId = parseInt(req.query.tr_id);

  if (!matchNo && !teamId && !tournamentId) {
    return res.status(400).json({ error: "Tournament ID is required" });
  }

  try {
    const players = await showMatchCaptain(matchNo, teamId, tournamentId);
    res.json(players);
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

const scorers = await getScorers();
app.get("/Scorers", (req, res) => {
  res.json(scorers);
  console.log(scorers);
});

app.get("/teams", (req, res) => {
  res.json(scorers);
  console.log(scorers);
});

const redCards = await getRedCards();
app.get("/redCards", (req, res) => {
  res.json(redCards);
  console.log(redCards);
});

app.delete("/deleteTournament/:tr_id", async (req, res) => {
  const { tr_id } = req.params; // Get tournament ID from URL parameters
  console.log("Tournament ID:", tr_id); // Log the tournament ID for debugging

  if (!tr_id) {
    return res.status(400).json({ error: "Tournament ID is required" });
  }

  try {
    // Call the deleteTournament function to delete the tournament from the database
    await deleteTournament(tr_id);
    res
      .status(200)
      .json({ message: `Tournament with ID ${tr_id} deleted successfully.` });
  } catch (err) {
    console.error("Error deleting tournament:", err);
    res
      .status(500)
      .json({ error: "Database error while deleting the tournament" });
  }
});

app.post("/team", async (req, res) => {
  const { team_name } = req.body; // Only require team_name

  if (!team_name) {
    return res
      .status(400)
      .json({ success: false, message: "Missing team name" });
  }

  try {
    // Insert team and get new team_id
    const [result] = await pool.query(
      "INSERT INTO team (team_name) VALUES (?)",
      [team_name]
    );
    const team_id = result.insertId;
    console.log("Team created successfully with ID:", team_id);
    res.status(201).json({
      success: true,
      message: "Team inserted",
      team_id,
    });
  } catch (err) {
    console.error("Error creating team:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

app.post("/tournament", async (req, res) => {
  const { tr_name } = req.body;

  if (!tr_name) {
    return res.status(400).json({ error: "Tournament name is required." });
  }

  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 14); // end_date = 14 days from now

    const tournament = await addTournament(tr_name, today, endDate);
    res.status(201).json(tournament);
  } catch (err) {
    console.error("Error adding tournament:", err);
    res.status(500).json({ error: "Failed to add tournament." });
  }
});

app.post("/auth/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const admin = await verifyAdminCredentials(username, password);

    if (admin) {
      // Authentication successful
      res
        .status(200)
        .json({ success: true, message: "Authentication successful" });
    } else {
      // Authentication failed
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).json({ error: "Server error during authentication" });
  }
});

app.post("/selectCaptain", async (req, res) => {
  const { match_no, team_id, player_id } = req.body;

  if (!match_no || !team_id || !player_id) {
    return res
      .status(400)
      .json({ error: "Match number, team ID, and player ID are required" });
  }

  try {
    await selectCaptain(match_no, team_id, player_id);
    res.json({ success: true, message: "Captain selected successfully" });
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/approvePlayer", async (req, res) => {
  let { player_id, player_name, team_id, tr_id } = req.body;

  if (!player_id && player_name) {
    // Look up player_id by name
    const [rows] = await pool.query(
      "SELECT kfupm_id FROM person WHERE name = ?",
      [player_name]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }
    player_id = rows[0].kfupm_id;
  }

  if (!player_id || !team_id || !tr_id) {
    return res
      .status(400)
      .json({ error: "Player ID, team ID, and tournament ID are required" });
  }

  try {
    await approvePlayerJoin(player_id, team_id, tr_id);
    res.json({ success: true, message: "Player approved successfully" });
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: err.message || "Database query failed" });
  }
});

app.get("/tournamentTeams", async (req, res) => {
  const tr_id = parseInt(req.query.tr_id);

  if (!tr_id) {
    return res.status(400).json({ error: "Tournament ID is required" });
  }

  try {
    const teams = await getTeamsInTournament(tr_id);
    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

app.post("/tournamentTeams", async (req, res) => {
  const {
    team_id,
    tr_id,
    team_group = "A",
    match_played = 0,
    won = 0,
    draw = 0,
    lost = 0,
    goal_for = 0,
    goal_against = 0,
    goal_diff = 0,
    points = 0,
    group_position = 0,
  } = req.body;

  console.log("Adding team to tournament:", { team_id, tr_id, team_group });

  if (!team_id || !tr_id) {
    return res.status(400).json({ message: "team_id and tr_id are required" });
  }

  try {
    // Insert into tournament_team table
    const [result] = await pool.query(
      `INSERT INTO tournament_team (team_id, tr_id, team_group, match_played, won, draw, lost, goal_for, goal_against, goal_diff, points, group_position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        team_id,
        tr_id,
        team_group,
        match_played,
        won,
        draw,
        lost,
        goal_for,
        goal_against,
        goal_diff,
        points,
        group_position,
      ]
    );
    console.log("Team added to tournament successfully");
    res.status(201).json({
      success: true,
      message: "Team added to tournament",
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("Error adding team to tournament:", err);
    if (err.code === "ER_DUP_ENTRY") {
      res
        .status(409)
        .json({ message: "This team is already in the tournament." });
    } else {
      res.status(500).json({
        message: "Failed to add team to tournament.",
        error: err.message,
        code: err.code,
      });
    }
  }
});

app.get("/eligiblePlayers", async (req, res) => {
  const { team_id, tr_id } = req.query;
  if (!team_id || !tr_id) {
    return res.status(400).json({ error: "team_id and tr_id are required" });
  }
  try {
    // Implement this in db.js
    const players = await getEligiblePlayersForTeam(team_id, tr_id);
    res.json(players);
  } catch (err) {
    console.error("Error fetching eligible players:", err);
    res.status(500).json({ error: "Failed to fetch eligible players" });
  }
});

app.listen(PORT, () => {
  console.log(`Server has Start on port: ${PORT}`);
});
