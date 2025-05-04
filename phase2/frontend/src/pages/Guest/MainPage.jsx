import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";



// let tournaments = [
      

//    { id: 1, name: "Premium League" },
//   { id: 2, name: "Student Tournament" },
//   { id: 3, name: "Annual Tournament" },
// ];

// const teams = {
//   "Team X": {
//     logo: ".//img/ClubIcons/club1.jpeg",
//     info: "College of Computer Science",
//   },
//   "Team Z": { logo: "/logos/cep.png", info: "College of Engineering Physics" },
//   "Team Y": { logo: "/logos/cpg.png", info: "College of Petroleum" },
//   "Team A": { logo: "/logos/kbs.png", info: "KFUPM Business School" },
//   "Team B": { logo: "/logos/cgs.png", info: "College of General Studies" },
//   "Team C": { logo: "/logos/cep2.png", info: "Civil Engineering Program" },
//   "Team D": { logo: "/logos/ccs2.png", info: "Computer Engineering Team" },
// };

// const matchesByTournament = {
//   1: [
//     { id: 1, team1: "Team X", team2: "Team Z" },
//     { id: 2, team1: "Team Y", team2: "Team Z" },
//     { id: 3, team1: "Team X", team2: "Team Y" },
//     { id: 4, team1: "Team A", team2: "Team D" },
//     { id: 5, team1: "Team B", team2: "Team C" },
//     { id: 6, team1: "Team X", team2: "Team B" },
//   ],
//   2: [
//     { id: 7, team1: "Team A", team2: "Team B" },
//     { id: 8, team1: "Team C", team2: "Team D" },
//     { id: 9, team1: "Team Z", team2: "Team Y" },
//     { id: 10, team1: "Team A", team2: "Team C" },
//   ],
//   3: [
//     { id: 11, team1: "Team Y", team2: "Team B" },
//     { id: 12, team1: "Team X", team2: "Team C" },
//     { id: 13, team1: "Team A", team2: "Team Z" },
//     { id: 14, team1: "Team D", team2: "Team Y" },
//   ],
// };

// const goalScorers = [
//   { name: "Player 1", goals: 15 },
//   { name: "Player 2", goals: 13 },
//   { name: "Player 3", goals: 12 },
//   { name: "Player 4", goals: 7 },
// ];

// const redCards = [
//   { name: "Player A", cards: 5 },
//   { name: "Player B", cards: 4 },
//   { name: "Player C", cards: 4 },
//   { name: "Player D", cards: 3 },
//   { name: "Player E", cards: 3 },
//   { name: "Player F", cards: 2 },
//   { name: "Player G", cards: 2 },
//   { name: "Player H", cards: 1 },
//   { name: "Player I", cards: 1 },
//   { name: "Player J", cards: 1 },
// ];

