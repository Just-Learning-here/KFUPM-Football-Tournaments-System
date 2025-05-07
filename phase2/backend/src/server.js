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
  insertTeamById
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

app.post('/team', async (req, res) => {
  const { tr_id,  team_id,team_name } = req.body;

  if (!team_id || !team_name || !tr_id ) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const result = await insertTeamById(team_id, team_name, tr_id);
    console.log(result)

    if (result.success) {
      res.status(201).json({ success: true, message: 'Team inserted', team_id: result.team_id });
    } else {
      res.status(409).json({ success: false, message: result.message || result.error });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
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

app.listen(PORT, () => {
  console.log(`Server has Start on port: ${PORT}`);
});