export default function MainPage() {
  const navigate = useNavigate();


  const [fetchedTournaments,setFetchedTournaments] = useState([]);
  
useEffect(() => {
 fetch('http://localhost:6969/tournament') // replace with your actual server URL
   .then(res => res.json())
   .then(fetchedData => {
     setFetchedTournaments(fetchedData); // store in variable
   })
   .catch(err => console.error('Error fetching data:', err));
},[])





  //tournaments=JSON.parse(fetchedTournaments)

  
  //console.log(tournaments[0].tr_id)
  //console.log(fetchedTournaments)


  const [selectedTournament, setSelectedTournament] = useState(null
    //console.log(fetchedTournaments),
  );

    
  useEffect( () => {
    console.log(fetchedTournaments.length)
    if (fetchedTournaments.length > 0) {
       setSelectedTournament(fetchedTournaments[0].tr_id)
    }
    else{
      console.log("There is nothing ")
    }
  },[fetchedTournaments] )


  //console.log(fetchedTournaments)

  const [fetchedMatches,setfetchedMatches] = useState([]);
  
  // useEffect(() => {
  //   fetch(`http://127.0.0.1:6969/Matches?tr_id=${selectedTournament}`) // replace with your actual server URL
  //     .then(res => res.json())
  //     .then(fetchedData => {
  //       setfetchedMatches(fetchedData); // store in variable
  //     })
  //     .catch(err => console.error('Error fetching data:', err));
  //  },[selectedTournament])
  

   useEffect(() => {
    if (!selectedTournament) return; // Wait until a tournament is selected
  
    fetch(`http://127.0.0.1:6969/Matches?tr_id=${selectedTournament}`)
      .then(res => res.json())
      .then(fetchedData => {
        setfetchedMatches(fetchedData);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, [selectedTournament]);


  const [fetchedGoals,setFetchedGoals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:6969/Scorers') // replace with your actual server URL
      .then(res => res.json())
      .then(fetchedData => {
        setFetchedGoals(fetchedData); // store in variable
      })
      .catch(err => console.error('Error fetching data:', err));
   },[])


   const [fetchedRedCards,setfetchedRedCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:6969/redCards') // replace with your actual server URL
      .then(res => res.json())
      .then(fetchedData => {
        setfetchedRedCards(fetchedData); // store in variable
      })
      .catch(err => console.error('Error fetching data:', err));
   },[])
  
  
   

   
  //let matches = fetchedMatches;
  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10 px-2 md:px-4">
        <div className="flex items-center space-x-3">
          <img src="/logos/soccer-ball.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            KFUPM Football Tournaments
          </h1>
        </div>
        <button
          onClick={() => navigate("/admin")}
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-5 py-2 rounded-xl shadow-md"
        >
          Sign in as Admin
        </button>
      </header>

      <section className="mb-8">
        <label
          htmlFor="tournament"
          className="text-lg font-semibold block mb-2"
        >
          Select Tournament:
        </label>
        <select
          id="tournament"
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(Number(e.target.value))}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg w-full md:w-1/3"
        >
          {fetchedTournaments.map((tournament) => (
            <option key={tournament.tr_id} value={tournament.tr_id}>
              {tournament.tr_name} 
            </option>
          ))}
        </select>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fetchedMatches.map((match) => {
              // const team1 = teams[match.team1_name];
              // const team2 = teams[match.team2_name];

              return (
                
                <div
                  key={match.match_no}
                  className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col items-center text-center">
                      {/* <img
                        src={team1.logo}
                        alt={match.team1}
                        className="w-16 h-16 rounded-full mb-2 border border-white/30"
                      /> */}
                      <button>
                      <span className="text-sm font-bold">{match.team1_name}</span>
                      </button>
                      <span className="text-xs text-gray-300">
                        {/* {match.info} */}
                      </span>
                      
                    </div>
                    <span className="text-xl font-bold text-gray-200">{match.goal_score}</span>
                    <div className="flex flex-col items-center text-center">
                      {/* <img
                        src={team2.logo}
                        alt={match.team2}
                        className="w-16 h-16 rounded-full mb-2 border border-white/30"
                      /> */}
                      <button>  
                      <span className="text-sm font-bold">{match.team2_name}</span>
                      </button>


                      <span className="text-xs text-gray-300">
                        {/* { match.play_date } */}
                      </span>
                    </div>
                    
                  </div>
                  <span className="flex flex-col items-center text-center">{match.play_date}</span>
                </div>

                

                
              );
            })}
          </div>
        </div>

        <aside className="col-span-12 md:col-span-4 space-y-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">🎯 Top Scorers</h3>
            <ul className="divide-y divide-white/10 text-sm">
              {fetchedGoals.map((player) => (
                <li key={player.player_id} className="flex justify-between py-2">
                  <span>{player.name}</span>
                  <span className="text-gray-300">{player.Goals} Goals</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">🟥 Red Cards</h3>
            <ul className="divide-y divide-white/10 text-sm">
              {fetchedRedCards.map((player) => (
                <li key={player.player_id} className="flex justify-between py-2">
                  <span>{player.name}</span>
                  <span className="text-gray-300">
                    {player.RedCards} Red Cards
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
